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
 * Conjunctival flap
 *
 * @class ConjunctivalFlap
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
ED.ConjunctivalFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "ConjunctivalFlap";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ConjunctivalFlap.prototype = new ED.Doodle;
ED.ConjunctivalFlap.prototype.constructor = ED.ConjunctivalFlap;
ED.ConjunctivalFlap.superclass = ED.Doodle.prototype;


/**
 * Sets handle attributes
 */
ED.ConjunctivalFlap.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.ConjunctivalFlap.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-640, -100);
	this.parameterValidationArray['arc']['range'].setMinAndMax(60 * Math.PI / 180, 160 * Math.PI / 180);
}

/**
 * Sets default parameters
 */
ED.ConjunctivalFlap.prototype.setParameterDefaults = function() {
	this.arc = 120 * Math.PI / 180;
	this.apexY = -620;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ConjunctivalFlap.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.NerveFibreDefect.superclass.draw.call(this, _point);

	// Radius of limbus
	var r = 380;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Offset angle for control points
	var phi = this.arc / 6;

	// Apex point
	var apex = new ED.Point(this.apexX, this.apexY);

	// Coordinates of corners of flap
	var right = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));
	var left = new ED.Point(-r * Math.sin(theta), -r * Math.cos(theta));

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

	// Curved flap, bp bezier proportion is adjustment factor
	var bp = 0.8;
	ctx.bezierCurveTo(left.x, left.y, bp * left.x, apex.y, apex.x, apex.y);
	ctx.bezierCurveTo(bp * right.x, apex.y, right.x, right.y, right.x, right.y);

	// Colour of fill
	ctx.fillStyle = "rgba(255,255,255,0.5)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(left);
	this.handleArray[3].location = this.transform.transformPoint(right);
	this.handleArray[4].location = this.transform.transformPoint(apex);

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
ED.ConjunctivalFlap.prototype.description = function() {
	return (this.apexY < -280 ? "Fornix based " : "Limbus based ") + "flap";
}
