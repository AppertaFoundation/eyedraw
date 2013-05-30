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
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.surgeonPosition = 'Temporal';

	// originX is no longer used, so we set it to 0 to avoid offset problems with earlier saved data
	_originX = 0;
    
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
	this.isScaleable = false;
	this.isMoveable = false;
    this.snapToAngles = true;
    this.willStaySelected = false;
    this.isUnique = true;
    this.isDeletable = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+100, +500);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['surgeonPosition'] = {kind:'derived', type:'string', list:['Superior', 'Supero-temporal', 'Temporal', 'Infero-temporal', 'Inferior', 'Infero-nasal', 'Nasal', 'Supero-nasal'], animate:true};

    // Array of angles to snap to
    var phi = Math.PI/4;
    this.anglesArray = [0, phi, phi * 2, phi * 3, phi * 4, phi * 5, phi * 6, phi * 7];
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Surgeon.prototype.setParameterDefaults = function()
{
    this.rotation = 0;
    this.setParameterFromString('surgeonPosition', 'Temporal');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Surgeon.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    var isRE = (this.drawing.eye == ED.eye.Right);
    var dial = 2 * Math.PI;
    
    switch (_parameter)
    {
        // Surgeon position
        case 'rotation':
            if (isRE)
            {
                if (_value < dial/16 ) returnArray['surgeonPosition'] = 'Superior';
                else if (_value < 3 * dial/16 ) returnArray['surgeonPosition'] = 'Supero-nasal';
                else if (_value < 5 * dial/16 ) returnArray['surgeonPosition'] = 'Nasal';
                else if (_value < 7 * dial/16 ) returnArray['surgeonPosition'] = 'Infero-nasal';
                else if (_value < 9 * dial/16 ) returnArray['surgeonPosition'] = 'Inferior';
                else if (_value < 11 * dial/16) returnArray['surgeonPosition'] = 'Infero-temporal';
                else if (_value < 13 * dial/16) returnArray['surgeonPosition'] = 'Temporal';
                else if (_value < 15 * dial/16) returnArray['surgeonPosition'] = 'Supero-temporal';
                else returnArray['surgeonPosition'] = 'Superior';
            }
            else
            {
                if (_value < dial/16 ) returnArray['surgeonPosition'] = 'Superior';
                else if (_value < 3 * dial/16 ) returnArray['surgeonPosition'] = 'Supero-temporal';
                else if (_value < 5 * dial/16) returnArray['surgeonPosition'] = 'Temporal';
                else if (_value < 7 * dial/16) returnArray['surgeonPosition'] = 'Infero-temporal';
                else if (_value < 9 * dial/16) returnArray['surgeonPosition'] = 'Inferior';
                else if (_value < 11 * dial/16) returnArray['surgeonPosition'] = 'Infero-nasal';
                else if (_value < 13 * dial/16) returnArray['surgeonPosition'] = 'Nasal';
                else if (_value < 15 * dial/16) returnArray['surgeonPosition'] = 'Supero-nasal';
                else returnArray['surgeonPosition'] = 'Superior';
            }
            break;

        case 'surgeonPosition':
            switch (_value)
            {
                case 'Superior':
                    returnArray['rotation'] = 0;
                    break;
                case 'Supero-temporal':
                    returnArray['rotation'] = isRE?7 * Math.PI/4:1 * Math.PI/4;
                    break;
                case 'Temporal':
                    returnArray['rotation'] = isRE?6 * Math.PI/4:2 * Math.PI/4;
                    break;
                case 'Infero-temporal':
                    returnArray['rotation'] = isRE?5 * Math.PI/4:3 * Math.PI/4;
                    break;
                case 'Inferior':
                    returnArray['rotation'] = Math.PI;
                    break;
                case 'Infero-nasal':
                    returnArray['rotation'] = isRE?3 * Math.PI/4:5 * Math.PI/4;
                    break;
                case 'Nasal':
                    returnArray['rotation'] = isRE?2 * Math.PI/4:6 * Math.PI/4;
                    break;
                case 'Supero-nasal':
                    returnArray['rotation'] = isRE?1 * Math.PI/4:7 * Math.PI/4;
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
    
    // Shift up y-axis
    var y = -300;
    
    // Surgeon
    ctx.moveTo(0 * s, y - 200 * s);
    ctx.bezierCurveTo( -100 * s, y - 250 * s, -145 * s, y-190 * s, -200 * s, y - 180 * s);
    ctx.bezierCurveTo( -310 * s, y - 160 * s, -498 * s, y - 75 * s, -500 * s, y + 0 * s);
    ctx.bezierCurveTo( -500 * s, y + 50 * s, -500 * s, y + 460 * s, -470 * s, y + 700 * s);
    ctx.bezierCurveTo( -470 * s, y + 710 * s, -500 * s, y + 770 * s, -500 * s, y + 810 * s);
    ctx.bezierCurveTo( -500 * s, y + 840 * s, -440 * s, y + 850 * s, -420 * s, y + 840 * s);
    ctx.bezierCurveTo( -390 * s, y + 830 * s, -380 * s, y + 710 * s, -380 * s, y + 700 * s);
    ctx.bezierCurveTo( -370 * s, y + 700 * s, -360 * s, y + 780 * s, -350 * s, y + 780 * s);
    ctx.bezierCurveTo( -330 * s, y + 780 * s, -340 * s, y + 730 * s, -340 * s, y + 700 * s);
    ctx.bezierCurveTo( -340 * s, y + 690 * s, -350 * s, y + 680 * s, -350 * s, y + 670 * s);
    ctx.bezierCurveTo( -350 * s, y + 590 * s, -385 * s, y + 185 * s, -300 * s, y + 100 * s);
    
    ctx.bezierCurveTo( -150 * s, y + 140 * s, -250 * s, y + 200 * s, 0 * s, y + 300 * s);
    
    ctx.bezierCurveTo( 250 * s, y + 200 * s, 150 * s, y + 140 * s, 300 * s, y + 100 * s);
    ctx.bezierCurveTo( 380 * s, y + 180 * s, 350 * s, y + 590 * s, 350 * s, y + 670 * s);
    ctx.bezierCurveTo( 350 * s, y + 680 * s, 340 * s, y + 690 * s, 340 * s, y + 700 * s);
    ctx.bezierCurveTo( 340 * s, y + 730 * s, 330 * s, y + 780 * s, 350 * s, y + 780 * s);
    ctx.bezierCurveTo( 360 * s, y + 780 * s, 370 * s, y + 700 * s, 380 * s, y + 700 * s);
    ctx.bezierCurveTo( 380 * s, y + 710 * s, 390 * s, y + 830 * s, 420 * s, y + 840 * s);
    ctx.bezierCurveTo( 430 * s, y + 845 * s, 505 * s, y + 840 * s, 505 * s, y + 810 * s);
    ctx.bezierCurveTo( 505 * s, y + 760 * s, 470 * s, y + 710 * s, 470 * s, y + 700 * s);
    ctx.bezierCurveTo( 500 * s, y + 460 * s, 499 * s, y + 45 * s, 500 * s, y + 0 * s);
    ctx.bezierCurveTo( 498 * s, y - 78 * s, 308 * s, y - 164 * s, 200 * s, y - 182 * s);
    ctx.bezierCurveTo( 145 * s, y - 190 * s, 100 * s, y - 250 * s, 0 * s, y - 200 * s);
    
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
        // Head
        ctx.beginPath();
        
        ctx.moveTo(0 * s, y - 250 * s);
        ctx.bezierCurveTo( -100 * s, y - 250 * s, -180 * s, y - 200 * s, -200 * s, y - 170 * s);
        ctx.bezierCurveTo( -209 * s, y - 157 * s, -220 * s, y - 100 * s, -230 * s, y - 50 * s);
        ctx.bezierCurveTo( -260 * s, y - 70 * s, -260 * s, y - 20 * s, -260 * s, y + 0 * s);
        ctx.bezierCurveTo( -260 * s, y + 20 * s, -260 * s, y + 80 * s, -230 * s, y + 60 * s);
        ctx.bezierCurveTo( -230 * s, y + 90 * s, -220 * s, y + 141 * s, -210 * s, y + 160 * s);
        ctx.bezierCurveTo( -190 * s, y + 200 * s, -100 * s, y + 280 * s, -40 * s, y + 300 * s);
        ctx.bezierCurveTo( -34 * s, y + 303 * s, -20 * s, y + 350 * s, 0 * s, y + 350 * s);
        ctx.bezierCurveTo( 20 * s, y + 350 * s, 34 * s, y + 300 * s, 40 * s, y + 300 * s);
        ctx.bezierCurveTo( 100 * s, y + 280 * s, 190 * s, y + 200 * s, 210 * s, y + 160 * s);
        ctx.bezierCurveTo( 218 * s, y + 143 * s, 230 * s, y + 90 * s, 230 * s, y + 60 * s);
        ctx.bezierCurveTo( 260 * s, y + 80 * s, 260 * s, y + 20 * s, 260 * s, y + 0 * s);
        ctx.bezierCurveTo( 260 * s, y - 20 * s, 260 * s, y - 70 * s, 230 * s, y - 50 * s);
        ctx.bezierCurveTo( 220 * s, y - 100 * s, 208 * s, y - 158 * s, 200 * s, y - 170 * s);
        ctx.bezierCurveTo( 180 * s, y - 200 * s, 100 * s, y - 250 * s, 0 * s, y - 250 * s);
        
        ctx.fill();
        ctx.stroke();
	}
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 *  OperatingTable
 *
 * @class  OperatingTable
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
ED.OperatingTable = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "OperatingTable";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.OperatingTable.prototype = new ED.Doodle;
ED.OperatingTable.prototype.constructor = ED.OperatingTable;
ED.OperatingTable.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.OperatingTable.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OperatingTable.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OperatingTable.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// Head
	ctx.arc(0,-0,60,0,Math.PI*2,true);
    
    // Set Attributes
    ctx.lineWidth = 30;
    ctx.strokeStyle = "rgba(120,120,120,1)";
    ctx.fillStyle = "rgba(220,220,220,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Bed
        ctx.rect(-100, 20, 200, 400);
        
        // Set Attributes
        ctx.lineWidth = 8;
        ctx.strokeStyle = "rgba(120,120,120,1)";
        ctx.fillStyle = "rgba(220,220,220,1)";
        
        ctx.fill();
        ctx.stroke();
	}
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Peripheral iridectomy
 *
 * @class Label
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
ED.Label = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Label";

    // Label text
    this.labelText = "Start typing..";
    this.savedParams = ['labelText'];
    
    // Label width and height
    this.labelWidth = 0;
    this.labelHeight = 80;
    
    // Label font
    this.labelFont = "60px sans-serif";
    
    // Horizontal padding between label and boundary path
    this.padding = 10;
    
    // Maximum length
    this.maximumLength = 20;
    
    // Flag to indicate first edit
    this.isEdited = false;
    
    // Temporary store for values of originX and originY
    this.lastOriginX = 0;
    this.lastOriginY = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Label.prototype = new ED.Doodle;
ED.Label.prototype.constructor = ED.Label;
ED.Label.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Label.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Label.prototype.setPropertyDefaults = function()
{
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-1000, +1000);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-1000, +1000);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['labelText'] = {kind:'derived', type:'string', animate:false};
}

