/**
 * OpenEyes
 *
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
 * Vitelliform Macular Lesion
 *
 * @class VitelliformMacularLesion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.VitelliformMacularLesion = function(_drawing, _parameterJSON) {
	
	// Set classname
	this.className = "VitelliformMacularLesion";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.VitelliformMacularLesion.prototype = new ED.Doodle;
ED.VitelliformMacularLesion.prototype.constructor = ED.VitelliformMacularLesion;
ED.VitelliformMacularLesion.superclass = ED.Doodle.prototype;

/**=
 * Sets handle attributes
 */
ED.VitelliformMacularLesion.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.VitelliformMacularLesion.prototype.setPropertyDefaults = function() {
	
	this.isRotatable = false;
	this.isUnique = true;
	
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+10, +400);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['originX']['range'].setMinAndMax(-250, +250);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-250, +250);

}

/**
 * Sets default parameters
 */
ED.VitelliformMacularLesion.prototype.setParameterDefaults = function() {
	this.apexX = 100;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.VitelliformMacularLesion.prototype.dependentParameterValues = function(_parameter, _value) {}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VitelliformMacularLesion.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.VitelliformMacularLesion.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Basic shape for serous PED
	var r = this.apexX;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Set attributes
	var grd = ctx.createRadialGradient(0, 0, r*0.5, 0, 0, r);
	grd.addColorStop(0, "rgba(255,190,0,1)");
	grd.addColorStop(1, "rgba(205,135,140,1)");

	ctx.lineWidth = 4;
	
	ctx.fillStyle = grd;
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.VitelliformMacularLesion.prototype.description = function() {
	return "Vitelliform macular lesions";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.VitelliformMacularLesion.prototype.snomedCode = function() {
	return 247155003;
}