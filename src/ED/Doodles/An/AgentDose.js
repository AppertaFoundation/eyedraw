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
 * Agent Duration
 *
 * @class AgentDose
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AgentDose = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AgentDose";

	// Derived parameters
	//this.value = '0';

	// Private parameters
	this.halfWidth = 50;
	this.halfHeight = 20;
	this.minimumWidth = 40;

	this.valueString = "200mg";

	// Saved parameters
	//this.savedParameterArray = ['originX', 'originY', 'value'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AgentDose.prototype = new ED.Doodle;
ED.AgentDose.prototype.constructor = ED.AgentDose;
ED.AgentDose.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AgentDose.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.AgentDose.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
// 	this.parameterValidationArray['value'] = {
// 		kind: 'derived',
// 		type: 'int',
// 		range: new ED.Range(0, 240),
// 		animate: false
// 	};
	// Update component of validation array for simple parameters
	//this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['originX']['range'].setMinAndMax(-1000 + this.halfWidth, +900);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-this.halfWidth + this.minimumWidth, +1500);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AgentDose.prototype.setParameterDefaults = function() {
	this.apexX = 100;
//
// 	var lastAgentDose = this.drawing.lastDoodleOfClass('AgentDose');
// 	if (lastAgentDose) {
// 		this.setParameterFromString('value', lastAgentDose.value.toString());
// 	}
// 	else {
// 		this.setParameterFromString('value', '80');
// 	}

	// Get x separation of drawing
// 	var recordGrid = this.drawing.lastDoodleOfClass('RecordGrid');
// 	if (recordGrid) {
// 		var xd = this.drawing.doodlePlaneWidth/recordGrid.numberCellsHorizontal;
// 		this.originX = recordGrid.firstCoordinate + recordGrid.index * xd;
// 		this.parameterValidationArray['originX']['range'].setMinAndMax(this.originX, this.originX);
// 	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
// ED.AgentDose.prototype.dependentParameterValues = function(_parameter, _value) {
// 	var returnArray = new Array();
//
// 	switch (_parameter) {
// 		case 'originY':
// 			returnArray['value'] = Math.round(240 * (this.drawing.doodlePlaneHeight/2 - _value)/this.drawing.doodlePlaneHeight);
// 			break;
//
// 		case 'value':
// 			returnArray['originY'] = - (_value * this.drawing.doodlePlaneHeight/240) + this.drawing.doodlePlaneHeight/2;
// 			break;
// 	}
//
// 	return returnArray;
// }

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AgentDose.prototype.draw = function(_point) { //console.log(this.originX);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AgentDose.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Boundary
	var d = 5;
	var f = 1.5;
	this.halfWidth = ctx.measureText(this.valueString).width * f;

	ctx.moveTo(-this.halfWidth, -this.halfHeight + d);
	ctx.lineTo(-d, -this.halfHeight + d);
	ctx.lineTo(0, -this.halfHeight);
	ctx.lineTo(d, -this.halfHeight + d);
	ctx.lineTo(this.halfWidth, -this.halfHeight + d);
	ctx.lineTo(this.halfWidth, this.halfHeight - d);
	ctx.lineTo(d, this.halfHeight - d);
	ctx.lineTo(0, this.halfHeight);
	ctx.lineTo(-d, this.halfHeight - d);
	ctx.lineTo(-this.halfWidth, this.halfHeight - d);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(50,50,50,1)";
	ctx.fillStyle =  "white";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Text properties
		ctx.font = "24px sans-serif";
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";

		// Draw text centred on grid line
		var textWidth = ctx.measureText(this.valueString).width;
		ctx.fillText(this.valueString, - textWidth/2, 8);
	}

	// Coordinates of handles (in canvas plane)
	//this.handleArray[3].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	//if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
// ED.AgentDose.prototype.drawHighlightExtras = function() {
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

