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

/**
 * @namespace ED
 * @description Namespace for all EyeDraw classes
 */
var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * This view class manages the toolbar.
 */
ED.Views.Toolbar = (function() {

	'use strict';

	/** Constants **/
	var EVENT_NAMESPACE = 'eyedraw.toolbar';

	/**
	 * Toolbar constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} container The widget container element
	 * @extends {ED.View}
	 */
	function Toolbar(drawing, container) {
		ED.View.apply(this, arguments);

		this.drawing = drawing;
		this.container = $(container);
		this.buttons = this.container.find('.ed-button');

		this.registerForNotifications();
		this.bindEvents();
	}

	Toolbar.prototype = Object.create(ED.View.prototype);
	Toolbar.prototype.constructor = Toolbar;

	/**
	 * Register a ED.Drawing notification handler. For each event, update
	 * the toolbar state.
	 */
	Toolbar.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'updateState', [
			'doodleAdded',
			'doodleDeleted',
		]);
	};

	/**
	 * Bind UI events.
	 */
	Toolbar.prototype.bindEvents = function() {

		$(document).click(this.hideDrawers.bind(this));

		this.container
		.on('click.' + EVENT_NAMESPACE, '.ed-button-more', this.onMoreButtonClick.bind(this))
		.on('click.' + EVENT_NAMESPACE, '.ed-button', this.onButtonClick.bind(this))
		.on('mouseenter.' + EVENT_NAMESPACE, '.ed-button', this.onButtonMouseEnter.bind(this))
		.on('mouseleave.' + EVENT_NAMESPACE, '.ed-button', this.onButtonMouseLeave.bind(this))
	};

	Toolbar.prototype.enableButton = function(button) {
		button.attr('disabled', false).removeClass('disabled');
	};

	Toolbar.prototype.disableButton = function(button) {
		button.attr('disabled', true).addClass('disabled');
	};

	/**
	 * Update the state of a toolbar button. Find the associated doodle
	 * and determine if the button should be enabled or disabled.
	 * @param  {jQuery} button A jQuery button instance
	 */
	Toolbar.prototype.updateButtonState = function(button) {

		this.enableButton(button);

		var func = button.data('function');
		var arg = button.data('arg');

		// Only update the states for "add doodle" buttons.
		if (func !== 'addDoodle') {
			return;
		}

		var doodle = this.drawing.doodleArray.filter(function(doodle) {
			return (doodle.className === arg);
		})[0];

		if (doodle && doodle.isUnique) {
			this.disableButton(button);
		}
	};

	/**
	 * Update the state of all toolbar buttons.
	 */
	Toolbar.prototype.updateState  = function() {
		this.buttons.each(function(i, button) {
			this.updateButtonState($(button));
		}.bind(this));
	};

	/**
	 * Execute the button function.
	 * @param  {jQuery} button The button jQuery instance.
	 */
	Toolbar.prototype.execButtonFunction = function(button) {

		if (button.hasClass('disabled')) {
			return;
		}

		var fn = button.data('function');
		var arg = button.data('arg');

		if (fn && typeof this.drawing[fn] === 'function') {
			this.drawing[fn](arg);
		} else {
			this.emit('button.error', 'Invalid doodle function: ' + fn);
		}

		this.emit('button.action', {
			fn: fn,
			arg: arg,
			button: button
		});
	};

	Toolbar.prototype.hideDrawers = function() {
		var openDrawers = this.container.find('.ed-drawer-open');
		openDrawers.removeClass('ed-drawer-open');
	}

	/*********************
	 * EVENT HANDLERS
	 *********************/

	/**
	 * Run an action when clicking on a toolbar button.
	 * @param  {Object} e Event object.
	 */
	Toolbar.prototype.onButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		this.hideDrawers();

		var button = $(e.currentTarget);
		this.execButtonFunction(button);
	};

	/**
	 * Show the hidden toolbar when clicking on a more button.
	 * @param  {Object} e Event object.
	 */
	Toolbar.prototype.onMoreButtonClick = function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		this.hideDrawers();

		var button = $(e.currentTarget);
		button.closest('li').addClass('ed-drawer-open');
	};

	/**
	 * Emit mouseenter event on button mouse enter
	 * @param  {Object} e Event object.
	 */
	Toolbar.prototype.onButtonMouseEnter = function(e) {
		this.emit('button.mouseenter', {
			button: $(e.currentTarget)
		});
	};

	/**
	 * Emit mouseleave event on button mouse leave.
	 * @param  {Object} e Event object.
	 */
	Toolbar.prototype.onButtonMouseLeave = function(e) {
		this.emit('button.mouseleave', {
			button: $(e.currentTarget)
		});
	};

	return Toolbar;
}());