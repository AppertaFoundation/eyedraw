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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */
 
/**
 * UpShoot
 *
 * @class UpShoot
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.UpShoot = function(_drawing, _parameterJSON)
{

	this.savedParameterArray = ['originX', 'originY', 'quadrantPoint'];
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	// Set classname
	this.className = "UpShoot";
}

/**
 * Sets superclass and constructor
 */
ED.UpShoot.prototype = new ED.Doodle;
ED.UpShoot.prototype.constructor = ED.UpShoot;
ED.UpShoot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.UpShoot.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.UpShoot.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = false;
	this.isSqueezable = false;
	this.isMoveable = true;
	this.isRotatable = false;
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(335, 220);
    
    this.handleVectorRangeArray = new Array();
	var range = new Object;
	range.length = new ED.Range(+50, +320);
	range.angle = new ED.Range(1.75*Math.PI, 1.75*Math.PI);
	this.handleVectorRangeArray[0] = range;
}

/**
 * Sets default parameters
 */
ED.UpShoot.prototype.setParameterDefaults = function()
{
	// Create a squiggle to store handle points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	var point = new ED.Point(-125, -125);
	this.addPointToSquiggle(point);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.UpShoot.prototype.draw = function(_point)
{
    // Use scale to flip arrow into correct position for quadrant
    this.scaleX = this.originX/Math.abs(this.originX);
    this.scaleY = this.originY/Math.abs(this.originY);
    
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.UpShoot.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	var c = Math.abs(this.squiggleArray[0].pointsArray[0].x);
    var r = 100 + c;
    
	// Rectangular area
	ctx.rect(c * -1, c * -1, r, r);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = ctx.fillStyle;
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Arrow shaft
        ctx.beginPath();
        ctx.moveTo(c * -1, c * -1);
        ctx.lineTo(c * -1 + r, c * -1);
        ctx.lineTo(c * -1 + r, c * -1 + r);
        
        ctx.lineWidth = 6;
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        if (this.isSelected) {
	        ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(0,0,0,0.9)";
        }
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(70, 60);
        ctx.lineTo(130, 60);
        ctx.closePath();
        if (this.isSelected) {
	        ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(0,0,0,0.9)";
        }
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
ED.UpShoot.prototype.description = function()
{
    var returnString = "Up shoot";
	
	return returnString;
}