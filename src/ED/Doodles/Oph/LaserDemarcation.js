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
 * Laser Demarcation
 *
 * @class LaserDemarcation
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
ED.LaserDemarcation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserDemarcation";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserDemarcation.prototype = new ED.Doodle;
ED.LaserDemarcation.prototype.constructor = ED.LaserDemarcation;
ED.LaserDemarcation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserDemarcation.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.LaserDemarcation.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/8, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserDemarcation.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -350;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/4;
    }
    else
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -0.8 * Math.PI;
        }
        else
        {
            this.rotation = 0.8 * Math.PI;
        }
    }
    
    // If there is a retinectomy present, adjust to it
    doodle = this.drawing.lastDoodleOfClass('PeripheralRetinectomy');
    if (doodle)
    {
        this.rotation = doodle.rotation;
        this.arc = doodle.arc + Math.PI/16;
        this.apexY = doodle.apexY + 50;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserDemarcation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserDemarcation.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of LaserDemarcation
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot separation
        var ss = 25;
        
        // Location of laser spot
        var p = new ED.Point(0,0);
        
        // Unless 360, go out to the ora with an elegant semicircle
        if (this.arc < 1.9 * Math.PI)
        {
            // Radius of quarter circle
            var rc = ro - ri;
            
            // Angle of quarter circle (not quite a quarter)
            var quad = Math.PI/2;
            
            // Number of spots in a quarter circle
            var n = (Math.round(quad/(ss/rc)));
            
            // Centre of first quarter circle
            var c1 = new ED.Point(- ro * Math.sin(theta - rc/ro),- ro * Math.cos(theta - rc/ro));
            
            // Draw first quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcEnd + 0.5 * (rc/ro) - i * quad/n);
                this.drawLaserSpot(ctx, c1.x + p.x, c1.y + p.y);
            }
            
            // Angle of main arc, with adjustment to make junction with semicircles look better
            var mainArc = this.arc - 2 * rc/ro;
            
            // Number of spots in the main arc
            var m = (Math.round(mainArc/(ss/ri)));
            
            // Draw main arc
            var mainStart = c1.direction();
            for (var i = 0; i < m + 1; i++)
            {
                p.setWithPolars(ri, mainStart + i * mainArc/m);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
            
            // Centre of second quarter circle
            var c2 = new ED.Point(- ro * Math.sin(- theta + rc/ro), - ro * Math.cos(- theta + rc/ro));
            
            // Draw second quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcStart + Math.PI - 0.5 * (rc/ro) + i * quad/n);
                this.drawLaserSpot(ctx, c2.x + p.x, c2.y + p.y);
            }
        }
        else
        {
            // Number of spots in the main arc
            var n = (Math.round(2 * Math.PI/(ss/ri)));
            
            // Draw main arc
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(ri, i * 2 * Math.PI/n);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LaserDemarcation.prototype.description = function()
{
    var returnString = "";
    
    if (this.arc > 1.9 * Math.PI)
    {
        returnString += "360 degree ";
    }
    
    returnString += "laser demarcation";
    
	return returnString;
}