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
 * A Visual field
 *
 * @class VisualField
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.VisualField = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "VisualField";

	// Private parameters
	this.numberOfHandles = 8;

	// Blind spot x coordinate
	this.blindSpotX = 0;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.VisualField.prototype = new ED.Doodle;
ED.VisualField.prototype.constructor = ED.VisualField;
ED.VisualField.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VisualField.prototype.setHandles = function() {
	// Array of handles for expert mode
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
	}

	// Apex handle for basic mode
	this.handleArray[this.numberOfHandles] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.VisualField.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isDeletable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -20);

	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var range = new Object;
		range.length = new ED.Range(+0, +400);
		range.angle = new ED.Range(((15 * cir / 16) + i * cir / 8) % cir, ((1 * cir / 16) + i * cir / 8) % cir);
		this.handleVectorRangeArray[i] = range;
	}
}

/**
 * Sets default parameters
 */
ED.VisualField.prototype.setParameterDefaults = function() {
	this.apexY = -40;

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with points around circumference
	var defaultPointsArray = [
		[0, -370],
		[300, -260],
		[400, 0],
		[300, 260],
		[0, 370],
		[-300, 260],
		[-400, 0],
		[-300, -260]
	];
	for (var i = 0; i < this.numberOfHandles; i++) {
		var coordArray = defaultPointsArray[i];
		var point = new ED.Point(coordArray[0], coordArray[1]);
		this.addPointToSquiggle(point);
	}

	// Adjust for eye
	if (this.drawing.eye == ED.eye.Right) {
		this.squiggleArray[0].pointsArray[3].x = 220;
		this.squiggleArray[0].pointsArray[3].y = 170;
		this.blindSpotX = -120;
	} else {
		this.squiggleArray[0].pointsArray[5].x = -220;
		this.squiggleArray[0].pointsArray[5].y = 170;
		this.blindSpotX = +120;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VisualField.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.VisualField.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	var fp;
	var tp;
	var cp1;
	var cp2;

	// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
	var phi = 2 * Math.PI / (3 * this.numberOfHandles);

	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (var i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];

		// Bezier or straight depending on distance from centre
		if (fp.length() < 100 || tp.length() < 100) {
			ctx.lineTo(tp.x, tp.y);
		} else {
			// Control points
			cp1 = fp.tangentialControlPoint(+phi);
			cp2 = tp.tangentialControlPoint(-phi);

			// Draw Bezier curve
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
		}
	}


	// Blind spot
	ctx.moveTo(this.blindSpotX - this.apexY, 0);
	ctx.arc(this.blindSpotX, 0, -this.apexY, 0, Math.PI * 2, true);

	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 2;
	ctx.fillStyle = "lightGray";
	ctx.strokeStyle = "black";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Axis lines
		ctx.beginPath();
		ctx.moveTo(0, -450);
		ctx.lineTo(0, 450);
		ctx.moveTo(-450, 0);
		ctx.lineTo(450, 0);
		ctx.lineWidth = 8;
		ctx.strokeStyle = "black";
		ctx.stroke();
	}

	// Coordinates of expert handles (in canvas plane)
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}

	// Location of apex handle
	this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(this.blindSpotX, this.apexY));

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
ED.VisualField.prototype.description = function() {
	return "";
}
