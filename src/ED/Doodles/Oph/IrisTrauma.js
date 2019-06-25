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
 * IrisTrauma
 *
 * @class IrisTrauma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IrisTrauma = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IrisTrauma";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation', 'radius'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

};

/**
 * Sets superclass and constructor
 */
ED.IrisTrauma.prototype = new ED.Doodle;
ED.IrisTrauma.prototype.constructor = ED.IrisTrauma;
ED.IrisTrauma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IrisTrauma.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default properties
 */
ED.IrisTrauma.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update validation array for simple parameters
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, +0);

};

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.IrisTrauma.prototype.setParameterDefaults = function() {
	
	this.radius = 330; // 

	this.apexY = -330;
	var antSeg = this.drawing.lastDoodleOfClass('AntSeg');
	if (antSeg) {
		this.apexY = 0.5 * (-380 - antSeg.apexY) + antSeg.apexY; // default to cover 50% of iris i.e. anterior segment doodle radius
	}
	
	var defaultRotation = 0.5*Math.PI;
	var defaultArc = 3.5 * 1 / 6;
	var incisionDoodle = this.drawing.lastDoodleOfClass('PhakoIncision');
	if (incisionDoodle) {
		defaultRotation = incisionDoodle.rotation + Math.PI;
		defaultArc = incisionDoodle.arc;
	}
	this.rotation = defaultRotation;
	this.arc = defaultArc;
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.IrisTrauma.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {};

	switch (_parameter) {
		case 'apexY':
			var antSeg = this.drawing.lastDoodleOfClass('AntSeg');
			if (antSeg) {
				// prevent apexY going into pupil region of anterior segment
				if (_value > antSeg.apexY-10) returnArray['apexY'] = antSeg.apexY-10; 
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
ED.IrisTrauma.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IrisTrauma.superclass.draw.call(this, _point);

	var r = this.radius; // radius
	var d = 40; //
	
	var antSeg = this.drawing.lastDoodleOfClass('AntSeg');
	var ro = -this.apexY; // outer radius
	var ri = (antSeg) ? -antSeg.apexY : 200; // inner radius


	// Boundary path
	ctx.beginPath();

	// Half angle of arc
	var theta = this.arc / 2;

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// fill pattern
	ctx.fillStyle = ctx.createPattern(this.drawing.imageArray['TraumaPattern'], 'repeat');

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.IrisTrauma.prototype.description = function() {
	var returnString = "Iris trauma at " + parseInt(this.rotation * 180 / Math.PI) + " degrees";

	return returnString;
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.IrisTrauma.prototype.snomedCode = function() {
	return 231951002; // code for Traumatic iris atrophy, best match at time of development
}
