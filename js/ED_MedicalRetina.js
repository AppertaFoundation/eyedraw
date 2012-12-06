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
 * PostPole template with disc and arcades
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
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.cdRatio = '0';
    
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
    
    // Disc radius
    var rd = 84;
    var x = this.drawing.eye == ED.eye.Right?300:-300;
    
	// Boundary path
	ctx.beginPath();
    
	// Optic disc
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
        
        // One disc diameter
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
    return this.drawing.doodleArray.length == 1?"No abnormality":"";
}

/**
 * Tests whether passed doodle is within a number of disc diameters of fovea
 *
 * @param {Doodle} _doodle The doodle to test
 * @param {Int} _diameters The number of disc diameters to test
 * @returns {Bool} True if doodle is within the passed number of disc diameters of fovea
 */
ED.PostPole.prototype.isWithinDiscDiametersOfFovea = function(_doodle, _diameters)
{
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < 4 * 84 * 84;
}

/**
 * Microaneurysm
 *
 * @class Microaneurysm
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
ED.Microaneurysm = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Microaneurysm";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Microaneurysm.prototype = new ED.Doodle;
ED.Microaneurysm.prototype.constructor = ED.Microaneurysm;
ED.Microaneurysm.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Microaneurysm.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(50, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Microaneurysm.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Microaneurysm.superclass.draw.call(this, _point);
    
    // Microaneurysm radius
    var r = 14;
    
	// Boundary path
	ctx.beginPath();
    
	// Microaneurysm
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
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
ED.Microaneurysm.prototype.description = function()
{
	return "";
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
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HardExudate.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(50, 30);
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
    var r = 14;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(220,220,0,1)";
    ctx.fillStyle = "rgba(220,220,0,1)";
	
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
	return "";
}

/**
 * Cotton Wool Spot
 *
 * @class CottonWoolSpot
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
ED.CottonWoolSpot = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CottonWoolSpot";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CottonWoolSpot.prototype = new ED.Doodle;
ED.CottonWoolSpot.prototype.constructor = ED.CottonWoolSpot;
ED.CottonWoolSpot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CottonWoolSpot.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.CottonWoolSpot.prototype.setPropertyDefaults = function()
{
    this.isSqueezable = true;
    this.isOrientated = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CottonWoolSpot.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CottonWoolSpot.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CottonWoolSpot.superclass.draw.call(this, _point);
    
    // Dimensions of haemorrhage
    var r = 80;
    var h = 50;
    var d = h/3;
    
	// Boundary path
	ctx.beginPath();
    
	// Cotton wool spot
    ctx.moveTo(-r,-h);
    ctx.lineTo(-r + d, -h + 1 * d);
    ctx.lineTo(-r, -h + 2 * d);
    ctx.lineTo(-r + d, -h + 3 * d);
    ctx.lineTo(-r, -h + 4 * d);
    ctx.lineTo(-r + d, -h + 5 * d);
    ctx.lineTo(-r, -h + 6 * d);
    ctx.bezierCurveTo(-r + d, -h + 7 * d, r - d, -h + 7 * d, r, -h + 6 * d);
    ctx.lineTo(r - d, -h + 5 * d);
    ctx.lineTo(r, -h + 4 * d);
    ctx.lineTo(r - d, -h + 3 * d);
    ctx.lineTo(r, -h + 2 * d);
    ctx.lineTo(r - d, -h + 1 * d);
    ctx.lineTo(r, -h);
    ctx.bezierCurveTo(r - d, -h - d, -r + d, -h - d, -r, -h);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r, -h));
	
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
ED.CottonWoolSpot.prototype.description = function()
{
    return "Cotton wool spot";
}

/**
 * Pre-retinal Haemorrhage
 *
 * @class PreRetinalHaemorrhage
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
ED.PreRetinalHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PreRetinalHaemorrhage";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PreRetinalHaemorrhage.prototype = new ED.Doodle;
ED.PreRetinalHaemorrhage.prototype.constructor = ED.PreRetinalHaemorrhage;
ED.PreRetinalHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PreRetinalHaemorrhage.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PreRetinalHaemorrhage.prototype.setPropertyDefaults = function()
{
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(50, 200);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2.0);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2.0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PreRetinalHaemorrhage.prototype.setParameterDefaults = function()
{
    this.apexY = 200;

    this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PreRetinalHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PreRetinalHaemorrhage.superclass.draw.call(this, _point);
    
    // Dimensions of haemorrhage
    var r = 100;
    var f = 0.6;
    
	// Boundary path
	ctx.beginPath();
    
	// Haemorrhage
    ctx.moveTo(r,0);
    ctx.lineTo(-r,0);
    ctx.bezierCurveTo(-r * f, 0, -r * f, this.apexY, 0, this.apexY);
    ctx.bezierCurveTo(r * f, this.apexY, r * f, 0, r, 0);
    
    // Close path
    ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{

	}
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(100, 0));
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
ED.PreRetinalHaemorrhage.prototype.description = function()
{
    return "Pre-retinal haemorrage";
}

/**
 * Fibrous Proliferation
 *
 * @class FibrousProliferation
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
ED.FibrousProliferation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "FibrousProliferation";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.FibrousProliferation.prototype = new ED.Doodle;
ED.FibrousProliferation.prototype.constructor = ED.FibrousProliferation;
ED.FibrousProliferation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FibrousProliferation.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.FibrousProliferation.prototype.setPropertyDefaults = function()
{
    this.isSqueezable = true;

    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FibrousProliferation.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-200, 150);
    this.rotation = -Math.PI/4;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FibrousProliferation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.FibrousProliferation.superclass.draw.call(this, _point);
    
    // Dimensions
    var w = 180;
    var h = 70;
    var wc = w * 0.6;
    var hc = h * 0.2;
    
	// Boundary path
	ctx.beginPath();
    
    // Patch with scalloped edges
    ctx.moveTo(-w, -h);
    ctx.bezierCurveTo(-wc, -hc, wc, -hc, w, -h);
    ctx.bezierCurveTo(wc, -hc, wc, hc, w, h);
    ctx.bezierCurveTo(wc, hc, -wc, hc, -w, h);
    ctx.bezierCurveTo(-wc, hc, -wc, -hc, -w, -h);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(120,120,120,0.5)";
    ctx.fillStyle = "rgba(120,120,120,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(w, -h));
	
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
ED.FibrousProliferation.prototype.description = function()
{
    return "Fibrous proliferation";
}

/**
 * Blot Haemorrhage
 *
 * @class BlotHaemorrhage
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
ED.BlotHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BlotHaemorrhage";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BlotHaemorrhage.prototype = new ED.Doodle;
ED.BlotHaemorrhage.prototype.constructor = ED.BlotHaemorrhage;
ED.BlotHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BlotHaemorrhage.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.BlotHaemorrhage.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-60, -60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BlotHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BlotHaemorrhage.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
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
ED.BlotHaemorrhage.prototype.description = function()
{
    return "";
}

/**
 * DiabeticNV template with disc and arcades
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
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DiabeticNV.prototype.setParameterDefaults = function()
{
    var n = this.drawing.numberOfDoodlesOfClass(this.className);
    
    switch (n)
    {
        case 0:
            this.originX = (this.drawing.eye == ED.eye.Right)?300:-300;
            this.originY = -100;
            break;
        case 1:
            this.originX = (this.drawing.eye == ED.eye.Right)?-176:176;
            this.originY = -236;
            break;
        case 2:
            this.originX = (this.drawing.eye == ED.eye.Right)?-176:176;
            this.originY = 236;
            break;
        default:
            this.setOriginWithDisplacements(0, -100);
            break;
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
    return this.locationRelativeToDisc();
}

/**
 * Circinate
 *
 * @class Circinate
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
ED.Circinate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Circinate";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Circinate.prototype = new ED.Doodle;
ED.Circinate.prototype.constructor = ED.Circinate;
ED.Circinate.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Circinate.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.Circinate.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Circinate.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(60, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Circinate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.Circinate.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Radius of Circinate
    var rc = 80;
    
    // Circle
    ctx.arc(0, 0, rc, 0, 2 * Math.PI, false);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200,200,0,0)";
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Parameters
        var ro = 40;
        var rh = 10
        var ne = 12;
        var el = 30;
        
        // Point objects
        var cp = new ED.Point(0, 0);
        var ep = new ED.Point(0, 0);
        
        // Red centre
        ctx.beginPath();
        ctx.arc(0, 0, rh, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        
        // Exudates
        phi = 2 * Math.PI/ne;
        for (i = 0; i < ne; i++)
        {
            ctx.beginPath();
            cp.setWithPolars(ro, i * phi);
            ep.setWithPolars(ro + el, i * phi);
            ctx.moveTo(cp.x, cp.y);
            ctx.lineTo(ep.x, ep.y);
            ctx.closePath();
            ctx.lineWidth = 12;
            ctx.strokeStyle = "rgba(220,220,0,1)";
            ctx.lineCap = "round";
            ctx.stroke();
        }
	}
    
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(rc, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.Circinate.prototype.groupDescription = function()
{
	return "Circinate maculopathy ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Circinate.prototype.description = function()
{
    return this.locationRelativeToFovea();
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
    
    // Update validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CystoidMacularOedema.prototype.setParameterDefaults = function()
{
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
 * Hard Drusen
 *
 * @class HardDrusen
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
ED.HardDrusen = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HardDrusen";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HardDrusen.prototype = new ED.Doodle;
ED.HardDrusen.prototype.constructor = ED.HardDrusen;
ED.HardDrusen.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HardDrusen.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.HardDrusen.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HardDrusen.prototype.setParameterDefaults = function()
{
    // Hard drusen is displaced for Fundus, central for others
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
ED.HardDrusen.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HardDrusen.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 200;
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
        var fill = "yellow";
        
        var dr = 10/this.scaleX;
        
        var p = new ED.Point(0,0);
        var n = 20 + Math.abs(Math.floor(this.apexY/2));
        for (var i = 0; i < n; i++)
        {
            p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
            this.drawSpot(ctx, p.x, p.y, dr, fill);
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
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
ED.HardDrusen.prototype.description = function()
{
    var returnString = "Signficant numbers of ";
    if (this.apexY > -100) returnString = "Moderate numbers of ";
    if (this.apexY > -50) returnString = "Several ";
	
	return returnString + "hard drusen";
}

/**
 * Laser Spot
 *
 * @class LaserSpot
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
ED.LaserSpot = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserSpot";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserSpot.prototype = new ED.Doodle;
ED.LaserSpot.prototype.constructor = ED.LaserSpot;
ED.LaserSpot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserSpot.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.LaserSpot.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserSpot.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
    this.setOriginWithDisplacements(100, 80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserSpot.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserSpot.superclass.draw.call(this, _point);
    
    // Radius of laser spot
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Circle
    ctx.arc(0, 0, r, 0, Math.PI * 2, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = r * 2/3;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "rgba(255, 128, 0, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * PRP (Poterior pole)
 *
 * @class PRPPostPole
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
ED.PRPPostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PRPPostPole";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PRPPostPole.prototype = new ED.Doodle;
ED.PRPPostPole.prototype.constructor = ED.PRPPostPole;
ED.PRPPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PRPPostPole.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
    this.isUnique = true;
    this.isMoveable = false;
    this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PRPPostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    ctx.rect(-480, -480, 960, 960);
    var r = 320;
    ctx.moveTo(r,0);
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var sr = 15;
        var si = 30;
        var ss = 48;
        var n = (1000 - 2 * ss)/(2 * sr + si);
        var sd = (2 * sr + si);
        var st = 10;
        
        // Draw spots
        for (var i = 0; i < n; i++)
        {
            for (var j = 0; j < n; j++)
            {
                // Calculate coordinates with a random element
                var x = -500 + ss + i * sd + Math.round((-0.5 + ED.randomArray[i + j]) * 20);
                var y = -500 + ss + j * sd + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 20);
                
                // Avoid macula
                if ((x * x + y * y) > r * r)
                {
                    // Avoid disc
                    if (this.drawing.eye == ED.eye.Right)
                    {
                        if (!((i == 13 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 14) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                    else
                    {
                        if (!((i == 2 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 1) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                }
            }
        }
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
ED.PRPPostPole.prototype.description = function()
{
	return "Panretinal photocoagulation";
}

/**
 * Macular Grid
 *
 * @class MacularGrid
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
ED.MacularGrid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularGrid";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularGrid.prototype = new ED.Doodle;
ED.MacularGrid.prototype.constructor = ED.MacularGrid;
ED.MacularGrid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularGrid.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.MacularGrid.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isRotatable = false;
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-150, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularGrid.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularGrid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Radius of outer and inner circle
	var ro = 250;
    var ri = -this.apexY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Grid spot separation
        var ss = 60;
        n = Math.floor(2 * ro/ss);
        var start = -n/2 * ss;
        
        // Draw spots
        for (var i = 0; i < n + 1; i++)
        {
            for (var j = 0; j < n + 1; j++)
            {
                var x = start + i * ss + Math.round((-0.5 + ED.randomArray[i + j]) * 15);
                var y = start + j * ss + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 15);

                // calculate radius of spot position
                var rSq = x * x + y * y;
                
                // Only draw spots that within area
                if (rSq >= ri * ri && rSq <= ro * ro)
                {
                    this.drawLaserSpot(ctx, x, y);
                }
            }
        }
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Focal laser
 *
 * @class FocalLaser
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
ED.FocalLaser = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "FocalLaser";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.FocalLaser.prototype = new ED.Doodle;
ED.FocalLaser.prototype.constructor = ED.FocalLaser;
ED.FocalLaser.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FocalLaser.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.FocalLaser.prototype.setPropertyDefaults = function()
{
    this.isRotatable = false;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-75, -50);
    this.parameterValidationArray['radius']['range'].setMinAndMax(50, 75);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FocalLaser.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    
    this.setOriginWithDisplacements(150, 80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FocalLaser.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Radius of outer circle
	var ro = -this.apexY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Outer ring
        if (this.apexY <= -75)
        {
            var m = 50;
            var d = m/Math.sqrt(2);
            this.drawLaserSpot(ctx, 0, -m);
            this.drawLaserSpot(ctx, d, -d);
            this.drawLaserSpot(ctx, m, 0);
            this.drawLaserSpot(ctx, d, d);
            this.drawLaserSpot(ctx, 0, m);
            this.drawLaserSpot(ctx, -d, d);
            this.drawLaserSpot(ctx, -m, 0);
            this.drawLaserSpot(ctx, -d, -d);
        }

        // Inner ring
        var i = 25;
        this.drawLaserSpot(ctx, 0, -i);
        this.drawLaserSpot(ctx, i, 0);
        this.drawLaserSpot(ctx, 0, i);
        this.drawLaserSpot(ctx, -i, 0);
        
        // Central spot
        this.drawLaserSpot(ctx, 0, 0);
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Geographic atrophy with variabel foveal sparing
 *
 * @class Geographic
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
ED.Geographic = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Geographic";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Geographic.prototype = new ED.Doodle;
ED.Geographic.prototype.constructor = ED.Geographic;
ED.Geographic.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Geographic.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Geographic.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters
 */
