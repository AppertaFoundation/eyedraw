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
 * AC Inflammation
 *
 * @class KeraticPrecipitates
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.KeraticPrecipitates = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "KeraticPrecipitates";

	this.size = 'Fine';
	this.number = 0;
	this.pigment = false;
	this.cells = 'Not Checked';
	this.flare = 'Not Checked';
	this.sentinel = false;

	// Saved parameters
	this.savedParameterArray = [
		'apexX', 'apexY', 'scaleX', 'scaleY',
		'originX', 'originY', 'size', 'number',
		'pigment', 'cells', 'flare', 'sentinel',
	];

	this.controlParameterArray = {
		'size': 'KP',
		'cells': 'Cells',
		'flare': 'Flare',
		'sentinel': 'Sentinel',
		'pigment': 'Pigment'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.KeraticPrecipitates.prototype = new ED.Doodle;
ED.KeraticPrecipitates.prototype.constructor = ED.KeraticPrecipitates;
ED.KeraticPrecipitates.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.KeraticPrecipitates.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default dragging attributes
 */
ED.KeraticPrecipitates.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = true;
	this.inFrontOfClassArray = ['Hypopyon', 'Hyphaema'];

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(0, 0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, +0);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.7);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.7);

	this.parameterValidationArray['originX']['range'].setMinAndMax(-200, +200);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-200, +200);

	this.parameterValidationArray.size = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Fine', 'Medium', 'Large (mutton fat)', 'Stellate', 'Confluent'],
		animate: true
	};

	this.parameterValidationArray['sentinel'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};

	this.parameterValidationArray.pigment = {
		kind: 'derived',
		type: 'bool',
		display: true
	};

	this.parameterValidationArray.cells = {
		kind: 'other',
		type: 'string',
		list: ['Not Checked', '0 (>1)', '0.5+ (1-5)', '1+ (6-15)', '2+ (16-25)', '3+ (26-50)', '4+ (>50)'],
		animate: false
	};

	this.parameterValidationArray.flare = {
		kind: 'other',
		type: 'string',
		list: ['Not Checked', '0 (None)', '1+ (Faint)', '2+ (Moderate)', '3+ (Marked)', '4+ (Intense)'],
		animate: false
	};
};

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.KeraticPrecipitates.prototype.setParameterDefaults = function() {
	this.scaleX = 1.3;
	this.scaleY = 1.3;

	// Hard drusen is displaced for Fundus, central for others
	if (this.drawing.hasDoodleOfClass('Fundus')) {
		this.originX = this.drawing.eye == ED.eye.Right ? -100 : 100;
	}

	this.number = this.apexX;
	this.setParameterFromString('size', 'Fine');
	this.setParameterFromString('sentinel', 'false');
	this.setParameterFromString('pigment', 'false');
};

ED.KeraticPrecipitates.prototype.dependentParameterValues = function(_parameter, _value) {
	let returnArray = {};
	switch (_parameter) {
		case 'sentinel':
			if (_value === true) {
				this.number = 0;
				returnArray['size'] = 'Fine';
				this.setParameterFromString('size', 'Fine');
			}
			break;

		case 'size':
			switch (_value) {
				case 'Fine':
					this.number = 0;
					break;
				case 'Medium':
					this.number = this.sentinel ? 0 : 30;
					break;
				case 'Large (mutton fat)':
					this.number = this.sentinel ? 0 : 57;
					break;
				case 'Stellate':
				case 'Confluent':
					// will be treated differently
					break;
			}
			break;
	}

	return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.KeraticPrecipitates.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.KeraticPrecipitates.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 200;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Colours
		var fill = "rgba(110, 110, 110, 0.5)";
		if (this.pigment) {
			//fill = "rgb(203,177,110)";
			fill = "rgb(200,150,0, 0.5)";
		}

		var dr = 10 * ((this.number + 20) / 20) / this.scaleX;
		// muffon fat 57, 10 * (57+20)/20

		var p = new ED.Point(0, 0);
		var n = 2 + Math.abs(Math.floor(this.apexY / 2));

		if (this.apexY === 0) {
			n = 2;
		}

		if (this.size !== 'Stellate' && this.size !== 'Confluent' && !this.sentinel && this.size !== 'None') {
			this.handleArray[4].isVisible = true;
			for (var i = 0; i < n; i++) {
				p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
				this.drawSpot(ctx, p.x, p.y, dr, fill);
			}
		} else if (this.size !== 'None') {
			if (this.sentinel) {
				this.handleArray[4].isVisible = false;
				this.drawSpot(ctx, 0, 50, dr, fill);
			} else if (this.size === 'Stellate') {
				for (let i = 0; i < n; i++) {
					p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
					this.drawStellate(ctx, p.x, p.y, 19, fill);
				}
			} else if (this.size === 'Confluent') {

				let points = [
					// middle column
					[0, -150],
					[50, -70],
					[48, 35],
					[48, 150],

					// right column
					[75, -200],
					[130, -130],
					[150, -20],
					[150, 100],

					// second column from left to right
					[-110, -140],
					[-70, -30],
					[-50, 120],

					//left col
					[-165, -70],
					[-155, 30],
					[-155, 150],
				];

				if (this.apexY <= -51) {
					points.push([-60, -80]);
					points.push([-50, 50]);
					points.push([-70, 180]);
					points.push([95, 40]);
					points.push([100, 160]);
				}

				if (this.apexY <= -155) {
					points.push([-60, -180]);

					points.push([170, -100]);
					points.push([165, 50]);
					points.push([-180, 70]);
				}

				if (this.apexY <= -259) {
					points.push([0, 0]);

					points.push([100, -100]);
					points.push([0, 100]);
					points.push([0, -200]);
					points.push([-100, 100]);
					points.push([-200, 0]);

					points.push([165, 50]);
					points.push([-180, 70]);
				}


				for (let i = 0; i < points.length; i++) {
					let p = new ED.Point(points[i][0], points[i][1]);

					this.drawSpot(ctx, p.x, p.y, 55, fill);
				}
			}
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
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
ED.KeraticPrecipitates.prototype.description = function() {
	let returnValue = `${this.size} KPs`;
	if (this.sentinel) {
		returnValue = `Sentinel KPs`;
	}

	if (this.cells && this.cells !== 'Not Checked') {
		returnValue += ", cells: " + this.cells;
	}

	if (this.flare && this.flare !== 'Not Checked') {
		returnValue += ", flare: " + this.flare;
	}

	return returnValue;
};

ED.KeraticPrecipitates.prototype.snomedCode = function()
{
	return 246998009; // Keratic precipitates
};
