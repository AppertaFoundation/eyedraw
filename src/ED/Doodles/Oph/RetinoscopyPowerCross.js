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
 * @class RetinoscopyPowerCross
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RetinoscopyPowerCross = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RetinoscopyPowerCross";

	this.workingDistance = 0.5;
	this.angle1 = 180;
	this.angle2 = 90;
	this.powerSign1 = "+";
	this.powerSign2 = "+";
	this.powerInt1 = 0;
	this.powerInt2 = 0;
	this.powerDp1 = ".00";
	this.powerDp2 = ".00";
	
	// Saved parameters
	this.savedParameterArray = ['rotation', 'powerSign1', 'powerSign2', 'powerInt1', 'powerInt2', 'powerDp1', 'powerDp2'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RetinoscopyPowerCross.prototype = new ED.Doodle;
ED.RetinoscopyPowerCross.prototype.constructor = ED.RetinoscopyPowerCross;
ED.RetinoscopyPowerCross.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.RetinoscopyPowerCross.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['rotation']['range'].setMinAndMax(Math.PI, 2*Math.PI);

	// Add complete validation arrays for derived parameters

	this.parameterValidationArray['workingDistance'] = {
		kind: 'derived',
		type: 'string',
		list: ['0.333','0.500','0.667','1.000','1.500'],
		animate: true
	};
	this.parameterValidationArray['angle1'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(1, 180),
		animate: true
	};
	this.parameterValidationArray['powerSign1'] = {
		kind: 'derived',
		type: 'string',
		list: ['+', '-'],
		animate: true
	};
	this.parameterValidationArray['powerInt1'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0,20),
		animate: true
	};
	this.parameterValidationArray['powerDp1'] = {
		kind: 'derived',
		type: 'string',
		list: ['.00', '.25','.50','.75'],
		animate: true
	};
	this.parameterValidationArray['angle2'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(1, 180),
		animate: true
	};
	this.parameterValidationArray['powerSign2'] = {
		kind: 'derived',
		type: 'string',
		list: ['+', '-'],
		animate: true
	};
	this.parameterValidationArray['powerInt2'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0,20),
		animate: true
	};
	this.parameterValidationArray['powerDp2'] = {
		kind: 'derived',
		type: 'string',
		list: ['.00', '.25','.50','.75'],
		animate: true
	};

}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RetinoscopyPowerCross.prototype.setParameterDefaults = function() {
	this.rotation = Math.PI;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.RetinoscopyPowerCross.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'angle1':
			returnArray['rotation'] = 2*Math.PI - parseFloat(_value*Math.PI/180);
			returnArray['angle2'] = (parseInt(_value)>90) ? parseInt(_value) - 90 : parseInt(_value) + 90;
			break;
			
		case 'rotation':
			var degAngle = Math.round(_value * 180 / Math.PI);
			returnArray['angle1'] = 360 - degAngle;
			returnArray['angle2'] = (360 - degAngle>90) ? 360 - degAngle - 90 : 360 - degAngle + 90;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RetinoscopyPowerCross.prototype.draw = function(_point) {
	
	// Axis length
	var l = 340;
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RetinoscopyPowerCross.superclass.draw.call(this, _point);
	
	// Draw invisible boundary box around axes
	ctx.moveTo(-l,-l);
	ctx.lineTo(-l,l);
	ctx.lineTo(l,l);
	ctx.lineTo(l,-l);
	ctx.lineTo(-l,-l);
	
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(0,0,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		
		// Draw y axis
		ctx.moveTo(0,-l);
		ctx.lineTo(0,l);
		
		// Draw X axis
		ctx.moveTo(l,0);
		ctx.lineTo(-l,0);
	
		// Set line attributes
		ctx.lineWidth = 7;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "black";
		
		// Draw it
		ctx.stroke();
		
		// Text labels
		ctx.save();
		ctx.rotate(-this.rotation);
		var x;
		var y;

		ctx.font="48px Arial";
		ctx.fillStyle="black";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
	
		ctx.beginPath();

		var sp = l + 70;

		// axis 1		
		x = sp * Math.cos(this.rotation);
		y = -sp*Math.sin(-this.rotation);
		ctx.fillText(this.angle1 + "\xB0",x,y);
		
		// axis 2
		x = -sp * Math.sin(this.rotation);
		y = sp * Math.cos(this.rotation);
		ctx.fillText(this.angle2 + "\xB0",x,y);
		
		// power 1
		x = -sp * Math.cos(this.rotation);
		y = sp*Math.sin(-this.rotation);
		ctx.fillText(this.powerSign1 + parseInt(this.powerInt1) + this.powerDp1,x,y);
		
		// power 2
		x = sp * Math.sin(this.rotation);
		y = -sp * Math.cos(-this.rotation);
		ctx.fillText(this.powerSign2 + parseInt(this.powerInt2) + this.powerDp2,x,y);
		
		ctx.restore();

	}

	// Return value indicating successful hittest
	return this.isClicked;
};

ED.RetinoscopyPowerCross.prototype.calcRx = function() {
	var wdCompensation = (1 / this.workingDistance).toFixed(2);

	// Calculate minus cyl form
	var power1 = parseFloat(this.powerSign1 + parseInt(this.powerInt1) + this.powerDp1);
	var power2 = parseFloat(this.powerSign2 + parseInt(this.powerInt2) + this.powerDp2);
	var pSphere = (power1 >= power2) ? (power1 - wdCompensation).toFixed(2) : (power2 - wdCompensation).toFixed(2);
	var pCyl = (Math.abs(power1 - power2) * -1).toFixed(2); // reports in minus cyl format
	var angle = (power1>=power2) ? this.angle2 : this.angle1; // as per JEM, use angle of lowest power lens

	// force to be within the range of 0-180
	if (angle > 180)
		angle -= 180;

	// correction for cylinder axis offset
	angle -= 90;

	// cannot be negative
	if (angle < 0)
		angle += 180;

	return {
		pSphere: pSphere,
		pCyl: pCyl,
		angle: angle
	};
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RetinoscopyPowerCross.prototype.description = function() {
	calcRx = this.calcRx();

	var Rx = (calcRx.pSphere >= 0 ) ? '+' + calcRx.pSphere: calcRx.pSphere;
	Rx += (calcRx.pCyl == 0) ? ' / -' : ' / ';
	Rx += calcRx.pCyl + ' x ' + calcRx.angle;
		
	return Rx;
}

