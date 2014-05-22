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
 * Focal laser
 *
 * @class FocalLaser
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.FocalLaser = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "FocalLaser";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.FocalLaser.prototype = new ED.Doodle;
ED.FocalLaser.prototype.constructor = ED.FocalLaser;
ED.FocalLaser.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FocalLaser.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.FocalLaser.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-75, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FocalLaser.prototype.setParameterDefaults = function() {
	this.apexY = -50;
	this.setOriginWithDisplacements(150, 80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FocalLaser.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);

	// Radius of outer circle
	var ro = -this.apexY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

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
		// Outer ring
		if (this.apexY <= -75) {
			var m = 50;
			var d = m / Math.sqrt(2);
			this.drawLaserSpot(ctx, 0, -m);
			this.drawLaserSpot(ctx, d, -d);
			this.drawLaserSpot(ctx, m, 0);
			this.drawLaserSpot(ctx, d, d);
			this.drawLaserSpot(ctx, 0, m);
			this.drawLaserSpot(ctx, -d, d);
			this.drawLaserSpot(ctx, -m, 0);
			this.drawLaserSpot(ctx, -d, -d);
		}

		// Inner ring
		var i = 25;
		this.drawLaserSpot(ctx, 0, -i);
		this.drawLaserSpot(ctx, i, 0);
		this.drawLaserSpot(ctx, 0, i);
		this.drawLaserSpot(ctx, -i, 0);

		// Central spot
		this.drawLaserSpot(ctx, 0, 0);
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(ro, Math.PI / 4);
	this.handleArray[4].location = this.transform.transformPoint(point);

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
ED.FocalLaser.prototype.groupDescription = function() {
	return "Focal laser";
}
