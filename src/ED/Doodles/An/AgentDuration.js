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
 * @class AgentDuration
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AgentDuration = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AgentDuration";
		
	// Derived parameters
	this.unit = 'mg';
	this.type = 'range';
	
	// Private parameters
	this.halfHeight = 20;
	this.minimumWidth = 40;
	this.dose = '';

	// Saved parameters
	this.savedParameterArray = ['originX', 'apexX', 'unit', 'type', 'dose'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AgentDuration.prototype = new ED.Doodle;
ED.AgentDuration.prototype.constructor = ED.AgentDuration;
ED.AgentDuration.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AgentDuration.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.AgentDuration.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['unit'] = {
		kind: 'derived',
		type: 'string',
		list: ['mg', 'mls', 'ug', 'mg/kg/hr', 'ug/kg/hr', 'drops', 'IU'],
		animate: false
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['range', 'fixed'],
		animate: false
	};
		
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +900);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(this.minimumWidth, +1500);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AgentDuration.prototype.setParameterDefaults = function() {
	this.apexX = this.minimumWidth;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AgentDuration.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'type':
			if (_value == 'range') this.apexX = 200;
			else this.apexX = 40;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AgentDuration.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AgentDuration.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Boundary
	var offset = this.minimumWidth/2;
	if (this.type == 'range') offset = 0;
	ctx.rect(0 - offset, -this.halfHeight, this.apexX, this.halfHeight * 2);

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(125,125,125,0)";
	ctx.fillStyle =  "rgba(125,125,125,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		
		if (this.type == 'range') {
			// Draw line with end bars
			ctx.moveTo(0 - offset, -this.halfHeight);
			ctx.lineTo(0 - offset, this.halfHeight);
			ctx.moveTo(0 - offset, 0);
			ctx.lineTo(this.apexX - offset, 0);
			ctx.moveTo(this.apexX - offset, -this.halfHeight);
			ctx.lineTo(this.apexX - offset, this.halfHeight);
		}
		else {
			// Draw diamond
			ctx.moveTo(-offset, 0);
			ctx.lineTo(0, this.halfHeight);
			ctx.lineTo(offset, 0);
			ctx.lineTo(0, -this.halfHeight);
			ctx.closePath();
		}
		
		// Set attributes
		ctx.lineWidth = 4;
		ctx.strokeStyle = "rgba(50,50,50,1)";
		
		// Draw
		ctx.stroke();

		// Draw dose
		ctx.lineWidth = 1;
		ctx.font = "24px sans-serif";
		ctx.strokeStyle = "blue";
		ctx.fillStyle = "blue";
		var text = String(this.dose);
		if (text.length > 0) text = text + ' ' + this.unit;
		var textWidth = ctx.measureText(text).width;
		var padding = 10;
		ctx.fillText(text, offset + padding, -8);
	}

	// Only draw handle for range, not fixed
	if (this.type == 'range') {
		// Coordinates of handles (in canvas plane)
		this.handleArray[3].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

		// Draw handles if selected
		if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	}
		
	// Return value indicating successful hittest
	return this.isClicked;
}


