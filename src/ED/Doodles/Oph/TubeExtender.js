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
 * TubeExtender TubeExtender
 *
 * @class TubeExtender
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TubeExtender = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TubeExtender";

	// Derived parameters
	this.platePosition = 'STQ';

	// Other Parameters
	this.bezierArray = new Array();

	// Saved parameters
	this.savedParameterArray = ['rotation', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TubeExtender.prototype = new ED.Doodle;
ED.TubeExtender.prototype.constructor = ED.TubeExtender;
ED.TubeExtender.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TubeExtender.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.TubeExtender.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = true;
	this.snapToAngles = true;
	this.isUnique = true;

	// Update component of validation array for simple parameters
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
ED.TubeExtender.prototype.setParameterDefaults = function() {
	this.apexY = -300;
	this.setParameterFromString('platePosition', 'STQ');

	// Make rotation same as tube
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		this.rotation = doodle.rotation;
	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TubeExtender.prototype.dependentParameterValues = function(_parameter, _value) {
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
ED.TubeExtender.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// If a tube doodle exists, then sync with its' rotation
	var tubeDoodle = this.drawing.lastDoodleOfClass("Tube");
	if (tubeDoodle) {
		this.rotation = tubeDoodle.rotation;
	}

	// Call draw method in superclass
	ED.TubeExtender.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Scaling factor
	var s = 0.41666667;

	// Vertical shift
	var d = -660;

	// Plate
	//ctx.rect(-160 * s, 200 * s + d, 320 * s, 200 * s);
	this.roundRect(ctx, -160 * s, 200 * s + d, 320 * s, 200 * s, 40 * s);

	// Set Attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(120,120,120,0.75)";
	ctx.fillStyle = "rgba(220,220,220,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Central structure
		ctx.beginPath();
		ctx.moveTo(0 * s, 180 * s + d);
  		ctx.lineTo(-30 * s, 180 * s + d);
  		ctx.quadraticCurveTo(-50 * s, 180 * s + d, -50 * s, 200 * s + d);
  		ctx.lineTo(-50 * s, 260 * s + d);
  		ctx.quadraticCurveTo(-100 * s, 300 * s + d, -50 * s, 340 * s + d);
   		ctx.lineTo(-50 * s, 400 * s + d);
   		ctx.quadraticCurveTo(-50 * s, 420 * s + d, -30 * s, 420 * s + d);
   		ctx.lineTo(0 * s, 420 * s + d);

   		ctx.lineTo(30 * s, 420 * s + d);
  		ctx.quadraticCurveTo(50 * s, 420 * s + d, 50 * s, 400 * s + d);
  		ctx.lineTo(50 * s, 340 * s + d);
  		ctx.quadraticCurveTo(100 * s, 300 * s + d, 50 * s, 260 * s + d);
  		ctx.lineTo(50 * s, 200 * s + d);
  		ctx.quadraticCurveTo(50 * s, 180 * s + d, 30 * s, 180 * s + d);
  		ctx.closePath();

		ctx.stroke();


		// Spots
		this.drawCircle(ctx, -120 * s, 300 * s + d, 20 * s, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, 120 * s, 300 * s + d, 20 * s, ctx.fillStyle, 4, ctx.strokeStyle);

		// Bezier points for curve of TubeExtender in array to export to Supramid
		this.bezierArray['sp'] = new ED.Point(0, 380 * s + d);
		this.bezierArray['cp1'] = new ED.Point(0, 420 * s + d);
		this.bezierArray['cp2'] = new ED.Point(this.apexX * 1.5, this.apexY + ((290 * s + d) - this.apexY) * 0.5);
		this.bezierArray['ep'] = new ED.Point(this.apexX, this.apexY);

		ctx.beginPath();
		ctx.moveTo(0, 290 * s + d);
		ctx.lineTo(this.bezierArray['sp'].x, this.bezierArray['sp'].y);
 		ctx.bezierCurveTo(this.bezierArray['cp1'].x, this.bezierArray['cp1'].y, this.bezierArray['cp2'].x, this.bezierArray['cp2'].y, this.bezierArray['ep'].x, this.bezierArray['ep'].y);

		// Simulate tube with gray line and white narrower line
		ctx.strokeStyle = "rgba(150,150,150,0.5)";
		ctx.lineWidth = 20;
		ctx.stroke();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 8;
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
ED.TubeExtender.prototype.description = function() {
	var descArray = {
		STQ: 'superotemporal',
		SNQ: 'superonasal',
		INQ: 'inferonasal',
		ITQ: 'inferotemporal'
	};

	return "Tube extender in the " + descArray[this.platePosition] + " quadrant";
}

/**
 * Draws a rounded rectangle using the current state of the canvas. ***TODO*** move to core
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 */
ED.TubeExtender.prototype.roundRect = function(ctx, x, y, width, height, radius) {
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
