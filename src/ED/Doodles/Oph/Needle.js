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
 * Chandelier (single)
 *
 * @class Needle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Needle = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Needle";

	// Private parameters

	// Derived parameters

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Needle.prototype = new ED.Doodle;
ED.Needle.prototype.constructor = ED.Needle;
ED.Needle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Needle.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Needle.prototype.setPropertyDefaults = function() {

	// Update component of validation array for simple parameters
// 	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
// 	this.parameterValidationArray['apexY']['range'].setMinAndMax(-550, -470);

}

/**
 * Sets default parameters
 */
ED.Needle.prototype.setParameterDefaults = function() {
	this.scaleX = 0.5
	this.scaleY = 0.5
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
// ED.Needle.prototype.dependentParameterValues = function(_parameter, _value) {
// 	var returnArray = new Array();
//
// 	switch (_parameter) {
// 		case 'apexY':
// 			if (_value < -540) returnArray['distance'] = '4.5';
// 			else if (_value < -520) returnArray['distance'] = '4.0';
// 			else if (_value < -500) returnArray['distance'] = '3.5';
// 			else if (_value < -480) returnArray['distance'] = '3.0';
// 			else returnArray['distance'] = '2.5';
// 			break;
//
// 		case 'distance':
// 			if (_value == '4.5') returnArray['apexY'] = -550;
// 			else if (_value == '4.0') returnArray['apexY'] = -530;
// 			else if (_value == '3.5') returnArray['apexY'] = -510;
// 			else if (_value == '3.0') returnArray['apexY'] = -490;
// 			else returnArray['apexY'] = -470;
// 			break;
// 	}
//
// 	return returnArray;
// }

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Needle.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Needle.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Hub
	var y = -250;
	ctx.moveTo(-80, y);
	ctx.lineTo(80, y);
	ctx.lineTo(70, y + 30);
	ctx.lineTo(50, y + 240);
	ctx.lineTo(20, y + 260);
	ctx.lineTo(-20, y + 260);
	ctx.lineTo(-50, y + 240);
	ctx.lineTo(-70, y + 30);
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";

	ctx.fillStyle = "rgba(255, 127, 0, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		var a = 250;

		// Hub top
		ctx.beginPath();
		ctx.moveTo(-70, y + 30);
		ctx.lineTo(70, y + 30);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.stroke();

		// Ridge
		ctx.beginPath();
		ctx.moveTo(-60, y + 130);
		ctx.lineTo(60, y + 130);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.stroke();

		// Flange
		ctx.beginPath();
		ctx.moveTo(0, y + 130);
		ctx.lineTo(0, y + 230);
		ctx.lineWidth = 32;
		ctx.strokeStyle = "rgba(120, 120, 120, 0.2)";
		ctx.stroke();

		// White bit
		ctx.beginPath();
		ctx.moveTo(50, y + 240);
		ctx.lineTo(20, y + 260);
		ctx.lineTo(-20, y + 260);
		ctx.lineTo(-50, y + 240);
		ctx.closePath();
		ctx.lineWidth = 1;
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.stroke();

		// Shaft and tip
		ctx.beginPath();
		ctx.moveTo(-10, y + 260);
		ctx.lineTo(+10, y + 260);
		ctx.lineTo(+10, a + 30);
		ctx.lineTo(-10, a);
		ctx.closePath();
		ctx.fillStyle = "rgba(120, 120, 120, 1)";
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(0, y));

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
ED.Needle.prototype.description = function() {
	return "Needle";
}
