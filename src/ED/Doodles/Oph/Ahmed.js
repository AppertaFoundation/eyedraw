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
 * Ahmed tube
 *
 * @class Ahmed
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Ahmed = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "Ahmed";

	// Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
	this.platePosition = 'STQ';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Ahmed.prototype = new ED.Doodle;
ED.Ahmed.prototype.constructor = ED.Ahmed;
ED.Ahmed.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Ahmed.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Ahmed.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = true;
	this.snapToAngles = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-600, -100);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['platePosition'] = {
		kind: 'derived',
		type: 'string',
		list: ['STQ', 'SNQ', 'INQ', 'ITQ'],
		animate: true
	};

	// Array of angles to snap to
	var phi = Math.PI / 4;
	this.anglesArray = [phi, 3 * phi, 5 * phi, 7 * phi];
}

/**
 * Sets default parameters
 */
ED.Ahmed.prototype.setParameterDefaults = function() {
	this.apexY = -300;
	this.setParameterFromString('platePosition', 'STQ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Ahmed.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	var isRE = (this.drawing.eye == ED.eye.Right);
	var phi = Math.PI / 4;

	switch (_parameter) {
		case 'rotation':
			if (this.rotation > 0 && this.rotation <= 2 * phi) {
				returnArray['platePosition'] = isRE ? 'SNQ' : 'STQ';
			} else if (this.rotation > 2 * phi && this.rotation <= 4 * phi) {
				returnArray['platePosition'] = isRE ? 'INQ' : 'ITQ';
			} else if (this.rotation > 4 * phi && this.rotation <= 6 * phi) {
				returnArray['platePosition'] = isRE ? 'ITQ' : 'INQ';
			} else {
				returnArray['platePosition'] = isRE ? 'STQ' : 'SNQ';
			}
			break;

		case 'platePosition':
			switch (_value) {
				case 'STQ':
					if (isRE) {
						returnArray['rotation'] = 7 * phi;
					} else {
						returnArray['rotation'] = phi;
					}
					break;
				case 'SNQ':
					if (isRE) {
						returnArray['rotation'] = phi;
					} else {
						returnArray['rotation'] = 7 * phi;
					}
					break;
				case 'INQ':
					if (isRE) {
						returnArray['rotation'] = 3 * phi;
					} else {
						returnArray['rotation'] = 5 * phi;
					}
					break;
				case 'ITQ':
					if (isRE) {
						returnArray['rotation'] = 5 * phi;
					} else {
						returnArray['rotation'] = 3 * phi;
					}
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
ED.Ahmed.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Ahmed.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Scaling factor
	var s = 0.41666667;

	// Vertical shift
	var d = -740;

	// Plate
	ctx.moveTo(-300 * s, 0 * s + d);
	ctx.bezierCurveTo(-300 * s, -100 * s + d, -200 * s, -400 * s + d, 0 * s, -400 * s + d);
	ctx.bezierCurveTo(200 * s, -400 * s + d, 300 * s, -100 * s + d, 300 * s, 0 * s + d);
	ctx.bezierCurveTo(300 * s, 140 * s + d, 200 * s, 250 * s + d, 0 * s, 250 * s + d);
	ctx.bezierCurveTo(-200 * s, 250 * s + d, -300 * s, 140 * s + d, -300 * s, 0 * s + d);

	// Connection flange
	ctx.moveTo(-160 * s, 230 * s + d);
	ctx.lineTo(-120 * s, 290 * s + d);
	ctx.lineTo(120 * s, 290 * s + d);
	ctx.lineTo(160 * s, 230 * s + d);
	ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);

	// Set Attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(120,120,120,0.75)";
	ctx.fillStyle = "rgba(220,220,220,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Spots
		this.drawSpot(ctx, 0 * s, -230 * s + d, 20 * s, "white");
		this.drawSpot(ctx, -180 * s, -180 * s + d, 20 * s, "white");
		this.drawSpot(ctx, 180 * s, -180 * s + d, 20 * s, "white");

		// Trapezoid mechanism
		ctx.beginPath()
		ctx.moveTo(-100 * s, 230 * s + d);
		ctx.lineTo(100 * s, 230 * s + d);
		ctx.lineTo(200 * s, 0 * s + d);
		ctx.lineTo(40 * s, 0 * s + d);
		ctx.arcTo(0, -540 * s + d, -40 * s, 0 * s + d, 15);
		ctx.lineTo(-40 * s, 0 * s + d);
		ctx.lineTo(-200 * s, 0 * s + d);
		ctx.closePath();

		ctx.fillStyle = "rgba(250,250,250,0.7)";
		ctx.fill();

		// Lines
		ctx.moveTo(-80 * s, -40 * s + d);
		ctx.lineTo(-160 * s, -280 * s + d);
		ctx.moveTo(80 * s, -40 * s + d);
		ctx.lineTo(160 * s, -280 * s + d);
		ctx.lineWidth = 8;
		ctx.strokeStyle = "rgba(250,250,250,0.7)";
		ctx.stroke();

		// Ridge on flange
		ctx.beginPath()
		ctx.moveTo(-30 * s, 250 * s + d);
		ctx.lineTo(-30 * s, 290 * s + d);
		ctx.moveTo(30 * s, 250 * s + d);
		ctx.lineTo(30 * s, 290 * s + d);

		// Tube
		ctx.moveTo(-20 * s, 290 * s + d);
		ctx.lineTo(-20 * s, this.apexY);
		ctx.lineTo(20 * s, this.apexY);
		ctx.lineTo(20 * s, 290 * s + d);

		ctx.strokeStyle = "rgba(150,150,150,0.5)";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
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
ED.Ahmed.prototype.description = function() {
	var descArray = {
		STQ: 'superotemporal',
		SNQ: 'superonasal',
		INQ: 'inferonasal',
		ITQ: 'inferotemporal'
	};

	return "Ahmed tube in the " + descArray[this.platePosition] + " quadrant";
}
