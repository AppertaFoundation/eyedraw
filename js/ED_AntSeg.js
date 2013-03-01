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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "AntSeg";
    
    // Class specific property
    this.hasPXE = false;
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
	this.isSelectable = true;
    this.isDeletable = false;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.animationArray = {apexY: "10"};
	this.rangeOfScale = new ED.Range(+1, +4);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-280, -60);
}

/**
 * Sets default parameters
 */
ED.AntSeg.prototype.setParameterDefaults = function()
{
	this.apexY = -260;
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
    //var r = ri + (ro - ri)/2;
	
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

///**
// * Returns size of pupil
// *
// * @returns {String} Grade of cataract
// */
//ED.AntSeg.prototype.getGrade = function()
//{
//    var returnValue = "";
//    if (this.apexY < -200) returnValue = 'Large';
//    else if (this.apexY < -100) returnValue = 'Medium';
//    else returnValue = 'Small';
//    
//    return returnValue;
//}
//
///**
// * Sets size of pupil
// *
// * @param {String} Size of pupil
// */
//ED.AntSeg.prototype.setGrade = function(_grade)
//{
//    switch (_grade)
//    {
//        case 'Small':
//            this.apexY = -100;
//            break;
//        case 'Medium':
//            this.apexY = -200;
//            break;
//        case 'Large':
//            this.apexY = -260;
//            break;
//        default:
//            break;
//    }
//}

///**
// * Sets PXE state
// *
// * @param {Bool} Whether PXE is present or not
// */
//ED.AntSeg.prototype.setPXE = function(_value)
//{
//    this.hasPXE = _value;
//}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.AntSeg.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Grade of cataract
        case 'grade':
            if (this.apexY < -200) returnValue = 'Large';
            else if (this.apexY < -100) returnValue = 'Medium';
            else returnValue = 'Small';
            break;
        case 'apexY':
            returnValue = this.apexY;
            break;
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.AntSeg.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Small':
                    //this.apexY = -100;
                    this.setParameterWithAnimation('apexY', -100);
                    break;
                case 'Medium':
                    //this.apexY = -200;
                    this.setParameterWithAnimation('apexY', -200);
                    break;
                case 'Large':
                    //this.apexY = -260;
                    this.setParameterWithAnimation('apexY', -260);
                    break;
                default:
                    break;
            }
            break;
        case 'pxe':
            this.hasPXE = _value;
            break
        case 'apexY':
            this.apexY = _value;
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
ED.AntSeg.prototype.description = function()
{
    //var returnString = this.getParameter('grade') + " pupil";
    
    //if (this.hasPXE) returnString += " with pseudoexfoliation";
    
    var returnString = this.drawing.doodleArray.length == 1?"no abnormality":"";
	
	return returnString;
}

/**
 * A nuclear cataract
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "NuclearCataract";
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
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.animationArray = {apexY: "10"};
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-180, 0);
}

/**
 * Sets default parameters
 */
ED.NuclearCataract.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
    this.apexY = -180;
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
    var brownColour = "rgba(" + Math.round(120 - this.apexY/2) + ", " + Math.round(60 - this.apexY/2) + ", 0, 0.75)";
    
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

