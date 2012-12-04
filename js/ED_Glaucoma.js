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
 * Gonioscopy
 *
 * @class Gonioscopy
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
ED.Gonioscopy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Gonioscopy";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Gonioscopy.prototype = new ED.Doodle;
ED.Gonioscopy.prototype.constructor = ED.Gonioscopy;
ED.Gonioscopy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Gonioscopy.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Gonioscopy.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Gonioscopy.prototype.setParameterDefaults = function()
{
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Gonioscopy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Gonioscopy.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, rsl, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trabecular meshwork
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, rtmo, arcStart, arcEnd, true);
        ctx.moveTo(rtmi, 0);
        ctx.arc(0, 0, rtmi, arcEnd, arcStart, false);
        
        // Set line attributes
        ctx.lineWidth = 1;
        
        // Fill style
        var ptrn;
        
        // Pattern
        if (this.apexX < -440)
        {
            if (this.apexY < -440) ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternLight'],'repeat');
            else if (this.apexY < -420) ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternMedium'],'repeat');
            else ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternHeavy'],'repeat');
            ctx.fillStyle = ptrn;
        }
        // Uniform
        else
        {
            if (this.apexY < -440) ctx.fillStyle = "rgba(250, 200, 0, 1)";
            else if (this.apexY < -420) ctx.fillStyle = "rgba(200, 150, 0, 1)";
            else ctx.fillStyle = "rgba(150, 100, 0, 1)";
        }
        
        // Stroke style
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        
        // Draw it
        ctx.fill();
        ctx.stroke();
        
        // Ciliary Body
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, rcbo, arcStart, arcEnd, true);
        ctx.arc(0, 0, rcbi, arcEnd, arcStart, false);
        
        // Draw it
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        ctx.fill();
        
        // Draw radial lines
        var firstAngle = 15;
        var innerPoint = new ED.Point(0,0);
        var outerPoint = new ED.Point(0,0);
        var i = 0;
        
        // Loop through clock face
        for (i = 0; i < 12; i++)
        {
            // Get angle
            var angleInRadians = (firstAngle + i * 30) * Math.PI/180;
            innerPoint.setWithPolars(rcbi, angleInRadians);
            
            // Set new line
            ctx.beginPath();
            ctx.moveTo(innerPoint.x, innerPoint.y);
            
            // Some lines are longer, wider and darker
            if (i == 1 || i == 4 || i == 7 || i == 10)
            {
                outerPoint.setWithPolars(rsl + 80, angleInRadians);
                ctx.lineWidth = 6;
                ctx.strokeStyle = "rgba(20, 20, 20, 1)";
            }
            else
            {
                outerPoint.setWithPolars(rsl, angleInRadians);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(137, 137, 137, 1)";
            }
            
            // Draw line
            ctx.lineTo(outerPoint.x, outerPoint.y);
            ctx.closePath();
            ctx.stroke();
        }
        
        // Iris
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, riro, arcStart, arcEnd, true);
        ctx.arc(0, 0, riri, arcEnd, arcStart, false);
        
        // Set attributes
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(180, 180, 180, 1)";
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        
        // Draw it
        ctx.fill();
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Gonioscopy.prototype.description = function()
{
    var returnValue = "";
    
    if (this.apexX < -440)
    {
        if (this.apexY < -440) returnValue = "Light patchy pigment";
        else if (this.apexY < -420) returnValue = "Medium patchy pigment";
        else returnValue = "Heavy patchy pigment";
    }
    // Uniform
    else
    {
        if (this.apexY < -440) returnValue = "Light homogenous pigment";
        else if (this.apexY < -420) returnValue = "Medium homogenous pigment";
        else returnValue = "Heavy homogenous pigment";
    }

    return returnValue;
}

