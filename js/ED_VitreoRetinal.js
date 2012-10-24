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
 * Fundus template with disk and arcades, extends to ora. Natively right eye, flipFundus for left eye
 *
 * @class Fundus
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
ED.Fundus = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Fundus";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Fundus.prototype = new ED.Doodle;
ED.Fundus.prototype.constructor = ED.Fundus;
ED.Fundus.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.Fundus.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fundus.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Fundus.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Ora
	ctx.arc(0,0,480,0,Math.PI*2,true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
	this.isFilled = false;
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// These values different for right and left side
		if(this.drawing.eye != ED.eye.Right)
		{
			var startX = 200;
			var midX = 100;
			var ctrlX = -50;
			var endX = -100;
			var foveaX = 100;
		}
		else
		{
			var startX = -200;
			var midX = -100;
			var ctrlX = 50;
			var endX = 100;
			var foveaX = -100;
		}
		
		// Superior arcades
		ctx.moveTo(startX, -50);
		ctx.bezierCurveTo(midX, -166, 0, -62, 0, -12);
		ctx.bezierCurveTo(0, -40, ctrlX, -100, endX, -50);
		
		// Inferior arcades
		ctx.moveTo(startX, 50);
		ctx.bezierCurveTo(midX, 166, 0, 62, 0, 12);
		ctx.bezierCurveTo(0, 40, ctrlX, 100, endX, 50);
		
		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);
		
		// Optic disk and cup
		ctx.moveTo(25, 0);
		ctx.arc(0,0,25,0,Math.PI*2,true);
		ctx.moveTo(12, 0);
		ctx.arc(0,0,12,0,Math.PI*2,true);
		
		// Draw it
		ctx.stroke();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Fundus.prototype.description = function()
{
	return "";
}

/**
 * Cystoid Macular Oedema
 *
 * @class CystoidMacularOedema
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
ED.CystoidMacularOedema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CystoidMacularOedema";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CystoidMacularOedema.prototype = new ED.Doodle;
ED.CystoidMacularOedema.prototype.constructor = ED.CystoidMacularOedema;
ED.CystoidMacularOedema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CystoidMacularOedema.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CystoidMacularOedema.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.CystoidMacularOedema.prototype.setParameterDefaults = function()
{
    this.originY = 0;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CystoidMacularOedema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CystoidMacularOedema.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
	ctx.arc(0,0,120,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Colours
        var fill = "rgba(255, 255, 138, 0.5)";
        var stroke = "rgba(255, 82, 0, 0.7)";

        // Peripheral cysts
        var point = new ED.Point(0,0);
        var n = 8;
        for (var i = 0; i < n; i++)
        {
            var angle = i * 2 * Math.PI/n;
            point.setWithPolars(80,angle);
            this.drawCircle(ctx, point.x, point.y, 40, fill, 2, stroke);
        }
        
        // Large central cyst
        this.drawCircle(ctx, 0, 0, 60, fill, 2, stroke);
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(84, -84));
	
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
ED.CystoidMacularOedema.prototype.description = function()
{
    return "Cystoid macular oedema";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CystoidMacularOedema.prototype.snomedCode = function()
{
	return 193387007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CystoidMacularOedema.prototype.diagnosticHierarchy = function()
{
	return 2;
}


/**
 * Epiretinal Membrane
 *
 * @class EpiretinalMembrane
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
ED.EpiretinalMembrane = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "EpiretinalMembrane";
}

/**
 * Sets superclass and constructor
 */
ED.EpiretinalMembrane.prototype = new ED.Doodle;
ED.EpiretinalMembrane.prototype.constructor = ED.EpiretinalMembrane;
ED.EpiretinalMembrane.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EpiretinalMembrane.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.EpiretinalMembrane.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.5, +1.5);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters
 */
