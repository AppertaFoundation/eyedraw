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
 * Cortical Cataract Cross Section ***TODO***
 *
 * @class CorticalCataractCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CorticalCataractCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CorticalCataractCrossSection";

	// Derived parameters
	this.grade = 'Mild';

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CorticalCataractCrossSection.prototype = new ED.Doodle;
ED.CorticalCataractCrossSection.prototype.constructor = ED.CorticalCataractCrossSection;
ED.CorticalCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataractCrossSection.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataractCrossSection.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.parentClass = "LensCrossSection";
	this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];

	// Update validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['Mild', 'Moderate', 'White'],
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataractCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 44;
	this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorticalCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -120) returnArray['grade'] = 'Mild';
			else if (_value < -60) returnArray['grade'] = 'Moderate';
			else returnArray['grade'] = 'White';
			break;

		case 'grade':
			switch (_value) {
				case 'Mild':
					returnArray['apexY'] = -180;
					break;
				case 'Moderate':
					returnArray['apexY'] = -100;
					break;
				case 'White':
					returnArray['apexY'] = -20;
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
ED.CorticalCataractCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CorticalCataractCrossSection.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;

	// Radius of curvature of lens
	var r = 300;

	// Displacement lens from centre
	var ld = 100;

	// Thickness of lens
	//var lt = 100;

	// Angle of arc
	var theta = Math.asin(h / r);

	// X coordinate of centre of circle
	var x = r * Math.cos(theta);

	// Radius of cortical cataract (half way between capsule and nucleus)
	var rco = r - 30;

	// Calculate nucleus angles
	theta = Math.acos(x / rco);

	// Calculate cataract angles
	var phi = Math.asin(-this.apexY / rco);

	// Boundary path
	ctx.beginPath();

	// Draw cataract with two sections of circumference of circle
	ctx.arc(ld - x, 0, rco, phi, theta, false);
	ctx.arc(ld + x, 0, rco, Math.PI - theta, Math.PI - phi, false);

	// Move to upper half and draw it
	var l = rco * Math.cos(phi);
	ctx.moveTo(ld - x + l, this.apexY);
	ctx.arc(ld - x, 0, rco, -phi, -theta, true);
	ctx.arc(ld + x, 0, rco, Math.PI + theta, Math.PI + phi, true);

	// Set line attributes
	ctx.lineWidth = 30;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(200,200,200,0.75)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