///**
// * Returns grade of cataract
// *
// * @returns {String} Grade of cataract
// */
//ED.NuclearCataract.prototype.getGrade = function()
//{
//    var returnValue = "";
//    if (this.apexY < -120) returnValue = 'Mild';
//    else if (this.apexY < -60) returnValue = 'Moderate';
//    else returnValue = 'Brunescent';
//    
//    return returnValue;
//}
//
///**
// * Sets grade of cataract
// *
// * @param {String} Grade of cataract
// */
//ED.NuclearCataract.prototype.setGrade = function(_grade)
//{
//    switch (_grade)
//    {
//        case 'Mild':
//            this.apexY = -180;
//            break;
//        case 'Moderate':
//            this.apexY = -100;
//            break;
//        case 'Brunescent':
//            this.apexY = 0;
//            break;
//        default:
//            break;
//    }
//}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.NuclearCataract.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
            // Grade of cataract
        case 'grade':
            if (this.apexY < -120) returnValue = 'Mild';
            else if (this.apexY < -60) returnValue = 'Moderate';
            else returnValue = 'Brunescent';
            break;
        case 'apexY':
            returnValue = this.apexY;
            break;
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.NuclearCataract.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    //this.apexY = -180;
                    this.setParameterWithAnimation('apexY', -180);
                    break;
                case 'Moderate':
                    //this.apexY = -100;
                    this.setParameterWithAnimation('apexY', -100);
                    break;
                case 'Brunescent':
                    //this.apexY = 0;
                    this.setParameterWithAnimation('apexY', 0);
                    break;
                default:
                    break;
            }
            break;
        case 'apexY':
            this.apexY = _value;
            break;
        default:
            break
    }
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.NuclearCataract.prototype.setParameterWithoutAnimation = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    this.apexY = -180;
                    break;
                case 'Moderate':
                    this.apexY = -100;
                    break;
                case 'Brunescent':
                    this.apexY = 0;
                    break;
                default:
                    break;
            }
            break;
        case 'apexY':
            this.apexY = _value;
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
ED.NuclearCataract.prototype.description = function()
{
	return this.getParameter('grade').toLowerCase() + " nuclear cataract";
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "CorticalCataract";
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
 * Sets default dragging attributes
 */
ED.CorticalCataract.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.animationArray = {apexY: "10"};
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-180, -20);
}

/**
 * Sets default parameters
 */
