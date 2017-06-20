/**
 * OpenEyes
 * MSC
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
 * @class MetallicForeignBodyCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MetallicForeignBodyCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MetallicForeignBodyCrossSection";
	
	// Derived parameters
	this.fb = 1;
	this.h = 30;

	this.point = new ED.Point(0,0);	
	
	// Saved parameters
	this.savedParameterArray = ['originX','originY','h','fb'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MetallicForeignBodyCrossSection.prototype = new ED.Doodle;
ED.MetallicForeignBodyCrossSection.prototype.constructor = ED.MetallicForeignBodyCrossSection;
ED.MetallicForeignBodyCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MetallicForeignBodyCrossSection.prototype.setHandles = function() {
}

/**
 * Sets default properties
 */
ED.MetallicForeignBodyCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = false;
	this.isRotatable = false;
		
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(0, +108);
	
	this.parameterValidationArray['h'] = {
		kind: 'other',
		type: 'int',
		range: [0,1080],
		animate: true
	};
	
	this.parameterValidationArray['fb'] = {
		kind: 'other',
		type: 'int',
		range: [0,1],
		animate: false
	};

}

/**
 * Sets default parameters
 */
ED.MetallicForeignBodyCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 0;
	this.originY = 0;
	
	this.defineBezier();
	
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.MetallicForeignBodyCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {},
		returnValue;

	switch (_parameter) {
		case 'originY':
			// recalculate point for drawing
			this.defineBezier();
			break;
			
		case 'originX':
			// recalculate point for drawing
			this.defineBezier();
			break;
						
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MetallicForeignBodyCrossSection.prototype.draw = function(_point) {
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MetallicForeignBodyCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// calculate direction to point
	var o = new ED.Point(251,-this.originY);
	angle = o.direction() + 0.5*Math.PI;
				
	// draw ellipse
	var r = 30;
	ctx.ellipse(this.point.x, this.point.y, 0.5*this.h, this.h, angle, 0, 2*Math.PI, true);		
		
	
	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "brown";

	// Draw boundary path (also hit testing)
	if (this.fb==1) this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


ED.MetallicForeignBodyCrossSection.prototype.defineBezier = function(_point) {	
	
	var xDisplacement = this.originX;
	
	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;
	
	var tP = (this.originY + 380) / 760;
	
	var bezier = new Object;
	
	if (this.originY<0) {
		// superior bezier
		if (cornea && cornea.shape == "Keratoconus") {			
			bezier.SP = new ED.Point(-120 - this.originX, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240 - this.originX, -260 - this.originY);
			bezier.CP2 = new ED.Point(cornea.apexX - this.originX, cornea.apexY - 100 - this.originY);
			bezier.EP = new ED.Point(cornea.apexX - this.originX, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			bezier.SP = new ED.Point(-120 - this.originX, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240 - this.originX, -260 - this.originY);
			bezier.CP2 = new ED.Point(-380 - this.originX, -100 - this.originY);
			bezier.EP = new ED.Point(-380 - this.originX, 100 - this.originY);
		}
		else {			
			bezier.SP = new ED.Point(-120 - this.originX + 50, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240 - this.originX + 50, -260 - this.originY);
			bezier.CP2 = new ED.Point(-320 - this.originX + 50, -160 - this.originY);
			bezier.EP = new ED.Point(-320 - this.originX + 50, 0 - this.originY);
		}
		
		tP = tP*2;
	}
	else {
		// inferior bezier
		if (cornea && cornea.shape == "Keratoconus") {			
			bezier.SP = new ED.Point(cornea.apexX - this.originX, cornea.apexY - this.originY);
			bezier.CP1 = new ED.Point(cornea.apexX - this.originX, cornea.apexY + 100 - this.originY);
			bezier.CP2 = new ED.Point(-240 - this.originX, 260 - this.originY);
			bezier.EP = new ED.Point(-120 - this.originX, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			bezier.SP = new ED.Point(-380 - this.originX - 50, 100 - this.originY);
			bezier.CP1 = new ED.Point(-380 - this.originX - 50, 200 - this.originY);
			bezier.CP2 = new ED.Point(-240 - this.originX - 50, 360 - this.originY);
			bezier.EP = new ED.Point(-120 - this.originX - 50, 380 - this.originY);
		}
		else {			
			bezier.SP = new ED.Point(-320- this.originX + 50, -0 - this.originY);
			bezier.CP1 = new ED.Point(-320- this.originX + 50, 160 - this.originY);
			bezier.CP2 = new ED.Point(-240 - this.originX + 50, 260 - this.originY);
			bezier.EP = new ED.Point(-120 - this.originX + 50, 380 - this.originY);
		}
		
		tP = (tP-0.5) * 2
	}
	
	// get point on bezier
	this.point.x = xDisplacement + (1-tP)*(1-tP)*(1-tP)*bezier.SP.x + 3*(1-tP)*(1-tP)*tP*bezier.CP1.x + 3*(1-tP)*tP*tP*bezier.CP2.x + tP*tP*tP*bezier.EP.x;
	this.point.y = (1-tP)*(1-tP)*(1-tP)*bezier.SP.y + 3*(1-tP)*(1-tP)*tP*bezier.CP1.y + 3*(1-tP)*tP*tP*bezier.CP2.y + tP*tP*tP*bezier.EP.y;
}