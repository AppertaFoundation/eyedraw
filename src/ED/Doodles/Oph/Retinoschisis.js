/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2016
 *
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
 * Retinoschisis
 *
 * @class Retinoschisis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Retinoschisis = function(_drawing, _parameterJSON)
{
    // Set classname
    this.className = "Retinoschisis";

    // Saved parameters
    this.savedParameterArray = ['arc', 'rotation', 'apexY'];

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Retinoschisis.prototype = new ED.Doodle;
ED.Retinoschisis.prototype.constructor = ED.Retinoschisis;
ED.Retinoschisis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Retinoschisis.prototype.setHandles = function()
{
    this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Retinoschisis.prototype.setPropertyDefaults = function()
{
    this.isSelectable = true;
    this.isOrientated = false;
    this.isScaleable = true;
    this.isSqueezable = false;
    this.isMoveable = false;
    this.isRotatable = true;
    this.rangeOfScale = new ED.Range(+1, +4);
    this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
    this.rangeOfApexX = new ED.Range(-0, +0);
    this.rangeOfApexY = new ED.Range(-400, +400);
}

/**
 * Sets default parameters
 */
ED.Retinoschisis.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;
    this.rotation = 225 * Math.PI/180;
    this.apexY = -260;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Retinoschisis.prototype.draw = function(_point)
{
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Retinoschisis.superclass.draw.call(this, _point);

    // Fit outer curve just inside ora on right and left fundus diagrams
    var r = 952/2;

    // Calculate parameters for arcs
    var theta = this.arc/2;
    var arcStart = - Math.PI/2 + theta;
    var arcEnd = - Math.PI/2 - theta;

    // Coordinates of corners of arc
    var topRightX = r * Math.sin(theta);
    var topRightY = - r * Math.cos(theta);
    var topLeftX = - r * Math.sin(theta);
    var topLeftY = topRightY;

    // Boundary path
    ctx.beginPath();

    // Start at top right
    //ctx.moveTo(topRightX, topRightY);

    // Arc across from top right to to mirror image point on the other side
    ctx.arc(0, 0, r, arcStart, arcEnd, true);

    // Connect across the bottom via the apex point
    var bp = +0.6;

    // Radius of disk (from Fundus doodle)
    var dr = +25;

    // RD above optic disk
    if (this.apexY < -dr)
    {
        ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
        ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
    }
    // Retinoschisis involves optic disk
    else if (this.apexY < dr)
    {
        // Angle from origin to intersection of disk margin with a horizontal line through apexY
        var phi = Math.acos((0 - this.apexY)/dr);

        // Curve to disk, curve around it, then curve out again
        var xd = dr * Math.sin(phi);
        ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, -xd, this.apexY);
        ctx.arc(0, 0, dr, -Math.PI/2 - phi, -Math.PI/2 + phi, false);
        ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
    }
    // Retinoschisis beyond optic disk
    else
    {
        ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, 0, 25);
        ctx.arc(0, 0, dr, Math.PI/2, 2.5*Math.PI, false);
        ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
    }

    // Set line attributes
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(0, 255, 255, 0.75)";
    ctx.strokeStyle = "rgba(0, 200, 255, 0.75)";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Other stuff here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
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
ED.Retinoschisis.prototype.description = function()
{
    // Get side
    if(this.drawing.eye == ED.eye.Right)
    {
        var isRightSide = true;
    }
    else
    {
        var isRightSide = false;
    }

    // Construct description
    var returnString = "";

    // Use trigonometry on rotation field to determine quadrant
    returnString = returnString + (Math.cos(this.rotation) > 0?"Supero":"Infero");
    returnString = returnString + (Math.sin(this.rotation) > 0?(isRightSide?"nasal":"temporal"):(isRightSide?"temporal":"nasal"));
    returnString = returnString + " retinoschisis";

    // Return description
    return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Retinoschisis.prototype.snomedCode = function()
{
    return 44268007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Retinoschisis.prototype.diagnosticHierarchy = function()
{
    return 6;
}
