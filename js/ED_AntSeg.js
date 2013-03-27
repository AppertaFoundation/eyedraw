/**
 * @fileOverview Contains doodle subclasses for the anterior segment
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.92
 *
 * Modification date: 23rd Ootober 2011
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
 * Anterior segment with adjustable sized pupil
 *
 * @class AntSeg
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
ED.AntSeg = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSeg";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.pupilSize = 'Large';
    this.pxe = true;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSeg.prototype = new ED.Doodle;
ED.AntSeg.prototype.constructor = ED.AntSeg;
ED.AntSeg.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSeg.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AntSeg.prototype.setPropertyDefaults = function()
{
    this.version = 1.1;
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['pupilSize'] = {kind:'derived', type:'string', list:['Large', 'Medium', 'Small'], animate:true};
    this.parameterValidationArray['pxe'] = {kind:'derived', type:'bool'};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSeg.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('pupilSize', 'Large');
    this.setParameterFromString('pxe', 'false');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSeg.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -200) returnArray['pupilSize'] = 'Large';
            else if (_value < -100) returnArray['pupilSize'] = 'Medium';
            else returnArray['pupilSize']  = 'Small';
            break;
            
        case 'pupilSize':
            switch (_value)
            {
                case 'Large':
                    if (this.apexY < -200) returnValue = this.apexY;
                    else returnArray['apexY'] = -260;
                    break;
                case 'Medium':
                    if (this.apexY >= -200 && this.apexY < -100) returnValue = this.apexY;
                    else returnArray['apexY'] = -200;
                    break;
                case 'Small':
                    if (this.apexY >= -100) returnValue = this.apexY;
                    else returnArray['apexY'] = -100;
                    break;
            }
            break;

        case 'apexX':
            if (_value < -5) returnArray['pxe'] = false;
            else returnArray['pxe'] = true;
            break;
            
        case 'pxe':
            if (this.pxe) returnArray['apexX'] = +50;
            else returnArray['apexX'] = -50;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSeg.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSeg.superclass.draw.call(this, _point);
    
	// Radius of limbus
	var ro = 380;
    var ri = -this.apexY;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	//ctx.fillStyle = "rgba(255, 160, 40, 0.9)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Pseudo exfoliation
        if (this.pxe)
        {
            ctx.lineWidth = 8;
            ctx.strokeStyle = "darkgray";
            
            var rl = ri * 0.8;
            var rp = ri * 1.05;
            var segments = 36;
            var i;
            var phi = Math.PI * 2/segments;
            
            // Loop around alternating segments
            for (i = 0; i < segments; i++)
            {
                // PXE on lens
                ctx.beginPath();
                ctx.arc(0, 0, rl, i * phi, i * phi + phi/2, false);
                ctx.stroke();
                
                // PXE on pupil
                ctx.beginPath();
                ctx.arc(0, 0, rp, i * phi, i * phi + phi/2, false);
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
ED.AntSeg.prototype.description = function()
{
    return this.drawing.doodleArray.length == 1?"No abnormality":"";
}

/**
 * Anterior Segment Cross Section
 *
 * @class AntSegCrossSection
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
ED.AntSegCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSegCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.pupilSize = 'Large';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSegCrossSection.prototype = new ED.Doodle;
ED.AntSegCrossSection.prototype.constructor = ED.AntSegCrossSection;
ED.AntSegCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSegCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSegCrossSection.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    //this.parameterValidationArray['apexX']['range'].setMinAndMax(-140, 0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['pupilSize'] = {kind:'derived', type:'string', list:['Large', 'Medium', 'Small'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSegCrossSection.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('pupilSize', 'Large');
    this.apexX = 24;
    this.originX = 44;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSegCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Set apexX and its limits for apexX according to value of apexY (prevents collisions with cornea and lens)
            this.parameterValidationArray['apexX']['range'].setMinAndMax(-40 - (140/220) * (this.apexY + 280), 32 - (72/220) * (this.apexY + 280));
            
            // If being synced, make sensible decision about x
            if (!this.drawing.isActive)
            {
                var newOriginX = this.parameterValidationArray['apexX']['range'].max;
            }
            else
            {
                var newOriginX = this.parameterValidationArray['apexX']['range'].constrain(this.apexX);
            }
            this.setSimpleParameter('apexX', newOriginX);
            
            // Set pupil size value
            if (_value < -200) returnArray['pupilSize'] = 'Large';
            else if (_value < -100) returnArray['pupilSize'] = 'Medium';
            else returnArray['pupilSize']  = 'Small';
            break;
            
        case 'pupilSize':
            switch (_value)
            {
                case 'Large':
                    returnArray['apexY'] = -260;
                    break;
                case 'Medium':
                    returnArray['apexY'] = -200;
                    break;
                case 'Small':
                    returnArray['apexY'] = -100;
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
ED.AntSegCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSegCrossSection.superclass.draw.call(this, _point);
    
    // If lens there, take account of pupil size
    var marginX = this.apexX;
//    var doodle = this.drawing.lastDoodleOfClass("LensCrossSection");
//    if (doodle) marginX -= 44 - doodle.originX;
    
    // Boundary path
	ctx.beginPath();
    
    // Bottom cut away
    ctx.moveTo(60, 480);
    ctx.lineTo(140, 480);
    ctx.lineTo(140, 380);
    
    // Bottom ciliary body
    ctx.bezierCurveTo(120, 340, 120, 340, 100, 380);
    ctx.bezierCurveTo(80, 340, 80, 340, 60, 380);
    
    // Bottom pupil and angle
    var f = Math.abs(marginX) * 0.15;
    ctx.bezierCurveTo(40, 460, marginX + 60 + f, -this.apexY, marginX, -this.apexY);
    ctx.bezierCurveTo(marginX - 60 - f, -this.apexY, -21, 317, 0, 380);
    
    // Top cut away
    ctx.moveTo(60, -480);
    ctx.lineTo(140, -480);
    ctx.lineTo(140, -380);
    
    // Bottom ciliary body
    ctx.bezierCurveTo(120, -340, 120, -340, 100, -380);
    ctx.bezierCurveTo(80, -340, 80, -340, 60, -380);
    
    // Bottom pupil and angle
    ctx.bezierCurveTo(40, -460, marginX + 60 + f, this.apexY, marginX, this.apexY);
    ctx.bezierCurveTo(marginX - 60 - f, this.apexY, -21, -317, 0, -380);

    // Close path
    ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 160, 40, 1)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Cornea Cross Section
 *
 * @class CorneaCrossSection
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
ED.CorneaCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorneaCrossSection";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorneaCrossSection.prototype = new ED.Doodle;
ED.CorneaCrossSection.prototype.constructor = ED.CorneaCrossSection;
ED.CorneaCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CorneaCrossSection.prototype.setPropertyDefaults = function()
{
    this.isSelectable = false;
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorneaCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorneaCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorneaCrossSection.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Top cut away
    ctx.moveTo(60, -480);
    ctx.lineTo(-80, -480);
    
    // Front of cornea
    ctx.bezierCurveTo(-100, -440, -100, -440, -120, -380);
    ctx.bezierCurveTo(-240, -260, -320, -160, -320, 0);
    ctx.bezierCurveTo(-320, 160, -240, 260, -120, 380);
    ctx.bezierCurveTo(-100, 440, -100, 440, -80, 480);
    
    // Bottom cut away
    ctx.lineTo(60, 480);
    ctx.lineTo(0, 380);
    
    // Back of cornea
    ctx.bezierCurveTo(-80, 260, -220, 180, -220, 0);
    ctx.bezierCurveTo(-220, -180, -80, -260, 0, -380);

    // Close path
    ctx.closePath();
    
	// Set path attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245, 245, 245, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Top sclera
        ctx.beginPath();
        ctx.moveTo(56, -478);
        ctx.lineTo(-78, -478);
        ctx.bezierCurveTo(-98, -440, -96, -440, -118, -378);
        ctx.lineTo(-4, -378);
        ctx.lineTo(56, -478);
        
        // Bottom scleral
        ctx.moveTo(56, 478);
        ctx.lineTo(-78, 478);
        ctx.bezierCurveTo(-98, 440, -96, 440, -118, 378);
        ctx.lineTo(-4, 378);
        ctx.closePath();
        
        ctx.fillStyle = "rgba(255,255,185,1)";
        ctx.fill();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Lens
 *
 * @class Lens
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
ED.Lens = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Lens";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Lens.prototype = new ED.Doodle;
ED.Lens.prototype.constructor = ED.Lens;
ED.Lens.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Lens.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Lens.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lens.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Lens.superclass.draw.call(this, _point);
    
    // Height of cross section (half value of ro in AntSeg doodle)
    var ro = 240;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Move to inner circle
    ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        var ri = ro - 60;
        
        // Edge of nucleus
        ctx.beginPath();
        ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
        ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
        ctx.stroke();
	}
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Lens Cross Section
 *
 * @class LensCrossSection
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
ED.LensCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LensCrossSection";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LensCrossSection.prototype = new ED.Doodle;
ED.LensCrossSection.prototype.constructor = ED.LensCrossSection;
ED.LensCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.LensCrossSection.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +200);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-380, +380);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LensCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LensCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LensCrossSection.superclass.draw.call(this, _point);

    // Height of cross section (half value of ro in AntSeg doodle)
    var h = 240;
    
    // Arbitrary radius of curvature
    var r = 300;
    
    // Displacement of lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of nucleus
    var rn = r - 60;
    
    // Calculate nucleus angles
    var phi = Math.acos(x/rn);
    
    // Lens
    ctx.beginPath();

    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, r, theta, -theta, true);
    ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI - theta, true);

    // Draw it
    ctx.stroke();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Nucleus
        ctx.beginPath();
        ctx.moveTo(ld, rn * Math.sin(phi));
        ctx.arc(ld - x, 0, rn, phi, -phi, true);
        ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
        ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
        ctx.stroke();

        // Zonules
        ctx.beginPath();
        
        // Top zonules
        ctx.moveTo(44 - this.originX + 80, - this.originY -349);
        ctx.lineTo(64, -207);
        ctx.moveTo(44 - this.originX + 80, - this.originY -349);
        ctx.lineTo(138, -207);
        ctx.moveTo(44 - this.originX + 120, - this.originY -349);
        ctx.lineTo(64, -207);
        ctx.moveTo(44 - this.originX + 120, - this.originY -349);
        ctx.lineTo(138, -207);

        // Bottom zonules
        ctx.moveTo(44 - this.originX + 80, - this.originY + 349);
        ctx.lineTo(64, 207);
        ctx.moveTo(44 - this.originX + 80, - this.originY + 349);
        ctx.lineTo(138, 207);
        ctx.moveTo(44 - this.originX + 120, - this.originY + 349);
        ctx.lineTo(64, 207);
        ctx.moveTo(44 - this.originX + 120, - this.originY + 349);
        ctx.lineTo(138, 207);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * PhakoIncision
 *
 * @class PhakoIncision
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
ED.PhakoIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PhakoIncision";
    
    // Private parameters
    this.defaultRadius = 330;
    this.sutureSeparation = 1.5;
    this.apexYDelta = _radius + _apexY;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.incisionLength = (_arc * Math.PI/180) * (6 * _radius)/this.defaultRadius;
    this.incisionSite = 'Corneal';
    this.incisionType = 'Pocket';
    this.incisionMeridian = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PhakoIncision.prototype = new ED.Doodle;
ED.PhakoIncision.prototype.constructor = ED.PhakoIncision;
ED.PhakoIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PhakoIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PhakoIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['incisionMeridian'] = {kind:'derived', type:'mod', range:new ED.Range(0, 360), clock:'bottom', animate:true};
    this.parameterValidationArray['incisionLength'] = {kind:'derived', type:'float', range:new ED.Range(1, 9.9), precision:1, animate:true};
    this.parameterValidationArray['incisionSite'] = {kind:'derived', type:'string', list:['Corneal', 'Limbal', 'Scleral'], animate:true};
    this.parameterValidationArray['incisionType'] = {kind:'derived', type:'string', list:['Pocket', 'Section'], animate:false};
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PhakoIncision.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('incisionSite', 'Corneal');
    this.setParameterFromString('incisionLength', '3.5');
    this.setParameterFromString('incisionType', 'Pocket');
    
    // Default is temporal side, or 90 degrees to the last one
//    var doodle = this.drawing.lastDoodleOfClass(this.className);
//    if (doodle)
//    {
//        if (this.drawing.eye == ED.eye.Right)
//        {
//            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian - 90, 360).toFixed(0));
//        }
//        else
//        {
//            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian + 90, 360).toFixed(0));
//        }
//    }
//    else
//    {
//        // First incision is usually temporal
//        if (this.drawing.eye == ED.eye.Right)
//        {
//            this.setParameterFromString('incisionMeridian', '180');
//        }
//        else
//        {
//            this.setParameterFromString('incisionMeridian', '0');
//        }
//    }
    this.setRotationWithDisplacements(90, -90);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PhakoIncision.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'rotation':
            var angle = (((Math.PI * 2 - _value + Math.PI/2) * 180/Math.PI) + 360) % 360;
            if (angle == 360) angle = 0;
            returnArray['incisionMeridian'] = angle;
            //  returnArray['arc'] = _value/2;
            break;
            
        case 'arc':
            returnArray['incisionLength'] = _value * (6 * this.radius)/this.defaultRadius;
            break;
            
        case 'radius':
            if (_value >= 428) returnArray['incisionSite'] = 'Scleral';
            else if (_value >= 344) returnArray['incisionSite'] = 'Limbal';
            else returnArray['incisionSite']  = 'Corneal';
            
            // Incision length should remain constant despite changes in radius
            returnArray['arc'] =  this.incisionLength * this.defaultRadius/(6 * _value);
            this.updateArcRange();
            
            // Move apexY as radius changes and adjust range
            returnArray['apexY'] = this.apexYDelta - _value;
            this.parameterValidationArray['apexY']['range'].setMinAndMax(-_value, -_value + 34);
            break;
            
        case 'apexY':
            returnArray['apexYDelta'] = this.radius + _value;
            returnArray['incisionType'] = this.radius + _value > 0?'Section':'Pocket';
            break;
            
        // Incision Meridian (CND 5.15)
        case 'incisionMeridian':
            returnArray['rotation'] = (((90 - _value) + 360) % 360) * Math.PI/180;
            // Example of animating two simple parameters simultaneously
            //returnArray['arc'] = (1 + _value/90) * Math.PI/12;
            break;
            
        // Incision length (CND 5.14)
        case 'incisionLength':
            returnArray['arc'] = _value * this.defaultRadius/(6 * this.radius);
            this.updateArcRange();
            break;
            
        // Incision site (CND 5.13)
        case 'incisionSite':
            switch (_value)
            {
                case 'Scleral':
                    returnArray['radius'] = +428;
                    break;
                case 'Limbal':
                    returnArray['radius'] = +376;
                    break;
                case 'Corneal':
                    returnArray['radius'] = +330;
                    break;
            }
            break;
            
        case 'incisionType':
            switch (_value)
            {
                case 'Pocket':
                    returnArray['apexYDelta'] = +0;
                    returnArray['apexY'] = -this.radius;
                    break;
                case 'Section':
                    returnArray['apexYDelta'] = +34;
                    returnArray['apexY'] = +34 - this.radius;
                    break;
            }
    }
    
    return returnArray;
}

/**
 * Private method to update range of arc parameter to account for values changing with radius and incisionSite
 */
