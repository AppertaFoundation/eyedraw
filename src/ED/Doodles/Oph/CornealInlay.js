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
 * Lasik Flap
 *
 * @class CornealInlay
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealInlay = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealInlay";
	
	// Other parameters
	this.type = 'Type 1';
	
	// Saved parameters
	this.savedParameterArray = ['scaleX', 'scaleY', 'rotation', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};
		
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealInlay.prototype = new ED.Doodle;
ED.CornealInlay.prototype.constructor = ED.CornealInlay;
ED.CornealInlay.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealInlay.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.75, +1.00);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.75, +1.00);
	
	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: ['Type 1', 'Type 2'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.CornealInlay.prototype.setParameterDefaults = function() {
	//this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealInlay.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealInlay.superclass.draw.call(this, _point);

	// CornealInlay raidius
	var ro = 200;
	var ri = 100;

	// Calculate parameters for arc
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Arcs
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
	ctx.arc(0, 0, ri, arcStart, arcEnd, false);

	// Fill details
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(155,155,155,0.8)";
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealInlay.prototype.description = function() {
	var	returnString = "Corneal inlay " +  this.type;

	return returnString;
}
