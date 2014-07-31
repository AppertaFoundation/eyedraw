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
 * IrisHook
 *
 * @class IrisHook
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IrisHook = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IrisHook";

	// Saved parameters
	this.savedParameterArray = ['rotation']
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.IrisHook.prototype = new ED.Doodle;
ED.IrisHook.prototype.constructor = ED.IrisHook;
ED.IrisHook.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.IrisHook.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isScaleable = false;
}

/**
 * Sets default parameters
 */
ED.IrisHook.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(45, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IrisHook.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IrisHook.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Length to inner iris
	var length = 260;

	// If iris there, take account of pupil size
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) length = -doodle.apexY;

	ctx.rect(-25, -440, 50, 180 + length);

	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(255,255,255,0)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line
	ctx.strokeStyle = "rgba(120,120,120,0.0)";;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Drawing path
		ctx.beginPath();

		// Stem
		ctx.moveTo(10, -430);
		ctx.lineTo(10, -length + 10);
		ctx.lineTo(-10, -length);
		ctx.lineWidth = 12;
		ctx.strokeStyle = "rgba(120,120,120,0.75)";
		ctx.stroke();

		// Stopper
		ctx.beginPath();
		ctx.moveTo(-20, -400);
		ctx.lineTo(+40, -400);
		ctx.lineWidth = 24;
		ctx.strokeStyle = "rgba(255,120,0,0.75)";
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
ED.IrisHook.prototype.groupDescription = function() {
	return "Iris hooks used at ";
	
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.description = function() {
	var returnString = "";

	returnString += this.clockHour();

	return returnString;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.groupDescriptionEnd = function() {
	return " o'clock";
}
