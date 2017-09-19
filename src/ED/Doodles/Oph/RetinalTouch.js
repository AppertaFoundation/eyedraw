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
 * RetinalTouch
 *
 * @class RetinalTouch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RetinalTouch = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RetinalTouch";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RetinalTouch.prototype = new ED.Doodle;
ED.RetinalTouch.prototype.constructor = ED.RetinalTouch;
ED.RetinalTouch.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RetinalTouch.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(140, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RetinalTouch.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RetinalTouch.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Circle
	ctx.arc(0, 0, 60, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,0,0,0)";
	ctx.strokeStyle = "rgba(255,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var n = 8;
		var ri = 20;
		var ro = 40;

		ctx.beginPath();

		// Circle
		ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);

		// Radial lines
		var theta = 0;
		for (var i = 0; i < n; i++) {
			theta += 2 * Math.PI / n;
			var sp = new ED.Point(0, 0);
			var ep = new ED.Point(0, 0);
			sp.setWithPolars(ri, theta);
			ep.setWithPolars(ro, theta);

			ctx.moveTo(sp.x, sp.y);
			ctx.lineTo(ep.x, ep.y);
		}

		ctx.lineWidth = 8;
		ctx.strokeStyle = "red";
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
