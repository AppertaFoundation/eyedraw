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
 * 
 *
 * @class OrthopticShading
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OrthopticShading = function(_drawing, _parameterJSON)
{
	
	// Set classname
	this.className = "OrthopticShading";
		
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OrthopticShading.prototype = new ED.Doodle;
ED.OrthopticShading.prototype.constructor = ED.OrthopticShading;
ED.OrthopticShading.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OrthopticShading.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.OrthopticShading.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = true;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = true;
	
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
}

/**
 * Sets default parameters
 */
ED.OrthopticShading.prototype.setParameterDefaults = function()
{
    this.originY = -200;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OrthopticShading.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OrthopticShading.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Rectangular area
	ctx.rect(-300, -100, 600, 200);
    
	// Close path
	ctx.closePath();
    
    // create pattern
	ctx.fillStyle = "rgba(190, 190, 190, 0.55)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-300, 100);
        var dash = 42;
        var gap = 20;
        var length = 0;
        while (length < 540)
        {
            length += dash;
            ctx.lineTo(-300 + length, 100);
            length += gap;            
            ctx.moveTo(-300 + length, 100);
        }
        ctx.lineTo(300, 100);
        
        // Draw line
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(300, 100));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}