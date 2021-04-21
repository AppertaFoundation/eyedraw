/**
 * OpenEyes
 * MSC
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
 * TODO: infiltrate control point definitions 
 *
 * @class CornealOpacity
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealOpacity = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealOpacity";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 81;
	this.resetWidth = true;
	this.resetInfiltrate = true;

	this.minX = this.minY = this.initialRadius * -1;
	this.maxX = this.maxY = this.initialRadius;

	this.depth = 33;
	this.infiltrateWidth = 0;

	this.d = 33;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'fHeight', 'fWidth', 'depth', 'infiltrateWidth','d','minY','maxY'];

	// Parameters in doodle control bar
	this.controlParameterArray = {'fHeight':'Height', 'fWidth':'Width', 'depth':'Depth (%)', 'infiltrateWidth':'Infiltrate fWidth'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// for historical records, where fWidth was saved as width
	this.fWidth = this.fWidth || this.width;
	this.fHeight = this.fHeight || this.height;
};

/**
 * Sets superclass and constructor
 */
ED.CornealOpacity.prototype = new ED.Doodle;
ED.CornealOpacity.prototype.constructor = ED.CornealOpacity;
ED.CornealOpacity.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealOpacity.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}
}

/**
 * Sets default properties
 */
ED.CornealOpacity.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = [];
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		/// **TODO**: Ideally relative to canvas centre, not doodle - when update originX or originY
		var n = this.numberOfHandles;
		var range = {};
		range.length = new ED.Range(+50, +380);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-350, +350);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-350, +350);

	// Validation arrays for other parameters
	this.parameterValidationArray['fHeight'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(0.01, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['fWidth'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(0.01, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['depth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['infiltrateWidth'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(0.01, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['resetWidth'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['resetInfiltrate'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['minY'] = {
		kind: 'other',
		type: 'int',
		range: [-500,500],
		animate: false
	};
	this.parameterValidationArray['maxY'] = {
		kind: 'other',
		type: 'int',
		range: [-500,500],
		animate: false
	};
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealOpacity.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = [];

	switch (_parameter) {
		case 'fWidth':
			returnArray['resetWidth'] = true;
			break;

		case 'fHeight':
			returnArray['resetHeight'] = true;
			returnArray['minY'] = this.squiggleArray[0].pointsArray[0].y;
			returnArray['maxY'] = this.squiggleArray[0].pointsArray[2].y;
			break;

		case 'depth':
			returnArray['d'] = parseInt(_value);
			break;
	}

	return returnArray;
};

/**
 * Sets default parameters
 */
ED.CornealOpacity.prototype.setParameterDefaults = function() {
	// when loaded, they don't get initialized
	this.fHeight = Math.round(this.initialRadius * 2 / 54);
	this.fWidth = Math.round(this.initialRadius * 2 / 54);

	const doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		const np = new ED.Point(doodle.originX + 100, 1);
		this.move(np.x, np.y);
	} else {
		this.move(100, 1);
	}

	// Create a squiggle to store the handles points
	const squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (let i = 0; i < this.numberOfHandles; i++) {
		const point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
	for (let i = 0; i < this.numberOfHandles; i++) {
		const point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
};

// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
ED.CornealOpacity.prototype.getPhi = function()
{
	return 2 * Math.PI / (3 * this.numberOfHandles);
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealOpacity.prototype.draw = function(_point) {
	let verticalHandlesVisible = this.fHeight > 2 ? true : false;
	let horizontalHandlesVisible = this.fWidth > 2 ? true : false;

	this.handleArray[0].isVisible = verticalHandlesVisible;
	this.handleArray[2].isVisible = verticalHandlesVisible;
	this.handleArray[1].isVisible = horizontalHandlesVisible;
	this.handleArray[3].isVisible = horizontalHandlesVisible;

	// Get context
	const ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealOpacity.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	let fp;
	let tp;
	let cp1;
	let cp2;

	var phi = this.getPhi();

	if (this.resetWidth) {
		let currWidth = (this.squiggleArray[0].pointsArray[1].x - this.squiggleArray[0].pointsArray[3].x)/54;
		this.squiggleArray[0].pointsArray[1].x *= this.fWidth / currWidth;
		this.squiggleArray[0].pointsArray[3].x *= this.fWidth / currWidth;

		this.resetWidth = false;
	}
	else {
		this.fWidth = (this.squiggleArray[0].pointsArray[1].x - this.squiggleArray[0].pointsArray[3].x) / 54;
	}

	if (this.resetHeight) {
		let currHeight = (this.squiggleArray[0].pointsArray[2].y - this.squiggleArray[0].pointsArray[0].y)/54;
		this.squiggleArray[0].pointsArray[0].y *= this.fHeight / currHeight;
		this.squiggleArray[0].pointsArray[2].y *= this.fHeight / currHeight;

		this.resetHeight = false;
	}
	else {
		this.fHeight = (this.squiggleArray[0].pointsArray[2].y - this.squiggleArray[0].pointsArray[0].y) / 54;
	}

	this.h = this.fHeight;

	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (let i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		const toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
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
	ctx.fillStyle = "gray";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	for (let i = 0; i < this.numberOfHandles /* * 2 */; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// Infiltrate
		if (this.infiltrateWidth > 0) {
			// Convert infiltrate width to doodle scale
			const iW = this.infiltrateWidth * 54;
			const n = this.numberOfHandles;

			const infiltratePoints = [];

			// If do not exist, create extra handles for infiltrate boundary
// 			if (this.resetInfiltrate) {
			// redefine infiltrate control points based on width
			this.resetInfiltrate = false;
			for (let i=0; i<this.numberOfHandles; i++) {
				const handle = this.squiggleArray[0].pointsArray[i];
				const x = Math.abs(handle.x);
				const y = Math.abs(handle.y);

				// Length of new handle from origin
				const h = Math.sqrt(x*x + y*y) + iW;

				// Angle of handle from origin
				const theta = Math.atan(y/x);

				// Height of new point above origin
				const o = h * Math.sin(theta);
				// X displacement of new point from origin
				const a = h * Math.cos(theta);

				// get sign of handle coordinates
				const xS = (handle.x>=0) ? 1 : -1;
				const yS = (handle.y>=0) ? 1 : -1;

				const p = new ED.Point(a * xS, o * yS);
				infiltratePoints.push(p);

				this.squiggleArray[0].pointsArray[n+i] = p;
			}
			
			// Draw infiltrate
			ctx.beginPath();
			ctx.moveTo(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
			// Complete curve segments
			for (let j=0; j< this.numberOfHandles; j++) {
				// From and to points
				fp = this.squiggleArray[0].pointsArray[j + n];
				const toIndex = (j < this.numberOfHandles - 1) ? j + 1 + n : this.numberOfHandles;
				tp = this.squiggleArray[0].pointsArray[toIndex];
		
				// Control points
				cp1 = fp.tangentialControlPoint(+phi);
				cp2 = tp.tangentialControlPoint(-phi);
		
				// Draw Bezier curve
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
			}
			ctx.fillStyle = "rgba(0,0,0,0.2)";
			ctx.fill();
			
			// Flood fill shape on ontop of gradient
			ctx.beginPath();
			ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
			// Complete curve segments
			for (let i = 0; i < this.numberOfHandles; i++) {
				// From and to points
				fp = this.squiggleArray[0].pointsArray[i];
				const toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
				tp = this.squiggleArray[0].pointsArray[toIndex];
		
				// Control points
				cp1 = fp.tangentialControlPoint(+phi);
				cp2 = tp.tangentialControlPoint(-phi);
		
				// Draw Bezier curve
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
			}
			ctx.fillStyle = "gray";
			ctx.stroke();
			ctx.fill();
		}
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) {
		this.drawHandles(_point);
	}

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealOpacity.prototype.description = function() {
	return 'Corneal opacity: H-W: ' + this.fHeight.toFixed(1) + ' x ' + this.fWidth.toFixed(1) + ' mm // Stromal depth: ' + this.depth + '% // Infiltrate width: ' + this.infiltrateWidth + 'mm';
};
