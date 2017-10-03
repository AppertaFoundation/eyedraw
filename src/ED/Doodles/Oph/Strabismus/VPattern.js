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
 * VPattern
 *
 * @class VPattern
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.VPattern = function(_drawing, _parameterJSON)
{
    this.savedParameterArray = ['rotation'];
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Set classname
	this.className = "VPattern";
}

/**
 * Sets superclass and constructor
 */
ED.VPattern.prototype = new ED.Doodle;
ED.VPattern.prototype.constructor = ED.VPattern;
ED.VPattern.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VPattern.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.VPattern.prototype.setPropertyDefaults = function()
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
ED.VPattern.prototype.setParameterDefaults = function()
{
    if(this.drawing.eye == ED.eye.Right)
    {
        this.rotation = -Math.PI/8;
    }
    else
    {
        this.rotation = Math.PI/8;        
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VPattern.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.VPattern.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Dotted Line
    var dash = 4;
    var gap = 4;
    var length = 0;
    var startY = -500;
    ctx.moveTo(0, startY)
    while (length < -2*startY)
    {
        length += dash;
        ctx.lineTo(0, startY + length);
        length += gap;            
        ctx.moveTo(0, startY + length);
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