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
 * Disc Haemorrhage
 *
 * @class DiscPallor
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
ED.DiscPallor = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "DiscPallor";

	// Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
	this.grade = 'Sectorial';

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiscPallor.prototype = new ED.Doodle;
ED.DiscPallor.prototype.constructor = ED.DiscPallor;
ED.DiscPallor.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DiscPallor.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.DiscPallor.prototype.setPropertyDefaults = function() {
	this.isArcSymmetrical = true;
	this.isMoveable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['Sectorial', 'Diffuse'],
		animate: true
	};

	// Speed up animation for arc
	this.parameterValidationArray['arc']['delta'] = 0.2;
}

/**
 * Sets default parameters
 */
ED.DiscPallor.prototype.setParameterDefaults = function() {
	this.arc = 60 * Math.PI / 180;
	this.setRotationWithDisplacements(45, -120);
	this.setParameterFromString('grade', 'Sectorial');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.DiscPallor.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'arc':
			if (_value < 2 * Math.PI) returnArray['grade'] = 'Sectorial';
			else returnArray['grade'] = 'Diffuse';
			break;

		case 'grade':
			switch (_value) {
				case 'Sectorial':
					if (this.arc < 2 * Math.PI) returnArray['arc'] = this.arc;
					else returnArray['arc'] = Math.PI / 2;
					break;
				case 'Diffuse':
					returnArray['arc'] = 2 * Math.PI;
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
ED.DiscPallor.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DiscPallor.superclass.draw.call(this, _point);

	// Radius of disc
	var ro = 300;

	// Get inner radius from OpticDisk doodle
	var opticDisc = this.drawing.firstDoodleOfClass('OpticDisc');
	if (opticDisc) {
		var ri = opticDisc.minimumRadius();
	} else {
		var ri = 150;
	}
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of DiscPallor
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.strokeStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiscPallor.prototype.groupDescription = function() {
	if (this.grade == 'Diffuse') {
		return "Diffuse disc pallor";
	} else {
		return "Disc pallor at ";
	}
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiscPallor.prototype.description = function() {
	if (this.grade == 'Diffuse') {
		return "";
	} else {
		return this.clockHour() + " o'clock";
	}
}
