/**
 * Javascript file containing functions for the EyeDraw widget
 *
 * @link http://www.openeyes.org.uk/
 * @copyright Copyright &copy; 2012 OpenEyes Foundation
 * @license http://www.yiiframework.com/license/
 * Modification date: 17th August 2012
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 0.95
 */

/**
 * Object to track multiple eyedraw canvases on the page
 */
function EyeDrawChecker() {
	// register of all the eyedraws on the page
	this._eyedraws = new Array();
	// register of eyedraws that have been declared ready
	this._eyedrawsReady = new Array();
	this._allReadyListeners = new Array();

	var self = this;

	// quickly establish all the canvases that are eyedraw
	$('canvas').each(function() {
		// either a display or edit canvas
		if ($(this).hasClass('ed_canvas_display') || $(this).hasClass('ed_canvas_edit')) {
			self._eyedraws.push($(this).attr('id'));
		}
	});

	// call to mark an eyedraw as ready
	this.eyedrawReady = function(edId) {
		// only register eyedraws this checker is aware of
		if ($.inArray(edId, this._eyedraws) > -1) {
			// only register it once
			if ($.inArray(edId, this._eyedrawsReady) == -1) {
				this._eyedrawsReady.push(edId);

				if (this.allEyedrawsReady()) {
					// call any registered callback functions
					for (var i = 0; i < this._allReadyListeners.length; i++) {
						this._allReadyListeners[i]();
					}
				}
			}
		}
	};

	// function to determine if all the eyedraws on the page are ready
	this.allEyedrawsReady = function() {
		if (this._eyedraws.length == this._eyedrawsReady.length) {
			return true;
		}
		return false;
	};

	// function to register a callback function to call when all eyedraws are ready
	// if all the eyedraws are ready, then it calls the callback function
	this.registerForReady = function(callback) {
		if (this.allEyedrawsReady()) {
			callback();
		} else {
			this._allReadyListeners.push(callback);
		}
	}
}

// global variable to store the EyeDrawChecker in
var OEEyeDrawChecker;

// global function to initialise and retrieve the global eyedrawchecker object

function getOEEyeDrawChecker() {
	if (!OEEyeDrawChecker) {
		OEEyeDrawChecker = new EyeDrawChecker();
	}
	return OEEyeDrawChecker;
}

// listener function to mark eyedraws as ready in the global checker object

function EyeDrawReadyListener(_drawing) {
	this.drawing = _drawing;
	var side = 'right';
	if (this.drawing.eye) {
		side = 'left';
	}
	this.side = side;

	this.drawing.registerForNotifications(this, 'callBack', ['doodlesLoaded']);

	this.callBack = function(_messageArray) {
		checker = getOEEyeDrawChecker();
		checker.eyedrawReady(this.drawing.canvas.id);
	};
}



ED.Toolbar = (function() {

	/**
	 * Toolbar constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} container The widget container element
	 * @extends {EventEmitter2}
	 */
	function Toolbar(drawing, container) {
		EventEmitter2.call(this);

		this.drawing = drawing;
		this.container = $(container);
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready'
		]);
	}

	Toolbar.prototype = Object.create(EventEmitter2.prototype);

	Toolbar.prototype.notificationHandler = function(notification) {
		if (notification.eventName === 'ready') {
			this.init();
		}
	};

	Toolbar.prototype.init = function() {

		this.container
			.on('click', '.eyedraw-toolbar .drawer > a', this.onDrawerButtonClick.bind(this))
			.on('click', '.eyedraw-button', this.onButtonClick.bind(this));

		$(document)
			.on('click', this.onDocumentClick.bind(this));
	};

	Toolbar.prototype.onDrawerButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		$(e.currentTarget).closest('.drawer').toggleClass('active');
	};

	Toolbar.prototype.onButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var button = $(e.currentTarget);
		var fn = button.data('function');
		var arg = button.data('arg');

		if (typeof this.drawing[fn] === 'function') {
			this.drawing[fn](arg);
			this.emit('doodle.action', {
				fn: fn,
				arg: arg
			});
		} else {
			this.emit('doodle.error', 'Invalid doodle function: ' + fn);
		}
	};

	Toolbar.prototype.onDocumentClick = function(e) {
		// Close any open drawers.
		this.container.find('.drawer').removeClass('active');
	};

	return Toolbar;
}());

