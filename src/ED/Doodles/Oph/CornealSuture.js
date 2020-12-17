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
 * CornealSuture
 *
 * @class CornealSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealSuture";
	
	// Derived parameters
	this.removed = false;
	
	// Other parameters
	var cornealGraft = _drawing.firstDoodleOfClass("CornealGraft");
	this.cornealGraft = cornealGraft ? cornealGraft : null;
	this.setParametersFromCornealGraft();
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'radius', 'rotation','removed'];
	
	this.controlParameterArray = {'removed':'Removed'};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealSuture.prototype = new ED.Doodle;
ED.CornealSuture.prototype.constructor = ED.CornealSuture;
ED.CornealSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealSuture.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	
	this.parameterValidationArray['removed'] = {
		kind: 'derived',
		type: 'bool',
		animate: false
	}
}

ED.CornealSuture.prototype.setParametersFromCornealGraft = function() {
	if (this.cornealGraft) {
		this.originX = this.cornealGraft.originX;
		this.originY = this.cornealGraft.originY;
		this.radius = this.cornealGraft.diameter * this.cornealGraft.pixelsPerMillimetre/2;
	}
};

/**
 * Sets default parameters
 */
ED.CornealSuture.prototype.setParameterDefaults = function() {
	this.radius = 374;
	this.setRotationWithDisplacements(10, 20);
	this.setParametersFromCornealGraft();
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealSuture.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	if (this.cornealGraft) this.radius = this.cornealGraft.diameter * this.cornealGraft.pixelsPerMillimetre/2;
	var r = this.radius;
	ctx.rect(-20, -(r + 40), 40, 80);

	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(255,255,255,0.0)";

	// Set line attributes
	ctx.lineWidth = 6;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.moveTo(0, -r - 40);
		ctx.lineTo(0, -r + 40);
		ctx.moveTo(-10, -r + 10);
		ctx.lineTo(0, -r + 20);
		ctx.lineTo(-10, -r + 30);

		ctx.lineWidth = 2;
		if (this.removed) ctx.strokeStyle = "rgba(150,150,150,0.6)";
		else {
			var colour = "rgba(0,0,120,0.7)"
			ctx.strokeStyle = colour;
		}
	
		ctx.stroke();

		// Knot
		this.drawSpot(ctx, 0, -r + 20, 4, colour);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
/*
ED.CornealSuture.prototype.description = function() {
	var returnString = "Corneal suture at ";

	returnString += this.clockHour() + " o'clock";

	return returnString;
}
*/

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealSuture.prototype.groupDescription = function() {

	let returnString = "";
	let corneal_sutures = this.drawing.allDoodlesOfClass(this.className).filter(corneal_suture => corneal_suture.removed === false);

	let number = corneal_sutures.length;
	if (number > 0) returnString = number + " corneal suture";

	if (number > 1) returnString += "s";

	return returnString;
};