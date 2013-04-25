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
 * Template for strabismus surgery
 *
 * @class StrabOpTemplate
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
ED.StrabOpTemplate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "StrabOpTemplate";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.StrabOpTemplate.prototype = new ED.Doodle;
ED.StrabOpTemplate.prototype.constructor = ED.StrabOpTemplate;
ED.StrabOpTemplate.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.StrabOpTemplate.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isUnique = true;
	this.isDeletable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.StrabOpTemplate.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.StrabOpTemplate.superclass.draw.call(this, _point);

	// Drawing properties
	var insertionY = -200;
	var insertionHalfWidth = 70;

	// Boundary path
	ctx.beginPath();

	// Cornea
	ctx.arc(0, 0, 80, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(100, 200, 250, 0.75)";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Pupil
		ctx.beginPath();
		ctx.arc(0, 0, 30, 0, Math.PI * 2, true);
		ctx.fillStyle = "black";
		ctx.fill();

		// Insertions
		ctx.beginPath();
		ctx.moveTo(-insertionHalfWidth, insertionY);
		ctx.lineTo(insertionHalfWidth, insertionY);
		ctx.moveTo(insertionY, -insertionHalfWidth);
		ctx.lineTo(insertionY, insertionHalfWidth);
		ctx.moveTo(-insertionHalfWidth, -insertionY);
		ctx.lineTo(insertionHalfWidth, -insertionY);
		ctx.moveTo(-insertionY, -insertionHalfWidth);
		ctx.lineTo(-insertionY, insertionHalfWidth);
		ctx.lineWidth = 16;
		ctx.strokeStyle = "brown";
		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
