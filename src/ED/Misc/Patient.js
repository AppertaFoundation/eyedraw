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
 * Patient
 *
 * @class patient
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Patient = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Patient";
	
	// Derived parameters
	this.recliningAngle = 0;
	
	// Saved parameters
	this.savedParameterArray = ['rotation'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Patient.prototype = new ED.Doodle;
ED.Patient.prototype.constructor = ED.Patient;
ED.Patient.superclass = ED.Doodle.prototype;


/**
 * Sets default properties
 */
ED.Patient.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.isScaleable = false;
	this.isMoveable = false;
	this.isDeletable = false;
	this.willStaySelected = false;
	//this.snapToAngles = true
	
	// Adjust ranges for simple parameters
	this.parameterValidationArray['rotation']['range'] = new ED.Range(270 * Math.PI / 180, 360 * Math.PI/180);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['recliningAngle'] = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 91),
		clock: 'bottom',
		animate: true
	};
	
	// Array of angles to snap to
// 	var phi = Math.PI / 6;
// 	this.anglesArray = [phi * 9, phi * 10, phi * 11, phi * 12];
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Patient.prototype.setParameterDefaults = function() {
	this.scaleX = 0.65;
	this.scaleY = 0.7;
	this.recliningAngle = 0
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Patient.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'rotation':
			// Watch for edge conditions from over-rotating
			var angle = 360 - _value * 180/Math.PI;
			if (angle > 300) { angle = 0; }
			if (angle > 90) { angle = 90; }
			returnArray['recliningAngle'] = angle;
			break;

		case 'recliningAngle':
			var angle = (360 - _value) * Math.PI / 180;
			returnArray['rotation'] = angle;
			break;
	}

	return returnArray;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patient.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Patient.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	ctx.moveTo(-642,41);
	ctx.bezierCurveTo(-653,-91,-522,-146,-496,-148);
	ctx.bezierCurveTo(-470,-150,-221,-159,-199,-166);
	ctx.bezierCurveTo(-177,-174,-168,-201,-126,-221);
	ctx.bezierCurveTo(-95,-232,-71,-223,-54,-214);
	ctx.bezierCurveTo(-38,-205,-32,-170,-16,-168);
	ctx.bezierCurveTo(1,-166,21,-184,37,-166);
	ctx.bezierCurveTo(54,-148,21,-137,36,-126);
	ctx.bezierCurveTo(50,-115,58,-130,83,-122);
	ctx.bezierCurveTo(109,-115,169,-91,190,-82);
	ctx.bezierCurveTo(210,-73,232,-64,270,-67);
	ctx.bezierCurveTo(309,-71,301,-87,318,-106);
	ctx.bezierCurveTo(334,-124,316,-130,343,-155);
	ctx.bezierCurveTo(362,-170,395,-166,395,-166);
	ctx.lineTo(406,-177);
	ctx.lineTo(420,-168);
	ctx.lineTo(441,-175);
	ctx.bezierCurveTo(441,-175,441,-201,453,-203);
	ctx.bezierCurveTo(466,-205,492,-170,510,-168);
	ctx.bezierCurveTo(529,-166,508,-181,538,-181);
	ctx.bezierCurveTo(567,-181,617,-150,640,-137);
	ctx.bezierCurveTo(662,-108,651,-120,662,-90);
	ctx.bezierCurveTo(673,-60,677,-16,666,12);
	ctx.bezierCurveTo(655,39,642,52,618,61);
	ctx.bezierCurveTo(595,70,529,74,549,74);
	ctx.bezierCurveTo(569,74,442,74,463,72);
	ctx.bezierCurveTo(371,79,389,78,365,100);
	ctx.bezierCurveTo(342,122,354,158,336,191);
	ctx.bezierCurveTo(318,224,305,228,266,253);
	ctx.bezierCurveTo(125,279,-56,336,-106,296);
	ctx.bezierCurveTo(-122,270,-118,266,-139,224);
	ctx.bezierCurveTo(-175,221,-357,234,-446,236);
	ctx.bezierCurveTo(-536,239,-631,173,-642,41);

	// Close path
	ctx.closePath();

	// Set Attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(120,120,120,1)";

	// Set light blue for surgeon's gown
	var colour = new ED.Colour(0, 0, 0, 1);
	colour.setWithHexString('3AFEFA');
	ctx.fillStyle = colour.rgba();
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}