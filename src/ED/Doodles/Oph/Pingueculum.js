/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2017
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
 * Pingueculum
 *
 * @class Pingueculum
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Pingueculum = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Pingueculum";

	// Derived parameters

	// Saved parameters
	this.savedParameterArray = ['arc','rotation'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Pingueculum.prototype = new ED.Doodle;
ED.Pingueculum.prototype.constructor = ED.Pingueculum;
ED.Pingueculum.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Pingueculum.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}


/**
 * Sets default dragging attributes
 */
ED.Pingueculum.prototype.setPropertyDefaults = function() {
	this.isUnique = false;
	this.isMoveable = false;
	this.isRotatable = false;
	
	this.parameterValidationArray['arc']['range'].setMinAndMax(0.75*Math.PI, 1.25*Math.PI);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Pingueculum.prototype.setParameterDefaults = function() {
	this.arc = 180 * Math.PI / 180;
	this.setRotationWithDisplacements(0, 180);
	if (this.rotation>0.5*Math.PI) this.rotation = Math.PI;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Pingueculum.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Pingueculum.superclass.draw.call(this, _point);

	//Set variables used to draw pingueculum
	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var outerR = 460;
	var xPos = outerR * Math.sin(theta); // x start coordinate
	var yPos = -outerR * Math.cos(theta); // y start coordinate

	var r = 38; // radius of circles used for pingueculum


	// Boundary path
	// Draw circle around pingueculum
	ctx.beginPath();
	ctx.arc(xPos, yPos, 2*r, 0, 2 * Math.PI, true);
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		//Draw pingueculum:
		ctx.fillStyle = 'yellow'; //Set pingueculum colour

		//Draw 3 circles around start point
		ctx.beginPath();
		ctx.arc(xPos - r, yPos - 0.5*r, r, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(xPos - r, yPos + 0.5*r, r, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(xPos, yPos, r, 0, Math.PI * 2, false);
		ctx.fill();
	}

	// Set handle position
	var topRightX = outerR * Math.sin(theta);
	var topRightY = -outerR * Math.cos(theta);
	var topLeftX = -outerR * Math.sin(theta);
	var topLeftY = topRightY;
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.Pingueculum.prototype.description = function() {
	var returnValue = "Pingueculum";
	return returnValue;
}
