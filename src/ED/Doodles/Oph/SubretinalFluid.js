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
 * The optic disc
 *
 * @class SubretinalFluid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SubretinalFluid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SubretinalFluid";

	// Private parameters
	this.numberOfHandles = 8;
	this.initialRadius = 80;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.SubretinalFluid.prototype = new ED.Doodle;
ED.SubretinalFluid.prototype.constructor = ED.SubretinalFluid;
ED.SubretinalFluid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SubretinalFluid.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}

	// Allow top handle to rotate doodle
	this.handleArray[0].isRotatable = true;
}

/**
 * Sets default properties
 */
ED.SubretinalFluid.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(+50, +290);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}
}

/**
 * Sets default parameters
 */
ED.SubretinalFluid.prototype.setParameterDefaults = function() {
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var np = new ED.Point(doodle.originX + 100, 0);
		this.move(np.x, np.y);
	} else {
		this.move((this.drawing.eye == ED.eye.Right ? -1 : 1) * 100, 0);
	}

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SubretinalFluid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SubretinalFluid.superclass.draw.call(this, _point);

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

		// Control points
		cp1 = fp.tangentialControlPoint(+phi);
		cp2 = tp.tangentialControlPoint(-phi);

		// Draw Bezier curve
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of expert handles (in canvas plane)
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}

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
ED.SubretinalFluid.prototype.description = function() {
	return 'Subretinal fluid';
}
