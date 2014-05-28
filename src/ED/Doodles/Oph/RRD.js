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
 * Retinal detachment
 *
 * @class RRD
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RRD = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RRD";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RRD.prototype = new ED.Doodle;
ED.RRD.prototype.constructor = ED.RRD;
ED.RRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RRD.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.RRD.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
// 	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +4);
// 	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +4);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, +400);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RRD.prototype.setParameterDefaults = function() {
	this.arc = 120 * Math.PI / 180;
	this.apexY = -100;
	this.setRotationWithDisplacements(45, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RRD.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);

	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952 / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

	// Connect across the bottom via the apex point
	var bp = +0.6;

	// Radius of disc (from Fundus doodle)
	var dr = +25;

	// RD above optic disc
	if (this.apexY < -dr) {
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD involves optic disc
	else if (this.apexY < dr) {
		// Angle from origin to intersection of disc margin with a horizontal line through apexY
		var phi = Math.acos((0 - this.apexY) / dr);

		// Curve to disc, curve around it, then curve out again
		var xd = dr * Math.sin(phi);
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, -xd, this.apexY);
		ctx.arc(0, 0, dr, -Math.PI / 2 - phi, -Math.PI / 2 + phi, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD beyond optic disc
	else {
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, 0, 25);
		ctx.arc(0, 0, dr, Math.PI / 2, 2.5 * Math.PI, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
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
ED.RRD.prototype.description = function() {
	// Construct description
	var returnString = "";

	// Use trigonometry on rotation field to determine quadrant
	returnString = returnString + (Math.cos(this.rotation) > 0 ? "Supero" : "Infero");
	returnString = returnString + (Math.sin(this.rotation) > 0 ? (this.drawing.eye == ED.eye.Right ? "nasal" : "temporal") : (this.drawing.eye == ED.eye.Right ? "temporal" : "nasal"));
	returnString = returnString + " retinal detachment";
	returnString = returnString + (this.isMacOff() ? " (macula off)" : " (macula on)");

	// Return description
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RRD.prototype.snomedCode = function() {
	return (this.isMacOff() ? 232009009 : 232008001);
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RRD.prototype.diagnosticHierarchy = function() {
	return (this.isMacOff() ? 10 : 9);
}

/**
 * Determines whether the macula is off or not
 *
 * @returns {Bool} True if macula is off
 */
ED.RRD.prototype.isMacOff = function() {
	// Get coordinates of macula in doodle plane
	if (this.drawing.eye == ED.eye.Right) {
		var macula = new ED.Point(-100, 0);
	} else {
		var macula = new ED.Point(100, 0);
	}

	// Convert to canvas plane
	var maculaCanvas = this.drawing.transform.transformPoint(macula);

	// Determine whether macula is off or not
	if (this.draw(maculaCanvas)) return true;
	else return false;
}
