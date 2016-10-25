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
 * PCIOL Cross Section ***TODO***
 *
 * @class PCIOLCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PCIOLCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PCIOLCrossSection";
	
	// Other parameters
	this.fixation = 'In-the-bag';
	this.fx = 1;
	
	// Saved parameters
	this.savedParameterArray = ['fixation', 'fx'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'fixation':'Fixation'};


	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PCIOLCrossSection.prototype = new ED.Doodle;
ED.PCIOLCrossSection.prototype.constructor = ED.PCIOLCrossSection;
ED.PCIOLCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PCIOLCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	// Validation arrays for other parameters
	this.parameterValidationArray['fixation'] = {
		kind: 'derived',
		type: 'string',
		list: ['In-the-bag', 'Ciliary sulcus'],
		animate: true
	};
	this.parameterValidationArray['fx'] = {
		kind: 'other',
		type: 'int',
		range: [1, 2],
		animate: false
	};
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(+44, +44);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-140, +140);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PCIOLCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 44;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PCIOLCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'fx':
			if (_value === 2) returnArray['fixation'] = 'Ciliary sulcus';
			else returnArray['fixation'] = 'In-the-bag';
			break;

		case 'fixation':
			switch (_value) {
				case 'In-the-bag':
					returnArray['fx'] = 1;
					break;
				case 'Ciliary sulcus':
					returnArray['fx'] = 2;
					break;
			}
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PCIOLCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PCIOLCrossSection.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;

	// Arbitrary radius of curvature
	var r = 450;

	// Displacement of lens from centre
	var ld = 100;

	// Angle of arc
	var theta = Math.asin(h / r);

	// X coordinate of centre of circle
	var x = r * Math.cos(theta);

	// Measurements of nucleus
	var rn = r - 60;

	// Calculate nucleus angles
	var phi = Math.acos(x / rn);

	// Draw lens
	ctx.beginPath();
	
	if (this.fixation == 'In-the-bag') {
		ctx.ellipse(100, 0, 160, 20, 0.5 * Math.PI, 0, 2 * Math.PI);
	}
	else {
		ctx.ellipse(50, 0, 160, 25, 0.5 * Math.PI, 0, 2 * Math.PI);
	}


	// Set line attributes
	ctx.lineWidth = 5;
	ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
	ctx.strokeStyle = "#898989";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// Lens bag
		ctx.beginPath();
		ctx.arc(44 + ld - x - this.originX, 0 - this.originY, r, theta, -theta, true);
		ctx.arc(44 + ld + x - this.originX, 0 - this.originY, r, Math.PI + theta, Math.PI + 0.75*theta, true);
		ctx.moveTo(44 + ld - this.originX, 240 - this.originY);
		ctx.arc(44 + ld + x - this.originX, 0 - this.originY, r, Math.PI - theta, Math.PI - 0.75*theta, false);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 3;
		ctx.stroke();

		// Loops
		ctx.beginPath();
		if (this.fixation == 'In-the-bag') {	
/*
			ctx.arc(30 + 115 - this.originX, -210 - this.originY, 10, 2.2*Math.PI, 1*Math.PI, true);
			ctx.lineTo(85,-125);
			ctx.moveTo(120 - this.originX, 210 - this.originY);
			ctx.arc(25 + 115 - this.originX, 210 - this.originY, 13, 0, 1*Math.PI, false);
			ctx.moveTo(100 - this.originX, 210 - this.originY);
			ctx.lineTo(44 + 65,125);	
*/	
			ctx.ellipse(144 - this.originX, 0 - this.originY, 227, 20, 0.5 * Math.PI, 0.5 * Math.PI, 1.2 * Math.PI);
			ctx.moveTo(164 - this.originX,0 - this.originY);
			ctx.ellipse(144 - this.originX, 0 - this.originY, 227, 20, 0.5 * Math.PI, 1.5 * Math.PI, 0.2 * Math.PI);
		}
		else {
			ctx.arc(115 - this.originX, -350 - this.originY, 15, 0*Math.PI, 1*Math.PI, true);
			ctx.lineTo(35,-125);
			ctx.moveTo(120 - this.originX, 350 - this.originY);
			ctx.arc(115 - this.originX, 350 - this.originY, 15, 0, 1*Math.PI, false);
			ctx.moveTo(100 - this.originX, 350 - this.originY);
			ctx.lineTo(65,125);
		}
		ctx.strokeStyle = "#898989";
		ctx.lineWidth = 5;
		ctx.stroke();

		
		// Zonules
		ctx.beginPath();

		// Top zonules
		ctx.moveTo(44 - this.originX + 80, - this.originY - 349);
		ctx.lineTo(44 + 80 - this.originX, -207 - this.originY);
		ctx.moveTo(44 - this.originX + 80, - this.originY - 349);
		ctx.lineTo(44 + 120 - this.originX, -207 - this.originY);
		ctx.moveTo(44  - this.originX + 120, - this.originY - 349);
		ctx.lineTo(44 + 80 - this.originX, -207 - this.originY);
		ctx.moveTo(44 - this.originX + 120, - this.originY - 349);
		ctx.lineTo(44 + 120 - this.originX, -207 - this.originY);

		// Bottom zonules
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(44 + 80 - this.originX, 207 - this.originY);
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(44 + 120 - this.originX, 207 - this.originY);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(44 + 80 - this.originX, 207 - this.originY);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(44 + 120 - this.originX, 207 - this.originY);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
