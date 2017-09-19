/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Supramid suture
 *
 * @class Supramid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Supramid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Supramid";

	// Other parameters
	this.percent = '80';

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'rotation', 'percent'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'percent':'Percentage of tube'};

	// Bezier segmentation is not linear, so can make fine adjustments here if required
	this.adjustmentArray = {
		'0':0,
		'10':10,
		'20':20,
		'30':30,
		'40':40,
		'50':50,
		'60':60,
		'70':70,
		'80':80,
		'90':90,
		'100':100
	}

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Supramid.prototype = new ED.Doodle;
ED.Supramid.prototype.constructor = ED.Supramid;
ED.Supramid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Supramid.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Supramid.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-800, +800);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-800, +800);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['percent'] = {
		kind: 'other',
		type: 'string',
		list: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Supramid.prototype.setParameterDefaults = function() {
	this.apexX = -660;
	this.apexY = 30;

	// Default value of insertion percentage
	this.setParameterFromString('percent', '80');

	// Make rotation same as tube
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		this.rotation = doodle.rotation;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Supramid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Supramid.superclass.draw.call(this, _point);

	// Get Tube or TubeExtender doodle (Latter takes preference)
	var doodle = this.drawing.lastDoodleOfClass("TubeExtender");

	// Watch condition when Tube extender is added after, since doodle can exist with empty bezierArray
	if (doodle && typeof(doodle.bezierArray['sp']) != 'undefined') {
		this.rotation = doodle.rotation;
	}
	else {
		doodle = this.drawing.lastDoodleOfClass("Tube");
		if (doodle) {
			this.rotation = doodle.rotation;
		}
	}
	
	// Calculate key points for supramid bezier
	var startPoint = new ED.Point(this.apexX, this.apexY);
	var tubePoint = new ED.Point(0, -700);

	// Boundary path
	ctx.beginPath();

	// Rectangle around end of suture
	ctx.rect(this.apexX - 100, this.apexY - 100, 200, 200);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	if (this.isSelected) ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
	else ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		if (doodle && doodle.bezierArray['sp']) {
			// Suture
			var xDev = startPoint.x/Math.abs(startPoint.x) * 100;
			ctx.moveTo(startPoint.x, startPoint.y);
			ctx.bezierCurveTo(startPoint.x + xDev, startPoint.y - 100, tubePoint.x + xDev, tubePoint.y, doodle.bezierArray['sp'].x, doodle.bezierArray['sp'].y);

			// Number of bezier segments
			var nb = 50;

			// Draw Bezier of appropriate length for corrected proportion along curve
			var pc = this.adjustmentArray[this.percent];
			for (var t = 0; t < 1/nb + pc/100; t = t + 1/nb) {
				var nextPoint = doodle.bezierArray['sp'].bezierPointAtParameter(t, doodle.bezierArray['cp1'], doodle.bezierArray['cp2'], doodle.bezierArray['ep']);
				ctx.lineTo(nextPoint.x, nextPoint.y);
			}
		} else {
			// Just straight line to make it appear
			ctx.moveTo(startPoint.x, startPoint.y);
			ctx.lineTo(0, -400);
		}

		// Draw suture
		ctx.lineWidth = 4;
		ctx.strokeStyle = "purple";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Supramid.prototype.description = function() {
	return "Supramid suture " + this.percent + "% along tube";
}