ED.EpiretinalMembrane.prototype.setParameterDefaults = function()
{
    this.originY = 0;
    if (this.drawing.hasDoodleOfClass('PostPole'))
    {
        this.originX = 0;
    }
    else
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EpiretinalMembrane.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EpiretinalMembrane.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 120;
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Greenish semi-transparent
        ctx.strokeStyle= "rgba(0, 255, 0, 0.7)";

        // Central line
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r,0);
        
        // Curved lines above and below
        var x = r * 0.9;
        var y = -r/2;
        var f = 0.3;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r/2;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        x = r * 0.6;
        y = -r * 0.8;
        f = 0.5;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r * 0.8;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        
        // Round ended line
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	
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
ED.EpiretinalMembrane.prototype.description = function()
{
    var returnString = "Epiretinal membrane";
	
	return returnString;
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.EpiretinalMembrane.prototype.snomedCode = function()
{
	return 367649002;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.EpiretinalMembrane.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * PRP
 *
 * @class PRP
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
ED.PRP = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PRP";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PRP.prototype = new ED.Doodle;
ED.PRP.prototype.constructor = ED.PRP;
ED.PRP.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PRP.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	//this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.PRP.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = false;
    this.rangeOfScale = new ED.Range(+0.5, +4);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-100, -10);
}

/**
 * Sets default parameters
 */
ED.PRP.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
    this.apexY = -50;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PRP.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRP.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// PRP
    var ro = 400;
    var ri = 140;
    
    // Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(-80, 0, ri, 2 * Math.PI, 0, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill pattern
    ctx.fillStyle = "rgba(100,100,100,0)";
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0)";
    //ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var sep = 60;
        var rows = 12;
        var d = ro * 2/rows;
        var i;
        
        this.rowOfBurns(-90, -360, 4, sep);
        this.rowOfBurns(-180, -300, 7, sep);
        this.rowOfBurns(-270, -240, 10, sep);
        this.rowOfBurns(-300, -180, 11, sep);
        
        this.rowOfBurns(-330, -120, 5, sep);
        this.rowOfBurns(-30, -120, 7, sep);
        
        this.rowOfBurns(-360, -60, 3, sep);
        this.rowOfBurns(60, -60, 6, sep);
        
        this.rowOfBurns(-320, 0, 2, sep);
        this.rowOfBurns(90, 0, 5, sep);
        
        this.rowOfBurns(-360, 60, 3, sep);
        this.rowOfBurns(60, 60, 6, sep);
        
        this.rowOfBurns(-330, 120, 3, sep);
        this.rowOfBurns(30, 120, 6, sep);
        
        this.rowOfBurns(-180, 300, 7, sep);
        this.rowOfBurns(-270, 240, 10, sep);
        this.rowOfBurns(-300, 180, 11, sep);
        this.rowOfBurns(-90, 360, 4, sep);
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    //this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.PRP.prototype.description = function()
{
    var returnString = "PRP";
    
	return returnString;
}

/**
 * Doodle specific function to draw a row of laser spots
 */
ED.PRP.prototype.rowOfBurns = function(_startX, _startY, _num, _sep)
{
    // Radius of burn
    var r = 12;
    
    var ctx = this.drawing.context;
    
    for (i = 0; i < _num; i++)
    {
        // Draw laser spot
        ctx.beginPath();
        ctx.arc(_startX + i * _sep, _startY, r, 0, 2 * Math.PI, true);
        //ctx.closePath();
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 8;
        ctx.strokeStyle = "brown";
        ctx.fill();
        ctx.stroke();
    }
}


/**
 * Sector PRP
 *
 * @class SectorPRP
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
ED.SectorPRP = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SectorPRP";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SectorPRP.prototype = new ED.Doodle;
ED.SectorPRP.prototype.constructor = ED.SectorPRP;
ED.SectorPRP.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SectorPRP.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.SectorPRP.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
}

/**
 * Sets default parameters
 */
