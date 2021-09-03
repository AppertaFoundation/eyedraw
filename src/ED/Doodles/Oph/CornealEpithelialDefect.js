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
 * 
 *
 * @class CornealEpithelialDefect
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealEpithelialDefect = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealEpithelialDefect";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 81;
	this.resetWidth = true;
	this.resetHeight = true;
	this.resetInfiltrate = true;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'fHeight', 'fWidth'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'fHeight':'Height', 'fWidth':'Width'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// for historical records, where fWidth was saved as width
	this.fWidth = this.fWidth || this.width;
	this.fHeight = this.fHeight || this.height;
};

/**
 * Sets superclass and constructor
 */
ED.CornealEpithelialDefect.prototype = new ED.Doodle;
ED.CornealEpithelialDefect.prototype.constructor = ED.CornealEpithelialDefect;
ED.CornealEpithelialDefect.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealEpithelialDefect.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}
};

/**
 * Sets default properties
 */
ED.CornealEpithelialDefect.prototype.setPropertyDefaults = function() {

	// Create ranges to constrain handles
	this.handleVectorRangeArray = [];
	for (let i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		const cir = 2 * Math.PI;

		// Create a range object for each handle
		const n = this.numberOfHandles;
		const range = {};
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
	this.parameterValidationArray['resetWidth'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['resetHeight'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealEpithelialDefect.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'fWidth':
			returnArray['resetWidth'] = true;
			break;

		case 'fHeight':
			returnArray['resetHeight'] = true;
			break;
	}

	return returnArray;
};

/**
 * Sets default parameters
 */
ED.CornealEpithelialDefect.prototype.setParameterDefaults = function() {
	// when loaded, they don't get initialized
	this.fHeight = Math.round(this.initialRadius * 2 / 54);
	this.fWidth = Math.round(this.initialRadius * 2 / 54);

	const doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		const np = new ED.Point(doodle.originX + 100, doodle.originY);
		this.move(np.x, np.y);
	} else {
		this.move(150, 50);
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
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealEpithelialDefect.prototype.draw = function(_point) {
	let verticalHandlesVisible = this.fHeight > 2 ? true : false;
	let horizontalHandlesVisible = this.fWidth > 2 ? true : false;
	this.handleArray[0].isVisible = verticalHandlesVisible;
	this.handleArray[2].isVisible = verticalHandlesVisible;
	this.handleArray[1].isVisible = horizontalHandlesVisible;
	this.handleArray[3].isVisible = horizontalHandlesVisible;

	// Get context
	const ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealEpithelialDefect.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	let fp;
	let tp;
	let cp1;
	let cp2;

	// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
	const phi = 2 * Math.PI / (3 * this.numberOfHandles);
	
	// If inputted a dimension, reset pointsArray, 
	// otherwise recalculate dimension
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

	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (let i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		let toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
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
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(50,205,50,0.8)";
	ctx.strokeStyle = "rgba(50,205,50,1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	for (let i = 0; i < this.numberOfHandles /* * 2 */; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
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
ED.CornealEpithelialDefect.prototype.description = function() {
	return 'Epithelial defect H-W: ' + this.fHeight.toFixed(1) + ' x ' + this.fWidth.toFixed(1) + ' mm';
};