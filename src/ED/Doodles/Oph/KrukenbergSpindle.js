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
 * Krukenberg's spindle
 *
 * @class KrukenbergSpindle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.KrukenbergSpindle = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "KrukenbergSpindle";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.KrukenbergSpindle.prototype = new ED.Doodle;
ED.KrukenbergSpindle.prototype.constructor = ED.KrukenbergSpindle;
ED.KrukenbergSpindle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.KrukenbergSpindle.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.KrukenbergSpindle.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -80);
}

/**
 * Sets default parameters
 */
ED.KrukenbergSpindle.prototype.setParameterDefaults = function() {
	this.apexY = -150;
	this.originY = 200;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.KrukenbergSpindle.prototype.draw = function(_point) {;
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.KrukenbergSpindle.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Ellipse
	this.addEllipseToPath(ctx, 0, 0, -this.apexY/2, -this.apexY * 2);

	// Create fill
	ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['BrownSpotPattern'], 'repeat');

	// Stroke
	ctx.strokeStyle = "rgba(255,128,0,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

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
ED.KrukenbergSpindle.prototype.description = function() {
	return "Krukenberg spindle";
}
