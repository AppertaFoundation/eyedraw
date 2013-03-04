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
 * Fundus template with disc and arcades, extends to ora. Natively right eye, flipFundus for left eye
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
    this.isFilled = false;
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
		
		// Optic disc and cup
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
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
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
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
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
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var si = 30;
        var sd = (30 + si);
        
        // Array of number of spots for each radius value
        var count = [47,41,35,28,22,15];
        
        // Iterate through radius and angle to draw sector
        var i = 0;
        for (var r = ro - si; r > ri; r -= sd)
        {
            var j = 0;
            
            for (var a = -Math.PI/2 - arcStart; a < this.arc - Math.PI/2 - arcStart; a += sd/r )
            {
                a = -Math.PI/2 - arcStart + j * 2 * Math.PI/count[i];
                
                var p = new ED.Point(0,0);
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y);
                
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
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
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
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, -300);
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
 * Laser Demarcation
 *
 * @class LaserDemarcation
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
ED.LaserDemarcation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserDemarcation";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserDemarcation.prototype = new ED.Doodle;
ED.LaserDemarcation.prototype.constructor = ED.LaserDemarcation;
ED.LaserDemarcation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserDemarcation.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.LaserDemarcation.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/4, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserDemarcation.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -350;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/4;
    }
    else
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -0.8 * Math.PI;
        }
        else
        {
            this.rotation = 0.8 * Math.PI;
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserDemarcation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserDemarcation.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of LaserDemarcation
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
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot separation
        var ss = 25;
        
        // Location of laser spot
        var p = new ED.Point(0,0);
        
        // Unless 360, go out to the ora with an elegant semicircle
        if (this.arc < 1.9 * Math.PI)
        {
            // Radius of quarter circle
            var rc = ro - ri;
            
            // Angle of quarter circle (not quite a quarter)
            var quad = Math.PI/2;
            
            // Number of spots in a quarter circle
            var n = (Math.round(quad/(ss/rc)));
            
            // Centre of first quarter circle
            var c1 = new ED.Point(- ro * Math.sin(theta - rc/ro),- ro * Math.cos(theta - rc/ro));
            
            // Draw first quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcEnd + 0.5 * (rc/ro) - i * quad/n);
                this.drawLaserSpot(ctx, c1.x + p.x, c1.y + p.y);
            }
            
            // Angle of main arc, with adjustment to make junction with semicircles look better
            var mainArc = this.arc - 2 * rc/ro;
            
            // Number of spots in the main arc
            var m = (Math.round(mainArc/(ss/ri)));
            
            // Draw main arc
            var mainStart = c1.direction();
            for (var i = 0; i < m + 1; i++)
            {
                p.setWithPolars(ri, mainStart + i * mainArc/m);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
            
            // Centre of second quarter circle
            var c2 = new ED.Point(- ro * Math.sin(- theta + rc/ro), - ro * Math.cos(- theta + rc/ro));
            
            // Draw second quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcStart + Math.PI - 0.5 * (rc/ro) + i * quad/n);
                this.drawLaserSpot(ctx, c2.x + p.x, c2.y + p.y);
            }
        }
        else
        {
            // Number of spots in the main arc
            var n = (Math.round(2 * Math.PI/(ss/ri)));
            
            // Draw main arc
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(ri, i * 2 * Math.PI/n);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
        }
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
 * Retinal detachment
 *
 * @class RRD
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
ED.RRD = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RRD";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RRD.prototype = new ED.Doodle;
ED.RRD.prototype.constructor = ED.RRD;
ED.RRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RRD.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.RRD.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +4);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, +400);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RRD.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RRD.prototype.draw = function(_point)
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
	
	// Radius of disc (from Fundus doodle)
	var dr = +25;
	
	// RD above optic disc
	if (this.apexY < -dr)
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD involves optic disc
	else if (this.apexY < dr)
	{
		// Angle from origin to intersection of disc margin with a horizontal line through apexY
		var phi = Math.acos((0 - this.apexY)/dr);
		
		// Curve to disc, curve around it, then curve out again
		var xd = dr * Math.sin(phi);
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, -xd, this.apexY);
		ctx.arc(0, 0, dr, -Math.PI/2 - phi, -Math.PI/2 + phi, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD beyond optic disc
	else
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, 0, 25);
		ctx.arc(0, 0, dr, Math.PI/2, 2.5*Math.PI, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
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
ED.RRD.prototype.description = function()
{
	// Construct description
	var returnString = "";
	
	// Use trigonometry on rotation field to determine quadrant
	returnString = returnString + (Math.cos(this.rotation) > 0?"Supero":"Infero");
	returnString = returnString + (Math.sin(this.rotation) > 0?(this.drawing.eye == ED.eye.Right?"nasal":"temporal"):(this.drawing.eye == ED.eye.Right?"temporal":"nasal"));
	returnString = returnString + " retinal detachment";
	returnString = returnString + (this.isMacOff()?" (macula off)":" (macula on)");
	
	// Return description
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RRD.prototype.snomedCode = function()
{
	return (this.isMacOff()?232009009:232008001);
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RRD.prototype.diagnosticHierarchy = function()
{
	return (this.isMacOff()?10:9);
}

/**
 * Determines whether the macula is off or not
 *
 * @returns {Bool} True if macula is off
 */
ED.RRD.prototype.isMacOff = function()
{
	// Get coordinates of macula in doodle plane
	if(this.drawing.eye == ED.eye.Right)
	{
		var macula = new ED.Point(-100,0);
	}
	else
	{
		var macula = new ED.Point(100,0);
	}
	
	// Convert to canvas plane
	var maculaCanvas = this.drawing.transform.transformPoint(macula);
	
	// Determine whether macula is off or not
	if (this.draw(maculaCanvas)) return true;
	else return false;
}

/**
 * Peripheral RRD
 *
 * @class PeripheralRRD
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
ED.PeripheralRRD = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PeripheralRRD";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralRRD.prototype = new ED.Doodle;
ED.PeripheralRRD.prototype.constructor = ED.PeripheralRRD;
ED.PeripheralRRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralRRD.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralRRD.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/4, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralRRD.prototype.setParameterDefaults = function()
{
    this.arc = 112 * Math.PI/180;
    this.apexY = -380;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            
        }
    }
    else
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -0.8 * Math.PI;
        }
        else
        {
            this.rotation = 0.8 * Math.PI;
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralRRD.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PeripheralRRD.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
    
    // Radius of quarter circle
    var rc = ro - ri;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of PeripheralRRD
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
    // Centre of first quarter circle
    var c1 = new ED.Point(0,0);
    c1.x = - ro * Math.sin(theta - rc/ro);
    c1.y = - ro * Math.cos(theta - rc/ro);
    
    // Centre of second quarter circle
    var c2 = new ED.Point(0,0);
    c2.x = - ro * Math.sin(- theta + rc/ro);
    c2.y = - ro * Math.cos(- theta + rc/ro);
    
	// Boundary path
	ctx.beginPath();
    
	// Arc from right to left
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

    // Arc round first quarter circle (slightly less than 90 degrees)
    var phi = arcEnd - Math.PI/2;
    ctx.arc(c1.x, c1.y, rc, phi, phi - Math.PI/2 + rc/ro, true);
    
    // Arc back to the right
    ctx.arc(0, 0, ri, c1.direction() - Math.PI/2, c2.direction() - Math.PI/2, false);
    
    // Arc round second quarter circle (slightly less than 90 degrees)
    phi = arcStart + Math.PI/2;
    ctx.arc(c2.x, c2.y, rc, phi + Math.PI/2 - rc/ro, phi, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
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
ED.PeripheralRRD.prototype.snomedCode = function()
{
	return 232008001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PeripheralRRD.prototype.diagnosticHierarchy = function()
{
	return 8;
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
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
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


/**
 * Round hole
 *
 * @class RoundHole
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
ED.RoundHole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RoundHole";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);

}

/**
 * Sets superclass and constructor
 */
ED.RoundHole.prototype = new ED.Doodle;
ED.RoundHole.prototype.constructor = ED.RoundHole;
ED.RoundHole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RoundHole.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.RoundHole.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RoundHole.prototype.setParameterDefaults = function()
{
    // Displacement from fovea, and from last doodle
    var d = 300;
    this.originX = d;
    this.originY = d;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var point = new ED.Point(doodle.originX, doodle.originY);
        var direction = point.direction() + Math.PI/8;
        var distance = point.length();
        var np = new ED.Point(0,0);
        np.setWithPolars(distance, direction);
        
        this.originX = np.x;
        this.originY = np.y;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RoundHole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RoundHole.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Round hole
	ctx.arc(0,0,30,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(21, -21));
	
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
    //console.log(this.arc * 180/Math.PI + " + " + this.calculateArc() * 180/Math.PI);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RoundHole.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // Round hole
	returnString += "Round hole ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RoundHole.prototype.snomedCode = function()
{
	return 302888003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RoundHole.prototype.diagnosticHierarchy = function()
{
	return 3;
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

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.CystoidMacularOedema.prototype.setParameterDefaults = function()
{
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
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
	
    // Outer radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
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
        // Colours
        var fill = "rgba(255, 255, 138, 0.5)";
        var stroke = "rgba(255, 82, 0, 0.7)";
        
        // Peripheral cysts
        var point = new ED.Point(0,0);
        var n = 8;
        for (var i = 0; i < n; i++)
        {
            var angle = i * 2 * Math.PI/n;
            point.setWithPolars(2 * r/3,angle);
            this.drawCircle(ctx, point.x, point.y, 40, fill, 2, stroke);
        }
        
        // Large central cyst
        this.drawCircle(ctx, 0, 0, r/2, fill, 2, stroke);
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
	// Set classname
	this.className = "EpiretinalMembrane";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
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
	this.isSqueezable = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +1.5);
}

/**
 * Sets default parameters
 */
ED.EpiretinalMembrane.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(0, -100);
    
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
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
    return "Epiretinal membrane";
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
 * Macular hole
 *
 * @class MacularHole
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
ED.MacularHole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularHole";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularHole.prototype = new ED.Doodle;
ED.MacularHole.prototype.constructor = ED.MacularHole;
ED.MacularHole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularHole.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.MacularHole.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.MacularHole.prototype.setParameterDefaults = function()
{
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularHole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MacularHole.superclass.draw.call(this, _point);
    
    // Radius
    var r = 40;
	
	// Boundary path
	ctx.beginPath();
	
	// Large yellow circle - hole and subretinal fluid
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.arc(0,0,2*r/3,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
	}
	
	// Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.MacularHole.prototype.description = function()
{
    return "Macular hole";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.MacularHole.prototype.snomedCode = function()
{
	return 232006002;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.MacularHole.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * BuckleOperation
 *
 * @class BuckleOperation
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
ED.BuckleOperation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BuckleOperation";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BuckleOperation.prototype = new ED.Doodle;
ED.BuckleOperation.prototype.constructor = ED.BuckleOperation;
ED.BuckleOperation.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.BuckleOperation.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.willReport = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleOperation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BuckleOperation.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Cornea
    ctx.arc(0,0,100,0,Math.PI*2,true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    this.isFilled = false;
	ctx.strokeStyle = "#444";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Recti
        this.drawRectus(ctx, 'Sup');
        this.drawRectus(ctx, 'Nas');
        this.drawRectus(ctx, 'Inf');
        this.drawRectus(ctx, 'Tem');
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws a rectus muscle
 *
 * @param {Context} _ctx
 * @param {Stirng} _quad Quadrant
 */
ED.BuckleOperation.prototype.drawRectus = function(_ctx, _quad)
{
    _ctx.beginPath();
    
    switch (_quad)
    {
        case 'Sup':
            x1 = -60;
            y1 = -480;
            x2 = -60;
            y2 = -200;
            x3 = 60;
            y3 = -200;
            x4 = 60;
            y4 = -480;
            xd = 30;
            yd = 0;
            break;
        case 'Nas':
            x1 = 480;
            y1 = -60;
            x2 = 200;
            y2 = -60;
            x3 = 200;
            y3 = 60;
            x4 = 480;
            y4 = 60;
            xd = 0;
            yd = 30;
            break;
        case 'Inf':
            x1 = 60;
            y1 = 480;
            x2 = 60;
            y2 = 200;
            x3 = -60;
            y3 = 200;
            x4 = -60;
            y4 = 480;
            xd = -30;
            yd = 0;
            break;
        case 'Tem':
            x1 = -480;
            y1 = 60;
            x2 = -200;
            y2 = 60;
            x3 = -200;
            y3 = -60;
            x4 = -480;
            y4 = -60;
            xd = 0;
            yd = -30;
        default:
            break;
    }
    
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2);
    _ctx.lineTo(x3, y3);
    _ctx.lineTo(x4, y4);
    _ctx.moveTo(x1 + xd, y1 + yd);
    _ctx.lineTo(x2 + xd, y2 + yd);
    _ctx.moveTo(x1 + 2 * xd, y1 + 2 * yd);
    _ctx.lineTo(x2 + 2 * xd, y2 + 2 * yd);
    _ctx.moveTo(x1 + 3 * xd, y1 + 3 * yd);
    _ctx.lineTo(x2 + 3 * xd, y2 + 3 * yd);
    _ctx.fillStyle = "#CA6800";
    _ctx.fill();
    _ctx.lineWidth = 8;
    _ctx.strokeStyle = "#804000";
    _ctx.stroke();
}

/**
 * CircumferentialBuckle buckle
 *
 * @class CircumferentialBuckle
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
ED.CircumferentialBuckle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CircumferentialBuckle";

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CircumferentialBuckle.prototype = new ED.Doodle;
ED.CircumferentialBuckle.prototype.constructor = ED.CircumferentialBuckle;
ED.CircumferentialBuckle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CircumferentialBuckle.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CircumferentialBuckle.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-410, -320);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +4);
}

/**
 * Sets default parameters
 */
ED.CircumferentialBuckle.prototype.setParameterDefaults = function()
{
    this.arc = 140 * Math.PI/180;
    this.apexY = -320;
    this.rotation = -45 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CircumferentialBuckle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CircumferentialBuckle.superclass.draw.call(this, _point);
    
	// Radii
    var ro = 320;
    if (-350 > this.apexY && this.apexY > -380) ro = 350;
    else if (this.apexY < -380) ro = 410;
    var ri = 220;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of CircumferentialBuckle
	var topRightX = ro * Math.sin(theta);
	var topRightY = - ro * Math.cos(theta);
	var topLeftX = - ro * Math.sin(theta);
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
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Gutter path
        ctx.beginPath();
        
        var gut = 30;
        
        rgi = ri + (ro - ri - gut)/2;
        rgo = ro - (ro - ri - gut)/2;
        
        // Arc across
        ctx.arc(0, 0, rgo, arcStart, arcEnd, true);
        
        // Arc back
        ctx.arc(0, 0, rgi, arcEnd, arcStart, false);
        
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, -ro));
	
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
ED.CircumferentialBuckle.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.apexY <= -380) returnString = "280 circumferential buckle ";
    else if (this.apexY <= -350) returnString = "279 circumferential buckle ";
	else returnString = "277 circumferential buckle ";
    
    // Location (clockhours)
    if (this.arc > Math.PI * 1.8) returnString += "encirclement";
    else returnString += this.clockHourExtent() + " o'clock";
	
	return returnString;
}


/**
 * BuckleSuture
 *
 * @class BuckleSuture
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
ED.BuckleSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BuckleSuture";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BuckleSuture.prototype = new ED.Doodle;
ED.BuckleSuture.prototype.constructor = ED.BuckleSuture;
ED.BuckleSuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BuckleSuture.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.BuckleSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.willReport = false;
}

/**
 * Sets default parameters
 */
ED.BuckleSuture.prototype.setParameterDefaults = function()
{
    this.arc = 15 * Math.PI/180;
    this.apexY = -320;
    
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BuckleSuture.superclass.draw.call(this, _point);

    // If Buckle there, take account of  size
    var ro = 340;
    var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
    if (doodle) ro = -doodle.apexY + 20;
    
    var ri = 200;
    
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
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
    this.isFilled = false;
	ctx.strokeStyle = "#666";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Calculate location of suture
        r = ri + (ro - ri)/2;
        var sutureX = r * Math.sin(theta);
        var sutureY = - r * Math.cos(theta);
        
        ctx.beginPath();
        ctx.arc(sutureX, sutureY,5,0,Math.PI*2,true);
        ctx.moveTo(sutureX + 20, sutureY + 20);
        ctx.lineTo(sutureX, sutureY);
        ctx.lineTo(sutureX + 20, sutureY - 20);
        
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * EncirclingBand buckle
 *
 * @class EncirclingBand
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
ED.EncirclingBand = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "EncirclingBand";

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.EncirclingBand.prototype = new ED.Doodle;
ED.EncirclingBand.prototype.constructor = ED.EncirclingBand;
ED.EncirclingBand.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.EncirclingBand.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.EncirclingBand.prototype.setParameterDefaults = function()
{
    this.rotation = -45 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EncirclingBand.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EncirclingBand.superclass.draw.call(this, _point);
    
	// Radii
    var r = 270;
    // If Buckle there, take account of  size
    var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
    if (doodle)
    {
        var da = doodle.apexY;
        if (-350 > da && da > -380) r = 286;
        else if (da < -380) r = 315;
    }
    
    var ro = r + 15;
    var ri = r - 15;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Watzke
        ctx.beginPath();
        
        var theta = Math.PI/16;
        
        // Arc across to mirror image point on the other side
        ctx.arc(0, 0, ro + 10, theta, -theta, true);
        
        // Arc back to mirror image point on the other side
        ctx.arc(0, 0, ri - 10, -theta, theta, false);
        
        // Close path
        ctx.closePath();
        ctx.lineWidth = 6;
        ctx.stroke();
	}
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EncirclingBand.prototype.description = function()
{
    var returnString = "Encircling band, with Watzke in ";
    
    // Get side
    if(this.drawing.eye == ED.eye.Right)
	{
		var isRightSide = true;
	}
	else
	{
		var isRightSide = false;
	}
	
	// Use trigonometry on rotation field to determine quadrant
    var angle = this.rotation + Math.PI/2;
	returnString = returnString + (Math.cos(angle) > 0?"supero":"infero");
	returnString = returnString + (Math.sin(angle) > 0?(isRightSide?"nasal":"temporal"):(isRightSide?"temporal":"nasal"));
	returnString = returnString + " quadrant";
    
	return returnString;
}

/**
 * Drainage site
 *
 * @class DrainageSite
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
ED.DrainageSite = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DrainageSite";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DrainageSite.prototype = new ED.Doodle;
ED.DrainageSite.prototype.constructor = ED.DrainageSite;
ED.DrainageSite.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.DrainageSite.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.DrainageSite.prototype.setParameterDefaults = function()
{
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DrainageSite.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DrainageSite.superclass.draw.call(this, _point);
    
    // Radii
    var ro = 440;
    var ri = 360;
    
	// Calculate parameters for arcs
	var theta = Math.PI/30;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Line to point
	ctx.lineTo(0, -ri);;
    
	// Close path
	ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#777";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DrainageSite.prototype.groupDescription = function()
{
	return "Drainage site at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DrainageSite.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * RadialSponge
 *
 * @class RadialSponge
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
ED.RadialSponge = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RadialSponge";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RadialSponge.prototype = new ED.Doodle;
ED.RadialSponge.prototype.constructor = ED.RadialSponge;
ED.RadialSponge.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.RadialSponge.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.RadialSponge.prototype.setParameterDefaults = function()
{
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RadialSponge.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RadialSponge.superclass.draw.call(this, _point);
    
    // Radii
    var y = -220;
    var h = 200;
    var w = 80;
    
	// Boundary path
	ctx.beginPath();
    
    ctx.moveTo(-w/2, y);
    ctx.lineTo(-w/2, y - h);
	ctx.lineTo(w/2, y - h);
	ctx.lineTo(w/2, y);
    
	// Close path
	ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "lightgray";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Knot
        ctx.arc(0, y - h + 40,5,0,Math.PI*2,true);
        ctx.lineTo(-20, y - h + 30);
        ctx.moveTo(0, y - h + 40);
        ctx.lineTo(20, y - h + 30);
        
        // Suture
        ctx.moveTo(-w/2 - 20, y - 40);
        ctx.lineTo(-w/2 - 20, y - h + 40);
        ctx.lineTo(w/2 + 20, y - h + 40);
        ctx.lineTo(w/2 + 20, y - 40);
        ctx.closePath();
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.RadialSponge.prototype.groupDescription = function()
{
	return "Radial sponge at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RadialSponge.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Sclerostomy - bind an HTML element with 'overallGauge' parameter in order to achieve one way binding
 *
 * Also an example of using 'spare' properties to save otherwise unsaved parameters
 *
 * @class Sclerostomy
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
ED.Sclerostomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Sclerostomy";
    
    // Private parameters
    this.parsPlana = -560;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.overallGauge = '23g';
    this.gauge = '23g';
    this.isSutured = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Sclerostomy.prototype = new ED.Doodle;
ED.Sclerostomy.prototype.constructor = ED.Sclerostomy;
ED.Sclerostomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Sclerostomy.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Sclerostomy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-660, -460);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['overallGauge'] = {kind:'derived', type:'string', list:['20g', '23g', '25g', '27g'], animate:false};
    this.parameterValidationArray['gauge'] = {kind:'derived', type:'string', list:['20g', '23g', '25g', '27g'], animate:false};
    this.parameterValidationArray['isSutured'] = {kind:'derived', type:'bool', display:true};
}

/**
 * Sets default parameters
 */
ED.Sclerostomy.prototype.setParameterDefaults = function()
{
    this.apexY = -600;
    this.gauge = "23g";
    this.radius = 50;
    this.isSutured = false;
    
    this.setRotationWithDisplacements(60,-45);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Sclerostomy.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -610) returnArray['gauge'] = "20g";
            else if (_value < -560) returnArray['gauge'] = "23g";
            else if (_value < -510) returnArray['gauge'] = "25g";
            else returnArray['gauge'] = "27g";
            break;
        
        case 'overallGauge':
            returnArray['gauge'] = _value;
            break;
            
        case 'gauge':
            if (_value == "20g") returnArray['apexY'] = -650;
            else if (_value == "23g") returnArray['apexY'] = -600;
            else if (_value == "25g") returnArray['apexY'] = -550;
            else returnArray['apexY'] = -500;
            break;
            
        case 'radius':
            if (_value < 100) returnArray['isSutured'] = false;
            else returnArray['isSutured'] = true;
            break;
            
        case 'isSutured':
            if (_value) returnArray['radius'] = 150;
            else returnArray['radius'] = 50;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Sclerostomy.prototype.draw = function(_point)
{console.log(this.radius);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Sclerostomy.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-60, this.parsPlana - 120, 120, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Draw different shape according to gauge
        switch (this.gauge)
        {
            case "20g":
                ctx.beginPath();
                // Use arcTo to create an ellipsoid

                ctx.moveTo(-50, this.parsPlana);
                ctx.bezierCurveTo(-30, this.parsPlana - 30, 30, this.parsPlana - 30, 50, this.parsPlana);
                ctx.bezierCurveTo(30, this.parsPlana + 30, -30, this.parsPlana + 30, -50, this.parsPlana);
                ctx.closePath();
                ctx.fillStyle = "red";
                ctx.fill();
                break;
            
            case "23g":
                ctx.beginPath();
                ctx.rect(-60, this.parsPlana - 120, 120, 60);
                ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-30, this.parsPlana - 60, 60, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-30, this.parsPlana, 60, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
                
            case "25g":
                ctx.beginPath();
                ctx.rect(-50, this.parsPlana - 120, 100, 60);
                ctx.fillStyle = "rgba(255, 128, 0, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-20, this.parsPlana - 60, 40, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-20, this.parsPlana, 40, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
                
            case "27g":
                ctx.beginPath();
                ctx.rect(-40, this.parsPlana - 120, 80, 60);
                ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-15, this.parsPlana - 60, 30, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-15, this.parsPlana, 30, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
        }
        ctx.fill();
        
        // Draw suture
        if (this.isSutured || this.gauge == "20g")
        {
            ctx.beginPath();
            ctx.moveTo(-40, this.parsPlana + 40);
            ctx.lineTo(-40, this.parsPlana - 40);
            ctx.lineTo(+40, this.parsPlana + 40);
            ctx.lineTo(+40, this.parsPlana - 40);
            ctx.lineTo(-40, this.parsPlana + 40);
            
            ctx.lineWidth = 6;
            ctx.strokeStyle = "rgba(0,0,120,0.7)";
            ctx.closePath();
            ctx.stroke();
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
 * Draws extra items if the doodle is highlighted
 */
ED.Sclerostomy.prototype.drawHighlightExtras = function()
{
    // Get context
	var ctx = this.drawing.context;
    
    // Draw text description of gauge
    ctx.lineWidth=1;
    ctx.fillStyle="gray";
    ctx.font="64px sans-serif";
    ctx.fillText(this.gauge, 80, this.parsPlana + 20);
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Sclerostomy.prototype.groupDescription = function()
{
	return "Sclerostomies at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.description = function()
{
    // Sutured?
    var sutured = this.isSutured?" (sutured)":"";
    
    // Location (clockhours)
	return this.clockHour() + sutured;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * Chandelier (single)
 *
 * @class ChandelierSingle
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
ED.ChandelierSingle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ChandelierSingle";
    
    // Private parameters
    this.parsPlana = -560;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ChandelierSingle.prototype = new ED.Doodle;
ED.ChandelierSingle.prototype.constructor = ED.ChandelierSingle;
ED.ChandelierSingle.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ChandelierSingle.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ChandelierSingle.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(180, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChandelierSingle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ChandelierSingle.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-60, this.parsPlana - 60, 120, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trocar
        ctx.beginPath();
        ctx.moveTo(-20, this.parsPlana + 60);
        ctx.lineTo(+20, this.parsPlana + 60);
        ctx.lineTo(+20, this.parsPlana + 120);
        ctx.lineTo(0, this.parsPlana + 140);
        ctx.lineTo(-20, this.parsPlana + 120);
        ctx.lineTo(-20, this.parsPlana + 60);
        ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.rect(-60, this.parsPlana, 120, 60);
        ctx.fillStyle = "rgba(120, 120, 120, 1)";
        ctx.fill();
        
        // Fibre optic
        ctx.beginPath();
        ctx.moveTo(0, this.parsPlana);
        ctx.bezierCurveTo(0, this.parsPlana - 50, 50, this.parsPlana - 100, 100, this.parsPlana - 100);
        ctx.lineWidth = 40;
        ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
        ctx.stroke();
    }

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ChandelierSingle.prototype.groupDescription = function()
{
	return "Chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChandelierSingle.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Chandelier (double)
 *
 * @class ChandelierDouble
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
ED.ChandelierDouble = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ChandelierDouble";
    
    // Private parameters
    this.parsPlana = -560;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ChandelierDouble.prototype = new ED.Doodle;
ED.ChandelierDouble.prototype.constructor = ED.ChandelierDouble;
ED.ChandelierDouble.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ChandelierDouble.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ChandelierDouble.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(180, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChandelierDouble.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ChandelierDouble.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-120, this.parsPlana - 60, 240, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trocars
        ctx.beginPath();
        var d = -80;
        ctx.moveTo(d - 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 120);
        ctx.lineTo(d, this.parsPlana + 140);
        ctx.lineTo(d - 20, this.parsPlana + 120);
        ctx.lineTo(d - 20, this.parsPlana + 60);
        var d = 80;
        ctx.moveTo(d - 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 120);
        ctx.lineTo(d, this.parsPlana + 140);
        ctx.lineTo(d - 20, this.parsPlana + 120);
        ctx.lineTo(d - 20, this.parsPlana + 60);
        ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.rect(-120, this.parsPlana, 240, 60);
        ctx.fillStyle = "rgba(120, 120, 120, 1)";
        ctx.fill();
        
        // Fibre optic
        ctx.beginPath();
        ctx.moveTo(0, this.parsPlana);
        ctx.bezierCurveTo(0, this.parsPlana - 50, 50, this.parsPlana - 100, 100, this.parsPlana - 100);
        ctx.lineWidth = 40;
        ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
        ctx.stroke();
    }
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ChandelierDouble.prototype.groupDescription = function()
{
	return "Twin chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChandelierDouble.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Corneal erosion
 *
 * @class CornealErosion
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
ED.CornealErosion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealErosion";
    
    // Doodle specific property
    this.isInVisualAxis = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealErosion.prototype = new ED.Doodle;
ED.CornealErosion.prototype.constructor = ED.CornealErosion;
ED.CornealErosion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealErosion.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealErosion.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);
}

/**
 * Sets default parameters
 */
ED.CornealErosion.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    this.scaleX = 1.5;
    this.scaleY = 1;
    
    this.setOriginWithDisplacements(0,25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealErosion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealErosion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealErosion
    var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Properties
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(230, 230, 230, 0.25)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.CornealErosion.prototype.groupDescription = function()
{
	return "Removal of some corneal epithelium";
}

/**
 * Cutter Peripheral iridectomy
 *
 * @class CutterPI
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
ED.CutterPI = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CutterPI";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CutterPI.prototype = new ED.Doodle;
ED.CutterPI.prototype.constructor = ED.CutterPI;
ED.CutterPI.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.CutterPI.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.CutterPI.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(160,40);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CutterPI.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CutterPI.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Draw base
    ctx.arc(0, -324, 40, 0, 2 * Math.PI, true);
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CutterPI.prototype.groupDescription = function()
{
    return "Cutter iridectomy/s";
}

/**
 * Scleral incision
 *
 * @class ScleralIncision
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
ED.ScleralIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ScleralIncision";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ScleralIncision.prototype = new ED.Doodle;
ED.ScleralIncision.prototype.constructor = ED.ScleralIncision;
ED.ScleralIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ScleralIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.ScleralIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/16, Math.PI/2);
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.ScleralIncision.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/8;
    this.setRotationWithDisplacements(60,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ScleralIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ScleralIncision.superclass.draw.call(this, _point);
	
    // Radii
    var r =  560;
    var d = 40;
    var ro = r + d;
    var ri = r - d;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,200,0)";
    
    // Set line attributes
    ctx.lineWidth = 5;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(120,120,120,0)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // New path
        ctx.beginPath();
        
        // Arc across
        ctx.arc(0, 0, r, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
        
        // Sutures
        var sutureSeparationAngle = 0.2;
        var p = new ED.Point(0, 0);
        var phi = theta - sutureSeparationAngle/2;
        
        do
        {
            p.setWithPolars(r - d, phi);
            ctx.moveTo(p.x, p.y);
            p.setWithPolars(r + d, phi);
            ctx.lineTo(p.x, p.y);
            
            phi = phi - sutureSeparationAngle;
        } while(phi > -theta);
        
        // Set line attributes
        ctx.lineWidth = 6;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
        
        // Draw incision
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
    
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
ED.ScleralIncision.prototype.groupDescription = function()
{
	return "Scleral incision at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralIncision.prototype.description = function()
{
	return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralIncision.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}
