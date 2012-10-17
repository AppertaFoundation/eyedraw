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
    
    // Update component of validation array for simple parameterss
    var apexX = this.drawing.eye == ED.eye.Right?300:-300;
    this.parameterValidationArray['apexX']['range'].setMinAndMax(apexX, apexX);
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
    this.apexX = this.drawing.eye == ED.eye.Right?300:-300;
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
    var x = this.drawing.eye == ED.eye.Right?300:-300;
    
	// Boundary path
	ctx.beginPath();
    
	// Optic disk
	ctx.arc(x, 0, rd, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(249,187,76,1)";
    ctx.fillStyle = "rgba(249,187,76,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Optic cup
        ctx.beginPath();
        ctx.arc(x, 0, -this.apexY, 2 * Math.PI, 0, false);
        ctx.fillStyle = "white";
        var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPatternSmall'],'repeat');
        ctx.fillStyle = ptrn;
        ctx.lineWidth = 4;
        ctx.fill();
		ctx.stroke();
        
        // Arcades
        ctx.beginPath();
        
        // Coordinates
        var sign = this.drawing.eye == ED.eye.Right?1:-1;
        var startX = -300 * sign;
        var midX1 = -50 * sign;
        var midX2 = 300 * sign;
        var midX3 = 300 * sign;
        var endX1 = 300 * sign;
        var endX2 = 350 * sign;
        var endX3 = 400 * sign;
        var foveaX = 0;
        
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
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";
		ctx.stroke();
        
        // One disk diameter
        ctx.beginPath();
        ctx.arc(0, 0, 2 * rd, 2 * Math.PI, 0, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
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
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PostPole.prototype.description = function()
{
	return "Cup-disk ratio of " + this.getParameter('cdRatio');
}

/**
 * Tests whether passed doodle is within a number of disk diameters of fovea
 *
 * @param {Doodle} _doodle The doodle to test
 * @param {Int} _diameters The number of disk diameters to test
 * @returns {Bool} True if doodle is within the passed number of disk diameters of fovea
 */
ED.PostPole.prototype.isWithinDiskDiametersOfFovea = function(_doodle, _diameters)
{
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < 4 * 84 * 84;
}

/**
 * Hard exudate
 *
 * @class HardExudate
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
ED.HardExudate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HardExudate";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HardExudate.prototype = new ED.Doodle;
ED.HardExudate.prototype.constructor = ED.HardExudate;
ED.HardExudate.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.HardExudate.prototype.setPropertyDefaults = function()
{
	//this.isRotatable = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HardExudate.prototype.setParameterDefaults = function()
{
//    var doodle = this.drawing.lastDoodleOfClass(this.className);
//    if (doodle)
//    {
//        this.originX = doodle.originX + 50;
//        this.originY = doodle.originY + 50;
//    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HardExudate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HardExudate.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 20;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(220,220,35,1)";
    ctx.fillStyle = "rgba(220,220,35,1)";
	
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
ED.HardExudate.prototype.description = function()
{
	var returnString = "";
    
//    var postPole = this.drawing.lastDoodleOfClass('PostPole');
//    if (postPole && postPole.isWithinDiskDiametersOfFovea(this, 1))
//    {
//        returnString =  'YES';
//    }
//    else
//    {
//        returnString =  'No';
//    }
    
	return returnString;
}

/**
 * DiabeticNV template with disk and arcades
 *
 * @class DiabeticNV
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
ED.DiabeticNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DiabeticNV";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiabeticNV.prototype = new ED.Doodle;
ED.DiabeticNV.prototype.constructor = ED.DiabeticNV;
ED.DiabeticNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DiabeticNV.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.DiabeticNV.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
    this.isUnique = false;
//	this.rangeOfScale = new ED.Range(+0.5, +2);
//	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
//	this.rangeOfApexX = new ED.Range(-0, +0);
//	this.rangeOfApexY = new ED.Range(-200, 0);
}

/**
 * Sets default parameters
 */
ED.DiabeticNV.prototype.setParameterDefaults = function()
{
    if (this.drawing.eye == ED.eye.Right) this.originX = 300;
    else this.originX = -300;
    this.originY = -100;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.originX = doodle.originX - 100;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiabeticNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.DiabeticNV.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Radius of NV
    var r = 60;
    var c = r/2;
    var phi = 0;
    var theta = Math.PI/8;
    var n = 8;
    
	// Do a vessel
    var cp1 = new ED.Point(0, 0);
    var cp2 = new ED.Point(0, 0);
    var tip = new ED.Point(0, 0);
    var cp3 = new ED.Point(0, 0);
    var cp4 = new ED.Point(0, 0);
    
    // Move to centre
    ctx.moveTo(0,0);
    
    // Loop through making petals
    var i;
    for (i = 0; i < n; i++)
    {
        phi = i * 2 * Math.PI/n;
        
        cp1.setWithPolars(c, phi - theta);
        cp2.setWithPolars(r, phi - theta);
        tip.setWithPolars(r, phi);
        cp3.setWithPolars(r, phi + theta);
        cp4.setWithPolars(c, phi + theta);
        
        // Draw petal
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tip.x, tip.y);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, 0, 0);
    }
    
    // Transparent fill
    ctx.fillStyle = "rgba(100, 100, 100, 0)";
	
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle =  "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
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
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiabeticNV.prototype.groupDescription = function()
{
	return "Diabetic new vessels ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiabeticNV.prototype.description = function()
{
	returnString = "";
    
    var locationString = "";
    
    // Right eye
    if(this.drawing.eye == ED.eye.Right)
    {
        if (this.originX > 180 && this.originX < 420 && this.originY > -120 && this.originY < 120)
        {
            locationString = "at the disk";
        }
        else
        {
            locationString += this.originY <= 0?"supero":"infero";
            locationString += this.originX <= 300?"temporally":"nasally";
        }
    }
    // Left eye
    else
    {
        if (this.originX < -180 && this.originX > -420 && this.originY > -120 && this.originY < 120)
        {
            locationString = "at the disk";
        }
        else
        {
            locationString += this.originY <= 0?"supero":"infero";
            locationString += this.originX >= -300?"temporally":"nasally";
        }
    }
    
    returnString += locationString;
    
    return returnString;
}



