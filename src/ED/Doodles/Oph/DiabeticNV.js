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
 * DiabeticNV template with disc and arcades
 *
 * @class DiabeticNV
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
ED.DiabeticNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "DiabeticNV";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiabeticNV.prototype = new ED.Doodle;
ED.DiabeticNV.prototype.constructor = ED.DiabeticNV;
ED.DiabeticNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DiabeticNV.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.DiabeticNV.prototype.setPropertyDefaults = function() {}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DiabeticNV.prototype.setParameterDefaults = function() {
	var n = this.drawing.numberOfDoodlesOfClass(this.className);

	switch (n) {
		case 0:
			this.originX = (this.drawing.eye == ED.eye.Right) ? 300 : -300;
			this.originY = -100;
			break;
		case 1:
			this.originX = (this.drawing.eye == ED.eye.Right) ? -176 : 176;
			this.originY = -236;
			break;
		case 2:
			this.originX = (this.drawing.eye == ED.eye.Right) ? -176 : 176;
			this.originY = 236;
			break;
		default:
			this.setOriginWithDisplacements(0, -100);
			break;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiabeticNV.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DiabeticNV.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of NV
	var r = 60;
	var c = r / 2;
	var phi = 0;
	var theta = Math.PI / 8;
	var n = 8;

	// Do a vessel
	var cp1 = new ED.Point(0, 0);
	var cp2 = new ED.Point(0, 0);
	var tip = new ED.Point(0, 0);
	var cp3 = new ED.Point(0, 0);
	var cp4 = new ED.Point(0, 0);

	// Move to centre
	ctx.moveTo(0, 0);

	// Loop through making petals
	var i;
	for (i = 0; i < n; i++) {
		phi = i * 2 * Math.PI / n;

		cp1.setWithPolars(c, phi - theta);
		cp2.setWithPolars(r, phi - theta);
		tip.setWithPolars(r, phi);
		cp3.setWithPolars(r, phi + theta);
		cp4.setWithPolars(c, phi + theta);

		// Draw petal
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tip.x, tip.y);
		ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, 0, 0);
	}

	// Transparent fill
	ctx.fillStyle = "rgba(100, 100, 100, 0)";

	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiabeticNV.prototype.groupDescription = function() {
	return "Diabetic new vessels ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiabeticNV.prototype.description = function() {
	return this.locationRelativeToDisc();
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.DiabeticNV.prototype.snomedCode = function() {
	return 59276001;
}
