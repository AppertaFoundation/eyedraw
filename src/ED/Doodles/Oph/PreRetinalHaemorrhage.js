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
 * Pre-retinal Haemorrhage
 *
 * @class PreRetinalHaemorrhage
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
ED.PreRetinalHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "PreRetinalHaemorrhage";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PreRetinalHaemorrhage.prototype = new ED.Doodle;
ED.PreRetinalHaemorrhage.prototype.constructor = ED.PreRetinalHaemorrhage;
ED.PreRetinalHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PreRetinalHaemorrhage.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PreRetinalHaemorrhage.prototype.setPropertyDefaults = function() {
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(50, 200);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2.0);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2.0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PreRetinalHaemorrhage.prototype.setParameterDefaults = function() {
	this.apexY = 200;

	this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PreRetinalHaemorrhage.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PreRetinalHaemorrhage.superclass.draw.call(this, _point);

	// Dimensions of haemorrhage
	var r = 100;
	var f = 0.6;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.moveTo(r, 0);
	ctx.lineTo(-r, 0);
	ctx.bezierCurveTo(-r * f, 0, -r * f, this.apexY, 0, this.apexY);
	ctx.bezierCurveTo(r * f, this.apexY, r * f, 0, r, 0);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(100, 0));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.PreRetinalHaemorrhage.prototype.groupDescription = function() {
	return "Pre-retinal haemorrages";
}
