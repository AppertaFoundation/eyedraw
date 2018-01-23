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
 * RingSegment
 *
 * @class RingSegment
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RingSegment = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RingSegment";

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RingSegment.prototype = new ED.Doodle;
ED.RingSegment.prototype.constructor = ED.RingSegment;
ED.RingSegment.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RingSegment.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.RingSegment.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, Math.PI / 2);
}

/**
 * Sets default parameters
 */
ED.RingSegment.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 30 * Math.PI / 180;

	// Make it 180 degrees to last one of same class
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + Math.PI;
		this.arc = doodle.arc;
	} else {
		// LRIs are usually temporal
		if (this.drawing.eye == ED.eye.Right) {
			this.rotation = -Math.PI / 2;
		} else {
			this.rotation = Math.PI / 2;
		}
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RingSegment.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RingSegment.superclass.draw.call(this, _point);

	// Radius
	var r = 300;
	var d = 20;
	var ro = r + d;
	var ri = r - d;

	// Boundary path
	ctx.beginPath();

	// Half angle of arc
	var theta = this.arc / 2;

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, theta);
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
ED.RingSegment.prototype.description = function() {
	var returnString = "Limbal relaxing incision " + (this.arc * 180 / Math.PI).toFixed(0) + " degrees at ";
	returnString += this.clockHour() + " o'clock";

	return returnString;
}
