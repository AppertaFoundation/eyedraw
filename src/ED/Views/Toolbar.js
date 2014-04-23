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

/* global $: false */

var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * The toolbar view manages interactions on the main doodle toolbar.
 */
ED.Views.Toolbar = (function() {

	'use strict';

	/** Constants **/
	var EVENT_NAMESPACE = 'eyedraw.toolbar';

	/**
	 * Toolbar constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} container The widget container element
	 * @extends {EventEmitter2}
	 */
	function Toolbar() {
		ED.View.apply(this, arguments);
		this.buttons = this.container.find('.eyedraw-button');
		this.bindEvents();
	}

	Toolbar.prototype = Object.create(ED.View.prototype);
	Toolbar.prototype.constructor = Toolbar;

	/**
	 * Register a ED.Drawing notification handler.
	 */
	Toolbar.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'drawingRepainted'
		]);
	};

	/**
	 * Run when the drawing ready. Bind interaction events.
	 */
	Toolbar.prototype.bindEvents = function() {

		// Toolbar button click events.
		this.container
			.on('click.' + EVENT_NAMESPACE, '.eyedraw-toolbar .drawer > a', this.onDrawerButtonClick.bind(this))
			.on('click.' + EVENT_NAMESPACE, '.eyedraw-button', this.onButtonClick.bind(this));

		// Document click event, hide drawers on document click.
		$(document)
			.on('click.' + EVENT_NAMESPACE, this.onDocumentClick.bind(this));
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	 /**
	  * Open or close the drawer when clicking on a drawer button.
	  * @param  {Object} e Event object.
	  */
	Toolbar.prototype.onDrawerButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		$(e.currentTarget).closest('.drawer').toggleClass('active');
	};

	/**
	 * Run an action when clicking on a toolbar button.
	 * @param  {Object} e Event object.
	 */
	Toolbar.prototype.onButtonClick = function(e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		var button = $(e.currentTarget);

		if (button.hasClass('disabled')) {
			return;
		}

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

	Toolbar.prototype.enableButton = function(button) {
		button.attr('disabled', false).removeClass('disabled');
	};

	Toolbar.prototype.disableButton = function(button) {
		button.attr('disabled', true).addClass('disabled');
	};

	Toolbar.prototype.updateButtonState = function(button) {

		this.enableButton(button);

		var func = button.data('function');
		var arg = button.data('arg');

		if (func === 'addDoodle') {

			var doodle = this.drawing.doodleArray.filter(function(doodle) {
				return (doodle.className === arg);
			})[0];

			if (doodle && doodle.isUnique) {
				this.disableButton(button);
			}
		}
	};

	Toolbar.prototype.onDrawingRepainted  = function() {
		this.buttons.each(function(i, button) {
			this.updateButtonState($(button));
		}.bind(this));
	};

	/**
	 * Hide any open drawers when clicking outside of the toolbar.
	 */
	Toolbar.prototype.onDocumentClick = function() {
		// Close any open drawers.
		this.container.find('.drawer').removeClass('active');
	};

	return Toolbar;
}());