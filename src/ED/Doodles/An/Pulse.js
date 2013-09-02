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
 * Pulse (Heart rate) reading
 *
 * @class Pulse
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Pulse = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Pulse";
		
	// Derived parameters
	this.value = '0';
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'value'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Pulse.prototype = new ED.Doodle;
ED.Pulse.prototype.constructor = ED.Pulse;
ED.Pulse.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.Pulse.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['value'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0, 240),
		animate: false
	};
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Pulse.prototype.setParameterDefaults = function() {
	
	
	var lastPulse = this.drawing.lastDoodleOfClass('Pulse');
	if (lastPulse) {
		this.setParameterFromString('value', lastPulse.value.toString());
	}
	else {
		this.setParameterFromString('value', '80');
	}
	
	// Get x separation of drawing
	var recordGrid = this.drawing.lastDoodleOfClass('RecordGrid');
	if (recordGrid) {
		var xd = this.drawing.doodlePlaneWidth/recordGrid.numberCellsHorizontal;
		this.originX = recordGrid.firstCoordinate + recordGrid.index * xd;
		this.parameterValidationArray['originX']['range'].setMinAndMax(this.originX, this.originX);
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
ED.Pulse.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'originY':
			returnArray['value'] = Math.round(240 * (this.drawing.doodlePlaneHeight/2 - _value)/this.drawing.doodlePlaneHeight);
			break;

		case 'value':
			returnArray['originY'] = - (_value * this.drawing.doodlePlaneHeight/240) + this.drawing.doodlePlaneHeight/2;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Pulse.prototype.draw = function(_point) { //console.log(this.originX);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Pulse.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Pulse
	var r = 20;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(125,125,125,1)";
	ctx.fillStyle = ctx.strokeStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
// ED.Pulse.prototype.drawHighlightExtras = function() {
// 	// Get context
// 	var ctx = this.drawing.context;
// 
// 	// Draw text description of gauge
// 	ctx.lineWidth = 1;
// 	ctx.font = "64px sans-serif";
// 	ctx.strokeStyle = "blue";
// 	ctx.fillStyle = "blue";
// 	ctx.fillText(this.value, +40, +20);
// }

