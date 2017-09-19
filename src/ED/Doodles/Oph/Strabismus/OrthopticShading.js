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
 * @class OrthopticShading
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OrthopticShading = function(_drawing, _parameterJSON)
{
	
	// Set classname
	this.className = "OrthopticShading";
	
	// parameters for underaction drop down calculations
	this.uR = false;
	this.cR = false;
	this.dR = false;
	this.rL = false;
	this.cL = false;
	this.dL = false;

	this.savedParameterArray = ['originX', 'originY', 'rotation', 'apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OrthopticShading.prototype = new ED.Doodle;
ED.OrthopticShading.prototype.constructor = ED.OrthopticShading;
ED.OrthopticShading.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OrthopticShading.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
	this.handleArray[3].isRotatable = true;
}

/**
 * Sets default dragging attributes
 */
ED.OrthopticShading.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false; // MSC BC edit
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = true;
	
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-360, +360);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-360, -3);
}

/**
 * Sets default parameters
 */
ED.OrthopticShading.prototype.setParameterDefaults = function()
{
	this.apexX = 350;
	this.apexY = -100;

	this.setRotationWithDisplacements(0, 90.5);

//     this.originY = -200;
}



/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OrthopticShading.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OrthopticShading.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Rectangular area
	var w = this.apexX - -350;
	var h = this.apexY - -350;
	ctx.rect(-350, -350, w, h);
    
	// Close path
	ctx.closePath();
    
    // create pattern
	ctx.fillStyle = "rgba(190, 190, 190, 0.55)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-350, this.apexY);
        var dash = 42;
        var gap = 20;
        var length = 0;
        while (length < w-40)
        {
            length += dash;
            ctx.lineTo(-350 + length, this.apexY);
            length += gap;            
            ctx.moveTo(-350 + length, this.apexY);
        }
        ctx.lineTo(this.apexX, this.apexY);
        
        // Draw line
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
		this.calculateUnderActions();
		
	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * 
 */
ED.OrthopticShading.prototype.calculateUnderActions = function() {
	var x;
	var y;
	var d;
	var intersectionPoint;
	
	// shading boundary line
	var sp = this.transform.transformPoint(new ED.Point(-350, this.apexY));
	var ep = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	var dy1 = ep.y - sp.y;
	var dx1 = ep.x - sp.x;
	var m1 = dy1/dx1;	
	var c1 = sp.y - m1*sp.x;
	
	if (dx1 == 0) {
		m1 = 0;
		c1 = 70;
	}
	
	
	// in canvas plane
	var origin = new ED.Point(100,100);

	var uR = new ED.Point(30,30);
	var dL = new ED.Point(170,170);
	var m2 = 1;
	// if lines not parallel
	if (m1 !== m2) {
		// find intersection point: 0 = m1*x + c1 - x
		x = -c1 / (m1-1);
		y = x;
		intersectionPoint = new ED.Point(x,y);
		
		// up right
		d = uR.distanceTo(new ED.Point(x,y));
		if (y>=30 && y<=100 && (sp.x<=100 || ep.x<=100) && (sp.y<=100 || ep.y<=100)) {
			if (d>79.192) this.uR = "-4";
			else if (d>59.394) this.uR = "-3";
			else if (d>39.596) this.uR = "-2";
			else if (d>19.798) this.uR = "-1";
/*
			if (d>98.99) this.uR = "-4";
			else if (d>74.2425) this.uR = "-3";
			else if (d>49.495) this.uR = "-2";
			else if (d>24.7475) this.uR = "-1";
*/
			else this.uR = "-0.5";			
		}
// 		else if (this.rotation < Math.PI && y>100) this.uR = "<-4";
		else this.uR = false;
		
		// down left
		d = dL.distanceTo(new ED.Point(x,y));
		if (y<=170 && y>=100 && (sp.x>=100 || ep.x>=100) && (sp.y>=100 || ep.y>=100)) {
			if (d>79.192) this.dL = "-4";
			else if (d>59.394) this.dL = "-3";
			else if (d>39.596) this.dL = "-2";
			else if (d>19.798) this.dL = "-1";
			else this.dL = "-0.5";			
		}
		else this.dL = false;
	}
	
	/// y=100
	var cR = new ED.Point(30,100);
	var cL = new ED.Point(170,100);
	var m3 = 0;
	if (m1 !== m3 || dx1 == 0) {
		// find intersection point: x = (y-c)/m
		y = 100;
		x = (y-c1) / m1;
		intersectionPoint = new ED.Point(x,y);
		
		// centre right
		d = cR.distanceTo(new ED.Point(x,y));
		if (x>=30 && x<=100) {
			if (d>56) this.cR = "-4";
			else if (d>42) this.cR = "-3";
			else if (d>28) this.cR = "-2";
			else if (d>14) this.cR = "-1";
			else this.cR = "-0.5";			
		}
		else this.cR = false;
		
		// centre left
		d = cL.distanceTo(new ED.Point(x,y));
		if (x<=170 && x>=100) {
			if (d>56) this.cL = "-4";
			else if (d>42) this.cL = "-3";
			else if (d>28) this.cL = "-2";
			else if (d>14) this.cL = "-1";
			else this.cL = "-0.5";			
		}
		else this.cL = false;
	}
	
	var dR = new ED.Point(30,170);
	var uL = new ED.Point(170,30);
	var m4 = -1;
	if (m1 !== m4) {
		// find intersection point: (200-c1)/(m1+1) = x
		x = (200-c1) / (m1+1);
		y = -x + 200;
		intersectionPoint = new ED.Point(x,y);
		
		// up left
		d = uL.distanceTo(new ED.Point(x,y));
		if (y>=30 /* && y<=100 */ && (sp.x>=100 || ep.x>=100) && (sp.y<=100 || ep.y<=100)) {
			if (d>79.192) this.uL = "-4";
			else if (d>59.394) this.uL = "-3";
			else if (d>39.596) this.uL = "-2";
			else if (d>19.798) this.uL = "-1";
			else this.uL = "-0.5";			
		}
		else this.uL = false;


		// down right
		d = dR.distanceTo(new ED.Point(x,y));
		if (y<=170 && y>=100 && (sp.x<=100 || ep.x<=100) && (sp.y>=100 || ep.y>=100)) {
			if (d>79.192) this.dR = "-4";
			else if (d>59.394) this.dR = "-3";
			else if (d>39.596) this.dR = "-2";
			else if (d>19.798) this.dR = "-1";
			else this.dR = "-0.5";			
		}
		else this.dR = false;
	}

}