ED.Geographic.prototype.setParameterDefaults = function()
{
	this.apexY = -100;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Geographic.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.Geographic.superclass.draw.call(this, _point);
    
	// Radius of limbus
	var ro = 200;
    var ri = -this.apexY;
    var phi = -this.apexY * Math.PI/800;
    
    // Boundary path
	ctx.beginPath();
    
    var point = new ED.Point(0, 0);
    
	// Outer arc
    if (this.drawing.eye == ED.eye.Right)
    {
        ctx.arc(0, 0, ro, phi, 2 * Math.PI - phi, false);
        point.setWithPolars(ri, Math.PI/2 - phi);
        ctx.lineTo(point.x, point.y);
        ctx.arc(0, 0, ri, 2 * Math.PI - phi, phi, true);
    }
    else
    {
        ctx.arc(0, 0, ro, Math.PI - phi, -Math.PI + phi, true);
        point.setWithPolars(ri, phi - Math.PI/2);
        ctx.lineTo(point.x, point.y);
        ctx.arc(0, 0, ri, -Math.PI + phi, Math.PI - phi, false);
    }
    
    // Close path
    ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(255,255,50,0.8)";
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
	// Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
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
ED.Geographic.prototype.description = function()
{
	return "Geographic atrophy";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Geographic.prototype.snomedCode = function()
{
	return 414875008;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Geographic.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * VitreousOpacity template with disc and arcades
 *
 * @class VitreousOpacity
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
ED.VitreousOpacity = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "VitreousOpacity";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.VitreousOpacity.prototype = new ED.Doodle;
ED.VitreousOpacity.prototype.constructor = ED.VitreousOpacity;
ED.VitreousOpacity.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VitreousOpacity.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.VitreousOpacity.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);    
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +4);
}

