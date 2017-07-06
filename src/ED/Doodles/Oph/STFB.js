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
 *
 *
 * @class STFB
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.STFB = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "STFB";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.STFB.prototype = new ED.Doodle;
ED.STFB.prototype.constructor = ED.STFB;
ED.STFB.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.STFB.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[2].isRotatable = true;
}

/**
 * Sets default dragging attributes
 */
ED.STFB.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
		
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-380, +380);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-370, +370);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(0.5, 5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(0.5, 3);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.STFB.prototype.setParameterDefaults = function() {	
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var np = new ED.Point(doodle.originX, doodle.originY + 70);
		this.move(np.x, np.y);
	} else {
		this.move(120, -200);
	};
	this.rotation = 0.25 * Math.PI;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.STFB.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.STFB.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	ctx.ellipse(0, 0, 15, 40, 0, 0, 2 * Math.PI);
	
	// Set line attributes
	ctx.lineWidth = 3;
	ctx.fillStyle = "#402A15";
	ctx.strokeStyle = "#402A15";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(15, -40);
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
ED.STFB.prototype.description = function() {
	var position = "";
	var str = "Sub tarsal foreign body";
	
	if (this.originY < -110) position = "Upper lid ";
	else if (this.originY > 110) position = "Lower lid ";
	
	var returnValue = (position.length>0) ? position + str.toLowerCase() : str;

	return returnValue;
}

