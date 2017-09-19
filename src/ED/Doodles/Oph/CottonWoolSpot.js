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
 * Cotton Wool Spot
 *
 * @class CottonWoolSpot
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CottonWoolSpot = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CottonWoolSpot";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CottonWoolSpot.prototype = new ED.Doodle;
ED.CottonWoolSpot.prototype.constructor = ED.CottonWoolSpot;
ED.CottonWoolSpot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CottonWoolSpot.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.CottonWoolSpot.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	this.isOrientated = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CottonWoolSpot.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CottonWoolSpot.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CottonWoolSpot.superclass.draw.call(this, _point);

	// Dimensions of haemorrhage
	var r = 80;
	var h = 50;
	var d = h / 3;

	// Boundary path
	ctx.beginPath();

	// Cotton wool spot
	ctx.moveTo(-r, -h);
	ctx.lineTo(-r + d, -h + 1 * d);
	ctx.lineTo(-r, -h + 2 * d);
	ctx.lineTo(-r + d, -h + 3 * d);
	ctx.lineTo(-r, -h + 4 * d);
	ctx.lineTo(-r + d, -h + 5 * d);
	ctx.lineTo(-r, -h + 6 * d);
	ctx.bezierCurveTo(-r + d, -h + 7 * d, r - d, -h + 7 * d, r, -h + 6 * d);
	ctx.lineTo(r - d, -h + 5 * d);
	ctx.lineTo(r, -h + 4 * d);
	ctx.lineTo(r - d, -h + 3 * d);
	ctx.lineTo(r, -h + 2 * d);
	ctx.lineTo(r - d, -h + 1 * d);
	ctx.lineTo(r, -h);
	ctx.bezierCurveTo(r - d, -h - d, -r + d, -h - d, -r, -h);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "rgba(220,220,220,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r, -h));

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
ED.CottonWoolSpot.prototype.groupDescription = function() {
	return "Cotton wool spots";
}