/**
 * Sets default parameters
 */
ED.VitreousOpacity.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
    this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VitreousOpacity.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.VitreousOpacity.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Boundary path
	ctx.beginPath();
    
    // Radius of opacity
    var ro = 200;
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Opacity from apexY
    var opacity = 0.3  + 0.6 * (ro + 2 * this.apexY)/ro;
    ctx.fillStyle = "rgba(255, 0, 0," + opacity + ")";
	
	// Set attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle =  "rgba(255, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
    // Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
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
ED.VitreousOpacity.prototype.description = function()
{
	return "Vitreous opacity";
}

/**
 * CNV
 *
 * @class CNV
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
ED.CNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CNV";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CNV.prototype = new ED.Doodle;
ED.CNV.prototype.constructor = ED.CNV;
ED.CNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CNV.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.CNV.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, +0);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters
 */
ED.CNV.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.CNV.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Radius of CNV
    var r = 80;
    
    // Parameters of random curve
    var n = 16;
    var phi = 2 * Math.PI/n;
    var th = 0.5 * Math.PI/n;
    var b = 4;
    var point = new ED.Point(0,0);
    
    // First point
    var fp = new ED.Point(0,0);
    fp.setWithPolars(r, 0);
    ctx.moveTo(fp.x, fp.y);
    var rl = r;
    
    // Subsequent points
    for (var i = 0; i < n; i++)
    {
        // Get radius of next point
        var rn = r * (b + ED.randomArray[i])/b;
        
        // Control point 1
        var cp1 = new ED.Point(0,0);
        cp1.setWithPolars(rl, i * phi + th);
        
        // Control point 2
        var cp2 = new ED.Point(0,0);
        cp2.setWithPolars(rn, (i + 1) * phi - th);
        
        // Next point
        var pn = new ED.Point(0,0);
        pn.setWithPolars(rn, (i + 1) * phi);
        
        // Assign next point
        rl = rn;
        
        // Next point
        if (i == n - 1)
        {
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, fp.x, fp.y);
        }
        else
        {
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pn.x, pn.y);
        }
        
        // Control handle point
        if (i == 1)
        {
            point.x = pn.x;
            point.y = pn.y;
        }
    }
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 0;
    ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Yellow centre
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,190,1)";
        ctx.fill();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.CNV.prototype.description = function()
{
	return "CNV";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CNV.prototype.snomedCode = function()
{
	return 314517003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CNV.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * IRMA
 *
 * @class IRMA
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
ED.IRMA = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "IRMA";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IRMA.prototype = new ED.Doodle;
ED.IRMA.prototype.constructor = ED.IRMA;
ED.IRMA.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IRMA.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.IRMA.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +1.5);
}

