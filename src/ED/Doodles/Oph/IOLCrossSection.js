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
 * IOL Cross Section ***TODO***
 *
 * @class IOLCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IOLCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IOLCrossSection";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.IOLCrossSection.prototype = new ED.Doodle;
ED.IOLCrossSection.prototype.constructor = ED.IOLCrossSection;
ED.IOLCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.IOLCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +200);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-140, +140);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.IOLCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IOLCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IOLCrossSection.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;

	// Arbitrary radius of curvature
	var r = 420;

	// Displacement of lens from centre
	var ld = 100;

	// Angle of arc
	var theta = Math.asin(h / r);

	// X coordinate of centre of circle
	var x = r * Math.cos(theta);

	// Measurements of nucleus
	var rn = r - 60;

	// Calculate nucleus angles
	var phi = Math.acos(x / rn);

	// Lens
	ctx.beginPath();

	// Draw invisible boundary around lens bag with two sections of circumference of circle
	ctx.arc(ld - x, 0, r, theta, -theta, true);
	ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI - theta, true);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Lens bag
		ctx.beginPath();
		ctx.arc(ld - x, 0, r, theta, -theta, true);
		ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI + 0.6*theta, true);
		ctx.moveTo(ld, 240);
		ctx.arc(ld + x, 0, r, Math.PI - theta, Math.PI - 0.6*theta, false);
		ctx.strokeStyle = "gray";
		ctx.stroke();

		// Lens
		ctx.beginPath();
		ctx.ellipse(100, 0, 160, 20, 0.5 * Math.PI, 0, 2 * Math.PI);
		ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
		ctx.lineWidth = 5;
		ctx.stroke();
		
		// Loops
		ctx.beginPath();
// 		ctx.moveTo(80,0);
		ctx.ellipse(100, 0, 227, 20, 0.5 * Math.PI, 0.5 * Math.PI, 1.2 * Math.PI);
		ctx.moveTo(120,0);
		ctx.ellipse(100, 0, 227, 20, 0.5 * Math.PI, 1.5 * Math.PI, 0.2 * Math.PI);
		ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
		ctx.stroke();
		
		
		// Zonules
		ctx.beginPath();

		// Top zonules
		ctx.moveTo(44 - this.originX + 80, -this.originY - 349);
		ctx.lineTo(80, -207);
		ctx.moveTo(44 - this.originX + 80, -this.originY - 349);
		ctx.lineTo(120, -207);
		ctx.moveTo(44 - this.originX + 120, -this.originY - 349);
		ctx.lineTo(80, -207);
		ctx.moveTo(44 - this.originX + 120, -this.originY - 349);
		ctx.lineTo(120, -207);

		// Bottom zonules
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(80, 207);
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(120, 207);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(80, 207);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(120, 207);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
