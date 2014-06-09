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
 * Blood pressure reading
 *
 * @class RecordReading
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RecordReading = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RecordReading";

	// Private parameters
	this.type = 'sys';			// Can be either 'sys', 'dia', 'pul', 'res', 'oxi'

	// Derived parameters
	this.value = '0';			// Numerical value of reading

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'value', 'type'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RecordReading.prototype = new ED.Doodle;
ED.RecordReading.prototype.constructor = ED.RecordReading;
ED.RecordReading.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.RecordReading.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['value'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0, 240),
		animate: false
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['sys', 'dia', 'pul', 'res', 'oxi'],
		animate: false
	};
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.RecordReading.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'originY':
			returnArray['value'] = Math.round(240 * (this.drawing.doodlePlaneHeight/2 - _value)/this.drawing.doodlePlaneHeight);
			break;

		case 'value':
			returnArray['originY'] = - (_value * this.drawing.doodlePlaneHeight/240) + this.drawing.doodlePlaneHeight/2;
			break;

		case 'originX':
			// When originX is set, ensure user cannot move doodle to left and right
			this.parameterValidationArray['originX']['range'].setMinAndMax(this.originX, this.originX);
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RecordReading.prototype.draw = function(_point) { //console.log(this.originX);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RecordReading.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Width and half height
	var w = 56;
	var h = 30;

	switch (this.type) {
		case 'sys':
			ctx.rect(-w/2, -h, w, h);
			break;
		case 'dia':
			ctx.rect(-w/2, 0, w, h);
			break;
		case 'pul':
			ctx.arc(0, 0, h, 0, Math.PI * 2, true);
			break;
		case 'res':
			ctx.arc(0, 0, h, 0, Math.PI * 2, true);
			break;
		case 'oxi':
			ctx.rect(-w/2, -h/2, w, h);
			break;
	}

	// Close path
	ctx.closePath();

	// Transparent stroke and fill
	ctx.strokeStyle = "rgba(255,255,255,0)";
	ctx.fillStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		switch (this.type) {
			case 'sys':
				ctx.moveTo(-w/2, -h);
				ctx.lineTo(0, 0);
				ctx.lineTo(w/2, -h);
				break;
			case 'dia':
				ctx.moveTo(-w/2, h);
				ctx.lineTo(0, 0);
				ctx.lineTo(w/2, h);
				break;
			case 'pul':
				ctx.arc(0, 0, 20, 0, Math.PI * 2, true);
				break;
			case 'res':
				ctx.arc(0, 0, 20, 0, Math.PI * 2, true);
				break;
			case 'oxi':
				ctx.rect(-w/2, -h/2, w, h);
				break;
		}

		// Set line attributes
		ctx.lineWidth = 8;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = "gray";
		ctx.fillStyle= ctx.strokeStyle;

		// Draw symbol
		ctx.stroke();
		if (this.type == 'pul') ctx.fill();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.RecordReading.prototype.drawHighlightExtras = function() {
	// Get context
	var ctx = this.drawing.context;

	// Draw value
	ctx.lineWidth = 1;
	ctx.font = "64px sans-serif";
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "blue";
	ctx.fillText(this.value, +40, +20);
}

