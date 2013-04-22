/**
 * @fileOverview Contains doodle subclasses for Strabismus and Orthoptics
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 22nd October 2011
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
 * Template for strabismus surgery
 *
 * @class StrabOpTemplate
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
ED.StrabOpTemplate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "StrabOpTemplate";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.StrabOpTemplate.prototype = new ED.Doodle;
ED.StrabOpTemplate.prototype.constructor = ED.StrabOpTemplate;
ED.StrabOpTemplate.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.StrabOpTemplate.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isUnique = true;
    this.isDeletable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.StrabOpTemplate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.StrabOpTemplate.superclass.draw.call(this, _point);
    
    // Drawing properties
    var insertionY = -200;
    var insertionHalfWidth = 70;
	
	// Boundary path
	ctx.beginPath();
	
	// Cornea
	ctx.arc(0,0,80,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(100, 200, 250, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Pupil
        ctx.beginPath();
        ctx.arc(0,0,30,0,Math.PI*2,true);
        ctx.fillStyle = "black";
        ctx.fill();
        
        // Insertions
        ctx.beginPath();
        ctx.moveTo(-insertionHalfWidth, insertionY);
        ctx.lineTo(insertionHalfWidth, insertionY);
        ctx.moveTo(insertionY, -insertionHalfWidth);
        ctx.lineTo(insertionY, insertionHalfWidth);
        ctx.moveTo(-insertionHalfWidth, -insertionY);
        ctx.lineTo(insertionHalfWidth, -insertionY);
        ctx.moveTo(-insertionY, -insertionHalfWidth);
        ctx.lineTo(-insertionY, insertionHalfWidth);
        ctx.lineWidth = 16;
        ctx.strokeStyle = "brown";
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * A rectus muscle
 *
 * @class Rectus
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
ED.Rectus = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Rectus";
    
    // Private parameters
    this.insertionY = -200;
    this.hangback = false;
    this.canTranspose = true;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.recession = 0;
    this.transposition = 'None';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Rectus.prototype = new ED.Doodle;
ED.Rectus.prototype.constructor = ED.Rectus;
ED.Rectus.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rectus.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Rectus.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['recession'] = {kind:'derived', type:'float', range:new ED.Range(-12.5, 6.5), precision:1, animate:true};
    this.parameterValidationArray['transposition'] = {kind:'derived', type:'string', list:['Up', 'None', 'Down'], animate:true};
    this.parameterValidationArray['canTranspose'] = {kind:'derived', type:'bool', animate:false};
}

/**
 * Sets default parameters
 */
