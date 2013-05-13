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
 * BuckleSuture
 *
 * @class BuckleSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.BuckleSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "BuckleSuture";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Invariant simple parameters
	this.arc = 15 * Math.PI/180;
}

/**
 * Sets superclass and constructor
 */
ED.BuckleSuture.prototype = new ED.Doodle;
ED.BuckleSuture.prototype.constructor = ED.BuckleSuture;
ED.BuckleSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.BuckleSuture.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.willReport = false;
}

/**
 * Sets default parameters
 */
ED.BuckleSuture.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(30, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.BuckleSuture.superclass.draw.call(this, _point);

	// If Buckle there, take account of  size
	var ro = 340;
	var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
	if (doodle) ro = -doodle.apexY + 20;

	var ri = 200;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

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
	this.isFilled = false;
	ctx.strokeStyle = "#666";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Calculate location of suture
		r = ri + (ro - ri) / 2;
		var sutureX = r * Math.sin(theta);
		var sutureY = -r * Math.cos(theta);

		ctx.beginPath();
		ctx.arc(sutureX, sutureY, 5, 0, Math.PI * 2, true);
		ctx.moveTo(sutureX + 20, sutureY + 20);
		ctx.lineTo(sutureX, sutureY);
		ctx.lineTo(sutureX + 20, sutureY - 20);

		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