/**
 * Sets default parameters
 */
ED.IRMA.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(100, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IRMA.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.IRMA.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Move to centre
    ctx.moveTo(0, 30);
    
    // Create curves for the IRMA
    ctx.bezierCurveTo(-30, 30, -70, 0, -50, -20);
    ctx.bezierCurveTo(-30, -40, -20, -10, 0, -10);
    ctx.bezierCurveTo(20, -10, 30, -40, 50, -20);
    ctx.bezierCurveTo(70, 0, 30, 30, 0, 30);
    
    // Transparent fill
    ctx.fillStyle = "rgba(100, 100, 100, 0)";
	
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle =  "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(50, -40));
	
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
ED.IRMA.prototype.groupDescription = function()
{
	return "Intraretinal microvascular abnormalities ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IRMA.prototype.description = function()
{
    return this.locationRelativeToFovea();
}

/**
 * Macular Thickening
 *
 * @class MacularThickening
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
ED.MacularThickening = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularThickening";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularThickening.prototype = new ED.Doodle;
ED.MacularThickening.prototype.constructor = ED.MacularThickening;
ED.MacularThickening.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularThickening.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.MacularThickening.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+100, +400);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularThickening.prototype.setParameterDefaults = function()
{
	this.rotation = -Math.PI/4;
	this.apexX = 100;
	this.apexY = 0;
	
    this.setOriginWithDisplacements(0, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularThickening.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MacularThickening.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Start path
		ctx.beginPath();
		
		// Spacing of lines
		var d = 30;
		
		// Draw central line
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
        
		// Draw other lines
		for (var s = -1; s < 2; s += 2)
		{
			for (var y = d; y < r; y += d)
			{
				var x = this.xForY(r, y);
				ctx.moveTo(-x, s * y);
				ctx.lineTo(x, s * y);
			}
		}
		
		// Set attributes
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(200, 200, 200, 0.75)";
		
		// Draw lines
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
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.MacularThickening.prototype.groupDescription = function()
{
	return "Macular thickening ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MacularThickening.prototype.description = function()
{
    return this.locationRelativeToFovea();
}

/**
 * TractionRetinalDetachment
 *
 * @class TractionRetinalDetachment
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
ED.TractionRetinalDetachment = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TractionRetinalDetachment";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TractionRetinalDetachment.prototype = new ED.Doodle;
ED.TractionRetinalDetachment.prototype.constructor = ED.TractionRetinalDetachment;
ED.TractionRetinalDetachment.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TractionRetinalDetachment.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.TractionRetinalDetachment.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.addAtBack = true;
	
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.TractionRetinalDetachment.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(200, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TractionRetinalDetachment.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.TractionRetinalDetachment.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Move to centre
    var r = 60;
    var s = 150;
    ctx.moveTo(-s, -s);
    
    // Create curves for the TractionRetinalDetachment
    ctx.bezierCurveTo(-r, -r, r, -r, s, -s);
    ctx.bezierCurveTo(r, -r, r, r, s, s);
    ctx.bezierCurveTo(r, r, -r, r, -s, s);
    ctx.bezierCurveTo(-r, r, -r, -r, -s, -s);
    ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle =  "blue";
    ctx.fillStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(s, -s));
	
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
ED.TractionRetinalDetachment.prototype.groupDescription = function()
{
	return "Traction retinal detachment ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.TractionRetinalDetachment.prototype.description = function()
{
    return this.locationRelativeToDisc();
}
