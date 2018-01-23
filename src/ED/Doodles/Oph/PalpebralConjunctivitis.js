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
 *
 *
 * @class PalpebralConjunctivitis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PalpebralConjunctivitis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PalpebralConjunctivitis";
	
	// Other parameters
	this.type = 'Papillary';
	this.hyperaemia = "+";
	
	// Saved parameters
	this.savedParameterArray = ['type', 'hyperaemia'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'type':'Type', 'hyperaemia':'Hyperaemia'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PalpebralConjunctivitis.prototype = new ED.Doodle;
ED.PalpebralConjunctivitis.prototype.constructor = ED.PalpebralConjunctivitis;
ED.PalpebralConjunctivitis.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PalpebralConjunctivitis.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.isMoveable = false;
	this.isRotatable = false;
	this.addAtBack = true;
	
	// Validation arrays for other parameters
	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: ['Papillary', 'Follicular'],
		animate: false
	};
	this.parameterValidationArray['hyperaemia'] = {
		kind: 'other',
		type: 'string',
		list: ['+','++','+++'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PalpebralConjunctivitis.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PalpebralConjunctivitis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PalpebralConjunctivitis.superclass.draw.call(this, _point);
	
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
	var ptrn = ctx.createPattern(this.drawing.imageArray['NewVesselPattern'], 'repeat')
	ctx.fillStyle = ptrn;
	ctx.strokeStyle = "pink";

	if (this.hyperaemia == "+") ctx.filter = "opacity(10%)";
	else if (this.hyperaemia == "++") ctx.filter = "opacity(30%)";
	else if (this.hyperaemia == "+++") ctx.filter = "opacity(50%)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	ctx.filter = "none";

	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PalpebralConjunctivitis.prototype.description = function() {
	var returnValue = this.type + " conjunctivitis";
	
	returnValue += " with " + this.hyperaemia + " hyperaemia";

	return returnValue;
}