ED.DoodlePopup = (function() {

	/** Helpers */
	function ucFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/** Constants */
	var OPEN = 'open';
	var CLOSED = 'closed';

	/**
	 * DoodlePopup constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} widgetContainer The widget container element
	 * @extends {EventEmitter2}
	 */
	function DoodlePopup(drawing, widgetContainer) {

		EventEmitter2.call(this);

		this.drawing = drawing;
		this.container = widgetContainer.find('.eyedraw-doodle-popup');
		this.currentDoodle = null;
		this.state = CLOSED;

		this.createToolbar();
		this.createTemplate();
		this.registerForNotifications();
	}

	DoodlePopup.prototype = Object.create(EventEmitter2.prototype);

	DoodlePopup.prototype.createToolbar = function() {
		this.toolbar = new ED.Toolbar(this.drawing, this.container);
		this.toolbar.on('doodle.action', this.compileTemplate.bind(this, null));
	};

	DoodlePopup.prototype.createTemplate = function() {
		this.template = $('#eyedraw-doodle-popup-template').html();
	};

	DoodlePopup.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready',
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected'
		]);
	};

	DoodlePopup.prototype.notificationHandler = function(notification) {
		var handlerName = 'on' + ucFirst(notification['eventName']);
		this[handlerName](notification);
	};

	/**
	 * Run only when the drawing is ready.
	 */
	DoodlePopup.prototype.init = function() {
		this.container.on('click', '.eyedraw-doodle-popup-toggle', this.onToggleClick.bind(this));
	};

	DoodlePopup.prototype.compileTemplate = function(data) {
		if (data) {
			this.templateData = data;
		}
		var html = Mustache.render(this.template, this.templateData);
		this.container.html(html);
	};

	DoodlePopup.prototype.update = function(show, doodle) {
		if (show) {
			this.compileTemplate({ doodle: doodle });
			this.show();
		} else {
			this.hide();
		}
	};

	DoodlePopup.prototype.hide = function() {
		this.state = CLOSED;
		this.container.addClass('closed');
	};

	DoodlePopup.prototype.show = function() {
		if (this.currentDoodle.isLocked){
			return;
		}
		this.state = OPEN;
		this.selectDoodle();
		this.container.removeClass('closed');
	};

	DoodlePopup.prototype.selectDoodle = function() {
		if (!this.currentDoodle.isSelected && !this.currentDoodle.isLocked) {
			this.currentDoodle.isSelected = true;
			this.currentDoodle.onSelection();
			this.drawing.repaint();
		}
	};

	/** EVENT HANDLERS */

	DoodlePopup.prototype.onToggleClick = function(e) {
		e.preventDefault();
		var func = (this.state === CLOSED ? 'show' : 'hide');
		this[func]();
	}

	DoodlePopup.prototype.onReady = function(notification) {
		this.init();
	};

	DoodlePopup.prototype.onDoodleAdded = function(notification) {
		this.currentDoodle = notification.selectedDoodle;
		this.update(true, notification.selectedDoodle);
	};

	DoodlePopup.prototype.onDoodleDeleted = function(notification) {
		this.update(false, notification.selectedDoodle);
	};

	DoodlePopup.prototype.onDoodleSelected = function(notification) {
		this.currentDoodle = notification.selectedDoodle;
		setTimeout(this.update.bind(this, true, notification.selectedDoodle));
	};

	DoodlePopup.prototype.onDoodleDeselected = function(notification) {
		this.update(false, notification.selectedDoodle);
	};

	return DoodlePopup;
}());

