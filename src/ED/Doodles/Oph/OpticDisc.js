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
 * @class OpticDisc
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OpticDisc = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "OpticDisc";

	// Private parameters
	this.numberOfHandles = 8;

	// Derived parameters
	this.mode = "Basic";
	this.cdRatio = '0';

	// Saved parameters
	this.savedParameterArray = ['apexY', 'mode'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OpticDisc.prototype = new ED.Doodle;
ED.OpticDisc.prototype.constructor = ED.OpticDisc;
ED.OpticDisc.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDisc.prototype.setHandles = function() {
	// Array of handles for expert mode
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}

	// Apex handle for basic mode
	this.handleArray[this.numberOfHandles] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.OpticDisc.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isDeletable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -20);
	this.parameterValidationArray['radius']['range'].setMinAndMax(50, 290);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['mode'] = {
		kind: 'derived',
		type: 'string',
		list: ['Basic', 'Expert'],
		animate: false
	};
	this.parameterValidationArray['cdRatio'] = {
		kind: 'derived',
		type: 'string',
		list: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', 'No view'],
		animate: true
	};

	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var range = new Object;
		range.length = new ED.Range(+50, +290);
		range.angle = new ED.Range(((15 * cir / 16) + i * cir / 8) % cir, ((1 * cir / 16) + i * cir / 8) % cir);
		this.handleVectorRangeArray[i] = range;
	}
}

/**
 * Sets default parameters
 */
