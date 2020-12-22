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
 * CircumcornealInjection
 *
 * @class CircumcornealInjection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CircumcornealInjection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CircumcornealInjection";

	// Other parameters
	this.severity = '++';

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
ED.CircumcornealInjection.prototype = new ED.Doodle;
ED.CircumcornealInjection.prototype.constructor = ED.CircumcornealInjection;
ED.CircumcornealInjection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CircumcornealInjection.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.CircumcornealInjection.prototype.setPropertyDefaults = function() {
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
		list: ['+', '++', '+++'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.CircumcornealInjection.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 20 * Math.PI / 180;

	// Make a subsequent one 90 degress to last one of same class
	this.setRotationWithDisplacements(90, -90);

	// Match subsequent properties
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.arc = doodle.arc;
		this.severity = doodle.severity;
	}
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CircumcornealInjection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CircumcornealInjection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radii
	var ro = 465;
	var ri = 390;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	//var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

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

		// Adjust thickness of line for severity
		let opacity = 0.8;
		switch (this.severity) {
			case '+++':
				break;
			case '++':
				opacity = 0.4;
				break;
			case '+':
				opacity = 0.2;
				break;
		}

		ctx.fillStyle = `rgb(253,26,26, ${opacity})`;

		ctx.lineWidth = 4;

		ctx.save();
		ctx.beginPath();

		// Arc across
		ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

		// Arc back to mirror image point on the other side
		ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);
		ctx.filter = 'blur(4px)';

		ctx.fill();

		ctx.closePath();
		ctx.restore();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CircumcornealInjection.prototype.groupDescription = function() {
	var returnString = ` Circumcorneal injection severity: ${this.severity}`;

	// Unless nearly complete, include quadrant
	if (this.arc < 1.8 * Math.PI) {
		returnString += " centred ";

		// Use trigonometry on rotation field to determine quadrant
		returnString += (Math.cos(this.rotation) > 0 ? "supero" : "infero");
		returnString += (Math.sin(this.rotation) > 0 ? (this.drawing.eye == ED.eye.Right ? "nasally" : "temporally") : (this.drawing.eye == ED.eye.Right ? "temporally" : "nasally"));
	}
	return returnString;
};


