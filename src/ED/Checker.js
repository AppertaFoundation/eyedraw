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

var ED = ED || {};

/**
 * ED.Checker is used to track when eyedraws are "ready" and execute callbacks
 * when ready. An eyedraw is ready when all doodles have been loaded, thus this
 * checker is *only useful for eyedraws in "view" mode*.
 */
ED.Checker = ED.Checker || (function() {

	'use strict';

	var callbacks = [];
	var instances = [];
	var ready = 0;

	/**
	 * Loop through all the registered callbacks and execute them.
	 */
	function executeCallbacks(){
		callbacks.forEach(function(callback) {
			callback();
		});
	}

	/**
	 * Register a Drawing instance.
	 * @param  {ED.Drawing}   instance A ED.Drawing instance.
	 */
	function register(instance) {

		if (instances.indexOf(instance) !== -1) {
			return;
		}

		// Store instance
		instances.push(instance);

		// Register 'doodlesLoaded' event
		instance.registerForNotifications({
			callback: function onDoodlesLoaded() {
				ready++;
				if (isAllReady()) {
					executeCallbacks();
				}
			}
		}, 'callback', ['doodlesLoaded']);
	}

	/**
	 * Check if all registered EyeDraws are ready.
	 * @return {Boolean}
	 */
	function isAllReady() {
		return (instances.length === ready);
	}

	/**
	 * Register a callback to be executed once all EyeDraws are ready.
	 * @param  {Function} callback The callback to be executed.
	 */
	function allReady(callback) {
		if (isAllReady()) {
			callback();
		} else {
			callbacks.push(callback);
		}
	}

	/**
	 * Returns an eyedraw instance by idSuffix
	 * @param {String} idSuffix The eyedraw instance idSuffix
	 * @return {ED.Drawing} An eyedraw instance.
	 */
	function getInstance(idSuffix) {
		return instances.filter(function(instance) {
			return (instance.idSuffix === idSuffix);
		})[0];
	}

	/**
	 * Resets all eyedraw instances and registered callback functions.
	 */
	function reset() {
		instances = [];
		callbacks = [];
		ready = 0;
	}

	return {
		register: register,
		onAllReady: allReady,
		getInstance: getInstance,
		reset: reset
	};
}());