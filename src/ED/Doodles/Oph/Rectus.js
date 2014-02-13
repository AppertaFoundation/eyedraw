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
 * A rectus muscle
 *
 * @class Rectus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 * @constructor
 */
ED.Rectus = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Rectus";

	// Private parameters
	this.insertionY = -200;
	this.hangback = false;
	this.canTranspose = true;

	// Derived parameters
	this.recession = 0;
	this.transposition = 'None';

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Rectus.prototype = new ED.Doodle;
ED.Rectus.prototype.constructor = ED.Rectus;
ED.Rectus.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rectus.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Rectus.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['recession'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-12.5, 6.5),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['transposition'] = {
		kind: 'derived',
		type: 'string',
		list: ['Up', 'None', 'Down'],
		animate: false
	};
	this.parameterValidationArray['canTranspose'] = {
		kind: 'derived',
		type: 'bool',
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Rectus.prototype.setParameterDefaults = function() {
	this.setParameterFromString('recession', '0');
	this.setParameterFromString('transposition', 'None');
	this.apexY = this.insertionY;
	this.canTranspose = true;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Rectus.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			returnArray['recession'] = Math.round(2 * (_value - this.insertionY) / 16) / 2;
			break;

		case 'recession':
			returnArray['apexY'] = _value * 16 + this.insertionY;
			break;

		case 'apexX':
			if (this.rotation > 0 && this.rotation < Math.PI) {
				if (_value < 0) returnArray['transposition'] = "Up";
				else if (_value > 0) returnArray['transposition'] = "Down";
				else returnArray['transposition'] = "None";
			} else {
				if (_value < 0) returnArray['transposition'] = "Down";
				else if (_value > 0) returnArray['transposition'] = "Up";
				else returnArray['transposition'] = "None";
			}
			break;

		case 'transposition':
			switch (_value) {
				case "Up":
					if (this.rotation > 0 && this.rotation < Math.PI) {
						returnArray['apexX'] = -50;
					} else {
						returnArray['apexX'] = +50;
					}
					break;
				case "Down":
					if (this.rotation > 0 && this.rotation < Math.PI) {
						returnArray['apexX'] = +50;
					} else {
						returnArray['apexX'] = -50;
					}
					break;
				case "None":
					returnArray['apexX'] = +0;
					break;
			}
			break;
	}

	// Constrain to a cross shaped path
	var cw = 15;
	if (this.apexY > this.insertionY - cw && this.apexY < this.insertionY + cw && this.canTranspose) {
		this.parameterValidationArray['apexX']['range'].setMinAndMax(-100, +100);
	} else {
		this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	}
	if (this.apexX > -cw && this.apexX < cw) {
		this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
	} else {
		this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -200);
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Rectus.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Rectus.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	var muscleHalfWidth = 60;
	var startY = -450;

	// Rectus
	ctx.moveTo(-muscleHalfWidth, startY);
	ctx.lineTo(muscleHalfWidth, startY);
	ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
	ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(255, 140 , 80, 1)";
	ctx.strokeStyle = "rgba(255, 184, 93, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Indicate a recection by continuing muscle beyond insertion with different fill
		if (this.insertionY < this.apexY) {
			// x coordinate of left side of muscle at insertion
			var xi = -muscleHalfWidth + this.apexX * (this.insertionY - startY) / (this.apexY - startY);

			// Part of muscle anterior to insertion
			ctx.beginPath();
			ctx.moveTo(xi, this.insertionY);
			ctx.lineTo(xi + 2 * muscleHalfWidth, this.insertionY);
			ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
			ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);
			ctx.closePath();

			ctx.fillStyle = "rgba(255, 220, 140, 1)";
			ctx.fill();
		}

		// Suture
		if (!(this.apexX == 0 && this.apexY == this.insertionY)) //&& this.recession() == "0.0"))
		{
			var margin = 15;
			var sutureLength = 15;
			var indent = 10;
			var bite = 20;

			// Y coordinate of muscle bite
			var ym;
			if (this.insertionY > this.apexY) {
				ym = this.apexY;
			} else {
				ym = this.insertionY;
			}

			// Y coordinate of knot
			var yk;
			if (!this.hangback && this.insertionY > this.apexY) {
				yk = this.apexY + margin;
			} else {
				yk = this.insertionY + margin;
			}

			// X coordinate
			var x = this.apexX;

			ctx.beginPath();
			ctx.moveTo(x, yk);
			ctx.lineTo(x - sutureLength, yk + sutureLength);
			ctx.moveTo(x + sutureLength, yk + sutureLength);
			ctx.lineTo(x, yk);
			ctx.arc(x, yk, 4, 0, Math.PI * 2, true);
			ctx.moveTo(x, yk);
			ctx.lineTo(x - muscleHalfWidth + indent, yk);
			ctx.lineTo(x - muscleHalfWidth + indent, ym);
			ctx.moveTo(x - muscleHalfWidth + indent, ym - margin);
			ctx.lineTo(x - muscleHalfWidth + indent + bite, ym - margin);
			ctx.moveTo(x + muscleHalfWidth - indent - bite, ym - margin);
			ctx.lineTo(x + muscleHalfWidth - indent, ym - margin);
			ctx.moveTo(x + muscleHalfWidth - indent, ym);
			ctx.lineTo(x + muscleHalfWidth - indent, yk);
			ctx.lineTo(x, yk);

			ctx.lineWidth = 4;
			ctx.strokeStyle = "black";
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
