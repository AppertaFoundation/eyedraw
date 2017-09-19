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
 * RadialSponge
 *
 * @class RadialSponge
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RadialSponge = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RadialSponge";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RadialSponge.prototype = new ED.Doodle;
ED.RadialSponge.prototype.constructor = ED.RadialSponge;
ED.RadialSponge.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.RadialSponge.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.RadialSponge.prototype.setParameterDefaults = function() {
	// Make rotation 30 degrees to last one of same class
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + Math.PI / 6;
	} else {
		this.rotation = -60 * Math.PI / 180
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RadialSponge.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RadialSponge.superclass.draw.call(this, _point);

	// Radii
	var y = -220;
	var h = 200;
	var w = 80;

	// Boundary path
	ctx.beginPath();

	ctx.moveTo(-w / 2, y);
	ctx.lineTo(-w / 2, y - h);
	ctx.lineTo(w / 2, y - h);
	ctx.lineTo(w / 2, y);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "lightgray";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Knot
		ctx.arc(0, y - h + 40, 5, 0, Math.PI * 2, true);
		ctx.lineTo(-20, y - h + 30);
		ctx.moveTo(0, y - h + 40);
		ctx.lineTo(20, y - h + 30);

		// Suture
		ctx.moveTo(-w / 2 - 20, y - 40);
		ctx.lineTo(-w / 2 - 20, y - h + 40);
		ctx.lineTo(w / 2 + 20, y - h + 40);
		ctx.lineTo(w / 2 + 20, y - 40);
		ctx.closePath();
		ctx.stroke();
	}

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
ED.RadialSponge.prototype.groupDescription = function() {
	return "Radial sponge at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RadialSponge.prototype.description = function() {
	// Location (clockhours)
	return this.clockHour() + " o'clock";
}
