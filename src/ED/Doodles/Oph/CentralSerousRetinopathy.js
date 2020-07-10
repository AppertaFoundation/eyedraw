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
 * Corneal Oedema
 *
 * @class CentralSerousRetinopathy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CentralSerousRetinopathy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CentralSerousRetinopathy";

	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.CentralSerousRetinopathy.prototype = new ED.Doodle;
ED.CentralSerousRetinopathy.prototype.constructor = ED.CentralSerousRetinopathy;
ED.CentralSerousRetinopathy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CentralSerousRetinopathy.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
};

/**
 * Sets default properties
 */
ED.CentralSerousRetinopathy.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = false;

	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);

	this.parameterValidationArray['originY']['range'].setMinAndMax(-200, 200);
	this.parameterValidationArray['originX']['range'].setMinAndMax(-200 , 200);

};

ED.CentralSerousRetinopathy.prototype.setParameterDefaults = function() {
	this.scaleY = 0.5;
	this.scaleX = 0.5;
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CentralSerousRetinopathy.prototype.dependentParameterValues = function(_parameter, _value) {

	var returnArray = [];

	var r = 185;
	switch (_parameter) {
		case 'scaleX':
		case 'scaleY':
			this.parameterValidationArray['originX']['range'].setMinAndMax(-300+(r*_value), 300-(r*_value));
			this.parameterValidationArray['originY']['range'].setMinAndMax(-300+(r*_value), 300-(r*_value));

			var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY);
			var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX);

			this.setSimpleParameter('originX', newOriginX);
			this.setSimpleParameter('originY', newOriginY);

			break;
	}

	return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CentralSerousRetinopathy.prototype.draw = function(_point) {

	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CentralSerousRetinopathy.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 200;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.closePath();

	this.drawBoundary(_point);


	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		ctx.save();
		ctx.beginPath();

		//the bomb
		var gradient = ctx.createRadialGradient(0, -360, 85, 0, -360, 120);
		gradient.addColorStop(0, "rgba(83, 130, 53, 1)");
		gradient.addColorStop(1, "rgba(83, 130, 53, 0)");

		ctx.fillStyle = gradient;
		ctx.arc(0, -220, 185, 0, 2 * Math.PI);
		ctx.transform(1,0,0,0.5,0,55);
		ctx.fill();

		ctx.restore();
		ctx.beginPath();

		ctx.arc(0, 0, 185, 0, 2 * Math.PI);
		ctx.strokeStyle = 'rgba(83, 130, 53, 1)';
		ctx.setLineDash([28, 15]);
		ctx.lineWidth = 5;
		ctx.stroke();

		ctx.fillStyle = 'rgba(83, 130, 53, 0.3)';
		ctx.fill();

		ctx.save();
		ctx.beginPath();

		//tentacle
		ctx.fillStyle = 'rgba(83, 130, 53, 1)';
		ctx.ellipse(0,-100, 10,100, 0, 0, Math.PI);
		ctx.fill();
	}


	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));

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
ED.CentralSerousRetinopathy.prototype.description = function() {
	return 'Polypoidal choroidal vasculopathy';
};

ED.CentralSerousRetinopathy.prototype.snomedCode = function() {
	return 313001006;
};