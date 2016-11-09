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
 * @class XPattern
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.XPattern = function(_drawing, _parameterJSON)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Set classname
	this.className = "XPattern";
}

/**
 * Sets superclass and constructor
 */
ED.XPattern.prototype = new ED.Doodle;
ED.XPattern.prototype.constructor = ED.XPattern;
ED.XPattern.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.XPattern.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.XPattern.prototype.setPropertyDefaults = function()
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
 * Sets default parameters
 */
ED.XPattern.prototype.setParameterDefaults = function()
{
    if(this.drawing.eye == ED.eye.Right)
    {
        this.rotation = 0;
    }
    else
    {
        this.rotation = Math.PI;        
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.XPattern.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.XPattern.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Dotted Line
    var dash = 4;
    var gap = 4;
    var length = 0;
    var depth = 0;
    var startY = -450;
        
    ctx.moveTo(-350, startY);
    while (length < 185)
    {
        length += 2 * dash;
        depth += dash;
        ctx.lineTo(-350 + length, startY + depth);
        length += gap; 
        depth += gap;           
        ctx.moveTo(-350 + length, startY + depth);
    }
    
    length = 0;
    depth = 0;
    ctx.moveTo(-350, startY * -1);
    while (length < 185)
    {
        length += 2 * dash;
        depth += dash;
        ctx.lineTo(-350 + length, startY*-1 - depth);
        length += gap; 
        depth += gap;             
        ctx.moveTo(-350 + length, startY*-1 - depth);
    }
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(80, 80, 80, 1)";
    
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