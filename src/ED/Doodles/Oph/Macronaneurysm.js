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
 * Blot Haemorrhage
 *
 * @class Macroaneurysm
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Macroaneurysm = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Macroaneurysm";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Macroaneurysm.prototype = new ED.Doodle;
ED.Macroaneurysm.prototype.constructor = ED.Macroaneurysm;
ED.Macroaneurysm.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Macroaneurysm.prototype.setParameterDefaults = function() {
	this.setOriginWithRotations(300, 60, 60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Macroaneurysm.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Macroaneurysm.superclass.draw.call(this, _point);

	// Aneurysm radius
	var r = 50;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// yellow centre spot
		if (this.apexY > -70) {
			ctx.beginPath();
			ctx.arc(0, 0, 25, 0, 2 * Math.PI, true);
			ctx.fillStyle = "rgba(197,186,80,1)";
			ctx.fill();
		}
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Macroaneurysm.prototype.description = function() {
	return "Macroaneurysm";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Macroaneurysm.prototype.snomedCode = function() {
	return 247124009;
}
