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
 * Circinate
 *
 * @class Circinate
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Circinate = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Circinate";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Circinate.prototype = new ED.Doodle;
ED.Circinate.prototype.constructor = ED.Circinate;
ED.Circinate.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Circinate.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.Circinate.prototype.setPropertyDefaults = function() {}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Circinate.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(60, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Circinate.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Circinate.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of Circinate
	var rc = 80;

	// Circle
	ctx.arc(0, 0, rc, 0, 2 * Math.PI, false);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200,200,0,0)";
	ctx.strokeStyle = "rgba(100,100,100,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Parameters
		var ro = 40;
		var rh = 10
		var ne = 12;
		var el = 30;

		// Point objects
		var cp = new ED.Drawing.Point(0, 0);
		var ep = new ED.Drawing.Point(0, 0);

		// Red centre
		ctx.beginPath();
		ctx.arc(0, 0, rh, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = "red";
		ctx.fill();

		// Exudates
		phi = 2 * Math.PI / ne;
		for (i = 0; i < ne; i++) {
			ctx.beginPath();
			cp.setWithPolars(ro, i * phi);
			ep.setWithPolars(ro + el, i * phi);
			ctx.moveTo(cp.x, cp.y);
			ctx.lineTo(ep.x, ep.y);
			ctx.closePath();
			ctx.lineWidth = 12;
			ctx.strokeStyle = "rgba(220,220,0,1)";
			ctx.lineCap = "round";
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Drawing.Point(0, 0);
	point.setWithPolars(rc, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Circinate.prototype.groupDescription = function() {
	return "Circinate maculopathy ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Circinate.prototype.description = function() {
	return this.locationRelativeToFovea();
}
