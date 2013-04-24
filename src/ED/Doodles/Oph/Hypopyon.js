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
 * Hypopyon
 *
 * @class Hypopyon
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
ED.Hypopyon = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "Hypopyon";

	// Private parameters
	this.ro = 380;
	this.minimum = 304;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Hypopyon.prototype = new ED.Doodle;
ED.Hypopyon.prototype.constructor = ED.Hypopyon;
ED.Hypopyon.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Hypopyon.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Hypopyon.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, this.minimum);
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.Hypopyon.prototype.setParameterDefaults = function() {
	this.apexY = 260;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Hypopyon.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Hypopyon.superclass.draw.call(this, _point);

	// Calculate angle of apex above or below horizontal
	var phi = Math.asin(this.apexY / this.ro);

	// Boundary path
	ctx.beginPath();

	// Arc from point on circumference level with apex point to other side
	ctx.arc(0, 0, this.ro, phi, Math.PI - phi, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(221,209,171,1)";

	// Set line attributes
	ctx.lineWidth = 1;

	// Colour of outer line
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.Hypopyon.prototype.description = function() {
	var height = Math.round(10 * (this.ro - this.apexY) / (2 * this.ro));
	return height + "mm hypopyon";
}
