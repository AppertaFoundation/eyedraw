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
 * Peripapillary atrophy
 *
 * @class PeripapillaryAtrophy
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
ED.PeripapillaryAtrophy = function(_drawing, _parameterValueArray, _order) {
	// Set classname
	this.className = "PeripapillaryAtrophy";

	// Private parameters
	this.outerRadius = 340;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterValueArray, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripapillaryAtrophy.prototype = new ED.Doodle;
ED.PeripapillaryAtrophy.prototype.constructor = ED.PeripapillaryAtrophy;
ED.PeripapillaryAtrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripapillaryAtrophy.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Handles, false);
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Handles, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Handles, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.PeripapillaryAtrophy.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.addAtBack = true;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['rotation']['range'].setMinAndMax(7 * Math.PI / 4, Math.PI / 4);

	// Create ranges to constrain handles
	this.handleCoordinateRangeArray = new Array();

	var max = this.outerRadius * 1.4;
	var min = this.outerRadius;
	this.handleCoordinateRangeArray[0] = {
		x: new ED.Range(-max, -min),
		y: new ED.Range(-0, +0)
	};
	this.handleCoordinateRangeArray[1] = {
		x: new ED.Range(-0, +0),
		y: new ED.Range(-max, -min)
	};
	this.handleCoordinateRangeArray[2] = {
		x: new ED.Range(min, max),
		y: new ED.Range(-0, +0)
	};
	this.handleCoordinateRangeArray[3] = {
		x: new ED.Range(-0, +0),
		y: new ED.Range(min, max)
	};
}

/**
 * Sets default parameters
 */
ED.PeripapillaryAtrophy.prototype.setParameterDefaults = function() {
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Add four points to the squiggle
	this.addPointToSquiggle(new ED.Point(-this.outerRadius - (this.drawing.eye == ED.eye.Right ? 100 : 0), 0));
	this.addPointToSquiggle(new ED.Point(0, -this.outerRadius));
	this.addPointToSquiggle(new ED.Point(this.outerRadius + (this.drawing.eye == ED.eye.Right ? 0 : 100), 0));
	this.addPointToSquiggle(new ED.Point(0, this.outerRadius));
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripapillaryAtrophy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PeripapillaryAtrophy.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// PeripapillaryAtrophy
	var f = 0.55; // Gives a circular bezier curve
	var fromX;
	var fromY;
	var toX;
	var toY;

	// Top left curve
	fromX = this.squiggleArray[0].pointsArray[0].x;
	fromY = this.squiggleArray[0].pointsArray[0].y;
	toX = this.squiggleArray[0].pointsArray[1].x;
	toY = this.squiggleArray[0].pointsArray[1].y;
	ctx.moveTo(fromX, fromY);
	ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);

	// Top right curve
	fromX = toX;
	fromY = toY;
	toX = this.squiggleArray[0].pointsArray[2].x;
	toY = this.squiggleArray[0].pointsArray[2].y;
	ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);

	// Bottom right curve
	fromX = toX;
	fromY = toY;
	toX = this.squiggleArray[0].pointsArray[3].x;
	toY = this.squiggleArray[0].pointsArray[3].y;
	ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);

	// Bottom left curve
	fromX = toX;
	fromY = toY;
	toX = this.squiggleArray[0].pointsArray[0].x;
	toY = this.squiggleArray[0].pointsArray[0].y;
	ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);

	// Only fill to margin, to allow cup to sit behind giving disc margin
	ctx.moveTo(280, 00);
	ctx.arc(0, 0, 280, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 2;
	var colour = new ED.Colour(0, 0, 0, 1);
	colour.setWithHexString('DFD989');
	ctx.fillStyle = colour.rgba();
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	this.handleArray[1].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[1]);
	this.handleArray[2].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[2]);
	this.handleArray[3].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[3]);

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
ED.PeripapillaryAtrophy.prototype.description = function() {
	var returnString = "";

	// Get distances of control points from centre
	var left = -this.squiggleArray[0].pointsArray[0].x;
	var top = -this.squiggleArray[0].pointsArray[1].y;
	var right = this.squiggleArray[0].pointsArray[2].x;
	var bottom = this.squiggleArray[0].pointsArray[3].y;

	// Get maximum control point, and its sector
	var sector = "";
	var max = this.radius;
	if (left > max) {
		max = left;
		sector = (this.drawing.eye == ED.eye.Right) ? "temporally" : "nasally";
	}
	if (top > max) {
		max = top;
		sector = "superiorly";
	}
	if (right > max) {
		max = right;
		sector = (this.drawing.eye == ED.eye.Right) ? "nasally" : "temporally";
	}
	if (bottom > max) {
		max = bottom;
		sector = "inferiorly";
	}

	// Grade degree of atrophy
	if (max > this.radius) {
		var degree = "Mild";
		if (max > 350) degree = "Moderate";
		if (max > 400) degree = "Signficant";
		returnString += degree;
		returnString += " peri-papillary atrophy, maximum ";
		returnString += sector;
	}

	return returnString;
}
