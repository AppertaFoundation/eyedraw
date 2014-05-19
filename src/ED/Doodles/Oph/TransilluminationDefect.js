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
 * Transillumination defect
 *
 * @class TransilluminationDefect
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TransilluminationDefect = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TransilluminationDefect";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TransilluminationDefect.prototype = new ED.Doodle;
ED.TransilluminationDefect.prototype.constructor = ED.TransilluminationDefect;
ED.TransilluminationDefect.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TransilluminationDefect.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.TransilluminationDefect.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 8, Math.PI * 2);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TransilluminationDefect.prototype.setParameterDefaults = function() {
	this.arc = 60 * Math.PI / 180;

	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + (this.drawing.eye == ED.eye.Right ? -1 : 1) * (doodle.arc / 2 + this.arc / 2 + Math.PI / 12);
	} else {
		this.rotation = (this.drawing.eye == ED.eye.Right ? -1 : 1) * this.arc / 2;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TransilluminationDefect.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TransilluminationDefect.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 380;
	var ri = 280;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of TransilluminationDefect
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
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
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Spot data
		var sr = 30;
		var inc = Math.PI / 8;

		// Iterate through radius and angle to draw spots
		for (var a = -Math.PI / 2 - arcStart + inc / 2; a < this.arc - Math.PI / 2 - arcStart; a += inc) {
			var p = new ED.Point(0, 0);
			p.setWithPolars(r, a);
			
			// Circle
			//this.drawCircle(ctx, p.x, p.y, sr, "rgba(255,255,255,1)", 4, "rgba(255,255,255,1)");
			
			// Slit
			var p1 = new ED.Point(0,0);
			p1.setWithPolars(r - sr, a);
			var p2 = new ED.Point(0,0);
			p2.setWithPolars(r + sr, a);
			var phi = Math.PI/40;
			var cp1 = new ED.Point(0,0);
			cp1.setWithPolars(r, a - phi);
			var cp2 = new ED.Point(0,0);
			cp2.setWithPolars(r, a + phi);
			
			ctx.save();

			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.quadraticCurveTo(cp1.x, cp1.y, p2.x, p2.y);
			ctx.quadraticCurveTo(cp2.x, cp2.y, p1.x, p1.y);
			
			ctx.fillStyle = "rgba(255,255,255,1)";
			ctx.fill();				
			ctx.lineWidth = 4;
			ctx.strokeStyle = "rgba(255,255,255,1)";
			ctx.stroke();
			
			ctx.restore();			
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.TransilluminationDefect.prototype.groupDescription = function() {
	return "Transillumination defects of iris";
}
