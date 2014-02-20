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
 * Anterior segment with adjustable sized pupil
 *
 * @class AntSeg
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AntSeg = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AntSeg";

	// Derived parameters
	this.pupilSize = 'Large';
	
	// Other parameters
	this.pxe = false;
	this.coloboma = false;
	this.colour = 'Blue';
	this.ectropion = false;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'rotation', 'pxe', 'coloboma', 'colour', 'ectropion'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'pupilSize':'Pupil size', 'pxe':'PXE', 'coloboma':'Coloboma', 'colour':'Colour', 'ectropion':'Ectropion uveae'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AntSeg.prototype = new ED.Doodle;
ED.AntSeg.prototype.constructor = ED.AntSeg;
ED.AntSeg.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSeg.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AntSeg.prototype.setPropertyDefaults = function() {
	this.version = 1.1;
	this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isUnique = true;

	// Update component of validation array for simple parameters (enable 2D control by adding -50,+50 apexX range
	this.parameterValidationArray['apexX']['range'].setMinAndMax(0, 0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['pupilSize'] = {
		kind: 'derived',
		type: 'string',
		list: ['Large', 'Medium', 'Small'],
		animate: false
	};
	this.parameterValidationArray['pxe'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['coloboma'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['colour'] = {
		kind: 'derived',
		type: 'string',
		list: ['Blue', 'Brown', 'Gray', 'Green'],
		animate: false
	};
	this.parameterValidationArray['ectropion'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSeg.prototype.setParameterDefaults = function() {
	this.setParameterFromString('pupilSize', 'Large');
	this.setParameterFromString('pxe', 'false');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSeg.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -200) returnArray['pupilSize'] = 'Large';
			else if (_value < -100) returnArray['pupilSize'] = 'Medium';
			else returnArray['pupilSize'] = 'Small';
			break;

		case 'pupilSize':
			switch (_value) {
				case 'Large':
					if (this.apexY < -200) returnValue = this.apexY;
					else returnArray['apexY'] = -260;
					break;
				case 'Medium':
					if (this.apexY >= -200 && this.apexY < -100) returnValue = this.apexY;
					else returnArray['apexY'] = -200;
					break;
				case 'Small':
					if (this.apexY >= -100) returnValue = this.apexY;
					else returnArray['apexY'] = -100;
					break;
			}
			break;
		case 'coloboma':
			this.isRotatable = _value == "true"?true:false;
			this.rotation = _value == "true"?this.rotation:0;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSeg.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AntSeg.superclass.draw.call(this, _point);

	// Radius of limbus
	var ro = 380;
	var ri = -this.apexY;

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
					
	if (!this.coloboma) {
		// Move to inner circle
		ctx.moveTo(ri, 0);

		// Arc round edge of pupil
		ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	}
	else {
		// Angular size of coloboma
		var colAngle = (Math.PI/3) * 280/ri;
		var colAngleOuter = Math.PI/6;
		var rimSize = 20;
		
		var p1 = new ED.Point(0,0);
		p1.setWithPolars(ri, Math.PI + colAngle/2);
		var p2 = new ED.Point(0,0);
		p2.setWithPolars(ro - rimSize, Math.PI + colAngleOuter/2);
		
		// Coloboma
		ctx.moveTo(-p2.x, p2.y);
		ctx.arc(0, 0, ro - rimSize, Math.PI/2 - colAngleOuter/2, Math.PI/2 + colAngleOuter/2, false);

		// Arc round edge of pupil
		ctx.arc(0, 0, ri, Math.PI/2 + colAngle/2, Math.PI/2 - colAngle/2, false);
		
		// Back to start
		ctx.lineTo(-p2.x, p2.y);
	}

	// Edge attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	
	// Iris colour
	switch (this.colour) {
		case 'Blue':
			ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
			break;
		case 'Brown':
			ctx.fillStyle = "rgba(172, 100, 55, 0.5)";
			break;
		case 'Gray':
			ctx.fillStyle = "rgba(125, 132, 116, 0.5)";
			break;
		case 'Green':
			ctx.fillStyle = "rgba(114, 172, 62, 0.5)";
			break;			
	}

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Pseudo exfoliation
		if (this.pxe) {
			ctx.lineWidth = 8;
			ctx.strokeStyle = "darkgray";

			var rl = ri * 0.8;
			var rp = ri * 1.05;
			var segments = 36;
			var i;
			var phi = Math.PI * 2 / segments;

			// Loop around alternating segments
			for (i = 0; i < segments; i++) {
				// PXE on lens
				ctx.beginPath();
				ctx.arc(0, 0, rl, i * phi, i * phi + phi / 2, false);
				ctx.stroke();

				// PXE on pupil
				ctx.beginPath();
				ctx.arc(0, 0, rp, i * phi, i * phi + phi / 2, false);
				ctx.stroke();
			}
		}
		
		// Ectropion uveae
		if (this.ectropion) {
			ctx.beginPath();
			if (this.coloboma) {
				ctx.arc(0, 0, ri, Math.PI/2 - colAngle/2, Math.PI/2 + colAngle/2, true);
			}
			else {
				ctx.arc(0, 0, ri + 16, arcStart, arcEnd, true);
			}
			ctx.lineWidth = 32;
			ctx.lineCap = "round";
			ctx.strokeStyle = "brown";
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.AntSeg.prototype.description = function() {
	var returnValue = "";
	
	// Pupil size and coloboma
	if (this.pupilSize != 'Large') returnValue += this.pupilSize.toLowerCase() + " pupil, ";
	
	// Coloboma
	if (this.coloboma) returnValue += "coloboma at " + this.clockHour(6) + " o'clock, ";	
	
	// Ectopion
	if (this.ectropion) returnValue += "ectropion uvaee, ";

	// PXE
	if (this.pxe) returnValue += "pseudoexfoliation, ";
	
	// Remove final comma and space and capitalise first letter
	returnValue = returnValue.replace(/, +$/, '');
	returnValue = returnValue.charAt(0).toUpperCase() + returnValue.slice(1);
	
	return returnValue;
}
