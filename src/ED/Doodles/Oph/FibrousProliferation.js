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
 * Fibrous Proliferation
 *
 * @class FibrousProliferation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.FibrousProliferation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "FibrousProliferation";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'rotation']

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.FibrousProliferation.prototype = new ED.Doodle;
ED.FibrousProliferation.prototype.constructor = ED.FibrousProliferation;
ED.FibrousProliferation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FibrousProliferation.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.FibrousProliferation.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FibrousProliferation.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(-200, 150);
	this.rotation = this.drawing.eye == ED.eye.Right ? -Math.PI / 4 : Math.PI / 4;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FibrousProliferation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.FibrousProliferation.superclass.draw.call(this, _point);

	// Dimensions
	var w = 180;
	var h = 70;
	var wc = w * 0.6;
	var hc = h * 0.2;

	// Boundary path
	ctx.beginPath();

	// Patch with scalloped edges
	ctx.moveTo(-w, -h);
	ctx.bezierCurveTo(-wc, -hc, wc, -hc, w, -h);
	ctx.bezierCurveTo(wc, -hc, wc, hc, w, h);
	ctx.bezierCurveTo(wc, hc, -wc, hc, -w, h);
	ctx.bezierCurveTo(-wc, hc, -wc, -hc, -w, -h);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(120,120,120,0.5)";
	ctx.fillStyle = "rgba(120,120,120,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(w, -h));

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
ED.FibrousProliferation.prototype.description = function() {
	return "Fibrous proliferation";
}
