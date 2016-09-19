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
 * Lids
 *
 * @class Lids
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Lids = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Lids";

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Lids.prototype = new ED.Doodle;
ED.Lids.prototype.constructor = ED.Lids;
ED.Lids.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lids.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Lids.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isScalable = false;
	this.isRotatable= false;
	this.isShowHighlight = false;
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-300, +300);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +300);
}

/**
 * Sets default parameters
 */
ED.Lids.prototype.setParameterDefaults = function() {
	if (this.drawing.eye != ED.eye.Right) {
		this.dir = -1;
	}
	else if (this.drawing.eye != ED.eye.Left){
		this.dir = +1;
	}
	
	// handle start position
	this.apexX = 0;
	this.apexY = 110;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lids.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Lids.superclass.draw.call(this, _point);

	// Arc radius
	var d = 250;
	
	// control point height
	var h = 160;
	
	// control point width
	var w = 90;
	
	// Pupil radius
	var rP = 100;
	
	// ... radius
	var p = 45;

	// 
	var lowerYdif = this.apexY - 110;
	var lowerXdifL = (this.apexX>0) ? this.apexX : 0;
	var lowerXdifR = (this.apexX<0) ? this.apexX : 0;
	
	// Boundary path
	ctx.beginPath();

	// invisible boundary
	ctx.moveTo(-510 * this.dir,-510);
	ctx.lineTo(-510 * this.dir,510);
	ctx.lineTo(510 * this.dir,510);
	ctx.lineTo(510 * this.dir,-510);
	ctx.lineTo(-510 * this.dir,-510);
	
// 	ctx.arc(0,0,500,2*Math.PI,0,true);
	
	ctx.moveTo(-d * this.dir,0);
	
	// Top lid
	ctx.bezierCurveTo(-rP * 0.85 * this.dir, -h, rP * 1.05 * this.dir, -h, d * this.dir, 0);
	
	// side bit...
	ctx.bezierCurveTo( d * 1.2 * this.dir, p, d * 1.3 * this.dir,p*1.4,d * this.dir,p);
	
	// Bottom lid
	ctx.bezierCurveTo(rP * 0.6 * this.dir + lowerXdifL, h + lowerYdif, -rP * 1.8 * this.dir + lowerXdifR, h * 0.8 + lowerYdif, -d * this.dir, 0);
	
// 	ctx.moveTo(-d * this.dir,0);

	// Close path
	ctx.closePath();

	// Set drawing attributes
	ctx.lineWidth = 5;
	ctx.fillStyle = "white"
	ctx.strokeStyle = "rgba(0,0,0,0)";
	ctx.shadowBlur = 15;
	ctx.shadowColor = "rgba(0,0,0,0.8)"


	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	
		// black lids outline
		ctx.beginPath();
		ctx.moveTo(-d * this.dir,0);
		ctx.bezierCurveTo(-rP * 0.85 * this.dir, -h, rP * 1.05 * this.dir, -h, d * this.dir, 0);
		ctx.bezierCurveTo(d * 1.2 * this.dir, p, d * 1.3 * this.dir, p * 1.4, d * this.dir, p);
		ctx.bezierCurveTo(rP * 0.6 * this.dir + lowerXdifL, h + lowerYdif, -rP * 1.8 * this.dir + lowerXdifR, h * 0.8 + lowerYdif, -d * this.dir, 0);
		ctx.moveTo(-d * this.dir,0);
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
		
		// eye lashes
		ctx.beginPath();
		ctx.moveTo(-d * this.dir,0);
		ctx.lineTo(-d * this.dir - p * 0.5 * this.dir,p*0.5);
		ctx.stroke();
		ctx.closePath();
		
		
		// bottom ridge
		ctx.beginPath();
		ctx.moveTo(-d * this.dir,0);
		ctx.bezierCurveTo(-rP * 1.7 * this.dir + lowerXdifR, h*0.95 + lowerYdif*1.1, rP*0.7 * this.dir + lowerXdifL, h + lowerYdif*1.1, d * this.dir, p);
	// 	ctx.strokeStyle = "gray";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
		
		// top eye crease
		ctx.beginPath();
		ctx.moveTo(-d * this.dir - p*0.5 * this.dir, 0);
		ctx.bezierCurveTo(-rP*1.2 * this.dir,-h*1.3,rP * this.dir,-h*1.4,d*this.dir+p * this.dir,p*0.1);
	// 	ctx.lineTo(d+p*1.5,p*0.5)
	// 	ctx.strokeStyle = "gray";
		ctx.lineWidth = 3;
		ctx.shadowBlur = 7;
		ctx.shadowColor = "black";
		ctx.stroke();
		ctx.closePath();
		
		// bottom crease
		
		// controles!
/*
		ctx.beginPath();
		ctx.moveTo(rP * 0.6 * this.dir + lowerXdifL, h + lowerYdif);
		ctx.arc(rP * 0.6 * this.dir + lowerXdifL, h + lowerYdif,5,2*Math.PI, 0, true);
		ctx.moveTo(rP*0.7 * this.dir + lowerXdifL, h + lowerYdif*1.1);
		ctx.arc(rP * 0.6 * this.dir + rP*0.7 * this.dir + lowerXdifL, h + lowerYdif*1.1,5,2*Math.PI, 0, true);
		
		ctx.stroke();
*/
		
	// 	ctx.bezierCurveTo(rP * 0.6 * this.dir + lowerXdifL, h + lowerYdif, -rP * 1.8 * this.dir + lowerXdifR, h * 0.8 + lowerYdif, -d * this.dir, 0);
	
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
