/**
 * Javascript file containing functions for the EyeDraw widget
 *
 * @link http://www.openeyes.org.uk/
 * @copyright Copyright &copy; 2012 OpenEyes Foundation
 * @license http://www.yiiframework.com/license/
 * Modification date: 17th August 2012
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; with§§§out even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 0.95
 */

var ED = ED || {};

ED.init = (function() {

	'use strict';

	/**
	 * In some scenarios, we load the eyedraw markup (including all dependent
	 * scripts and stylesheets) via AJAX, and then insert the markup into the DOM. This
	 * causes the scripts to be loaded synchronously, and the stylesheet to be
	 * loaded asynchronously. Some of the eyedraw script relies on the existance of
	 * certain CSS rules, thus we have to ensure the styles are loaded before initiating
	 * the eyedraw.
	 * @param  {String}   fileName  The string to match the filename of the stylesheet.
	 * @param  {Number}   maxTime   The max amount of time to check for existence of stylesheet (ms).
	 * @param  {Function} done      Callback function.
	 */
	function waitForStyleSheet(fileName, maxTime, done, startTime) {

		if (!startTime) {
			startTime = (new Date()).getTime();
		}
		if (((new Date()).getTime() - startTime) >= maxTime) {
			return ED.errorHandler('OEEyeDraw.js', 'waitForStyleSheet', 'Unable to init eyedraw, stylesheet is not loaded.');
		}

		var styleSheets = window.document.styleSheets;
		var i = 0;
		var j = styleSheets.length;

		for(; i < j; i++) {
			var sheet = styleSheets[i];
			if (sheet.href && sheet.href.indexOf(fileName) >= 0) {
				return done();
			}
		}
		window.setTimeout(
			waitForStyleSheet.bind(null, fileName, maxTime, done, startTime), 100);
	}

	/**
	 * Public init method: Initialise an EyeDraw widget.
	 *
	 * @param {object} properties Object of properties passed from widget
	 *     @property drawingName The EyeDraw drawing object
	 *     @property canvasId The DOM id of the associated canvas element
	 *     @property eye The eye (right = 0, left = 1) ***TODO*** handle this better
	 *     @property idSuffix A suffix for DOM elements to distinguish those associated with this drawing object
	 *     @property isEditable Flag indicating whether drawing object is editable or not
	 *     @property graphicsPath Path to folder containing EyeDraw graphics
	 *     @property onReadyCommandArray Array of commands and arguments to be run when images are loaded
	 */
	return function init(properties, done) {
		done = $.isFunction(done) ? done : $.noop;
		waitForStyleSheet('oe-eyedraw', 5000, function() {
			done(new ED.Controller(properties));
		});
	};
}());