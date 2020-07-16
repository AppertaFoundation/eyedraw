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
 * Posterior chamber IOL
 *
 * @class PCIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PCIOL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PCIOL";
  this.classGroupUnique = "Lens";

	// Other parameters
	this.fixation = 'In-the-bag';
	this.fx = 1;
    this.csOriginX = 0;

	// Saved parameters
	this.savedParameterArray = ['fixation', 'fx', 'originX', 'originY', 'rotation', 'csOriginX'];

	// Parameters in doodle control bar
	this.controlParameterArray = {'fixation':'Fixation'};

	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// Invariate parameters
	this.scaleX = 0.75 * _drawing.getScaleLevel();
	this.scaleY = 0.75 * _drawing.getScaleLevel();
}

/**
 * Sets superclass and constructor
 */
ED.PCIOL.prototype = new ED.Doodle;
ED.PCIOL.prototype.constructor = ED.PCIOL;
ED.PCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PCIOL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.PCIOL.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isScaleable = false;
	this.isUnique = true;
	
	// Validation arrays for other parameters
	this.parameterValidationArray['fixation'] = {
		kind: 'derived',
		type: 'string',
		list: ['In-the-bag', 'Ciliary sulcus', 'Partly in the bag'],
		animate: true
	};
	this.parameterValidationArray['fx'] = {
		kind: 'other',
		type: 'int',
		range:  new ED.Range(1, 8),
		animate: false
	};
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-200, +200);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-200, +200);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PCIOL.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'fx':
			if (_value === 1){ returnArray['fixation'] = 'In-the-bag'; }
			if (_value === 2){ returnArray['fixation'] = 'Partly in the bag'; }
			if (_value === 3){ returnArray['fixation'] = 'Ciliary sulcus'; }
			break;

		case 'fixation':
			switch (_value) {
				case 'In-the-bag':
					this.setParameterFromString('fx', '1', true);
					break;
				case 'Partly in the bag':
					this.setParameterFromString('fx', '2', true);
					break;
				case 'Ciliary sulcus':
					this.setParameterFromString('fx', '3', true);
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
ED.PCIOL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PCIOL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of IOL optic
	var r = 240;

	// Draw optic
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);

	// Draw upper haptic
	ctx.moveTo(150, -190);
	ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
	ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
	ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
	ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
	ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);

	// Draw lower haptic
	ctx.moveTo(-150, 190);
	ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
	ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
	ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
	ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
	ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.PCIOL.prototype.description = function() {
	var returnValue = "Posterior chamber IOL";
	returnValue += " (" + this.fixation + " fixation)";

	// Displacement limit
	var limit = 40;

	var displacementValue = "";

	if (this.originY < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " superiorly";
	}
	if (this.originY > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " inferiorly";
	}
	if (this.originX < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " temporally" : " nasally";
	}
	if (this.originX > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " nasally" : " temporally";
	}

	// Add displacement description
	if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;

	return returnValue;
};
