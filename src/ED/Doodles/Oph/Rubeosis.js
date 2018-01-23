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
 * Rubeosis
 *
 * @class Rubeosis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Rubeosis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Rubeosis";

	// Derived parameters
	this.severity = 50;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Rubeosis.prototype = new ED.Doodle;
ED.Rubeosis.prototype.constructor = ED.Rubeosis;
ED.Rubeosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rubeosis.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Rubeosis.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -200);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['severity'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(20, 100),
		precision: 1,
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Rubeosis.prototype.setParameterDefaults = function() {
	this.arc = Math.PI / 12;
	this.setRotationWithDisplacements(90, 45);

	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) {
		this.apexY = doodle.apexY - this.severity;
	} else {
		this.apexY = -320;
	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Rubeosis.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'severity':
			var doodle = this.drawing.lastDoodleOfClass("AntSeg");
			if (doodle) {
				returnArray['apexY'] = doodle.apexY - _value;
			}
			break;

		case 'apexY':
			var doodle = this.drawing.lastDoodleOfClass("AntSeg");
			if (doodle) {
				returnArray['severity'] = doodle.apexY - _value;
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
ED.Rubeosis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Rubeosis.superclass.draw.call(this, _point);

	// Set inner radius according to pupil
	var ri = 200;
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) ri = -doodle.apexY;

	// Boundary starts further out to allow selection of pupil handle
	var rib = ri + 16;

	// Set apexY and range
	this.parameterValidationArray['apexY']['range'].max = -ri - 50;
	this.apexY = this.parameterValidationArray['apexY']['range'].constrain(-ri - this.severity);

	// Outer radius is position of apex handle
	var ro = -this.apexY;

	// Radius for control handles
	var r = rib + (ro - rib) / 2;

	// Boundary path
	ctx.beginPath();

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Point(-r * Math.sin(theta), -r * Math.cos(theta));
	var endHandle = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));

	// Boundary path
	ctx.beginPath();

	// Path
	ctx.arc(0, 0, rib, arcStart, arcEnd, true);
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = this.isSelected ? "rgba(240,240,240,0.5)" : "rgba(240,240,240,0.0)";

	// Set line attributes
	ctx.lineWidth = 1;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Angular separation of vessels
		var inc = 2 * Math.PI / 16;
		var disp = Math.PI / 24;
		var phi = 2 * Math.PI / 60;
		var rc = ri + 2 * (ro - ri) / 3;

		// Number of vessels to draw
		var n = 1 + Math.floor(this.arc / inc);

		// Draw each vessel tree
		for (var i = 0; i < n; i++) {
			// Start point
			var sp = startHandle.pointAtRadiusAndClockwiseAngle(ri, disp + i * inc);

			// First branch
			var ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi);
			var cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
			var cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi / 2);
			ctx.moveTo(sp.x, sp.y);
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);

			// Second branch
			ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi);
			cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
			cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi / 2);
			ctx.moveTo(sp.x, sp.y);
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
		}

		// Set line attributes
		ctx.lineWidth = 4;
		ctx.strokeStyle = "red";

		// Draw vessels
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Rubeosis.prototype.groupDescription = function() {
	return "Rubeotic vessels on margin of pupil at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Rubeosis.prototype.description = function() {
	return this.clockHour() + " o'clock";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Number} SnoMed code of entity represented by doodle
 */
ED.Rubeosis.prototype.snomedCode = function()
{
    return 51995000;
}
