/**
 * @fileOverview Contains doodle subclasses for surgical retina
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.93
 * @description A description
 *
 * Modification date: 23rd October 2011
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * An example to be used as a template
 *
 * @class Square
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 * @constructor
 */
ED.Square = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Square";
    
    // Lable width and height
    this.lableWidth = 0;
    this.lableHeight = 80;
    
    // Lable font
    this.lableFont = "50px sans-serif";
    
    // Horizontal padding between lable and boundary path
    this.padding = 10;
}

/**
 * Sets superclass and constructor
 */
ED.Square.prototype = new ED.Doodle;
ED.Square.prototype.constructor = ED.Square;
ED.Square.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Square.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, true);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Square.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfScale = new ED.Range(+1, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-400, +100);
    this.snapToGrid = true;
}

/**
 * Sets default parameters
 */
ED.Square.prototype.setParameterDefaults = function()
{
	this.originY = -300;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Square.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Square.superclass.draw.call(this, _point);
    
    // Set font
    ctx.font = this.lableFont;
    
    // set lable text
    this.lableText = "Hello";
    
    // Calculate pixel width of text with padding
    this.lableWidth = ctx.measureText(this.lableText).width + this.padding * 2;
	
	// Boundary path
	ctx.beginPath();
	
	// Square
	ctx.rect(-50, -50, 100, 100);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.fillStyle = "green";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		ctx.beginPath();
		ctx.rect(-40, -20, 20, 20);
		ctx.lineWidth = 2;
		ctx.fillStyle = "red";
		ctx.strokeStyle = "blue";
		ctx.fill();
		ctx.stroke();
        
        // Draw text
        ctx.fillText(this.lableText, -this.lableWidth/2 + this.padding, this.lableHeight/6);
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(-50, 50));
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(-50, -50));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(50, -50));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(50, 50));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}






/**
 * Dialysis
 *
 * @class Dialysis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Dialysis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Dialysis";
}

/**
 * Sets superclass and constructor
 */
ED.Dialysis.prototype = new ED.Doodle;
ED.Dialysis.prototype.constructor = ED.Dialysis;
ED.Dialysis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Dialysis.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Dialysis.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+1, +1);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*1.5);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-450, -250);
}

/**
 * Sets default parameters
 */
ED.Dialysis.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;
    // Default to inferoremporal quadrant
    this.rotation = (Math.PI + 0.4 * (this.drawing.eye == ED.eye.Right?1:-1));
    this.apexY = -350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Dialysis.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);
	
	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952/2;
    
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
	
	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
	
	// Boundary path
	ctx.beginPath();
	
	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
	
	// Connect across the bottom via the apex point
	var bp = +0.6;
    
	// Curve back to start via apex point
    ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
    ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	
	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Dialysis.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.arc < Math.PI/4) returnString = "Small ";
    else returnString = "Large ";
    
    // U tear
	returnString += "dialysis ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Dialysis.prototype.snomedCode = function()
{
	return 232003005;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Dialysis.prototype.diagnosticHierarchy = function()
{
	return 4;
}

/**
 * Giant retinal tear
 *
 * @class GRT
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.GRT = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "GRT";
}

/**
 * Sets superclass and constructor
 */
ED.GRT.prototype = new ED.Doodle;
ED.GRT.prototype.constructor = ED.GRT;
ED.GRT.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.GRT.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.GRT.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+1, +1);
	this.rangeOfArc = new ED.Range(Math.PI/2, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-450, -250);
}

/**
 * Sets default parameters
 */
