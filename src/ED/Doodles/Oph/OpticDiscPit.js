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
 * OpticDiscPit Acquired Pit of Optic Nerve (APON)
 *
 * @class OpticDiscPit
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OpticDiscPit = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "OpticDiscPit";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OpticDiscPit.prototype = new ED.Doodle;
ED.OpticDiscPit.prototype.constructor = ED.OpticDiscPit;
ED.OpticDiscPit.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDiscPit.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.OpticDiscPit.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-200, +200);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-240, +240);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters
 */
ED.OpticDiscPit.prototype.setParameterDefaults = function() {
	this.originX = 0;
	this.originY = 220;
	this.apexY = 0;
	this.scaleX = 1.5;

	// First pit at 6, second at 12, others somewhere else (won't usually be more than 2)
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		if (this.drawing.numberOfDoodlesOfClass(this.className) == 1) {
			this.originY = -220;
		}
		else {
			this.setOriginWithDisplacements(-60, -60);
		}
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDiscPit.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.OpticDiscPit.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Round hole
	var r = 80;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Radial gradient
	var lightGray = "rgba(200, 200, 200, 0.75)";
	var darkGray = "rgba(100, 100, 100, 0.75)";
	var gradient = ctx.createRadialGradient(0, 0, r, 0, 0, 10);
	gradient.addColorStop(0, darkGray);
	gradient.addColorStop(1, lightGray);

	ctx.fillStyle = gradient;
	ctx.lineWidth = 2;
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(55, -55));

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
ED.OpticDiscPit.prototype.description = function() {
	return "Acquired pit of optic nerve";
}