/**
 * AngleGradeNorth
 *
 * @class AngleGradeNorth
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
ED.AngleGradeNorth = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeNorth";
    
    // Derived parameters
    this.grade = "O";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeNorth.prototype = new ED.Doodle;
ED.AngleGradeNorth.prototype.constructor = ED.AngleGradeNorth;
ED.AngleGradeNorth.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeNorth.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeNorth.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['O', 'I', 'II', 'III', 'IV'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeNorth.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeNorth.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses SCHEIE classificaton
            var returnValue = "O";
            if (-_value > riro) returnValue = "I";
            if (-_value > rcbo) returnValue = "II";
            if (-_value > rtmo) returnValue = "III";
            if (-_value >= rsli) returnValue = "IV";
            returnArray['grade'] = returnValue;
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
            {
                case 'IV':
                    if (-this.apexY >= rsli) returnValue = this.apexY;
                    else returnValue = -rsli;
                    break;
                case 'III':
                    if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case 'II':
                    if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -rcbo;
                    break;
                case 'I':
                    if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                    else returnValue = -riro;
                    break;
                case 'O':
                    returnValue = -riri;
                    break;
            }

            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeNorth.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeNorth.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
  
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeEast
 *
 * @class AngleGradeEast
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
ED.AngleGradeEast = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeEast";
    
    // Derived parameters
    this.grade = "O";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeEast.prototype = new ED.Doodle;
ED.AngleGradeEast.prototype.constructor = ED.AngleGradeEast;
ED.AngleGradeEast.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeEast.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeEast.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['O', 'I', 'II', 'III', 'IV'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeEast.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = Math.PI/2;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeEast.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses SCHEIE classificaton
            var returnValue = "O";
            if (-_value > riro) returnValue = "I";
            if (-_value > rcbo) returnValue = "II";
            if (-_value > rtmo) returnValue = "III";
            if (-_value >= rsli) returnValue = "IV";
            returnArray['grade'] = returnValue;
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
        {
            case 'IV':
                if (-this.apexY >= rsli) returnValue = this.apexY;
                else returnValue = -rsli;
                break;
            case 'III':
                if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                else returnValue = -rtmo;
                break;
            case 'II':
                if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                else returnValue = -rcbo;
                break;
            case 'I':
                if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                else returnValue = -riro;
                break;
            case 'O':
                returnValue = -riri;
                break;
        }
            
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeEast.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeEast.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeSouth
 *
 * @class AngleGradeSouth
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
ED.AngleGradeSouth = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeSouth";
    
    // Derived parameters
    this.grade = "O";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeSouth.prototype = new ED.Doodle;
ED.AngleGradeSouth.prototype.constructor = ED.AngleGradeSouth;
ED.AngleGradeSouth.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeSouth.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeSouth.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['O', 'I', 'II', 'III', 'IV'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeSouth.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = Math.PI;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeSouth.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses SCHEIE classificaton
            var returnValue = "O";
            if (-_value > riro) returnValue = "I";
            if (-_value > rcbo) returnValue = "II";
            if (-_value > rtmo) returnValue = "III";
            if (-_value >= rsli) returnValue = "IV";
            returnArray['grade'] = returnValue;
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
        {
            case 'IV':
                if (-this.apexY >= rsli) returnValue = this.apexY;
                else returnValue = -rsli;
                break;
            case 'III':
                if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                else returnValue = -rtmo;
                break;
            case 'II':
                if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                else returnValue = -rcbo;
                break;
            case 'I':
                if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                else returnValue = -riro;
                break;
            case 'O':
                returnValue = -riri;
                break;
        }
            
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeSouth.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeSouth.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeWest
 *
 * @class AngleGradeWest
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
ED.AngleGradeWest = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeWest";
    
    // Derived parameters
    this.grade = "O";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeWest.prototype = new ED.Doodle;
ED.AngleGradeWest.prototype.constructor = ED.AngleGradeWest;
ED.AngleGradeWest.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeWest.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeWest.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['O', 'I', 'II', 'III', 'IV'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeWest.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = 3 * Math.PI/2;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeWest.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses SCHEIE classificaton
            var returnValue = "O";
            if (-_value > riro) returnValue = "I";
            if (-_value > rcbo) returnValue = "II";
            if (-_value > rtmo) returnValue = "III";
            if (-_value >= rsli) returnValue = "IV";
            returnArray['grade'] = returnValue;
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
        {
            case 'IV':
                if (-this.apexY >= rsli) returnValue = this.apexY;
                else returnValue = -rsli;
                break;
            case 'III':
                if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                else returnValue = -rtmo;
                break;
            case 'II':
                if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                else returnValue = -rcbo;
                break;
            case 'I':
                if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                else returnValue = -riro;
                break;
            case 'O':
                returnValue = -riri;
                break;
        }
            
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeWest.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeWest.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Angle New Vessels
 *
 * @class AngleNV
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
ED.AngleNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleNV";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleNV.prototype = new ED.Doodle;
ED.AngleNV.prototype.constructor = ED.AngleNV;
ED.AngleNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleNV.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleNV.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +250);
}

/**
 * Sets default parameters
 */
