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

/* global ED: true */

var ED = ED || {};
ED.Views = ED.Views || {};

/**
 * This view class manages the display of the doodle help text within the doodle popup.
 */
ED.Views.DoodlePopup.Help = (function() {

	'use strict';

	/**
	 * Helpers
	 */

	function ifHelpButton(fn) {
		return function(data) {
			return (
				// If it's the help button and it's not disabled then execute fn.
				data.button.hasClass('ed-doodle-help') &&
				!data.button.hasClass('disabled') &&
				fn(data)
			);
		};
	}

	/**
	 * DoodleHelp class
	 * @param {ED.Views.DoodlePopup} doodlePopup The doodle popup view.
	 */
	function DoodleHelp(doodlePopup) {
		this.doodlePopup = doodlePopup;
		this.locked = false;
		this.delayTimer = 0;
		this.bindEvents();
	}

	/**
	 * Bind event handlers
	 */
	DoodleHelp.prototype.bindEvents = function() {

		var doodlePopup = this.doodlePopup;
		doodlePopup.on('render', this.onDoodlePopupRender.bind(this));
		doodlePopup.on('hide', this.onDoodlePopupHide.bind(this));

		var toolbar = doodlePopup.toolbar;
		toolbar.on('button.mouseenter', ifHelpButton(this.onButtonMouseEnter.bind(this)));
		toolbar.on('button.mouseleave', ifHelpButton(this.onButtonMouseLeave.bind(this)));
		toolbar.on('button.action', ifHelpButton(this.onButtonMouseClick.bind(this)));
	};

	/**
	 * Show the help text.
	 */
	DoodleHelp.prototype.showDescription = function() {
		clearTimeout(this.delayTimer);
		this.button.addClass('hover');
		this.doodleInfo.show();
		this.doodleControls.hide();
	};

	/**
	 * Hide the help text.
	 */
	DoodleHelp.prototype.hideDescription = function() {
		clearTimeout(this.delayTimer);
		this.button.removeClass('hover');
		this.doodleInfo.hide();
		this.doodleControls.show();
	};

	/**
	 * EVENT HANDLERS
	 */

	/**
	 * Store reference to elements whenever the doodlePopup view is re-rendered.
	 */
	DoodleHelp.prototype.onDoodlePopupRender = function() {
		this.doodleInfo = this.doodlePopup.container.find('.ed-doodle-info');
		this.doodleControls = this.doodlePopup.container.find('.ed-doodle-controls');
		this.button = this.doodlePopup.toolbar.container.find('.ed-doodle-help');
	};

	/**
	 * Unlock the help whenever the doodle popup is hidden.
	 */
	DoodleHelp.prototype.onDoodlePopupHide = function() {
		this.locked = false;
	};

	/**
	 * On button mouse enter. Delay showing the help text.
	 * @param  {Object} data Event data.
	 */
	DoodleHelp.prototype.onButtonMouseEnter = function() {
		this.delayTimer = setTimeout(this.showDescription.bind(this), 300);
	};

	/**
	 * On button mouse leave, hide the help text if not locked.
	 * @param  {Object} data The event data.
	 */
	DoodleHelp.prototype.onButtonMouseLeave = function() {
		if (!this.locked) {
			this.hideDescription();
		}
	};

	/**
	 * On button mouse click, show or hide the help text.
	 * @param  {Object} data The event data.
	 */
	DoodleHelp.prototype.onButtonMouseClick = function() {
		if (this.locked) {
			this.hideDescription();
		} else {
			this.showDescription();
		}
		this.locked = !this.locked;
	};

	return DoodleHelp;

}());