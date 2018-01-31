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
 * PTK (Photo Therapeutic Keratectomy
 *
 * @class PTK
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PTK = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PTK";

	// Derived parameters
	this.diameter = 8;
	
	// Other parameters
	this.depth = 80;
	this.transepithelialTreatment = false;
	this.topographyGuidedTreatment = false;

	// Saved parameters
	this.savedParameterArray = [
		'apexX', 
		'apexY', 
		'diameter', 
		'depth',
		'transepithelialTreatment',
		'topographyGuidedTreatment' 
	];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'diameter':'Diameter', 
		'depth':'Depth',
		'transepithelialTreatment':'Transepithelial',
		'topographyGuidedTreatment':'Topography guided'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PTK.prototype = new ED.Doodle;
ED.PTK.prototype.constructor = ED.PTK;
ED.PTK.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PTK.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.PTK.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -32);

	// Derived parameters
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(1, 10),
		precision: 1,
		animate: true
	};
	
	// Other parameters
	this.parameterValidationArray['depth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 400),
		animate: false
	};
	this.parameterValidationArray['transepithelialTreatment'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['topographyGuidedTreatment'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.PTK.prototype.setParameterDefaults = function() {
	this.rotation = Math.PI/4;
	this.setParameterFromString('diameter', '8.0');
	this.setParameterFromString('depth', '100');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PTK.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {

		case 'apexY':
			returnArray['diameter'] = -10 * _value/320;
			break;

		case 'diameter':
			returnArray['apexY'] = -320 * parseFloat(_value)/10;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PTK.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PTK.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Do an arc
	ctx.arc(0, 0, -this.apexY, 0, Math.PI * 2, true);

	// Close path to produce straight line
	ctx.closePath();

	// Create transparent fill pattern
	ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['TranslucentPattern'], 'repeat');

	// Transparent stroke
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0.9)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(this.apexX, this.apexY);
	this.handleArray[4].location = this.transform.transformPoint(point);

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
ED.PTK.prototype.description = function() {
	var returnString = "";

	returnString = "PTK";

	return returnString;
}