ED.Controller = function(_drawing, _toolbar, _doodlePopup, _container, _properties) {

	// Assign controller properties
	this.drawing = _drawing;

	// Register controller for notifications
	this.drawing.registerForNotifications(this, 'notificationHandler', ['ready', 'doodlesLoaded', 'doodleAdded', 'doodleDeleted', 'doodleSelected', 'doodleDeselected', 'mousedragged', 'parameterChanged']);

	// Handle view errors.
	_toolbar.on('error.doodle', function(msg) {
		alert('There was a doodle error: ' + msg);
	});

	$(document).on('click', function(e) {
		if($(e.target).parents().index(_container) === -1){
			_drawing.deselectDoodles();
		}
	});

	// Method called for notification
	this.notificationHandler = function(_messageArray) {
		// Get reference to hidden input element
		var input = document.getElementById(_properties.inputId);

		// Handle events by name
		switch (_messageArray['eventName']) {
			// Drawing object ready
			case 'ready':

				// Set scale of drawing
				this.drawing.globalScaleFactor = _properties.scale;

				// If input exists and contains data, load it into the drawing
				if (input != null && input.value.length > 0) {
					// Load drawing data from input element
					this.drawing.loadDoodles(_properties.inputId);

					// Refresh drawing
					this.drawing.repaint();
				}
				// Otherwise run commands in onReadyCommand array
				else {
					for (var i = 0; i < _properties.onReadyCommandArray.length; i++) {
						// Get method name
						var method = _properties.onReadyCommandArray[i][0];
						var argumentArray = _properties.onReadyCommandArray[i][1];

						// Run method with arguments
						this.drawing[method].apply(this.drawing, argumentArray);
					}
				}

				// Apply bindings
				if (!ED.objectIsEmpty(_properties.bindingArray)) {
					this.drawing.addBindings(_properties.bindingArray);
				}

				// Apply delete values
				if (!ED.objectIsEmpty(_properties.deleteValueArray)) {
					this.drawing.addDeleteValues(_properties.deleteValueArray);
				}

				// Initialise hidden input
				if (input != null) {
					input.value = _drawing.save();
				}

				// Optionally make canvas element focussed
				if (_properties.focus) {
					canvas.focus();
				}

				// Mark drawing object as ready
				this.drawing.isReady = true;
				break;

			case 'doodlesLoaded':
				// Run commands after doodles have successfully loaded
				for (var i = 0; i < _properties.onDoodlesLoadedCommandArray.length; i++) {
					// Get method name
					var method = _properties.onDoodlesLoadedCommandArray[i][0];
					var argumentArray = _properties.onDoodlesLoadedCommandArray[i][1];

					// Run method with arguments
					this.drawing[method].apply(this.drawing, argumentArray);
				}
				break;

			case 'doodleAdded':
				// Save drawing to hidden input
				if (input != null && input.value.length > 0) {
					input.value = this.drawing.save();
				}

				// Label doodle needs immediate keyboard input, so give canvas focus
				var doodle = _messageArray['object'];
				if (typeof(doodle) != 'undefined') {
					if (doodle.className == 'Label') {
						canvas.focus();
					}
				}

				break;

			case 'doodleDeleted':
				// Save drawing to hidden input
				if (input != null && input.value.length > 0) {
					input.value = this.drawing.save();
				}
				break;

			case 'doodleDeselected':

				break;

			case 'doodleSelected':
				// Ensure that selecting a doodle in one drawing de-deselects the others
				for (var idSuffix in _properties.syncArray) {
					var drawing = window['ed_drawing_edit_' + idSuffix];
					drawing.deselectDoodles();
				}
				break;

			case 'mousedragged':
				// Save drawing to hidden input
				if (input != null && input.value.length > 0) {
					input.value = this.drawing.save();
				}
				break;

			case 'parameterChanged':
				// Get master doodle
				var masterDoodle = _messageArray['object'].doodle;

				// Iterate through sync array
				for (var idSuffix in _properties.syncArray) {
					// Get reference to slave drawing
					var slaveDrawing = window['ed_drawing_edit_' + idSuffix];

					// Iterate through each specified className
					for (var className in _properties.syncArray[idSuffix]) {
						// Iterate through slave class names
						for (var slaveClassName in _properties.syncArray[idSuffix][className]) {
							// Slave doodle (uses first doodle in the drawing matching the className)
							var slaveDoodle = slaveDrawing.firstDoodleOfClass(slaveClassName);

							// Check that doodles exist, className matches, and sync is allowed
							if (masterDoodle && masterDoodle.className == className && slaveDoodle && slaveDoodle.willSync) {
								// Get array of parameters to sync
								var parameterArray = _properties.syncArray[idSuffix][className][slaveClassName]['parameters'];

								if (typeof(parameterArray) != 'undefined') {
									// Iterate through parameters to sync
									for (var i = 0; i < parameterArray.length; i++) {
										// Check that parameter array member matches changed parameter
										if (parameterArray[i] == _messageArray.object.parameter) {
											// Avoid infinite loop by checking values are not equal before setting
											if (masterDoodle[_messageArray.object.parameter] != slaveDoodle[_messageArray.object.parameter]) {
												var increment = _messageArray.object.value - _messageArray.object.oldValue;
												var newValue = slaveDoodle[_messageArray.object.parameter] + increment;

												// Sync slave parameter to value of master
												slaveDoodle.setSimpleParameter(_messageArray.object.parameter, newValue);
												slaveDoodle.updateDependentParameters(_messageArray.object.parameter);

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
				break;
		}
	}
};

/**
 * Function runs on page load to initialise an EyeDraw widget.
 *
 * @param {object} _properties Object of properties passed from widget
 *     @property drawingName The EyeDraw drawing object
 *     @property canvasId The DOM id of the associated canvas element
 *     @property eye The eye (right = 0, left = 1) ***TODO*** handle this better
 *     @property idSuffix A suffix for DOM elements to distinguish those associated with this drawing object
 *     @property isEditable Flag indicating whether drawing object is editable or not
 *     @property graphicsPath Path to folder containing EyeDraw graphics
 *     @property onReadyCommandArray Array of commands and arguments to be run when images are loaded
 */
ED.init = function(_properties) {

	// Get reference to the drawing canvas
	var canvas = document.getElementById(_properties.canvasId);

	// Get reference to the widgget container
	var container = $(canvas).closest('.eyedraw-widget');

	// Options array for drawing object
	var drawingOptions = {
		offsetX: _properties.offsetX,
		offsetY: _properties.offsetY,
		toImage: _properties.toImage,
		graphicsPath: _properties.graphicsPath
	};

	// Drawing
	var drawing = new ED.Drawing(canvas, _properties.eye, _properties.idSuffix, _properties.isEditable, drawingOptions);

	// Views
	var toolbar = new ED.Toolbar(drawing, container.find('.eyedraw-toolbar-panel'));
	var doodlePopup = new ED.DoodlePopup(drawing, container);

	// Controller
	var controller = new ED.Controller(drawing, toolbar, doodlePopup, container, _properties);

	// Array of additional controllers
	var listenerList = new Array();
	for (var i = 0; i < _properties.listenerArray.length; i++) {
		listenerList[i] = new _properties.listenerArray[i](drawing);
	}
	//always capture the eyedraw being ready:
	listenerList.push(new EyeDrawReadyListener(drawing));

	// Initialize drawing
	drawing.init();
};