ED.CorticalCataract.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
    this.apexY = -180;
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
    
	// CorticalCataract
    ctx.arc(0, 0, 240, 0, Math.PI * 2, true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
    
	ctx.fillStyle = "rgba(0,0,0,0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Parameters
        var n = 16;									// Number of cortical spokes
        var ro = 240;								// Outer radius of cataract
        var theta = 2 * Math.PI/n;	// Angle of outer arc of cortical shard
        var phi = theta/2;					// Half theta
        var ri = -this.apexY;				// Radius of inner clear area
        ctx.fillStyle = "rgba(200,200,200,0.75)";
        
        // Draw cortical spokes
        var i;
        for (i = 0; i < n; i++)
        {
            ctx.beginPath();
            var startAngle = i * theta - phi - Math.PI/2;
            var endAngle = startAngle + theta;
            ctx.arc(0, 0, ro, startAngle, endAngle, false);
            var p = new ED.Point(0, 0);
            p.setWithPolars(ri, i * theta); 
            ctx.lineTo(p.x, p.y);
            ctx.closePath();
            ctx.fill()
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

///**
// * Returns grade of cataract
// *
// * @returns {String} Grade of cataract
// */
//ED.CorticalCataract.prototype.getGrade = function()
//{
//    var returnValue = "";
//    if (this.apexY < -120) returnValue = 'Mild';
//    else if (this.apexY < -60) returnValue = 'Moderate';
//    else returnValue = 'White';
//    
//    return returnValue;
//}
//
///**
// * Sets grade of cataract
// *
// * @param {String} Grade of cataract
// */
//ED.CorticalCataract.prototype.setGrade = function(_grade)
//{
//    switch (_grade)
//    {
//        case 'Mild':
//            this.apexY = -180;
//            break;
//        case 'Moderate':
//            this.apexY = -100;
//            break;
//        case 'White':
//            this.apexY = 0;
//            break;
//        default:
//            break;
//    }
//}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.CorticalCataract.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Grade of cataract
        case 'grade':
            if (this.apexY < -120) returnValue = 'Mild';
            else if (this.apexY < -60) returnValue = 'Moderate';
            else returnValue = 'White';
            break;
        case 'apexY':
            returnValue = this.apexY;
            break;
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.CorticalCataract.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    //this.apexY = -180;
                    this.setParameterWithAnimation('apexY', -180);
                    break;
                case 'Moderate':
                    //this.apexY = -100;
                    this.setParameterWithAnimation('apexY', -100);
                    break;
                case 'White':
                    //this.apexY = 0;
                    this.setParameterWithAnimation('apexY', -20);
                    break;
                default:
                    break;
            }
            break;
        case 'apexY':
            this.apexY = _value;
            break;
        default:
            break
    }
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.CorticalCataract.prototype.setParameterWithoutAnimation = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    this.apexY = -180;
                    break;
                case 'Moderate':
                    this.apexY = -100;
                    break;
                case 'White':
                    this.apexY = -20;
                    break;
                default:
                    break;
            }
            break;
        case 'apexY':
            this.apexY = _value;
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
ED.CorticalCataract.prototype.description = function()
{
	return this.getParameter('grade').toLowerCase() + " cortical cataract";
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "PostSubcapCataract";
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
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.PostSubcapCataract.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.PostSubcapCataract.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
    var r = 50;
	ctx.arc(0, 0, 50, 0, Math.PI * 2, false);
    
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
ED.PostSubcapCataract.prototype.description = function()
{
	return "posterior subcapsular cataract";
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "PCIOL";
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
 * Sets default dragging attributes
 */
ED.PCIOL.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = true;
    this.isUnique = true;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.PCIOL.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
    
    //ctx.closePath();
    
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
ED.PCIOL.prototype.description = function()
{
    var returnValue = "posterior chamber IOL";
    
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "ACIOL";
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = true;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ACIOL.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
    
    //ctx.closePath();
    
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
ED.ACIOL.prototype.description = function()
{
    var returnValue = "anterior chamber IOL";
    
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
 * Posterior chamber IOL
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "ToricPCIOL";
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
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = true;
    this.isUnique = true;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.ToricPCIOL.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
    
    //ctx.closePath();
    
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Bleb";
    
    // Base radius
    this.baseRadius = 384;
}

/**
 * Sets superclass and constructor
 */
ED.Bleb.prototype = new ED.Doodle;
ED.Bleb.prototype.constructor = ED.Bleb;
ED.Bleb.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bleb.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.Bleb.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
}

/**
 * Sets default parameters
 */
ED.Bleb.prototype.setParameterDefaults = function()
{
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
	
	// Boundary path
	ctx.beginPath();
    
    // Draw limbal base
    var phi = Math.PI/12;
    ctx.arc(0, 0, this.baseRadius, -phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(this.baseRadius/4, -this.baseRadius * 1.25);
    ctx.lineTo(-this.baseRadius/4, -this.baseRadius * 1.25);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(240,240,240,0.9)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-40, -this.baseRadius);
        ctx.lineTo(-40, -this.baseRadius * 1.15);
        ctx.lineTo(40, -this.baseRadius * 1.15);
        ctx.lineTo(40, -this.baseRadius);
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
ED.Bleb.prototype.description = function()
{
    var returnString = "trabeculectomy bleb at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * PI
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
    
    // Class specific properties
    this.outerRadius = 360;
    
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
 * Sets handle attributes
 */
ED.PI.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.PI.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
}

/**
 * Sets default parameters
 */
ED.PI.prototype.setParameterDefaults = function()
{
    // Make it 45 degress to last one of same class
    var angle = 45 * Math.PI/180;
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + angle;
    }
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
	
	// Boundary path
	ctx.beginPath();
    
    // Draw base
    var phi = Math.PI/24;
    ctx.arc(0, 0, this.outerRadius, - phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(0, -this.outerRadius * 0.8);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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
ED.PI.prototype.description = function()
{
    var returnString = "peripheral iridectomy at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "RK";
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.5, +1.15);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-200, -60);
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
	
	// Other stuff here
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
    var returnString = "radial keratotomy";
    
	return returnString;
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "LasikFlap";
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.5, +1.15);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-200, -60);
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
    var angle = Math.PI/6;					// Angle of arc of flap hingle
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
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "Fuchs";
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
 * Sets default dragging attributes
 */
ED.Fuchs.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Fuchs.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
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
    var returnString = "Fuch's endothelial dystrophy";
    
	return returnString;
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "CornealScar";
    
    // Doodle specific property
    this.isInVisualAxis = false;
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
ED.CornealScar.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
    this.apexY = -50;
    this.scaleX = 0.7;
    this.scaleY = 0.5;
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
	
	// Other stuff here
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
    if (averageScale < 2) returnString = "small ";
    else if (averageScale < 4) returnString = "medium ";
    else returnString = "large ";
    
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
    
    // Set default values for new or loaded doodle (NB These are set before calling superclass constructor since latter calls setParameterDefaults method
    this.defaultRadius = 334;
    this.sutureSeparation = 1.5;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);

    // Set initial value of length according to loaded arc value (set here since calculated for both new and saved parameters)
    this.length = this.arc * (6 * this.radius)/this.defaultRadius;
    
    // Set initial value of apexYDelta according to loaded apexY amd radius value  (set here since calculated for both new and saved parameters)
    this.apexYDelta = - this.apexY - this.radius;
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
 * Sets default dragging attributes
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
    this.animationArray = {incisionLength: "1.2", incisionMeridian: "16", radius: "20"};
    this.rangeOfArc = new ED.Range(0, Math.PI);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-334, -300);
    this.rangeOfRadius = new ED.Range(250, 450);
}

