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

	function Controller(properties) {

		this.properties = properties;
		this.canvas = document.getElementById(properties.canvasId);
		this.input = document.getElementById(properties.inputId);
		this.container = $(this.canvas).closest('.eyedraw-widget');

		this.createDrawing();
		this.createViews();

		this.bindEvents();
		this.initListeners();

		// Register with the checker.
		ED.Checker.register(this.drawing);

		// Initialize drawing.
		this.drawing.init();
	}

	Controller.prototype.createDrawing = function() {

		// Options array for drawing object
		var options = {
			offsetX: this.properties.offsetX,
			offsetY: this.properties.offsetY,
			toImage: this.properties.toImage,
			graphicsPath: this.properties.graphicsPath
		};

		// Drawing
		this.drawing = new ED.Drawing(
			this.canvas,
			this.properties.eye,
			this.properties.idSuffix,
			this.properties.isEditable,
			options
		);

		// Store this drawing instance
		ED.setInstance(this.drawing);
	};

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

	Controller.prototype.bindEvents = function() {

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

	Controller.prototype.hasInputFieldData = function() {
		return (this.input !== null && this.input.value.length > 0);
	};

	Controller.prototype.saveDrawingToInputField = function() {
		if (this.hasInputFieldData()) {
			this.input.value = this.drawing.save();
		}
	};

	Controller.prototype.loadInputFieldData = function() {
		// Load drawing data from input element
		this.drawing.loadDoodles(this.properties.inputId);
	};

	Controller.prototype.addBindings = function() {
		// Apply bindings
		if (!ED.objectIsEmpty(this.properties.bindingArray)) {
			this.drawing.addBindings(this.properties.bindingArray);
		}
	};

	Controller.prototype.addDeletedValues = function() {
		// Apply delete values
		if (!ED.objectIsEmpty(this.properties.deleteValueArray)) {
			this.drawing.addDeleteValues(this.properties.deleteValueArray);
		}
	};

	Controller.prototype.runOnReadyCommands = function() {
		for (var i = 0; i < this.properties.onReadyCommandArray.length; i++) {
			// Get method name
			var method = this.properties.onReadyCommandArray[i][0];
			var argumentArray = this.properties.onReadyCommandArray[i][1];

			// Run method with arguments
			this.drawing[method].apply(this.drawing, argumentArray);
		}
	};

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

	Controller.prototype.onDocumentClick = function(e) {
		if($(e.target).parents().index(this.container) === -1){
			this.drawing.deselectDoodles();
		}
	};

	/**
	 * On drawing ready.
	 * @param  {object} notification The notification object.
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

	Controller.prototype.onDoodlesLoaded = function() {
		// Run the onDoodlesLoadedCommands (if any).
		this.runOnDoodlesLoadedCommands();
	};

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

	Controller.prototype.onDoodleDeleted = function() {
		this.saveDrawingToInputField();
	};

	Controller.prototype.onDoodleSelected = function() {
		for (var idSuffix in this.properties.syncArray) {
			var drawing = this.getEyeDrawInstance(idSuffix);
			drawing.deselectDoodles();
		}
	};

	Controller.prototype.onMousedragged = function() {
		this.saveDrawingToInputField();
	};

	Controller.prototype.onParameterChanged = function(notification) {
		// Sync with other doodles on the page.
		this.syncEyedraws(notification.object);
		// Save drawing to hidden input.
		this.saveDrawingToInputField();
	};

	Controller.prototype.getEyeDrawInstance = function(idSuffix) {
		return ED.getInstance(idSuffix);
	};

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