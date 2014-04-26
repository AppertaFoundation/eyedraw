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
 * Radial keratotomy
 *
 * @class RK
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RK = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RK";
	
	// Other parameters
	this.numberOfCuts = '8';

	// Saved parameters
	this.savedParameterArray = ['apexY', 'scaleX', 'scaleY', 'rotation', 'numberOfCuts'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'numberOfCuts':'Number of Cuts'};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RK.prototype = new ED.Doodle;
ED.RK.prototype.constructor = ED.RK;
ED.RK.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RK.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.RK.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isUnique;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.15);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.15);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -60);
	
	this.parameterValidationArray['numberOfCuts'] = {
		kind: 'other',
		type: 'string',
		list: ['4', '8', '16'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.RK.prototype.setParameterDefaults = function() {
	this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RK.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RK.superclass.draw.call(this, _point);

	// RK number and size
	var ro = 320;
	var ri = -this.apexY;
	var n = parseInt(this.numberOfCuts);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Move to inner circle
	ctx.moveTo(ri, 0);

	// Arc back the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Create fill pattern
	ctx.fillStyle = "rgba(155,255,255,0)";

	// Transparent stroke
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var theta = 2 * Math.PI / n; // Angle between radii
		ctx.strokeStyle = "rgba(100,100,100,0.7)";

		// Draw radii spokes
		ctx.beginPath();
		var i;
		for (i = 0; i < n; i++) {
			var angle = i * theta;
			var pi = new ED.Point(0, 0);
			pi.setWithPolars(ri, angle);
			var po = new ED.Point(0, 0);
			po.setWithPolars(ro, angle);
			ctx.moveTo(pi.x, pi.y);
			ctx.lineTo(po.x, po.y);
			ctx.closePath();
		}
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(ro, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
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
ED.RK.prototype.description = function() {
	return "Radial keratotomy";
}
