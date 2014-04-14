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

/**
 * Initialise an EyeDraw widget.
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
ED.init = function(properties) {

	// Get reference to the drawing canvas
	var canvas = document.getElementById(properties.canvasId);

	// Get reference to the widgget container
	var container = $(canvas).closest('.eyedraw-widget');

	// Options array for drawing object
	var drawingOptions = {
		offsetX: properties.offsetX,
		offsetY: properties.offsetY,
		toImage: properties.toImage,
		graphicsPath: properties.graphicsPath
	};

	// Drawing
	var drawing = new ED.Drawing(canvas, properties.eye, properties.idSuffix, properties.isEditable, drawingOptions);

	// Views
	var toolbar = new ED.Views.Toolbar(drawing, container.find('.eyedraw-toolbar-panel'));
	var doodlePopup = new ED.Views.DoodlePopup(drawing, container);

	// Controller
	var controller = new ED.Controller(drawing, toolbar, doodlePopup, container, properties);


	// Initialize drawing
	drawing.init();

	return {
		drawing: drawing,
		toolbar: toolbar,
		doodlePopup: doodlePopup,
		controller: controller
	};
};

/** EyeDraw Checker */

/**
 * Let's say there are two eyedraws on the page:
 * For each eyedraw:
 *    Only 1 instance of the EyeChecker is created
 *    An EyeDrawReadyListener instance is created
 *          EyeDrawReadyListener registers it'self with the EyeChecker instance
 *    If all eyedraws are ready (via the reader notifier event) then execchte the registerForReady method,
 *    which will execute the callback.
 */


