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
 * Toric Posterior chamber IOL
 *
 * @class ToricPCIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ToricPCIOL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ToricPCIOL";
	
	// Derived parameters
	this.axis = 0;
	
	// Other parameters
	this.model = 'Type 1';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'model'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'model':'Model'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ToricPCIOL.prototype = new ED.Doodle;
ED.ToricPCIOL.prototype.constructor = ED.ToricPCIOL;
ED.ToricPCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ToricPCIOL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.ToricPCIOL.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isUnique = true;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['axis'] = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 180),
		clock: 'bottom',
		animate: true
	};
	
	this.parameterValidationArray['model'] = {
		kind: 'derived',
		type: 'string',
		list: ['AcrySof T3 (+1.50 D)', 'AcrySof T4 (+2.25 D)', 'AcrySof T5 (+3.00 D)', 'AA4203-TF (+2.00 D)', 'AA4203-TL (+3.50 D)'],
		animate: false
	}
}

/**
 * Sets default parameters
 */
ED.ToricPCIOL.prototype.setParameterDefaults = function() {
	this.scaleX = 0.75;
	this.scaleY = 0.75;
	this.setParameterFromString('axis', '0');
	this.setParameterFromString('model', 'AcrySof T3 (+1.50 D)');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.ToricPCIOL.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	// Similar to TrialLens but with correction to line up haptics correctly
	switch (_parameter) {
		case 'rotation':
			returnArray['axis'] = (-120 + 720 - 180 * _value / Math.PI) % 180;
			break;

		case 'axis':
			returnArray['rotation'] = (60 + 180 - _value) * Math.PI / 180;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ToricPCIOL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ToricPCIOL.superclass.draw.call(this, _point);

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

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Lines for toric IOL
		ctx.beginPath();

		// Create points
		var phi = 0.7 * Math.PI / 4;
		var theta = phi + Math.PI;
		var p1 = new ED.Point(0, 0)
		p1.setWithPolars(r - 20, phi);
		var p2 = new ED.Point(0, 0);
		p2.setWithPolars(r - 100, phi);
		var p3 = new ED.Point(0, 0)
		p3.setWithPolars(r - 20, theta);
		var p4 = new ED.Point(0, 0);
		p4.setWithPolars(r - 100, theta);

		// Create lines
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.moveTo(p3.x, p3.y);
		ctx.lineTo(p4.x, p4.y);

		// Set line attributes
		ctx.lineWidth = 24;
		ctx.lineCap = "round";
		ctx.strokeStyle = "darkgray";

		// Draw lines
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, 4 * Math.PI / 4);
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
ED.ToricPCIOL.prototype.description = function() {
	var returnValue = "Toric posterior chamber IOL " + this.model + " ";

	// Displacement limit
	var limit = 40;

	// ***TODO*** ensure description takes account of side of eye
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
		displacementValue += " temporally";
	}
	if (this.originX > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " nasally";
	}

	// Add displacement description
	if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;

	returnValue += ' @ ' + this.axis.toFixed(0) + '\xB0';

	return returnValue;
}
