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
 * AxialLengthGraph
 *
 * @class AxialLengthGraph
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AxialLengthGraph = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AxialLengthGraph";

	// Private parameters
	this.padding = 100;	// Gap between axes and left and bottom edges of canvas
	this.offset = 120;
	this.xAxis = 24;
	this.xFirst = 14;
	this.interval = 2;
	this.stubLength = 30;
	
	// Values
	this.axialLength = 25;
	this.standardDeviation = 1;
	this.lowerLimit = 21.2;
	this.upperLimit = 26.6;
		
	// Saved parameters
	//this.savedParameterArray = ['startDate'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AxialLengthGraph.prototype = new ED.Doodle;
ED.AxialLengthGraph.prototype.constructor = ED.AxialLengthGraph;
ED.AxialLengthGraph.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.AxialLengthGraph.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isShowHighlight = false;
	this.isSelectable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['axialLength'] = {
		kind: 'derived',
		type: 'float',
		precision: 2,
		range: new ED.Range(14, 38),
		animate: false
	};
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AxialLengthGraph.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AxialLengthGraph.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	var xo = -this.drawing.doodlePlaneWidth/2;
	var yo = -this.drawing.doodlePlaneHeight/2;
	var xs = this.drawing.doodlePlaneWidth/2;
	var ys = this.drawing.doodlePlaneHeight/2;
	var factor = (this.drawing.doodlePlaneWidth - 2 * this.padding)/this.xAxis;
	ctx.rect(xo, yo, this.drawing.doodlePlaneWidth, this.drawing.doodlePlaneHeight);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Danger areas
		ctx.beginPath();
		ctx.rect(xo + this.padding, yo + this.padding, (this.lowerLimit - this.xFirst) * factor, this.drawing.doodlePlaneHeight - 2 * this.padding - this.offset);
		ctx.rect(xo + this.padding + (this.upperLimit - this.xFirst) * factor, yo + this.padding, this.drawing.doodlePlaneWidth - 2 * this.padding - (this.upperLimit - this.xFirst) * factor, this.drawing.doodlePlaneHeight - 2 * this.padding - this.offset);
		ctx.fillStyle = "rgba(255,167,152,0.5)";
		ctx.fill();
		
		// Safe areas
		ctx.beginPath();
		ctx.rect(xo + this.padding + (this.lowerLimit - this.xFirst) * factor, yo + this.padding, (this.upperLimit - this.lowerLimit) * factor, this.drawing.doodlePlaneHeight - 2 * this.padding - this.offset);
		ctx.fillStyle = "rgba(208,255,197,0.5)";
		ctx.fill();
		
		// Draw axes
		ctx.beginPath();

		// X-axis
		ctx.moveTo(xo + this.padding, ys - this.padding - this.offset);
		ctx.lineTo(xs - this.padding, ys - this.padding - this.offset);
		
		// Y-axis
		ctx.moveTo(xo + this.padding, ys - this.padding - this.offset);
		ctx.lineTo(xo + this.padding, yo + this.padding);
		
		// Set line attributes
		ctx.lineWidth = 4;

		// Draw grid lines
		ctx.stroke();
		
		// Draw time values at top, but leave out edges
		var n = Math.floor(this.xAxis/this.interval) + 1;
		for (var i = 0; i < n; i++) {

			// Text for x-axis
			var labelText = (this.xFirst + i * this.interval).toString();
			var increment = i * (this.drawing.doodlePlaneWidth - 2 * this.padding)/(n - 1);
			
			// Text properties
			ctx.lineWidth = 4;
			ctx.font = "112px sans-serif";
			ctx.strokeStyle = "gray";
			ctx.fillStyle = "gray";

			// Draw stub
			ctx.beginPath();
			ctx.moveTo(xo + this.padding + increment, ys - this.padding - this.offset);
			ctx.lineTo(xo + this.padding + increment, ys - this.padding - this.offset + this.stubLength);
			ctx.stroke();
		
			// Draw text centred on grid line
			var textWidth = ctx.measureText(labelText).width;
			ctx.fillText(labelText, xo + this.padding + increment - textWidth/2, ys - this.padding);
		}
		
		// Draw axial length
		var x = xo + this.padding + (this.axialLength - this.xFirst) * factor;
		ctx.beginPath();
		ctx.moveTo(x, ys - this.padding - this.offset);
		ctx.lineTo(x, yo + this.padding);
		ctx.lineWidth = 16;
		ctx.strokeStyle = "rgba(50,50,50,1)";
		ctx.stroke();
		
		// Draw standard deviation
		var sd = this.standardDeviation * factor;
		ctx.beginPath();
		ctx.rect(x - sd/2, 0 - this.offset/2, sd, 50);
		ctx.lineWidth = 16;
		ctx.strokeStyle = "red";
		ctx.stroke();		
	}

	// Return value indicating successful hit test
	return this.isClicked;
}
