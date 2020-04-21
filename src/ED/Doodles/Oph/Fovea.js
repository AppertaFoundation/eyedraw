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
 * Fovea
 *
 * @class Fovea
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Fovea = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Fovea";

	this.type = 'Normal';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'type'];

	this.controlParameterArray = {
		'type': 'Type'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.Fovea.prototype = new ED.Doodle;
ED.Fovea.prototype.constructor = ED.Fovea;
ED.Fovea.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Fovea.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
};

/**
 * Set default properties
 */
ED.Fovea.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isMoveable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);

	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: [
			'Normal',
			'Type 1 CNV', 'Type 2 CNV', 'Type 3 CNV',
			'Disciform AMD',
			'Stage I macula hole', 'Stage II macula hole', 'Stage III macula hole', 'Stage IV macula hole'
		],
		animate: false
	};
};

/**
 * Sets default parameters
 */
ED.Fovea.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, -100);
	this.setParameterFromString('type', 'Normal');


	if (this.drawing.hasDoodleOfClass('Fundus')) {
		this.originX = this.drawing.eye == ED.eye.Right ? -100 : 100;
	}
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fovea.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Fovea.superclass.draw.call(this, _point);

	if (this.type === 'Normal') {
		this.drawNormalFovea(ctx, _point);
	} else if (this.type.indexOf(' CNV') > -1) {
		this.drawCNV(ctx, _point, false);
	} else if(this.type === 'Disciform AMD') {
		this.drawCNV(ctx, _point, true);
	} else if(this.type.indexOf('macula hole') > -1) {
		this.drawMacularHole(ctx, _point, true);
	}

	// Return value indicating successful hit test
	return this.isClicked;
};

ED.Fovea.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {};

	switch (_parameter) {
		case 'type':

			if (_value === 'Normal') {
				this.scaleX = 1;
				this.scaleY = 1;
			}
			break;
	}
	return returnArray;
};

ED.Fovea.prototype.drawNormalFovea = function(ctx, _point) {

	var r = 28;

	// Blue centre
	ctx.beginPath();
	ctx.arc(0, 0, r * 0.8, 0, 2 * Math.PI, false);
	ctx.lineWidth = 3;
	ctx.strokeStyle="rgb(89,115,175)";
	ctx.stroke();
	ctx.closePath();
	ctx.fillStyle = "rgb(105,165,234)";
	ctx.fill();

	this.drawBoundary(_point);
};

ED.Fovea.prototype.drawCNV = function(ctx, _point, isDisciform) {

	// Boundary path
	ctx.beginPath();

	// Radius of Fovea
	var r = 80;

	// Parameters of random curve
	var n = 16;
	var phi = 2 * Math.PI / n;
	var th = 0.5 * Math.PI / n;
	var b = 4;
	var point = new ED.Point(0, 0);

	// First point
	var fp = new ED.Point(0, 0);
	fp.setWithPolars(r, 0);
	ctx.moveTo(fp.x, fp.y);
	var rl = r;

	// Subsequent points
	for (var i = 0; i < n; i++) {
		// Get radius of next point
		var rn = r * (b + ED.randomArray[i]) / b;

		// Control point 1
		var cp1 = new ED.Point(0, 0);
		cp1.setWithPolars(rl, i * phi + th);

		// Control point 2
		var cp2 = new ED.Point(0, 0);
		cp2.setWithPolars(rn, (i + 1) * phi - th);

		// Next point
		var pn = new ED.Point(0, 0);
		pn.setWithPolars(rn, (i + 1) * phi);

		// Assign next point
		rl = rn;

		// Next point
		if (i === n - 1) {
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, fp.x, fp.y);
		} else {
			ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pn.x, pn.y);
		}

		// Control handle point
		if (i === 1) {
			point.x = pn.x;
			point.y = pn.y;
		}
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Yellow/Grey centre
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.8, 0, 2 * Math.PI, false);
		ctx.closePath();
		if (isDisciform) {
			ctx.fillStyle = "rgb(155,155,155)";
		} else {
			ctx.fillStyle = "rgba(255,255,190,1)";
		}
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
};

ED.Fovea.prototype.drawMacularHole = function(ctx, _point) {
	// Radius
	var r = 40;

	// Boundary path
	ctx.beginPath();

	// Large yellow circle - hole and subretinal fluid
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.arc(0, 0, 2 * r / 3, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = "red";
		ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	const point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Fovea.prototype.description = function() {

	if (this.type.indexOf(' CNV') > -1) {
		return 'Choroidal neovascular membrane (' + this.type.replace(' CNV', '') + ')';
	} else if (this.type === 'Disciform AMD') {
		return this.type;
	} else if (this.type.indexOf('macula hole') > -1) {
		return 'Macula hole (' + this.type.replace(' macula hole' , '') + ')';
	}
	return "Normal fovea";
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Fovea.prototype.snomedCode = function() {

	if (this.type === 'Normal') {
		return 67046006;
	} else if (this.type.indexOf(' CNV') > -1) {
		return 75971007;
	} else if (this.type.indexOf('macula hole') > -1) {
		return 232006002;
	}

	// Disciform scar
	return 414173003;
};

