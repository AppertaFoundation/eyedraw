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
 * 'U' tear
 *
 * @class UTear
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
ED.UTear = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "UTear";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.UTear.prototype = new ED.Doodle;
ED.UTear.prototype.constructor = ED.UTear;
ED.UTear.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.UTear.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.UTear.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.UTear.prototype.setParameterDefaults = function() {
	this.apexY = -20;

	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var p = new ED.Point(doodle.originX, doodle.originY);

		var np = new ED.Point(0, 0);
		np.setWithPolars(p.length(), p.direction() + Math.PI / 6);

		this.move(np.x, np.y);
	} else {
		this.move((this.drawing.eye == ED.eye.Right ? -1 : 1) * 200, -300);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.UTear.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.UTear.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// U tear
	ctx.moveTo(0, 40);
	ctx.bezierCurveTo(-20, 40, -40, -20, -40, -40);
	ctx.bezierCurveTo(-40, -60, -20, this.apexY, 0, this.apexY);
	ctx.bezierCurveTo(20, this.apexY, 40, -60, 40, -40);
	ctx.bezierCurveTo(40, -20, 20, 40, 0, 40);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Calculate arc (Arc property not used naturally in this doodle)
	this.leftExtremity = this.transform.transformPoint(new ED.Point(-40, -40));
	this.rightExtremity = this.transform.transformPoint(new ED.Point(40, -40));
	this.arc = this.calculateArc();

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.groupDescription = function() {
	return "'U' tear at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.description = function() {
	return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.groupDescriptionEnd = function() {
	return " o'clock";
}
