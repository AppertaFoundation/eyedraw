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
 * AngleGradeSouth
 *
 * @class AngleGradeSouth
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AngleGradeSouth = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AngleGradeSouth";

	// Private parameters
    this.rsl = 480;
    this.rsli = 470;
    this.rtmo = 404;
    this.rtmi = 304;
    this.rcbo = 306;
    this.riro = 270;
    this.riri = 230;
    this.rpu = 100;

	// Derived parameters
	this.grade = "4";
	this.seen = "Yes";

	// Saved parameters
	this.savedParameterArray = ['apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// Invariant simple parameters
	this.arc = 90 * Math.PI / 180;
	this.rotation = Math.PI;
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeSouth.prototype = new ED.Doodle;
ED.AngleGradeSouth.prototype.constructor = ED.AngleGradeSouth;
ED.AngleGradeSouth.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeSouth.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeSouth.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-this.rsli, -this.riri);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['4', '3', '2', '1', '0'],
		animate: true
	};
	this.parameterValidationArray['seen'] = {
		kind: 'derived',
		type: 'string',
		list: ['Yes', 'No'],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.AngleGradeSouth.prototype.setParameterDefaults = function() {
	this.apexY = -this.riri;
	this.setParameterFromString('grade', '4');
	this.setParameterFromString('seen', 'Yes');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeSouth.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			// Return value uses Schaffer classificaton (although visibility is based on Scheie)
			var returnValue = "4";
			if (-_value >= this.riro) returnValue = "3";
			if (-_value >= this.rcbo) returnValue = "2";
			if (-_value >= this.rtmo) returnValue = "1";
			if (-_value >= this.rsli) returnValue = "0";
			returnArray['grade'] = returnValue;
			returnArray['seen'] = (-_value >= this.rsli) ? 'No' : 'Yes';
			break;

		case 'grade':
			var returnValue = "";
			switch (_value) {
				case '0':
					if (-this.apexY >= this.rsli) {
                        returnValue = this.apexY;
					} else {
                        returnValue = -this.rsli;
					}
					break;
				case '1':
					if (-this.apexY >= this.rtmo && -this.apexY < this.rsli) {
                        returnValue = this.apexY;
					} else {
                        returnValue = -this.rtmo;
					}
					break;
				case '2':
					if (-this.apexY >= this.rcbo && -this.apexY < this.rtmo) {
                        returnValue = this.apexY;
					} else {
                        returnValue = -306; //-this.rcbo;
					}
					break;
				case '3':
					if (-this.apexY >= this.riro && -this.apexY < this.rcbo){
                        returnValue = this.apexY;
					}
					else {
                        returnValue = -270; //-this.riro;
					}
					break;
				case '4':
					if (-this.apexY >= this.riri && -this.apexY < this.riro) {
                        returnValue = this.apexY;
					} else {
                        returnValue = -this.riri;
					}
					break;
			}
			returnArray['apexY'] = returnValue;
			break;

		case 'seen':
			var returnValue = "";
			switch (_value) {
				case 'No':
					if (-this.apexY >= this.rsli) returnValue = this.apexY;
					else returnValue = -this.rsli;
					break;
				case 'Yes':
					if (-this.apexY < this.rsli) returnValue = this.apexY;
					else returnValue = -this.riri;
					break;
			}
			returnArray['apexY'] = returnValue;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeSouth.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AngleGradeSouth.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Boundary path
	ctx.beginPath();

	// Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, this.rpu, arcEnd, arcStart, false);
	ctx.closePath();

	// Set fill attributes (same colour as Iris)
	ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
	ctx.lineWidth = 4;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
