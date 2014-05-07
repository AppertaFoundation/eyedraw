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

ED.Views.DoodlePopup.Help = (function() {

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

		// Store a reference to the elements each time the doodle popup is re-rendered.
		var doodlePopup = this.doodlePopup;
		doodlePopup.on('render', this.onDoodlePopupRender.bind(this));
		doodlePopup.on('hide', this.onDoodlePopupHide.bind(this));

		// Bind handlers for doodle events on the toolbar.
		var toolbar = doodlePopup.toolbar;
		toolbar.on('button.mouseenter', this.curryEvent(this.onButtonMouseEnter.bind(this)));
		toolbar.on('button.mouseleave', this.curryEvent(this.onButtonMouseLeave.bind(this)));
		toolbar.on('button.action', this.curryEvent(this.onButtonMouseClick.bind(this)));
	};

	/**
	 * Only execute the handler if the button is the (enabled) help button.
	 * @param  {Function} fn The handler function to execute.
	 */
	DoodleHelp.prototype.curryEvent = function(fn) {
		return function(data) {
			return (
				data.button.hasClass('ed-doodle-help')
				&& !data.button.hasClass('disabled')
				&& fn(data)
			);
		}
	};

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

		(this.locked)
			? this.hideDescription()
			: this.showDescription();

		this.locked = !this.locked;
	};

	return DoodleHelp;

}());