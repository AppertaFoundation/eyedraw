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
 * @class RPEHypertrophy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RPEHypertrophy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RPEHypertrophy";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RPEHypertrophy.prototype = new ED.Doodle;
ED.RPEHypertrophy.prototype.constructor = ED.RPEHypertrophy;
ED.RPEHypertrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RPEHypertrophy.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RPEHypertrophy.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(-300, -60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RPEHypertrophy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RPEHypertrophy.superclass.draw.call(this, _point);

	// Radius
	var r = 60;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(145, 96, 80, 1.0)";
	ctx.strokeStyle = ctx.fillStyle;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.RPEHypertrophy.prototype.groupDescription = function() {
	return "RPE hypertrophy";
}
