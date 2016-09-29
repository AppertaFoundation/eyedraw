/**
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2014
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
 */

/* global $:false */

/**
 * @namespace ED
 * @description Namespace for all EyeDraw classes
 */
var ED = ED || {};

/**
 * @namespace ED.Controller
 * @memberOf ED
 * @description Namespace for EyeDraw Controller
 */ 

ED.Controller = (function() {

	'use strict';

	/** Helpers */
	var ucFirst = ED.firstLetterToUpperCase;

	/**
	 * Controller constructor. The controller will init the various eyedraw components
	 * and manage post-init actions.
	 * @param {Object} properties The EyeDraw widget properties.
	 * @param {ED.Checker} [Checker] The EyeDraw checker.
	 * @param {ED.Drawing} [drawing] An ED.Drawing instance.
	 * @param {ED.Views.Toolbar} [mainToolbar] An ED.Views.Toolbar instance.
	 * @param {ED.Views.Toolbar} [drawingToolbar] An ED.Views.Toolbar instance.
	 * @param {ED.Views.DoodlePopup} [doodlePopup] An ED.Views.DoodlePopup instance.
	 */
	function Controller(properties, Checker, drawing, mainToolbar, drawingToolbar, doodlePopup, selectedDoodle) {

		this.properties = properties;
		this.canvas = document.getElementById(properties.canvasId);
		this.input = document.getElementById(properties.inputId);
		this.container = $(this.canvas).closest('.ed-widget');
		this.previousReport = '';

		this.Checker = Checker || ED.Checker;
		this.drawing = drawing || this.createDrawing();

		if (this.properties.isEditable) {
			this.mainToolbar = mainToolbar || this.createMainToolbar();
			this.drawingToolbar = drawingToolbar || this.createDrawingToolbar();
			this.doodlePopup = doodlePopup || this.createDoodlePopup();
			this.selectedDoodle = selectedDoodle || this.createSelectedDoodle();
			this.bindEditEvents();
		}

		this.registerDrawing();
		this.registerForNotifications();
		this.initListeners();
		this.drawing.init();
	}

	/**
	 * Create the canvas drawing instance.
	 */
	Controller.prototype.createDrawing = function() {

		var options = {
			drawingName: this.properties.drawingName,
			offsetX: this.properties.offsetX,
			offsetY: this.properties.offsetY,
			toImage: this.properties.toImage,
			graphicsPath: this.properties.graphicsPath,
			scale: this.properties.scale,
			toggleScale: this.properties.toggleScale
		};

		var drawing = new ED.Drawing(
			this.canvas,
			this.properties.eye,
			this.properties.idSuffix,
			this.properties.isEditable,
			options
		);

		return drawing;
	};

	/**
	 * Create a Toolbar view instance.
	 */
	Controller.prototype.createMainToolbar = function() {

		var container = this.container.find('.ed-main-toolbar');

		return container.length ? new ED.Views.Toolbar.Main(
			this.drawing,
			container
		) : null;
	};

	Controller.prototype.createDrawingToolbar = function() {

		var container = this.container.find('.ed-drawing-toolbar');

		return container.length ? new ED.Views.Toolbar.Drawing(
			this.drawing,
			container
		) : null;
	};

	/**
	 * Create a DoodlePopup view instance.
	 */
	Controller.prototype.createDoodlePopup = function() {

		var container = this.container.find('.ed-doodle-popup');

		return container.length ? new ED.Views.DoodlePopup(
			this.drawing,
			container
		) : null;
	};

	/**
	 * Create a SelectedDoodle instance.
	 * @return {ED.Views.SelectedDoodle} [description]
	 */
	Controller.prototype.createSelectedDoodle = function() {

		var container = this.container.find('.ed-selected-doodle');

		return container.length ? new ED.Views.SelectedDoodle(
			this.drawing,
			container,
			this.doodlePopup
		) : null;
	};

	/**
	 * Register the drawing instance with the Checker.
	 */
	Controller.prototype.registerDrawing = function() {
		this.Checker.register(this.drawing);
	};

	/**
	 * Register drawing and DOM events.
	 */
	Controller.prototype.registerForNotifications = function() {

		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready',
			'doodlesLoaded',
			'parameterChanged'
		]);

		this.drawing.registerForNotifications(this, 'saveDrawingToInputField', [
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'mousedragged',
			'drawingZoom'
		]);
	};

	/**
	 * Bind edit related event handlers.
	 */
	Controller.prototype.bindEditEvents = function() {
		if (this.doodlePopup && this.doodlePopup instanceof ED.Views.DoodlePopup) {

			this.doodlePopup.on('show.before', function() {
				this.container.addClass('ed-state-doodle-popup-show');
			}.bind(this));

			this.doodlePopup.on('hide.after', function() {
				this.container.removeClass('ed-state-doodle-popup-show');
			}.bind(this));
		}
	};

	/**
	 * Create instances of any listener objects.
	 */
	Controller.prototype.initListeners = function() {
		if (!(this.properties.listenerArray instanceof Array)) {
			return;
		}
		// Additional listener controllers
		this.properties.listenerArray.forEach(function(ListenerArray) {
			new ListenerArray(this.drawing);
		}.bind(this));
	};

	/**
	 * Route a notification to an event handler.
	 * @param  {object} notification The notification object.
	 */
	Controller.prototype.notificationHandler = function(notification) {
		var eventName = notification.eventName;
		var handlerName = 'on' + ucFirst(eventName);
		if (this[handlerName]) {
			this[handlerName](notification);
		}
	};

	/**
	 * Check if the associated input field has any data.
	 * @return {Boolean}
	 */
	Controller.prototype.hasInputFieldData = function() {
		return (this.hasInputField() && this.input.value.length > 0);
	};

	/**
	 * Do we have an associated input field.
	 * @return {Boolean}
	 */
	Controller.prototype.hasInputField = function() {
		return (this.input !== null);
	};

	/**
	 * Save drawing data to the associated input field.
	 */
	Controller.prototype.saveDrawingToInputField = function(force) {
		if ((force && this.hasInputField()) || this.hasInputFieldData()) {
			this.input.value = this.drawing.save();
		}
		if(this.properties.autoReport){
			var outputElement = document.getElementById(this.properties.autoReport);
			this.autoReport(outputElement);
		}
	};

	/**
	 * Load data from the input field into the drawing.
	 */
	Controller.prototype.loadInputFieldData = function() {
		// Load drawing data from input element
		this.drawing.loadDoodles(this.properties.inputId);
	};

	/**
	 * Add field bindings to the drawing.
	 */
	Controller.prototype.addBindings = function() {
		if (!ED.objectIsEmpty(this.properties.bindingArray)) {
			this.drawing.addBindings(this.properties.bindingArray);
		}
	};

	/**
	 * Add deleted values.
	 */
	Controller.prototype.addDeletedValues = function() {
		if (!ED.objectIsEmpty(this.properties.deleteValueArray)) {
			this.drawing.addDeleteValues(this.properties.deleteValueArray);
		}
	};

	/**
	 * Deselect all synced doodles.
	 */
	Controller.prototype.deselectSyncedDoodles = function() {
		var arr = this.properties.syncArray;
		for (var idSuffix in arr) {
			this.getEyeDrawInstance(idSuffix).deselectDoodles();
		}
	};

	/**
	 * Run commands on the drawing once it's ready. (This is useful for
	 * adding doodles on page load, for example.)
	 */
	Controller.prototype.runOnReadyCommands = function() {
		var arr = (this.properties.onReadyCommandArray || []);
		this.runCommands(arr);

		this.drawing.onReadyCommands.push(arr);
	};

	/**
	 * Run commands once all doodles have been loaded.
	 */
	Controller.prototype.runOnDoodlesLoadedCommands = function() {
		var arr = (this.properties.onDoodlesLoadedCommandArray || []);
		this.runCommands(arr);
	};

	/**
	 * Run commands (with arguments) on the drawing instance.
	 * @param  {Array} arr The array of commands.
	 */
	Controller.prototype.runCommands = function(arr) {

		for (var i = 0; i < arr.length; i++) {

			var method = arr[i][0];
			var argumentArray = arr[i][1];

			// Run method with arguments
			this.drawing[method].apply(this.drawing, argumentArray);
		}
	};

	/**
	 * Find an eyedraw instance by its' idSuffix.
	 * @param  {String} idSuffix The eyedraw instance idSuffix
	 * @return {ED.Drawing}
	 */
	Controller.prototype.getEyeDrawInstance = function(idSuffix) {
		return ED.Checker.getInstanceByIdSuffix(idSuffix);
	};

	/**
	 * Sync multiple eyedraws. Essentially this will sync parameters for doodles across
	 * different eyedraw instances.
	 * @param  {Object} changedParam The paramater that was changed in the master doodle.
	 */
	Controller.prototype.syncEyedraws = function(changedParam) {

		var masterDoodle = changedParam.doodle;
		var syncArray = this.properties.syncArray;

		// Iterate through sync array
		for (var idSuffix in syncArray) {

			// Get reference to slave drawing
			var slaveDrawing = this.getEyeDrawInstance(idSuffix);

			if (!slaveDrawing) {
				ED.errorHandler('ED.Controller', 'syncEyedraws', 'Cannot sync with ' + idSuffix + ': instance not found');
				break;
			}

			// Iterate through master doodles to sync.
			for (var masterDoodleName in syncArray[idSuffix]) {

				// Iterate through slave doodles to sync with master doodle.
				for (var slaveDoodleName in syncArray[idSuffix][masterDoodleName]) {

					// Get the slave doodle instance (uses first doodle in the drawing matching the className)
					var slaveDoodle = slaveDrawing.firstDoodleOfClass(slaveDoodleName);

					// Check that doodles exist, className matches, and sync is allowed
					if (!masterDoodle || masterDoodle.className !== masterDoodleName || !slaveDoodle && !slaveDoodle.willSync) {
						continue;
					}

					// Sync the doodle parameters.
					var parameterArray = syncArray[idSuffix][masterDoodleName][slaveDoodleName].parameters;

					this.syncDoodleParameters(parameterArray, changedParam, masterDoodle, slaveDoodle, slaveDrawing);
				}
			}

			// Refresh the slave drawing, now that the doodle parameters are synced.
			slaveDrawing.repaint();
		}
	};

	/**
	 * Sync doodle parameters across two eyedraws.
	 * @param  {Array} parameterArray The full list of parameters to sync.
	 * @param  {Object} changedParam   The parameter that was changed in the master doodle.
	 * @param  {ED.Doodle} masterDoodle   The master doodle instance.
	 * @param  {ED.Doodle} slaveDoodle    The slave doodle that will be synced.
	 * @param  {ED.Drawing} slaveDrawing  The slave drawing instance.
	 */
	Controller.prototype.syncDoodleParameters = function(parameterArray, changedParam, masterDoodle, slaveDoodle, slaveDrawing) {

		// Iterate through parameters to sync
		for (var i = 0; i < (parameterArray || []).length; i++) {

			// Check that parameter array member matches changed parameter
			if (parameterArray[i] !== changedParam.parameter) {
				continue;
			}
			// Avoid infinite loop by checking values are not equal before setting
			if (masterDoodle[changedParam.parameter] === slaveDoodle[changedParam.parameter]) {
				continue;
			}

			var increment = changedParam.value - changedParam.oldValue;
			var newValue = slaveDoodle[changedParam.parameter] + increment;

			// Sync slave parameter to value of master
			slaveDoodle.setSimpleParameter(changedParam.parameter, newValue);
			slaveDoodle.updateDependentParameters(changedParam.parameter);

			// Update any bindings associated with the slave doodle
			slaveDrawing.updateBindings(slaveDoodle);
		}
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	/**
	 * On drawing ready.
	 */
	Controller.prototype.onReady = function() {

		// If input exists and contains data, load it into the drawing.
		if (this.hasInputFieldData()) {
			this.loadInputFieldData();
			this.drawing.repaint();
		}
		// Otherwise run commands in onReadyCommand array.
		else {
			this.runOnReadyCommands();
		}

		this.addBindings();
		this.addDeletedValues();
		this.drawing.notifyZoomLevel();
		this.saveDrawingToInputField(true);

		// Optionally make canvas element focused
		if (this.properties.focus) {
			this.canvas.focus();
		}

		if(this.properties.autoReport){
			var outputElement = document.getElementById(this.properties.autoReport);
			this.autoReport(outputElement);
		}

		// Mark drawing object as ready
		this.drawing.isReady = true;
	};

	/**
	 * On doodles loaded.
	 */
	Controller.prototype.onDoodlesLoaded = function() {
		this.runOnDoodlesLoadedCommands();
	};

	/**
	 * On parameter changed. This event is fired whenever anything is changed
	 * within the canvas drawing (or via a bound field element).
	 * @param  {Object} notification The notification object.
	 */
	Controller.prototype.onParameterChanged = function(notification) {
		// Sync with other doodles on the page.
		this.syncEyedraws(notification.object);
		// Save drawing to hidden input.
		this.saveDrawingToInputField();
	};

	/**
	 * Automatically calls the drawings report
	 */
	Controller.prototype.autoReport = function(outputElement) {
		var report = this.drawing.report();
		if(report){
			report = report.replace(/, /g,"\n");
			var output = '';
			var existing = outputElement.value;

			if(existing.match(report)){
				outputElement.rows = (existing.match(/\n/g) || []).length + 1;
				this.previousReport = report;
				return;
			}

			if(this.previousReport){
				output = existing.replace(this.previousReport, report);
			} else {
				if(!existing.match(/^[\n ]$/)){
					existing += "\n";
				}
				output = existing + report;
			}
			outputElement.value = output;
			outputElement.rows = (output.match(/\n/g) || []).length + 1;
			this.previousReport = report;
		}
	};

	return Controller;
}());
