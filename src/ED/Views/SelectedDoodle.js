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
 * The selected-doodle view manages interactions on the main doodle selected-doodle.
 */
ED.Views.SelectedDoodle = (function() {

	'use strict';

	/** Constants **/
	var EVENT_NAMESPACE = 'eyedraw.selected-doodle';

	/**
	 * SelectedDoodle constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement} container The widget container element
	 * @extends {EventEmitter2}
	 */
	function SelectedDoodle(drawing, container) {
		ED.View.apply(this, arguments);
		this.select = this.container.find('select');
		this.doodles = this.drawing.doodleArray;
		this.bindEvents();
	}

	SelectedDoodle.prototype = Object.create(ED.View.prototype);
	SelectedDoodle.prototype.constructor = SelectedDoodle;

	/**
	 * Register a ED.Drawing notification handler.
	 */
	SelectedDoodle.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'notificationHandler', [
			'ready',
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected'
		]);
	};

	/**
	 * Bind UI events
	 * @return {[type]}
	 */
	SelectedDoodle.prototype.bindEvents = function() {
		this.select.on('change.' + EVENT_NAMESPACE, this.onSelectChange.bind(this));
	};

	/**
	 * Render the select element.
	 */
	SelectedDoodle.prototype.render = function() {
		var noneOption = '<option ' + (this.drawing.selectedDoodle === null ? ' selected' : '') + '>None</option>';
		this.select.html(noneOption)
		this.select.append(this.doodles.map(this.createOption.bind(this)));
	};

	/**
	 * Create an <option> element.
	 * @param  {ED.Doodle} doodle
	 */
	SelectedDoodle.prototype.createOption = function(doodle) {
		return $('<option />', {
			text: doodle.className,
			selected: (doodle === this.drawing.selectedDoodle)
		}).data('doodle', doodle);
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	SelectedDoodle.prototype.onReady = function() {
		this.render();
	};

	SelectedDoodle.prototype.onDoodleAdded = function(notification) {
		this.render();
	};

	SelectedDoodle.prototype.onDoodleDeleted = function() {
		this.render();
	};

	SelectedDoodle.prototype.onDoodleSelected = function(notification) {
		this.render();
	};

	SelectedDoodle.prototype.onDoodleDeselected = function() {
		this.render();
	};

	SelectedDoodle.prototype.onSelectChange = function(e) {
		var doodle = $(e.target).find(':selected').data('doodle');
		if (!doodle) {
			this.drawing.deselectDoodles();
		} else {
			this.drawing.selectDoodle(doodle);
		}
	};

	return SelectedDoodle;
}());