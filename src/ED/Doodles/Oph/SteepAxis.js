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
 * SteepAxis
 *
 * @class SteepAxis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SteepAxis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SteepAxis";

	// Derived parameters
	this.axis = '0';

	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.SteepAxis.prototype = new ED.Doodle;
ED.SteepAxis.prototype.constructor = ED.SteepAxis;
ED.SteepAxis.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.SteepAxis.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isShowHighlight = false;
	this.isMoveable = false;
	this.addAtBack = true;
	this.isUnique = true;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['axis'] = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 180),
		clock: 'bottom',
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.SteepAxis.prototype.setParameterDefaults = function() {
	this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.SteepAxis.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'rotation':
			returnArray['axis'] = (360 - 180 * _value / Math.PI) % 180;
			break;

		case 'axis':
			returnArray['rotation'] = (180 - _value) * Math.PI / 180;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SteepAxis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SteepAxis.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 300;

	// Boundary path
	ctx.beginPath();

	// Arc a circle
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var d = 140;
		ctx.beginPath();
		ctx.moveTo(-ro - d, 0);
		ctx.lineTo(ro + d, 0);

		ctx.lineWidth = 8;
		ctx.strokeStyle = "gray";
		ctx.stroke();
		
		var h = 200;
		var r = 540;
		ctx.beginPath();
		ctx.moveTo(-ro, 0);
		ctx.arcTo(0, h, ro, 0, r);
		ctx.closePath();
		
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "lightgray";
		ctx.fill();
		ctx.stroke();		
	}

	// Return value indicating successful hit test
	return this.isClicked;
}