ED.AngleNV.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleNV.superclass.draw.call(this, _point);
    
    // AngleNV is at equator
    var ras = rtmo;
	var rir = rtmi;
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of AngleNV
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['NewVesselPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
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
ED.AngleNV.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Angle new vessels over " + degrees.toString() + " degrees";
}

/**
 * Anterior Synechiae
 *
 * @class AntSynech
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
ED.AntSynech = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSynech";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSynech.prototype = new ED.Doodle;
ED.AntSynech.prototype.constructor = ED.AntSynech;
ED.AntSynech.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSynech.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSynech.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -rcbo);
    this.parameterValidationArray['arc']['range'].setMinAndMax(30 * Math.PI/180, Math.PI*2);
}

/**
 * Sets default parameters
 */
ED.AntSynech.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
    this.apexY = -rtmi;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSynech.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSynech.superclass.draw.call(this, _point);
    
    // AntSynech is at equator
    var ras = -this.apexY;
	var rir = riri;
    
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    var outArcStart = - Math.PI/2 + theta - Math.PI/14;
    var outArcEnd = - Math.PI/2 - theta + Math.PI/14;
    
    // Coordinates of 'corners' of AntSynech
	var topRightX = rir * Math.sin(theta);
	var topRightY = - rir * Math.cos(theta);
	var topLeftX = - rir * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, outArcEnd, outArcStart, false);
    
	// Close path
	ctx.closePath();
    
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
	
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
ED.AntSynech.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Anterior synechiae over " + degrees.toString() + " degrees";
}

/**
 * Angle Recession
 *
 * @class AngleRecession
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
ED.AngleRecession = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "AngleRecession";
}

/**
 * Sets superclass and constructor
 */
ED.AngleRecession.prototype = new ED.Doodle;
ED.AngleRecession.prototype.constructor = ED.AngleRecession;
ED.AngleRecession.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleRecession.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleRecession.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +250);
}

/**
 * Sets default parameters
 */
ED.AngleRecession.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleRecession.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleRecession.superclass.draw.call(this, _point);
    
    // AngleRecession is at equator
    var ras = riri - 30;
	var rir = riri;
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    var outArcStart = - Math.PI/2 + theta - Math.PI/24;
    var outArcEnd = - Math.PI/2 - theta + Math.PI/24;
    
    // Coordinates of 'corners' of AngleRecession
	var topRightX = rir * Math.sin(theta);
	var topRightY = - rir * Math.cos(theta);
	var topLeftX = - rir * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, outArcEnd, outArcStart, false);
    
	// Close path
	ctx.closePath();
    
    ctx.fillStyle = "rgba(255, 255, 200, 1.0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
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
ED.AngleRecession.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Angle recession over " + degrees.toString() + " degrees";
}

/**
 * The optic cup (used in conjunection with the optic disc
 *
 * @class OpticDisc
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
ED.OpticDisc = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "OpticDisc";
    
    // Private parameters
    this.numberOfHandles = 8;
    
    // Derived parameters
    this.mode = "Expert";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
    
    // Set visibility of handles
    this.setHandleProperties();
}

/**
 * Sets superclass and constructor
 */
ED.OpticDisc.prototype = new ED.Doodle;
ED.OpticDisc.prototype.constructor = ED.OpticDisc;
ED.OpticDisc.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDisc.prototype.setHandles = function()
{
    // Array of handles for expert mode
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
    }
    
    // Apex handle for basic mode
    this.handleArray[this.numberOfHandles] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.OpticDisc.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isDeletable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-290, -20);
    this.parameterValidationArray['radius']['range'].setMinAndMax(50, 290);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['mode'] = {kind:'derived', type:'string', list:['Basic', 'Expert'], animate:false};
    
    // Create ranges to constrain handles
    this.handleVectorRangeArray = new Array();
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // Full circle in radians
        var cir = 2 * Math.PI;
        
        // Create a range object for each handle
        var range = new Object;
        range.length = new ED.Range(+50, +290);
        range.angle = new ED.Range(((15 * cir/16) + i * cir/8) % cir, ((1 * cir/16) + i * cir/8) % cir);
        this.handleVectorRangeArray[i] = range;
    }
}

