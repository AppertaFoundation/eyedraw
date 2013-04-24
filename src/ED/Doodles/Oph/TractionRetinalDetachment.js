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
 * TractionRetinalDetachment
 *
 * @class TractionRetinalDetachment
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
ED.TractionRetinalDetachment = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "TractionRetinalDetachment";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TractionRetinalDetachment.prototype = new ED.Doodle;
ED.TractionRetinalDetachment.prototype.constructor = ED.TractionRetinalDetachment;
ED.TractionRetinalDetachment.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TractionRetinalDetachment.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.TractionRetinalDetachment.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.TractionRetinalDetachment.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(200, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TractionRetinalDetachment.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TractionRetinalDetachment.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Move to centre
	var r = 60;
	var s = 150;
	ctx.moveTo(-s, -s);

	// Create curves for the TractionRetinalDetachment
	ctx.bezierCurveTo(-r, -r, r, -r, s, -s);
	ctx.bezierCurveTo(r, -r, r, r, s, s);
	ctx.bezierCurveTo(r, r, -r, r, -s, s);
	ctx.bezierCurveTo(-r, r, -r, -r, -s, -s);
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(s, -s));

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
ED.TractionRetinalDetachment.prototype.groupDescription = function() {
	return "Traction retinal detachment ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.TractionRetinalDetachment.prototype.description = function() {
	return this.locationRelativeToDisc();
}
