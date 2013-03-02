/**
 * @fileOverview Contains doodle subclasses for glaucoma
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 28th Ootober 2011
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
 * Radii from out to in (mainly for gonioscopy)
 * @ignore
 */
var rsl = 480;
var rsli = 470;
var rtmo = 404;
var rtmi = 304;
var rcbo = 270;
var rcbi = 190;
var riro = 190;
var riri = 176;
var rpu = 100;


/**
 * Anterior segment with moveable sized pupil for glaucoma
 *
 * @class Iris
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
ED.Iris = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Iris";
}

/**
 * Sets superclass and constructor
 */
ED.Iris.prototype = new ED.Doodle;
ED.Iris.prototype.constructor = ED.Iris;
ED.Iris.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Iris.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Iris.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isMoveable = false;
    this.isRotatable = false;
    this.isUnique = true;
    this.rangeOfApexX = new ED.Range(-0, +0);
    this.rangeOfApexY = new ED.Range(-280, -240);
}

/**
 * Sets default parameters
 */
ED.Iris.prototype.setParameterDefaults = function()
{
	this.apexY = -280;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Iris.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Iris.superclass.draw.call(this, _point);
    
	// Radius of limbus
	var ro = 280;

	// Boundary path
	ctx.beginPath();
	ctx.arc(0, 0, ro, 0,  2 * Math.PI, true);
	
	// Set attributes
	ctx.lineWidth = 4;	
	ctx.fillStyle = "rgba(100, 200, 250, 0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Posterior embryotoxon
        ctx.beginPath();
        ctx.arc(0, 0, -this.apexY, 0,  2 * Math.PI, true);
        
        ctx.lineWidth = 8;	
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        
        // Only draw it if it is smaller than iris
        if (this.apexY > -ro)
        {
            ctx.stroke();
            
            // Axenfeld's anomaly
            if (this.apexY > -250)
            {
                ctx.beginPath();
                var n = 12;
                for (var i = 0; i < n; i++)
                {
                    var angle = i * 2 * Math.PI/n;
                    var startPoint = new ED.Point(0,0);
                    startPoint.setWithPolars(-this.apexY, angle);
                    var endPoint = new ED.Point(0,0);
                    endPoint.setWithPolars(270, angle);
                    
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(endPoint.x, endPoint.y);
                }
                
                ctx.stroke();
            }
            
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
ED.Iris.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.apexY > -280) returnString += "Posterior embryotoxon";
    if (this.apexY > -250) returnString += " with Axenfeld's anomaly ";
	
	return returnString;
}

/**
 * A defomrable and moveable pupil
 *
 * @class Pupil
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
ED.Pupil = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Pupil";
}

/**
 * Sets superclass and constructor
 */
ED.Pupil.prototype = new ED.Doodle;
ED.Pupil.prototype.constructor = ED.Pupil;
ED.Pupil.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Pupil.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, true);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Pupil.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.isDeletable = false;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = true;
	this.rangeOfOriginX = new ED.Range(-90, +90);
	this.rangeOfOriginY = new ED.Range(-90, +90);
	this.rangeOfScale = new ED.Range(+0.5, +1.5);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-240, -150);
}

/**
 * Sets default parameters
 */
ED.Pupil.prototype.setParameterDefaults = function()
{
	this.apexY = -150;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Pupil.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Pupil.superclass.draw.call(this, _point);

    // Radius of 'circle'
    var r = 150;
    var rs = - this.apexY;
    var f = 0.55;   // Gives a circular bezier curve
    
	// Boundary path
	ctx.beginPath(); 
	
	// Pupil
    ctx.moveTo(0, -rs);
    ctx.bezierCurveTo(r * f, -rs, r, -r * f, r, 0);
    ctx.bezierCurveTo(r, r * f, r * f, r, 0, r); 
    ctx.bezierCurveTo(-r * f, r, -r, r * f, -r, 0);
    ctx.bezierCurveTo(-r, -rs * f, -r * f, -rs, 0, -rs);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
    ctx.fillStyle = "white";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(r, 0));
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
ED.Pupil.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.originX * this.originX > 0 || this.originY * this.originY > 0) returnString = "Correctopia ";
	
	return returnString;
}











