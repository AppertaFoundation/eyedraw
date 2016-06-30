/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2016
 *
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2016, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Inner leaf break
 *
 * @class InnerLeafBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.InnerLeafBreak = function(_drawing, _parameterJSON)
{
    // Set classname
    this.className = "InnerLeafBreak";

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.InnerLeafBreak.prototype = new ED.Doodle;
ED.InnerLeafBreak.prototype.constructor = ED.InnerLeafBreak;
ED.InnerLeafBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.InnerLeafBreak.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.InnerLeafBreak.prototype.setPropertyDefaults = function()
{
    this.isSelectable = true;
    this.isOrientated = false;
    this.isScaleable = true;
    this.isSqueezable = false;
    this.isMoveable = true;
    this.isRotatable = false;
    this.rangeOfScale = new ED.Range(+0.5, +4);
    this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
    this.rangeOfApexX = new ED.Range(-0, +0);
    this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters
 */
ED.InnerLeafBreak.prototype.setParameterDefaults = function()
{
    this.originX = -326;
    this.originY = 206;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.InnerLeafBreak.prototype.draw = function(_point)
{
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.InnerLeafBreak.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Round hole
    ctx.arc(0,0,20,0,Math.PI*2,true);

    // Close path
    ctx.closePath();

    // Set line attributes
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(255, 80, 80, 0.75)";
    ctx.strokeStyle = "rgba(0, 255, 255, 0.75)";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Other stuff here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(14, -14));

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Calculate arc (Arc property not used naturally in this doodle ***TODO** more elegant method of doing this possible!)
    var centre = this.transform.transformPoint(new ED.Point(0,0));
    var oneWidthToRight = this.transform.transformPoint(new ED.Point(60,0));
    var xco = centre.x - this.drawing.canvas.width/2;
    var yco = centre.y - this.drawing.canvas.height/2;
    var radius = this.scaleX * Math.sqrt(xco * xco + yco * yco);
    var width = this.scaleX * (oneWidthToRight.x - centre.x);
    this.arc = Math.atan(width/radius);

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.InnerLeafBreak.prototype.description = function()
{
    var returnString = "";

    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";

    // Round hole
    returnString += "inner leaf break ";

    // Location (clockhours)
    returnString += this.clockHour() + " o'clock";

    return returnString;
}
