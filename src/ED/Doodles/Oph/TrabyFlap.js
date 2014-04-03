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
 * TrabyFlap
 *
 * @class TrabyFlap
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TrabyFlap = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TrabyFlap";

	// Derived parameters
	this.site = 'Superior';
	this.size = '4x3';
	this.sclerostomy = 'Punch';
	this.height = -580;

	// Doodle specific parameters
	this.r = 380;
	this.right = new ED.Point(0, 0);
	this.left = new ED.Point(0, 0);

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TrabyFlap.prototype = new ED.Doodle;
ED.TrabyFlap.prototype.constructor = ED.TrabyFlap;
ED.TrabyFlap.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TrabyFlap.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.TrabyFlap.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isArcSymmetrical = true;
	this.snapToArc = true;
	this.isDeletable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-440, -440);
	this.parameterValidationArray['rotation']['delta'] = 0.1;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['site'] = {
		kind: 'derived',
		type: 'string',
		list: ['Superior', 'Superonasal', 'Superotemporal'],
		animate: true
	};
	this.parameterValidationArray['size'] = {
		kind: 'derived',
		type: 'string',
		list: ['4x3', '5x2'],
		animate: true
	};
	this.parameterValidationArray['sclerostomy'] = {
		kind: 'derived',
		type: 'string',
		list: ['Punch', 'Block'],
		animate: true
	};

	// Array of arcs to snap to
	this.arcArray = [0.9, 1.13];
}

/**
 * Sets default parameters
 */
ED.TrabyFlap.prototype.setParameterDefaults = function() {
	this.apexY = -440;
	this.height = -580;
	this.setParameterFromString('size', 'Superior');
	this.setParameterFromString('size', '4x3');
	this.setParameterFromString('sclerostomy', 'Punch');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TrabyFlap.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {

		case 'apexX':
			if (_value < 0) returnArray['sclerostomy'] = 'Punch';
			else returnArray['sclerostomy'] = 'Block';
			break;

		case 'arc':
			if (_value < 1.0) {
				returnArray['size'] = '4x3';
				returnArray['height'] = -580;
			} else {
				returnArray['size'] = '5x2';
				returnArray['height'] = -510;
			}
			break;

		case 'rotation':
			if (_value > Math.PI / 16 && _value < Math.PI) returnArray['site'] = this.drawing.eye == ED.eye.Right ? 'Superonasal' : 'Superotemporal';
			else if (_value >= Math.PI && _value < 31 * Math.PI / 16) returnArray['site'] = this.drawing.eye == ED.eye.Right ? 'Superotemporal' : 'Superonasal';
			else returnArray['site'] = 'Superior';
			break;

		case 'site':
			switch (_value) {
				case 'Superior':
					returnArray['rotation'] = 0;
					break;
				case 'Superonasal':
					returnArray['rotation'] = this.drawing.eye == ED.eye.Right ? Math.PI / 4 : (7 * Math.PI / 4);
					break;
				case 'Superotemporal':
					returnArray['rotation'] = this.drawing.eye == ED.eye.Right ? (7 * Math.PI / 4) : Math.PI / 4;
					break;
			}
			break;

		case 'size':
			switch (_value) {
				case '4x3':
					returnArray['arc'] = 0.9;
					returnArray['height'] = -580;
					this.right.setCoordinates(this.r * Math.sin(this.arc / 2), -this.r * Math.cos(this.arc / 2));
					break;
				case '5x2':
					returnArray['arc'] = 1.13;
					returnArray['height'] = -510;
					this.right.setCoordinates(this.r * Math.sin(this.arc / 2), -this.r * Math.cos(this.arc / 2));
					break;
			}
			break;

		case 'sclerostomy':
			switch (_value) {
				case 'Punch':
					returnArray['apexX'] = -50;
					break;
				case 'Block':
					returnArray['apexX'] = +50;
					break;
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
ED.TrabyFlap.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrabyFlap.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Offset angle for control points
	var phi = this.arc / 6;

	// Apex point
	var apex = new ED.Point(0, this.height);

	this.right.x = this.r * Math.sin(theta);
	this.right.y = -this.r * Math.cos(theta);
	this.left.x = -this.r * Math.sin(theta);
	this.left.y = -this.r * Math.cos(theta);

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, this.r, arcStart, arcEnd, true);

	// Rectangular flap
	ctx.lineTo(this.left.x, this.height);
	ctx.lineTo(this.right.x, this.height);
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(220,220,150,0.5)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		if (this.sclerostomy == 'Punch') {
			ctx.arc(0, this.apexY, 50, 0, 2 * Math.PI, true);
		} else {
			// Draw block at half width and height
			var angle = theta / 2;
			arcStart = -Math.PI / 2 + angle;
			arcEnd = -Math.PI / 2 - angle;
			var top = new ED.Point(0, -this.r + (this.height + this.r) / 2);

			ctx.arc(0, 0, this.r, arcStart, arcEnd, true);
			ctx.lineTo(-this.r * Math.sin(angle), top.y);
			ctx.lineTo(this.r * Math.sin(angle), top.y);
			ctx.closePath();
		}

		// Colour of fill
		ctx.fillStyle = "gray";
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.left);
	this.handleArray[3].location = this.transform.transformPoint(this.right);
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
ED.TrabyFlap.prototype.description = function() {
	return "Trabeculectomy flap at " + this.clockHour() + " o'clock with " + this.sclerostomy.firstLetterToLowerCase() + " sclerostomy";
}
