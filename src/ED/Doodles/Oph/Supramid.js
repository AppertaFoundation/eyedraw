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
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
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

	// Saved parameters
	this.savedParameterArray = ['apexY', 'originX', 'originY'];

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
	this.isOrientated = true;
	this.isRotatable = false;
	this.snapToQuadrant = true;
	this.quadrantPoint = new ED.Point(10, 10);

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-420, -200);
}

/**
 * Sets default parameters
 */
ED.Supramid.prototype.setParameterDefaults = function() {
	this.apexX = 0;
	this.apexY = -350;
	this.originY = -10;

	// Tubes are usually STQ
	if (this.drawing.eye == ED.eye.Right) {
		this.originX = -10;
		this.rotation = -Math.PI / 4;
	} else {
		this.originX = 10;
		this.rotation = Math.PI / 4;
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

	// Calculate key points for supramid bezier
	var startPoint = new ED.Point(0, this.apexY);
	var tubePoint = new ED.Point(0, -450);
	var controlPoint1 = new ED.Point(0, -600);

	// Calculate mid point x coordinate
	var midPointX = -450;
	var controlPoint2 = new ED.Point(midPointX, -300);
	var midPoint = new ED.Point(midPointX, 0);
	var controlPoint3 = new ED.Point(midPointX, 300);
	var controlPoint4 = new ED.Point(midPointX * 0.5, 450);
	var endPoint = new ED.Point(midPointX * 0.2, 450);

	// Boundary path
	ctx.beginPath();

	// Rectangle around suture
	ctx.moveTo(this.apexX, tubePoint.y);
	ctx.lineTo(midPointX, tubePoint.y);
	ctx.lineTo(midPointX, endPoint.y);
	ctx.lineTo(this.apexX, endPoint.y);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Suture
		ctx.beginPath()
		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.lineTo(tubePoint.x, tubePoint.y);
		ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, midPoint.x, midPoint.y);
		ctx.bezierCurveTo(controlPoint3.x, controlPoint3.y, controlPoint4.x, controlPoint4.y, endPoint.x, endPoint.y);

		ctx.lineWidth = 4;
		ctx.strokeStyle = "purple";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
// ED.Supramid.prototype.getParameter = function(_parameter)
// {
//     var returnValue;
//
//     switch (_parameter)
//     {
//         // Position of end of suture
//         case 'endPosition':
//             var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
//
//             if (r < 280 ) returnValue = 'in the AC';
//             else returnValue = ((r - 280)/14).toFixed(0) + 'mm from limbus';
//             break;
//
//         default:
//             returnValue = "";
//             break;
//     }
//
//     return returnValue;
// }

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Supramid.prototype.description = function() {
	var returnString = "Supramid suture ";

	returnString += this.getParameter('endPosition');

	return returnString;
}
