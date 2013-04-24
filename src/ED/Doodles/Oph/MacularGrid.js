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
 * Macular Grid
 *
 * @class MacularGrid
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
ED.MacularGrid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "MacularGrid";

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularGrid.prototype = new ED.Doodle;
ED.MacularGrid.prototype.constructor = ED.MacularGrid;
ED.MacularGrid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularGrid.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.MacularGrid.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-150, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularGrid.prototype.setParameterDefaults = function() {
	this.apexY = -100;
	this.scaleX = 0.7;
	this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularGrid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);

	// Radius of outer and inner circle
	var ro = 250;
	var ri = -this.apexY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);

	// Close path
	ctx.closePath();

	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Grid spot separation
		var ss = 60;
		n = Math.floor(2 * ro / ss);
		var start = -n / 2 * ss;

		// Draw spots
		for (var i = 0; i < n + 1; i++) {
			for (var j = 0; j < n + 1; j++) {
				var x = start + i * ss + Math.round((-0.5 + ED.randomArray[i + j]) * 15);
				var y = start + j * ss + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 15);

				// calculate radius of spot position
				var rSq = x * x + y * y;

				// Only draw spots that within area
				if (rSq >= ri * ri && rSq <= ro * ro) {
					this.drawLaserSpot(ctx, x, y);
				}
			}
		}
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(ro, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
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
ED.MacularGrid.prototype.description = function() {
	return "Macular grid laser";
}
