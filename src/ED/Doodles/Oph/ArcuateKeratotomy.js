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
 * ArcuateKeratotomy
 *
 * @class ArcuateKeratotomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ArcuateKeratotomy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ArcuateKeratotomy";

	// Derived parameters
	this.diameter = 8;
	this.arcLength = 0;
	this.axis = 0;
	
	// Other parameters
	this.anteriorDepth = 0;
	this.posteriorDepth = 0;
	this.angle = 0;
	this.spotSeparation = "";
	this.lineSeparation = "";
	this.energyLevel = "";
	
	// Saved parameters
	this.savedParameterArray = [
		'arc', 
		'rotation', 
		'apexY', 
		'diameter', 
		'arcLength', 
		'axis', 
		'anteriorDepth', 
		'posteriorDepth', 
		'angle', 
		'spotSeparation', 
		'lineSeparation',
		'energyLevel'
		];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'diameter':'Diameter (mm)',
		'arcLength':'Arc length (deg)',
		'axis':'Axis (deg)',
		'anteriorDepth':'Anterior depth (um)',
		'posteriorDepth':'Posterior depth (um)',
		'angle':'Cut angle (deg)', 
		'spotSeparation':'Spot separation',
		'lineSeparation':'Line separation',
		'energyLevel':'Energy level'
	};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ArcuateKeratotomy.prototype = new ED.Doodle;
ED.ArcuateKeratotomy.prototype.constructor = ED.ArcuateKeratotomy;
ED.ArcuateKeratotomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ArcuateKeratotomy.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.ArcuateKeratotomy.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(10 * Math.PI / 180, 2 * Math.PI / 3);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -96);
	
	// Derived parameters
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(3, 10),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['arcLength'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(10, 120),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['axis'] = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 360),
		clock: 'bottom',
		animate: true
	};
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(3, 10),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['anteriorDepth'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(-50, 100),
		precision: 0,
		animate: false
	};
	this.parameterValidationArray['posteriorDepth'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(300, 800),
		precision: 0,
		animate: false
	};
	this.parameterValidationArray['angle'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(30, 150),
		precision: 1,
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
}

/**
 * Sets default parameters
 */
ED.ArcuateKeratotomy.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '6.0');
	this.setParameterFromString('arcLength', '60');
	this.setParameterFromString('axis', '90');
	this.setParameterFromString('anteriorDepth', '70');
	this.setParameterFromString('posteriorDepth', '600');
	this.setParameterFromString('angle', '90');
	this.setParameterFromString('spotSeparation', '0.6um');
	this.setParameterFromString('lineSeparation', '0.6um');
	this.setParameterFromString('energyLevel', '0.75uJ');

	// Add others according to scheme
	var n = this.drawing.numberOfDoodlesOfClass(this.className);

	if (n > 0) {
		var doodle = this.drawing.firstDoodleOfClass(this.className);
		switch (n) {
			// Second doodle is opposite first
			case 1:
				this.rotation = doodle.rotation + Math.PI;
				this.arc = doodle.arc;
				this.setParameterFromString('diameter', doodle.diameter.toString());
				break;
				
			// Third doodle is inside first and smaller
			case 2:
				this.rotation = doodle.rotation;
				var newDiameter = doodle.diameter * 0.8;
				this.setParameterFromString('diameter', newDiameter.toString());
				break;
				
			// Fourth doodle is inside second and smaller
			case 3:
				this.rotation = doodle.rotation + Math.PI;
				var newDiameter = doodle.diameter * 0.8;
				this.setParameterFromString('diameter', newDiameter.toString());
				break;
				
			// Fifth doodle is somewhere else!
			case 4:
				this.rotation = doodle.rotation + Math.PI/2;
				break;
				
			default:
				doodle = this.drawing.lastDoodleOfClass(this.className);
				this.rotation = doodle.rotation + Math.PI/6;
				break;
		}
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
ED.ArcuateKeratotomy.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {

		case 'apexY':
			returnArray['diameter'] = -10 * _value/320;
			break;

		case 'diameter':
			returnArray['apexY'] = -320 * parseFloat(_value)/10;
			break;
			
		case 'arc':
			returnArray['arcLength'] = 180 * _value/Math.PI;
			break;

		case 'arcLength':
			returnArray['arc'] = parseInt(_value) * Math.PI / 180;
			break;
			
		case 'rotation':
			var angle = (((Math.PI * 2 - _value + Math.PI / 2) * 180 / Math.PI) + 360) % 360;
			if (angle == 360) angle = 0;
			returnArray['axis'] = angle;
			break;

		case 'axis':
			returnArray['rotation'] = (((90 - _value) + 360) % 360) * Math.PI / 180;
			break;			
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ArcuateKeratotomy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ArcuateKeratotomy.superclass.draw.call(this, _point);

	// Radius
	var r = -this.apexY;
	var d = 12;
	var ro = r + d;
	var ri = r - d;

	// Boundary path
	ctx.beginPath();

	// Half angle of arc
	var theta = this.arc / 2;
	var offsetAngle = -Math.PI / 2;

	// Arc across
	ctx.arc(0, 0, ro, offsetAngle + theta, offsetAngle - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, offsetAngle - theta, offsetAngle + theta, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(100,100,200,0.5)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
	var point = new ED.Point(this.apexX, this.apexY);
	this.handleArray[4].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ArcuateKeratotomy.prototype.groupDescription = function() {
	return "Arcuate Keratotomy";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ArcuateKeratotomy.prototype.description = function() {
	var returnString = "";

	return returnString;
}