/**
 * Sets default parameters
 */
ED.PhakoIncision.prototype.setParameterDefaults = function()
{
    // The radius property is changed by movement in rotatable doodles
    this.radius = this.defaultRadius;
    
    // Default is standard corneal phako wound
    this.arc = 27 * Math.PI/180;
    
    // ApexY needs to change with radius on movement, so keep a record of the change
    this.apexY = -this.defaultRadius;

    // Make a subsequent incision 90 degress to last one of same class
    var angle = Math.PI/2;
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + angle;
    }
    else
    {
        // First incision is usually temporal
        if (this.drawing.eye == ED.eye.Right)
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
ED.PhakoIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PhakoIncision.superclass.draw.call(this, _point);
	
    // Radius
    var r =  this.radius;
    var d = 40;
    var ro = r + d;
    var ri = r - d;
    
    // Change incision length according to radius
    if (this.drawing.mode == ED.Mode.Arc)
    {
        this.length = this.arc * (6 * this.radius)/this.defaultRadius;
    }
    // Changing type of incision
    else if (this.drawing.mode == ED.Mode.Apex)
    {
        this.apexYDelta = - this.apexY - this.radius; 
    }
    // Otherwise change arc for constant incision length (use the drawFunctionMode test since can also be moved by an animation)
    //else if (this.drawing.mode == ED.Mode.Move)
    else if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        this.arc = this.length * this.defaultRadius/(6 * this.radius);
        this.apexY = -this.radius - this.apexYDelta;
        this.rangeOfApexY = new ED.Range(-this.radius, -this.radius + 34);
    }
    
    // Limit incision length to range allowed in CND, but with minimum of 1
    if (this.length > 9.9) this.arc = 9.9 * this.defaultRadius/(6 * this.radius);
    if (this.length < 1.0) this.arc = 1.0 * this.defaultRadius/(6 * this.radius);
    
    // Limit meridian to values in CND (nnn.n 000.5 to 180.0 degrees)
    //if (this.rotation < -0.5 * Math.PI && this.rotation > -1 * Math.PI) this.rotation = -0.5 * Math.PI;
    //if (this.rotation > -1.5 * Math.PI && this.rotation < -1 * Math.PI) this.rotation = -1.5 * Math.PI;
    
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
	
	// Other stuff here
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
    if (this.radius > 428) returnString = 'scleral ';
    else if (this.radius > 344) returnString = 'limbal ';
    else returnString = 'corneal ';
    
    // Incision type
    returnString += this.apexYDelta == 0?"pocket ":"section "
    returnString += "incision at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.PhakoIncision.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Incision site (CND 5.13)
        case 'incisionSite':
            if (this.radius >= 428) returnValue = 'Scleral';
            else if (this.radius >= 344) returnValue = 'Limbal';
            else returnValue = 'Corneal';
            break;
        // Incision length (CND 5.14)
        case 'incisionLength':
            // Calculate length of arc in mm
            var length = this.radius * this.arc * 6/this.defaultRadius;
            
            // Round to nearest 0.1mm
            length = (Math.round(length * 10))/10;
            
            // Maximum value according to CND
            if (length > 9.9) length = 9.9;
            
            returnValue = length.toFixed(1);
            break;
        // Incision Meridian (CND 5.15)
        case 'incisionMeridian':
            var angle = (((Math.PI * 2 - this.rotation + Math.PI/2) * 180/Math.PI) + 360) % 360;
            if (angle == 360) angle = 0;
            returnValue = angle.toFixed(0);
            break;
        // Incision Type (Not in CND but infers type of operation)
        case 'incisionType':
            returnValue = this.apexYDelta == 0?"Pocket":"Section";
            break;
        // Radius
        case 'radius':
            returnValue = this.radius;
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
ED.PhakoIncision.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        // Incision site (CND 5.13)
        case 'incisionSite':
            switch (_value)
            {
                case 'Scleral':
                    this.setParameterWithAnimation('radius', 428);
                    break;
                case 'Limbal':
                    this.setParameterWithAnimation('radius', 376);
                    break;
                case 'Corneal':
                    this.setParameterWithAnimation('radius', 330);
                    break;
                default:
                    break;
            }
            
            // Correct for change in arc as incision moves
            this.arc = this.length * this.defaultRadius/(6 * this.radius);
            break;
            
        // Incision length (CND 5.14)
        case 'incisionLength':
            this.length = _value;
            this.arc = this.length * this.defaultRadius/(6 * this.radius);
            break;
            
        // Incision Meridian
        case 'incisionMeridian':
            var angle = ((90 - _value) + 360) % 360;
            this.rotation = angle * Math.PI/180;
            break;
            
        // Incision type
        case 'incisionType':
            if (_value == "Pocket")
            {
                this.apexYDelta = 0;
            }
            else
            {
                this.apexYDelta = -34;
            }
            this.apexY = -this.radius - this.apexYDelta;
            break;
        
        // Radius
        case 'radius':
            this.radius = _value;
            break;
            
        default:
            break
    }
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
 * Sets handle attributes
 */
