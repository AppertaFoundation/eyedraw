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
 * SwollenDisc
 *
 * @class SwollenDisc
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SwollenDisc = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SwollenDisc";

	// Saved parameters
	this.savedParameterArray = ['originX'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.SwollenDisc.prototype = new ED.Doodle;
ED.SwollenDisc.prototype.constructor = ED.SwollenDisc;
ED.SwollenDisc.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.SwollenDisc.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.addAtBack = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.SwollenDisc.prototype.setParameterDefaults = function() {
	this.originY = 0;
	if (this.drawing.hasDoodleOfClass('PostPole')) {
		this.originX = this.drawing.eye == ED.eye.Right ? 300 : -300;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SwollenDisc.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SwollenDisc.superclass.draw.call(this, _point);

	// Radii
	var ro = 140;
	var ri = 80;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, Math.PI * 2, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, Math.PI * 2, 0, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;

	// Colors for gradient
	yellowColour = "rgba(255, 255, 0, 0.75)";
	var brownColour = "rgba(240, 140, 40, 0.75)";

	// Radial gradient
	var gradient = ctx.createRadialGradient(0, 0, ro, 0, 0, ri);
	gradient.addColorStop(0, yellowColour);
	gradient.addColorStop(1, brownColour);

	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SwollenDisc.prototype.description = function() {
	return "Swollen disc";
}