ED.GRT.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.GRT.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);
	
	// Fit outer curve just inside ora (ro = outer radius, rt = tear radius, ri = operculum (inner) radius)
	var ro = 952/2;
    var ri = -this.apexY;
    var rt = ri + (ro - ri)/2;
    
    // Calculate parameters for arcs. Theta is outer arc, phi is base of tear
    var theta = this.arc/2;
    var arcStart = - Math.PI/2 + theta;
    var arcEnd = - Math.PI/2 - theta;
    var phi = this.arc/2.3;
    var tearStart = - Math.PI/2 + phi;
    var tearEnd = - Math.PI/2 - phi;
    
	// Coordinates of corners of arc
	var topRightX = ro * Math.sin(theta);
	var topRightY = - ro * Math.cos(theta);
	var topLeftX = - ro * Math.sin(theta);
	var topLeftY = topRightY;
    var middleRightX = rt * Math.sin(phi);
    var middleRightY = - rt * Math.cos(phi);
    var middleLeftX = - middleRightX;
    var middleLeftY = middleRightY;
    var bottomRightX = ri * Math.sin(theta);
    var bottomRightY = - ri * Math.cos(theta);
    var bottomLeftX = -bottomRightX;
    var bottomLeftY = bottomRightY;
	
	// Boundary path
	ctx.beginPath();
	
	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
    // Straight line to base of tear then to start of operculum
    ctx.lineTo(middleLeftX, middleLeftY);
    ctx.lineTo(bottomLeftX, bottomLeftY);
    
    // Another arc going the other way
    ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
    // Straight line to base of tear on this side
    ctx.lineTo(middleRightX, middleRightY);
    
    // Close path to join to starting point
    ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.arc(0, 0, rt, tearStart, tearEnd, true);
        ctx.strokeStyle = "darkred";
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

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.GRT.prototype.description = function()
{
    var returnString = "Giant Retinal Tear ";
    
    // Use trigonometry on rotation field to get clock hour of start (0.2618 is PI/12)
    var start = this.rotation - this.arc/2;
    var clockHour = Math.floor((((start + 0.2618)  * 6/Math.PI) + 12) % 12);
    if (clockHour == 0) clockHour = 12;
    
    // Get extent of tear in degrees
    var extent = (this.arc * 180/Math.PI);
    
    // Round to nearest 10
    extent = 10 * Math.floor((extent + 5) / 10);
    
    returnString = returnString + extent + " degrees clockwise from " + clockHour + " o'clock";
		
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.GRT.prototype.snomedCode = function()
{
	return 232004004;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.GRT.prototype.diagnosticHierarchy = function()
{
	return 7;
}


/**
 * Star fold of PVR
 *
 * @class StarFold
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.StarFold = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "StarFold";
}

/**
 * Sets superclass and constructor
 */
ED.StarFold.prototype = new ED.Doodle;
ED.StarFold.prototype.constructor = ED.StarFold;
ED.StarFold.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.StarFold.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.StarFold.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfScale = new ED.Range(+0.125, +1.5);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(50, +250);
}

/**
 * Sets default parameters
 */
ED.StarFold.prototype.setParameterDefaults = function()
{
    // Place at 6 o'clock
    this.originY = 400;
    this.rotation = Math.PI;
    this.apexY = 50;
    
    // Example of x4 drawing in doodle space
    this.scaleX = 0.25;
    this.scaleY = 0.25;    
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.StarFold.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.StarFold.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    ctx.moveTo(0, -this.apexY);
    ctx.bezierCurveTo(100, -50, 260, -240, 300, -200);
    ctx.bezierCurveTo(340, -160, 100, -100, 2*this.apexY, 0);
    ctx.bezierCurveTo(100, 100, 340, 160, 300, 200);
    ctx.bezierCurveTo(260, 240, 100, 50, 0, this.apexY);
    ctx.bezierCurveTo(-100, 50, -260, 240, -300, 200);
    ctx.bezierCurveTo(-340, 160, -100, 100, -2*this.apexY, 0);
    ctx.bezierCurveTo(-100, -100, -340, -160, -300, -200);
    ctx.bezierCurveTo(-260, -240, -100, -50, 0, -this.apexY);
	    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "lightgreen";
	ctx.strokeStyle = "green";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
    // Calculate arc for doodles with no natural arc setting
    this.arc = Math.atan2(600 * this.scaleX,Math.abs(this.originY));
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(-300, 200));
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.StarFold.prototype.description = function()
{
    var returnString = "Star fold at ";
    
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.StarFold.prototype.snomedCode = function()
{
	return 232018006;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.StarFold.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Lattice degeneration
 *
 * @class Lattice
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Lattice = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Lattice";
}

/**
 * Sets superclass and constructor
 */
ED.Lattice.prototype = new ED.Doodle;
ED.Lattice.prototype.constructor = ED.Lattice;
ED.Lattice.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lattice.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.Lattice.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.125, +1.5);
	this.rangeOfArc = new ED.Range(Math.PI/12, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(50, +250);
}

/**
 * Sets default parameters
 */
ED.Lattice.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;
    
    // The radius property is changed by movement in rotatable doodles
    this.radius = 350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lattice.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Lattice.superclass.draw.call(this, _point);
    
    // Lattice is at equator
    var ro = this.radius + 50;
    var ri = this.radius;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of lattice
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
        
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;

    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['LatticePattern'],'repeat');
    ctx.fillStyle = ptrn;

	ctx.strokeStyle = "lightgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Lattice.prototype.description = function()
{
    var returnString = "Lattice at ";
    
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Lattice.prototype.snomedCode = function()
{
	return 3577000;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Lattice.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Cryotherapy
 *
 * @class Cryo
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Cryo = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Cryo";
}

/**
 * Sets superclass and constructor
 */
ED.Cryo.prototype = new ED.Doodle;
ED.Cryo.prototype.constructor = ED.Cryo;
ED.Cryo.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Cryo.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.Cryo.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfScale = new ED.Range(+0.5, +2);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters
 */
ED.Cryo.prototype.setParameterDefaults = function()
{
    this.originX = 200;
	this.originY = -376;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cryo.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Cryo.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Round hole
	ctx.arc(0,0,40,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    var ptrn = ctx.createPattern(this.drawing.imageArray['CryoPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(80, 40, 0, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(30, -30));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Cryo.prototype.description = function()
{
    var returnString = "";

	returnString += "Cryo scar ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}



/**
 * Anterior PVR
 *
 * @class AntPVR
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AntPVR = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order); 
	
	// Set classname
	this.className = "AntPVR";
}

/**
 * Sets superclass and constructor
 */
ED.AntPVR.prototype = new ED.Doodle;
ED.AntPVR.prototype.constructor = ED.AntPVR;
ED.AntPVR.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntPVR.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntPVR.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.25, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-400, -300);
}


/**
 * Sets default parameters
 */
ED.AntPVR.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.rotation = 180 * Math.PI/180;
    this.apexY = -400;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntPVR.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntPVR.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of lattice
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;	
    var ptrn = ctx.createPattern(this.drawing.imageArray['AntPVRPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.AntPVR.prototype.snomedCode = function()
{
	return 232017001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.AntPVR.prototype.diagnosticHierarchy = function()
{
	return 2;
}


/**
 * Retinoschisis
 *
 * @class Retinoschisis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Retinoschisis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Retinoschisis";
}

/**
 * Sets superclass and constructor
 */
ED.Retinoschisis.prototype = new ED.Doodle;
ED.Retinoschisis.prototype.constructor = ED.Retinoschisis;
ED.Retinoschisis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Retinoschisis.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Retinoschisis.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+1, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-400, +400);
}

/**
 * Sets default parameters
 */
ED.Retinoschisis.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;
    this.rotation = 225 * Math.PI/180;
    this.apexY = -260;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Retinoschisis.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Retinoschisis.superclass.draw.call(this, _point);
	
	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952/2;
    
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
	
	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
	
	// Boundary path
	ctx.beginPath();
	
	// Start at top right
	//ctx.moveTo(topRightX, topRightY);
	
	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
	
	// Connect across the bottom via the apex point
	var bp = +0.6;
	
	// Radius of disk (from Fundus doodle)
	var dr = +25;
	
	// RD above optic disk
	if (this.apexY < -dr)
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// Retinoschisis involves optic disk
	else if (this.apexY < dr)
	{
		// Angle from origin to intersection of disk margin with a horizontal line through apexY
		var phi = Math.acos((0 - this.apexY)/dr);
		
		// Curve to disk, curve around it, then curve out again
		var xd = dr * Math.sin(phi);
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, -xd, this.apexY);
		ctx.arc(0, 0, dr, -Math.PI/2 - phi, -Math.PI/2 + phi, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// Retinoschisis beyond optic disk
	else
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, 0, 25);
		ctx.arc(0, 0, dr, Math.PI/2, 2.5*Math.PI, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 255, 255, 0.75)";
	ctx.strokeStyle = "rgba(0, 200, 255, 0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Retinoschisis.prototype.description = function()
{
    // Get side
    if(this.drawing.eye == ED.eye.Right)
	{
		var isRightSide = true;
	}
	else
	{
		var isRightSide = false;
	}
    
	// Construct description
	var returnString = "";
	
	// Use trigonometry on rotation field to determine quadrant
	returnString = returnString + (Math.cos(this.rotation) > 0?"Supero":"Infero");
	returnString = returnString + (Math.sin(this.rotation) > 0?(isRightSide?"nasal":"temporal"):(isRightSide?"temporal":"nasal"));
	returnString = returnString + " retinoschisis";
	
	// Return description
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Retinoschisis.prototype.snomedCode = function()
{
	return 44268007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Retinoschisis.prototype.diagnosticHierarchy = function()
{
	return 6;
}

/**
 * Outer leaf break
 *
 * @class OuterLeafBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.OuterLeafBreak = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "OuterLeafBreak";
}

/**
 * Sets superclass and constructor
 */
ED.OuterLeafBreak.prototype = new ED.Doodle;
ED.OuterLeafBreak.prototype.constructor = ED.OuterLeafBreak;
ED.OuterLeafBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OuterLeafBreak.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.OuterLeafBreak.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfScale = new ED.Range(+0.5, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters
 */
ED.OuterLeafBreak.prototype.setParameterDefaults = function()
{
	this.originX = -230;
	this.originY = 290;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OuterLeafBreak.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OuterLeafBreak.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Round hole
	ctx.arc(0,0,60,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 140, 140, 0.75)";
	ctx.strokeStyle = "rgba(0, 255, 255, 0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(41, -41));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle ***TODO** more elegant method of doing this possible!)
    var centre = this.transform.transformPoint(new ED.Point(0,0));
    var oneWidthToRight = this.transform.transformPoint(new ED.Point(60,0));
    var xco = centre.x - this.drawing.canvas.width/2;
    var yco = centre.y - this.drawing.canvas.height/2;
    var radius = this.scaleX * Math.sqrt(xco * xco + yco * yco);
    var width = this.scaleX * (oneWidthToRight.x - centre.x);
    this.arc = Math.atan(width/radius);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.OuterLeafBreak.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // Round hole
	returnString += "outer leaf break ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * Inner leaf break
 *
 * @class InnerLeafBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.InnerLeafBreak = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "InnerLeafBreak";
}

/**
 * Sets superclass and constructor
 */
ED.InnerLeafBreak.prototype = new ED.Doodle;
ED.InnerLeafBreak.prototype.constructor = ED.InnerLeafBreak;
ED.InnerLeafBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.InnerLeafBreak.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.InnerLeafBreak.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfScale = new ED.Range(+0.5, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters
 */
ED.InnerLeafBreak.prototype.setParameterDefaults = function()
{
	this.originX = -326;
	this.originY = 206;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.InnerLeafBreak.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.InnerLeafBreak.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Round hole
	ctx.arc(0,0,20,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 80, 80, 0.75)";
	ctx.strokeStyle = "rgba(0, 255, 255, 0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(14, -14));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.InnerLeafBreak.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // Round hole
	returnString += "inner leaf break ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}









