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

var ED = ED || {};

ED.Controller = (function() {

	'use strict';

	/** Constants */
	var EVENT_NAMESPACE = 'eyedraw.controller';

	/** Helpers */
	var ucFirst = ED.firstLetterToUpperCase;

	/**
	 * Controller constructor. The controller will init the various eyedraw components
	 * and manage post-init actions.
	 * @param {Object} properties The EyeDraw widget properties.
	 */
	function Controller(properties) {

		this.properties = properties;
		this.canvas = document.getElementById(properties.canvasId);
		this.input = document.getElementById(properties.inputId);
		this.container = $(this.canvas).closest('.eyedraw-widget');

		this.createDrawing();
		this.createViews();

		this.registerEvents();
		this.initListeners();

		// Initialize drawing.
		this.drawing.init();
	}

	/**
	 * Create the canvas drawing instance.
	 */
	Controller.prototype.createDrawing = function() {

		var options = {
			offsetX: this.properties.offsetX,
			offsetY: this.properties.offsetY,
			toImage: this.properties.toImage,
			graphicsPath: this.properties.graphicsPath
		};

		this.drawing = new ED.Drawing(
			this.canvas,
			this.properties.eye,
			this.properties.idSuffix,
			this.properties.isEditable,
			options
		);

		// Register with the checker.
		ED.Checker.register(this.drawing);

		// Store this drawing instance
		ED.setInstance(this.drawing);
	};

	/**
	 * Create the various view classes.
	 */
	Controller.prototype.createViews = function() {

		// Toolbar
		this.toolbar = new ED.Views.Toolbar(
			this.drawing,
			this.container.find('.eyedraw-toolbar-panel')
		);

		// Doodle Popup menu
		this.doodlePopup = new ED.Views.DoodlePopup(
			this.drawing,
			this.container
		);
	};

	/**
	 * Register events.
	 */
	Controller.prototype.registerEvents = function() {

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

		// De-select all doodles when clicking anywhere in the document.
		$(document).on('click.' + EVENT_NAMESPACE, this.onDocumentClick.bind(this));
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
		return (this.input !== null && this.input.value.length > 0);
	};

	/**
	 * Save drawing data to the associated input field.
	 */
	Controller.prototype.saveDrawingToInputField = function() {
		if (this.hasInputFieldData()) {
			this.input.value = this.drawing.save();
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
	 * @TODO
	 */
	Controller.prototype.addDeletedValues = function() {
		if (!ED.objectIsEmpty(this.properties.deleteValueArray)) {
			this.drawing.addDeleteValues(this.properties.deleteValueArray);
		}
	};

	/**
	 * Run commands on the drawing once it's ready. (This is useful for
	 * adding doodles on page load, for example.)
	 */
	Controller.prototype.runOnReadyCommands = function() {
		for (var i = 0; i < this.properties.onReadyCommandArray.length; i++) {
			// Get method name
			var method = this.properties.onReadyCommandArray[i][0];
			var argumentArray = this.properties.onReadyCommandArray[i][1];

			// Run method with arguments
			this.drawing[method].apply(this.drawing, argumentArray);
		}
	};

	/**
	 * Run commands once all doodles have been loaded.
	 */
	Controller.prototype.runOnDoodlesLoadedCommands = function() {
		// Run commands after doodles have successfully loaded
		for (var i = 0; i < this.properties.onDoodlesLoadedCommandArray.length; i++) {
			// Get method name
			var method = this.properties.onDoodlesLoadedCommandArray[i][0];
			var argumentArray = this.properties.onDoodlesLoadedCommandArray[i][1];

			// Run method with arguments
			this.drawing[method].apply(this.drawing, argumentArray);
		}
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	/**
	 * Delesect all doodles if clicking outside of the canvas element.
	 * @param  {Object} e Event object.
	 */
	Controller.prototype.onDocumentClick = function(e) {
		if($(e.target).parents().index(this.container) === -1){
			this.drawing.deselectDoodles();
		}
	};

	/**
	 * On drawing ready.
	 */
	Controller.prototype.onReady = function() {

		// Set scale of drawing
		this.drawing.globalScaleFactor = this.properties.scale;

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
		this.saveDrawingToInputField();

		// Optionally make canvas element focused
		if (this.properties.focus) {
			this.canvas.focus();
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
	 * On doodle added.
	 * @param  {Object} notification The notification object.
	 */
	Controller.prototype.onDoodleAdded = function(notification) {

		this.saveDrawingToInputField();

		// Label doodle needs immediate keyboard input, so give canvas focus.
		// NOTE: labels are deactivated from 1.6.
		var doodle = notification.object;
		if (typeof(doodle) != 'undefined') {
			if (doodle.className == 'Label') {
				this.canvas.focus();
			}
		}
	};

	/**
	 * On doodle deleted.
	 */
	Controller.prototype.onDoodleDeleted = function() {
		this.saveDrawingToInputField();
	};

	/**
	 * On doodle selected.
	 */
	Controller.prototype.onDoodleSelected = function() {
		for (var idSuffix in this.properties.syncArray) {
			var drawing = this.getEyeDrawInstance(idSuffix);
			drawing.deselectDoodles();
		}
	};

	/**
	 * On doodle mouse dragged.
	 */
	Controller.prototype.onMousedragged = function() {
		this.saveDrawingToInputField();
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
	 * Find an eyedraw instance by its' idSuffix.
	 * @param  {String} idSuffix The eyedraw instance idSuffix
	 * @return {ED.Drawing}
	 */
	Controller.prototype.getEyeDrawInstance = function(idSuffix) {
		return ED.getInstance(idSuffix);
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

	return Controller;
}());