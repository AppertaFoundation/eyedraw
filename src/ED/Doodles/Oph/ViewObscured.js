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
 * ViewObscured template with disc and arcades
 *
 * @class ViewObscured
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ViewObscured = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ViewObscured";

	// Saved parameters
	this.savedParameterArray = ['apexY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ViewObscured.prototype = new ED.Doodle;
ED.ViewObscured.prototype.constructor = ED.ViewObscured;
ED.ViewObscured.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ViewObscured.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.ViewObscured.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters
 */
ED.ViewObscured.prototype.setParameterDefaults = function() {
	this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ViewObscured.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ViewObscured.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	// Radius of opacity
	var ro = 200;

	// Do a 360 arc
	 ctx.rect(-499, -499, 998, 998);

	// Opacity from apexY
	var opacity = 0.3 + 0.6 * (ro + 2 * this.apexY) / ro;
	ctx.fillStyle = "rgba(150, 150, 150," + opacity + ")";

	// Set attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle = "rgba(150, 150, 150, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

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
ED.ViewObscured.prototype.description = function() {
	var returnString;
	var endText;
	if (this.apexY < -50) {
		returnString = "Poor view of ";
		endText = "";
	}
	else {
		returnString =  "";
		endText = " obscured";
	}
	
	if (this.drawing.hasDoodleOfClass('PostPole')) {
		returnString += "Posterior pole";
	}
	else if (this.drawing.hasDoodleOfClass('Fundus')) {
		returnString += "Fundus";
	}
	else if (this.drawing.hasDoodleOfClass('OpticDisc')) {
		returnString += "Optic disc";
	}
	
	returnString += endText;
	
	return returnString;
}

