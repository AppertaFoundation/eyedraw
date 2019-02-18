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
 * @class PeripheralVascularisation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PeripheralVascularisation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PeripheralVascularisation";
	
	this.ghostVessels= false;
	
	this.plane = 0;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation','ghostVessels'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'ghostVessels':'Ghost vessels',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralVascularisation.prototype = new ED.Doodle;
ED.PeripheralVascularisation.prototype.constructor = ED.PeripheralVascularisation;
ED.PeripheralVascularisation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralVascularisation.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralVascularisation.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isFilled = false;

	this.parameterValidationArray['ghostVessels'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-420, -20);
	this.parameterValidationArray['arc']['range'].setMinAndMax(5 * Math.PI / 180, 2*Math.PI);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralVascularisation.prototype.setParameterDefaults = function() {
	this.arc = 5 * Math.PI / 180;
	this.apexY = -380;
	this.setRotationWithDisplacements(0, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralVascularisation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PeripheralVascularisation.superclass.draw.call(this, _point);

	// Radius of outer boundary
	var rOuter = 952 / 2;
	var rInner = Math.abs(this.apexY);
	
	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of outer arc
	var topRightX = rOuter * Math.sin(theta);
	var topRightY = -rOuter * Math.cos(theta);
	var topLeftX = -rOuter * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	ctx.arc(0, 0, rOuter, arcStart, arcEnd, true);
	ctx.arc(0, 0, rInner, arcEnd, arcStart, false);
	ctx.lineTo(topRightX,topRightY);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var rad_to_deg = 180.0 / Math.PI;
		var deg_to_rad = Math.PI / 180.0;

		var angle = arcStart * rad_to_deg - 180;
		var depth = Math.abs(Math.round(1400 / this.apexY));
		var angle1 = 20 / Math.abs((600 / this.apexY));

		var x1 = topRightX;
		var y1 = topRightY;
		
		// calculate number of trees to fill arc
		var treeDeg = 11; // space occupied by single tree in degrees
		var n = this.arc / (treeDeg * deg_to_rad);
		
		ctx.strokeStyle = (this.ghostVessels) ? "gray" : "red";
		ctx.beginPath();
		
		// draw tree
		for (var i=0; i<n; i++) {
			var angle2 = angle;
			this.calculateTree(x1, y1, depth, angle1, angle2);
			angle -= treeDeg;

			// calculate coordinate point at new angle in outer arc for next tree
			x1 = -rOuter * Math.cos(angle * deg_to_rad);
			y1 = -rOuter * Math.sin(angle * deg_to_rad);
		}
		
		ctx.closePath();
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}


ED.PeripheralVascularisation.prototype.calculateTree = function(x1, y1, depth, angle1, angle) {
	var ctx = this.drawing.context;
	var doodle = this;

	function drawLine(x1, y1, x2, y2, _lastLine, angle){
		// 
		ctx.moveTo(x1, y1);
		if (!_lastLine) ctx.lineTo(x2, y2);
		else {
			var r = Math.abs(doodle.apexY);
			var l = Math.sqrt(x2*x2 + y2*y2)
			var x = x2 / l * r;
			var y = y2 / l * r;
			
			ctx.lineTo(x,y);
		}
	}
	function drawTree(x1, y1, angle, depth, angle1, initialAngle){
		if (depth != 0){
			var lastLine = (depth==1) ? true : false;
			var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 15);
			var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 15);
			drawLine(x1, y1, x2, y2,lastLine, initialAngle);
			drawTree(x2, y2, angle - angle1*0.2, depth - 1,angle1, initialAngle);
			drawTree(x2, y2, angle + angle1*1.5, depth - 1,angle1, initialAngle);
		}
	}

	var deg_to_rad = Math.PI / 180.0;
	
	if (depth != 0){
		var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 6);
		var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 6);
		var l=false;
		drawLine(x1, y1, x2, y2,false, angle);
		drawTree(x2, y2, angle - angle1, depth - 1,angle1*2, angle);
		drawTree(x2, y2, angle + angle1, depth - 1,angle1, angle);
 	}
 	
}