/**
 * Sets default parameters
 */
ED.Label.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('labelText', 'Start typing..');
    this.setOriginWithDisplacements(0, -100);
    this.lastOriginX = this.originX;
    this.lastOriginY = this.originY;
    this.apexX = +100;
    this.apexY = -150;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Label.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'originX':
            returnArray['apexX'] = this.apexX - (_value - this.lastOriginX);
            this.lastOriginX = _value;
            break;
        case 'originY':
            returnArray['apexY'] = this.apexY - (_value - this.lastOriginY);
            this.lastOriginY = _value;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Label.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Label.superclass.draw.call(this, _point);
    
    // Set font
    ctx.font = this.labelFont;
    
    // Calculate pixel width of text with padding
    this.labelWidth = ctx.measureText(this.labelText).width + this.padding * 2;
	
	// Boundary path
	ctx.beginPath();
	
	// label boundary
	ctx.rect(-this.labelWidth/2, -this.labelHeight/2, this.labelWidth, this.labelHeight);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
    this.isFilled = false;
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    if (this.isSelected) ctx.strokeStyle = "gray";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Draw text
        ctx.fillText(this.labelText, -this.labelWidth/2 + this.padding, this.labelHeight/6);
        
        // Coordinate of start of arrow
        var arrowStart = new ED.Point(0, 0);
        
        // Calculation of which quadrant arrowEnd is in
        var q;
        if (this.apexX == 0) q = 2;
        else q = Math.abs(this.apexY/this.apexX);
        
        // Set start
        if (this.apexY <= 0 && q >= 1)
        {
            arrowStart.x = 0;
            arrowStart.y = -this.labelHeight/2;
        }
        if (this.apexX <= 0 && q < 1)
        {
            arrowStart.x = -this.labelWidth/2;
            arrowStart.y = 0;
        }
        if (this.apexY > 0 && q >= 1)
        {
            arrowStart.x = 0;
            arrowStart.y = this.labelHeight/2;
        }
        if (this.apexX > 0 && q < 1)
        {
            arrowStart.x = this.labelWidth/2;
            arrowStart.y = 0;
        }
        
        // Coordinates of end of arrow
        var arrowEnd = new ED.Point(this.apexX, this.apexY);
        
        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(arrowStart.x, arrowStart.y);
        ctx.lineTo(arrowEnd.x, arrowEnd.y);
        ctx.strokeStyle = "Gray";
        ctx.lineWidth = 4;
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
 * Adds a letter to the label text
 *
 * @param {Int} _keyCode Keycode of pressed key
 */
