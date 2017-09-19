/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */
 
/**
 * YPattern
 *
 * @class YPattern
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.YPattern = function(_drawing, _parameterJSON)
{
    this.savedParameterArray = ['side'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Set classname
	this.className = "YPattern";
}

/**
 * Sets superclass and constructor
 */
ED.YPattern.prototype = new ED.Doodle;
ED.YPattern.prototype.constructor = ED.YPattern;
ED.YPattern.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.YPattern.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.YPattern.prototype.setPropertyDefaults = function()
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
ED.YPattern.prototype.setParameterDefaults = function()
{
    if(this.drawing.eye == ED.eye.Right)
    {
        this.side = 1;
    }
    else
    {
        this.side = -1;        
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.YPattern.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.YPattern.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Dotted Line
    var dash = 4;
    var gap = 4;
    var length = 0;
    var depth = 0;
    var startY = -450;
        
    ctx.moveTo(-350 * this.side, startY);
    while (length < 185)
    {
        length += 2 * dash;
        depth += dash;
        ctx.lineTo((-350 + length) * this.side, startY + depth);
        length += gap; 
        depth += gap;           
        ctx.moveTo((-350 + length) * this.side, startY + depth);
    }
    
    length = 0;
    depth = 0;
    ctx.moveTo(0, 20+startY * -1);
    while (length < 40)
    {
        depth += dash * 2;
        ctx.lineTo(0, 20+startY*-1 - depth);
        length += gap; 
        depth += gap;             
        ctx.moveTo(-0, 20+startY*-1 - depth);
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