ED.SidePort.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.SidePort.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    this.rangeOfArc = new ED.Range(0, Math.PI);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-334, -300);
    this.rangeOfRadius = new ED.Range(250, 450);
}

/**
 * Sets default parameters
 */
ED.SidePort.prototype.setParameterDefaults = function()
{
    // Default is standard corneal phako wound
    this.incisionLength = 1.5;
    
    // Incision length based on an average corneal radius of 6mm
    this.arc = this.incisionLength/6;
    
    // Make a subsequent incision 90 degress to last one of same class
    var angle = Math.PI/2;
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + angle;
    }
    else
    {
        // New sideports usually temporal
        if (this.drawing.eye == ED.eye.Right)
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
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
	// Draw handles if selected
	//if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.description = function()
{
    var returnString = "sideport at ";
    
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    this.rangeOfArc = new ED.Range(20 * Math.PI/180, Math.PI/2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-334, -300);
    this.rangeOfRadius = new ED.Range(250, 450);
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
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
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
ED.LimbalRelaxingIncision.prototype.description = function()
{
    var returnString = "limbal relaxing incision " + (this.arc * 180/Math.PI).toFixed(0) + " degrees at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.LimbalRelaxingIncision.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Incision length (CND 5.14)
        case 'incisionLength':
            // Calculate length of arc in mm
            var length = this.radius * this.arc * 6/this.defaultRadius;
            
            // Round to nearest 0.1mm
            length = (Math.round(length * 10))/10;
            
            // Maximum value according to CND
            if (length > 9.9) length = 9.9;
            
            returnValue = length.toFixed(1);
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
ED.LimbalRelaxingIncision.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'incisionLength':
            this.length = _value;
            this.arc = this.length * this.defaultRadius/(6 * this.radius);
            break;            
        default:
            break
    }
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
 * Sets handle attributes
 */
ED.IrisHook.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.IrisHook.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
}

/**
 * Sets default parameters
 */
ED.IrisHook.prototype.setParameterDefaults = function()
{
    // Make it 90 degress to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/2;
    }
    else
    {
        this.rotation = -Math.PI/4;
    }
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
    
    // Colour of outer line is dark gray
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
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
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
 * Sets handle attributes
 */
ED.MattressSuture.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.MattressSuture.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
}

