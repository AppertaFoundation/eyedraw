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

/* global $: false, ED: true */

var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * This view class manages the selected doodle dropdown.
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
	function SelectedDoodle() {
		ED.View.apply(this, arguments);
		this.select = this.container.find('select');
		this.bindEvents();
	}

	SelectedDoodle.prototype = Object.create(ED.View.prototype);
	SelectedDoodle.prototype.constructor = SelectedDoodle;

	/**
	 * Register a ED.Drawing notification handler. For each event, re-render the view.
	 */
	SelectedDoodle.prototype.registerForNotifications = function() {
		this.drawing.registerForNotifications(this, 'render', [
			'ready',
			'doodleAdded',
			'doodleDeleted',
			'doodleSelected',
			'doodleDeselected',
			'moveToFront',
			'moveToBack',
			'doodleLocked',
			'doodleUnlocked'
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
	SelectedDoodle.prototype.render = function(notification) {

		var optgroup = $('<optgroup label="Selected doodle" />');

		// "None" option
		var noneText = 'None';
		var noneSelected = (this.drawing.selectedDoodle === null);
		optgroup.append(this.createOption(noneText, noneSelected));

		// Doodle options
		var doodleOptions = this.drawing.doodleArray.map(this.createDoodleOption.bind(this));
		optgroup.append(doodleOptions);

		this.select.html(optgroup);
	};

	/**
	 * Create a jQuery instance for an <option> element.
	 * @param  {String} text     The <option> text.
	 * @param  {Boolean} selected Is the option selected?
	 * @return {jQuery}          The jQuery instance.
	 */
	SelectedDoodle.prototype.createOption = function(text, selected) {
		return $('<option />', {
			text: text,
			selected: selected
		});
	};

	/**
	 * Create an doodle jQuery option element.
	 * @param  {ED.Doodle} doodle
	 * @return {jQuery} The jQuery instance.
	 */
	SelectedDoodle.prototype.createDoodleOption = function(doodle) {

		var text = ED.titles[doodle.className] || doodle.className
		var selected = (doodle === this.drawing.selectedDoodle);

		// Find matching doodles, in order of created time.
		var doodles = this.drawing.doodleArray.filter(function(d) {
			return (d.className === doodle.className);
		}).sort(function(a, b) {
			return (a.createdTime - b.createdTime);
		});

		if (doodles.length > 1) {
			// Find the index of this doodle within the set of matching doodles.
			var index = doodles.indexOf(doodle);
			text += ' (' + (index + 1) + ')';
		}

		if (doodle.isLocked) {
			text += ' (Locked)';
		}

		var option = this.createOption(text, selected);

		// Store the doodle reference
		option.data('doodle', doodle);

		return option;
	};

	/*********************
	 * EVENT HANDLERS
	 *********************/

	/**
	 * Select a doodle or de-select all doodles (when selecting "none")
	 * @param  {Object} e DOM event object.
	 */
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