ED.OpticDisc.prototype.setParameterDefaults = function() {

	this.apexY = -150;

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(-this.apexY, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}

	this.setParameterFromString('mode', 'Basic');
	this.setParameterFromString('cdRatio', '0.3');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.OpticDisc.prototype.dependentParameterValues = function(_parameter, _value) {

	var returnArray = new Array();

	switch (_parameter) {
		case 'mode':
			this.setHandleProperties();
			if (_value == 'Expert') {
				// Set points to mean
				if (this.drawing.isReady) {
					this.setMeanRadius(-this.apexY);
				}
			} else {
				// First calls to resetHandles occur prior to squiggleArray being initialised
				if (this.drawing.isReady) {
					this.resetHandles();
				}
			}
			break;

		case 'apexY':
			if (_value < -300) {
				returnArray['cdRatio'] = "No view";
			} else {
				returnArray['cdRatio'] = (-_value / 300).toFixed(1);
			}
			break;

		case 'cdRatio':
			if (_value != "No view") {
				var newValue = parseFloat(_value) * 300;
				returnArray['apexY'] = -newValue;
			} else {
				returnArray['apexY'] = -320;
			}
			break;

		case 'handles':
			// Sum distances of (vertical) control points from centre
			var sum = 0;
			sum += this.squiggleArray[0].pointsArray[0].length();
			sum += this.squiggleArray[0].pointsArray[this.numberOfHandles / 2].length();
			returnArray['apexY'] = -Math.round(sum / 2);
			var ratio = Math.round(10 * sum / (300 * 2)) / 10;
			returnArray['cdRatio'] = ratio.toFixed(1);
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDisc.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.OpticDisc.superclass.draw.call(this, _point);

	// Radius of disc
	var ro = 300;
	var ri = -this.apexY;

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 2;
	var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPattern'], 'repeat');
	ctx.fillStyle = ptrn;
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Begin path
		ctx.beginPath();

		// Do a 360 arc
		ctx.arc(0, 0, ro, arcStart, arcEnd, true);

		if (this.mode == "Basic") {
			// Move to inner circle
			ctx.moveTo(ri, 0);

			// Arc back the other way
			ctx.arc(0, 0, ri, arcEnd, arcStart, false);
		} else {
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
		}

		ctx.closePath();

		// Set margin attributes
		var colour = new ED.Colour(0, 0, 0, 1);
		colour.setWithHexString('FFA83C'); // Taken from disc margin of a fundus photo
		ctx.fillStyle = colour.rgba();

		// Draw disc margin
		ctx.fill();

		// Disc vessels
		ctx.beginPath();

		// Vessels start on nasal side of disc
		var sign;
		if (this.drawing.eye == ED.eye.Right) {
			sign = -1;
		} else {
			sign = 1;
		}

		// Superotemporal vessel
		var startPoint = new ED.Point(0, 0);
		startPoint.setWithPolars(150, -sign * Math.PI / 2);

		var controlPoint1 = new ED.Point(0, 0);
		controlPoint1.setWithPolars(400, -sign * Math.PI / 8);
		var controlPoint2 = new ED.Point(0, 0);
		controlPoint2.setWithPolars(450, sign * Math.PI / 8);

		var endPoint = new ED.Point(0, 0);
		endPoint.setWithPolars(500, sign * Math.PI / 4);

		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

		// Inferotemporal vessel
		var startPoint = new ED.Point(0, 0);
		startPoint.setWithPolars(150, -sign * Math.PI / 2);

		var controlPoint1 = new ED.Point(0, 0);
		controlPoint1.setWithPolars(400, -sign * 7 * Math.PI / 8);
		var controlPoint2 = new ED.Point(0, 0);
		controlPoint2.setWithPolars(450, sign * 7 * Math.PI / 8);

		var endPoint = new ED.Point(0, 0);
		endPoint.setWithPolars(500, sign * 3 * Math.PI / 4);

		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

		// Superonasal vessel
		var startPoint = new ED.Point(0, 0);
		startPoint.setWithPolars(150, -sign * Math.PI / 2);

		var controlPoint1 = new ED.Point(0, 0);
		controlPoint1.setWithPolars(300, -sign * 2 * Math.PI / 8);
		var controlPoint2 = new ED.Point(0, 0);
		controlPoint2.setWithPolars(350, -sign * 5 * Math.PI / 16);

		var endPoint = new ED.Point(0, 0);
		endPoint.setWithPolars(450, -sign * 3 * Math.PI / 8);

		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

		// Inferonasal vessel
		var startPoint = new ED.Point(0, 0);
		startPoint.setWithPolars(150, -sign * Math.PI / 2);

		var controlPoint1 = new ED.Point(0, 0);
		controlPoint1.setWithPolars(300, -sign * 6 * Math.PI / 8);
		var controlPoint2 = new ED.Point(0, 0);
		controlPoint2.setWithPolars(350, -sign * 11 * Math.PI / 16);

		var endPoint = new ED.Point(0, 0);
		endPoint.setWithPolars(450, -sign * 5 * Math.PI / 8);

		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

		// Line attributes
		ctx.lineWidth = 48;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";

		// Draw line
		ctx.stroke();

		// Obscure whole disc if no view
		if (this.cdRatio == "No view") {
			// disk to obscure disc
			ctx.beginPath();
			ctx.arc(0, 0, 400, 0, 2 * Math.PI, true);
			ctx.closePath();
			ctx.fillStyle = "gray";
			ctx.fill();
		}
	}

	// Coordinates of expert handles (in canvas plane)
	if (this.mode == "Expert") {
		for (var i = 0; i < this.numberOfHandles; i++) {
			this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
		}
	}

	// Location of apex handle
	this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(0, this.apexY));

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
ED.OpticDisc.prototype.description = function() {
	var returnString = "";

	// Expert mode
	if (this.mode == "Expert") {
		// Get mean
		var mean = this.getMeanRadius();

		// Look for notches by detecting outliers
		var notchArray = new Array();
		var inNotch = false;
		var notch;

		// Find a non-notch point to start with
		var s = 0;
		for (var i = 0; i < this.numberOfHandles; i++) {
			if (this.squiggleArray[0].pointsArray[i].length() < mean * 1.1) {
				s = i;
				break;
			}
		}

		// Iterate through points starting at a non-notch point
		for (var i = 0; i < this.numberOfHandles; i++) {
			var j = (i + s) % this.numberOfHandles;

			if (this.squiggleArray[0].pointsArray[j].length() > mean * 1.1) {
				if (!inNotch) {
					notch = new Object();
					notch.startHour = this.squiggleArray[0].pointsArray[j].clockHour();
					notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
					inNotch = true;
				} else {
					notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
				}
			} else {
				if (inNotch) {
					notchArray.push(notch);
					inNotch = false;
				}
			}

			// Deal with boundary condition
			if (i == this.numberOfHandles - 1) {
				if (inNotch) {
					notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
					notchArray.push(notch);
					inNotch = false;
				}
			}
		}

		// Turn into a sensible report
		if (notchArray.length > 0) {
			var many = (notchArray.length > 1);

			returnString = many ? "Notches" : "Notch";

			for (var i = 0; i < notchArray.length; i++) {
				if (notchArray[i].startHour == notchArray[i].endHour) {
					returnString += " at " + notchArray[i].startHour;
				} else {
					returnString += " from " + notchArray[i].startHour + " to " + notchArray[i].endHour + " o'clock";
				}

				if (many && i != notchArray.length - 1) {
					returnString += ", and";
				}
			}
		} else {

			returnString = this.drawing.doodleArray.length == 1 ? "No abnormality" : "";
		}
	}
	// Basic mode
	else {
		if (this.cdRatio == "No view") {
			returnString = "No view";
		}
    if (returnString.length === 0 && this.drawing.doodleArray.length === 1) {
      returnString = "No abnormality";
    }

  }
	return returnString;
};

/**
 * Defines visibility of handles
 */
ED.OpticDisc.prototype.setHandleProperties = function() {
	// Basic mode
	if (this.mode == "Basic") {
		// Make handles invisible, except for apex handle
		for (var i = 0; i < this.numberOfHandles; i++) {
			this.handleArray[i].isVisible = false;
		}
		this.handleArray[this.numberOfHandles].isVisible = true;
	}
	// Expert mode
	else {
		// Make handles visible, except for apex handle,
		for (var i = 0; i < this.numberOfHandles; i++) {
			this.handleArray[i].isVisible = true;
		}
		this.handleArray[this.numberOfHandles].isVisible = false;
	}
}

/**
 * Returns minimum radius
 *
 * @returns {Float} Minimum radius regardless of mode
 */
ED.OpticDisc.prototype.minimumRadius = function() {
	var returnValue = 500;

	if (this.mode == "Basic") {
		returnValue = Math.abs(this.apexY);
	} else {
		// Iterate through points
		for (var i = 0; i < this.numberOfHandles; i++) {
			// Calculate minimum radius
			var radius = this.squiggleArray[0].pointsArray[i].length();

			if (radius < returnValue) {
				returnValue = radius;
			}
		}
	}

	return returnValue;
}

/**
 * Returns mean radius
 *
 * @returns {Float} Mean radius of handle points
 */
ED.OpticDisc.prototype.getMeanRadius = function() {
	// Sum distances of (vertical) control points from centre
	if (typeof(this.squiggleArray[0]) != 'undefined') {
		var sum = 0;
		for (var i = 0; i < this.numberOfHandles; i++) {
			sum += this.squiggleArray[0].pointsArray[i].length();
		}
		return sum / this.numberOfHandles;
	} else {
		return -this.apexY;
	}
}

/**
 * Sets radius of handle points
 *
 *@param {Float} _radius Value to set
 */
ED.OpticDisc.prototype.setMeanRadius = function(_radius) {
	// Get current mean
	var mean = this.getMeanRadius();

	// Go through scaling each point according to new mean
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Get current length and direction
		var length = this.squiggleArray[0].pointsArray[i].length();
		var direction = this.squiggleArray[0].pointsArray[i].direction();

		// Calculate new length
		var newLength = length * _radius / mean;
		newLength = newLength > 300 ? 300 : newLength;

		// Set point
		this.squiggleArray[0].pointsArray[i].setWithPolars(newLength, direction);
	}
}

/**
 * Resets radius of handle points to equal values corresponding to c/d ratio
 */
ED.OpticDisc.prototype.resetHandles = function() {
	// Reset handles to equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.squiggleArray[0].pointsArray[i].setWithPolars(-this.apexY, i * 2 * Math.PI / this.numberOfHandles);
	}
}
