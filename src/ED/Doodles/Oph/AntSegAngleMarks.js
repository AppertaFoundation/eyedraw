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
 * @class AntSegAngleMarks
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AntSegAngleMarks = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AntSegAngleMarks";

	
	// Saved parameters
	this.savedParameterArray = [];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AntSegAngleMarks.prototype = new ED.Doodle;
ED.AntSegAngleMarks.prototype.constructor = ED.AntSegAngleMarks;
ED.AntSegAngleMarks.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.AntSegAngleMarks.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.addAtBack = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSegAngleMarks.prototype.setParameterDefaults = function() {
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSegAngleMarks.prototype.dependentParameterValues = function(_parameter, _value) {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSegAngleMarks.prototype.draw = function(_point) {
	
	// Axis length
	var l = 499;
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AntSegAngleMarks.superclass.draw.call(this, _point);
	
	// Draw invisible boundary box around canvas
	ctx.moveTo(-l,-l);
	ctx.lineTo(-l,l);
	ctx.lineTo(l,l);
	ctx.lineTo(l,-l);
	ctx.lineTo(-l,-l);
	
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(0,0,0,0)"
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		
		// Set style defaults
		ctx.font="36px Arial";
		ctx.fillStyle="black";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "black";
		
		// Number of tick marks
		var n = 8;
		
		// Distance of tick marks from origin
		var r = 400;
		
		// Length of single tick mark
		var d = 25;
		
		var point1 = new ED.Point(0,0);
		var point2 = new ED.Point(0,0);
		var point3 = new ED.Point(0,0);
		for (var i=0; i<n; i++) {
			var angleRad = 2*Math.PI / n * i;
			var angleDeg = angleRad * 180 / Math.PI;
			
			point1.setWithPolars(r, 2 * Math.PI - angleRad + 0.5*Math.PI);
			point2.setWithPolars(r+d, 2 * Math.PI - angleRad + 0.5*Math.PI);
			point3.setWithPolars(r+d*2.5,2 * Math.PI - angleRad + 0.5*Math.PI);
			
			ctx.moveTo(point1.x, point1.y);
			ctx.lineTo(point2.x, point2.y);
			ctx.fillText(angleDeg + "\xB0",point3.x,point3.y);
		}
		
/*
		ctx.moveTo(-500,0);
		ctx.lineTo(500,0);
*/
		
		ctx.stroke();
		
		
		
		// If toric lens exists, draw flat axis
		var toricLens = this.drawing.lastDoodleOfClass('ToricPCIOL');
		if (toricLens) {
			var phi = 0.7 * Math.PI / 4;
			var axisRotation = toricLens.rotation + phi - 0.5077 * Math.PI;
			
			ctx.beginPath();
			ctx.save();
			ctx.rotate(axisRotation);
			
			ctx.strokeStyle = "blue";
			ctx.lineWidth = 8;
			
			var w = 420;
			var z = Math.round(2 * w / (d*2));
			for (var j=0; j<z; j++) {
				ctx.moveTo(-w + j*d*2, 0);
				ctx.lineTo(-w + j*d*2 + d, 0);
			};
/*
			ctx.moveTo(-w, 0);
			ctx.lineTo(w,0);
*/
			ctx.stroke();
			ctx.restore();
		}		
		
	}

	// Return value indicating successful hittest
	return this.isClicked;
}


