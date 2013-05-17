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
 * Peripheral iridectomy
 *
 * @class PI
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.KoeppeNodule = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "KoeppeNodule";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.KoeppeNodule.prototype = new ED.Doodle;
ED.KoeppeNodule.prototype.constructor = ED.KoeppeNodule;
ED.KoeppeNodule.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.KoeppeNodule.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.KoeppeNodule.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(30, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.KoeppeNodule.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.KoeppeNodule.superclass.draw.call(this, _point);

	// Radius of iris margin
	var r = 260;
	
	// If iris there, take account of pupil size
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) r = -doodle.apexY;
	
	// Boundary path
	ctx.beginPath();

	// Draw nodule
	ctx.arc(0, -r, 20, 0, 2 * Math.PI, false);

	// Colour of fill
	ctx.fillStyle = "rgba(237,194,124,1)";

	// Set line attributes
	ctx.lineWidth = 1;

	// Colour of outer line is dark gray
	ctx.strokeStyle = ctx.fillStyle;

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
ED.KoeppeNodule.prototype.groupDescription = function() {
	return "KoeppeNodules";
}
