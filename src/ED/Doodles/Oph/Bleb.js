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
 * Bleb
 *
 * @class Bleb
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Bleb = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "Bleb";

    // Other parameters
    this.leakage = "None";

    // Saved parameters
    this.savedParameterArray = ['rotation', 'arc', 'leakage', 'apexX', 'apexY'];

    // Parameters in doodle control bar (parameter name: parameter label)
    this.controlParameterArray = {'leakage':'Leakage'};

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.Bleb.prototype = new ED.Doodle;
ED.Bleb.prototype.constructor = ED.Bleb;
ED.Bleb.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bleb.prototype.setHandles = function() {
    this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default dragging attributes
 */
ED.Bleb.prototype.setPropertyDefaults = function() {
    this.isScaleable = false;
    this.isMoveable = false;
    this.isArcSymmetrical = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 12, Math.PI / 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-100, +100);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-500, -380);

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['leakage'] = {
        kind: 'derived',
        type: 'string',
        list: ['None', 'Minimal', 'Moderate', 'Brisk'],
        animate: true
    };
};

/**
 * Sets default parameters
 */
ED.Bleb.prototype.setParameterDefaults = function() {
    this.setRotationWithDisplacements(30, 30);
    this.arc = Math.PI/8;
    this.apexY = -400;
    this.setParameterFromString('leakage', 'None');
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Bleb.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = [];

    switch (_parameter) {
        case 'arc':
            // Adjust limit of apexX according to size of bleb (represented by arc parameter)
            var lx = 1.2 * 400 * Math.tan(_value/2);
            this.parameterValidationArray['apexX']['range'].setMinAndMax(-lx, +lx);
            var ly = 0.9 * 400 * Math.cos(_value/2);
            this.parameterValidationArray['apexY']['range'].setMinAndMax(-500, -ly);
            break;
    }

    return returnArray;
};
/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bleb.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Bleb.superclass.draw.call(this, _point);

    // Base radius
    var r = 470;

    // Boundary path
    ctx.beginPath();

    // Radii
    var ro = 500;
    var ri = 384;

    // Calculate parameters for arcs
    var theta = this.arc / 2;
    var eps = Math.PI/30;
    var phi = Math.PI/40;
    var arcStart = -Math.PI / 2 + theta;
    var arcEnd = -Math.PI / 2 - theta;

    // Coordinates of 'corners' of doodle
    var topRightX = ro * Math.sin(theta);
    var topRightY = -ro * Math.cos(theta);
    var topLeftX = -ro * Math.sin(theta);
    var topLeftY = topRightY;
    var handleRightX = r * Math.sin(theta + eps);
    var handleRightY = -r * Math.cos(theta + eps);
    var handleLeftX = -r * Math.sin(theta + eps);
    var handleLeftY = handleRightY;
    var cpRightX = r * Math.sin(theta + eps + phi);
    var cpRightY = -r * Math.cos(theta + eps + phi);
    var cpLeftX = -r * Math.sin(theta + eps + phi);
    var cpLeftY = cpRightY;
    var bottomRightX = ri * Math.sin(theta);
    var bottomRightY = -ri * Math.cos(theta);
    var bottomLeftX = -ri * Math.sin(theta);
    var bottomLeftY = bottomRightY;

    // Boundary path
    ctx.beginPath();

    // Arc across
    ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

    // Curvy left hand edge
    ctx.quadraticCurveTo(cpLeftX, cpLeftY, bottomLeftX, bottomLeftY);

    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

    // Curvy right hand edge
    ctx.quadraticCurveTo(cpRightX, cpRightY, topRightX, topRightY);

    // Close path
    ctx.closePath();

    // Colour of fill
    ctx.fillStyle = "rgba(240,240,240,0.9)";

    // Set line attributes
    ctx.lineWidth = 4;

    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Non-boundary paths
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        ctx.beginPath();
        ctx.moveTo(-50, -ri);
        ctx.lineTo(-50, -ri * 1.2);
        ctx.lineTo(50, -ri * 1.2);
        ctx.lineTo(50, -ri);
        ctx.stroke();

        if (this.leakage !== "None") {

            // Size of triangular leakage area
            var l;
            switch (this.leakage) {
                case 'Minimal':
                    l = 100;
                    break;
                case 'Moderate':
                    l = 150;
                    break;
                case 'Brisk':
                    l = 200;
                    break;
            }

            // Apex angle of leakage triangle
            var phi = Math.PI/8;

            // Apex and source of leakage
            ctx.beginPath();
            ctx.moveTo(this.apexX,this.apexY);

            // Calculate position of points making up triangular area of leakage
            var p1 = new ED.Point(0, 0);
            p1.setWithPolars(-l, phi - this.rotation);
            var p2 = new ED.Point(0, 0);
            p2.setWithPolars(-l, -phi - this.rotation);

            // Radius of tear drop
            r = p1.distanceTo(p2)/2;

            // Centre of tear drop
            var p3 = new ED.Point(0, 0);
            p3.setWithPolars(-l, -this.rotation);

            // Complete path
            ctx.lineTo(this.apexX + p1.x, this.apexY + p1.y);
            ctx.arc(this.apexX + p3.x, this.apexY + p3.y, r, Math.PI - this.rotation, 2 * Math.PI - this.rotation, true);
            ctx.lineTo(this.apexX + p2.x, this.apexY + p2.y);
            ctx.closePath();

            // Fill it
            ctx.fillStyle = "rgba(0, 255, 0, 0.75)";
            ctx.fill();
        }
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[3].location = this.transform.transformPoint(new ED.Point(handleRightX, handleRightY));
    if (this.leakage !== "None") {
        this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    }
    else {
        this.handleArray[4].location = this.transform.transformPoint(new ED.Point(-600, -600));
    }

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Return value indicating successful hittest
    return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bleb.prototype.description = function() {
    var returnString = "Trabeculectomy bleb at " + this.clockHour() + " o'clock";
    if (this.leakage !== "None") {
    	returnString += " with " + this.leakage.toLowerCase() + " leakage";
    }

    return returnString;
};