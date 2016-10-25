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
 * @class Retinoscopy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Retinoscopy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Retinoscopy";

	this.angle1 = 180;
	this.angle2 = 90;
	this.powerSign1 = "+";
	this.powerSign2 = "+";
	this.powerInt1 = 0;
	this.powerInt2 = 0;
	this.powerDp1 = ".00";
	this.powerDp2 = ".00";
	
	// Saved parameters
	this.savedParameterArray = ['rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Retinoscopy.prototype = new ED.Doodle;
ED.Retinoscopy.prototype.constructor = ED.Retinoscopy;
ED.Retinoscopy.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Retinoscopy.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Retinoscopy.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Retinoscopy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Retinoscopy.superclass.draw.call(this, _point);
	
	// Draw invisible boundary box around axes
	ctx.moveTo(-400,-400);
	ctx.lineTo(-400,400);
	ctx.lineTo(400,400);
	ctx.lineTo(400,-400);
	ctx.lineTo(-400,-400);
	
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(0,0,0,0)"
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		
		// Draw y axis
		ctx.moveTo(0,-400);
		ctx.lineTo(0,400);
		
		// Draw X axis
		ctx.moveTo(400,0);
		ctx.lineTo(-400,0);
	
		// Set line attributes
		ctx.lineWidth = 7;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "black";
		
		// Draw it
		ctx.stroke();

	}

	// Return value indicating successful hittest
	return this.isClicked;
}
