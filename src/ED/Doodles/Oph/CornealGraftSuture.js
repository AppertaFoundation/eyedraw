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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * CornealGraftSuture
 *
 * @class CornealGraftSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealGraftSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealGraftSuture";

	// Private parameters
	this.pixelsPerMillimetre = 63.3333;
	
	// Other parameters
	this.tension = 'Loose';
	this.proudKnot = false;

	// Saved parameters
	this.savedParameterArray = ['radius', 'rotation', 'tension', 'proudKnot'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'tension':'Tension', 'proudKnot':'Proud Knot'};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealGraftSuture.prototype = new ED.Doodle;
ED.CornealGraftSuture.prototype.constructor = ED.CornealGraftSuture;
ED.CornealGraftSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealGraftSuture.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['tension'] = {
		kind: 'derived',
		type: 'string',
		list: ['Loose', 'Tight'],
		animate: false
	};
	this.parameterValidationArray['proudKnot'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.CornealGraftSuture.prototype.setParameterDefaults = function() {
	this.setParameterFromString('tension', 'Tight');
	this.setParameterFromString('proudKnot', 'False');
	
	var doodle = this.drawing.lastDoodleOfClass("CornealGraft");
	if (doodle) {
		this.radius = doodle.diameter * this.pixelsPerMillimetre/2;
		var theta = 360/doodle.numberOfSutures;
		this.setRotationWithDisplacements(0, -theta);
	}
	else {
		this.radius = 374;
		this.setRotationWithDisplacements(0, 30);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealGraftSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealGraftSuture.superclass.draw.call(this, _point);
	
	// Move according to graft diameter
	var doodle = this.drawing.lastDoodleOfClass("CornealGraft");
	if (doodle) {
		this.radius = doodle.diameter * this.pixelsPerMillimetre/2;
	}

	// Boundary path
	ctx.beginPath();

	var r = this.radius;
	ctx.rect(-20, -(r + 40), 40, 80);

	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(255,255,255,0.0)";

	// Set line attributes
	ctx.lineWidth = 6;

	// Colour of outer line is dark gray
	ctx.strokeStyle = this.isSelected?"rgba(120,120,120,0.5)":"rgba(120,120,120,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		if (this.tension == "Loose") {
			ctx.moveTo(0, -r - 40);
			ctx.bezierCurveTo(-20, -r - 20, +20, -r + 20, 0, -r + 40);
		}
		else
		{
			ctx.moveTo(0, -r - 40);
			ctx.lineTo(0, -r + 40);
		}
		ctx.moveTo(-10, -r + 10);
		ctx.lineTo(0, -r + 20);
		ctx.lineTo(-10, -r + 30);

		ctx.lineWidth = 2;
		var colour = "rgba(0,0,120,0.7)"
		ctx.strokeStyle = colour;

		ctx.stroke();

		// Knot
		var d = this.proudKnot?8:4;
		this.drawSpot(ctx, 0, -r + 20, d, colour);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealGraftSuture.prototype.description = function() {
	var returnString = "Corneal suture at ";

	returnString += this.clockHour() + " o'clock";

	return returnString;
}
