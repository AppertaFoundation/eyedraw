/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
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
 * Nerve Fibre Defect
 *
 * @class ConjunctivalHaem
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ConjunctivalHaem = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "ConjunctivalHaem";

    // Saved parameters
    this.savedParameterArray = ['arc', 'rotation'];

    // Call super-class constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.ConjunctivalHaem.prototype = new ED.Doodle;
ED.ConjunctivalHaem.prototype.constructor = ED.ConjunctivalHaem;
ED.ConjunctivalHaem.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ConjunctivalHaem.prototype.setHandles = function() {
    this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    //this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default dragging attributes
 */
ED.ConjunctivalHaem.prototype.setPropertyDefaults = function() {
    this.isMoveable = false;
};

/**
 * Sets default parameters
 */
ED.ConjunctivalHaem.prototype.setParameterDefaults = function() {
    this.arc = 2.0944;

    this.setRotationWithDisplacements(120, 150);
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ConjunctivalHaem.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.ConjunctivalHaem.superclass.draw.call(this, _point);

    // Radius of outer curve
    var ro = 730;
    var ri = 380;
    var r = 380;//ri + (ro - ri) / 2;

    // Calculate parameters for arcs
    var theta = this.arc / 2;
    var arcStart = -Math.PI / 2 + theta;
    var arcEnd = -Math.PI / 2 - theta;

    // Coordinates of 'corners' of ConjunctivalHaem
    var topRightX = r * Math.sin(theta);
    var topRightY = -r * Math.cos(theta);
    var topLeftX = -r * Math.sin(theta);
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
    ctx.fillStyle = "rgba(200, 200, 200, 0.75)";
    ctx.strokeStyle = "gray";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Coordinates of handles (in canvas plane)
    this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
    this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Return value indicating successful hit test
    return this.isClicked;
};

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ConjunctivalHaem.prototype.groupDescription = function() {
    return "Nerve fibre layer defect at ";
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ConjunctivalHaem.prototype.description = function() {
    return this.clockHour() + " o'clock";
};
