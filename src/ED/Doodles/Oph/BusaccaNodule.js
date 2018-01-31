/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

/**
 * Peripheral iridectomy
 *
 * @class PI
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.BusaccaNodule = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "BusaccaNodule";

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.BusaccaNodule.prototype = new ED.Doodle;
ED.BusaccaNodule.prototype.constructor = ED.BusaccaNodule;
ED.BusaccaNodule.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.BusaccaNodule.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.BusaccaNodule.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(30, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BusaccaNodule.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.BusaccaNodule.superclass.draw.call(this, _point);

	// Outer radius
	var ro = 380;
	var ri = 260;
	
	// If iris there, take account of pupil size
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) ri = -doodle.apexY;
	
	// Calculate distance of nodule from centre
	var r = ri + (ro - ri) / 2;
	
	// Boundary path
	ctx.beginPath();

	// Draw nodule
	ctx.arc(0, -r, 30, 0, 2 * Math.PI, false);

	// Colour of fill
	ctx.fillStyle = "rgba(150,100,50,1)";

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
ED.BusaccaNodule.prototype.groupDescription = function() {
	return "Busacca nodules";
}
