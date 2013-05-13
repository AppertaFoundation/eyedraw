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
 * Drainage site
 *
 * @class DrainageSite
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.DrainageSite = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "DrainageSite";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.DrainageSite.prototype = new ED.Doodle;
ED.DrainageSite.prototype.constructor = ED.DrainageSite;
ED.DrainageSite.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.DrainageSite.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.DrainageSite.prototype.setParameterDefaults = function() {
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
ED.DrainageSite.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DrainageSite.superclass.draw.call(this, _point);

	// Radii
	var ro = 440;
	var ri = 360;

	// Calculate parameters for arcs
	var theta = Math.PI / 30;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Line to point
	ctx.lineTo(0, -ri);;

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#777";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

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
ED.DrainageSite.prototype.groupDescription = function() {
	return "Drainage site at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DrainageSite.prototype.description = function() {
	// Location (clockhours)
	return this.clockHour() + " o'clock";
}
