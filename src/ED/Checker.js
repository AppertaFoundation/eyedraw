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

/**
 * @namespace ED
 * @description Namespace for all EyeDraw classes
 */
var ED = ED || {};

/**
 * ED.Checker is used to track when eyedraws are "ready" and execute callbacks
 * when ready. An eyedraw is ready when all doodles have been loaded.
 * @namespace ED.Checker
 * @memberOf ED
 */
ED.Checker = ED.Checker || (function() {

	'use strict';

	var callbacks = [];
	var ids = [];
	var readyIds = [];
	var instances = {};

	function registerCanvasEyeDraws() {
		$('canvas').each(function() {
			var canvas = $(this);
			var id = this.id;
			// Is it an eyedraw canvas?
			if (canvas.hasClass('ed-canvas-edit') || canvas.hasClass('ed-canvas-display')) {
				storeCanvasId(id);
			}
		});
	}
	$(registerCanvasEyeDraws);

	function storeCanvasId(id) {
    if (ids.indexOf(id) === -1) {
      ids.push(id);
    }
	}

	function removeCanvasId(id) {
		var idx = ids.indexOf(id);
		if (idx > -1) {
			ids.splice(idx, 1);
		}
		idx = readyIds.indexOf(id);
		if (idx > -1) {
      readyIds.splice(idx, 1);
		}
	}

	/**
	 * Loop through all the registered callbacks and execute them.
	 */
	function executeCallbacks(){
		callbacks.forEach(function(callback) {
			callback();
		});
		callbacks = [];
	}

	/**
	 * Register a Drawing instance.
	 * @param  {ED.Drawing}   instance A ED.Drawing instance.
	 */
	function register(instance) {
		// Store instance
		instances[instance.drawingName] = instance;
		storeCanvasId(instance.canvas.id);

		// Register 'doodlesLoaded' event
		instance.registerForNotifications({
			callback: function drawingReady() {
        var id = instance.canvas.id;
				if (readyIds.indexOf(id) === -1) {
					readyIds.push(id);
				}

				if (isAllReady()) {
					executeCallbacks();
				}
			}
		}, 'callback', ['ready']);
	}

	/**
	 * Check if all registered EyeDraws are ready.
	 * @return {Boolean}
	 */
	function isAllReady() {
		return (ids.length === readyIds.length);
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
	 * Returns an eyedraw instance by drawing name.
	 * @param {String} drawingName The eyedraw drawing name
	 * @return {ED.Drawing} An eyedraw instance.
	 */
	function getInstance(drawingName) {
		return instances[drawingName];
	}

	/**
	 * Returns an eyedraw instance by idSuffix.
	 * @param {String} idSuffix The idSuffix of the eyedraw instance.
	 * @return {ED.Drawing} An eyedraw instance.
	 */
	function getInstanceByIdSuffix(idSuffix) {
		return Object.keys(instances).filter(function(key) {
			return instances[key].idSuffix === idSuffix;
		}).map(function(key) {
			return instances[key];
		})[0];
	}

	/**
	 * Resets all eyedraw instances and registered callback functions.
	 */
	function reset() {
		instances = {};
		callbacks = [];
		ids = [];
	}

	function getInternalState()
	{
		return [ids, readyIds];
	}

	function removeMissingCanvasIds()
	{
		$(ids).each(function(idx, id) {
			if (!$('#' + id).length) {
				removeCanvasId(id);
			}
		})
	}

	/**
	 * Get eyedraw instance by drawingName.
	 */
	ED.getInstance = getInstance;

	/**
	 * Public API
	 */
	return {
		register: register,
		onAllReady: allReady,
		isReady: isAllReady,
		getInstance: getInstance,
		getInstanceByIdSuffix: getInstanceByIdSuffix,
		reset: reset,
		resync: removeMissingCanvasIds,
		inspect: getInternalState,
		storeCanvasId: storeCanvasId,

		/** BACKWARDS COMPATABILITY **/
		registerForReady: allReady
	};
}());

/** BACKWARDS COMPATABILITY **/
window.getOEEyeDrawChecker = function() {
	return ED.Checker;
};
