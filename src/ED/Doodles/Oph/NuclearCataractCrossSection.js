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
 * Nuclear Cataract Cross Section ***TODO***
 *
 * @class NuclearCataractCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.NuclearCataractCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "NuclearCataractCrossSection";

	// Derived parameters
	this.grade = 'Mild';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataractCrossSection.prototype = new ED.Doodle;
ED.NuclearCataractCrossSection.prototype.constructor = ED.NuclearCataractCrossSection;
ED.NuclearCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataractCrossSection.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataractCrossSection.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.parentClass = "LensCrossSection";
	this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];

	// Update validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+100, +100);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['Mild', 'Moderate', 'Brunescent'],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.NuclearCataractCrossSection.prototype.setParameterDefaults = function() {
	this.apexX = 100;
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
ED.NuclearCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -80) returnArray['grade'] = 'Mild';
			else if (_value < -40) returnArray['grade'] = 'Moderate';
			else returnArray['grade'] = 'Brunescent';
			break;

		case 'grade':
			switch (_value) {
				case 'Mild':
					returnArray['apexY'] = -120;
					break;
				case 'Moderate':
					returnArray['apexY'] = -80;
					break;
				case 'Brunescent':
					returnArray['apexY'] = +0;
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
ED.NuclearCataractCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.NuclearCataractCrossSection.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;

	// Arbitrary radius of curvature corresponding to nucleus in Lens subclass
	var r = 300;

	// Displacement of lens from centre
	var ld = 100;

	// Angle of arc
	var theta = Math.asin(h / r);

	// X coordinate of centre of circle
	var x = r * Math.cos(theta);

	// Measurements of nucleus
	var rn = r - 60;

	// Calculate nucleus angles
	var phi = Math.acos(x / rn);

	// Lens
	ctx.beginPath();

	// Draw lens with two sections of circumference of circle
	ctx.arc(ld - x, 0, rn, phi, -phi, true);
	ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);

	// Draw it
	ctx.stroke();

	// Set line attributes
	ctx.lineWidth = 0;

	// Colors for gradient
	yellowColour = "rgba(255, 255, 0, 0.75)";
	var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";

	// Radial gradient
	var gradient = ctx.createRadialGradient(ld, 0, 210, ld, 0, 50);
	gradient.addColorStop(0, yellowColour);
	gradient.addColorStop(1, brownColour);

	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
