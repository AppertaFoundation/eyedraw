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
 * Patch
 *
 * @class Patch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Patch = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Patch";

	// Derived parameters
	this.material = 'Sclera';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'width', 'height', 'apexX'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Patch.prototype = new ED.Doodle;
ED.Patch.prototype.constructor = ED.Patch;
ED.Patch.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Patch.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Size, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Patch.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['material'] = {
		kind: 'derived',
		type: 'string',
		list: ['Sclera', 'Tenons', 'Tutoplast'],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.Patch.prototype.setParameterDefaults = function() {
	this.width = 120;
	this.height = 200;
	this.originY = -260;

	this.setParameterFromString('material', 'Sclera');

	// Patches are usually temporal
// 	if(this.drawing.eye == ED.eye.Right)
// 	{
// 	   this.originX = -260;
// 	   this.rotation = -Math.PI/4;
// 	}
// 	else
// 	{
// 	   this.originX = 260;
// 	   this.rotation = Math.PI/4;
// 	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Patch.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexX':
			if (_value < -16) returnArray['material'] = 'Sclera';
			else if (_value < 16) returnArray['material'] = 'Tenons';
			else returnArray['material'] = 'Tutoplast';
			break;

		case 'material':
			if (_value == 'Sclera') returnArray['apexX'] = -50;
			else if (_value == 'Tenons') returnArray['apexX'] = 50;
			else returnArray['apexX'] = 0;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patch.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Patch.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

	// Close path
	ctx.closePath();

	// Colour of fill
	switch (this.material) {
		case 'Sclera':
			ctx.fillStyle = "rgba(200,200,50,0.5)";
			break;
		case 'Tenons':
			ctx.fillStyle = "rgba(200,200,200,0.5)";
			break;
		case 'Tutoplast':
			ctx.fillStyle = "rgba(230,230,230,0.5)";
			break;
	}
	ctx.strokeStyle = "rgba(120,120,120,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		var xd = this.width/2;
		var yd = this.height/2 - 10;

		// Suture knots
		this.drawSpot(ctx, -xd, -yd, 5, "blue");
		this.drawSpot(ctx, -xd, yd, 5, "blue");
		this.drawSpot(ctx, xd, -yd, 5, "blue");
		this.drawSpot(ctx, xd, yd, 5, "blue");

		// Suture thread ends
// 		this.drawLine(ctx, -60, -60, -50, -50, 2, "blue");
// 		this.drawLine(ctx, -50, -50, -60, -40, 2, "blue");
// 		this.drawLine(ctx, -60, 60, -50, 50, 2, "blue");
// 		this.drawLine(ctx, -50, 50, -60, 40, 2, "blue");
// 		this.drawLine(ctx, 60, -60, 50, -50, 2, "blue");
// 		this.drawLine(ctx, 50, -50, 60, -40, 2, "blue");
// 		this.drawLine(ctx, 60, 60, 50, 50, 2, "blue");
// 		this.drawLine(ctx, 50, 50, 60, 40, 2, "blue");
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Drawing.Point(this.width / 2, -this.height / 2));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.Patch.prototype.drawHighlightExtras = function() {
	// Get context
	var ctx = this.drawing.context;

	// Draw text description of material
	ctx.lineWidth = 1;
	ctx.fillStyle = "gray";
	ctx.font = "48px sans-serif";
	ctx.fillText(this.material, 80, 20);
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Patch.prototype.description = function() {
	return "Scleral patch";
}
