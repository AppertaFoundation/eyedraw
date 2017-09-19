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
 * IRMA
 *
 * @class IRMA
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IRMA = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IRMA";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.IRMA.prototype = new ED.Doodle;
ED.IRMA.prototype.constructor = ED.IRMA;
ED.IRMA.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IRMA.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.IRMA.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +1.5);
}

/**
 * Sets default parameters
 */
ED.IRMA.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(100, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IRMA.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IRMA.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Move to centre
	ctx.moveTo(0, 30);

	// Create curves for the IRMA
	ctx.bezierCurveTo(-30, 30, -70, 0, -50, -20);
	ctx.bezierCurveTo(-30, -40, -20, -10, 0, -10);
	ctx.bezierCurveTo(20, -10, 30, -40, 50, -20);
	ctx.bezierCurveTo(70, 0, 30, 30, 0, 30);

	// Transparent fill
	ctx.fillStyle = "rgba(100, 100, 100, 0)";

	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(50, -40));

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
ED.IRMA.prototype.groupDescription = function() {
	return "Intraretinal microvascular abnormalities ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IRMA.prototype.description = function() {
	return this.locationRelativeToFovea();
}
