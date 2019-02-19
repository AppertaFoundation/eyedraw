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
 * Retinal detachment
 *
 * @class ChoroidalEffusion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ChoroidalEffusion = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ChoroidalEffusion";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.ChoroidalEffusion.prototype = new ED.Doodle;
ED.ChoroidalEffusion.prototype.constructor = ED.ChoroidalEffusion;
ED.ChoroidalEffusion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ChoroidalEffusion.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default properties
 */
ED.ChoroidalEffusion.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, +400);
};

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.ChoroidalEffusion.prototype.setParameterDefaults = function() {
	this.arc = 60 * Math.PI / 180;
	this.apexY = -200;
	this.setRotationWithDisplacements(45, 60);
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChoroidalEffusion.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ChoroidalEffusion.superclass.draw.call(this, _point);

	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952 / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

	// Connect across the bottom via the apex point
	var bp = +0.6;

	ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
	ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(134, 151, 176, 1)";
	ctx.strokeStyle = "rgba(134, 151, 176, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing){
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
ED.ChoroidalEffusion.prototype.groupDescription = function() {

	var doodles = this.drawing.allDoodlesOfClass(this.className);
	var doodle;
	var returnObject = {};
	var returnString = "";


	for (var i = 0; i < doodles.length; i++) {
		doodle = doodles[i];

		returnObject[this.getDescriptionForDoodle(doodle)] = typeof returnObject[this.getDescriptionForDoodle(doodle)] !== "undefined" ? returnObject[this.getDescriptionForDoodle(doodle)]+1 : 1;
	}

	for (var desc in returnObject) {
		if (!returnObject.hasOwnProperty(desc)){
			continue;
		}
		if(returnString !== ''){
			returnString += ', ';
		}
		returnString += desc + " [" + returnObject[desc] + "]";
	}

	return returnString;
};

ED.ChoroidalEffusion.prototype.getDescriptionForDoodle = function(doodle) {
	var returnString = "";

	// Use trigonometry on rotation field to determine quadrant
	returnString = returnString + (Math.cos(doodle.rotation) > 0 ? "Supero" : "Infero");
	returnString = returnString + (Math.sin(doodle.rotation) > 0 ? (doodle.drawing.eye === ED.eye.Right ? "nasal" : "temporal") : (doodle.drawing.eye === ED.eye.Right ? "temporal" : "nasal"));
	returnString = returnString + " choroidal effusion";

	return returnString;
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.ChoroidalEffusion.prototype.snomedCode = function() {
	return 232000008;
};
