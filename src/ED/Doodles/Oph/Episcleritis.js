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
 * Episcleritis
 *
 * @class Episcleritis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Episcleritis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Episcleritis";

	// Other parameters
	this.severity = 'Medium';

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation', 'severity'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'severity':'Severity'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Episcleritis.prototype = new ED.Doodle;
ED.Episcleritis.prototype.constructor = ED.Episcleritis;
ED.Episcleritis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Episcleritis.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.Episcleritis.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);

	// Add complete validation arrays for other parameters
	this.parameterValidationArray['severity'] = {
		kind: 'other',
		type: 'string',
		list: ['Severe', 'Medium', 'Mild'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Episcleritis.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 20 * Math.PI / 180;

	// Make a subsequent one 90 degress to last one of same class
	this.setRotationWithDisplacements(90, -90);

	// Match subsequent properties
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.arc = doodle.arc
		this.severity = doodle.severity
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Episcleritis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Episcleritis.superclass.draw.call(this, _point);

	// Radii
	var ro = 495;
	var ri = 420;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(218,230,241,0)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line
	ctx.strokeStyle = "rgba(218,230,241,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Total number of vessels in a 360 arc
		var t = 120;

		// Number in the current arc and angular separation
		var phi = 2 * Math.PI / t;
		var n = Math.floor(this.arc / phi);

		// Start and end points of vessel
		var sp = new ED.Point(0, 0);
		var ep = new ED.Point(0, 0);

		ctx.beginPath();

		// Radial lines
		var rc = ro;

		for (var i = 0; i < n; i++) {
			var theta = Math.PI / 2 + arcEnd + i * phi;
			sp.setWithPolars(ro, theta);
			ep.setWithPolars(ri, theta);

			ctx.moveTo(sp.x, sp.y);
			ctx.lineTo(ep.x, ep.y);
		}

		ctx.strokeStyle = "red";

		// Adjust thickness of line for severity
		switch (this.severity) {
			case 'Severe':
				ctx.lineWidth = 16;
				break;
			case 'Medium':
				ctx.lineWidth = 12;
				break;
			case 'Mild':
				ctx.lineWidth = 8;
				break;
		}

		ctx.stroke();

		// Demonstration blurred line
		//this.drawSoftLine(-200, -200, 200, 200, 40, 255, 0, 0, 1);
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.Episcleritis.prototype.groupDescription = function() {
	var returnString = this.severity + " episcleritis";

	// Unless nearly complete, include quadrant
	if (this.arc < 1.8 * Math.PI) {
		returnString += " centred "

		// Use trigonometry on rotation field to determine quadrant
		returnString += (Math.cos(this.rotation) > 0 ? "supero" : "infero");
		returnString += (Math.sin(this.rotation) > 0 ? (this.drawing.eye == ED.eye.Right ? "nasally" : "temporally") : (this.drawing.eye == ED.eye.Right ? "temporally" : "nasally"));
	}
	return returnString
}

ED.Episcleritis.prototype.drawSoftLine = function(x1, y1, x2, y2, lineWidth, r, g, b, a) {
	// Get context
	var ctx = this.drawing.context;

	var lx = x2 - x1;
	var ly = y2 - y1;
	var lineLength = Math.sqrt(lx*lx + ly*ly);
	var wy = lx / lineLength * lineWidth;
	var wx = ly / lineLength * lineWidth;
	// The gradient must be defined across the line, 90° turned compared to the line direction.
	var gradient = ctx.createLinearGradient(x1-wx/2, y1+wy/2, x1+wx/2, y1-wy/2);
	gradient.addColorStop(0,    "rgba("+r+","+g+","+b+",0)");
	gradient.addColorStop(0.43, "rgba("+r+","+g+","+b+","+a+")");
	gradient.addColorStop(0.57, "rgba("+r+","+g+","+b+","+a+")");
	gradient.addColorStop(1,    "rgba("+r+","+g+","+b+",0)");
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = gradient;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.restore();
}
