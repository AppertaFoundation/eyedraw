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
 * @class AntSegSteepAxis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AntSegSteepAxis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AntSegSteepAxis";

	// Parameters from biometry
	this.axis = 180; // steep axis
	this.flatK = 999.9;
	this.steepK = 999.9;
	
	// Calculated parameter
	this.deltaK = 0;
	
	// Saved parameters
	this.savedParameterArray = ['axis','flatK','steepK','deltaK'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.AntSegSteepAxis.prototype = new ED.Doodle;
ED.AntSegSteepAxis.prototype.constructor = ED.AntSegSteepAxis;
ED.AntSegSteepAxis.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.AntSegSteepAxis.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.addAtBack = true;
	this.isUnique = true;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray.axis = {
		kind: 'derived',
		type: 'mod',
		range: new ED.Range(0, 180),
		clock: 'bottom',
		animate: true
	};
	this.parameterValidationArray.flatK = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(0, 1000),
		precision: 2,
		animate: true
	};
	this.parameterValidationArray.steepK = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(0, 1000),
		precision: 2,
		animate: true
	};

};

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSegSteepAxis.prototype.setParameterDefaults = function() {
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSegSteepAxis.prototype.dependentParameterValues = function(_parameter, _value) {
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSegSteepAxis.prototype.draw = function(_point) {
	
	// Axis length
	var l = 499;
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AntSegSteepAxis.superclass.draw.call(this, _point);
	
	// Draw invisible boundary box around canvas
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
	if (this.drawFunctionMode === ED.drawFunctionMode.Draw) {
		// Add background colour (black).
		ctx.beginPath();
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(-(this.drawing.canvas.width / 2), -(this.drawing.canvas.height / 2), this.drawing.canvas.width, this.drawing.canvas.height);

		ctx.beginPath();

		// Set style defaults
		ctx.font="bold 120px Arial";
		ctx.fillStyle="white";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.lineWidth = 40;
		ctx.strokeStyle = "white";
		
		// Number of tick marks
		var n = 4;
		
		// Distance of tick marks from origin
		var r = 340;
		
		// Length of single tick mark
		var d = 35;
		
		var point1 = new ED.Point(0,0);
		var point2 = new ED.Point(0,0);
		var point3 = new ED.Point(0,0);
		for (var i=0; i<n; i++) {
			var angleRad = 2*Math.PI / n * i;
			var angleDeg = angleRad * 180 / Math.PI;
			var textOffset = 70;

			switch (angleDeg) {
				case 0.0:
					ctx.textAlign = 'left';
					textOffset = 10;
					break;
				case 90.0:
					ctx.textAlign = 'center';
					textOffset = 50;
					break;
				case 180.0:
					ctx.textAlign = 'right';
					textOffset = 10;
					break;
				case 270.0:
					ctx.textAlign = 'center';
					break;
			}
			point1.setWithPolars(r, 2 * Math.PI - angleRad + 0.5*Math.PI);
			point2.setWithPolars(r+d, 2 * Math.PI - angleRad + 0.5*Math.PI);
			point3.setWithPolars(r+d+textOffset,2 * Math.PI - angleRad + 0.5*Math.PI);

			ctx.moveTo(point1.x, point1.y);
			ctx.lineTo(point2.x, point2.y);
			ctx.fillText(angleDeg,point3.x,point3.y);
		}

		// draw tick marks and label with angle in degrees
		ctx.stroke();

		// Draw outer ring.
		ctx.beginPath();
		ctx.fillStyle="white";
		ctx.lineWidth = 80;
		ctx.arc(0, 0, r-d, 0, 2*Math.PI);
		ctx.stroke();
		
		// Indicate Infero-nasal corner of canvas
		//// ** TO DO ** confirm will always be in corner of canvas - might need to use this.drawing.canvas.width*0.5 etc
		ctx.beginPath();
		
		// Fill triangle in appropriate corner and colour for eye
		ctx.fillStyle = (this.drawing.eye == ED.eye.Right) ? "green" : "red";
		var eyeToggle = (this.drawing.eye == ED.eye.Right) ? +1 : -1;
		ctx.moveTo(110 * eyeToggle, -950);
		ctx.lineTo(950 * eyeToggle, -950);
		ctx.lineTo(950 * eyeToggle, -110);
		ctx.fill();
		
		// Label "R" or "L" eye
		ctx.font="bold 132pt Arial";
		ctx.lineWidth = 3;
		ctx.strokeStyle = ctx.fillStyle;
		var eyeText = (this.drawing.eye == ED.eye.Right) ? "R" : "L";
		ctx.fillText(eyeText,-800 * eyeToggle, -400);
		
		// Label "SN" text in appropriate corner for eye
		ctx.font="bold 120px Arial";
		ctx.fillStyle="white";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "white";
		ctx.fillText("SN", 800 * eyeToggle, -400);

		// Convert axis from degrees to radians
		var axisRad = this.axis / 180 * Math.PI;

		// Draw steep axis
		ctx.beginPath();
		ctx.strokeStyle = (this.drawing.eye == ED.eye.Right) ? "green" : "red";
		ctx.lineWidth = 40;

		ctx.save();
		ctx.rotate(-axisRad);

		var w = 380;
		ctx.moveTo(-w, 0);
		ctx.lineTo(w, 0);
		ctx.stroke();
		ctx.restore();

		ctx.save();

		// Central circle
		ctx.beginPath();
		ctx.fillStyle="white";
		//ctx.lineWidth = 50;
		ctx.arc(0, 0, (r / 1.8), 0, 2*Math.PI);
		ctx.fill();

		// Axis value
		ctx.beginPath();

		ctx.font="bold 128pt Arial";
		ctx.fillStyle="black";
		ctx.textAlign="center";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "black";
		ctx.fillText(this.axis, -8, 8);

		ctx.restore();
		
		// Write delta K value, if derived from biometry (ie. not default values)
		if (this.flatK !== 999.9 && this.steepK !== 999.9) {
			this.calculateDeltaK();
			ctx.font="bold 110pt Arial";
			ctx.fillStyle = 'white';
			ctx.fillText(this.deltaK + " D",-650,400);
		}
	}

	// Return value indicating successful hittest
	return this.isClicked;
};


ED.AntSegSteepAxis.prototype.calculateDeltaK = function(_point) {
	this.deltaK = (this.steepK - this.flatK).toFixed(2);
};