/**
 * Sets default parameters
 */
ED.OpticDisc.prototype.setParameterDefaults = function()
{
    this.apexY = -150;

    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
    
    // Populate with handles at equidistant points around circumference
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        var point = new ED.Point(0, 0);
        point.setWithPolars(-this.apexY, i * 2 * Math.PI/this.numberOfHandles);
        this.addPointToSquiggle(point);
    }
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.OpticDisc.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'mode':
            this.setHandleProperties();
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDisc.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OpticDisc.superclass.draw.call(this, _point);
    
	// Radius of disc
	var ro = 300;
    var ri = -this.apexY;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
	
	// Close path
	ctx.closePath();
    
    // Set attributes
	ctx.lineWidth = 2;
    var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "gray";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Begin path
		ctx.beginPath();
        
		// Do a 360 arc
		ctx.arc(0, 0, ro, arcStart, arcEnd, true);
		
	    if (this.mode == "Basic")
	    {
	        // Move to inner circle
		    ctx.moveTo(ri, 0);
		    
			// Arc back the other way
			ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	    }
	    else
	    {
	        // Bezier points
	        var fp;
	        var tp;
	        var cp1;
	        var cp2;
            
	        // Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
	        var phi = 2 * Math.PI/(3 * this.numberOfHandles);
            
	        // Start curve
	        ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
	        
	        // Complete curve segments
	        for (var i = 0; i < this.numberOfHandles; i++)
	        {
	            // From and to points
	            fp = this.squiggleArray[0].pointsArray[i];
	            var toIndex = (i < this.numberOfHandles - 1)?i + 1:0;
	            tp = this.squiggleArray[0].pointsArray[toIndex];
	            
	            // Control points
	            cp1 = fp.tangentialControlPoint(+phi);
	            cp2 = tp.tangentialControlPoint(-phi);
	            
	            // Draw Bezier curve
	            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	        }
	    }
        
        ctx.closePath();
        
	    // Set margin attributes
	    var colour = new ED.Colour(0,0,0,1);
	    colour.setWithHexString('FFA83C');  // Taken from disc margin of a fundus photo
	    ctx.fillStyle = colour.rgba();
        
        // Draw disc margin
        ctx.fill();
        
        // Disc vessels
        ctx.beginPath();
        
        // Vessels start on nasal side of disc
        var sign;
        if (this.drawing.eye == ED.eye.Right)
        {
            sign = -1;
        }
        else
        {
            sign = 1;
        }
        
        // Superotemporal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(400, - sign * Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(450, sign * Math.PI/8);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(500, sign * Math.PI/4);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Inferotemporal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(400, - sign * 7 * Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(450, sign * 7 * Math.PI/8);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(500, sign * 3 * Math.PI/4);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Superonasal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(300, - sign * 2 *  Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(350, -sign * 5 * Math.PI/16);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(450, - sign * 3 * Math.PI/8);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Inferonasal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(300, - sign * 6 *  Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(350, -sign * 11 * Math.PI/16);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(450, - sign * 5 * Math.PI/8);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Line attributes
        ctx.lineWidth = 48;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        
        // Draw line
        ctx.stroke();
    }
    
	// Coordinates of expert handles (in canvas plane)
    if (this.mode == "Expert")
    {
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
        }
    }
    
    // Location of apex handle
    this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
    
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
ED.OpticDisc.prototype.description = function()
{
	returnString = "Cup/disc ratio: ";
    
    var ratio = 0;
    
    if (this.mode == "Basic")
    {
        ratio = Math.round(10 * -this.apexY/300)/10;
    }
    else
    {
        // Sum distances of control points from centre
        var sum = 0;
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            sum += this.squiggleArray[0].pointsArray[i].length();
        }

        ratio = Math.round(10 * sum/(300 * this.numberOfHandles))/10;
    }
    
    returnString += ratio.toString();
	
	return returnString;
}

/**
 * Defines handles visibility
 */
