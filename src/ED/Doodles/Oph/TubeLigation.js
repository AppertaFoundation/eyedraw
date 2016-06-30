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
 * TubeLigation suture
 *
 * @class TubeLigation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TubeLigation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TubeLigation";

	// Derived parameters
	this.material = 'Vicryl';

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'material':'Material'};

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'material'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TubeLigation.prototype = new ED.Doodle;
ED.TubeLigation.prototype.constructor = ED.TubeLigation;
ED.TubeLigation.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TubeLigation.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['material'] = {
		kind: 'derived',
		type: 'string',
		list: ['10/0 Nylon', 'Vicryl', 'Prolene'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.TubeLigation.prototype.setParameterDefaults = function() {
	this.originX = -240;
	this.originY = -240;

	var isRE = (this.drawing.eye == ED.eye.Right);

	// Make rotation same as tube
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		switch (doodle.platePosition) {
			case 'STQ':
				if (isRE) {
					this.originX = -240;
					this.originY = -240;
					this.rotation = -Math.PI / 4;
				} else {
					this.originX = 240;
					this.originY = -240;
					this.rotation = Math.PI / 4;
				}
				break;
			case 'SNQ':
				if (isRE) {
					this.originX = 240;
					this.originY = -240;
					this.rotation = Math.PI / 4;
				} else {
					this.originX = -240;
					this.originY = -240;
					this.rotation = -Math.PI / 4;
				}
				break;
			case 'INQ':
				if (isRE) {
					this.originX = 240;
					this.originY = 240;
					this.rotation =  3 * Math.PI / 4;
				} else {
					this.originX = -240;
					this.originY = 240;
					this.rotation =  -3 * Math.PI / 4;
				}
				break;
			case 'ITQ':
				if (isRE) {
					this.originX = -240;
					this.originY = 240;
					this.rotation =  5 * Math.PI / 4;
				} else {
					this.originX = 240;
					this.originY = 240;
					this.rotation =  -5 * Math.PI / 4;
				}
				break;
		}
	}

	// If existing doodles, put in same meridian, but higher up
	var number = this.drawing.numberOfDoodlesOfClass(this.className);
	var doodle = this.drawing.firstDoodleOfClass(this.className);
	var xSign = doodle.originX > 0?1:-1;
	var ySign = doodle.originY > 0?1:-1;

	switch (number) {
		case 1:
			this.originX = 400 * xSign;
			this.originY = 400 * ySign;
			break;
		case 2:
			this.originX = 320 * xSign;
			this.originY = 320 * ySign;
			break;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TubeLigation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TubeLigation.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Use arcTo to create an ellipsoid
	ctx.moveTo(-20, 0);
	ctx.arcTo(0, -20, 20, 0, 30);
	ctx.arcTo(0, 20, -20, 0, 30);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "purple";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Ends of suture
		ctx.beginPath();
		ctx.moveTo(35, -10);
		ctx.lineTo(20, 0);
		ctx.lineTo(35, 10);
		ctx.stroke();

		// Knot
		this.drawSpot(ctx, 20, 0, 4, "purple");
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.TubeLigation.prototype.groupDescription = function() {
	var returnString = "";

	var number = this.drawing.numberOfDoodlesOfClass(this.className);
	returnString = number + " ligation suture";

	if (number > 1) returnString += "s";

	return returnString;
}
