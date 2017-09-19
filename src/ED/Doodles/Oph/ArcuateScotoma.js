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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * ArcuateScotoma
 *
 * @class ArcuateScotoma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ArcuateScotoma = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ArcuateScotoma";

	// Saved parameters
	this.savedParameterArray = ['scaleX', 'scaleY', 'apexY', 'arc'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ArcuateScotoma.prototype = new ED.Doodle;
ED.ArcuateScotoma.prototype.constructor = ED.ArcuateScotoma;
ED.ArcuateScotoma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ArcuateScotoma.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.ArcuateScotoma.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(140, +300);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters
 */
ED.ArcuateScotoma.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 60 * Math.PI / 180;
	this.apexX = 200;

	// Eye
	if (this.drawing.eye == ED.eye.Left) this.scaleX = this.scaleX * -1;

	// Make a second one opposite to the first
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.scaleY = doodle.scaleY * -1;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ArcuateScotoma.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ArcuateScotoma.superclass.draw.call(this, _point);

	// Dimensions
	var bs = -100;
	var be = 100;
	var ts = -140;

	var r = (be - bs) / 2;
	var x = bs + r;

	// Boundary path
	ctx.beginPath();

	// Arcuate scotoma base
	ctx.arc(x, 0, r, -Math.PI, 0, false);
	ctx.lineTo(this.apexX, 0);

	// Arcuate scotoma top
	r = (this.apexX - ts) / 2;
	x = ts + r;
	ctx.arc(x, 0, r, 0, -Math.PI, true);
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 6;
	ctx.fillStyle = "gray";
	ctx.strokeStyle = "black";

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
ED.ArcuateScotoma.prototype.description = function() {
	return this.scaleY > 0 ? "Superior" : "Inferior" + " arcuate scotoma";
}
