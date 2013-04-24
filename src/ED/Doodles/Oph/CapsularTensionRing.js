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
 * Capsular Tension Ring
 *
 * @class CapsularTensionRing
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
ED.CapsularTensionRing = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "CapsularTensionRing";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CapsularTensionRing.prototype = new ED.Doodle;
ED.CapsularTensionRing.prototype.constructor = ED.CapsularTensionRing;
ED.CapsularTensionRing.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CapsularTensionRing.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.CapsularTensionRing.prototype.setParameterDefaults = function() {
	this.rotation = -Math.PI / 2;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CapsularTensionRing.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CapsularTensionRing.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radii
	var ro = 360;
	var rm = 340;
	var ri = 300;
	var rh = 15;

	// Half angle of missing arc
	var theta = Math.PI * 0.2;

	// Outer ring
	ctx.arc(0, 0, ro, -theta, theta, true);

	var p1c1 = new ED.Point(0, 0)
	p1c1.setWithPolars(ro, Math.PI / 2 + 0.8 * theta);

	var p1c2 = new ED.Point(0, 0)
	p1c2.setWithPolars(ri, Math.PI / 2 + 0.8 * theta);

	var p1 = new ED.Point(0, 0)
	p1.setWithPolars(ri, Math.PI / 2 + theta);

	var p2c1 = new ED.Point(0, 0)
	p2c1.setWithPolars(ri, Math.PI / 2 + 1.1 * theta);

	var p2c2 = new ED.Point(0, 0)
	p2c2.setWithPolars(rm, Math.PI / 2 + 1.1 * theta);

	var p2 = new ED.Point(0, 0)
	p2.setWithPolars(rm, Math.PI / 2 + 1.2 * theta);

	ctx.bezierCurveTo(p1c1.x, p1c1.y, p1c2.x, p1c2.y, p1.x, p1.y);
	ctx.bezierCurveTo(p2c1.x, p2c1.y, p2c2.x, p2c2.y, p2.x, p2.y);

	// Inner ring
	ctx.arc(0, 0, rm, 1.2 * theta, -1.2 * theta, false);

	var p3c1 = new ED.Point(0, 0)
	p3c1.setWithPolars(rm, Math.PI / 2 - 1.1 * theta);

	var p3c2 = new ED.Point(0, 0)
	p3c2.setWithPolars(ri, Math.PI / 2 - 1.1 * theta);

	var p3 = new ED.Point(0, 0)
	p3.setWithPolars(ri, Math.PI / 2 - theta);

	var p4c1 = new ED.Point(0, 0)
	p4c1.setWithPolars(ri, Math.PI / 2 - 0.8 * theta);

	var p4c2 = new ED.Point(0, 0)
	p4c2.setWithPolars(ro, Math.PI / 2 - 0.8 * theta);

	var p4 = new ED.Point(0, 0)
	p4.setWithPolars(ro, Math.PI / 2 - theta);

	ctx.bezierCurveTo(p3c1.x, p3c1.y, p3c2.x, p3c2.y, p3.x, p3.y);
	ctx.bezierCurveTo(p4c1.x, p4c1.y, p4c2.x, p4c2.y, p4.x, p4.y);

	// Hole in end 1
	var cp1 = new ED.Point(0, 0)
	cp1.setWithPolars(rm - 8, Math.PI / 2 - theta);
	var ep1 = new ED.Point(0, 0)
	ep1.setWithPolars(rm - 8 + rh, Math.PI / 2 - theta);
	ctx.moveTo(ep1.x, ep1.y);
	ctx.arc(cp1.x, cp1.y, 15, 0, 2 * Math.PI, false);

	// Hole in end 2
	var cp2 = new ED.Point(0, 0)
	cp2.setWithPolars(rm - 8, Math.PI / 2 + theta);
	var ep2 = new ED.Point(0, 0)
	ep2.setWithPolars(rm - 8 + rh, Math.PI / 2 + theta);
	ctx.moveTo(ep2.x, ep2.y);
	ctx.arc(cp2.x, cp2.y, 15, 0, 2 * Math.PI, false);

	ctx.closePath();

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CapsularTensionRing.prototype.description = function() {
	var returnValue = "Capsular Tension Ring";

	return returnValue;
}
