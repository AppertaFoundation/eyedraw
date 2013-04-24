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
 * PRP (Poterior pole)
 *
 * @class PRPPostPole
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
ED.PRPPostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PRPPostPole";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PRPPostPole.prototype = new ED.Doodle;
ED.PRPPostPole.prototype.constructor = ED.PRPPostPole;
ED.PRPPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PRPPostPole.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
    this.isUnique = true;
    this.isMoveable = false;
    this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PRPPostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    ctx.rect(-480, -480, 960, 960);
    var r = 320;
    ctx.moveTo(r,0);
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var sr = 15;
        var si = 30;
        var ss = 48;
        var n = (1000 - 2 * ss)/(2 * sr + si);
        var sd = (2 * sr + si);
        var st = 10;
        
        // Draw spots
        for (var i = 0; i < n; i++)
        {
            for (var j = 0; j < n; j++)
            {
                // Calculate coordinates with a random element
                var x = -500 + ss + i * sd + Math.round((-0.5 + ED.randomArray[i + j]) * 20);
                var y = -500 + ss + j * sd + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 20);
                
                // Avoid macula
                if ((x * x + y * y) > r * r)
                {
                    // Avoid disc
                    if (this.drawing.eye == ED.eye.Right)
                    {
                        if (!((i == 13 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 14) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                    else
                    {
                        if (!((i == 2 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 1) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                }
            }
        }
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
ED.PRPPostPole.prototype.description = function()
{
	return "Panretinal photocoagulation";
}