ED.Label.prototype.addLetter = function(_keyCode)
{
    // Need code here to convert to character
    var character = String.fromCharCode(_keyCode);
    
    if (!this.isEdited)
    {
        this.labelText = "";
        this.isEdited = true;
    }
    
    // Use backspace to edit
    if (_keyCode == 8)
    {
         if(this.labelText.length> 0) this.labelText = this.labelText.substring(0,this.labelText.length - 1);
    }
    else
    {
        if (this.labelText.length < this.maximumLength) this.labelText += character;
    }
    
    // Save changes by triggering parameterChanged method in controller
    if (this.isEdited)
    {
        // Create notification message
    	var object = new Object;
    	object.doodle = this;
    
    	// Trigger notification
    	this.drawing.notify('parameterChanged', object);
    }
}

/**
 *  OperatingTable
 *
 * @class  MouseTest
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
ED.MouseTest = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MouseTest";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MouseTest.prototype = new ED.Doodle;
ED.MouseTest.prototype.constructor = ED.MouseTest;
ED.MouseTest.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.MouseTest.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MouseTest.prototype.draw = function(_point)
{
    //if (_point) console.log(_point.x, _point.y);
    
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MouseTest.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Square
    var width = 200;
	ctx.rect(-width/2, -width/2, width, width);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
    ctx.fillStyle = "white"
	ctx.strokeStyle = "blue";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    if (this.isClicked) console.log(_point.x, _point.y);
	
	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Slider2D
 *
 * @class Slider2D
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
ED.Slider2D = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Slider2D";
	
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.sphereSign = ' ';
    this.sphereInteger = 0;
    this.sphereFractional = 0;
    this.cylinderSign = ' ';
    this.cylinderInteger = 0;
    this.cylinderFractional = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Slider2D.prototype = new ED.Doodle;
ED.Slider2D.prototype.constructor = ED.Slider2D;
ED.Slider2D.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Slider2D.prototype.setPropertyDefaults = function()
{
    this.snapToGrid = true;
    this.gridSpacing = 5;
    this.isShowHighlight = false;
    
    // Update component of validation array for simple parameters (enable 2D control by adding -50, +50 apexX range
    this.parameterValidationArray['originX']['range'].setMinAndMax(-400, +400);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-400, +400);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['sphereSign'] = {kind:'derived', type:'string', list:['+', '=', '-'], animate:true};
    this.parameterValidationArray['sphereInteger'] = {kind:'derived', type:'int', range:new ED.Range(0, +20), animate:true};
    this.parameterValidationArray['sphereFractional'] = {kind:'derived', type:'string', list:['.00', '.25', '.50', '.75'], animate:true};
    this.parameterValidationArray['cylinderSign'] = {kind:'derived', type:'string', list:['+', '=', '-'], animate:true};
    this.parameterValidationArray['cylinderInteger'] = {kind:'derived', type:'int', range:new ED.Range(0, +20), animate:true};
    this.parameterValidationArray['cylinderFractional'] = {kind:'derived', type:'string', list:['.00', '.25', '.50', '.75'], animate:true};
}

/**
 * Sets default parameters
 */
