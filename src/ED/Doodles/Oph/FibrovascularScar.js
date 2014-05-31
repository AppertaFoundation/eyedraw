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
 * FibrovascularScar
 *
 * @class FibrovascularScar
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.FibrovascularScar = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "FibrovascularScar";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.FibrovascularScar.prototype = new ED.Doodle;
ED.FibrovascularScar.prototype.constructor = ED.FibrovascularScar;
ED.FibrovascularScar.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FibrovascularScar.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.FibrovascularScar.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters
 */
ED.FibrovascularScar.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FibrovascularScar.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.FibrovascularScar.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of FibrovascularScar
	var r = 80;

	// Parameters of random curve
	var n = 16;
	var phi = 2 * Math.PI / n;
	var th = 0.5 * Math.PI / n;
	var b = 4;
	var point = new ED.Point(0, 0);

	// First point
	var fp = new ED.Point(0, 0);
	fp.setWithPolars(r, 0);
	ctx.moveTo(fp.x, fp.y);
	var rl = r;

	// Subsequent points
	for (var i = 0; i < n; i++) {
		// Get radius of next point
		var rn = r * (b + ED.randomArray[i]) / b;

		// Control point 1
		var cp1 = new ED.Point(0, 0);
		cp1.setWithPolars(rl, i * phi + th);

		// Control point 2
		var cp2 = new ED.Point(0, 0);
		cp2.setWithPolars(rn, (i + 1) * phi - th);

		// Next point
		var pn = new ED.Point(0, 0);
		pn.setWithPolars(rn, (i + 1) * phi);

		// Assign next point
		rl = rn;

		// Next point
		if (i == n - 1) {
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, fp.x, fp.y);
		} else {
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pn.x, pn.y);
		}

		// Control handle point
		if (i == 1) {
			point.x = pn.x;
			point.y = pn.y;
		}
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(255,255,190,1)";
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Yellow centre
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.8, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = "rgba(255,255,230,1)";
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.FibrovascularScar.prototype.description = function() {
	return "Fibrovascular scar";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
// ED.FibrovascularScar.prototype.snomedCode = function() {
// 	return 314517003;
// }

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
// ED.FibrovascularScar.prototype.diagnosticHierarchy = function() {
// 	return 2;
// }
