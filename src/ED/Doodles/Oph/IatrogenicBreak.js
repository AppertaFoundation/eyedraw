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
 * Iatrogenic break
 *
 * @class IatrogenicBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IatrogenicBreak = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IatrogenicBreak";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.IatrogenicBreak.prototype = new ED.Doodle;
ED.IatrogenicBreak.prototype.constructor = ED.IatrogenicBreak;
ED.IatrogenicBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IatrogenicBreak.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default properties
 */
ED.IatrogenicBreak.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(0.8, 2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(0.8, 2);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.IatrogenicBreak.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(240, -50);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IatrogenicBreak.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IatrogenicBreak.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Oval break
	var d = 40;
	var p = 0.8;
	var sp = new ED.Point(-d, d);
	var ep = new ED.Point(d, -d);

	// Oval shape
	ctx.moveTo(sp.x, sp.y);
	ctx.bezierCurveTo(sp.x, sp.y - p * d, ep.x - p * d, ep.y, ep.x, ep.y);
	ctx.bezierCurveTo(ep.x, ep.y + p * d, sp.x + p * d, sp.y, sp.x, sp.y);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(ep);

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
ED.IatrogenicBreak.prototype.description = function() {
	return "Iatrogenic break in " + this.quadrant();
}
