/**
 * @fileOverview Contains doodle subclasses for general use
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 1.0
 *
 * Modification date: 6th October 2012
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
 * Surgeon
 *
 * @class Surgeon
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
ED.Surgeon = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Set classname
	this.className = "Surgeon";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Surgeon.prototype = new ED.Doodle;
ED.Surgeon.prototype.constructor = ED.Surgeon;
ED.Surgeon.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Surgeon.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.isShowHighlight = true;
	this.isOrientated = true;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = true;
    this.snapToPoints = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+100, +500);

    // Array of points to snap to
    this.pointsArray = new Array();
    var point = new ED.Point(0, -300);
    this.pointsArray.push(point);
    var point = new ED.Point(212, -212);
    this.pointsArray.push(point);
    var point = new ED.Point(300, 0);
    this.pointsArray.push(point);
    var point = new ED.Point(212, 212);
    this.pointsArray.push(point);
    var point = new ED.Point(0,300);
    this.pointsArray.push(point);
    var point = new ED.Point(-212, 212);
    this.pointsArray.push(point);
    var point = new ED.Point(-300,0);
    this.pointsArray.push(point);
    var point = new ED.Point(-212, -212);
    this.pointsArray.push(point);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Surgeon.prototype.setParameterDefaults = function()
{
    this.originY = -300;
    
    if (this.drawing.eye == ED.eye.Left)
    {
        this.originX = 300;
        this.originY = 0;
        this.rotation = 2 * Math.PI/4;
    }
    else
    {
        this.originX = -300;
        this.originY = 0;
        this.rotation = 6 * Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Surgeon.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Surgeon.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.2;
    
    // Surgeon
    ctx.moveTo(0 * s, -200 * s);
    ctx.bezierCurveTo( -100 * s, -250 * s, -145 * s, -190 * s, -200 * s, -180 * s);
    ctx.bezierCurveTo( -310 * s, -160 * s, -498 * s, -75 * s, -500 * s, 0 * s);
    ctx.bezierCurveTo( -500 * s, 50 * s, -500 * s, 460 * s, -470 * s, 700 * s);
    ctx.bezierCurveTo( -470 * s, 710 * s, -500 * s, 770 * s, -500 * s, 810 * s);
    ctx.bezierCurveTo( -500 * s, 840 * s, -440 * s, 850 * s, -420 * s, 840 * s);
    ctx.bezierCurveTo( -390 * s, 830 * s, -380 * s, 710 * s, -380 * s, 700 * s);
    ctx.bezierCurveTo( -370 * s, 700 * s, -360 * s, 780 * s, -350 * s, 780 * s);
    ctx.bezierCurveTo( -330 * s, 780 * s, -340 * s, 730 * s, -340 * s, 700 * s);
    ctx.bezierCurveTo( -340 * s, 690 * s, -350 * s, 680 * s, -350 * s, 670 * s);
    ctx.bezierCurveTo( -350 * s, 590 * s, -385 * s, 185 * s, -300 * s, 100 * s);
    
    ctx.bezierCurveTo( -150 * s, 140 * s, -250 * s, 200 * s, 0 * s, 300 * s);
    
    ctx.bezierCurveTo( 250 * s, 200 * s, 150 * s, 140 * s, 300 * s, 100 * s);
    ctx.bezierCurveTo( 380 * s, 180 * s, 350 * s, 590 * s, 350 * s, 670 * s);
    ctx.bezierCurveTo( 350 * s, 680 * s, 340 * s, 690 * s, 340 * s, 700 * s);
    ctx.bezierCurveTo( 340 * s, 730 * s, 330 * s, 780 * s, 350 * s, 780 * s);
    ctx.bezierCurveTo( 360 * s, 780 * s, 370 * s, 700 * s, 380 * s, 700 * s);
    ctx.bezierCurveTo( 380 * s, 710 * s, 390 * s, 830 * s, 420 * s, 840 * s);
    ctx.bezierCurveTo( 430 * s, 845 * s, 505 * s, 840 * s, 505 * s, 810 * s);
    ctx.bezierCurveTo( 505 * s, 760 * s, 470 * s, 710 * s, 470 * s, 700 * s);
    ctx.bezierCurveTo( 500 * s, 460 * s, 499 * s, 45 * s, 500 * s, 0 * s);
    ctx.bezierCurveTo( 498 * s, -78 * s, 308 * s, -164 * s, 200 * s, -182 * s);
    ctx.bezierCurveTo( 145 * s, -190 * s, 100 * s, -250 * s, 0 * s, -200 * s);
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,1)";
    
    // Set light blue for surgeon's gown
    var colour = new ED.Colour(0,0,0,1);
    colour.setWithHexString('3AFEFA');
    ctx.fillStyle = colour.rgba();
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(0 * s, -250 * s);
        ctx.bezierCurveTo( -100 * s, -250 * s, -180 * s, -200 * s, -200 * s, -170 * s);
        ctx.bezierCurveTo( -209 * s, -157 * s, -220 * s, -100 * s, -230 * s, -50 * s);
        ctx.bezierCurveTo( -260 * s, -70 * s, -260 * s, -20 * s, -260 * s, 0 * s);
        ctx.bezierCurveTo( -260 * s, 20 * s, -260 * s, 80 * s, -230 * s, 60 * s);
        ctx.bezierCurveTo( -230 * s, 90 * s, -220 * s, 141 * s, -210 * s, 160 * s);
        ctx.bezierCurveTo( -190 * s, 200 * s, -100 * s, 280 * s, -40 * s, 300 * s);
        ctx.bezierCurveTo( -34 * s, 303 * s, -20 * s, 350 * s, 0 * s, 350 * s);
        ctx.bezierCurveTo( 20 * s, 350 * s, 34 * s, 300 * s, 40 * s, 300 * s);
        ctx.bezierCurveTo( 100 * s, 280 * s, 190 * s, 200 * s, 210 * s, 160 * s);
        ctx.bezierCurveTo( 218 * s, 143 * s, 230 * s, 90 * s, 230 * s, 60 * s);
        ctx.bezierCurveTo( 260 * s, 80 * s, 260 * s, 20 * s, 260 * s, 0 * s);
        ctx.bezierCurveTo( 260 * s, -20 * s, 260 * s, -70 * s, 230 * s, -50 * s);
        ctx.bezierCurveTo( 220 * s, -100 * s, 208 * s, -158 * s, 200 * s, -170 * s);
        ctx.bezierCurveTo( 180 * s, -200 * s, 100 * s, -250 * s, 0 * s, -250 * s);
        
        ctx.fill();
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
ED.Surgeon.prototype.getParameter = function(_parameter)
{
    var returnValue;
    var isRE = (this.drawing.eye == ED.eye.Right);
    
    var dial = 2 * Math.PI;
    
    switch (_parameter)
    {
            // Surgeon position
        case 'surgeonPosition':
            if (isRE)
            {
                if (this.rotation < dial/16 ) returnValue = 'Superior';
                else if (this.rotation < 3 * dial/16 ) returnValue = 'Supero-nasal';
                else if (this.rotation < 5 * dial/16 ) returnValue = 'Nasal';
                else if (this.rotation < 7 * dial/16 ) returnValue = 'Infero-nasal';
                else if (this.rotation < 9 * dial/16 ) returnValue = 'Inferior';
                else if (this.rotation < 11 * dial/16) returnValue = 'Infero-temporal';
                else if (this.rotation < 13 * dial/16) returnValue = 'Temporal';
                else if (this.rotation < 15 * dial/16) returnValue = 'Supero-temporal';
                else returnValue = 'Superior';
            }
            else
            {
                if (this.rotation < dial/16 ) returnValue = 'Superior';
                else if (this.rotation < 3 * dial/16 ) returnValue = 'Supero-temporal';
                else if (this.rotation < 5 * dial/16) returnValue = 'Temporal';
                else if (this.rotation < 7 * dial/16) returnValue = 'Infero-temporal';
                else if (this.rotation < 9 * dial/16) returnValue = 'Inferior';
                else if (this.rotation < 11 * dial/16) returnValue = 'Infero-nasal';
                else if (this.rotation < 13 * dial/16) returnValue = 'Nasal';
                else if (this.rotation < 15 * dial/16) returnValue = 'Supero-nasal';
                else returnValue = 'Superior';
            }
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
ED.Surgeon.prototype.setParameter = function(_parameter, _value)
{
    var isRE = (this.drawing.eye == ED.eye.Right);
    switch (_parameter)
    {
            // Surgeon position
        case 'surgeonPosition':
            switch (_value)
        {
            case 'Superior':
                if (isRE)
                {
                    this.originX = 0;
                    this.originY = -300;
                    this.rotation = 0;
                }
                else
                {
                    this.originX = 0;
                    this.originY = -300;
                    this.rotation = 0;
                }
                break;
            case 'Supero-temporal':
                if (isRE)
                {
                    this.originX = -212;
                    this.originY = -212;
                    this.rotation = 7 * Math.PI/4;
                }
                else
                {
                    this.originX = 212;
                    this.originY = -212;
                    this.rotation = Math.PI/4;
                }
                break;
            case 'Temporal':
                if (isRE)
                {
                    this.originX = -300;
                    this.originY = 0;
                    this.rotation =  6 * Math.PI/4;
                }
                else
                {
                    this.originX = 300;
                    this.originY = 0;
                    this.rotation = Math.PI/2;
                }
                break;
            case 'Infero-temporal':
                if (isRE)
                {
                    this.originX = -212;
                    this.originY = 212;
                    this.rotation = 5 * Math.PI/4;
                }
                else
                {
                    this.originX = 212;
                    this.originY = 212;
                    this.rotation = 3 * Math.PI/4;
                }
                break;
            case 'Inferior':
                if (isRE)
                {
                    this.originX = 0;
                    this.originY = 300;
                    this.rotation = Math.PI;
                }
                else
                {
                    this.originX = 0;
                    this.originY = 300;
                    this.rotation = Math.PI;
                }
                break;
            case 'Infero-nasal':
                if (isRE)
                {
                    this.originX = 212;
                    this.originY = 212;
                    this.rotation = 3 * Math.PI/4;
                }
                else
                {
                    this.originX = -212;
                    this.originY = 212;
                    this.rotation = 5 * Math.PI/4;
                }
                break;
            case 'Nasal':
                if (isRE)
                {
                    this.originX = 300;
                    this.originY = 0;
                    this.rotation = 2 * Math.PI/4;
                }
                else
                {
                    this.originX = -300;
                    this.originY = 0;
                    this.rotation = 6 * Math.PI/4;
                }
                break;
            case 'Supero-nasal':
                if (isRE)
                {
                    this.originX = 212;
                    this.originY = -212;
                    this.rotation = 1 * Math.PI/4;
                }
                else
                {
                    this.originX = -212;
                    this.originY = -212;
                    this.rotation = 7 * Math.PI/4;
                }
                break;
            default:
                break;
        }
            break;
            
        default:
            break
    }
}
