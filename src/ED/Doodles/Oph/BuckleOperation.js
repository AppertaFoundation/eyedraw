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
 * BuckleOperation
 *
 * @class BuckleOperation
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
ED.BuckleOperation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BuckleOperation";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BuckleOperation.prototype = new ED.Doodle;
ED.BuckleOperation.prototype.constructor = ED.BuckleOperation;
ED.BuckleOperation.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.BuckleOperation.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.willReport = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleOperation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BuckleOperation.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Cornea
    ctx.arc(0,0,100,0,Math.PI*2,true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    this.isFilled = false;
	ctx.strokeStyle = "#444";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Recti
        this.drawRectus(ctx, 'Sup');
        this.drawRectus(ctx, 'Nas');
        this.drawRectus(ctx, 'Inf');
        this.drawRectus(ctx, 'Tem');
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws a rectus muscle
 *
 * @param {Context} _ctx
 * @param {Stirng} _quad Quadrant
 */
ED.BuckleOperation.prototype.drawRectus = function(_ctx, _quad)
{
    _ctx.beginPath();
    
    switch (_quad)
    {
        case 'Sup':
            x1 = -60;
            y1 = -480;
            x2 = -60;
            y2 = -200;
            x3 = 60;
            y3 = -200;
            x4 = 60;
            y4 = -480;
            xd = 30;
            yd = 0;
            break;
        case 'Nas':
            x1 = 480;
            y1 = -60;
            x2 = 200;
            y2 = -60;
            x3 = 200;
            y3 = 60;
            x4 = 480;
            y4 = 60;
            xd = 0;
            yd = 30;
            break;
        case 'Inf':
            x1 = 60;
            y1 = 480;
            x2 = 60;
            y2 = 200;
            x3 = -60;
            y3 = 200;
            x4 = -60;
            y4 = 480;
            xd = -30;
            yd = 0;
            break;
        case 'Tem':
            x1 = -480;
            y1 = 60;
            x2 = -200;
            y2 = 60;
            x3 = -200;
            y3 = -60;
            x4 = -480;
            y4 = -60;
            xd = 0;
            yd = -30;
        default:
            break;
    }
    
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2);
    _ctx.lineTo(x3, y3);
    _ctx.lineTo(x4, y4);
    _ctx.moveTo(x1 + xd, y1 + yd);
    _ctx.lineTo(x2 + xd, y2 + yd);
    _ctx.moveTo(x1 + 2 * xd, y1 + 2 * yd);
    _ctx.lineTo(x2 + 2 * xd, y2 + 2 * yd);
    _ctx.moveTo(x1 + 3 * xd, y1 + 3 * yd);
    _ctx.lineTo(x2 + 3 * xd, y2 + 3 * yd);
    _ctx.fillStyle = "#CA6800";
    _ctx.fill();
    _ctx.lineWidth = 8;
    _ctx.strokeStyle = "#804000";
    _ctx.stroke();
}