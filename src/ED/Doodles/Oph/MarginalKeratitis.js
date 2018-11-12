/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2017
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
 * Marginal Keratitis
 *
 * @class MarginalKeratitis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MarginalKeratitis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MarginalKeratitis";
	this.epithelialDefectPercent = 90;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation','epithelialDefectPercent'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'epithelialDefectPercent':"% Epithelial defect \n of corneal infiltrate"
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MarginalKeratitis.prototype = new ED.Doodle;
ED.MarginalKeratitis.prototype.constructor = ED.MarginalKeratitis;
ED.MarginalKeratitis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MarginalKeratitis.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);	
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.MarginalKeratitis.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	var range = new Object;
	range.length = new ED.Range(380, +495);
	range.angle = new ED.Range(0, 2*Math.PI);
	this.handleVectorRangeArray[0] = range;

	
	this.isMoveable = false;
	this.isUnique = false;
	this.isFilled = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray.epithelialDefectPercent = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0, 100),
		animate: false
	};

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-375, -226);
// 	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI);
}

/**
 * Sets default parameters
 */
ED.MarginalKeratitis.prototype.setParameterDefaults = function() {
	this.apexY = -340;
	this.arc = 45 * Math.PI / 180;
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// defining outer handle
	var point = new ED.Point(0, -420);
	this.squiggleArray[0].addPoint(point);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.MarginalKeratitis.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {},
		returnValue;

	switch (_parameter) {
		
		// constrain handles to only move in the X plane
		case 'handles':
			this.squiggleArray[0].pointsArray[this.draggingHandleIndex].x = 0;
			break;
	}

	return returnArray;
};


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MarginalKeratitis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);


	// Calculate parameters for arcs
    // position of outer handle
	var rOuter = Math.abs(this.squiggleArray[0].pointsArray[0].y);
	var r = 380;
	var rInner = Math.abs(this.apexY);
	
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of arcs
	var topRightX = rOuter * Math.sin(theta);
	var topRightY = -rOuter * Math.cos(theta);
	var topLeftX = -rOuter * Math.sin(theta);
	var topLeftY = topRightY;
	
	var midRightX = r * Math.sin(theta);
	var midRightY = -r * Math.cos(theta);
	var midLeftX = -r * Math.sin(theta);
	var midLeftY = midRightY;
	
	var bottomRightX = rInner * Math.sin(theta);
	var bottomRightY = -rInner * Math.cos(theta);
	var bottomLeftX = -rInner * Math.sin(theta);
	var bottomLeftY = bottomRightY;

	// Boundary path
	ctx.beginPath();

	// Outer arc - inflammation
	ctx.arc(0, 0, rOuter, arcStart, arcEnd, true);
	
	// Inner arc - opacity
	ctx.arc(0, 0, rInner, arcEnd, arcStart, false);
	
	// Set line attributes - invisible boundary
	ctx.strokeStyle = "rgba(255,255,255,0)";


	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
		// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// inflammation
		ctx.beginPath();
		ctx.arc(0, 0, rOuter, arcStart, arcEnd, true);
		ctx.arc(0, 0, r, arcEnd, arcStart, false);
		var ptrn = ctx.createPattern(this.drawing.imageArray['NewVesselPattern'], 'repeat');
		ctx.fillStyle = ptrn;
		ctx.fill();
		var gradient = ctx.createRadialGradient(0, 0, r, 0, 0, rOuter);
		gradient.addColorStop(0, 'red');           
		gradient.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.closePath();
		
		// corneal infiltrate
		ctx.beginPath();
		ctx.arc(0, 0, r, arcStart, arcEnd, true);
		ctx.arc(0, 0, rInner, arcEnd, arcStart, false);
		ctx.fillStyle = "gray";
		ctx.strokeStyle = "gray";
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		// epithelial defect
		var phi = this.epithelialDefectPercent / 100 * this.arc / 2;
		var arcStartE = -Math.PI / 2 + phi;
		var arcEndE = -Math.PI / 2 - phi;
		
		var infiltrateDepth = r - rInner;
		var epithelialDepth = infiltrateDepth * this.epithelialDefectPercent / 100;
		var rEpi = r - epithelialDepth;
		var epiRightX = rEpi * Math.sin(phi);
		var epiRightY = -rEpi * Math.cos(phi);
		var epiLeftX = -rEpi * Math.sin(phi);
		var epiLeftY = epiRightY;
		ctx.beginPath();
		ctx.arc(0, 0, r, arcStartE, arcEndE, true);
		ctx.arc(0, 0, rEpi, arcEndE, arcStartE, false);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();		
	}


	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(midLeftX, midLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(midRightX, midRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));	
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);

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
ED.MarginalKeratitis.prototype.description = function() {
	return "Marginal keratitis";
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {number} SnoMed code of entity represented by doodle
 */
ED.MarginalKeratitis.prototype.snomedCode = function() {
    'use strict';

    return 95730003;
};
