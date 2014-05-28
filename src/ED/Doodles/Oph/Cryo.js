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
 * Cryotherapy
 *
 * @class Cryo
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Cryo = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Cryo";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Cryo.prototype = new ED.Doodle;
ED.Cryo.prototype.constructor = ED.Cryo;
ED.Cryo.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Cryo.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Cryo.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -40);
}

/**
 * Sets default parameters
 */
ED.Cryo.prototype.setParameterDefaults = function() {
	this.apexY = -40;

	// Put control handle at 45 degrees
	this.rotation = Math.PI / 4;

	// Displacement from fovea, and from last doodle
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var p = new ED.Point(doodle.originX, doodle.originY);

		var np = new ED.Point(0, 0);
		np.setWithPolars(p.length(), p.direction() + Math.PI / 6);

		this.move(np.x, np.y);
	} else {
		this.move((this.drawing.eye == ED.eye.Right ? -1 : 1) * 200, -300);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cryo.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Cryo.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Circular scar
	var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);

	// Circular scar
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set line attributes
	ctx.lineWidth = 8;
	var ptrn = ctx.createPattern(this.drawing.imageArray['CryoPattern'], 'repeat');
	ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(80, 40, 0, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.Cryo.prototype.groupDescription = function() {
	return "Cryotherapy";
}
