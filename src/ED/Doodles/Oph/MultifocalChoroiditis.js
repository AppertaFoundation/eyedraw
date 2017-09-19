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
 * Multifocal Choroiditis
 *
 * @class MultifocalChoroiditis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MultifocalChoroiditis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MultifocalChoroiditis";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MultifocalChoroiditis.prototype = new ED.Doodle;
ED.MultifocalChoroiditis.prototype.constructor = ED.MultifocalChoroiditis;
ED.MultifocalChoroiditis.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.MultifocalChoroiditis.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isUnique = true;
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MultifocalChoroiditis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MultifocalChoroiditis.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	var rb = 480;

	// Invisible boundary - matches fundus
	ctx.arc(0, 0, rb, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 0, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// PRP spot data
		var sr = 15;
		var si = 30;
		var ss = 48;
		var rs = rb * 0.9;
		var nr = 12;
		var nd = 3
// 		var sd = (2 * sr + si);
// 		var st = 10;

		// Draw spots
		for (var i = 0; i < nr; i++) {
			var theta = i * 2 * Math.PI/nr;

			for (var j = 0; j < nd; j++) {
				var r = (0.5 + j) * rs/nd;
				var p = new ED.Point(0,0);
				p.setWithPolars(r, theta);

				var dis = 80;
				var xd = (ED.randomArray[i + j] - 0.5) * dis;
				var yd = (ED.randomArray[nr * nd + i + j] - 0.5) * dis;
				this.drawCircle(ctx, p.x + xd, p.y + yd, sr, "Yellow", 3, "rgba(255, 128, 0, 1)");
			}
		}
	}

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
ED.MultifocalChoroiditis.prototype.description = function() {
	return "Panretinal photocoagulation";
}
