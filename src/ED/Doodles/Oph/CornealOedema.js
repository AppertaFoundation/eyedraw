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
 * Corneal Oedema
 *
 * @class CornealOedema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealOedema = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealOedema";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 360;

	// Derived parameters
	this.intensity = 'Mild';
	
	// Other parameters
	this.stromal = false;
	this.epithelial = false;
	this.endothelial = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY', 'rotation', 'intensity', 'stromal', 'epithelial', 'endothelial'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'intensity':'Intensity', 'stromal':'Stromal', 'epithelial':'Epithelial', 'endothelial':'Endothelial'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealOedema.prototype = new ED.Doodle;
ED.CornealOedema.prototype.constructor = ED.CornealOedema;
ED.CornealOedema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealOedema.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
	// Array of handles
// 	for (var i = 0; i < this.numberOfHandles; i++) {
// 		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
// 	}
}

/**
 * Sets default properties
 */
ED.CornealOedema.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -80);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['intensity'] = {
		kind: 'derived',
		type: 'string',
		list: ['Mild', 'Moderate', 'Severe'],
		animate: false
	};
	this.parameterValidationArray['stromal'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['epithelial'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['endothelial'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};

	/*
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(+50, +380);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}
	*/
}

/**
 * Sets default parameters
 */
ED.CornealOedema.prototype.setParameterDefaults = function() {
	this.apexY = -this.initialRadius;
	this.setParameterFromString('stromal', 'false');
	this.setParameterFromString('epithelial', 'false');
	this.setParameterFromString('endothelial', 'false');

	// Put control handle at 45 degrees
	this.rotation = Math.PI / 4;

/*
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
*/
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealOedema.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealOedema.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	/*
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
	for (var i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];

		// Control points
		cp1 = fp.tangentialControlPoint(+phi);
		cp2 = tp.tangentialControlPoint(-phi);

		// Draw Bezier curve
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	}

	// Close path
	ctx.closePath();
	*/

	// Round lesion
	var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Set attributes
	ctx.lineWidth = 4;
	switch (this.intensity) {
		case 'Mild':
			ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
			break;
		case 'Moderate':
			ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['OedemaPattern'], 'repeat');
			break;
		case 'Severe':
			ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['OedemaPatternBullous'], 'repeat');
			break;
	}
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (false) {
			var ptrn = ctx.createPattern(this.drawing.imageArray['OedemaPatternBullous'], 'repeat');
			ctx.fillStyle = ptrn;
			ctx.fill();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
// 	for (var i = 0; i < this.numberOfHandles; i++) {
// 		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
// 	}

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
ED.CornealOedema.prototype.description = function() {
	return "Corneal oedema";
}
