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
 * Peripheral retinectomy
 *
 * @class PeripheralRetinectomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PeripheralRetinectomy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PeripheralRetinectomy";

	// Private parameter
	this.extent = "";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralRetinectomy.prototype = new ED.Doodle;
ED.PeripheralRetinectomy.prototype.constructor = ED.PeripheralRetinectomy;
ED.PeripheralRetinectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralRetinectomy.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralRetinectomy.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 4, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-450, -350);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralRetinectomy.prototype.setParameterDefaults = function() {
	this.arc = 240 * Math.PI / 180;
	this.apexY = -380;

	// If more than one, rotate it a bit to distinguish it
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + Math.PI / 4;
	} else {
		this.rotation = Math.PI;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralRetinectomy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PeripheralRetinectomy.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952 / 2;
	var ri = -this.apexY;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of PeripheralRetinectomy
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

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
		// Path for retinectomy
		ctx.beginPath();

		// Unless 360, curve out from the ora
		if (this.arc < 1.95 * Math.PI) {
			// Angle to determine curve
			var phi1 = theta - Math.PI / 24;
			var phi2 = theta - 2 * Math.PI / 24;

			// Right points
			var rsp = new ED.Point(ro * Math.sin(theta), -ro * Math.cos(theta));
			var rcp1 = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));
			var rcp2 = new ED.Point(ri * Math.sin(phi1), -ri * Math.cos(phi1));
			var rep = new ED.Point(ri * Math.sin(phi2), -ri * Math.cos(phi2));

			// Inner arc
			arcStart = -Math.PI / 2 + phi2;
			arcEnd = -Math.PI / 2 - phi2;

			// Left points
			var lsp = new ED.Point(-ri * Math.sin(phi2), -ri * Math.cos(phi2));
			var lcp1 = new ED.Point(-ri * Math.sin(phi1), -ri * Math.cos(phi1));
			var lcp2 = new ED.Point(-r * Math.sin(theta), -r * Math.cos(theta));
			var lep = new ED.Point(-ro * Math.sin(theta), -ro * Math.cos(theta));

			// Path
			ctx.moveTo(rsp.x, rsp.y);
			ctx.bezierCurveTo(rcp1.x, rcp1.y, rcp2.x, rcp2.y, rep.x, rep.y);
			ctx.arc(0, 0, ri, arcStart, arcEnd, true);
			ctx.bezierCurveTo(lcp1.x, lcp1.y, lcp2.x, lcp2.y, lep.x, lep.y)

			// Angle to nearest 10 degrees.
			var degrees = Math.floor(this.arc * 18 / Math.PI) * 10;

			this.extent = "Retinectomy of " + degrees + " degrees centred at " + this.clockHour() + " o'clock";
		} else {
			// Just a circl to represent a 360 degree retinectomy
			ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);

			// Description text
			this.extent = "360 degree retinectomy";
		}

		// Draw retinectomy
		ctx.lineWidth = 16;
		ctx.strokeStyle = "red";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.PeripheralRetinectomy.prototype.description = function() {
	return this.extent;
}
