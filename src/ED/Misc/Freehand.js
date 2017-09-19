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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

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

	// Private parameters
	this.labelWidth = 0;
	this.labelHeight = 80;
	this.labelFont = "60px sans-serif";

	// Derived parameters
	this.colourString = "00FF00FF";
	this.filled = true;
	this.thickness = 'Thin';
	this.labelText = "";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'colourString', 'filled', 'thickness', 'labelText'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'colourString':'Colour', 'filled':'Fill', 'thickness':'Thickness', 'labelText':'Label'};

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
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.Freehand.prototype.setPropertyDefaults = function() {
	this.isDrawable = true;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['colourString'] = {
		kind: 'derived',
		type: 'colourString',
		list: ['FF0000FF', '00FF00FF', '0000FFFF'],
		animate: true
	};
	this.parameterValidationArray['filled'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['thickness'] = {
		kind: 'derived',
		type: 'string',
		list: ['Thin', 'Medium', 'Thick'],
		animate: true
	};
	this.parameterValidationArray['labelText'] = {
		kind: 'derived',
		type: 'freeText',
		animate: true
	};
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

	// Freehand drawing area
	var halfWidth = 200;
	ctx.rect(-halfWidth, -halfWidth, halfWidth * 2, halfWidth * 2);

	// Close path
	ctx.closePath();

	// Create colour object for squiggle
	var colourObject = new ED.Colour(0, 0, 0, 1);
	colourObject.setWithHexString(this.colourString);

	// Set attributes for border (colour changes to indicate drawing mode)
	ctx.lineWidth = 2;
	this.isFilled = false;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	if (this.isSelected) ctx.strokeStyle = "gray";
	if (this.isForDrawing) ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Iterate through squiggles, drawing them
		for (var i = 0; i < this.squiggleArray.length; i++) {
			var squiggle = this.squiggleArray[i];

			// New path for squiggle
			ctx.beginPath();

			// Squiggle attributes
			ctx.lineWidth = squiggle.thickness;
			ctx.strokeStyle = squiggle.colour.rgba();
			ctx.fillStyle = squiggle.colour.rgba();

			// Iterate through squiggle points
			for (var j = 0; j < squiggle.pointsArray.length; j++) {
				ctx.lineTo(squiggle.pointsArray[j].x, squiggle.pointsArray[j].y);
			}

			// Draw squiggle
			ctx.stroke();

			// Optionally fill if squiggle is complete (stops filling while drawing)
			if (squiggle.filled && squiggle.complete) ctx.fill();
		}

		// Draw optional label
		if (this.labelText.length > 0) {
			// Draw text
			ctx.font = this.labelFont;
			this.labelWidth = ctx.measureText(this.labelText).width;
			ctx.fillStyle = "black";
			ctx.fillText(this.labelText, -this.labelWidth / 2, this.labelHeight / 6);
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(halfWidth, -halfWidth));

	// Draw handles if selected but not if for drawing
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}