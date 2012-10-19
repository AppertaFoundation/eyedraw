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

