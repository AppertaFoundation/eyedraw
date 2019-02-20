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
 * @class CornealThinning
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealThinning = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealThinning";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 81;
	this.resetWidth = true;

	this.bezierTimeIntervals = [0.0,0.125,0.25,0.375,0.50,0.625,0.75,0.875,1];
	this.minX = this.minY = this.initialRadius * -1;
	this.maxX = this.maxY = this.initialRadius;
	
	// Other parameters
	this.height = Math.round(this.initialRadius * 2 / 54);
	this.width = Math.round(this.initialRadius * 2 / 54);

	this.h = Math.round(this.initialRadius * 2 / 54);
	this.w = Math.round(this.initialRadius * 2 / 54);
	this.d = 0;
	this.p = 0;
	
	this.type = 'Dellen';
	this.descemetacoele = false;
	this.perforation = false;
	
	// side view params
	this.csApexX = 0;
	this.csApexY = 0;
	this.csOriginX = 0;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'height', 'width','h','w','minY','maxY','type','depth','descemetacoele','perforation','csApexX','csApexY','csOriginX'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealThinning.prototype = new ED.Doodle;
ED.CornealThinning.prototype.constructor = ED.CornealThinning;
ED.CornealThinning.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealThinning.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}
}

/**
 * Sets default properties
 */
