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
    
    // Derived parameters
    this.surgeonPosition;
    
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
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Enacts a predefined sync action in response to a change in a simple parameter
 *
 * @param _parameterName The name of the parameter that has been changed in the master doodle
 * @param _parameterValue The value of the parameter that has been changed in the master doodle
 */
ED.Surgeon.prototype.syncParameter = function(_parameterName, _parameterValue)
{
    switch (_parameterName)
    {
        case 'rotation':
            this.setSimpleParameter(_parameterName, _parameterValue);
            this.updateDependentParameters(_parameterName);
            break;
    }
    
    // Redraw
    this.drawing.repaint();
}

