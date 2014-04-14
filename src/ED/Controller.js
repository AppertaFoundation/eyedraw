var ED = ED || {};

function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

ED.Controller = function(drawing, toolbar, doodlePopup, container, properties) {

	this.toolbar = toolbar;
	this.properties = properties;
	this.drawing = drawing;
	this.doodlePopup = doodlePopup;
	this.container = container;
	this.input = document.getElementById(this.properties.inputId);

	this.initEvents();
	this.initListeners();
};

ED.Controller.prototype.initEvents = function() {

	// Register controller for notifications
	this.drawing.registerForNotifications(this, 'notificationHandler', [
		'ready',
		'doodlesLoaded',
		'doodleAdded',
		'doodleDeleted',
		'doodleSelected',
		'doodleDeselected',
		'mousedragged',
		'parameterChanged'
	]);

	// Delesect all doodles when clicking anywhere in the document.
	$(document).on('click.eyedraw', this.onDocumentClick.bind(this));
}

ED.Controller.prototype.initListeners = function() {
	// Additional listener controllers
	if (this.properties.listenerArray instanceof Array) {
		this.properties.listenerArray.forEach(function(ListenerArray) {
			new ListenerArray(this.drawing);
		}.bind(this));
	}
};

/**
 * Route a notification to an event handler.
 * @param  {object} notification The notification object.
 */
ED.Controller.prototype.notificationHandler = function(notification) {
	var eventName = notification['eventName'];
	var handlerName = 'on' + ucFirst(eventName);
	if (this[handlerName]) {
		this[handlerName](notification);
	}
};

ED.Controller.prototype.hasInputFieldData = function() {
	return this.input !== null && this.input.value.length > 0;
};

ED.Controller.prototype.saveDrawingToInputField = function() {
	if (this.hasInputFieldData()) {
		this.input.value = this.drawing.save();
	}
};

ED.Controller.prototype.loadInputFieldData = function() {
	// Load drawing data from input element
	this.drawing.loadDoodles(this.properties.inputId);
	// Refresh drawing
	this.drawing.repaint();
};

ED.Controller.prototype.addBindings = function() {
	// Apply bindings
	if (!ED.objectIsEmpty(this.properties.bindingArray)) {
		this.drawing.addBindings(this.properties.bindingArray);
	}
};

ED.Controller.prototype.addDeletedValues = function() {
	// Apply delete values
	if (!ED.objectIsEmpty(this.properties.deleteValueArray)) {
		this.drawing.addDeleteValues(this.properties.deleteValueArray);
	}
};

ED.Controller.prototype.runOnReadyCommands = function() {
	for (var i = 0; i < this.properties.onReadyCommandArray.length; i++) {
		// Get method name
		var method = this.properties.onReadyCommandArray[i][0];
		var argumentArray = this.properties.onReadyCommandArray[i][1];

		// Run method with arguments
		this.drawing[method].apply(this.drawing, argumentArray);
	}
};

ED.Controller.prototype.runOnDoodlesLoadedCommands = function() {
	// Run commands after doodles have successfully loaded
	for (var i = 0; i < this.properties.onDoodlesLoadedCommandArray.length; i++) {
		// Get method name
		var method = this.properties.onDoodlesLoadedCommandArray[i][0];
		var argumentArray = this.properties.onDoodlesLoadedCommandArray[i][1];

		// Run method with arguments
		this.drawing[method].apply(this.drawing, argumentArray);
	}
};

/** EVENT HANDLERS */

ED.Controller.prototype.onDocumentClick = function(e) {
	if($(e.target).parents().index(this.container) === -1){
		this.drawing.deselectDoodles();
	}
};

/**
 * On drawing ready.
 * @param  {object} notification The notification object.
 */
ED.Controller.prototype.onReady = function(notification) {

	// Set scale of drawing
	this.drawing.globalScaleFactor = this.properties.scale;

	// If input exists and contains data, load it into the drawing
	if (this.hasInputFieldData()) {
		this.loadInputFieldData();
	}
	// Otherwise run commands in onReadyCommand array.
	else {
		this.runOnReadyCommands();
	}

	this.addBindings();
	this.addDeletedValues();
	this.saveDrawingToInputField();

	// Optionally make canvas element focused
	if (this.properties.focus) {
		canvas.focus();
	}

	// Mark drawing object as ready
	this.drawing.isReady = true;
};

ED.Controller.prototype.onDoodlesLoaded = function(notification) {

	// Run the onDoodlesLoadedCommands (if any).
	this.runOnDoodlesLoadedCommands();

	// Mark this drawing as ready.
	ED.Checker.eyedrawReady(this.drawing.canvas.id);
};

ED.Controller.prototype.onDoodleAdded = function(notification) {

	this.saveDrawingToInputField();

	// Label doodle needs immediate keyboard input, so give canvas focus.
	// NOTE: labels are deactivated from 1.6.
	var doodle = notification['object'];
	if (typeof(doodle) != 'undefined') {
		if (doodle.className == 'Label') {
			canvas.focus();
		}
	}
};

ED.Controller.prototype.onDoodleDeleted = function(notification) {
	this.saveDrawingToInputField();
};

ED.Controller.prototype.onDoodleSelected = function(notification) {
	// Ensure that selecting a doodle in one drawing de-deselects the others
	for (var idSuffix in this.properties.syncArray) {
		var drawing = window['ed_drawing_edit_' + idSuffix];
		drawing.deselectDoodles();
	}
};

ED.Controller.prototype.onMousedragged = function(notification) {
	this.saveDrawingToInputField();
};

ED.Controller.prototype.onParameterChanged = function(notification) {

	var input = this.input;
	var properties = this.properties;

	// Get master doodle
	var masterDoodle = notification.object.doodle;

	// Iterate through sync array
	for (var idSuffix in properties.syncArray) {
		// Get reference to slave drawing
		var slaveDrawing = window['ed_drawing_edit_' + idSuffix];

		// Iterate through each specified className
		for (var className in properties.syncArray[idSuffix]) {
			// Iterate through slave class names
			for (var slaveClassName in properties.syncArray[idSuffix][className]) {
				// Slave doodle (uses first doodle in the drawing matching the className)
				var slaveDoodle = slaveDrawing.firstDoodleOfClass(slaveClassName);

				// Check that doodles exist, className matches, and sync is allowed
				if (masterDoodle && masterDoodle.className == className && slaveDoodle && slaveDoodle.willSync) {
					// Get array of parameters to sync
					var parameterArray = properties.syncArray[idSuffix][className][slaveClassName]['parameters'];

					if (typeof(parameterArray) != 'undefined') {
						// Iterate through parameters to sync
						for (var i = 0; i < parameterArray.length; i++) {
							// Check that parameter array member matches changed parameter
							if (parameterArray[i] == notification.object.parameter) {
								// Avoid infinite loop by checking values are not equal before setting
								if (masterDoodle[notification.object.parameter] != slaveDoodle[notification.object.parameter]) {
									var increment = notification.object.value - notification.object.oldValue;
									var newValue = slaveDoodle[notification.object.parameter] + increment;

									// Sync slave parameter to value of master
									slaveDoodle.setSimpleParameter(notification.object.parameter, newValue);
									slaveDoodle.updateDependentParameters(notification.object.parameter);

									// Update any bindings associated with the slave doodle
									slaveDrawing.updateBindings(slaveDoodle);
								}
							}
						}
					}
				}
			}
		}

		// Refresh slave drawing
		slaveDrawing.repaint();
	}

	// Save drawing to hidden input
	if (input != null && input.value.length > 0) {
		input.value = this.drawing.save();
	}
};