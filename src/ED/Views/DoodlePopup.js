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

/* global $: false, Mustache: false, ED: true */

var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * The DoodlePopup view manages the doodle popup menu.
 */
ED.Views.DoodlePopup = (function() {

	'use strict';

	/**
	 * DoodlePopup constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} widgetContainer The widget container element
	 * @extends {EventEmitter2}
	 */
	function DoodlePopup() {
		ED.View.apply(this, arguments);
		this.delayTimer = 0;
		this.createToolbar();
		this.createTemplate();
	}

	DoodlePopup.prototype = Object.create(ED.View.prototype);
	DoodlePopup.prototype.constructor = DoodlePopup;

	/**
	 * Create the manipulation toolbar.
	 */
	DoodlePopup.prototype.createToolbar = function() {
		this.toolbar = new ED.Views.Toolbar(this.drawing, this.container);
		this.toolbar.on('doodle.action', this.render.bind(this));
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
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected'
		]);
	};

	/**
	 * Compile the mustache template.
	 * @param  {Object} data Template data.
	 */
	DoodlePopup.prototype.render = function() {
		var doodle = this.drawing.selectedDoodle;
		var data = {
			doodle: doodle,
			title: doodle ? ED.titles[doodle.className] : '',
			desc: doodle ? ED.trans[doodle.className] : ''
		};
		var html = Mustache.render(this.template, data);
		this.container.html(html);
	};

	/**
	 * Update the menu content with the specific doodle and either show or hide it.
	 * @param  {Boolean} show   Show or hide the menu.
	 */
	DoodlePopup.prototype.update = function(show) {
		if (show) {
			this.render();
			this.show();
		} else {
			this.hide();
		}
	};

	/**
	 * Hide the menu.
	 * @param  {Number} delay The amount of time (ms) to delay hiding the menu.
	 */
	DoodlePopup.prototype.hide = function() {
		this.delay(function() {
			this.container.addClass('closed');
		}.bind(this));
	};

	/**
	 * Show the menu.
	 * @param  {Number} delay The amount of time (in ms) to delay showing the menu.
	 */
	DoodlePopup.prototype.show = function() {
		if (this.drawing.selectDoodle.isLocked) {
			return;
		}
		this.delay(function() {
			this.container.removeClass('closed');
		}.bind(this));
	};

	/**
	 * Delay executing a callback.
	 * @param  {Function} fn    The callback function to execute.
	 * @param  {Number}   delay The amount of time (in ms) to delay.
	 */
	DoodlePopup.prototype.delay = function(fn) {
		clearTimeout(this.delayTimer);
		this.delayTimer = setTimeout(fn, 50);
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	DoodlePopup.prototype.onDoodleAdded = function() {
		this.update(true);
	};

	DoodlePopup.prototype.onDoodleDeleted = function() {
		this.update(false);
	};

	DoodlePopup.prototype.onDoodleSelected = function() {
		setTimeout(this.update.bind(this, true));
	};

	DoodlePopup.prototype.onDoodleDeselected = function() {
		this.update(false);
	};

	return DoodlePopup;
}());
