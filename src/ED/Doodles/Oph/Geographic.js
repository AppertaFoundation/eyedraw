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
 * Geographic atrophy with variabel foveal sparing
 *
 * @class Geographic
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Geographic = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "Geographic";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Geographic.prototype = new ED.Doodle;
ED.Geographic.prototype.constructor = ED.Geographic;
ED.Geographic.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Geographic.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Geographic.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters
 */
ED.Geographic.prototype.setParameterDefaults = function() {
	this.apexY = -100;
	this.scaleX = 0.7;
	this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Geographic.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Geographic.superclass.draw.call(this, _point);

	// Radius of limbus
	var ro = 200;
	var ri = -this.apexY;
	var phi = -this.apexY * Math.PI / 800;

	// Boundary path
	ctx.beginPath();

	var point = new ED.Point(0, 0);

	// Outer arc
	if (this.drawing.eye == ED.eye.Right) {
		ctx.arc(0, 0, ro, phi, 2 * Math.PI - phi, false);
		point.setWithPolars(ri, Math.PI / 2 - phi);
		ctx.lineTo(point.x, point.y);
		ctx.arc(0, 0, ri, 2 * Math.PI - phi, phi, true);
	} else {
		ctx.arc(0, 0, ro, Math.PI - phi, -Math.PI + phi, true);
		point.setWithPolars(ri, phi - Math.PI / 2);
		ctx.lineTo(point.x, point.y);
		ctx.arc(0, 0, ri, -Math.PI + phi, Math.PI - phi, false);
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,50,0.8)";
	ctx.strokeStyle = "rgba(100,100,100,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	point = new ED.Point(0, 0);
	point.setWithPolars(ro, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.Geographic.prototype.description = function() {
	return "Geographic atrophy";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Geographic.prototype.snomedCode = function() {
	return 414875008;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Geographic.prototype.diagnosticHierarchy = function() {
	return 2;
}