/**
 * Sets default parameters
 */
ED.MattressSuture.prototype.setParameterDefaults = function()
{
    this.defaultRadius = 374;
    
    // The radius property is changed by movement in rotatable doodles
    this.radius = this.defaultRadius;
    
    // Make it 20 degress to last one of same class
    var angle = 20 * Math.PI/180;
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + angle;
    }
    else
    {
        this.rotation = -angle/2;
    }
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
    var returnString = "mattress suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
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
 * Sets handle attributes
 */
ED.CornealSuture.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.CornealSuture.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
}

/**
 * Sets default parameters
 */
ED.CornealSuture.prototype.setParameterDefaults = function()
{
    this.defaultRadius = 374;
    
    // The radius property is changed by movement in rotatable doodles
    this.radius = this.defaultRadius;
    
    // Make it 20 degress to last one of same class
    var angle = 20 * Math.PI/180;
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + angle;
    }
    else
    {
        this.rotation = -angle/2;
    }
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
ED.CornealSuture.prototype.description = function()
{
    var returnString = "corneal suture at ";
    
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
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "CapsularTensionRing";
}

/**
 * Sets superclass and constructor
 */
ED.CapsularTensionRing.prototype = new ED.Doodle;
ED.CapsularTensionRing.prototype.constructor = ED.CapsularTensionRing;
ED.CapsularTensionRing.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CapsularTensionRing.prototype.setHandles = function()
{
    //this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CapsularTensionRing.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isUnique = true;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.CapsularTensionRing.prototype.setParameterDefaults = function()
{
    this.originX = 0;
	this.originY = 0;
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
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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
ED.CapsularTensionRing.prototype.description = function()
{
    var returnValue = "Capsular Tension Ring";
    
	return returnValue;
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
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
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
 * Scleral TrialLens
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
	this.isSelectable = true;
    this.isShowHighlight = false;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.addAtBack = true;
    //this.animationArray = {axis: "10"};
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
    
	// Close path
	//ctx.closePath();
	
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
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.TrialLens.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
        // Axis
        case 'axis':
            returnValue = (360 - this.degrees()) % 180;
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
ED.TrialLens.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        // Axis
        case 'axis':
            //var angle = ((90 - _value) + 360) % 360;
            var angle = _value;
            this.rotation = (180 - angle)  * Math.PI/180;
            break;            
        default:
            break
    }
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
 * Sets default dragging attributes
 */
ED.AntSegCrossSection.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.AntSegCrossSection.prototype.setParameterDefaults = function()
{
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
	
	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 380;
    
    // Arbitray radius of curvature
    var r = 500;
    
    // Displacement of cornea and lens from centre
    var cd = -200;
    var ld = 0;
    
    // Thickness of cornea
    var ct = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, r, theta, -theta, true);
    ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI - theta, true);
    
    // Measurements of nucleus
    var rn = r - 80;
    
    // Calculate cataract angles
    var phi = Math.acos(x/rn);
    
    // Draw lens with two sections of circumference of circle
    ctx.moveTo(ld, rn * Math.sin(phi));
    ctx.arc(ld - x, 0, rn, phi, -phi, true);
    ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
    
    // Draw cornea in similar way
//    ctx.moveTo(cd, h);
//    ctx.arc(cd + x, 0, r, Math.PI - theta, Math.PI + theta, false);
//    r = r - ct;
//    var x1 = r * Math.cos(theta);
//    ctx.lineTo(cd + (x - x1), -r * Math.sin(theta));
//    ctx.arc(cd + x, 0, r, Math.PI + theta, Math.PI - theta, true);
//    ctx.lineTo(cd, h);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245, 245, 245, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
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
 * Sets default dragging attributes
 */
ED.CorticalCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.CorticalCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.apexY = -180;
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
	var h = 380;
    
    // Radius of curvature of lens
    var r = 500;
    
    // Displacement lens from centre
    var ld = 0;
    
    // Thickness of lens
    var lt = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of cortical cataract
    var rco = r - 40;
    
    // Calculate cataract angles
    var phio = Math.acos(x/rco);
    var phii = Math.asin(-this.apexY/rco);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw cataract with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, phii, phio, false);
    ctx.arc(ld + x, 0, rco, Math.PI - phio, Math.PI - phii, false);
    
    // Move to upper half and draw it
    var l = rco * Math.cos(phii);
    ctx.moveTo(ld - x + l, this.apexY);
    ctx.arc(ld - x, 0, rco, -phii, -phio, true);
    ctx.arc(ld + x, 0, rco, Math.PI + phio, Math.PI + phii, true);
    
	// Set line attributes
	ctx.lineWidth = 48;
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
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
ED.CorticalCataractCrossSection.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
            // Grade of cataract
        case 'grade':
            if (this.apexY < -120) returnValue = 'Mild';
            else if (this.apexY < -60) returnValue = 'Moderate';
            else returnValue = 'White';
            break;
        case 'apexY':
            returnValue = this.apexY;
            break;
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.CorticalCataractCrossSection.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    //this.apexY = -180;
                    this.setParameterWithAnimation('apexY', -180);
                    break;
                case 'Moderate':
                    //this.apexY = -100;
                    this.setParameterWithAnimation('apexY', -100);
                    break;
                case 'White':
                    //this.apexY = 0;
                    this.setParameterWithAnimation('apexY', -20);
                    break;
                default:
                    break;
            }
            break;
        case 'apexY':
            this.apexY = _value;
            break;
        default:
            break
    }
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
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.NuclearCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.apexY = -180;
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
	var h = 380;
    
    // Radius of curvature of lens
    var r = 500;
    
    // Displacement lens from centre
    var ld = 0;
    
    // Thickness of lens
    var lt = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of nuclear cataract
    var rco = r - 80;
    
    // Calculate cataract angles
    var phi = Math.acos(x/rco);

    // Boundary path
	ctx.beginPath();
    
    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, phi, -phi, true);
    ctx.arc(ld + x, 0, rco, Math.PI + phi, Math.PI - phi, true);
    
    // Colors for gradient
    var yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(" + Math.round(120 - this.apexY/2) + ", " + Math.round(60 - this.apexY/2) + ", 0, 0.75)";
    
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
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));
    
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
ED.NuclearCataractCrossSection.prototype.getParameter = function(_parameter)
{
    var returnValue;
    
    switch (_parameter)
    {
            // Grade of cataract
        case 'grade':
            if (this.apexY < -120) returnValue = 'Mild';
            else if (this.apexY < -60) returnValue = 'Moderate';
            else returnValue = 'White';
            break;
        case 'apexY':
            returnValue = this.apexY;
            break;
        default:
            returnValue = "";
            break;
    }
    
    return returnValue;
}

/**
 * Sets parameters for this doodle
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.NuclearCataractCrossSection.prototype.setParameter = function(_parameter, _value)
{
    switch (_parameter)
    {
        case 'grade':
            switch (_value)
        {
            case 'Mild':
                //this.apexY = -180;
                this.setParameterWithAnimation('apexY', -180);
                break;
            case 'Moderate':
                //this.apexY = -100;
                this.setParameterWithAnimation('apexY', -100);
                break;
            case 'White':
                //this.apexY = 0;
                this.setParameterWithAnimation('apexY', -20);
                break;
            default:
                break;
        }
            break;
        case 'apexY':
            this.apexY = _value;
            break;
        default:
            break
    }
}
