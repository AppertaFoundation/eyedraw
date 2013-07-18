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
 * Retinal detachment
 *
 * @class RPERip
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RPERip = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RPERip";
	
	// Private parameters
	this.initialRadius = 150;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'scaleX', 'scaleY', 'arc', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RPERip.prototype = new ED.Doodle;
ED.RPERip.prototype.constructor = ED.RPERip;
ED.RPERip.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RPERip.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, true);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.RPERip.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-120, +120);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-120, +120);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-this.initialRadius, +this.initialRadius);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RPERip.prototype.setParameterDefaults = function() {
	this.arc = 120 * Math.PI / 180;
	this.setRotationWithDisplacements(90, 0);
	this.setOriginWithDisplacements(0, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RPERip.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RPERip.superclass.draw.call(this, _point);

	// Radius of outer curve
	var r = this.initialRadius;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(251, 147, 76, 0.75)";
	ctx.strokeStyle = "red";
		
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Boundary path
		ctx.beginPath();

		// Arc across from top right to to mirror image point on the other side
		ctx.arc(0, 0, r, arcStart, arcEnd, true);
	
		// Connect across the bottom via the apex point
		var bp = +0.6;
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);

		// Set line attributes
		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(180, 125, 60, 0.75)";
		ctx.strokeStyle = "brown";
		
		ctx.fill();
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 8);
	this.handleArray[3].location = this.transform.transformPoint(point);
	
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
ED.RPERip.prototype.description = function() {
	// Return description
	return "RPE rip";
}