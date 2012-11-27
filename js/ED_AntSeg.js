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
    
    // Private parameters (NB. this private parameter is not saved, so MUST be bound to an input element via a derived parameter)
    this.hasPXE;
    
    // Derived parameters
    this.pupilSize;
    this.pxe;
    
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
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
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
            
        case 'hasPXE':
            returnArray['pxe'] = _value;
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
            
        case 'pxe':
            returnArray['hasPXE'] = _value;
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
	//ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	ctx.fillStyle = "rgba(255, 160, 40, 0.9)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Pseudo exfoliation
        if (this.hasPXE)
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
    
    // Derived parameters
    this.pupilSize;
    
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
    
    // Derived parameters
    this.incisionLength = (_arc * Math.PI/180) * (6 * _radius)/this.defaultRadius;
    this.incisionSite;
    this.incisionType;
    this.incisionMeridian;
    
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
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
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian - 90, 360).toFixed(0));
        }
        else
        {
            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian + 90, 360).toFixed(0));
        }
    }
    else
    {
        // First incision is usually temporal
        if (this.drawing.eye == ED.eye.Right)
        {
            this.setParameterFromString('incisionMeridian', '180');
        }
        else
        {
            this.setParameterFromString('incisionMeridian', '0');
        }
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
    
    // Derived parameters
    this.grade;
    
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
    
    // Derived parameters
    this.grade;
    
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
    
    // Derived parameters
    this.grade;
    
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
    this.parentClass = "Lens";
    this.inFrontOfClassArray = ["Lens", "PostSubcapCataract"];
    
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
    
    // Derived parameters
    this.grade;
    
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
    
    // Derived parameters
    this.grade;
    
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
