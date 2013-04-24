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
 * PostPole template with disc and arcades
 *
 * @class PostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "PostPole";

	// Private parameters
	this.discRadius = 84;

	// Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
	this.cdRatio = '0';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostPole.prototype = new ED.Doodle;
ED.PostPole.prototype.constructor = ED.PostPole;
ED.PostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostPole.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PostPole.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameterss
	var apexX = this.drawing.eye == ED.eye.Right ? 300 : -300;
	this.parameterValidationArray['apexX']['range'].setMinAndMax(apexX, apexX);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -8);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['cdRatio'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(0, 1),
		precision: 1,
		animate: true
	};

	// Slow down ApexY animation for this doodle (small scope)
	this.parameterValidationArray['apexY']['delta'] = 5;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostPole.prototype.setParameterDefaults = function() {
	this.setParameterFromString('cdRatio', '0.5');
	this.apexX = this.drawing.eye == ED.eye.Right ? 300 : -300;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostPole.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			returnArray['cdRatio'] = -_value / 80;
			break;

		case 'cdRatio':
			returnArray['apexY'] = -(+_value * 80);
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostPole.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PostPole.superclass.draw.call(this, _point);

	// Disc location
	var x = this.drawing.eye == ED.eye.Right ? 300 : -300;

	// Boundary path
	ctx.beginPath();

	// Optic disc
	ctx.arc(x, 0, this.discRadius, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(249,187,76,1)";
	ctx.fillStyle = "rgba(249,187,76,1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Optic cup
		ctx.beginPath();
		ctx.arc(x, 0, -this.apexY, 2 * Math.PI, 0, false);
		ctx.fillStyle = "white";
		var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPatternSmall'], 'repeat');
		ctx.fillStyle = ptrn;
		ctx.lineWidth = 4;
		ctx.fill();
		ctx.stroke();

		// Arcades
		ctx.beginPath();

		// Coordinates
		var sign = this.drawing.eye == ED.eye.Right ? 1 : -1;
		var startX = -300 * sign;
		var midX1 = -50 * sign;
		var midX2 = 300 * sign;
		var midX3 = 300 * sign;
		var endX1 = 300 * sign;
		var endX2 = 350 * sign;
		var endX3 = 400 * sign;
		var foveaX = 0;

		// Superior arcades
		ctx.moveTo(startX, -100);
		ctx.bezierCurveTo(midX1, -500, midX2, -200, midX3, -24);
		ctx.bezierCurveTo(endX1, -80, endX2, -140, endX3, -160);

		// Inferior arcades
		ctx.moveTo(endX3, 160);
		ctx.bezierCurveTo(endX2, 140, endX1, 80, midX3, 24);
		ctx.bezierCurveTo(midX2, 200, midX1, 500, startX, 100);

		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);

		// Draw arcades
		ctx.lineWidth = 8;
		ctx.lineCap = "round";
		ctx.strokeStyle = "red";
		ctx.stroke();

		// One disc diameter
		ctx.beginPath();
		ctx.arc(0, 0, 2 * this.discRadius, 2 * Math.PI, 0, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.PostPole.prototype.description = function() {
	return this.drawing.doodleArray.length == 1 ? "No abnormality" : "";
}

/**
 * Tests whether passed doodle is within a number of disc diameters of fovea
 *
 * @param {Doodle} _doodle The doodle to test
 * @param {Int} _diameters The number of disc diameters to test
 * @returns {Bool} True if doodle is within the passed number of disc diameters of fovea
 */
ED.PostPole.prototype.isWithinDiscDiametersOfFovea = function(_doodle, _diameters) {
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < _diameters * 4 * this.discRadius * this.discRadius;
}

/**
 * Tests whether passed doodle is within a the confines of the optic disc
 *
 * @param {Doodle} _doodle The doodle to test
 * @returns {Bool} True if doodle is within the confines of the optic disc
 */
ED.PostPole.prototype.isWithinDisc = function(_doodle) {
	// Disc location
	var x = _doodle.originX - (this.drawing.eye == ED.eye.Right ? 300 : -300);

	return (x * x + _doodle.originY * _doodle.originY) < this.discRadius * this.discRadius;
}

/**
 * Tests whether passed doodle is within a the vascular arcades
 *
 * @param {Doodle} _doodle The doodle to test
 * @returns {Bool} True if doodle is within the vascular arcades
 */
ED.PostPole.prototype.isWithinArcades = function(_doodle) {
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < (300 * 300);
}
