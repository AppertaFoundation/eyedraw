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
 * Lasik Flap
 *
 * @class LasikFlap
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.LasikFlap = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "LasikFlap";

	// Derived parameters
	this.hinge = "";
	this.diameter = 6;
	
	// Other parameters
	this.femtoLaser = "";
	this.depth = 80;
	this.angle = 30;
	this.spotSeparation = "";
	this.lineSeparation = "";
	this.energyLevel = "";
	this.OBLGrade = "";

	// Saved parameters
	this.savedParameterArray = [
		'scaleX', 
		'scaleY', 
		'rotation', 
		'femtoLaser', 
		'diameter', 
		'depth', 
		'angle', 
		'spotSeparation', 
		'lineSeparation',
		'energyLevel',
		'OBLGrade'
	];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'hinge':'Hinge',
		'femtoLaser':'Femto laser', 
		'diameter':'Diameter', 
		'depth':'Depth', 
		'angle':'Sidecut angle', 
		'spotSeparation':'Spot separation',
		'lineSeparation':'Line separation',
		'energyLevel':'Energy level',
		'OBLGrade':'OBL grade'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.LasikFlap.prototype = new ED.Doodle;
ED.LasikFlap.prototype.constructor = ED.LasikFlap;
ED.LasikFlap.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LasikFlap.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.LasikFlap.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.snapToAngles = true;
	this.isUnique = true;
	
	// Array of angles to snap to
	var phi = Math.PI / 4;
	this.anglesArray = [0, (this.drawing.eye == ED.eye.Right)?(Math.PI/2):(3 * Math.PI/2)];

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.60, +1.00);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.60, +1.00);

	// Derived parameters	
	this.parameterValidationArray['hinge'] = {
		kind: 'other',
		type: 'string',
		list: ['Superior', 'Nasal'],
		animate: true
	};
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(6, 10),
		precision: 1,
		animate: true
	};
	
	// Other parameters
	this.parameterValidationArray['femtoLaser'] = {
		kind: 'other',
		type: 'string',
		list: ['DDL AMO iFS', 'Zeiss Visumax', 'Zeimer Z7'],
		animate: true
	};
	this.parameterValidationArray['depth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(80, 200),
		animate: false
	};
	this.parameterValidationArray['angle'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(30, 150),
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
		type: 'string',
		list: ['0.50uJ', '0.55uJ', '0.60uJ', '0.65uJ', '0.70uJ', '0.75uJ', '0.80uJ', '0.85uJ', '0.90uJ', '0.95uJ', '1.00uJ'],
		animate: false
	};
	this.parameterValidationArray['OBLGrade'] = {
		kind: 'other',
		type: 'string',
		list: ['None', 'Trace outside pupillary axis', 'In pupillary axis'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.LasikFlap.prototype.setParameterDefaults = function() {
	this.setParameterFromString('hinge', 'Superior');
	this.setParameterFromString('femtoLaser', 'DDL AMO iFS');
	this.setParameterFromString('diameter', '8.5');
	this.setParameterFromString('depth', '110');
	this.setParameterFromString('angle', '90');
	this.setParameterFromString('spotSeparation', '0.6um');
	this.setParameterFromString('lineSeparation', '0.6um');
	this.setParameterFromString('energyLevel', '0.75uJ');
	this.setParameterFromString('OBLGrade', 'None');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.LasikFlap.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'scaleX':
			returnArray['diameter'] = _value * 10;
			break;
			
		case 'rotation':
			if (_value == 0) returnArray['hinge'] = 'Superior';
			else returnArray['hinge'] = 'Nasal';
			break;

		case 'diameter':
			returnArray['scaleX'] = parseFloat(_value)/10;
			returnArray['scaleY'] = parseFloat(_value)/10;
			break;
			
		case 'hinge':
			if (_value == 'Superior') returnArray['rotation'] = 0;
			else returnArray['rotation'] = (this.drawing.eye == ED.eye.Right)?(Math.PI/2):(3 * Math.PI/2);
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LasikFlap.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.LasikFlap.superclass.draw.call(this, _point);

	// LasikFlap
	var r = 320;

	// Calculate parameters for arc
	var angle = Math.PI / 6;
	var arcStart = -Math.PI / 2 - angle;
	var arcEnd = -Math.PI / 2 + angle;

	// Boundary path
	ctx.beginPath();

	// Do an arc
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

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
		ctx.beginPath();
		ctx.arc(0, 0, r/2, 0, 2* Math.PI, true);
		switch (this.gradeDLK) {
			case 'None':
				ctx.fillStyle = "rgba(155,255,255,0)";
				break;
			case 'Grade 1':
				ctx.fillStyle = "rgba(155,255,255,0.4)";
				break;
			case 'Grade 2':
				ctx.fillStyle = "rgba(155,255,255,0.6)";
				break;
			case 'Grade 3':
				ctx.fillStyle = "rgba(155,255,255,0.8)";
				break;
		}
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, angle);
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
ED.LasikFlap.prototype.description = function() {
	var returnString = "";

	// Get side
	if (this.drawing.eye == ED.eye.Right) {
		var isRightSide = true;
	} else {
		var isRightSide = false;
	}

	// Use trigonometry on rotation field to determine quadrant ***TODO*** push function up to superclass
	var c = Math.cos(this.rotation);
	var s = Math.sin(this.rotation);
	var ac = Math.abs(c);
	var as = Math.abs(s);

	var quadrant = "";
	if (s > c && as > ac) quadrant = isRightSide ? "nasal" : "temporal";
	if (s > c && as < ac) quadrant = "inferior";
	if (s < c && as > ac) quadrant = isRightSide ? "temporal" : "nasal";
	if (s < c && as < ac) quadrant = "superior";

	returnString = "LASIK flap with " + quadrant + " hinge";

	return returnString;
}
