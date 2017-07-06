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
 * @class TarsalPlates
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TarsalPlates = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TarsalPlates";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TarsalPlates.prototype = new ED.Doodle;
ED.TarsalPlates.prototype.constructor = ED.TarsalPlates;
ED.TarsalPlates.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TarsalPlates.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.isSelectable = false;
	this.isDeletable = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TarsalPlates.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TarsalPlates.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TarsalPlates.superclass.draw.call(this, _point);
	
	// Radius of arc
	var r = 480;
	
	// Height of arc
	var h = 700;
	
	// Start angle of arc
	var o = r - h;
	var theta = Math.asin(o/r);
	
	// Radius of plate
	var l = r * Math.cos(theta);
	
	// Draw superior plate
	ctx.moveTo(-l,o*0.5);
	ctx.arc(0,-o*0.5,r,theta,Math.PI-theta,true);
	ctx.lineTo(-l,o*0.5);
	
	// Draw inferior plate
	ctx.moveTo(-l,-o*0.5);
	ctx.arc(0,o*0.5,r,-theta,Math.PI+theta,false);
	ctx.lineTo(-l,-o*0.5);

	// Draw it
	ctx.stroke();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