ED.PhakoIncision.prototype.updateArcRange = function()
{
    if (this.radius > 0)
    {
        this.parameterValidationArray['arc']['range'].min = this.parameterValidationArray['incisionLength']['range'].min * this.defaultRadius/(6 * this.radius);
        this.parameterValidationArray['arc']['range'].max = this.parameterValidationArray['incisionLength']['range'].max * this.defaultRadius/(6 * this.radius);
    }
    else
    {
        ED.errorHandler('ED.PhakoIncision', 'updateArcRange', 'Attempt to calculate a range of arc using an illegal value of radius: ' + this.radius);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PhakoIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PhakoIncision.superclass.draw.call(this, _point);
	
    // Radii
    var r =  this.radius;
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
    
    // Pocket
    if (this.apexYDelta == 0)
    {
        // Colour of fill
        ctx.fillStyle = "rgba(200,200,200,0.75)";

        // Set line attributes
        ctx.lineWidth = 4;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
    }
    // Section with sutures
    else
    {
        // Colour of fill
        ctx.fillStyle = "rgba(200,200,200,0)";
        
        // Set line attributes
        ctx.lineWidth = 4;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0)";
    }
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Section with sutures
        if (this.apexYDelta != 0)
        {
            // New path
            ctx.beginPath();
            
            // Arc across
            ctx.arc(0, 0, r, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
            
            // Sutures
            var sutureSeparationAngle = this.sutureSeparation * this.defaultRadius/(6 * this.radius);
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
            ctx.lineWidth = 4;
            
            // Colour of outer line is dark gray
            ctx.strokeStyle = "rgba(120,120,120,0.75)";
            
            // Draw incision
            ctx.stroke();
        }
        
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
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
ED.PhakoIncision.prototype.description = function()
{
    var returnString = "";
    
    // Incision site
    if (this.radius > 428) returnString = 'Scleral ';
    else if (this.radius > 344) returnString = 'Limbal ';
    else returnString = 'Corneal ';
    
    // Incision type
    returnString += this.apexY + this.radius == 0?"pocket ":"section "
    returnString += "incision at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * SidePort
 *
 * @class SidePort
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
ED.SidePort = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SidePort";
    
    // Private parameters
    this.incisionLength = 1.5;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SidePort.prototype = new ED.Doodle;
ED.SidePort.prototype.constructor = ED.SidePort;
ED.SidePort.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.SidePort.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['arc']['range'].setMinAndMax(0, Math.PI);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.SidePort.prototype.setParameterDefaults = function()
{
    // Incision length based on an average corneal radius of 6mm
    this.arc = this.incisionLength/6;

    this.setRotationWithDisplacements(90, 180);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SidePort.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SidePort.superclass.draw.call(this, _point);
	
    // Radius
    var r =  334;
    var d = 30;
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
    ctx.fillStyle = "rgba(200,200,200,0.75)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    
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
ED.SidePort.prototype.groupDescription = function()
{
	return "Sideport at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.description = function()
{
    return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * A cortical cataract
 *
 * @class CorticalCataract
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
ED.CorticalCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorticalCataract";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorticalCataract.prototype = new ED.Doodle;
ED.CorticalCataract.prototype.constructor = ED.CorticalCataract;
ED.CorticalCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataract.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataract.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "Lens";
    this.inFrontOfClassArray = ["Lens", "PostSubcapCataract", "NuclearCataract"];

    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'White'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataract.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorticalCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -120) returnArray['grade'] = 'Mild';
            else if (_value < -60) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'White';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -180;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -100;
                    break;
                case 'White':
                    returnArray['apexY'] = -20;
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
ED.CorticalCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorticalCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Parameters
    var n = 16;									// Number of cortical spokes
    var ro = 240;								// Outer radius of cataract
    var rs = 230;                               // Outer radius of spoke
    var theta = 2 * Math.PI/n;                  // Angle of outer arc of cortical shard
    var phi = theta/2;                          // Half theta
    var ri = -this.apexY;                       // Radius of inner clear area
    
    // Draw cortical spokes
    var sp = new ED.Point(0,0);
    sp.setWithPolars(rs, - phi);
    ctx.moveTo(sp.x, sp.y);

    for (var i = 0; i < n; i++)
    {
        var startAngle = i * theta - phi;
        var endAngle = startAngle + theta;

        var op = new ED.Point(0,0);
        op.setWithPolars(rs, startAngle);
        ctx.lineTo(op.x, op.y);
        
        //ctx.arc(0, 0, ro, startAngle, endAngle, false);
        var ip = new ED.Point(0, 0);
        ip.setWithPolars(ri, i * theta);
        ctx.lineTo(ip.x, ip.y);
    }
    
    ctx.lineTo(sp.x, sp.y);

    // Surrounding ring
    ctx.moveTo(ro, 0);
    ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
	
	// Set boundary path attributes
	ctx.lineWidth = 4;
    ctx.lineJoin = 'bevel';
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "rgba(200,200,200,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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
ED.CorticalCataract.prototype.description = function()
{
	return this.getParameter('grade') + " cortical cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CorticalCataract.prototype.snomedCode = function()
{
	return 193576003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CorticalCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Cortical Cataract Cross Section
 *
 * @class CorticalCataractCrossSection
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
ED.CorticalCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorticalCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorticalCataractCrossSection.prototype = new ED.Doodle;
ED.CorticalCataractCrossSection.prototype.constructor = ED.CorticalCataractCrossSection;
ED.CorticalCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataractCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'White'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorticalCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -120) returnArray['grade'] = 'Mild';
            else if (_value < -60) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'White';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -180;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -100;
                    break;
                case 'White':
                    returnArray['apexY'] = -20;
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
ED.CorticalCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorticalCataractCrossSection.superclass.draw.call(this, _point);
	
	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;
    
    // Radius of curvature of lens
    var r = 300;
    
    // Displacement lens from centre
    var ld = 100;
    
    // Thickness of lens
    //var lt = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);

    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Radius of cortical cataract (half way between capsule and nucleus)
    var rco = r - 30;

    // Calculate nucleus angles
    theta = Math.acos(x/rco);
    
    // Calculate cataract angles
    var phi = Math.asin(-this.apexY/rco);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw cataract with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, phi, theta, false);
    ctx.arc(ld + x, 0, rco, Math.PI - theta, Math.PI - phi, false);
    
    // Move to upper half and draw it
    var l = rco * Math.cos(phi);
    ctx.moveTo(ld - x + l, this.apexY);
    ctx.arc(ld - x, 0, rco, -phi, -theta, true);
    ctx.arc(ld + x, 0, rco, Math.PI + theta, Math.PI + phi, true);
    
	// Set line attributes
	ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(200,200,200,0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Nuclear cataract
 *
 * @class NuclearCataract
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
ED.NuclearCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NuclearCataract";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataract.prototype = new ED.Doodle;
ED.NuclearCataract.prototype.constructor = ED.NuclearCataract;
ED.NuclearCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataract.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataract.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    //this.parentClass = "Lens";
    //this.inFrontOfClassArray = ["Lens", "PostSubcapCataract"];
    this.addAtBack = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-120, +0);
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'Brunescent'], animate:true};
}

/**
 * Sets default parameters
 */
ED.NuclearCataract.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.NuclearCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -80) returnArray['grade'] = 'Mild';
            else if (_value < -40) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'Brunescent';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -120;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -80;
                    break;
                case 'Brunescent':
                    returnArray['apexY'] = +0;
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
ED.NuclearCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NuclearCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// NuclearCataract
    ctx.arc(0, 0, 200, 0, Math.PI * 2, true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
    
    // Colors for gradient
    yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";
    
    // Radial gradient
    var gradient = ctx.createRadialGradient(0, 0, 210, 0, 0, 50);
    gradient.addColorStop(0, yellowColour);
    gradient.addColorStop(1, brownColour);
    
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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
ED.NuclearCataract.prototype.description = function()
{
	return this.getParameter('grade') + " nuclear cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.NuclearCataract.prototype.snomedCode = function()
{
	return 53889007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.NuclearCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Nuclear Cataract Cross Section
 *
 * @class NuclearCataractCrossSection
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
ED.NuclearCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NuclearCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataractCrossSection.prototype = new ED.Doodle;
ED.NuclearCataractCrossSection.prototype.constructor = ED.NuclearCataractCrossSection;
ED.NuclearCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataractCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+100, +100);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'Brunescent'], animate:true};
}

