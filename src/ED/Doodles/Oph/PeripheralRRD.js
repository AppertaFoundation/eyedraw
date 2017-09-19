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
 * Peripheral RRD
 *
 * @class PeripheralRRD
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PeripheralRRD = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PeripheralRRD";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralRRD.prototype = new ED.Doodle;
ED.PeripheralRRD.prototype.constructor = ED.PeripheralRRD;
ED.PeripheralRRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralRRD.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralRRD.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 4, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralRRD.prototype.setParameterDefaults = function() {
	this.arc = 112 * Math.PI / 180;
	this.apexY = -380;

	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		if (this.drawing.eye == ED.eye.Right) {

		}
	} else {
		if (this.drawing.eye == ED.eye.Right) {
			this.rotation = -0.8 * Math.PI;
		} else {
			this.rotation = 0.8 * Math.PI;
		}
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralRRD.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PeripheralRRD.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952 / 2;
	var ri = -this.apexY;
	var r = ri + (ro - ri) / 2;

	// Radius of quarter circle
	var rc = ro - ri;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of PeripheralRRD
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Centre of first quarter circle
	var c1 = new ED.Point(0, 0);
	c1.x = -ro * Math.sin(theta - rc / ro);
	c1.y = -ro * Math.cos(theta - rc / ro);

	// Centre of second quarter circle
	var c2 = new ED.Point(0, 0);
	c2.x = -ro * Math.sin(-theta + rc / ro);
	c2.y = -ro * Math.cos(-theta + rc / ro);

	// Boundary path
	ctx.beginPath();

	// Arc from right to left
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc round first quarter circle (slightly less than 90 degrees)
	var phi = arcEnd - Math.PI / 2;
	ctx.arc(c1.x, c1.y, rc, phi, phi - Math.PI / 2 + rc / ro, true);

	// Arc back to the right
	ctx.arc(0, 0, ri, c1.direction() - Math.PI / 2, c2.direction() - Math.PI / 2, false);

	// Arc round second quarter circle (slightly less than 90 degrees)
	phi = arcStart + Math.PI / 2;
	ctx.arc(c2.x, c2.y, rc, phi + Math.PI / 2 - rc / ro, phi, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.PeripheralRRD.prototype.snomedCode = function() {
	return 232008001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PeripheralRRD.prototype.diagnosticHierarchy = function() {
	return 8;
}
