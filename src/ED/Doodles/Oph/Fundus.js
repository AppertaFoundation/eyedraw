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
 * Fundus template with disc and arcades, extends to ora. Natively right eye, flipFundus for left eye
 *
 * @class Fundus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Fundus = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Fundus";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Fundus.prototype = new ED.Doodle;
ED.Fundus.prototype.constructor = ED.Fundus;
ED.Fundus.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.Fundus.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;
	this.isFilled = false;
	this.showsToolTip = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fundus.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Fundus.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Ora
	ctx.arc(0, 0, 480, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// These values different for right and left side
		if (this.drawing.eye != ED.eye.Right) {
			var startX = 200;
			var midX = 100;
			var ctrlX = -50;
			var endX = -100;
			var foveaX = 100;
		} else {
			var startX = -200;
			var midX = -100;
			var ctrlX = 50;
			var endX = 100;
			var foveaX = -100;
		}

		// Superior arcades
		ctx.moveTo(startX, -50);
		ctx.bezierCurveTo(midX, -166, 0, -62, 0, -12);
		ctx.bezierCurveTo(0, -40, ctrlX, -100, endX, -50);

		// Inferior arcades
		ctx.moveTo(startX, 50);
		ctx.bezierCurveTo(midX, 166, 0, 62, 0, 12);
		ctx.bezierCurveTo(0, 40, ctrlX, 100, endX, 50);

		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);

		// Optic disc and cup
		ctx.moveTo(25, 0);
		ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
		ctx.moveTo(12, 0);
		ctx.arc(0, 0, 12, 0, Math.PI * 2, true);

		// Draw it
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
