/**
 * @fileOverview Contains doodle subclasses for general use
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 1.0
 *
 * Modification date: 6th October 2012
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") {
	var ED = new Object();
}

/**
 * Freehand drawing
 *
 * @class Freehand
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Freehand = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Freehand";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Freehand.prototype = new ED.Doodle;
ED.Freehand.prototype.constructor = ED.Freehand;
ED.Freehand.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Freehand.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.Freehand.prototype.setPropertyDefaults = function() {
	this.isDrawable = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Freehand.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Freehand.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Freehand.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Freehand
	ctx.rect(-150, -150, 300, 300);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	this.isFilled = false;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	if (this.isSelected) ctx.strokeStyle = "gray";
	if (this.isForDrawing) ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Iterate through squiggles, drawing them
		for (var i = 0; i < this.squiggleArray.length; i++) {
			var squiggle = this.squiggleArray[i];

			ctx.beginPath();

			// Squiggle attributes
			ctx.lineWidth = squiggle.thickness;
			ctx.strokeStyle = squiggle.colour;
			ctx.fillStyle = squiggle.colour;

			// Iterate through squiggle points
			for (var j = 0; j < squiggle.pointsArray.length; j++) {
				ctx.lineTo(squiggle.pointsArray[j].x, squiggle.pointsArray[j].y);
			}

			// Draw squiggle
			ctx.stroke();

			// Optionally fill if squiggle is complete (stops filling while drawing)
			if (squiggle.filled && squiggle.complete) ctx.fill();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(150, -150));

	// Draw handles if selected but not if for drawing
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 *	Mouse test - used for testing detection of mouse pointer
 *
 * @class  MouseTest
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MouseTest = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MouseTest";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MouseTest.prototype = new ED.Doodle;
ED.MouseTest.prototype.constructor = ED.MouseTest;
ED.MouseTest.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.MouseTest.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MouseTest.prototype.draw = function(_point) {
	//if (_point) console.log(_point.x, _point.y);

	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MouseTest.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Square
	var width = 200;
	ctx.rect(-width / 2, -width / 2, width, width);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "white"
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	if (this.isClicked) console.log(_point.x, _point.y);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Return value indicating successful hittest
	return this.isClicked;
}
