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
 * Perforation
 *
 * @class Perforation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Perforation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Perforation";

	// Constants
	this.margin = 30000;

	// Derived parameters
	this.isMarginal = false;

	// Other parameters
	this.safe = true;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'safe'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'safe':'Safe'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Perforation.prototype = new ED.Doodle;
ED.Perforation.prototype.constructor = ED.Perforation;
ED.Perforation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Perforation.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.Perforation.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-300, +300);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-300, +300);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['isMarginal'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['safe'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.Perforation.prototype.setParameterDefaults = function() {
	this.scaleX = 0.5;
	this.scaleY = 0.75;
	this.setOriginWithDisplacements(-100, 25);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Perforation.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'originX':
			if (this.originX * this.originX + this.originY * this.originY > this.margin) {
				returnArray['isMarginal'] = true;
			}
			else {
				returnArray['isMarginal'] = false;
			}
			break;

		case 'originY':
			if (this.originX * this.originX + this.originY * this.originY > this.margin) {
				returnArray['isMarginal'] = true;
			}
			else {
				returnArray['isMarginal'] = false;
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
ED.Perforation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Perforation.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Perforation
	var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);

	// Close path
	ctx.closePath();

	// Properties
	ctx.lineWidth = 3;
	ctx.fillStyle = "rgba(255, 155, 110, 1)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
	ED.Perforation.prototype.description = function() {
// 	var returnValue = this.isMarginal?"Marginal":"Central";
// 	returnValue += " perforation of eardrum";

	var returnValue = "";

	if (this.originX <= 0) returnValue = "Antero";
	else returnValue = "Postero";

	if (this.originY <= 0) returnValue += "superior";
	else returnValue += "inferior";

	returnValue += " perforation of eardrum";


	return returnValue;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Perforation.prototype.snomedCode = function() {
	return this.isMarginal?39895008:40723007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Perforation.prototype.diagnosticHierarchy = function() {
	return 0;
}
