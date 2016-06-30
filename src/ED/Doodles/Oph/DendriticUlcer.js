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
 * The optic disc
 *
 * @class DendriticUlcer
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.DendriticUlcer = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "DendriticUlcer";

	// Private parameters
	this.numberOfHandles = 8;
	this.initialRadius = 120;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.DendriticUlcer.prototype = new ED.Doodle;
ED.DendriticUlcer.prototype.constructor = ED.DendriticUlcer;
ED.DendriticUlcer.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DendriticUlcer.prototype.setHandles = function() {
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
ED.DendriticUlcer.prototype.setPropertyDefaults = function() {
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

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-50, +50);

	this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.DendriticUlcer.prototype.setParameterDefaults = function() {
	this.apexY = 50;
	this.setOriginWithDisplacements(200, 150);

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at  points around circumference
	var outer = true;
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		if (outer) {
			point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
			outer = false;
		}
		else {
			point.setWithPolars(this.initialRadius/2, i * 2 * Math.PI / this.numberOfHandles);
			outer = true;
		}
		this.addPointToSquiggle(point);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DendriticUlcer.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DendriticUlcer.superclass.draw.call(this, _point);

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
	ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
	ctx.strokeStyle = "rgba(0, 100, 0, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
// 		Drusen
// 		p = new ED.Point(0,0);
// 		fill = "yellow";
// 		var dr = 4;
// 		n = Math.abs(Math.floor((-this.apexY + 50) / 5));
// 		for (var i = 0; i < n; i++) {
// 			p.setWithPolars(this.initialRadius * 0.8 * ED.randomArray[i + 10], 2 * Math.PI * ED.randomArray[i + 100]);
// 			this.drawSpot(ctx, p.x, p.y, dr * 2, fill);
// 		}
	}

	// Coordinates of handles (in canvas plane)
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
ED.DendriticUlcer.prototype.description = function() {
	return 'Dendritic ulcer';
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
// ED.DendriticUlcer.prototype.snomedCode = function() {
// 	return 11111111;
// }
