/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * PartialThicknessScleralFlap
 *
 * @class PartialThicknessScleralFlap
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
ED.PartialThicknessScleralFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PartialThicknessScleralFlap";

    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.size = '4x3';
    	
	// Doodle specific parameters
	this.r = 380;
	this.right = new ED.Point(0,0);
	this.left = new ED.Point(0,0);
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PartialThicknessScleralFlap.prototype = new ED.Doodle;
ED.PartialThicknessScleralFlap.prototype.constructor = ED.PartialThicknessScleralFlap;
ED.PartialThicknessScleralFlap.superclass = ED.Doodle.prototype;


/**
 * Sets handle attributes
 */
ED.PartialThicknessScleralFlap.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	//this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PartialThicknessScleralFlap.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-580, -510);
    this.parameterValidationArray['arc']['range'].setMinAndMax(0.9, 1.13);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['size'] = {kind:'derived', type:'string', list:['4x3', '5x2'], animate:true};
}

/**
 * Sets default parameters
 */
ED.PartialThicknessScleralFlap.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('size', '4x3');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PartialThicknessScleralFlap.prototype.dependentParameterValues = function(_parameter, _value)
{

    var returnArray = new Array();

    switch (_parameter)
    {
        case 'arc':
			// Example of using this method to implement a 'snap to arc'
			if (_value < 1.0)
			{
				returnArray['size'] = '4x3';
// 				returnArray['apexY'] = -580;
// 				returnArray['arc'] = 0.9;
			}
			else
			{
				returnArray['size'] = '5x2';
// 				returnArray['apexY'] = -510;
// 				returnArray['arc'] = 1.13;
			}
            break;

        case 'size':
            switch (_value)
            {
                case '4x3':
                    returnArray['arc'] = 0.9;
                    returnArray['apexY'] = -580;
                    break;
                case '5x2':
                    returnArray['arc'] = 1.13;
                    returnArray['apexY'] = -510;
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
ED.PartialThicknessScleralFlap.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PartialThicknessScleralFlap.superclass.draw.call(this, _point);
    
    // Radius of limbus
    //var r = this.r;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Offset angle for control points
    var phi = this.arc/6;
    
    // Apex point
    var apex = new ED.Point(this.apexX, this.apexY);
    
	this.right.x = this.r * Math.sin(theta);
	this.right.y = - this.r * Math.cos(theta);
	this.left.x = - this.r * Math.sin(theta);
	this.left.y = - this.r * Math.cos(theta);
	
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, this.r, arcStart, arcEnd, true);
    
    // Rectangular flap
    ctx.lineTo(this.left.x, this.apexY);
    ctx.lineTo(this.right.x, this.apexY);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(220,220,150,0.5)";

	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Draw sclerotomy at half width and height    
        var angle = theta/2;
        arcStart = - Math.PI/2 + angle;
        arcEnd = - Math.PI/2 - angle;
        var top = new ED.Point(this.apexX, -this.r + (this.apexY + this.r)/2);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.r, arcStart, arcEnd, true);
        ctx.lineTo(- this.r * Math.sin(angle), top.y);
        ctx.lineTo(this.r * Math.sin(angle), top.y);
        ctx.closePath();
        
        // Colour of fill
        ctx.fillStyle = "gray";
        ctx.fill();
        
//         ctx.beginPath();
// 		ctx.moveTo(-400, 0);
// 		ctx.lineTo(+400, 0);
// 		ctx.moveTo(0, -400);
// 		ctx.lineTo(0, +400);
// 		ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.left);
	this.handleArray[3].location = this.transform.transformPoint(this.right);
	//this.handleArray[4].location = this.transform.transformPoint(apex);
	
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
ED.PartialThicknessScleralFlap.prototype.description = function()
{
    return (this.apexY < -280?"Fornix based ":"Limbus based ") + "flap";
}