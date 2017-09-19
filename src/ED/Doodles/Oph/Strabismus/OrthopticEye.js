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
 * 
 *
 * @class OrthopticEye
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OrthopticEye = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "OrthopticEye";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OrthopticEye.prototype = new ED.Doodle;
ED.OrthopticEye.prototype.constructor = ED.OrthopticEye;
ED.OrthopticEye.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OrthopticEye.prototype.setHandles = function() {
}

/**
 * Sets default dragging attributes
 */
ED.OrthopticEye.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isFilled = false;
}

/**
 * Sets default parameters
 */
ED.OrthopticEye.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OrthopticEye.prototype.draw = function(_point) {
	
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OrthopticEye.superclass.draw.call(this, _point);
    
	// Boundary path
	//ctx.beginPath();
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
        // Set line attributes
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(80,80,80,1)";
        
        // Upper Eye lid
        ctx.beginPath();
        ctx.arc(0,150,500,-Math.PI*3/4,-Math.PI*1/4,false);
        ctx.stroke();
        
        // Lower Eye lid
        ctx.beginPath();
        ctx.arc(0,-150,500,Math.PI*1/4,Math.PI*3/4,false);
        ctx.stroke();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}
