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

/* global EventEmitter2: false, $: false, Mustache: false */

var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * The DoodlePopup view manages the doodle popup menu.
 */
ED.Views.DoodlePopup = (function() {

	'use strict';

	/** Helpers */
	var ucFirst = ED.firstLetterToUpperCase;

	/** Constants */
	var OPEN = 'open';
	var CLOSED = 'closed';
	var EVENT_NAMESPACE = 'eyedraw.doodlepopup';

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
		this.delayTimer = 0;

		this.createToolbar();
		this.createTemplate();
		this.registerForNotifications();
	}

	DoodlePopup.prototype = Object.create(EventEmitter2.prototype);
	DoodlePopup.prototype.constructor = DoodlePopup;

	/**
	 * Create the manipulation toolbar.
	 */
	DoodlePopup.prototype.createToolbar = function() {
		this.toolbar = new ED.Views.Toolbar(this.drawing, this.container);
		this.toolbar.on('doodle.action', this.compileTemplate.bind(this, null));
	};

	/**
	 * Create the template for the popup.
	 */
	DoodlePopup.prototype.createTemplate = function() {
		this.template = $('#eyedraw-doodle-popup-template').html();
	};

	/**
	 * Register for drawing notifications and bind interaction events.
	 */
	DoodlePopup.prototype.registerForNotifications = function() {

		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready',
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected'
		]);
	};

	/**
	 * This notification handler will simply route events to handlers.
	 * @param  {Object} notification The notification object.
	 */
	DoodlePopup.prototype.notificationHandler = function(notification) {
		var eventName = notification.eventName;
		var handlerName = 'on' + ucFirst(eventName);
		this[handlerName](notification);
	};

	/**
	 * Compile the mustache template.
	 * @param  {Object} data Template data.
	 */
	DoodlePopup.prototype.compileTemplate = function(data) {
		if (data) {
			this.templateData = data;
		}
		var html = Mustache.render(this.template, this.templateData);
		this.container.html(html);
	};

	/**
	 * Update the menu content with the specific doodle and either show or hide it.
	 * @param  {Boolean} show   Show or hide the menu.
	 * @param  {ED.Doodle} doodle The currently selected doodle.
	 * @param  {Number} delay  The amount of time to delay (in ms) prior to showing to hiding.
	 */
	DoodlePopup.prototype.update = function(show, doodle, delay) {
		if (show) {
			this.compileTemplate({ doodle: doodle });
			this.show(delay);
		} else {
			this.hide(delay);
		}
	};

	/**
	 * Hide the menu.
	 * @param  {Number} delay The amount of time (ms) to delay hiding the menu.
	 */
	DoodlePopup.prototype.hide = function(delay) {
		this.state = CLOSED;
		this.delay(function() {
			this.container.addClass('closed');
		}.bind(this), delay);
	};

	/**
	 * Show the menu.
	 * @param  {Number} delay The amount of time (in ms) to delay showing the menu.
	 */
	DoodlePopup.prototype.show = function(delay) {
		if (this.currentDoodle.isLocked){
			return;
		}
		this.state = OPEN;
		this.selectDoodle();
		this.delay(function() {
			this.container.removeClass('closed');
		}.bind(this), delay);
	};

	/**
	 * Delay executing a callback.
	 * @param  {Function} fn    The callback function to execute.
	 * @param  {Number}   delay The amount of time (in ms) to delay.
	 */
	DoodlePopup.prototype.delay = function(fn, delay) {
		delay = typeof delay === 'number' ? delay : 50;
		clearTimeout(this.delayTimer);
		this.delayTimer = setTimeout(fn, delay);
	};

	/**
	 * Select the current doodle.
	 */
	DoodlePopup.prototype.selectDoodle = function() {
		// @todo This should be one method call on the drawing.
		// move this stuff into the ED.Drawing class.
		if (!this.currentDoodle.isSelected && !this.currentDoodle.isLocked) {
			this.currentDoodle.isSelected = true;
			this.currentDoodle.onSelection();
			this.drawing.repaint();
		}
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	DoodlePopup.prototype.onToggleClick = function(e) {
		e.preventDefault();
		var func = (this.state === CLOSED ? 'show' : 'hide');
		this[func]();
	};

	DoodlePopup.prototype.onReady = function() {
		this.container.on(
			'click.' + EVENT_NAMESPACE,
			'.eyedraw-doodle-popup-toggle',
			this.onToggleClick.bind(this)
		);
	};

	DoodlePopup.prototype.onDoodleAdded = function(notification) {
		// FIXME
		this.currentDoodle = notification.object || notification.selectedDoodle;
		this.update(true, this.currentDoodle);
	};

	DoodlePopup.prototype.onDoodleDeleted = function(notification) {
		this.update(false, notification.object || notification.selectedDoodle);
	};

	DoodlePopup.prototype.onDoodleSelected = function(notification) {
		/**
		 * Order of events emitted from the eyedraw:
		 * 1. doodleSelected
		 * 2. doodleDeselected
		 * Thus we delay the selected action into the next event loop if we want the
		 * popup to remain visible when selecting a new doodle.
		 */
		this.currentDoodle = notification.object || notification.selectedDoodle;
		setTimeout(this.update.bind(this, true, this.currentDoodle, 150));
	};

	DoodlePopup.prototype.onDoodleDeselected = function(notification) {
		this.update(false, notification.selectedDoodle);
	};

	return DoodlePopup;
}());
