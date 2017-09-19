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
 *
 *
 * @class Signature
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Signature = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Signature";

	this.colourString = "00FF00FF";


	// Saved parameters
	this.savedParameterArray = [];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Signature.prototype = new ED.Doodle;
ED.Signature.prototype.constructor = ED.Signature;
ED.Signature.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Signature.prototype.setHandles = function() {
}

/**
 * Sets default dragging attributes
 */
ED.Signature.prototype.setPropertyDefaults = function() {
	this.isDrawable = true;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isFilled = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Signature.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Signature.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Signature.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Draw invisible boundary around whole canvas for signature drawing area
	var height = this.drawing.canvas.height / this.drawing.scale *0.99;
	var width = this.drawing.canvas.width / this.drawing.scale *0.99;
	var halfWidth = width/2;
	var halfHeight = height/2;
	ctx.rect(-halfWidth, -halfHeight, width, height);

	// Close path
	ctx.closePath();
	
	// Set attributes for border (colour changes to indicate drawing mode)
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// Calculated no. dashes in line proportional to canvas size
		var d = 40;
		var n = parseInt(width*0.85/d);
		
		ctx.beginPath();
		// Draw cross
		ctx.moveTo(-halfWidth*0.85, halfHeight*0.75 - 40);
		ctx.lineTo(-halfWidth*0.85 + 50, halfHeight*0.75 + 10);
		ctx.moveTo(-halfWidth*0.85, halfHeight*0.75 + 10);
		ctx.lineTo(-halfWidth*0.85 + 50, halfHeight*0.75 - 40);
		
		// Draw dashed line
		for (var h=2; h<n; h++) { // start at 2 to allow for space at beginning
			ctx.moveTo(-halfWidth*0.85 + h*d, halfHeight*0.75);
			ctx.lineTo(-halfWidth*0.85 + h*d + 0.5*d, halfHeight*0.75);
		}
		
		ctx.lineWidth = 6;
		ctx.strokeStyle = "gray";
		if (this.isForDrawing && this.isSelected) ctx.strokeStyle = "blue";
// 		else if (this.isSelected) ctx.strokeStyle = "gray";
		
		ctx.stroke();
		
		// Iterate through squiggles, drawing them
		for (var i = 0; i < this.squiggleArray.length; i++) {
			var squiggle = this.squiggleArray[i];

			// New path for squiggle
			ctx.beginPath();

			// Squiggle attributes
			ctx.lineWidth = 6;
			ctx.strokeStyle = "black";

			// Iterate through squiggle points
			for (var j = 0; j < squiggle.pointsArray.length; j++) {
				ctx.lineTo(squiggle.pointsArray[j].x, squiggle.pointsArray[j].y);
			}

			// Draw squiggle
			ctx.stroke();
			
		}
	}

	// Return value indicating successful hittest
	return this.isClicked;
}