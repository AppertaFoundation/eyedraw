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
 * EncirclingBand buckle
 *
 * @class EncirclingBand
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.EncirclingBand = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "EncirclingBand";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.EncirclingBand.prototype = new ED.Doodle;
ED.EncirclingBand.prototype.constructor = ED.EncirclingBand;
ED.EncirclingBand.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.EncirclingBand.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.addAtBack = true;
	this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.EncirclingBand.prototype.setParameterDefaults = function() {
	this.rotation = -45 * Math.PI / 180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EncirclingBand.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.EncirclingBand.superclass.draw.call(this, _point);

	// Radii
	var r = 270;
	// If Buckle there, take account of  size
	var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
	if (doodle) {
		var da = doodle.apexY;
		if (-350 > da && da > -380) r = 286;
		else if (da < -380) r = 315;
	}

	var ro = r + 15;
	var ri = r - 15;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Watzke
		ctx.beginPath();

		var theta = Math.PI / 16;

		// Arc across to mirror image point on the other side
		ctx.arc(0, 0, ro + 10, theta, -theta, true);

		// Arc back to mirror image point on the other side
		ctx.arc(0, 0, ri - 10, -theta, theta, false);

		// Close path
		ctx.closePath();
		ctx.lineWidth = 6;
		ctx.stroke();
	}

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EncirclingBand.prototype.description = function() {
	var returnString = "Encircling band, with Watzke in ";

	// Get side
	if (this.drawing.eye == ED.eye.Right) {
		var isRightSide = true;
	} else {
		var isRightSide = false;
	}

	// Use trigonometry on rotation field to determine quadrant
	var angle = this.rotation + Math.PI / 2;
	returnString = returnString + (Math.cos(angle) > 0 ? "supero" : "infero");
	returnString = returnString + (Math.sin(angle) > 0 ? (isRightSide ? "nasal" : "temporal") : (isRightSide ? "temporal" : "nasal"));
	returnString = returnString + " quadrant";

	return returnString;
}