ED.Slider2D.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('sphereSign', '=');
    this.setParameterFromString('sphereInteger', '0');
    this.setParameterFromString('sphereFractional', '.00');
    this.setParameterFromString('cylinderSign', '=');
    this.setParameterFromString('cylinderInteger', '0');
    this.setParameterFromString('cylinderFractional', '.00');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Slider2D.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'sphereSign':
        	switch (_value)
        	{
        		case '+':
        			returnArray['originY'] = -1 * Math.abs(this.originY);
        			break;
        		
        		case '=':
        			returnArray['originY'] = 0;
        			break;
        			
        		case '-':
        			returnArray['originY'] = Math.abs(this.originY);
        			break;
			}
            break;

        case 'sphereInteger':
        	returnArray['originY'] = (20 * (parseInt(_value) + parseFloat(this.sphereFractional))) * (this.sphereSign == '-'?1:-1);
            break;

        case 'sphereFractional':
        	returnArray['originY'] = (20 * (this.sphereInteger + parseFloat(_value))) * (this.sphereSign == '-'?1:-1);
            break;

        case 'cylinderSign':
        	switch (_value)
        	{
        		case '+':
        			returnArray['originX'] = Math.abs(this.originX);
        			break;
        		
        		case '=':
        			returnArray['originX'] = 0;
        			break;
        			
        		case '-':
        			returnArray['originX'] = -1 * Math.abs(this.originX);
        			break;
			}
            break;

        case 'cylinderInteger':
        	returnArray['originX'] = (20 * (parseInt(_value) + parseFloat(this.sphereFractional))) * (this.sphereSign == '-'?-1:1);
            break;

        case 'cylinderFractional':
        	returnArray['originX'] = (20 * (this.sphereInteger + parseFloat(_value))) * (this.sphereSign == '-'?-1:1);
            break;
                                              
        case 'originY':
        	// Sign
        	if (_value > 0) returnArray['sphereSign'] = '-';
        	else if (_value < 0) returnArray['sphereSign'] = '+';
        	else returnArray['sphereSign'] = '=';
        	
        	// Integer
        	returnArray['sphereInteger'] = Math.floor(Math.abs(_value/20));

            // Fractional
            var diff = Math.abs(_value/20) - Math.floor(Math.abs(_value/20));
            if (diff == 0) returnArray['sphereFractional'] = '.00';
            if (diff == 0.25) returnArray['sphereFractional'] = '.25';
            if (diff == 0.5) returnArray['sphereFractional'] = '.50';
            if (diff == 0.75) returnArray['sphereFractional'] = '.75';            
            break;
            
        case 'originX':
        	// Sign
        	if (_value < 0) returnArray['cylinderSign'] = '-';
        	else if (_value > 0) returnArray['cylinderSign'] = '+';
        	else returnArray['cylinderSign'] = '=';
        	
        	// Integer
        	returnArray['cylinderInteger'] = Math.floor(Math.abs(_value/20));

            // Fractional
            var diff = Math.abs(_value/20) - Math.floor(Math.abs(_value/20));
            if (diff == 0) returnArray['cylinderFractional'] = '.00';
            if (diff == 0.25) returnArray['cylinderFractional'] = '.25';
            if (diff == 0.5) returnArray['cylinderFractional'] = '.50';
            if (diff == 0.75) returnArray['cylinderFractional'] = '.75';            
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Slider2D.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Slider2D.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Slider shape
    var d = 30;
    var w = 80;
    ctx.moveTo(0, -w - d);
    ctx.lineTo(d, -w);
    ctx.lineTo(w, -w);
    ctx.lineTo(w, -d);
    ctx.lineTo(w + d, 0);
    ctx.lineTo(w, d);
    ctx.lineTo(w, w);
    ctx.lineTo(d, w);
    ctx.lineTo(0, w + d);
    ctx.lineTo(-d, w);
    ctx.lineTo(-w, w);
    ctx.lineTo(-w, d);
    ctx.lineTo(-w - d, 0);
    ctx.lineTo(-w, -d);
    ctx.lineTo(-w, -w);
    ctx.lineTo(-d, -w);
    ctx.closePath();
	//ctx.rect(-50, -50, 100, 100);

	// Set line attributes
	ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    
    // Vertical gradient fill
    var bottomColour = "rgba(130, 205, 205, 0.5)";
    var topColour = "rgba(170, 225, 225, 0.5)";
    var gradient = ctx.createLinearGradient(0, -25, 0, 25);
    gradient.addColorStop(0, topColour);
    gradient.addColorStop(1, bottomColour);
    ctx.fillStyle = gradient;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Axes
        ctx.beginPath();
        
		// Axes
		var l = 100;
		ctx.moveTo(0, -l);
		ctx.lineTo(0, l);
		ctx.moveTo(-l, 0);
		ctx.lineTo(l, 0);
		ctx.moveTo(0, -l);
        
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
		
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * GraphAxes
 *
 * @class GraphAxes
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
ED.GraphAxes = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "GraphAxes";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.GraphAxes.prototype = new ED.Doodle;
ED.GraphAxes.prototype.constructor = ED.GraphAxes;
ED.GraphAxes.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.GraphAxes.prototype.setPropertyDefaults = function()
{
    this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.GraphAxes.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.GraphAxes.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Axes
    var l = 400;
	ctx.moveTo(0, -l);
    ctx.lineTo(0, l);
	ctx.moveTo(-l, 0);
    ctx.lineTo(l, 0);
	ctx.moveTo(0, -l);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Axis markers
        ctx.beginPath();
        
        for (var y = -l; y <= l; y = y + 100)
        {
            if (y != 0)
            {
                ctx.moveTo(-20, y);
                ctx.lineTo(20, y);
            }
        }
 
        for (var x = -l; x <= l; x = x + 100)
        {
            if (x != 0)
            {
                ctx.moveTo(x, -20);
                ctx.lineTo(x, 20);
            }
        }
        
        ctx.stroke();
        
        // Labels
        ctx.font = "80px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = 'center'
        ctx.fillText("+Sph", 0, -440);
        ctx.fillText("-Sph", 0, 480);
        ctx.fillText("+Cyl", 400, -40);
        ctx.fillText("-Cyl", -400, -40);
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}


