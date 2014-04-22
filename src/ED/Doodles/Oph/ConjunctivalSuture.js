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
 * ConjunctivalSuture
 *
 * @class ConjunctivalSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ConjunctivalSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ConjunctivalSuture";

	// Private parameters
	this.boundaryWidth = 180;
	this.boundaryHeight = 180;
	this.orientated = true;

	// Derived parameters
	this.shape = "Buried Mattress";
	this.type = 'Nylon';
	this.size = '10/0';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'orientated', 'shape', 'type', 'size'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'orientated':'Orientated', 'shape':'Shape', 'type':'Type', 'size':'Size'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ConjunctivalSuture.prototype = new ED.Doodle;
ED.ConjunctivalSuture.prototype.constructor = ED.ConjunctivalSuture;
ED.ConjunctivalSuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ConjunctivalSuture.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.ConjunctivalSuture.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;
	this.handleArray[2].isVisible = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+80, +220);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['shape'] = {
		kind: 'derived',
		type: 'string',
		list: ['Purse String', 'Mattress', 'Buried Mattress', 'Interrupted', 'Continuous'],
		animate: true
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Nylon', 'Prolene', 'Vicryl', 'Silk'],
		animate: true
	}
	this.parameterValidationArray['size'] = {
		kind: 'derived',
		type: 'string',
		list: ['11/0', '10/0', '9/0', '8/0', '7/0', '6/0'],
		animate: true
	}
	this.parameterValidationArray['orientated'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.ConjunctivalSuture.prototype.setParameterDefaults = function() {
	this.apexX = this.boundaryWidth/2;
	this.setParameterFromString('shape', 'Purse String');

	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var p = new ED.Drawing.Point(doodle.originX, doodle.originY);

		var np = new ED.Drawing.Point(0, 0);
		np.setWithPolars(p.length(), p.direction() + Math.PI / 6);

		this.move(np.x, np.y);
	} else {
		var np = new ED.Drawing.Point(0, 0);
		var m = (this.drawing.eye == ED.eye.Right ? 11 : 1);
		np.setWithPolars(380, m * Math.PI / 6);
		this.move(np.x, np.y);
	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.ConjunctivalSuture.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'shape':
			if (_value == 'Mattress' || _value == 'Continuous'){
				this.boundaryWidth = 160;
				this.boundaryHeight = 50;
				this.parameterValidationArray['apexX']['range'].setMinAndMax(+80, +220);
				this.handleArray[4].isVisible = true;
			}
			else{
				this.boundaryWidth = 100;
				this.boundaryHeight = 100;
				this.parameterValidationArray['apexX']['range'].setMinAndMax(+50, +50);
				this.handleArray[4].isVisible = false;
			}
			this.apexX = this.boundaryWidth/2;
			break;

		case 'orientated':
			if (_value == "true") {
				this.isOrientated = true;
				this.handleArray[2].isVisible = false;
			}
			else {
				this.isOrientated = false;
				this.handleArray[2].isVisible = true;
			}
			break;

		case 'apexX':
			this.boundaryWidth = this.apexX * 2;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ConjunctivalSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ConjunctivalSuture.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Outline
	ctx.rect(-this.boundaryWidth/2, -this.boundaryHeight/2, this.boundaryWidth, this.boundaryHeight);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = ctx.fillStyle;
	if (this.isSelected) ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Suture drawing
		var endLength = 20;
		var r = this.boundaryHeight/2;
		ctx.beginPath();
		switch (this.shape) {
			case 'Purse String':
				ctx.arc(0, 0, r, 0, Math.PI * 2, true);
				ctx.moveTo(0 - endLength, r + endLength)
				ctx.lineTo(0, r);
				ctx.lineTo(0 + endLength, r + endLength);
				break;

			case 'Mattress':
				ctx.rect(-this.boundaryWidth/2, -this.boundaryHeight/2, this.boundaryWidth, this.boundaryHeight);
				var p = -this.boundaryWidth/2 + 2 * endLength;
				ctx.moveTo(p - endLength, r + endLength);
				ctx.lineTo(p, r);
				ctx.lineTo(p + endLength, r + endLength);
				break;

			case "Buried Mattress":
				var ti = 10;
				var bi = 40;
				ctx.moveTo(-r + ti, -r);
				ctx.lineTo(r - ti, -r);
				ctx.lineTo(r - bi, r);
				ctx.lineTo(-r + bi, r);
				ctx.lineTo(-r + ti, -r);
				ctx.moveTo(0 - endLength, r + endLength)
				ctx.lineTo(0, r);
				ctx.lineTo(0 + endLength, r + endLength);
				break;

			case "Interrupted":
				var cpdx = 10;
				var cpdy = 30
				ctx.moveTo(0, -r);
				ctx.bezierCurveTo(-cpdx, -r + cpdy, -cpdx, r - cpdy, 0, r);
				ctx.bezierCurveTo(cpdx, r - cpdy, cpdx, -r + cpdy, 0, -r);
				ctx.moveTo(0 - endLength, r + endLength)
				ctx.lineTo(0, r);
				ctx.lineTo(0 + endLength, r + endLength);
				break;

			case 'Continuous':
				var x = -this.boundaryWidth/2;
				ctx.moveTo(x, 0);
				while (x + 2 * endLength < this.boundaryWidth/2) {
					x += endLength;
					ctx.lineTo(x, - endLength);
					x += endLength;
					ctx.lineTo(x, + endLength);
				}
				ctx.lineTo(x + endLength, 0);
				ctx.closePath();
				break;
		}
		ctx.lineWidth = 4;
		ctx.strokeStyle = "green";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Drawing.Point(-this.boundaryWidth/2, -this.boundaryHeight/2));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

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
ED.ConjunctivalSuture.prototype.description = function() {
	var returnValue;

	returnValue = this.size + " " + this.type + " " + this.shape + " conjunctival suture at " + this.clockHour() + " o'clock";

	return returnValue;
}