ED.OpticDisc.prototype.setHandleProperties = function()
{
    // Basic mode
    if (this.mode == "Basic")
    {
        // Make handles invisible, except for apex handle
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].isVisible = false;
        }
        this.handleArray[this.numberOfHandles].isVisible = true;        
    }
    // Expert mode
    else
    { 
        // Make handles visible, except for apex handle
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].isVisible = true;
        }
        this.handleArray[this.numberOfHandles].isVisible = false;
    }
}

/**
 * Peripapillary atrophy
 *
 * @class PeripapillaryAtrophy
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
ED.PeripapillaryAtrophy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PeripapillaryAtrophy";
    
    // Private parameters
    this.outerRadius = 340;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripapillaryAtrophy.prototype = new ED.Doodle;
ED.PeripapillaryAtrophy.prototype.constructor = ED.PeripapillaryAtrophy;
ED.PeripapillaryAtrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripapillaryAtrophy.prototype.setHandles = function()
{
    this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.PeripapillaryAtrophy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['rotation']['range'].setMinAndMax(7 * Math.PI/4, Math.PI/4);
    
    // Create ranges to constrain handles
    this.handleCoordinateRangeArray = new Array();

    var max = this.outerRadius * 1.4;
    var min = this.outerRadius;
    this.handleCoordinateRangeArray[0] = {x:new ED.Range(-max, -min), y:new ED.Range(-0, +0)};
    this.handleCoordinateRangeArray[1] = {x:new ED.Range(-0, +0), y:new ED.Range(-max, -min)};
    this.handleCoordinateRangeArray[2] = {x:new ED.Range(min, max), y:new ED.Range(-0, +0)};
    this.handleCoordinateRangeArray[3] = {x:new ED.Range(-0, +0), y:new ED.Range(min, max)};
}

/**
 * Sets default parameters
 */
ED.PeripapillaryAtrophy.prototype.setParameterDefaults = function()
{
    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);

    // Add four points to the squiggle
    this.addPointToSquiggle(new ED.Point(-this.outerRadius - (this.drawing.eye == ED.eye.Right?100:0), 0));
    this.addPointToSquiggle(new ED.Point(0, -this.outerRadius));
    this.addPointToSquiggle(new ED.Point(this.outerRadius + (this.drawing.eye == ED.eye.Right?0:100), 0));
    this.addPointToSquiggle(new ED.Point(0, this.outerRadius));
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripapillaryAtrophy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PeripapillaryAtrophy.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// PeripapillaryAtrophy
    var f = 0.55;   // Gives a circular bezier curve
    var fromX;
    var fromY;
    var toX;
    var toY;
    
    // Top left curve
    fromX = this.squiggleArray[0].pointsArray[0].x;
    fromY = this.squiggleArray[0].pointsArray[0].y;
    toX = this.squiggleArray[0].pointsArray[1].x;
    toY = this.squiggleArray[0].pointsArray[1].y;
    ctx.moveTo(fromX, fromY);
    ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);
    
    // Top right curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[2].x;
    toY = this.squiggleArray[0].pointsArray[2].y;
    ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);
    
    // Bottom right curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[3].x;
    toY = this.squiggleArray[0].pointsArray[3].y;
    ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);
    
    // Bottom left curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[0].x;
    toY = this.squiggleArray[0].pointsArray[0].y;
    ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);
    
    // Only fill to margin, to allow cup to sit behind giving disc margin
    ctx.moveTo(280, 00);
    ctx.arc(0, 0, 280, 0, Math.PI*2, true);
    
	// Close path
	ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 2;
    var colour = new ED.Colour(0,0,0,1);
    colour.setWithHexString('DFD989');
    ctx.fillStyle = colour.rgba();
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	this.handleArray[1].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[1]);
	this.handleArray[2].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[2]);
	this.handleArray[3].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[3]);
    
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
ED.PeripapillaryAtrophy.prototype.description = function()
{
    var returnString = "";
	
    // Get distances of control points from centre
    var left = - this.squiggleArray[0].pointsArray[0].x;
    var top = - this.squiggleArray[0].pointsArray[1].y;
    var right = this.squiggleArray[0].pointsArray[2].x;
    var bottom = this.squiggleArray[0].pointsArray[3].y;
    
    // Get maximum control point, and its sector
    var sector = "";
    var max = this.radius;
    if (left > max)
    {
        max = left;
        sector = (this.drawing.eye == ED.eye.Right)?"temporally":"nasally";
    }
    if (top > max)
    {
        max = top;
        sector = "superiorly";
    }
    if (right > max)
    {
        max = right;
        sector = (this.drawing.eye == ED.eye.Right)?"nasally":"temporally";
    }
    if (bottom > max)
    {
        max = bottom;
        sector = "inferiorly";
    }
    
    // Grade degree of atrophy
    if (max > this.radius)
    {
        var degree = "Mild";
        if (max > 350) degree = "Moderate";
        if (max > 400) degree = "Signficant";
        returnString += degree;
        returnString += " peri-papillary atrophy, maximum ";
        returnString += sector;
    }
	
	return returnString;
}

