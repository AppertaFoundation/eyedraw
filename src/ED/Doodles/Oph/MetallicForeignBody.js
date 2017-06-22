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
 * Adenoviral keratitis
 *
 * @class MetallicForeignBody
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MetallicForeignBody = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MetallicForeignBody";

	// Private parameters used in bound sideview doodle
	this.mfb = true;
	this.coats = false;
	this.rustRing = false;
	this.h = 30;
	this.fb=1;
	
	// Saved parameters
	this.savedParameterArray = ['originX','originY','scaleX', 'scaleY','mfb','coats','rustRing','h'];

	this.controlParameterArray = {
		'mfb':'Metallic foreign body',
		'rustRing':'Rust ring',
		'coats':'Coats ring'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MetallicForeignBody.prototype = new ED.Doodle;
ED.MetallicForeignBody.prototype.constructor = ED.MetallicForeignBody;
ED.MetallicForeignBody.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MetallicForeignBody.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.MetallicForeignBody.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +2.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +2.5);
	
	
	this.parameterValidationArray['mfb'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	
	this.parameterValidationArray['coats'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	
	this.parameterValidationArray['rustRing'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	
	this.parameterValidationArray['h'] = {
		kind: 'derived',
		type: 'int',
		animate: false
	};
	this.parameterValidationArray['fb'] = {
		kind: 'other',
		type: 'int',
		range: [0,1],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MetallicForeignBody.prototype.setParameterDefaults = function() {
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.MetallicForeignBody.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {},
		returnValue;

	switch (_parameter) {
		case 'coats':
			if (_value==true) {
				returnArray.rustRing = false;
				returnArray.mfb = false;
			}
			break;
			
		case 'scaleX':
			returnArray.h = Math.round(_value * 30);
			break;
			
		case 'mfb':
			if (_value == true) returnArray['fb'] = 1;
			else if (_value == false) returnArray['fb'] = 0;
			break;
						
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MetallicForeignBody.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MetallicForeignBody.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 30;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (this.mfb) {
			ctx.beginPath()
			ctx.arc(0,0,r*0.8,0,2*Math.PI,true);
			ctx.fillStyle = "brown";
			ctx.fill();
		}
		
		if (this.rustRing) {
			ctx.beginPath()
			ctx.arc(0,0,r*1.05,0,2*Math.PI,true);
			ctx.lineWidth = 8;
			ctx.strokeStyle = "brown";
			ctx.stroke();
		}
		
		if (this.coats) {
			ctx.beginPath()
			ctx.arc(0,0,r,0,2*Math.PI,true);
			ctx.lineWidth = 12;
			ctx.strokeStyle = "rgba(180,180,180,1)";
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r, -r));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
