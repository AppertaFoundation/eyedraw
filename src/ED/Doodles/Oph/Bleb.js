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
 * Bleb
 *
 * @class Bleb
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Bleb = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Bleb";

	// Saved parameters
	this.savedParameterArray = ['rotation','arc'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Bleb.prototype = new ED.Doodle;
ED.Bleb.prototype.constructor = ED.Bleb;
ED.Bleb.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bleb.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.Bleb.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 12, Math.PI / 2);
}

/**
 * Sets default parameters
 */
ED.Bleb.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(30, 30);
	this.arc = Math.PI/8;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bleb.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Bleb.superclass.draw.call(this, _point);

	// Base radius
	var r = 384;

	// Boundary path
	ctx.beginPath();

	// Radii
	var ro = 500;
	var r = 470;
	var ri = 384;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var eps = Math.PI/30;
	var phi = Math.PI/40;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of doodle
	var topRightX = ro * Math.sin(theta);
	var topRightY = -ro * Math.cos(theta);
	var topLeftX = -ro * Math.sin(theta);
	var topLeftY = topRightY;
	var handleRightX = r * Math.sin(theta + eps);
	var handleRightY = -r * Math.cos(theta + eps);
	var handleLeftX = -r * Math.sin(theta + eps);
	var handleLeftY = handleRightY;
	var cpRightX = r * Math.sin(theta + eps + phi);
	var cpRightY = -r * Math.cos(theta + eps + phi);
	var cpLeftX = -r * Math.sin(theta + eps + phi);
	var cpLeftY = cpRightY;
	var bottomRightX = ri * Math.sin(theta);
	var bottomRightY = -ri * Math.cos(theta);
	var bottomLeftX = -ri * Math.sin(theta);
	var bottomLeftY = bottomRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Curvy left hand edge
	ctx.quadraticCurveTo(cpLeftX, cpLeftY, bottomLeftX, bottomLeftY);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Curvy right hand edge
	ctx.quadraticCurveTo(cpRightX, cpRightY, topRightX, topRightY);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(240,240,240,0.9)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.moveTo(-50, -ri);
		ctx.lineTo(-50, -ri * 1.2);
		ctx.lineTo(50, -ri * 1.2);
		ctx.lineTo(50, -ri);
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(handleRightX, handleRightY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point)

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bleb.prototype.description = function() {
	return "Trabeculectomy bleb at " + this.clockHour() + " o'clock";;
}