/**
 * Nerve Fibre Defect
 *
 * @class NerveFibreDefect
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
ED.NerveFibreDefect = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NerveFibreDefect";
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NerveFibreDefect.prototype = new ED.Doodle;
ED.NerveFibreDefect.prototype.constructor = ED.NerveFibreDefect;
ED.NerveFibreDefect.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NerveFibreDefect.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NerveFibreDefect.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-560, -400);
}

/**
 * Sets default parameters
 */
ED.NerveFibreDefect.prototype.setParameterDefaults = function()
{
    this.arc = 20 * Math.PI/180;
    this.apexY = -460;
    
    this.setRotationWithDisplacements(150,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.NerveFibreDefect.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NerveFibreDefect.superclass.draw.call(this, _point);
    
	// Radius of outer curve
	var ro = -this.apexY;
    var ri = 360;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of NerveFibreDefect
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
	ctx.fillStyle = "rgba(200, 200, 200, 0.75)";
	ctx.strokeStyle = "gray";
	
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
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.NerveFibreDefect.prototype.groupDescription = function()
{
	return  "Nerve fibre layer defect at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.NerveFibreDefect.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * Disc Haemorrhage
 *
 * @class DiscHaemorrhage
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
ED.DiscHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DiscHaemorrhage";
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiscHaemorrhage.prototype = new ED.Doodle;
ED.DiscHaemorrhage.prototype.constructor = ED.DiscHaemorrhage;
ED.DiscHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.DiscHaemorrhage.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-490, -400);
}

/**
 * Sets default parameters
 */
ED.DiscHaemorrhage.prototype.setParameterDefaults = function()
{
    this.arc = 10 * Math.PI/180;
    this.apexY = -350;

    this.setRotationWithDisplacements(150,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiscHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DiscHaemorrhage.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = -this.apexY;
    var ri = 250;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of DiscHaemorrhage
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
	ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiscHaemorrhage.prototype.groupDescription = function()
{
	return  "Disc haemorrhage at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiscHaemorrhage.prototype.description = function()
{
	return this.clockHour() + " o'clock";
}

/**
 * OpticDiscPit Acquired Pit of Optic Nerve (APON)
 *
 * @class OpticDiscPit
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
ED.OpticDiscPit = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "OpticDiscPit";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.OpticDiscPit.prototype = new ED.Doodle;
ED.OpticDiscPit.prototype.constructor = ED.OpticDiscPit;
ED.OpticDiscPit.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDiscPit.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.OpticDiscPit.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters
 */
ED.OpticDiscPit.prototype.setParameterDefaults = function()
{
    this.originY = 130;
    this.apexY = 0;
    this.scaleX = 1.5;
    
    // Pits are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -50;
    }
    else
    {
        this.originX = 50;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDiscPit.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.OpticDiscPit.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Round hole
    var r = 80;
	ctx.arc(0, 0, r, 0, Math.PI*2, true);
    
	// Close path
	ctx.closePath();
    
    // Radial gradient
    var lightGray = "rgba(200, 200, 200, 0.75)";
    var darkGray = "rgba(100, 100, 100, 0.75)";
    var gradient = ctx.createRadialGradient(0, 0, r, 0, 0, 10);
    gradient.addColorStop(0, darkGray);
    gradient.addColorStop(1, lightGray);
    
	ctx.fillStyle = gradient;
	ctx.lineWidth = 2;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(55, -55));
    
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
ED.OpticDiscPit.prototype.description = function()
{
    return "Acquired pit of optic nerve";
}


