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
 * HVT
 *
 * @class HVT
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.HVT = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "HVT";

	// Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
	this.hor = 'None';
	this.ver = 'None';
	this.tor = 'None';

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HVT.prototype = new ED.Doodle;
ED.HVT.prototype.constructor = ED.HVT;
ED.HVT.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HVT.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.HVT.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isShowHighlight = false;

	// Adjust ranges for simple parameters
	this.parameterValidationArray['originY']['range'] = new ED.Range(-100, +100);
	this.parameterValidationArray['rotation']['range'] = new ED.Range(0, Math.PI / 2);

	// Speed up horizontal and vertical animation
	this.parameterValidationArray['originX']['delta'] = 30;
	this.parameterValidationArray['originY']['delta'] = 30;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['hor'] = {
		kind: 'derived',
		type: 'string',
		list: ['XT', 'None', 'ET'],
		animate: true
	};
	this.parameterValidationArray['ver'] = {
		kind: 'derived',
		type: 'string',
		list: ['R/L', 'None', 'L/R'],
		animate: true
	};
	this.parameterValidationArray['tor'] = {
		kind: 'derived',
		type: 'string',
		list: ['Excyclotorsion', 'None', 'Incyclotorsion'],
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HVT.prototype.setParameterDefaults = function() {
	this.setParameterFromString('hor', 'None');
	this.setParameterFromString('tor', 'None');
	//this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.HVT.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	// Value of centre for right eye
	var centre = -250;

	switch (_parameter) {
		case 'originX':
			var fudge = 20;
			if (_value < centre - fudge) {
				returnArray['hor'] = 'XT';
			} else if (_value > centre + fudge) {
				returnArray['hor'] = 'ET';
			} else {
				returnArray['hor'] = 'None';
			}
			break;

		case 'originY':
			var fudge = 20;
			if (_value < 0 - fudge) {
				returnArray['ver'] = 'R/L';
			} else if (_value > 0 + fudge) {
				returnArray['ver'] = 'L/R';
			} else {
				returnArray['ver'] = 'None';
			}
			break;

		case 'rotation':
			var fudge = Math.PI / 16;
			if (_value < Math.PI / 4 - fudge) {
				returnArray['tor'] = 'Excyclotorsion';
			} else if (_value > Math.PI / 4 + fudge) {
				returnArray['tor'] = 'Incyclotorsion';
			} else {
				returnArray['tor'] = 'None';
			}
			break;

		case 'hor':
			switch (_value) {
				case 'XT':
					returnArray['originX'] = centre - 100;
					break;

				case 'ET':
					returnArray['originX'] = centre + 100;
					break;

				default:
					returnArray['originX'] = centre;
					break;
			}
			break;

		case 'ver':
			switch (_value) {
				case 'R/L':
					returnArray['originY'] = 0 - 100;
					break;

				case 'L/R':
					returnArray['originY'] = 0 + 100;
					break;

				default:
					returnArray['originY'] = 0;
					break;
			}
			break;

		case 'tor':
			switch (_value) {
				case 'Excyclotorsion':
					returnArray['rotation'] = 0;
					break;

				case 'Incyclotorsion':
					returnArray['rotation'] = Math.PI / 2;
					break;

				default:
					returnArray['rotation'] = Math.PI / 4;
					break;
			}
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVT.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.HVT.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 125;
	var ri = 40;

	// Use polar coordinates to draw axis line and handle
	var phi = 1.75 * Math.PI;
	var p = new ED.Point(0, 0);

	// Boundary path
	ctx.beginPath();

	// Circle
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Move to inner circle
	ctx.moveTo(ri, 0);

	// Arc back the other way
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Axis lines
		var d = 5;
		ctx.beginPath();

		// Define axis
		p.setWithPolars(ro - d, phi);
		ctx.moveTo(p.x, p.y);
		p.setWithPolars(ri + d, phi);
		ctx.lineTo(p.x, p.y);
		p.setWithPolars(-ro + d, phi);
		ctx.moveTo(p.x, p.y);
		p.setWithPolars(-ri - d, phi);
		ctx.lineTo(p.x, p.y);

		// Draw it
		ctx.lineWidth = 20;
		ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	p.setWithPolars(ro, phi);
	this.handleArray[1].location = this.transform.transformPoint(p);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}
