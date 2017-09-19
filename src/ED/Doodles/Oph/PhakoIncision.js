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
 * PhakoIncision
 *
 * @class PhakoIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PhakoIncision = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PhakoIncision";

	// Private parameters
	this.defaultRadius = 330;
	this.sutureSeparation = 1.5;
	//this.apexYDelta = _radius + _apexY;

	// Derived parameters
	//this.incisionLength = (_arc * Math.PI / 180) * (6 * _radius) / this.defaultRadius;
	this.incisionSite = 'Corneal';
	this.incisionType = 'Pocket';
	this.incisionMeridian = 0;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation', 'radius'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	this.apexYDelta = this.radius + this.apexY;
};

/**
 * Sets superclass and constructor
 */
ED.PhakoIncision.prototype = new ED.Doodle;
ED.PhakoIncision.prototype.constructor = ED.PhakoIncision;
ED.PhakoIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PhakoIncision.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default properties
 */
ED.PhakoIncision.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update validation array for simple parameters
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['incisionMeridian'] = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 360),
		clock: 'bottom',
		animate: true
	};
	this.parameterValidationArray['incisionLength'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(1, 9.9),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['incisionSite'] = {
		kind: 'derived',
		type: 'string',
		list: ['Corneal', 'Limbal', 'Scleral'],
		animate: true
	};
	this.parameterValidationArray['incisionType'] = {
		kind: 'derived',
		type: 'string',
		list: ['Pocket', 'Section'],
		animate: false
	};
};

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PhakoIncision.prototype.setParameterDefaults = function() {
	this.setParameterFromString('incisionSite', 'Corneal');
	this.setParameterFromString('incisionLength', '3.5');
	this.setParameterFromString('incisionType', 'Pocket');

	// Default is temporal side, or 90 degrees to the last one
	this.setRotationWithDisplacements(90, -90);
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PhakoIncision.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {};

	switch (_parameter) {
		case 'rotation':
			var angle = (((Math.PI * 2 - _value + Math.PI / 2) * 180 / Math.PI) + 360) % 360;
			if (angle == 360) {
				angle = 0;
			}
			returnArray['incisionMeridian'] = angle;
			//  returnArray['arc'] = _value/2;
			break;

		case 'arc':
			returnArray['incisionLength'] = _value * (6 * this.radius) / this.defaultRadius;
			break;

		case 'radius':
			if (_value >= 428) {
			  returnArray['incisionSite'] = 'Scleral';
      } else if (_value >= 344) {
			  returnArray['incisionSite'] = 'Limbal';
      } else {
			  returnArray['incisionSite'] = 'Corneal';
      }

			// Incision length should remain constant despite changes in radius
			returnArray['arc'] = this.incisionLength * this.defaultRadius / (6 * _value);
			this.updateArcRange();

			// Move apexY as radius changes and adjust range
			returnArray['apexY'] = this.apexYDelta - _value;
			this.parameterValidationArray['apexY']['range'].setMinAndMax(-_value, -_value + 34);
			break;

		case 'apexY':
			returnArray['apexYDelta'] = this.radius + _value;
			returnArray['incisionType'] = this.radius + _value > 0 ? 'Section' : 'Pocket';
			break;

			// Incision Meridian (CND 5.15)
		case 'incisionMeridian':
			returnArray['rotation'] = (((90 - _value) + 360) % 360) * Math.PI / 180;
			// Example of animating two simple parameters simultaneously
			//returnArray['arc'] = (1 + _value/90) * Math.PI/12;
			break;

			// Incision length (CND 5.14)
		case 'incisionLength':
			returnArray['arc'] = _value * this.defaultRadius / (6 * this.radius);
			this.updateArcRange();
			break;

			// Incision site (CND 5.13)
		case 'incisionSite':
			switch (_value) {
				case 'Scleral':
					returnArray['radius'] = +428;
					break;
				case 'Limbal':
					returnArray['radius'] = +376;
					break;
				case 'Corneal':
					returnArray['radius'] = +330;
					break;
			}
			break;

		case 'incisionType':
			switch (_value) {
				case 'Pocket':
					returnArray['apexYDelta'] = +0;
					returnArray['apexY'] = -this.radius;
					break;
				case 'Section':
					returnArray['apexYDelta'] = +34;
					returnArray['apexY'] = +34 - this.radius;
					break;
			}
	}

	return returnArray;
};

/**
 * Private method to update range of arc parameter to account for values changing with radius and incisionSite
 */
ED.PhakoIncision.prototype.updateArcRange = function() {
	if (this.radius > 0) {
		this.parameterValidationArray['arc']['range'].min = this.parameterValidationArray['incisionLength']['range'].min * this.defaultRadius / (6 * this.radius);
		this.parameterValidationArray['arc']['range'].max = this.parameterValidationArray['incisionLength']['range'].max * this.defaultRadius / (6 * this.radius);
	} else {
		ED.errorHandler('ED.PhakoIncision', 'updateArcRange', 'Attempt to calculate a range of arc using an illegal value of radius: ' + this.radius);
	}
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PhakoIncision.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PhakoIncision.superclass.draw.call(this, _point);

	// Radii
	var r = this.radius;
	var d = 40;
	var ro = r + d;
	var ri = r - d;

	// Boundary path
	ctx.beginPath();

	// Half angle of arc
	var theta = this.arc / 2;

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// Pocket
	if (this.apexYDelta == 0) {
		// Colour of fill
		ctx.fillStyle = "rgba(200,200,200,0.75)";

		// Set line attributes
		ctx.lineWidth = 4;

		// Colour of outer line is dark gray
		ctx.strokeStyle = "rgba(120,120,120,0.75)";
	}
	// Section with sutures
	else {
		// Colour of fill
		ctx.fillStyle = "rgba(200,200,200,0)";

		// Set line attributes
		ctx.lineWidth = 4;

		// Colour of outer line is dark gray
		ctx.strokeStyle = "rgba(120,120,120,0)";
	}

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Section with sutures
		if (this.apexYDelta != 0) {
			// New path
			ctx.beginPath();

			// Arc across
			ctx.arc(0, 0, r, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

			// Sutures
			var sutureSeparationAngle = this.sutureSeparation * this.defaultRadius / (6 * this.radius);
			var p = new ED.Point(0, 0);
			var phi = theta - sutureSeparationAngle / 2;

			do {
				p.setWithPolars(r - d, phi);
				ctx.moveTo(p.x, p.y);
				p.setWithPolars(r + d, phi);
				ctx.lineTo(p.x, p.y);

				phi = phi - sutureSeparationAngle;
			} while (phi > -theta);

			// Set line attributes
			ctx.lineWidth = 4;

			// Colour of outer line is dark gray
			ctx.strokeStyle = "rgba(120,120,120,0.75)";

			// Draw incision
			ctx.stroke();
		}

	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PhakoIncision.prototype.description = function() {
	var returnString = "";

	// Incision site
	if (this.radius > 428) {
		returnString = 'Scleral ';
	} else if (this.radius > 344) {
		returnString = 'Limbal ';
	} else {
		returnString = 'Corneal ';
	}

	// Incision type
	if(this.incisionType){
		returnString += this.incisionType.toLowerCase() + " ";
	} else {
		returnString += this.apexY + this.radius == 0 ? "pocket " : "section ";
	}

	returnString += "incision at ";
	returnString += this.clockHour() + " o'clock";

	return returnString;
};
