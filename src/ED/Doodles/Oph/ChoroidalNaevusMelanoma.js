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
 * The optic disc
 *
 * @class ChoroidalNaevusMelanoma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ChoroidalNaevusMelanoma = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ChoroidalNaevusMelanoma";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 120;
	this.type = 'Naevus';
	this.thickness = 'NR';
	this.margin = 'NR';
	this.subretinal_fluid = false;
	this.orange_pigment = false;
	this.pigment_halo = false;
	this.drusen = false;

	// Saved parameters
	this.savedParameterArray = [
		'originX', 'originY', 'apexX', 'apexY', 'rotation',
		'type', 'thickness', 'margin', 'subretinal_fluid', 'orange_pigment', 'pigment_halo', 'drusen'
	];

	this.controlParameterArray = {
		'type':'Type',
		'thickness': 'Thickness (mm)',
		'margin': 'Margin to optic disc (mm)',
		'subretinal_fluid': 'Subretinal fluid',
		'orange_pigment': 'Orange pigment',
		'pigment_halo': 'Pigment halo',
		'drusen': 'Drusen'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.ChoroidalNaevusMelanoma.prototype = new ED.Doodle;
ED.ChoroidalNaevusMelanoma.prototype.constructor = ED.ChoroidalNaevusMelanoma;
ED.ChoroidalNaevusMelanoma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ChoroidalNaevusMelanoma.prototype.setHandles = function() {

	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}

	// Allow top handle to rotate doodle
	this.handleArray[0].isRotatable = true;

	// Handle for apex
	this.handleArray[this.numberOfHandles] = new ED.Doodle.Handle(null, this.drusen, ED.Mode.Apex, false);
};

/**
 * Sets default properties
 */
