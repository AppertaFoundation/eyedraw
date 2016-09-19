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
 * Eyeball
 *
 * @class Eyeball
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Eyeball = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Eyeball";

	// Saved parameters
// 	this.savedParameterArray = [];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Eyeball.prototype = new ED.Doodle;
ED.Eyeball.prototype.constructor = ED.Eyeball;
ED.Eyeball.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Eyeball.prototype.setHandles = function() {
}

/**
 * Sets default dragging attributes
 */
ED.Eyeball.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isFilled = false;
}

/**
 * Sets default parameters
 */
ED.Eyeball.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Eyeball.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Eyeball.superclass.draw.call(this, _point);

	// Radius
	var r = 250;

	// Boundary path
	ctx.beginPath();

	
	// Boundary path
	ctx.beginPath();

	// Main eyeball
	ctx.arc(0, 0, r, 0, 2*Math.PI, true);

	// Close path
	ctx.closePath();

	// Set drawing attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "black";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// iris
		var rI = 120;
		ctx.beginPath();
		ctx.moveTo(0+rI, 0);
		ctx.arc(0,0,rI, 0, 2*Math.PI);
		ctx.fillStyle = "gray";
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		// pupil
		var rP = 50;
		ctx.beginPath();
		ctx.moveTo(0+rP, 0);
		ctx.arc(0,0,rP, 0, 2*Math.PI);
		ctx.fillStyle = "black";
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
