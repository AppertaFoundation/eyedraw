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
 * Round hole
 *
 * @class RoundHole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RoundHole = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RoundHole";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RoundHole.prototype = new ED.Doodle;
ED.RoundHole.prototype.constructor = ED.RoundHole;
ED.RoundHole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RoundHole.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.RoundHole.prototype.setPropertyDefaults = function() {}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RoundHole.prototype.setParameterDefaults = function() {
	// Displacement from fovea, and from last doodle
	var d = 300;
	this.originX = d;
	this.originY = d;

	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var point = new ED.Point(doodle.originX, doodle.originY);
		var direction = point.direction() + Math.PI / 8;
		var distance = point.length();
		var np = new ED.Point(0, 0);
		np.setWithPolars(distance, direction);

		this.originX = np.x;
		this.originY = np.y;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RoundHole.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RoundHole.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Round hole
	ctx.arc(0, 0, 30, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(21, -21));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Calculate arc (Arc property not used naturally in this doodle ***TODO** more elegant method of doing this possible!)
	var centre = this.transform.transformPoint(new ED.Point(0, 0));
	var oneWidthToRight = this.transform.transformPoint(new ED.Point(60, 0));
	var xco = centre.x - this.drawing.canvas.width / 2;
	var yco = centre.y - this.drawing.canvas.height / 2;
	var radius = this.scaleX * Math.sqrt(xco * xco + yco * yco);
	var width = this.scaleX * (oneWidthToRight.x - centre.x);
	this.arc = Math.atan(width / radius);
	//console.log(this.arc * 180/Math.PI + " + " + this.calculateArc() * 180/Math.PI);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RoundHole.prototype.description = function() {
	var returnString = "";

	// Size description
	if (this.scaleX < 1) returnString = "Small ";
	if (this.scaleX > 1.5) returnString = "Large ";

	// Round hole
	returnString += "Round hole ";

	// Location (clockhours)
	returnString += this.clockHour() + " o'clock";

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RoundHole.prototype.snomedCode = function() {
	return 302888003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RoundHole.prototype.diagnosticHierarchy = function() {
	return 3;
}
