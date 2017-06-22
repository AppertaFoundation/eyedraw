/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Adenoviral keratitis
 *
 * @class AdenoviralKeratitis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AdenoviralKeratitis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AdenoviralKeratitis";

	// Private parameters used in bound sideview doodle
	this.h = 250;
	
	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'scaleX', 'scaleY','originX','originY','h'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AdenoviralKeratitis.prototype = new ED.Doodle;
ED.AdenoviralKeratitis.prototype.constructor = ED.AdenoviralKeratitis;
ED.AdenoviralKeratitis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AdenoviralKeratitis.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AdenoviralKeratitis.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +40);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
	
	this.parameterValidationArray['h'] = {
		kind: 'derived',
		type: 'int',
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AdenoviralKeratitis.prototype.setParameterDefaults = function() {
	this.apexY = -5;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AdenoviralKeratitis.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {},
		returnValue;

	switch (_parameter) {
		// dependent parameters for bound side view doodle		
		case 'scaleX':
			returnArray.h = Math.round(_value * 250);
			break;
			
		case 'h':
			returnArray['h'] = _value;
			break;
			
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AdenoviralKeratitis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AdenoviralKeratitis.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 250;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Colours
		var fill = "rgba(230, 230, 230, 0.8)";
		ctx.shadowBlur = 3;
		ctx.shadowColor="black";

		var dr = 8 * ((this.apexX + 20) / 20) / this.scaleX;

		var p = new ED.Point(0, 0);
		var n = 2 + Math.abs(Math.floor(this.apexY / 2));
		for (var i = 0; i < n; i++) {
			p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i+100]);
			this.drawSpot(ctx, p.x, p.y, dr, fill);
		}
		this.drawSpot(ctx, 0, r, dr, fill);
		this.drawSpot(ctx, 0, -r, dr, fill);
		this.drawSpot(ctx, r, 0, dr, fill);
		this.drawSpot(ctx, -r, 0, dr, fill);
		
		ctx.shadowColor="rgba(0, 0, 0, 0)";
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
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
ED.AdenoviralKeratitis.prototype.description = function() {
	return "Adenoviral keratitis";
}
