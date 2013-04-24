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
 * CornealSuture
 *
 * @class CornealSuture
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
ED.CornealSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealSuture";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealSuture.prototype = new ED.Doodle;
ED.CornealSuture.prototype.constructor = ED.CornealSuture;
ED.CornealSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.CornealSuture.prototype.setParameterDefaults = function()
{
    this.radius = 374;
    this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealSuture.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var r =  this.radius;
    ctx.rect(-20, -(r + 40), 40, 80);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 6;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(0, -r - 40);
        ctx.lineTo(0, -r + 40);
        ctx.moveTo(-10, -r + 10);
        ctx.lineTo(0, -r + 20);
        ctx.lineTo(-10, -r + 30);
        
        ctx.lineWidth = 2;
        var colour = "rgba(0,0,120,0.7)"
        ctx.strokeStyle = colour;
        
        ctx.stroke();
        
        // Knot
        this.drawSpot(ctx, 0, -r + 20, 4, colour);
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealSuture.prototype.description = function()
{
    var returnString = "Corneal suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}