/**
 * Supramid suture
 *
 * @class Supramid
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
ED.Supramid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Supramid";
}

/**
 * Sets superclass and constructor
 */
ED.Supramid.prototype = new ED.Doodle;
ED.Supramid.prototype.constructor = ED.Supramid;
ED.Supramid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Supramid.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Supramid.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-420, -200);
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(10, 10);
}

/**
 * Sets default parameters
 */
ED.Supramid.prototype.setParameterDefaults = function()
{
    this.apexX = 0;
    this.apexY = -350;
    this.originY = -10;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -10;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 10;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Supramid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Supramid.superclass.draw.call(this, _point);

    // Calculate key points for supramid bezier
    var startPoint = new ED.Point(0, this.apexY);
    var tubePoint = new ED.Point(0, -450);    
    var controlPoint1 = new ED.Point(0, -600);
    
    // Calculate mid point x coordinate
    var midPointX = -450;
    var controlPoint2 = new ED.Point(midPointX, -300);
    var midPoint = new ED.Point(midPointX, 0);
    var controlPoint3 = new ED.Point(midPointX, 300);
    var controlPoint4 = new ED.Point(midPointX * 0.5, 450);
    var endPoint = new ED.Point(midPointX * 0.2, 450);

	// Boundary path
	ctx.beginPath();
    
    // Rectangle around suture
    ctx.moveTo(this.apexX, tubePoint.y);
    ctx.lineTo(midPointX, tubePoint.y);
    ctx.lineTo(midPointX, endPoint.y);
    ctx.lineTo(this.apexX, endPoint.y);            
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{        
        // Suture
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(tubePoint.x, tubePoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, midPoint.x, midPoint.y);
        ctx.bezierCurveTo(controlPoint3.x, controlPoint3.y, controlPoint4.x, controlPoint4.y, endPoint.x, endPoint.y);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "purple";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.Supramid.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Position of end of suture
        case 'endPosition':
            var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
            
            if (r < 280 ) returnValue = 'in the AC';
            else returnValue = ((r - 280)/14).toFixed(0) + 'mm from limbus';
            break;

        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Supramid.prototype.description = function()
{
    var returnString = "Supramid suture ";
    
    returnString += this.getParameter('endPosition');
    
	return returnString;
}

/**
 * Vicryl suture
 *
 * @class Vicryl
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
ED.Vicryl = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Vicryl";
}

/**
 * Sets superclass and constructor
 */
ED.Vicryl.prototype = new ED.Doodle;
ED.Vicryl.prototype.constructor = ED.Vicryl;
ED.Vicryl.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Vicryl.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Vicryl.prototype.setParameterDefaults = function()
{
    this.originY = -240;
    this.apexY = 400;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -240;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 240;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Vicryl.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Vicryl.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Use arcTo to create an ellipsoid
    ctx.moveTo(-20, 0);
    ctx.arcTo(0, -20, 20, 0, 30); 
    ctx.arcTo(0, 20, -20, 0, 30);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "purple";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Ends of suture
        ctx.beginPath();
        ctx.moveTo(35, -10);
        ctx.lineTo(20, 0);
        ctx.lineTo(35, 10); 
        ctx.stroke();
        
        // Knot
        this.drawSpot(ctx, 20, 0, 4, "purple");
 	}
	
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
ED.Vicryl.prototype.description = function()
{
    var returnString = "Vicryl suture";
    
	return returnString;
}

/**
 * Molteno tube
 *
 * @class Molteno
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
ED.Molteno = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Molteno";
}

/**
 * Sets superclass and constructor
 */
ED.Molteno.prototype = new ED.Doodle;
ED.Molteno.prototype.constructor = ED.Molteno;
ED.Molteno.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Molteno.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Molteno.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfApexY = new ED.Range(+100, +500);
	this.rangeOfApexX = new ED.Range(-0, +0);
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(380, 380);
}

/**
 * Sets default parameters
 */
ED.Molteno.prototype.setParameterDefaults = function()
{
    this.originY = -380;
    this.apexY = 300;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -380;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 380;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Molteno.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Molteno.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.3;
    
    // Plate
    ctx.arc(0, 0, 310 * s, 0, Math.PI * 2, true);  
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Inner ring
        ctx.beginPath();
        ctx.arc(0, 0, 250 * s, 0, Math.PI * 2, true);
        ctx.stroke();
        
        // Suture holes
        this.drawSpot(ctx, -200 * s, 200 * s, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, -200 * s, -200 * s, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, 200 * s, -200 * s, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, 200 * s, 200 * s, 5, "rgba(255,255,255,1)");
        
        // Tube
        ctx.beginPath();
        ctx.moveTo(-20 * s, 240 * s);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 240 * s);
        
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.Molteno.prototype.getParameter = function(_parameter)
{
    var returnValue;
    var isRE = (this.drawing.eye == ED.eye.Right);
    
    switch (_parameter)
    {
        // Plate position
        case 'platePosition':
            var clockHour = this.clockHour();
            
            if (clockHour < 4 ) returnValue = isRE?'SNQ':'STQ';
            else if (clockHour < 7 ) returnValue = isRE?'INQ':'ITQ';
            else if (clockHour < 10 ) returnValue = isRE?'ITQ':'INQ';
            else returnValue = isRE?'STQ':'SNQ';
            break;
            
        case 'plateLimbusDistance':
            var distance = Math.round((Math.sqrt(this.originX * this.originX + this.originY * this.originY) - 360)/20);
            returnValue = distance.toFixed(1);
            break;
            
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets derived parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Molteno.prototype.setParameter = function(_parameter, _value)
{
    var isRE = (this.drawing.eye == ED.eye.Right);
    switch (_parameter)
    {
        // Plate position
        case 'platePosition':
            switch (_value)
            {
                case 'STQ':
                    if (isRE)
                    {
                        this.originX = -380;
                        this.originY = -380;
                        this.rotation = -Math.PI/4;
                    }
                    else
                    {
                        this.originX = 380;
                        this.originY = -380;
                        this.rotation = Math.PI/4;
                    }
                    break;
                case 'ITQ':
                    if (isRE)
                    {
                        this.originX = -380;
                        this.originY = 380;
                        this.rotation = -3*Math.PI/4;
                    }
                    else
                    {
                        this.originX = 380;
                        this.originY = 380;
                        this.rotation = 3*Math.PI/4;
                    }
                    break;
                case 'SNQ':
                    if (isRE)
                    {
                        this.originX = 380;
                        this.originY = -380;
                        this.rotation = Math.PI/4;
                    }
                    else
                    {
                        this.originX = -380;
                        this.originY = -380;
                        this.rotation = -Math.PI/4;
                    }
                    break;
                case 'INQ':
                    if (isRE)
                    {
                        this.originX = 380;
                        this.originY = 380;
                        this.rotation = 3*Math.PI/4;
                    }
                    else
                    {
                        this.originX = -380;
                        this.originY = 380;
                        this.rotation = -3*Math.PI/4;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'plateLimbusDistance':
            
            // Get angle to origin
            var origin = new ED.Point(this.originX, this.originY);
            var north = new ED.Point(0,-100);
            var angle = 2 * Math.PI - origin.clockwiseAngleTo(north);
            
            // Calculate new radius
            r = _value * 20 + 304;
            
            // Set doodle to new radius
            var newOrigin = new ED.Point()
            newOrigin.setWithPolars(r, angle);
            this.originX = newOrigin.x;
            this.originY = newOrigin.y;
            
            break;
            
        default:
            break
    }
}


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Molteno.prototype.description = function()
{
    var returnString = "Molteno tube";
    
    // Position
    var quadrant = this.getParameter('platePosition');
    var description = "";
    
    switch (quadrant)
    {
        case 'STQ':
            description = " in supero-temporal quadrant";
            break;
        case 'SNQ':
            description = " in supero-nasal quadrant";
            break;
        case 'INQ':
            description = " in infero-nasal quadrant";
            break;            
        case 'ITQ':
            description = " in infero-temporal quadrant";
            break;             
    }
    
    returnString += description;
    
	return returnString;
}

/**
 * Baerveldt tube
 *
 * @class Baerveldt
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
ED.Baerveldt = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Baerveldt";
}

/**
 * Sets superclass and constructor
 */
ED.Baerveldt.prototype = new ED.Doodle;
ED.Baerveldt.prototype.constructor = ED.Baerveldt;
ED.Baerveldt.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Baerveldt.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Baerveldt.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfApexY = new ED.Range(+100, +500);
	this.rangeOfApexX = new ED.Range(-0, +0);
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(380, 380);
}

/**
 * Sets default parameters
 */
ED.Baerveldt.prototype.setParameterDefaults = function()
{
    this.originY = -380;
    this.apexY = 300;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -380;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 380;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Baerveldt.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Baerveldt.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.3;
    
    // Plate
    ctx.moveTo(-400	* s, 0 * s);
    ctx.bezierCurveTo(-400 * s, -100 * s, -300 * s, -200 * s, -200 * s, -200 * s);
    ctx.bezierCurveTo(-100 * s, -200 * s, -58 * s, -136 * s, 0 * s, -135 * s);
    ctx.bezierCurveTo(54 * s, -136 * s, 100 * s, -200 * s, 200 * s, -200 * s);
    ctx.bezierCurveTo(300 * s, -200 * s, 400 * s, -100 * s, 400 * s, 0 * s);
    ctx.bezierCurveTo(400 * s, 140 * s, 200 * s, 250 * s, 0 * s, 250 * s);
    ctx.bezierCurveTo(-200 * s, 250 * s, -400 * s, 140 * s, -400 * s, 0 * s);
    
    // Connection flange
    ctx.moveTo(-160 * s, 230 * s);
    ctx.lineTo(-120 * s, 290 * s);
    ctx.lineTo(120 * s, 290 * s);
    ctx.lineTo(160 * s, 230 * s);
    ctx.bezierCurveTo(120 * s, 250 * s, -120 * s, 250 * s, -160 * s, 230 * s);   
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spots
        this.drawSpot(ctx, -240 * s, -40 * s, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, -120 * s, 40 * s, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 120 * s, 40 * s, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 240 * s, -40 * s, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, -100 * s, 260 * s, 5, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 100 * s, 260 * s, 5, "rgba(150,150,150,0.5)");
        
        // Ridge on flange
        ctx.beginPath()
        ctx.moveTo(-30 * s, 250 * s);
        ctx.lineTo(-30 * s, 290 * s);
        ctx.moveTo(30 * s, 250 * s);
        ctx.lineTo(30 * s, 290 * s);
        
        // Tube
        ctx.moveTo(-20 * s, 290 * s);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 290 * s);
        
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.Baerveldt.prototype.getParameter = function(_parameter)
{
    var returnValue;
    var isRE = (this.drawing.eye == ED.eye.Right);
    
    switch (_parameter)
    {
            // Plate position
        case 'platePosition':
            var clockHour = this.clockHour();
            
            if (clockHour < 4 ) returnValue = isRE?'SNQ':'STQ';
            else if (clockHour < 7 ) returnValue = isRE?'INQ':'ITQ';
            else if (clockHour < 10 ) returnValue = isRE?'ITQ':'INQ';
            else returnValue = isRE?'STQ':'SNQ';
            break;
            
        case 'plateLimbusDistance':
            var distance = Math.round((Math.sqrt(this.originX * this.originX + this.originY * this.originY) - 360)/20);
            returnValue = distance.toFixed(1);
            break;
            
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets derived parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Baerveldt.prototype.setParameter = function(_parameter, _value)
{
    var isRE = (this.drawing.eye == ED.eye.Right);
    switch (_parameter)
    {
        // Plate position
        case 'platePosition':
        switch (_value)
        {
            case 'STQ':
                if (isRE)
                {
                    this.originX = -380;
                    this.originY = -380;
                    this.rotation = -Math.PI/4;
                }
                else
                {
                    this.originX = 380;
                    this.originY = -380;
                    this.rotation = Math.PI/4;
                }
                break;
            case 'ITQ':
                if (isRE)
                {
                    this.originX = -380;
                    this.originY = 380;
                    this.rotation = -3*Math.PI/4;
                }
                else
                {
                    this.originX = 380;
                    this.originY = 380;
                    this.rotation = 3*Math.PI/4;
                }
                break;
            case 'SNQ':
                if (isRE)
                {
                    this.originX = 380;
                    this.originY = -380;
                    this.rotation = Math.PI/4;
                }
                else
                {
                    this.originX = -380;
                    this.originY = -380;
                    this.rotation = -Math.PI/4;
                }
                break;
            case 'INQ':
                if (isRE)
                {
                    this.originX = 380;
                    this.originY = 380;
                    this.rotation = 3*Math.PI/4;
                }
                else
                {
                    this.originX = -380;
                    this.originY = 380;
                    this.rotation = -3*Math.PI/4;
                }
                break;
            default:
                break;
        }
        break;
        case 'plateLimbusDistance':
            
            // Get angle to origin
            var origin = new ED.Point(this.originX, this.originY);
            var north = new ED.Point(0,-100);
            var angle = 2 * Math.PI - origin.clockwiseAngleTo(north);
            
            // Calculate new radius
            r = _value * 20 + 304;
            
            // Set doodle to new radius
            var newOrigin = new ED.Point()
            newOrigin.setWithPolars(r, angle);
            this.originX = newOrigin.x;
            this.originY = newOrigin.y;
            
            break;
            
        default:
            break
    }
}


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Baerveldt.prototype.description = function()
{
    var returnString = "Baerveldt tube";
    
    // Position
    var quadrant = this.getParameter('platePosition');
    var description = "";
    
    switch (quadrant)
    {
        case 'STQ':
            description = " in supero-temporal quadrant";
            break;
        case 'SNQ':
            description = " in supero-nasal quadrant";
            break;
        case 'INQ':
            description = " in infero-nasal quadrant";
            break;            
        case 'ITQ':
            description = " in infero-temporal quadrant";
            break;             
    }
    
    returnString += description;
    
	return returnString;
}

/**
 * Ahmed tube
 *
 * @class Ahmed
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
ED.Ahmed = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Ahmed";
}

/**
 * Sets superclass and constructor
 */
ED.Ahmed.prototype = new ED.Doodle;
ED.Ahmed.prototype.constructor = ED.Ahmed;
ED.Ahmed.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Ahmed.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Ahmed.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
	this.rangeOfApexY = new ED.Range(+100, +500);
	this.rangeOfApexX = new ED.Range(-0, +0);
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(380, 380);
}

/**
 * Sets default parameters
 */
ED.Ahmed.prototype.setParameterDefaults = function()
{
    this.originY = -380;
    this.apexY = 300;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -380;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 380;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Ahmed.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Ahmed.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.3;
    
    // Plate
    ctx.moveTo(-300	* s, 0 * s);
    ctx.bezierCurveTo(-300 * s, -100 * s, -200 * s, -400 * s, 0 * s, -400 * s);
    ctx.bezierCurveTo(200 * s, -400 * s, 300 * s, -100 * s, 300 * s, 0 * s);
    ctx.bezierCurveTo(300 * s, 140 * s, 200 * s, 250 * s, 0 * s, 250 * s);
    ctx.bezierCurveTo(-200 * s, 250 * s, -300 * s, 140 * s, -300 * s, 0 * s);
    
    // Connection flange
    ctx.moveTo(-160 * s, 230 * s);
    ctx.lineTo(-120 * s, 290 * s);
    ctx.lineTo(120 * s, 290 * s);
    ctx.lineTo(160 * s, 230 * s);
    ctx.bezierCurveTo(120 * s, 250 * s, -120 * s, 250 * s, -160 * s, 230 * s);   
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spots
        this.drawSpot(ctx, 0 * s, -230 * s, 20 * s, "white");
        this.drawSpot(ctx, -180 * s, -180 * s, 20 * s, "white");
        this.drawSpot(ctx, 180 * s, -180 * s, 20 * s, "white");

        // Trapezoid mechanism
        ctx.beginPath()
        ctx.moveTo(-100 * s, 230 * s);
        ctx.lineTo(100 * s, 230 * s);
        ctx.lineTo(200 * s, 0 * s);
        ctx.lineTo(40 * s, 0 * s);
        ctx.arcTo(0, -540 * s, -40 * s, 0 * s, 15);
        ctx.lineTo(-40 * s, 0 * s);
        ctx.lineTo(-200 * s, 0 * s); 
        ctx.closePath();
        
        ctx.fillStyle = "rgba(250,250,250,0.7)";
        ctx.fill();
        
        // Lines
        ctx.moveTo(-80 * s, -40 * s);
        ctx.lineTo(-160 * s, -280 * s);
        ctx.moveTo(80 * s, -40 * s);
        ctx.lineTo(160 * s, -280 * s);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "rgba(250,250,250,0.7)";
        ctx.stroke();
        
        // Ridge on flange
        ctx.beginPath()
        ctx.moveTo(-30 * s, 250 * s);
        ctx.lineTo(-30 * s, 290 * s);
        ctx.moveTo(30 * s, 250 * s);
        ctx.lineTo(30 * s, 290 * s);
        
        // Tube
        ctx.moveTo(-20 * s, 290 * s);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 290 * s);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.Ahmed.prototype.getParameter = function(_parameter)
{
    var returnValue;
    var isRE = (this.drawing.eye == ED.eye.Right);
    
    switch (_parameter)
    {
            // Plate position
        case 'platePosition':
            var clockHour = this.clockHour();
            
            if (clockHour < 4 ) returnValue = isRE?'SNQ':'STQ';
            else if (clockHour < 7 ) returnValue = isRE?'INQ':'ITQ';
            else if (clockHour < 10 ) returnValue = isRE?'ITQ':'INQ';
            else returnValue = isRE?'STQ':'SNQ';
            break;
            
        case 'plateLimbusDistance':
            var distance = Math.round((Math.sqrt(this.originX * this.originX + this.originY * this.originY) - 304)/20);
            returnValue = distance.toFixed(1);
            break;
            
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets derived parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Ahmed.prototype.setParameter = function(_parameter, _value)
{
    var isRE = (this.drawing.eye == ED.eye.Right);
    switch (_parameter)
    {
        // Plate position
        case 'platePosition':
            switch (_value)
            {
                case 'STQ':
                    if (isRE)
                    {
                        this.originX = -380;
                        this.originY = -380;
                        this.rotation = -Math.PI/4;
                    }
                    else
                    {
                        this.originX = 380;
                        this.originY = -380;
                        this.rotation = Math.PI/4;
                    }
                    break;
                case 'ITQ':
                    if (isRE)
                    {
                        this.originX = -380;
                        this.originY = 380;
                        this.rotation = -3*Math.PI/4;
                    }
                    else
                    {
                        this.originX = 380;
                        this.originY = 380;
                        this.rotation = 3*Math.PI/4;
                    }
                    break;
                case 'SNQ':
                    if (isRE)
                    {
                        this.originX = 380;
                        this.originY = -380;
                        this.rotation = Math.PI/4;
                    }
                    else
                    {
                        this.originX = -380;
                        this.originY = -380;
                        this.rotation = -Math.PI/4;
                    }
                    break;
                case 'INQ':
                    if (isRE)
                    {
                        this.originX = 380;
                        this.originY = 380;
                        this.rotation = 3*Math.PI/4;
                    }
                    else
                    {
                        this.originX = -380;
                        this.originY = 380;
                        this.rotation = -3*Math.PI/4;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'plateLimbusDistance':
            
            // Get angle to origin
            var origin = new ED.Point(this.originX, this.originY);
            var north = new ED.Point(0,-100);
            var angle = 2 * Math.PI - origin.clockwiseAngleTo(north);
            
            // Calculate new radius
            r = _value * 20 + 304;
            
            // Set doodle to new radius
            var newOrigin = new ED.Point()
            newOrigin.setWithPolars(r, angle);
            this.originX = newOrigin.x;
            this.originY = newOrigin.y;
            
            break;
            
        default:
            break
    }
}


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Ahmed.prototype.description = function()
{
    var returnString = "Ahmed tube at ";
    
    // Position
    var quadrant = this.getParameter('platePosition');
    var description = "";
    
    switch (quadrant)
    {
        case 'STQ':
            description = " in supero-temporal quadrant";
            break;
        case 'SNQ':
            description = " in supero-nasal quadrant";
            break;
        case 'INQ':
            description = " in infero-nasal quadrant";
            break;            
        case 'ITQ':
            description = " in infero-temporal quadrant";
            break;             
    }
    
    returnString += description;
    
	return returnString;
}

/**
 * Patch
 *
 * @class Patch
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
ED.Patch = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Patch";
}

/**
 * Sets superclass and constructor
 */
ED.Patch.prototype = new ED.Doodle;
ED.Patch.prototype.constructor = ED.Patch;
ED.Patch.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Patch.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.Patch.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = true;
    this.rangeOfArc = new ED.Range(0, Math.PI);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-334, -300);
    this.rangeOfRadius = new ED.Range(250, 450);
}

/**
 * Sets default parameters
 */
ED.Patch.prototype.setParameterDefaults = function()
{
    this.originY = -260;
    
    // Patchs are usually temporal
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -260;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 260;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patch.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Patch.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    ctx.rect(-50, -70, 100, 140);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,50,0.5)";
    ctx.strokeStyle = "rgba(120,120,120,0)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Suture knots
        this.drawSpot(ctx, -50, -50, 5, "blue");
        this.drawSpot(ctx, -50, 50, 5, "blue");
        this.drawSpot(ctx, 50, -50, 5, "blue");
        this.drawSpot(ctx, 50, 50, 5, "blue");
        
        // Suture thread ends
        this.drawLine(ctx, -60, -60, -50, -50, 2, "blue");
        this.drawLine(ctx, -50, -50, -60, -40, 2, "blue");
        this.drawLine(ctx, -60, 60, -50, 50, 2, "blue");
        this.drawLine(ctx, -50, 50, -60, 40, 2, "blue");
        this.drawLine(ctx, 60, -60, 50, -50, 2, "blue");
        this.drawLine(ctx, 50, -50, 60, -40, 2, "blue");
        this.drawLine(ctx, 60, 60, 50, 50, 2, "blue");
        this.drawLine(ctx, 50, 50, 60, 40, 2, "blue");
	}
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(75, -50));
    
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
ED.Patch.prototype.description = function()
{
    var returnString = "Scleral patch";
    
	return returnString;
}



/**
 * Angle configuration
 *
 * @class AngleConfiguration
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
ED.AngleConfiguration = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Number of handles (set before superclass call because superclass calles setHandles())
    this.numberOfHandles = 3;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "AngleConfiguration";
    
    // Create a squiggle to store the three control points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
    
    // Add four points to the squiggle
    this.addPointToSquiggle(new ED.Point(-100, 0));
    this.addPointToSquiggle(new ED.Point(-20, -220));
    this.addPointToSquiggle(new ED.Point(250, -350));
}

/**
 * Sets superclass and constructor
 */
ED.AngleConfiguration.prototype = new ED.Doodle;
ED.AngleConfiguration.prototype.constructor = ED.AngleConfiguration;
ED.AngleConfiguration.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleConfiguration.prototype.setHandles = function()
{
    // Array of handles
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
    }
}

/**
 * Sets default dragging attributes
 */
ED.AngleConfiguration.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
    this.rangeOfHandlesXArray[0] = new ED.Range(-100, -100);
    this.rangeOfHandlesYArray[0] = new ED.Range(-200, 0);
}

/**
 * Sets default parameters
 */
ED.AngleConfiguration.prototype.setParameterDefaults = function()
{    
    this.originX = 0;
    this.originY = 0;
    this.rotation = Math.PI/4;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleConfiguration.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleConfiguration.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();

    // Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
    var phi = 2 * Math.PI/(3 * this.numberOfHandles);
    
    // Start curve
    ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    
    // Add extra height to allow clicking on thick line to select doodle
    var h = 20;
    
    // Square
    ctx.lineTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[2].y - h);
    ctx.lineTo(this.squiggleArray[0].pointsArray[2].x, this.squiggleArray[0].pointsArray[2].y - h);
    ctx.lineTo(this.squiggleArray[0].pointsArray[2].x, this.squiggleArray[0].pointsArray[0].y);
    
	// Close path
	ctx.closePath();

    // Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "white";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // New path for cornea
        ctx.beginPath();
        
        // From and to points
        fp = new ED.Point(-300, 300);
        mp = new ED.Point(-150, 0);
        tp = new ED.Point(50, -450);
        
        // Start curve
        ctx.moveTo(fp.x, fp.y);
        
        // Draw Bezier curve     
        ctx.bezierCurveTo(fp.x, fp.y - 150, mp.x - 50, mp.y + 50, mp.x, mp.y);       
        ctx.bezierCurveTo(mp.x, mp.y - 200, tp.x - 200, tp.y + 200, tp.x, tp.y);
        
        // Set line attributes
        ctx.lineWidth = 48;
        ctx.lineCap = "square";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "lightgray";
        
        // Draw cornea
        ctx.stroke();
        
        // New path for iris
        ctx.beginPath();
        
        // From and to points
        var fp = this.squiggleArray[0].pointsArray[0];
        var mp = this.squiggleArray[0].pointsArray[1];
        var tp = this.squiggleArray[0].pointsArray[2];
        
        // Start curve
        ctx.moveTo(fp.x, fp.y);

        // Draw Bezier curve
        var d = 0.8;
        
        var bg = (tp.y - fp.y)/(tp.x - fp.x);
        var bd = Math.sqrt((tp.x - fp.x)*(tp.x - fp.x) + (tp.y - fp.y)*(tp.y - fp.y));
        var dx = 100;
        
        ctx.bezierCurveTo(fp.x, fp.y - 50, mp.x - dx, mp.y - bg * dx, mp.x, mp.y);
        ctx.bezierCurveTo(mp.x + dx, mp.y + bg * dx, tp.x -50, tp.y, tp.x, tp.y);

        // Set line attributes
        ctx.lineWidth = 48;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "brown";
        
        // Draw iris
        ctx.stroke();
 	}
    
	// Coordinates of handles (in canvas plane)
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
    }
    
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
ED.AngleConfiguration.prototype.description = function()
{
    var returnString = "";
	
	return returnString;
}
