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
 * PosteriorSynechia
 *
 * @class PosteriorSynechia
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PosteriorSynechia = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PosteriorSynechia";

	// Derived parameters
	this.size = 150;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorSynechia.prototype = new ED.Doodle;
ED.PosteriorSynechia.prototype.constructor = ED.PosteriorSynechia;
ED.PosteriorSynechia.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PosteriorSynechia.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.PosteriorSynechia.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -0);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2 / 3);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['size'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Drawing.Range(20, 100),
		precision: 1,
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PosteriorSynechia.prototype.setParameterDefaults = function() {
	this.arc = Math.PI / 6;
	this.setRotationWithDisplacements(90, 45);

	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) {
		this.apexY = doodle.apexY + this.size;
	} else {
		this.apexY = -200;
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
ED.PosteriorSynechia.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'size':
			var doodle = this.drawing.lastDoodleOfClass("AntSeg");
			if (doodle) {
				returnArray['apexY'] = doodle.apexY - _value;
			}
			break;

		case 'apexY':
			var doodle = this.drawing.lastDoodleOfClass("AntSeg");
			if (doodle) {
				returnArray['size'] = doodle.apexY - _value;
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
ED.PosteriorSynechia.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PosteriorSynechia.superclass.draw.call(this, _point);

	// Set outer radius according to pupil
	var ro = 200;
	var iris = this.drawing.lastDoodleOfClass("AntSeg");
	if (iris) ro = -iris.apexY;

	// Outer radius is position of apex handle
	var ri = -this.apexY;

	// Radius of control points
	var rc = ri + (ro - ri) / 2;

	// Boundary path
	ctx.beginPath();

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Drawing.Point(-ro * Math.sin(theta), -ro * Math.cos(theta));
	var endHandle = new ED.Drawing.Point(ro * Math.sin(theta), -ro * Math.cos(theta));

	// Boundary path
	ctx.beginPath();

	// Arc at margin of pupil
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);

	//var cp = bp.pointAtRadiusAndClockwiseAngle(pr/2, Math.PI/16);
	var apex = new ED.Drawing.Point(this.apexX, this.apexY);

	// Curve from endpoint to apex
	var cp1 = endHandle.pointAtAngleToLineToPointAtProportion(Math.PI / 12, apex, 0.33);
	var cp2 = apex.pointAtAngleToLineToPointAtProportion(-Math.PI / 12, endHandle, 0.33);
	ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);

	// Curve from apex to startpoint
	var cp3 = apex.pointAtAngleToLineToPointAtProportion(Math.PI / 12, startHandle, 0.33);
	var cp4 = startHandle.pointAtAngleToLineToPointAtProportion(-Math.PI / 12, apex, 0.33);
	ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);

	// Close path
	ctx.closePath();

	// Iris colour
	switch (iris.colour) {
		case 'Blue':
			ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
			break;
		case 'Brown':
			ctx.fillStyle = "rgba(172, 100, 55, 0.5)";
			break;
		case 'Gray':
			ctx.fillStyle = "rgba(125, 132, 116, 0.5)";
			break;
		case 'Green':
			ctx.fillStyle = "rgba(114, 172, 62, 0.5)";
			break;
	}

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is transparent
	ctx.strokeStyle = "rgba(250, 250, 250, 0.0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Visual 'hack' to overwrite line with white and then same colour as pupil fill
		ctx.beginPath();
		ctx.arc(0, 0, ro, arcEnd, arcStart, false);
		ctx.lineWidth = 6;
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.strokeStyle = ctx.fillStyle;
		ctx.stroke();

		// Re-do the boundary to match pupil edge and overlap gaps at join
		ctx.beginPath();
		ctx.moveTo(endHandle.x, endHandle.y);
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);
		ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

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
ED.PosteriorSynechia.prototype.groupDescription = function() {
	return "Posterior synechiae at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PosteriorSynechia.prototype.description = function() {
	return this.clockHour() + " o'clock";
}
