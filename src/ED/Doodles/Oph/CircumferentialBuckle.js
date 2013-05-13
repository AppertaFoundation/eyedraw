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
 * CircumferentialBuckle buckle
 *
 * @class CircumferentialBuckle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CircumferentialBuckle = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CircumferentialBuckle";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CircumferentialBuckle.prototype = new ED.Doodle;
ED.CircumferentialBuckle.prototype.constructor = ED.CircumferentialBuckle;
ED.CircumferentialBuckle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CircumferentialBuckle.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CircumferentialBuckle.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-410, -320);
}

/**
 * Sets default parameters
 */
ED.CircumferentialBuckle.prototype.setParameterDefaults = function() {
	this.arc = 140 * Math.PI / 180;
	this.apexY = -320;
	this.rotation = -45 * Math.PI / 180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CircumferentialBuckle.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CircumferentialBuckle.superclass.draw.call(this, _point);

	// Radii
	var ro = 320;
	if (-350 > this.apexY && this.apexY > -380) ro = 350;
	else if (this.apexY < -380) ro = 410;
	var ri = 220;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of CircumferentialBuckle
	var topRightX = ro * Math.sin(theta);
	var topRightY = -ro * Math.cos(theta);
	var topLeftX = -ro * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Gutter path
		ctx.beginPath();

		var gut = 30;

		rgi = ri + (ro - ri - gut) / 2;
		rgo = ro - (ro - ri - gut) / 2;

		// Arc across
		ctx.arc(0, 0, rgo, arcStart, arcEnd, true);

		// Arc back
		ctx.arc(0, 0, rgi, arcEnd, arcStart, false);

		ctx.closePath();

		ctx.fill();
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, -ro));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CircumferentialBuckle.prototype.description = function() {
	var returnString = "";

	// Size description
	if (this.apexY <= -380) returnString = "280 circumferential buckle ";
	else if (this.apexY <= -350) returnString = "279 circumferential buckle ";
	else returnString = "277 circumferential buckle ";

	// Location (clockhours)
	if (this.arc > Math.PI * 1.8) returnString += "encirclement";
	else returnString += this.clockHourExtent() + " o'clock";

	return returnString;
}
