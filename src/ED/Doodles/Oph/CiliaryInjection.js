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
 * CiliaryInjection
 *
 * @class CiliaryInjection
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
ED.CiliaryInjection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "CiliaryInjection";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CiliaryInjection.prototype = new ED.Doodle;
ED.CiliaryInjection.prototype.constructor = ED.CiliaryInjection;
ED.CiliaryInjection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CiliaryInjection.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.CiliaryInjection.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.CiliaryInjection.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 90 * Math.PI / 180;

	// Make a second one 90 degress to last one of same class
	this.setRotationWithDisplacements(90, -120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CiliaryInjection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CiliaryInjection.superclass.draw.call(this, _point);

	// Radii
	var ro = 480;
	var ri = 400;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(218,230,241,0)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line
	ctx.strokeStyle = "rgba(218,230,241,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Total number of vessels in a 360 arc
		var t = 60;

		// Number in the current arc and angular separation
		var phi = 2 * Math.PI / t;
		var n = Math.floor(this.arc / phi);

		// Start and end points of vessel
		var sp = new ED.Point(0, 0);
		var ep = new ED.Point(0, 0);

		ctx.beginPath();

		// Radial lines		
		for (var i = 0; i < n; i++) {
			var theta = Math.PI / 2 + arcEnd + i * phi;
			sp.setWithPolars(ro, theta);
			ep.setWithPolars(ri, theta);

			ctx.moveTo(sp.x, sp.y);
			ctx.lineTo(ep.x, ep.y);
		}

		ctx.strokeStyle = "red";
		ctx.lineWidth = 16;
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.CiliaryInjection.prototype.groupDescription = function() {
	return "Ciliary injection ";
}
