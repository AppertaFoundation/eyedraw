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

/* global EventEmitter2: false, $: false */

var ED = ED || {};

/**
 * Base view.
 */
ED.View = (function() {

	'use strict';

	/** Helpers */
	var ucFirst = ED.firstLetterToUpperCase;

	/**
	 * View constructor
	 * @param {ED.Drawing} drawing   A doodle drawing instance.
	 * @param {HTMLElement|jQuery} widgetContainer The widget container element
	 * @extends {EventEmitter2}
	 */
	function View(drawing, container) {
		EventEmitter2.call(this);
	}

	View.prototype = Object.create(EventEmitter2.prototype);
	View.prototype.constructor = View;

	/**
	 * This notification handler will simply route events to handlers.
	 * @param  {Object} notification The notification object.
	 */
	View.prototype.notificationHandler = function(notification) {
		var eventName = notification.eventName;
		var handlerName = 'on' + ucFirst(eventName);
		if (!this[handlerName]) {
			console.error('No handler defined for event:', handlerName);
		}
		this[handlerName](notification);
	};

	return View;
}());
