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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Peripheral retinectomy
 *
 * @class TrabyConjIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TrabyConjIncision = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TrabyConjIncision";

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TrabyConjIncision.prototype = new ED.Doodle;
ED.TrabyConjIncision.prototype.constructor = ED.TrabyConjIncision;
ED.TrabyConjIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TrabyConjIncision.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.TrabyConjIncision.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isArcSymmetrical = true

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 8, Math.PI);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TrabyConjIncision.prototype.setParameterDefaults = function() {
	this.arc = 80 * Math.PI / 180;

	// If more than one, rotate it a bit to distinguish it
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + Math.PI / 4;
	} else {
		this.rotation = 0;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrabyConjIncision.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrabyConjIncision.superclass.draw.call(this, _point);

	// Radius of outer end of radial incision
	var ro = 660;
	var ri = 400;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;
	
	// Coordinates of 'corners'
	var topRightX = ro * Math.sin(theta);
	var topRightY = -ro * Math.cos(theta);
	var topLeftX = -ro * Math.sin(theta);
	var topLeftY = topRightY;
	var bottomRightX = ri * Math.sin(theta);
	var bottomRightY = -ri * Math.cos(theta);
	var bottomLeftX = -ri * Math.sin(theta);
	var bottomLeftY = bottomRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,0,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Path for incision
		ctx.beginPath();

		// Path
		ctx.moveTo(topRightX, topRightY);
		ctx.lineTo(bottomRightX, bottomRightY);
		ctx.arc(0, 0, ri, arcStart, arcEnd, true);
		ctx.lineTo(topLeftX, topLeftY);

		// Draw retinectomy
		ctx.lineWidth = 4;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)limbus
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.TrabyConjIncision.prototype.description = function() {
	return "";
}
