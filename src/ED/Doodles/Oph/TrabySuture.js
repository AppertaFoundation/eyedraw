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
 * TrabySuture suture
 *
 * @class TrabySuture
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
ED.TrabySuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{	
	// Set classname
	this.className = "TrabySuture";
	
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.type = 'Fixed';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrabySuture.prototype = new ED.Doodle;
ED.TrabySuture.prototype.constructor = ED.TrabySuture;
ED.TrabySuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TrabySuture.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.TrabySuture.prototype.setPropertyDefaults = function()
{
	//this.isMoveable = false;
	//this.isRotatable = false;
	
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+70, +70);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Fixed', 'Adjustable', 'Releasable'], animate:false};
}

/**
 * Sets default parameters
 */
ED.TrabySuture.prototype.setParameterDefaults = function()
{
	this.apexX = +50;
	this.apexY = +70;
    this.type = 'Fixed';
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TrabySuture.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            if (_value > 17) returnArray['type'] = "Releasable";
            else if (_value > -17) returnArray['type'] = "Adjustable";
            else returnArray['type'] = "Fixed";
            break;
        
        case 'type':
            switch (_value)
        	{
            	case 'Fixed':
            		returnArray['apexX'] = -50;
            		break;
            	case 'Adjustable':
            		returnArray['apexX'] = 0;
            		break;
            	case 'Releasable':
            		returnArray['apexX'] = +50;
            		break;
            }
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrabySuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrabySuture.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Outline
	ctx.rect(-40, -70, 80, 100);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,255,0)";
	if (this.isSelected)
	{
		ctx.strokeStyle = "gray";
	}
	else
	{
		ctx.strokeStyle = "rgba(255,255,255,0)";
	}
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Suture path
		ctx.beginPath();
		
		// Type of suture
		switch (this.type)
		{
			case 'Releasable':
				ctx.moveTo(-2, 64);
				ctx.bezierCurveTo(20, 36, -15, 16, -16, -7);
				ctx.bezierCurveTo(-18, -30, -12, -43, -4, -43);
				ctx.bezierCurveTo(6, -43, 12, -28, 12, -9);
				ctx.bezierCurveTo(12, 11, 0, 23, -2, 30);
				ctx.bezierCurveTo(-3, 36, 3, 37, 2, 30);
				ctx.bezierCurveTo(2, 20, -4, 24, -3, 29);
				ctx.bezierCurveTo(-3, 36, 14, 37, 23, 56);
				ctx.bezierCurveTo(32, 74, 34, 100, 34, 100);
				
				// Suture exit through cornea
				var ep = new ED.Point(this.firstOriginX, -60);
				
				// Set up a new transform and centre in canvas
				var at = new ED.AffineTransform();
				at.translate(150, 150);
				
				// Add rotation of traby flap and transform
				var trab = this.drawing.lastDoodleOfClass('TrabyFlap');
				if (trab) at.rotate(trab.rotation);
				var np = at.transformPoint(ep);

				// Tranform back to get fixed point in canvas
				var pp = this.inverseTransform.transformPoint(np);
				ctx.lineTo(pp.x, pp.y);

				break;

			case 'Adjustable':
				ctx.moveTo(-2, 64);
				ctx.bezierCurveTo(20, 36, -15, 16, -16, -7);
				ctx.bezierCurveTo(-18, -30, -12, -43, -4, -43);
				ctx.bezierCurveTo(6, -43, 12, -28, 12, -9);
				ctx.bezierCurveTo(12, 11, 0, 23, -2, 30);
				ctx.bezierCurveTo(-3, 36, 3, 37, 2, 30);
				ctx.bezierCurveTo(2, 20, -4, 24, -3, 29);
				ctx.bezierCurveTo(-3, 36, 14, 37, 23, 56);
				ctx.bezierCurveTo(32, 74, 34, 100, 34, 100);
				break;

			case 'Fixed':
				ctx.moveTo(0, -30);
				ctx.bezierCurveTo(5, -10, 5, 10, 0, 30);
				ctx.bezierCurveTo(-5, 10, -5, -10, 0, -30);
				ctx.moveTo(-5, 50);
				ctx.lineTo(0, 30);
				ctx.lineTo(5, 50);
				break;	
		}
	
		// Set line attributes
		ctx.lineWidth = 8;
		ctx.fillStyle = "rgba(0, 0, 0, 0)";
		ctx.strokeStyle = "purple";
		
		// Draw line
		ctx.stroke();
 	}
 	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(+40, -70));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
		
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.TrabySuture.prototype.drawHighlightExtras = function()
{
    // Get context
	var ctx = this.drawing.context;
    
    // Draw text description of gauge
    ctx.lineWidth=1;
    ctx.fillStyle="gray";
    ctx.font="64px sans-serif";
    ctx.fillText(this.type, 80, 0 + 20);
}