/**
 * Sets default parameters
 */
ED.NuclearCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.apexX = 100;
    this.originX = 44;
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.NuclearCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -80) returnArray['grade'] = 'Mild';
            else if (_value < -40) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'Brunescent';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -120;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -80;
                    break;
                case 'Brunescent':
                    returnArray['apexY'] = +0;
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
ED.NuclearCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NuclearCataractCrossSection.superclass.draw.call(this, _point);
    
    // Height of cross section (half value of ro in AntSeg doodle)
    var h = 240;
    
    // Arbitrary radius of curvature corresponding to nucleus in Lens subclass
    var r = 300;
    
    // Displacement of lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of nucleus
    var rn = r - 60;
    
    // Calculate nucleus angles
    var phi = Math.acos(x/rn);
    
    // Lens
    ctx.beginPath();
    
    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, rn, phi, -phi, true);
    ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
    
    // Draw it
    ctx.stroke();
    
	// Set line attributes
	ctx.lineWidth = 0;
    
    // Colors for gradient
    yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";
    
    // Radial gradient
    var gradient = ctx.createRadialGradient(ld, 0, 210, ld, 0, 50);
    gradient.addColorStop(0, yellowColour);
    gradient.addColorStop(1, brownColour);
    
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Posterior subcapsular cataract
 *
 * @class PostSubcapCataract
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
ED.PostSubcapCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostSubcapCataract";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostSubcapCataract.prototype = new ED.Doodle;
ED.PostSubcapCataract.prototype.constructor = ED.PostSubcapCataract;
ED.PostSubcapCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostSubcapCataract.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PostSubcapCataract.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "Lens";
    this.inFrontOfClassArray = ["Lens"];
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+35, +100);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, -35);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostSubcapCataract.prototype.setParameterDefaults = function()
{
    this.apexX = 35;
    this.apexY = 35;
    this.radius = 50;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostSubcapCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
            break;
            
        case 'apexY':
            returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostSubcapCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostSubcapCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// PostSubcapCataract
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    
    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['PSCPattern'],'repeat');
    ctx.fillStyle = ptrn;
    
	ctx.strokeStyle = "lightgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(this.radius, Math.PI/4);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
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
ED.PostSubcapCataract.prototype.description = function()
{
	return "Posterior subcapsular cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.PostSubcapCataract.prototype.snomedCode = function()
{
	return 315353005;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PostSubcapCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Cortical Cataract Cross Section
 *
 * @class PostSubcapCataractCrossSection
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
ED.PostSubcapCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostSubcapCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostSubcapCataractCrossSection.prototype = new ED.Doodle;
ED.PostSubcapCataractCrossSection.prototype.constructor = ED.PostSubcapCataractCrossSection;
ED.PostSubcapCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostSubcapCataractCrossSection.prototype.setHandles = function()
{
	//this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PostSubcapCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostSubcapCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
    this.apexY = -35;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostSubcapCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostSubcapCataractCrossSection.superclass.draw.call(this, _point);
	
	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;
    
    // Radius of curvature of lens
    var r = 300;
    
    // Displacement lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Radius of cataract (Just inside capsule)
    var rco = r - 10;
    
    // Calculate nucleus angles
    theta = Math.acos(x/rco);
    
    // Calculate cataract angles
    var phi = Math.asin(-this.apexY/rco);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw cataract with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, -phi, phi, false);
    
	// Set line attributes
	ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(150,150,150,0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
    // Coordinates of handles (in canvas plane)
	//this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Trial Frame
 *
 * @class TrialFrame
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
ED.TrialFrame = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TrialFrame";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrialFrame.prototype = new ED.Doodle;
ED.TrialFrame.prototype.constructor = ED.TrialFrame;
ED.TrialFrame.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TrialFrame.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrialFrame.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.TrialFrame.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Settings
    var ro = 420;
    var rt = 340;
    var ri = 300;
    var d = 20;
    var height = 50;
    
    // Angles, phi gives a little extra at both ends of the frame
    var phi = -Math.PI/20;
	var arcStart = 0 + phi;
	var arcEnd = Math.PI - phi;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, false);
    
	// Arc back
	ctx.arc(0, 0, ri, arcEnd, arcStart, true);
    
    ctx.closePath();
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(230,230,230,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Set font and colour
        ctx.font = height + "px sans-serif";
        ctx.fillStyle = "blue";
        
        ctx.beginPath();
        
        var theta = 0;
        
        // Points for each line
        var pi = new ED.Point(0,0);
        var pj = new ED.Point(0,0);
        var pt = new ED.Point(0,0);
        var po = new ED.Point(0,0);
        var pp = new ED.Point(0,0);
        
        for (var i = 0; i < 19; i++)
        {
            var text = i.toFixed(0);
            theta = (-90 - i * 10) * Math.PI/180;
            
            pi.setWithPolars(ri, theta);
            pj.setWithPolars(ri + d, theta);
            pt.setWithPolars(rt, theta);
            pp.setWithPolars(ro - d, theta);
            po.setWithPolars(ro, theta);
            
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.moveTo(pp.x, pp.y);
            ctx.lineTo(po.x, po.y);
            
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(Math.PI + theta);
            ctx.textAlign = "center";
            ctx.fillText(text, 0, 80/2);
            ctx.restore();
        }
        
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 20);
        
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * TrialLens
 *
 * @class TrialLens
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
ED.TrialLens = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TrialLens";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.axis = '0';
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrialLens.prototype = new ED.Doodle;
ED.TrialLens.prototype.constructor = ED.TrialLens;
ED.TrialLens.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TrialLens.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['axis'] = {kind:'derived', type:'mod', range:new ED.Range(0, 180), clock:'bottom', animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TrialLens.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TrialLens.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'rotation':
            returnArray['axis'] = (360 - 180 * _value/Math.PI) % 180;
            break;
            
        case 'axis':
            returnArray['rotation'] = (180 - _value) * Math.PI/180;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrialLens.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.TrialLens.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 360;
    var ri = 180;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Move to start of next arc
    ctx.moveTo(ri, 0);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,100,100,1)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var d = 20;
        ctx.beginPath();
        ctx.moveTo(ro - d,0);
        ctx.lineTo(ri + d,0);
        ctx.moveTo(-ro + d,0);
        ctx.lineTo(-ri - d,0);
        
        ctx.lineWidth = 16;
        ctx.strokeStyle = "black";
        ctx.stroke();
	}
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Posterior chamber IOL
 *
 * @class PCIOL
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
ED.PCIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PCIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PCIOL.prototype = new ED.Doodle;
ED.PCIOL.prototype.constructor = ED.PCIOL;
ED.PCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PCIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.PCIOL.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.PCIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PCIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PCIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
    ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
    ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
    ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
    ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
    ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
    ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
    ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
    ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
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
ED.PCIOL.prototype.description = function()
{
    var returnValue = "Posterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" temporally":" nasally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" nasally":" temporally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Toric Posterior chamber IOL
 *
 * @class ToricPCIOL
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
ED.ToricPCIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ToricPCIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ToricPCIOL.prototype = new ED.Doodle;
ED.ToricPCIOL.prototype.constructor = ED.ToricPCIOL;
ED.ToricPCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ToricPCIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.ToricPCIOL.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ToricPCIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ToricPCIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ToricPCIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
    ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
    ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
    ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
    ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
    ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
    ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
    ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
    ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Lines for toric IOL
        ctx.beginPath();
        
        // Create points
        var phi = 0.7 * Math.PI/4;
        var theta = phi + Math.PI;
        var p1 = new ED.Point(0, 0)
        p1.setWithPolars(r - 20, phi);
        var p2 = new ED.Point(0, 0);
        p2.setWithPolars(r - 100, phi);
        var p3 = new ED.Point(0, 0)
        p3.setWithPolars(r - 20, theta);
        var p4 = new ED.Point(0, 0);
        p4.setWithPolars(r - 100, theta);
        
        // Create lines
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        
        // Set line attributes
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.strokeStyle = "darkgray";
        
        // Draw lines
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
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
ED.ToricPCIOL.prototype.description = function()
{
    var returnValue = "Toric posterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    // ***TODO*** ensure description takes account of side of eye
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " temporally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " nasally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Anterior chamber IOL
 *
 * @class ACIOL
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
ED.ACIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ACIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ACIOL.prototype = new ED.Doodle;
ED.ACIOL.prototype.constructor = ED.ACIOL;
ED.ACIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ACIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.ACIOL.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ACIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.8;
    this.scaleY = 0.8;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ACIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ACIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic (see ACIOL.c4D for bezier points)
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 170, -210, 160, -230);
    ctx.bezierCurveTo(150, -250, 100, -280, 50, -290);
    ctx.bezierCurveTo(0, -300, -220, -330, -230, -340);
    ctx.bezierCurveTo(-250, -360, -220, -420, -200, -430);
    ctx.bezierCurveTo(-180, -440, -180, -440, -150, -450);
    ctx.bezierCurveTo(-120, -460, -130, -430, -120, -420);
    ctx.bezierCurveTo(-110, -410, 110, -410, 120, -420);
    ctx.bezierCurveTo(130, -430, 120, -460, 150, -450);
    ctx.bezierCurveTo(180, -440, 180, -440, 200, -430);
    ctx.bezierCurveTo(220, -420, 180, -400, 150, -390);
    ctx.bezierCurveTo(120, -380, -120, -380, -150, -390);
    ctx.bezierCurveTo(-180, -400, -190, -370, -170, -360);
    ctx.bezierCurveTo(-150, -350, 20, -330, 70, -320);
    ctx.bezierCurveTo(120, -310, 190, -280, 210, -250);
    ctx.bezierCurveTo(230, -220, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -170, 210, -160, 230);
    ctx.bezierCurveTo(-150, 250, -100, 280, -50, 290);
    ctx.bezierCurveTo(0, 300, 220, 330, 230, 340);
    ctx.bezierCurveTo(250, 360, 220, 420, 200, 430);
    ctx.bezierCurveTo(180, 440, 180, 440, 150, 450);
    ctx.bezierCurveTo(120, 460, 130, 430, 120, 420);
    ctx.bezierCurveTo(110, 410, -110, 410, -120, 420);
    ctx.bezierCurveTo(-130, 430, -120, 460, -150, 450);
    ctx.bezierCurveTo(-180, 440, -180, 440, -200, 430);
    ctx.bezierCurveTo(-220, 420, -180, 400, -150, 390);
    ctx.bezierCurveTo(-120, 380, 120, 380, 150, 390);
    ctx.bezierCurveTo(180, 400, 190, 370, 170, 360);
    ctx.bezierCurveTo(150, 350, -20, 330, -70, 320);
    ctx.bezierCurveTo(-120, 310, -190, 280, -210, 250);
    ctx.bezierCurveTo(-230, 220, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
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
ED.ACIOL.prototype.description = function()
{
    var returnValue = "Anterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" temporally":" nasally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" nasally":" temporally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Bleb
 *
 * @class Bleb
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
ED.Bleb = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bleb";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bleb.prototype = new ED.Doodle;
ED.Bleb.prototype.constructor = ED.Bleb;
ED.Bleb.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Bleb.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.Bleb.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(30,30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bleb.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bleb.superclass.draw.call(this, _point);
    
    // Base radius
    var r = 384;
	
	// Boundary path
	ctx.beginPath();
    
    // Draw limbal base
    var phi = Math.PI/12;
    ctx.arc(0, 0, r, -phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(r/4, -r * 1.25);
    ctx.lineTo(-r/4, -r * 1.25);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(240,240,240,0.9)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-40, -r);
        ctx.lineTo(-40, -r * 1.15);
        ctx.lineTo(40, -r * 1.15);
        ctx.lineTo(40, -r);
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
ED.Bleb.prototype.description = function()
{
    return "Trabeculectomy bleb at " + this.clockHour() + " o'clock";;
}

/**
 * Peripheral iridectomy
 *
 * @class PI
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
ED.PI = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PI";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PI.prototype = new ED.Doodle;
ED.PI.prototype.constructor = ED.PI;
ED.PI.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.PI.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.PI.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(30,30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PI.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PI.superclass.draw.call(this, _point);
    
    // Outer radiuss
    var r = 360;
	
	// Boundary path
	ctx.beginPath();
    
    // Draw base
    var phi = Math.PI/24;
    ctx.arc(0, 0, r, - phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(0, -r * 0.8);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(218,230,241,1)";
    
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
ED.PI.prototype.description = function()
{
    return "Peripheral iridectomy at " + this.clockHour() + " o'clock";
}


/**
 * Radial keratotomy
 *
 * @class RK
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
ED.RK = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RK";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RK.prototype = new ED.Doodle;
ED.RK.prototype.constructor = ED.RK;
ED.RK.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RK.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.RK.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isUnique;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.15);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.15);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -60);
}

/**
 * Sets default parameters
 */
ED.RK.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RK.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RK.superclass.draw.call(this, _point);
    
	// RK number and size
    var ro = 320;
    var ri = -this.apexY;
    var n = 8;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill pattern
    ctx.fillStyle = "rgba(155,255,255,0)";
    
    // Transparent stroke
    ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var theta = 2 * Math.PI/n;	// Angle between radii
        ctx.strokeStyle = "rgba(100,100,100,0.7)";
        
        // Draw radii spokes
        ctx.beginPath();
        var i;
        for (i = 0; i < n; i++)
        {
            var angle = i * theta;
            var pi = new ED.Point(0, 0);
            pi.setWithPolars(ri, angle);
            var po = new ED.Point(0, 0);
            po.setWithPolars(ro, angle);
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(po.x, po.y);
            ctx.closePath();
        }
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
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
ED.RK.prototype.description = function()
{
    return "Radial keratotomy";
}

/**
 * Fuch's endothelial Dystrophy
 *
 * @class Fuchs
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
ED.Fuchs = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Fuchs";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Fuchs.prototype = new ED.Doodle;
ED.Fuchs.prototype.constructor = ED.Fuchs;
ED.Fuchs.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Fuchs.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.Fuchs.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
    this.isSqueezable = true;
    this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fuchs.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Fuchs.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// Fuchs
    var r = 300;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['FuchsPattern'],'repeat');
    ctx.fillStyle = ptrn;
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
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
ED.Fuchs.prototype.description = function()
{
    return "Fuch's Endothelial Dystrophy";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Fuchs.prototype.snomedCode = function()
{
	return 193839007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Fuchs.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Lasik Flap
 *
 * @class LasikFlap
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
ED.LasikFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LasikFlap";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LasikFlap.prototype = new ED.Doodle;
ED.LasikFlap.prototype.constructor = ED.LasikFlap;
ED.LasikFlap.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LasikFlap.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.LasikFlap.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.75, +1.15);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.75, +1.15);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -60);
}

/**
 * Sets default parameters
 */
ED.LasikFlap.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LasikFlap.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LasikFlap.superclass.draw.call(this, _point);
    
	// LasikFlap
    var r = 320;
	
	// Calculate parameters for arc
    var angle = Math.PI/6;
	var arcStart = -Math.PI/2 - angle;
	var arcEnd = -Math.PI/2 + angle;
    
	// Boundary path
	ctx.beginPath();
    
	// Do an arc
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
    
	// Close path to produce straight line
	ctx.closePath();
    
    // Create transparent fill pattern
    ctx.fillStyle = "rgba(155,255,255,0)";
    
    // Transparent stroke
    ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, angle);
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
ED.LasikFlap.prototype.description = function()
{
    var returnString = "";
    
    // Get side
    if(this.drawing.eye == ED.eye.Right)
	{
		var isRightSide = true;
	}
	else
	{
		var isRightSide = false;
	}
    
	// Use trigonometry on rotation field to determine quadrant ***TODO*** push function up to superclass
    var c = Math.cos(this.rotation);
    var s = Math.sin(this.rotation);
    var ac = Math.abs(c);
    var as = Math.abs(s);
    
    var quadrant = "";
    if (s > c && as > ac) quadrant = isRightSide?"nasal":"temporal";
    if (s > c && as < ac) quadrant = "inferior";
    if (s < c && as > ac) quadrant = isRightSide?"temporal":"nasal";
    if (s < c && as < ac) quadrant = "superior";
    
	returnString = "LASIK flap with " + quadrant + " hinge";
    
	return returnString;
}

/**
 * Corneal scar
 *
 * @class CornealScar
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
ED.CornealScar = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealScar";
    
    // Doodle specific property
    this.isInVisualAxis = false;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealScar.prototype = new ED.Doodle;
ED.CornealScar.prototype.constructor = ED.CornealScar;
ED.CornealScar.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealScar.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealScar.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, -10);
}

/**
 * Sets default parameters
 */
ED.CornealScar.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    this.scaleX = 0.7;
    this.scaleY = 0.5;
    
    this.setOriginWithDisplacements(0,25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealScar.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealScar.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealScar
    var r = 100;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    var alpha = -this.apexY/100;
    ctx.fillStyle = "rgba(100,100,100," + alpha.toFixed(2) + ")";
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Work out whether visual axis is involved
        var centre = new ED.Point(0,0);
        var visualAxis = this.drawing.transform.transformPoint(centre);
        var ctx = this.drawing.context;
        if (ctx.isPointInPath(visualAxis.x,visualAxis.y)) this.isInVisualAxis = true;
        else this.isInVisualAxis = false;
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
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
ED.CornealScar.prototype.description = function()
{
    var returnString = "";
    
    // Calculate size
    var averageScale = this.scaleX + this.scaleY;
    
    // Arbitrary cutoffs
    if (averageScale < 2) returnString = "Small ";
    else if (averageScale < 4) returnString = "Medium ";
    else returnString = "Large ";
    
    returnString += "corneal scar";
    
    if (this.isInVisualAxis) returnString += " involving visual axis";
    
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CornealScar.prototype.snomedCode = function()
{
	return 95726001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CornealScar.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * IrisHook
 *
 * @class IrisHook
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
ED.IrisHook = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Set classname
	this.className = "IrisHook";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IrisHook.prototype = new ED.Doodle;
ED.IrisHook.prototype.constructor = ED.IrisHook;
ED.IrisHook.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.IrisHook.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
	this.isScaleable = false;
}

/**
 * Sets default parameters
 */
ED.IrisHook.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(45, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IrisHook.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.IrisHook.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Length to inner iris
    var length = 260;
    
    // If iris there, take account of pupil size
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) length = -doodle.apexY;
    
    ctx.rect(-25, -440, 50, 180 + length);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(120,120,120,0.0)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Drawing path
        ctx.beginPath();
        
        // Stem
        ctx.moveTo(10, -430);
        ctx.lineTo(10, -length + 10);
        ctx.lineTo(-10, -length);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
        ctx.stroke();
        
        // Stopper
        ctx.beginPath();
        ctx.moveTo(-20, -400);
        ctx.lineTo(+40, -400);
        ctx.lineWidth = 24;
        ctx.strokeStyle = "rgba(255,120,0,0.75)";
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
ED.IrisHook.prototype.groupDescription = function()
{
	return "Iris hooks used at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.description = function()
{
    var returnString = "";
    
    returnString += this.clockHour();
    
	return returnString;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * MattressSuture
 *
 * @class MattressSuture
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
ED.MattressSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Set classname
	this.className = "MattressSuture";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MattressSuture.prototype = new ED.Doodle;
ED.MattressSuture.prototype.constructor = ED.MattressSuture;
ED.MattressSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.MattressSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.MattressSuture.prototype.setParameterDefaults = function()
{
    this.radius = 374;
    this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MattressSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MattressSuture.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var r =  this.radius;
    ctx.rect(-40, -(r + 40), 80, 80);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-40, -(r + 40));
        ctx.lineTo(40, -(r + 40));
        ctx.lineTo(-40, -(r - 40));
        ctx.lineTo(40, -(r - 40));
        ctx.lineTo(-40, -(r + 40));
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,120,0.7)";
        ctx.closePath();
        
        ctx.stroke();
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
ED.MattressSuture.prototype.description = function()
{
    var returnString = "Mattress suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Capsular Tension Ring
 *
 * @class CapsularTensionRing
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
ED.CapsularTensionRing = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CapsularTensionRing";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CapsularTensionRing.prototype = new ED.Doodle;
ED.CapsularTensionRing.prototype.constructor = ED.CapsularTensionRing;
ED.CapsularTensionRing.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CapsularTensionRing.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isScaleable = false;
	this.isMoveable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.CapsularTensionRing.prototype.setParameterDefaults = function()
{
    this.rotation = -Math.PI/2;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CapsularTensionRing.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CapsularTensionRing.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radii
    var ro = 360;
    var rm = 340;
    var ri = 300;
    var rh = 15;
    
    // Half angle of missing arc
    var theta = Math.PI * 0.2;
    
    // Outer ring
    ctx.arc(0, 0, ro, -theta, theta, true);
    
    var p1c1 = new ED.Point(0, 0)
    p1c1.setWithPolars(ro, Math.PI/2 + 0.8 * theta);
    
    var p1c2 = new ED.Point(0, 0)
    p1c2.setWithPolars(ri, Math.PI/2 + 0.8 * theta);
    
    var p1 = new ED.Point(0, 0)
    p1.setWithPolars(ri, Math.PI/2 + theta);
    
    var p2c1 = new ED.Point(0, 0)
    p2c1.setWithPolars(ri, Math.PI/2 + 1.1 * theta);
    
    var p2c2 = new ED.Point(0, 0)
    p2c2.setWithPolars(rm, Math.PI/2 + 1.1 * theta);
    
    var p2 = new ED.Point(0, 0)
    p2.setWithPolars(rm, Math.PI/2 + 1.2 * theta);
    
    ctx.bezierCurveTo(p1c1.x, p1c1.y, p1c2.x, p1c2.y, p1.x, p1.y);
    ctx.bezierCurveTo(p2c1.x, p2c1.y, p2c2.x, p2c2.y, p2.x, p2.y);
    
    // Inner ring
    ctx.arc(0, 0, rm, 1.2 * theta, -1.2 * theta, false);
    
    var p3c1 = new ED.Point(0, 0)
    p3c1.setWithPolars(rm, Math.PI/2 - 1.1 * theta);
    
    var p3c2 = new ED.Point(0, 0)
    p3c2.setWithPolars(ri, Math.PI/2 -1.1 * theta);
    
    var p3 = new ED.Point(0, 0)
    p3.setWithPolars(ri, Math.PI/2 - theta);
    
    var p4c1 = new ED.Point(0, 0)
    p4c1.setWithPolars(ri, Math.PI/2 - 0.8 * theta);
    
    var p4c2 = new ED.Point(0, 0)
    p4c2.setWithPolars(ro, Math.PI/2 - 0.8 * theta);
    
    var p4 = new ED.Point(0, 0)
    p4.setWithPolars(ro, Math.PI/2 - theta);
    
    ctx.bezierCurveTo(p3c1.x, p3c1.y, p3c2.x, p3c2.y, p3.x, p3.y);
    ctx.bezierCurveTo(p4c1.x, p4c1.y, p4c2.x, p4c2.y, p4.x, p4.y);
    
    // Hole in end 1
    var cp1 = new ED.Point(0, 0)
    cp1.setWithPolars(rm - 8, Math.PI/2 - theta);
    var ep1 = new ED.Point(0, 0)
    ep1.setWithPolars(rm - 8 + rh, Math.PI/2 - theta);
    ctx.moveTo(ep1.x, ep1.y);
    ctx.arc(cp1.x, cp1.y, 15, 0, 2 * Math.PI, false);
    
    // Hole in end 2
    var cp2 = new ED.Point(0, 0)
    cp2.setWithPolars(rm - 8, Math.PI/2 + theta);
    var ep2 = new ED.Point(0, 0)
    ep2.setWithPolars(rm - 8 + rh, Math.PI/2 + theta);
    ctx.moveTo(ep2.x, ep2.y);
    ctx.arc(cp2.x, cp2.y, 15, 0, 2 * Math.PI, false);
    
    ctx.closePath();
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
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
ED.CapsularTensionRing.prototype.description = function()
{
    var returnValue = "Capsular Tension Ring";
    
	return returnValue;
}

/**
 * CornealSuture
 *
 * @class CornealSuture
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
ED.CornealSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealSuture";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealSuture.prototype = new ED.Doodle;
ED.CornealSuture.prototype.constructor = ED.CornealSuture;
ED.CornealSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.CornealSuture.prototype.setParameterDefaults = function()
{
    this.radius = 374;
    this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealSuture.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var r =  this.radius;
    ctx.rect(-20, -(r + 40), 40, 80);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(0, -r - 40);
        ctx.lineTo(0, -r + 40);
        ctx.moveTo(-10, -r + 10);
        ctx.lineTo(0, -r + 20);
        ctx.lineTo(-10, -r + 30);
        
        ctx.lineWidth = 2;
        var colour = "rgba(0,0,120,0.7)"
        ctx.strokeStyle = colour;
        
        ctx.stroke();
        
        // Knot
        this.drawSpot(ctx, 0, -r + 20, 4, colour);
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealSuture.prototype.description = function()
{
    var returnString = "Corneal suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * LimbalRelaxingIncision
 *
 * @class LimbalRelaxingIncision
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
ED.LimbalRelaxingIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LimbalRelaxingIncision";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LimbalRelaxingIncision.prototype = new ED.Doodle;
ED.LimbalRelaxingIncision.prototype.constructor = ED.LimbalRelaxingIncision;
ED.LimbalRelaxingIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LimbalRelaxingIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.LimbalRelaxingIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, Math.PI/2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.LimbalRelaxingIncision.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 30 * Math.PI/180;
    
    // Make it 180 degress to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI;
        this.arc = doodle.arc;
    }
    else
    {
        // LRIs are usually temporal
        if(this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -Math.PI/2;
        }
        else
        {
            this.rotation = Math.PI/2;
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LimbalRelaxingIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LimbalRelaxingIncision.superclass.draw.call(this, _point);
	
    // Radius
    var r =  360
    var d = 12;
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
    ctx.fillStyle = "rgba(100,100,200,0.75)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
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
ED.LimbalRelaxingIncision.prototype.description = function()
{
    var returnString = "Limbal relaxing incision " + (this.arc * 180/Math.PI).toFixed(0) + " degrees at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Rubeosis
 *
 * @class Rubeosis
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
ED.Rubeosis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Rubeosis";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.severity = 50;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Rubeosis.prototype = new ED.Doodle;
ED.Rubeosis.prototype.constructor = ED.Rubeosis;
ED.Rubeosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rubeosis.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Rubeosis.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -200);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['severity'] = {kind:'derived', type:'float', range:new ED.Range(20, 100), precision:1, animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Rubeosis.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/12;
    this.setRotationWithDisplacements(90, 45);
    //this.setParameterFromString('apexY', '-320');
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle)
    {
        this.apexY = doodle.apexY - this.severity;
    }
    else
    {
        this.apexY = -320;
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
ED.Rubeosis.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'severity':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['apexY'] = doodle.apexY - _value;
            }
            break;

        case 'apexY':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['severity'] = doodle.apexY - _value;
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
ED.Rubeosis.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Rubeosis.superclass.draw.call(this, _point);
    
    // Set inner radius according to pupil
    var ri = 200;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ri = -doodle.apexY;
    
    // Boundary starts further out to allow selection of pupil handle
    var rib = ri + 16;
    
    // Set apexY and range
    this.parameterValidationArray['apexY']['range'].max = -ri - 50;
    this.apexY = this.parameterValidationArray['apexY']['range'].constrain(-ri - this.severity);

    // Outer radius is position of apex handle
	var ro = -this.apexY;

    // Radius for control handles
    var r = rib + (ro - rib)/2;
    
	// Boundary path
	ctx.beginPath();
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Point(-r * Math.sin(theta),  -r * Math.cos(theta));
	var endHandle = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));

	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rib, arcStart, arcEnd, true);
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = this.isSelected?"rgba(240,240,240,0.5)":"rgba(240,240,240,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 1;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Angular separation of vessels
        var inc = 2 * Math.PI/16;
        var disp = Math.PI/24;
        var phi = 2 * Math.PI/60;
        var rc = ri + 2 * (ro - ri)/3;
        
        // Number of vessels to draw
        var n = 1 + Math.floor(this.arc/inc);
        
        // Draw each vessel tree
        for (var i = 0; i < n; i++)
        {
            // Start point
            var sp = startHandle.pointAtRadiusAndClockwiseAngle(ri, disp + i * inc);
            
            // First branch
            var ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi);
            var cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
            var cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi/2);
            ctx.moveTo(sp.x, sp.y);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
            
            // Second branch
            ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi);
            cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
            cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi/2);
            ctx.moveTo(sp.x, sp.y);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
        }
        
        // Set line attributes
        ctx.lineWidth = 4;
        ctx.strokeStyle = "red";
        
        // Draw vessels
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.Rubeosis.prototype.groupDescription = function()
{
	return "Rubeotic vessels on margin of pupil at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Rubeosis.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * PosteriorSynechia
 *
 * @class PosteriorSynechia
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
ED.PosteriorSynechia = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PosteriorSynechia";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.size = 150;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorSynechia.prototype = new ED.Doodle;
ED.PosteriorSynechia.prototype.constructor = ED.PosteriorSynechia;
ED.PosteriorSynechia.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PosteriorSynechia.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.PosteriorSynechia.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/12, Math.PI * 2/3);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['size'] = {kind:'derived', type:'float', range:new ED.Range(20, 100), precision:1, animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PosteriorSynechia.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/6;
    this.setRotationWithDisplacements(90, 45);

    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle)
    {
        this.apexY = doodle.apexY + this.size;
    }
    else
    {
        this.apexY = -200;
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
ED.PosteriorSynechia.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'size':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['apexY'] = doodle.apexY - _value;
            }
            break;
            
        case 'apexY':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['size'] = doodle.apexY - _value;
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
ED.PosteriorSynechia.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PosteriorSynechia.superclass.draw.call(this, _point);
    
    // Set outer radius according to pupil
    var ro = 200;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ro = -doodle.apexY;
    
    // Outer radius is position of apex handle
	var ri = -this.apexY;
    
    // Radius of control points
    var rc = ri + (ro - ri)/2;
    
	// Boundary path
	ctx.beginPath();
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Point(-ro * Math.sin(theta),  -ro * Math.cos(theta));
	var endHandle = new ED.Point(ro * Math.sin(theta), -ro * Math.cos(theta));
    
	// Boundary path
	ctx.beginPath();
    
	// Arc at margin of pupil
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);
        
    //var cp = bp.pointAtRadiusAndClockwiseAngle(pr/2, Math.PI/16);
    var apex = new ED.Point(this.apexX, this.apexY);
    
    // Curve from endpoint to apex
    var cp1 = endHandle.pointAtAngleToLineToPointAtProportion(Math.PI/12, apex, 0.33);
    var cp2 = apex.pointAtAngleToLineToPointAtProportion(-Math.PI/12, endHandle, 0.33);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);
    
    // Curve from apex to startpoint
    var cp3 = apex.pointAtAngleToLineToPointAtProportion(Math.PI/12, startHandle, 0.33);
    var cp4 = startHandle.pointAtAngleToLineToPointAtProportion(-Math.PI/12, apex, 0.33);
    ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is transparent
    ctx.strokeStyle = "rgba(250, 250, 250, 0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Visual 'hack' to overwrite line with white and then same colour as pupil fill
        ctx.beginPath();
        ctx.arc(0, 0, ro, arcEnd, arcStart, false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.strokeStyle = "rgba(100, 200, 250, 0.5)";
        ctx.stroke();
        
        // Re-do the boundary to match pupil edge and overlap gaps at join
        ctx.beginPath();
        ctx.moveTo(endHandle.x, endHandle.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.PosteriorSynechia.prototype.groupDescription = function()
{
	return "Posterior synechiae at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PosteriorSynechia.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * Corneal abrasion
 *
 * @class CornealAbrasion
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
ED.CornealAbrasion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealAbrasion";
    
    // Doodle specific property
    this.isInVisualAxis = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealAbrasion.prototype = new ED.Doodle;
ED.CornealAbrasion.prototype.constructor = ED.CornealAbrasion;
ED.CornealAbrasion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealAbrasion.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealAbrasion.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);
}

/**
 * Sets default parameters
 */
ED.CornealAbrasion.prototype.setParameterDefaults = function()
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
ED.CornealAbrasion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealAbrasion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealAbrasion
    var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    var alpha = -this.apexY/100;
    ctx.fillStyle = "rgba(0, 255, 0, 1)";
    
    // Semi -transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
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
ED.CornealAbrasion.prototype.description = function()
{
    var returnString = "";
    
    // Calculate size
    var averageScale = this.scaleX + this.scaleY;
    
    // Arbitrary cutoffs
    if (averageScale < 2) returnString = "Small ";
    else if (averageScale < 4) returnString = "Medium ";
    else returnString = "Large ";
    
    returnString += "corneal abrasion";
    
	return returnString;
}

/**
 * SectorIridectomy
 *
 * @class SectorIridectomy
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
ED.SectorIridectomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SectorIridectomy";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SectorIridectomy.prototype = new ED.Doodle;
ED.SectorIridectomy.prototype.constructor = ED.SectorIridectomy;
ED.SectorIridectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SectorIridectomy.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.SectorIridectomy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, Math.PI/2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.SectorIridectomy.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 60 * Math.PI/180;
    
    // Make a second one 90 degress to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SectorIridectomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SectorIridectomy.superclass.draw.call(this, _point);
	
    // Radii
    var ro =  376;

    // If iris there, take account of pupil size
    var ri;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ri = -doodle.apexY - 2;
    else ri = 300;
    
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
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(218,230,241,1)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(218,230,241,1)";
    
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
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SectorIridectomy.prototype.description = function()
{
    var returnString = "Sector iridectomy of " + (this.arc * 180/Math.PI).toFixed(0) + " degrees at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}