ED.Rectus.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('recession', '0');
    this.setParameterFromString('transposition', 'None');
    this.apexY = this.insertionY;
    this.canTranspose = true;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Rectus.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            returnArray['recession'] = Math.round(2 * (_value - this.insertionY)/16)/2;
            break;

        case 'recession':
            returnArray['apexY'] = _value * 16 + this.insertionY;
            break;
            
        case 'apexX':
            if (this.rotation > 0 && this.rotation < Math.PI)
            {
                if (_value < 0) returnArray['transposition'] = "Up";
                else if (_value > 0) returnArray['transposition'] = "Down";
                else returnArray['transposition'] = "None";
            }
            else
            {
                if (_value < 0) returnArray['transposition'] = "Down";
                else if (_value > 0) returnArray['transposition'] = "Up";
                else returnArray['transposition'] = "None";
            }
            break;
            
        case 'transposition':
            switch (_value)
            {
                case "Up":
                    if (this.rotation > 0 && this.rotation < Math.PI)
                    {
                        returnArray['apexX'] = -50;
                    }
                    else
                    {
                        returnArray['apexX'] = +50;
                    }
                    break;
                case "Down":
                    if (this.rotation > 0 && this.rotation < Math.PI)
                    {
                        returnArray['apexX'] = +50;
                    }
                    else
                    {
                        returnArray['apexX'] = -50;
                    }
                    break;
                case "None":
                    returnArray['apexX'] = +0;
                    break;
            }
            break;
    }
    
    // Constrain to a cross shaped path
    var cw = 15;
    if (this.apexY > this.insertionY - cw && this.apexY < this.insertionY + cw && this.canTranspose)
    {
        this.parameterValidationArray['apexX']['range'].setMinAndMax(-100, +100);
    }
    else
    {
        this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    }
    if (this.apexX > - cw && this.apexX < cw)
    {
        this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
    }
    else
    {
        this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -200);
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Rectus.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Rectus.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var muscleHalfWidth = 60;
    var startY = -450;
	
	// Rectus
	ctx.moveTo(-muscleHalfWidth, startY);
    ctx.lineTo(muscleHalfWidth, startY);
    ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
    ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);   
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(255, 140 , 80, 1)";
    ctx.strokeStyle = "rgba(255, 184, 93, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Indicate a recection by continuing muscle beyond insertion with different fill
        if (this.insertionY < this.apexY)
        {
            // x coordinate of left side of muscle at insertion
            var xi = -muscleHalfWidth + this.apexX * (this.insertionY - startY)/(this.apexY - startY);
            
            // Part of muscle anterior to insertion
            ctx.beginPath();
            ctx.moveTo(xi, this.insertionY);
            ctx.lineTo(xi + 2 * muscleHalfWidth, this.insertionY);
            ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
            ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);
            ctx.closePath();

            ctx.fillStyle = "rgba(255, 220, 140, 1)";
            ctx.fill();
        }
        
        // Suture
        if (!(this.apexX == 0 && this.apexY == this.insertionY)) //&& this.recession() == "0.0"))
        {
            var margin = 15;
            var sutureLength = 15;
            var indent = 10;
            var bite = 20;
            
            // Y coordinate of muscle bite
            var ym;
            if (this.insertionY > this.apexY)
            {
                ym = this.apexY;
            }
            else
            {
                ym = this.insertionY;
            }
            
            // Y coordinate of knot
            var yk;
            if (!this.hangback && this.insertionY > this.apexY)
            {
                yk = this.apexY + margin;
            }
            else
            {
                yk = this.insertionY + margin;
            }
            
            // X coordinate
            var x = this.apexX;

            ctx.beginPath();
            ctx.moveTo(x, yk);
            ctx.lineTo(x - sutureLength, yk + sutureLength);
            ctx.moveTo(x + sutureLength, yk + sutureLength);
            ctx.lineTo(x, yk);
            ctx.arc(x, yk, 4, 0, Math.PI*2, true);            
            ctx.moveTo(x, yk);
            ctx.lineTo(x - muscleHalfWidth + indent, yk);
            ctx.lineTo(x - muscleHalfWidth + indent, ym);
            ctx.moveTo(x - muscleHalfWidth + indent, ym - margin);
            ctx.lineTo(x - muscleHalfWidth + indent + bite, ym - margin);
            ctx.moveTo(x + muscleHalfWidth - indent - bite, ym - margin);
            ctx.lineTo(x + muscleHalfWidth - indent, ym - margin);
            ctx.moveTo(x + muscleHalfWidth - indent, ym);  
            ctx.lineTo(x + muscleHalfWidth - indent, yk);             
            ctx.lineTo(x, yk);      
            
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
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
 * HVTGrid
 *
 * @class HVTGrid
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
ED.HVTGrid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HVTGrid";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HVTGrid.prototype = new ED.Doodle;
ED.HVTGrid.prototype.constructor = ED.HVTGrid;
ED.HVTGrid.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.HVTGrid.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
    this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVTGrid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HVTGrid.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Radius of HVT doodle
    var ro = 125;
    var d = ro * 2;
	ctx.moveTo(-2 * d, 0);
    ctx.lineTo(+2 * d, 0);
	ctx.moveTo(-d, -d);
    ctx.lineTo(-d, +d);
	ctx.moveTo(+d, -d);
    ctx.lineTo(+d, +d);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * HVT
 *
 * @class HVT
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
ED.HVT = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HVT";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.hor = 'None';
    this.ver = 'None';
    this.tor = 'None';
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HVT.prototype = new ED.Doodle;
ED.HVT.prototype.constructor = ED.HVT;
ED.HVT.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HVT.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.HVT.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
    
    // Adjust ranges for simple parameters
    this.parameterValidationArray['originY']['range'] = new ED.Range(-100, +100);
    this.parameterValidationArray['rotation']['range'] = new ED.Range(0, Math.PI/2);
    
    // Speed up horizontal and vertical animation
    this.parameterValidationArray['originX']['delta'] = 30;
    this.parameterValidationArray['originY']['delta'] = 30;
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['hor'] = {kind:'derived', type:'string', list:['XT', 'None', 'ET'], animate:true};
    this.parameterValidationArray['ver'] = {kind:'derived', type:'string', list:['R/L', 'None', 'L/R'], animate:true};
    this.parameterValidationArray['tor'] = {kind:'derived', type:'string', list:['Excyclotorsion', 'None', 'Incyclotorsion'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HVT.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('hor', 'None');
    this.setParameterFromString('tor', 'None');
    //this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.HVT.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();

    // Value of centre for right eye
    var centre = -250;
    
    switch (_parameter)
    {
        case 'originX':
            var fudge = 20;
            if (_value < centre - fudge)
            {
                returnArray['hor'] = 'XT';
            }
            else if (_value > centre + fudge)
            {
                returnArray['hor'] = 'ET';
            }
            else
            {
                returnArray['hor'] = 'None';
            }
            break;

        case 'originY':
            var fudge = 20;
            if (_value < 0 - fudge)
            {
                returnArray['ver'] = 'R/L';
            }
            else if (_value > 0 + fudge)
            {
                returnArray['ver'] = 'L/R';
            }
            else
            {
                returnArray['ver'] = 'None';
            }
            break;
            
        case 'rotation':
            var fudge = Math.PI/16;
            if (_value < Math.PI/4 - fudge)
            {
                returnArray['tor'] = 'Excyclotorsion';
            }
            else if (_value > Math.PI/4 + fudge)
            {
                returnArray['tor'] = 'Incyclotorsion';
            }
            else
            {
                returnArray['tor'] = 'None';
            }
            break;

        case 'hor':
            switch (_value)
            {
                case 'XT':
                    returnArray['originX'] = centre - 100;
                    break;
                    
                case 'ET':
                    returnArray['originX'] = centre + 100;
                    break;
                    
                default:
                    returnArray['originX'] = centre;
                    break;
            }
            break;

        case 'ver':
            switch (_value)
            {
                case 'R/L':
                    returnArray['originY'] = 0 - 100;
                    break;
                    
                case 'L/R':
                    returnArray['originY'] = 0 + 100;
                    break;
                    
                default:
                    returnArray['originY'] = 0;
                    break;
            }
            break;
            
        case 'tor':
            switch (_value)
            {
                case 'Excyclotorsion':
                    returnArray['rotation'] = 0;
                    break;
                
                case 'Incyclotorsion':
                    returnArray['rotation'] = Math.PI/2;
                    break;
                    
                default:
                    returnArray['rotation'] = Math.PI/4;
                    break;
            }
            break;
    }

    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVT.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HVT.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 125;
    var ri = 40;
    
    // Use polar coordinates to draw axis line and handle
    var phi = 1.75 * Math.PI;
    var p = new ED.Point(0,0);
    
	// Boundary path
	ctx.beginPath();
    
	// Circle
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Axis lines
        var d = 5;
        ctx.beginPath();
        
        // Define axis
        p.setWithPolars(ro - d, phi);
        ctx.moveTo(p.x, p.y);
        p.setWithPolars(ri + d, phi);
        ctx.lineTo(p.x, p.y);
        p.setWithPolars(-ro + d, phi);
        ctx.moveTo(p.x, p.y);
        p.setWithPolars(-ri - d, phi);
        ctx.lineTo(p.x, p.y);
        
        // Draw it
        ctx.lineWidth = 20;
        ctx.strokeStyle ="rgba(100, 100, 100, 0.5)";
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    p.setWithPolars(ro, phi);
	this.handleArray[1].location = this.transform.transformPoint(p);
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

