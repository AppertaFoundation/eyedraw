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
 * Lattice degeneration
 *
 * @class Lattice
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param _parameterJSON
 */
ED.Lattice = function(_drawing, _parameterJSON)
{
    // Set classname
    this.className = "Lattice";
  
    // Saved parameters
    this.savedParameterArray = ['arc', 'radius', 'originX', 'originY', 'rotation'];

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Lattice.prototype = new ED.Doodle;
ED.Lattice.prototype.constructor = ED.Lattice;
ED.Lattice.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lattice.prototype.setHandles = function()
{
    this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.Lattice.prototype.setPropertyDefaults = function()
{
    this.isSelectable = true;
    this.isOrientated = false;
    this.isScaleable = false;
    this.isSqueezable = false;
    this.isMoveable = false;
    this.isRotatable = true;
    this.rangeOfScale = new ED.Range(+0.125, +1.5);
    this.rangeOfArc = new ED.Range(Math.PI/12, Math.PI*2);
    this.rangeOfApexX = new ED.Range(-0, +0);
    this.rangeOfApexY = new ED.Range(50, +250);
}

/**
 * Sets default parameters
 */
ED.Lattice.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;

    // The radius property is changed by movement in rotatable doodles
    this.radius = 350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lattice.prototype.draw = function(_point)
{
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Lattice.superclass.draw.call(this, _point);

    // Lattice is at equator
    var ro = this.radius + 50;
    var ri = this.radius;
    var r = ri + (ro - ri)/2;

    // Calculate parameters for arcs
    var theta = this.arc/2;
    var arcStart = - Math.PI/2 + theta;
    var arcEnd = - Math.PI/2 - theta;

    // Coordinates of 'corners' of lattice
    var topRightX = r * Math.sin(theta);
    var topRightY = - r * Math.cos(theta);
    var topLeftX = - r * Math.sin(theta);
    var topLeftY = topRightY;

    // Boundary path
    ctx.beginPath();

    // Arc across to mirror image point on the other side
    ctx.arc(0, 0, ro, arcStart, arcEnd, true);

    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, arcEnd, arcStart, false);

    // Close path
    ctx.closePath();

    // Set line attributes
    ctx.lineWidth = 4;

    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['LatticePattern'],'repeat');
    ctx.fillStyle = ptrn;

    ctx.strokeStyle = "lightgray";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Other stuff here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
    this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.Lattice.prototype.description = function()
{
    var returnString = "Lattice at ";

    // Location (clockhours)
    returnString += this.clockHour() + " o'clock";

    return returnString;
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Lattice.prototype.snomedCode = function()
{
    return 3577000;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Lattice.prototype.diagnosticHierarchy = function()
{
    return 0;
}