ED.SectorPRP.prototype.setParameterDefaults = function()
{
    this.arc = 55 * Math.PI/180;
    this.apexY = -100;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + (this.drawing.eye == ED.eye.Right?-1:1) * (doodle.arc/2 + this.arc/2 + Math.PI/12);
    }
    else
    {
        this.rotation = (this.drawing.eye == ED.eye.Right?-1:1) * this.arc/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SectorPRP.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SectorPRP.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRP
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
	ctx.lineWidth = 40;
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
    //ctx.fillStyle = "blue";
    //ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var sr = 15;
        var si = 30;
        var ss = 48;
        var n = (1000 - 2 * ss)/(2 * sr + si);
        var sd = (2 * sr + si);
        var st = 10;
        
        // Draw spots
        var count = [47,41,35,28,22,15];
        var i = 0;
        for (var r = ro - si; r > ri; r -= sd)
        {
            var j = 0;
            
            for (var a = -Math.PI/2 - arcStart; a < this.arc - Math.PI/2 - arcStart; a += sd/r )
            {
                a = -Math.PI/2 - arcStart + j * 2 * Math.PI/count[i];
                
                var p = new ED.Point(0,0);
                p.setWithPolars(r, a);

                this.drawCircle(ctx, p.x, p.y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                
                j++;
            }
            
            i++;
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Laser circle
 *
 * @class LaserCircle
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
ED.LaserCircle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserCircle";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserCircle.prototype = new ED.Doodle;
ED.LaserCircle.prototype.constructor = ED.LaserCircle;
ED.LaserCircle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserCircle.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.LaserCircle.prototype.setPropertyDefaults = function()
{
    this.isOrientated = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(50, +400);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -50);
}

/**
 * Sets default parameters
 */
ED.LaserCircle.prototype.setParameterDefaults = function()
{
    this.apexX = 84;
    this.apexY = -84;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        doodle = this.drawing.lastDoodleOfClass('UTear');
        this.move(doodle.originX, doodle.originY);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserCircle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserCircle.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    ctx.moveTo(this.apexX, this.apexY);
    ctx.lineTo(this.apexX, -this.apexY);
    ctx.lineTo(-this.apexX, -this.apexY);
    ctx.lineTo(-this.apexX, this.apexY);
    ctx.lineTo(this.apexX, this.apexY);
	ctx.closePath();
    
    // Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot separation
        var ss = 25;
        
        // Point for spot
        var p = new ED.Point(0,0);
        
        // Difference indicating aspect ratio
        var d = this.apexX + this.apexY;
        

        // Radius and displacement of semicircle
        if (d < 0)
        {
            var r = this.apexX;
        }
        else
        {
            var r = -this.apexY;
        }
        
        // Number of spots in a semicircle
        var n = (Math.round(Math.PI/(ss/r)));
        
        // Draw upper (or left) half
        for (var i = 0; i < n + 1; i++)
        {
            if (d < 0)
            {
                var a = -Math.PI/2 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y + d);
            }
            else
            {
                var a = -Math.PI + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x - d, p.y);
            }
        }
        
        // Draw lower (or right) half
        for (var i = 1; i < n; i++)
        {
            if (d < 0)
            {
                var a = Math.PI/2 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y - d);
            }
            else
            {
                var a = 0 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x + d, p.y);
            }
        }
        
        // Draw connecting straight lines of laser
        n = Math.abs(Math.round(d/ss));
        for (var i = 0; i < 2 * n + 1; i++)
        {
            if (d < 0)
            {
                var y = this.apexY + r + i * Math.abs(d/n);
                this.drawLaserSpot(ctx, -r, y);
                this.drawLaserSpot(ctx, r, y);
            }
            else
            {
                var x = -this.apexX + r + i * Math.abs(d/n);
                this.drawLaserSpot(ctx, x, -r);
                this.drawLaserSpot(ctx, x, r);
            }
        }
	}
	
	// Coordinates of handles (in canvas plane)
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
ED.LaserCircle.prototype.description = function()
{
    var returnString = "";
    
	returnString += "LaserCircle scar ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * 'U' tear
 *
 * @class UTear
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
ED.UTear = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "UTear";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.UTear.prototype = new ED.Doodle;
ED.UTear.prototype.constructor = ED.UTear;
ED.UTear.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.UTear.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.UTear.prototype.setPropertyDefaults = function()
{
	this.isOrientated = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters
 */
ED.UTear.prototype.setParameterDefaults = function()
{
    this.apexY = -20;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, -300);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.UTear.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.UTear.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// U tear
	ctx.moveTo(0, 40);
	ctx.bezierCurveTo(-20, 40, -40, -20, -40, -40);
	ctx.bezierCurveTo(-40, -60, -20, this.apexY, 0, this.apexY);
	ctx.bezierCurveTo(20, this.apexY, 40, -60, 40, -40);
	ctx.bezierCurveTo(40, -20, 20, 40, 0, 40);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // U tear
	returnString += "'U' tear at ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}



