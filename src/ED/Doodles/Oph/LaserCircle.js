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
 * Laser circle
 *
 * @class LaserCircle
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
ED.LaserCircle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "LaserCircle";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserCircle.prototype = new ED.Doodle;
ED.LaserCircle.prototype.constructor = ED.LaserCircle;
ED.LaserCircle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserCircle.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, true);
}

/**
 * Set default properties
 */
ED.LaserCircle.prototype.setPropertyDefaults = function() {
	//this.isOrientated = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(50, +400);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserCircle.prototype.setParameterDefaults = function() {
	this.apexX = 84;
	this.apexY = -84;

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
ED.LaserCircle.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.LaserCircle.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	ctx.moveTo(this.apexX, this.apexY);
	ctx.lineTo(this.apexX, -this.apexY);
	ctx.lineTo(-this.apexX, -this.apexY);
	ctx.lineTo(-this.apexX, this.apexY);
	ctx.lineTo(this.apexX, this.apexY);
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Spot separation
		var ss = 25;

		// Point for spot
		var p = new ED.Point(0, 0);

		// Difference indicating aspect ratio
		var d = this.apexX + this.apexY;

		// Radius and displacement of semicircle
		if (d < 0) {
			var r = this.apexX;
		} else {
			var r = -this.apexY;
		}

		// Number of spots in a semicircle
		var n = (Math.round(Math.PI / (ss / r)));

		// Draw upper (or left) half
		for (var i = 0; i < n + 1; i++) {
			if (d < 0) {
				var a = -Math.PI / 2 + i * Math.PI / n;
				p.setWithPolars(r, a);
				this.drawLaserSpot(ctx, p.x, p.y + d);
			} else {
				var a = -Math.PI + i * Math.PI / n;
				p.setWithPolars(r, a);
				this.drawLaserSpot(ctx, p.x - d, p.y);
			}
		}

		// Draw lower (or right) half
		for (var i = 1; i < n; i++) {
			if (d < 0) {
				var a = Math.PI / 2 + i * Math.PI / n;
				p.setWithPolars(r, a);
				this.drawLaserSpot(ctx, p.x, p.y - d);
			} else {
				var a = 0 + i * Math.PI / n;
				p.setWithPolars(r, a);
				this.drawLaserSpot(ctx, p.x + d, p.y);
			}
		}

		// Draw connecting straight lines of laser
		n = Math.abs(Math.round(d / ss));
		for (var i = 0; i < 2 * n + 1; i++) {
			if (d < 0) {
				var y = this.apexY + r + i * Math.abs(d / n);
				this.drawLaserSpot(ctx, -r, y);
				this.drawLaserSpot(ctx, r, y);
			} else {
				var x = -this.apexX + r + i * Math.abs(d / n);
				this.drawLaserSpot(ctx, x, -r);
				this.drawLaserSpot(ctx, x, r);
			}
		}
	}

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
ED.LaserCircle.prototype.groupDescription = function() {
	return "laser retinopexy";
}