ED.ChoroidalNaevusMelanoma.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(+50, +290);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-50, +50);

	this.addAtBack = true;

	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: ['Melanoma', 'Naevus', 'Osteoma', 'CHRPE'],
		animate: false
	};

	this.parameterValidationArray['thickness'] = {
		kind: 'derived',
		type: 'freeText',
		validate: function (value) {
			let  valid = false;

			// check if the number is valid
			const regexp_result = value.match(/^(\d*|\d*.\d*)(mm|\smm)?$/);

			if (regexp_result !== null && typeof regexp_result[0] !== 'undefined') {
				valid = true;
			}

			// probably we need to fix the regexp, it still returns matches when the first group has no match
			if (value.trim() === 'mm') {
				return false;
			}

			if (typeof value === 'string' && (value.toLowerCase() === 'not recorded' || value === '' || value.toLowerCase() === 'nr')) {
				valid = true;
			}

			return valid;
		},
		display: true
	};
	this.parameterValidationArray['margin'] = {
		kind: 'derived',
		type: 'freeText',
		validate: function (value) {
			let  valid = false;

			// check if the number is valid
			const regexp_result = value.match(/^(\d*|\d*.\d*)(mm|\smm)?$/);

			if (regexp_result !== null && typeof regexp_result[0] !== 'undefined') {
				valid = true;
			}

			// probably we need to fix the regexp, it still returns matches when the first group has no match
			if (value.trim() === 'mm') {
				return false;
			}

			if (typeof value === 'string' && (value.toLowerCase() === 'not recorded' || value === '' || value.toLowerCase() === 'nr')) {
				valid = true;
			}

			return valid;
		},
		display: true
	};

	this.parameterValidationArray['subretinal_fluid'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['orange_pigment'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['pigment_halo'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['drusen'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
};

/**
 * Sets default parameters
 */
ED.ChoroidalNaevusMelanoma.prototype.setParameterDefaults = function() {
	this.apexY = 50;
	this.setOriginWithDisplacements(200, 150);

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}

	/*const endPoint = new ED.Point(this.originX, this.originY);
	const startPoint = new ED.Point(0, 0);
	this.margin = this.calculateDistance(new ED.Point(this.originX, this.originY));*/
};

ED.ChoroidalNaevusMelanoma.prototype.calculateDistance = function(pointOfDoodle) {

	// Start point and end point
	//var pointOfDoodle = new ED.Point(-300, -250);

	const origin = new ED.Point(0, 0);
	const canvasTop = new ED.Point(0, -480);

	const x = this.drawing.innerAngle(canvasTop, origin, pointOfDoodle);

	var p1c2 = new ED.Point(0, 0);
	p1c2.setWithPolars(480, x);

	return ((pointOfDoodle.distanceTo(p1c2) * 4.8) / 100).toFixed(1);
};

ED.ChoroidalNaevusMelanoma.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {};

	switch (_parameter) {
		// dependent parameters for bound side view doodle

		case 'drusen':
			this.setHandles();
			break;
		case 'originX':
		case 'originY':
			//returnArray.margin = this.calculateDistance(new ED.Point(this.originX, this.originY));
			// const endPoint = new ED.Point(this.originX, this.originY);
			// const startPoint = new ED.Point(0, 0);
			// returnArray.margin =  ((startPoint.distanceTo(endPoint) * 4.8) / 100).toFixed(1);
			break;
	}

	return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChoroidalNaevusMelanoma.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ChoroidalNaevusMelanoma.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	var fp;
	var tp;
	var cp1;
	var cp2;

	// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
	var phi = 2 * Math.PI / (3 * this.numberOfHandles);

	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (let i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		let toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];

		// Control points
		cp1 = fp.tangentialControlPoint(+phi);
		cp2 = tp.tangentialControlPoint(-phi);

		// Draw Bezier curve
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(219,87,13,0.8)"; //Naevus
	if (this.type === 'Melanoma') {
		ctx.fillStyle = "rgba(125, 65, 54, 0.8)";
	}
	if (this.type === 'Osteoma') {
		ctx.fillStyle = "rgba(213,209,182,0.8)";
	}
	if (this.type === 'CHRPE') {
		ctx.fillStyle = "rgba(29,7,6,0.8)";
	}

	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		// Drusen
		if (this.drusen) {
			let p = new ED.Point(0, 0);
			let fill = "yellow";
			let dr = 4;
			let n = Math.abs(Math.floor((-this.apexY + 50) / 5));
			for (let i = 0; i < n; i++) {
				p.setWithPolars(this.initialRadius * 0.8 * ED.randomArray[i + 10], 2 * Math.PI * ED.randomArray[i + 100]);
				this.drawSpot(ctx, p.x, p.y, dr * 2, fill);
			}
		}
	}

	// Coordinates of handles (in canvas plane)
	for (let i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}
	this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) {
		this.drawHandles(_point);
	}

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChoroidalNaevusMelanoma.prototype.description = function() {
	let desc = this.type;
	
	if (this.subretinal_fluid) {
		desc += ', subretinal fluid';
	}
	if (this.orange_pigment) {
		desc += ' with lipofuscin';
	}
	if (this.pigment_halo) {
		desc += ' with pigment halo';
	}
	if (this.dursen) {
		desc += ' with dursen';
	}
	desc += '.';

	const showThicknessInDesc = this.thickness && (typeof this.thickness.toLowerCase === 'function' && this.thickness.toLowerCase() !== 'not recorded' && this.thickness.toLowerCase() !== 'nr');

	if (showThicknessInDesc) {
		desc += ' Thickness ' + this.thickness + ' mm';
	}

	if (this.margin && (typeof this.margin.toLowerCase === 'function' && this.margin.toLowerCase() !== 'not recorded' && this.margin.toLowerCase() !== 'nr' ) ) {
		desc += showThicknessInDesc ? ' and' : '';
		desc += ' Margin to optic disc ' + this.margin + ' mm.';
	}

	return desc;
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.ChoroidalNaevusMelanoma.prototype.snomedCodes = function() {
	const snomedCodes = [];

	if (this.type === 'Melanoma') {
		snomedCodes.push([399634005, 3]);
	}
	if (this.type === 'Naevus') {
		snomedCodes.push([255024002, 3]);
	}
	if (this.type === 'Osteoma') {
		snomedCodes.push([255025001, 3]);
	}
	if (this.type === 'CHRPE') {
		snomedCodes.push([232074003, 3]);
	}


	return snomedCodes;
};
