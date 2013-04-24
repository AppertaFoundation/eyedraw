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
 * Anterior chamber IOL
 *
 * @class ACIOL
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
ED.ACIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ACIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ACIOL.prototype = new ED.Doodle;
ED.ACIOL.prototype.constructor = ED.ACIOL;
ED.ACIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ACIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.ACIOL.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ACIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.8;
    this.scaleY = 0.8;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ACIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ACIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic (see ACIOL.c4D for bezier points)
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 170, -210, 160, -230);
    ctx.bezierCurveTo(150, -250, 100, -280, 50, -290);
    ctx.bezierCurveTo(0, -300, -220, -330, -230, -340);
    ctx.bezierCurveTo(-250, -360, -220, -420, -200, -430);
    ctx.bezierCurveTo(-180, -440, -180, -440, -150, -450);
    ctx.bezierCurveTo(-120, -460, -130, -430, -120, -420);
    ctx.bezierCurveTo(-110, -410, 110, -410, 120, -420);
    ctx.bezierCurveTo(130, -430, 120, -460, 150, -450);
    ctx.bezierCurveTo(180, -440, 180, -440, 200, -430);
    ctx.bezierCurveTo(220, -420, 180, -400, 150, -390);
    ctx.bezierCurveTo(120, -380, -120, -380, -150, -390);
    ctx.bezierCurveTo(-180, -400, -190, -370, -170, -360);
    ctx.bezierCurveTo(-150, -350, 20, -330, 70, -320);
    ctx.bezierCurveTo(120, -310, 190, -280, 210, -250);
    ctx.bezierCurveTo(230, -220, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -170, 210, -160, 230);
    ctx.bezierCurveTo(-150, 250, -100, 280, -50, 290);
    ctx.bezierCurveTo(0, 300, 220, 330, 230, 340);
    ctx.bezierCurveTo(250, 360, 220, 420, 200, 430);
    ctx.bezierCurveTo(180, 440, 180, 440, 150, 450);
    ctx.bezierCurveTo(120, 460, 130, 430, 120, 420);
    ctx.bezierCurveTo(110, 410, -110, 410, -120, 420);
    ctx.bezierCurveTo(-130, 430, -120, 460, -150, 450);
    ctx.bezierCurveTo(-180, 440, -180, 440, -200, 430);
    ctx.bezierCurveTo(-220, 420, -180, 400, -150, 390);
    ctx.bezierCurveTo(-120, 380, 120, 380, 150, 390);
    ctx.bezierCurveTo(180, 400, 190, 370, 170, 360);
    ctx.bezierCurveTo(150, 350, -20, 330, -70, 320);
    ctx.bezierCurveTo(-120, 310, -190, 280, -210, 250);
    ctx.bezierCurveTo(-230, 220, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.ACIOL.prototype.description = function()
{
    var returnValue = "Anterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" temporally":" nasally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" nasally":" temporally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}