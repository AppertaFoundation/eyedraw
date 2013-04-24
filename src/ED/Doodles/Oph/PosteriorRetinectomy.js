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
 * Posterior retinectomy
 *
 * @class PosteriorRetinectomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PosteriorRetinectomy = function(_drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PosteriorRetinectomy";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorRetinectomy.prototype = new ED.Doodle;
ED.PosteriorRetinectomy.prototype.constructor = ED.PosteriorRetinectomy;
ED.PosteriorRetinectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PosteriorRetinectomy.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PosteriorRetinectomy.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -50);
}

/**
 * Sets default parameters
 */
ED.PosteriorRetinectomy.prototype.setParameterDefaults = function()
{
    this.apexX = 0;
    this.apexY = -100;
    
    // Displacement from fovea, and from last doodle
    var d = 100;
    
    this.originX = d;
    this.originY = -d;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var point = new ED.Point(doodle.originX, doodle.originY);
        var direction = point.direction() + Math.PI/8;
        var distance = point.length();
        var np = new ED.Point(0,0);
        np.setWithPolars(distance, direction);
        
        this.originX = np.x;
        this.originY = np.y;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PosteriorRetinectomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PosteriorRetinectomy.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circular retinectomy
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    var w = 16;
    
    // Two arcs
	ctx.arc(0, 0, r + w, 0, Math.PI*2, true);
    ctx.arc(0, 0, r - w, Math.PI*2, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,255,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI*2, true);
        ctx.lineWidth = 16;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.PosteriorRetinectomy.prototype.groupDescription = function()
{
	return "Posterior retinectomy";
}