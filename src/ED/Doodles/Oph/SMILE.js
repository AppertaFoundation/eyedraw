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
 * SMILE (Photo Therapeutic Keratectomy
 *
 * @class SMILE
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SMILE = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SMILE";

	// Derived parameters
	this.diameter = 8;
	this.incisionLength = 0;
	
	// Other parameters
	this.thickness = 15;
	this.spotSeparation = "";
	this.lineSeparation = "";
	this.energyLevel = "";

	// Saved parameters
	this.savedParameterArray = [
		'scaleX', 
		'scaleY',
		'arc', 
		'diameter',
		'incisionLength', 
		'thickness',
		'spotSeparation', 
		'lineSeparation',
		'energyLevel',
	];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'diameter':'lenticule diameter (mm)', 
		'incisionLength':'Pocket length (mm)',
		'thickness':'Lenticule bed thickness (um)', 
		'spotSeparation':'Spot separation',
		'lineSeparation':'Line separation',
		'energyLevel':'Energy level (uJ)',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.SMILE.prototype = new ED.Doodle;
ED.SMILE.prototype.constructor = ED.SMILE;
ED.SMILE.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SMILE.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.SMILE.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.7, +0.9);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.7, +0.9);
	this.parameterValidationArray['arc']['range'].setMinAndMax(1/3, 2/3);

	// Derived parameters
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(7, 9),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['incisionLength'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(2, 4),
		precision: 1,
		animate: true
	};
	
	// Other parameters
	this.parameterValidationArray['thickness'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(10, 30),
		animate: false
	};
	this.parameterValidationArray['spotSeparation'] = {
		kind: 'other',
		type: 'string',
		list: ['0.5um', '0.6um', '0.7um', '0.8um', '0.9um', '1.0um'],
		animate: false
	};
	this.parameterValidationArray['lineSeparation'] = {
		kind: 'other',
		type: 'string',
		list: ['0.5um', '0.6um', '0.7um', '0.8um', '0.9um', '1.0um'],
		animate: false
	};
	this.parameterValidationArray['energyLevel'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(0.1, 2),
		precision: 2,
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.SMILE.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '8.0');
	this.setParameterFromString('incisionLength', '4.0');
	this.setParameterFromString('thickness', '15');
	this.setParameterFromString('spotSeparation', '0.6um');
	this.setParameterFromString('lineSeparation', '0.6um');
	this.setParameterFromString('energyLevel', '0.17');
	
	/*
	a) what are the default laser energy (depends on the individual machine and user preference, recommended around 170nJ = energy setting 34), spot and line separations ( 4.5 µm in the lamellar interfaces, I believe 2µm in the sidecuts) for SMILE
	b) what are the standard side pocket dimensions?  we call it access incision  Do these vary? Below 4mm length. Depending on surgeon preference and skills typically around 3 mm, a few surgeons go down to 2 mm. Donald and Jod are doing this in Singapore
	*/
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.SMILE.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'scaleX':
			returnArray['diameter'] = _value * 10;
			break;

		case 'arc':
			returnArray['incisionLength'] = _value * 6;
			break;

		case 'diameter':
			returnArray['scaleX'] = parseFloat(_value)/10;
			returnArray['scaleY'] = parseFloat(_value)/10;
			break;
			
		case 'incisionLength':
			returnArray['arc'] = _value / 6;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SMILE.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SMILE.superclass.draw.call(this, _point);

	// SMILE
	var r = 320;
	var theta = this.arc / 2;		

	// Boundary path
	ctx.beginPath();

	// Do a circle
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path to produce straight line
	ctx.closePath();

	// Create transparent fill pattern
	ctx.fillStyle = "rgba(155,255,255,0)";

	// Transparent stroke
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0.9)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Flap
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2, true);
		ctx.setLineDash([8,12]);
		ctx.stroke();
		ctx.setLineDash([]);
		
		// Incision
		ctx.beginPath();
		var arcStart = -Math.PI / 2 + theta;
		var arcEnd = -Math.PI / 2 - theta;
		ctx.arc(0, 0, r, arcStart, arcEnd, true);
		ctx.arc(0, 0, r - 30, arcEnd, arcStart, false);
		ctx.closePath();
		ctx.fillStyle = "rgba(100,100,200,0.75)";
		ctx.fill();
	}
	
	// Coordinates of handles (in canvas plane)
	var startHandle = new ED.Point(-r * Math.sin(theta), -r * Math.cos(theta));
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.SMILE.prototype.description = function() {
	var returnString = "";

	returnString = "SMILE";

	return returnString;
}