ED.CornealThinning.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		/// **TODO**: Ideally relative to canvas centre, not doodle - when update originX or originY
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(+50, +380);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-350, +350);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-350, +350);
	
	// Validation arrays for other parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Dellen', 'Keratitis'],
		animate: false
	};
	this.parameterValidationArray['height'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['width'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['h'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};
	this.parameterValidationArray['w'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: [0, 1],
		animate: false
	};
	this.parameterValidationArray['p'] = {
		kind: 'other',
		type: 'int',
		range: [0, 1],
		animate: false
	};
	this.parameterValidationArray['resetWidth'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['descemetacoele'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['perforation'] = {
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
	
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealThinning.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'width':
			returnArray['resetWidth'] = true;
			returnArray['w'] = parseInt(_value);
			break;

		case 'height':
			this.squiggleArray[0].pointsArray[0].y = 0.5 * _value * -54;
			this.squiggleArray[0].pointsArray[2].y = 0.5 * _value * 54;
			returnArray['h'] = parseInt(_value);
			returnArray['minY'] = this.calculateMinY();
			returnArray['maxY'] = this.calculateMaxY();
			break;
			
		case 'h':
			returnArray['h'] = _value;
			break;
			
		case 'w':
			returnArray['w'] = _value;
			break;
			
		case 'minY':
			returnArray['minY'] = _value;
			break;
			
		case 'maxY':
			returnArray['maxY'] = _value;
			break;
			
		case 'handles':
			returnArray['w'] = this.calculateWidth();
			returnArray['h'] = this.calculateHeight();
			returnArray['height'] = this.calculateHeight();
			returnArray['minY'] = this.calculateMinY();
			returnArray['maxY'] = this.calculateMaxY();
			break;
		
		case 'd':
			returnArray['descemetacoele'] = (_value==1) ? true : false;
			break;
		
		case 'p':
			returnArray['perforation'] = (_value==1) ? true : false;
			break;
			
	}

	return returnArray;
}

/**
 * Sets default parameters
 */
ED.CornealThinning.prototype.setParameterDefaults = function() {
/*
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var np = new ED.Point(doodle.originX + 100, 1);
		this.move(np.x, np.y);
	} else {
		this.move(1, 200);
	}
*/
	this.originY = 200;
	this.originX = 0;
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		if (i%2) {
			if (i>1) point.x += 20;
			else point.x -= 20;
		}
		this.addPointToSquiggle(point);
	}

}

// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
ED.CornealThinning.prototype.getPhi = function() {
	return 2 * Math.PI / (3 * this.numberOfHandles);
}

ED.CornealThinning.prototype.calculateWidth = function() {
	/// solve bezier to find min and max point along axis
	var maxX = '';
	var minX = '';

	var phi = this.getPhi();

	var squiggle = this.squiggleArray[0];
	for (var i=0; i<this.numberOfHandles; i++) {
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];
		var x1 = fp.x;
		var x2 = fp.tangentialControlPoint(+phi).x;
		var x3 = tp.tangentialControlPoint(-phi).x;
		var x4 = tp.x;

		for (var j=0; j<this.bezierTimeIntervals.length; j++) {
			var t = this.bezierTimeIntervals[j];
			var x = (1-t)*(1-t)*(1-t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4;
			if (maxX == '' || x > maxX) {
				maxX = x;
			}
			if (minX == '' || x < minX) {
				minX = x;
			}
		}
	}
	this.maxX = maxX;
	this.minX = minX;
	return Math.round((maxX - minX) / 54);
}

ED.CornealThinning.prototype.calculateHeight = function() {
	// recalculate height /// solve bezier to find min and max point along axis
	var minY = this.calculateMinY();
	var maxY = this.calculateMaxY();

	return Math.round((maxY - minY) / 54);
}

ED.CornealThinning.prototype.calculateMinY = function() {
	// recalculate height/// solve bezier to find min and max point along axis
	var phi = this.getPhi();
	var minY = '';

	var squiggle = this.squiggleArray[0];
	for (var i=0; i<this.numberOfHandles; i++) {
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];
		var y1 = fp.y;
		var y2 = fp.tangentialControlPoint(+phi).y;
		var y3 = tp.tangentialControlPoint(-phi).y;
		var y4 = tp.y;

		for (var j=0; j<this.bezierTimeIntervals.length; j++) {
			var t = this.bezierTimeIntervals[j];
			var y = (1-t)*(1-t)*(1-t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4;
			if (minY == '' || y <= minY) {
				minY = y;
			}
		}
	}
	return minY;
}

ED.CornealThinning.prototype.calculateMaxY = function() {
	// recalculate height/// solve bezier to find min and max point along axis
	var phi = this.getPhi();
	var minY = '';
	var maxY = '';

	var squiggle = this.squiggleArray[0];
	for (var i=0; i<this.numberOfHandles; i++) {
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];
		var y1 = fp.y;
		var y2 = fp.tangentialControlPoint(+phi).y;
		var y3 = tp.tangentialControlPoint(-phi).y;
		var y4 = tp.y;

		for (var j=0; j<this.bezierTimeIntervals.length; j++) {
			var t = this.bezierTimeIntervals[j];
			var y = (1-t)*(1-t)*(1-t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4;
			if (maxY == '' || y > maxY) {
				maxY = y;
			}
			if (minY == '' || y < minY) {
				minY = y;
			}
		}
	}

	return maxY;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealThinning.prototype.draw = function(_point) {
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealThinning.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	var fp;
	var tp;
	var cp1;
	var cp2;

	var phi = this.getPhi();
	
	// If inputted a dimension, reset pointsArray,
	// otherwise recalculate dimension
	if (this.resetWidth) {
		this.squiggleArray[0].pointsArray[1].x = 0.5 * this.width * 54;
		this.squiggleArray[0].pointsArray[3].x = 0.5 * this.width * -54;

		this.resetWidth = false;
	}
	else {
		this.width = this.calculateWidth();
	}
	
	
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
/*
	ctx.fillStyle = "rgba(200,200,200,0.8)";
	ctx.strokeStyle = "rgba(200,200,200,0.8)";
*/
	
	// fill pattern
	ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['ThinningPattern'], 'repeat');
	ctx.strokeStyle = "rgba(200,200,200,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	for (var i = 0; i < this.numberOfHandles /* * 2 */; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}
			

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Draw perforation - always in centre of shape
		if (this.perforation) {
			ctx.beginPath();
			
			ctx.fillStyle = "gray";
			ctx.arc(this.minX + 0.5*(this.maxX - this.minX),this.minY + 0.5*(this.maxY - this.minY),40,0,2*Math.PI);
			
			ctx.fill();
			
		}
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
ED.CornealThinning.prototype.description = function() {
	
	var returnStr = "Corneal thinning: " + this.type.toLowerCase();
	
	if (this.descemetacoele) returnStr += ", descemetacoele";
	if (this.perforation) returnStr += ", corneal perforation";
	
	return returnStr;	
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CornealThinning.prototype.snomedCode = function() {
	var code = 246938006; // Corneal Dellen (disorder) TODO: check appropriate for keratitis thinning

	if (this.descemetacoele) code = 83110007; // Descemetacoele

	else if (this.perforation) code = 74895004; // Corneal perforation
	
	return code;
}