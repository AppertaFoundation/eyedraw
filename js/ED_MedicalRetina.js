/**
 * @fileOverview Contains doodle subclasses for Medical Retina
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.9
 *
 * Modification date: 20th May 2011
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
 * PostPole template with disk and arcades
 *
 * @class PostPole
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
ED.PostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostPole";
    
    // Derived parameters
    this.cdRatio;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostPole.prototype = new ED.Doodle;
ED.PostPole.prototype.constructor = ED.PostPole;
ED.PostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostPole.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PostPole.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-80, -8);
    
    // Update component of validation array for simple parameterss
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -8);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['cdRatio'] = {kind:'derived', type:'float', range:new ED.Range(0, 1), precision:1, animate:true};
    
    // Slow down ApexY animation for this doodle (small scope)
    this.parameterValidationArray['apexY']['delta'] = 5;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostPole.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('cdRatio', '0.5');
    
    // Put macula in middle
    if(this.drawing.eye != ED.eye.Right)
    {
        this.originX = -300;
    }
    else
    {
        this.originX = 300;
    }
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostPole.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {           
        case 'apexY':
            returnArray['cdRatio'] = -_value/80;
            break;

        case 'cdRatio':
            returnArray['apexY'] = -(+_value * 80);
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostPole.superclass.draw.call(this, _point);
    
    // Disk radius
    var rd = 84;
    
	// Boundary path
	ctx.beginPath();
    
	// Optic disk
	ctx.arc(0, 0, rd, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(249,187,76,1)";
    ctx.fillStyle = "rgba(249,187,76,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Optic cup
        ctx.arc(0, 0, -this.apexY, 2 * Math.PI, 0, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.lineWidth = 4;
		ctx.stroke();
        
        // Arcades
        ctx.beginPath();
        
        // These values different for right and left side
        if (this.drawing.eye != ED.eye.Right)
        {
            var startX = 600;
            var midX1 = 350;
            var midX2 = 0;
            var midX3 = 0;
            var endX1 = 0;
            var endX2 = -50;
            var endX3 = -100;
            var foveaX = 300;
        }
        else
        {
            var startX = -600;
            var midX1 = -350;
            var midX2 = 0;
            var midX3 = 0;
            var endX1 = 0;
            var endX2 = 50;
            var endX3 = 100;
            var foveaX = -300;
        }
        
        // Superior arcades
        ctx.moveTo(startX, -100);
        ctx.bezierCurveTo(midX1, -500, midX2, -200, midX3, -24);
        ctx.bezierCurveTo(endX1, -80, endX2, -140, endX3, -160);
        
        // Inferior arcades
        ctx.moveTo(endX3, 160);
        ctx.bezierCurveTo(endX2, 140, endX1, 80, midX3, 24);
        ctx.bezierCurveTo(midX2, 200, midX1, 500, startX, 100);
        
		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);
		
		// Draw arcades
        ctx.lineWidth = 24;
        ctx.line
        ctx.strokeStyle = "red";
		ctx.stroke();
        
        // One disk diameter
//        ctx.beginPath();
//        ctx.arc(0, 0, rd, 2 * Math.PI, 0, false);
//        ctx.lineWidth = 8;
//        ctx.strokeStyle = "gray";
//        ctx.stroke();
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
ED.PostPole.prototype.description = function()
{
	return "Cup-disk ratio of " + this.getParameter('cdRatio');
}

