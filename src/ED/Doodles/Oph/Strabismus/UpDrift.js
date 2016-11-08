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
 * UpDrift
 *
 * @class UpDrift
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.UpDrift = function(_drawing, _parameterJSON)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Set classname
	this.className = "UpDrift";
}

/**
 * Sets superclass and constructor
 */
ED.UpDrift.prototype = new ED.Doodle;
ED.UpDrift.prototype.constructor = ED.UpDrift;
ED.UpDrift.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.UpDrift.prototype.setHandles = function()
{
}

/**
 * Sets default dragging attributes
 */
ED.UpDrift.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(370, 250);
}

/**
 * Sets default parameters
 */
ED.UpDrift.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.UpDrift.prototype.draw = function(_point)
{
    // Use scale to flip arrow into correct position for quadrant
    this.scaleX = this.originX/Math.abs(this.originX);
    this.scaleY = this.originY/Math.abs(this.originY);
    
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.UpDrift.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Rectangular area
	ctx.rect(-100, -100, 200, 200);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = ctx.fillStyle;
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Arrow body
        ctx.beginPath();
        ctx.arc(-98, 100, 200, -Math.PI/2, -0.1, false);
        ctx.lineWidth = 6;
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(80, 70);
        ctx.lineTo(120, 70);
        ctx.closePath();
        ctx.fillStyle = "rgba(80, 80, 80, 1)";
        ctx.fill();
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
ED.UpDrift.prototype.description = function()
{
    var returnString = "UpDrift";
	
	return returnString;
}
