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
 * Corneal Oedema
 *
 * @class PCV
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PCV = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "PCV";

    this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.PCV.prototype = new ED.Doodle;
ED.PCV.prototype.constructor = ED.PCV;
ED.PCV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PCV.prototype.setHandles = function() {
    this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
};

/**
 * Sets default properties
 */
ED.PCV.prototype.setPropertyDefaults = function() {
    this.isRotatable = false;
    this.isUnique = false;

    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.7);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.7);

    this.parameterValidationArray['originY']['range'].setMinAndMax(-5, +5);
    this.parameterValidationArray['originX']['range'].setMinAndMax(-5 , +5);

};

ED.PCV.prototype.setParameterDefaults = function() {
    this.scaleY = 1.7;
    this.scaleX = 1.7;
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PCV.prototype.dependentParameterValues = function(_parameter, _value) {

    var returnArray = [];

    var r = 175;
    switch (_parameter) {
        case 'scaleX':
        case 'scaleY':
            this.parameterValidationArray['originX']['range'].setMinAndMax(-300+(r*_value), 300-(r*_value));
            this.parameterValidationArray['originY']['range'].setMinAndMax(-300+(r*_value), 300-(r*_value));

            var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY);
            var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX);

            this.setSimpleParameter('originX', newOriginX);
            this.setSimpleParameter('originY', newOriginY);

            break;
    }

    return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PCV.prototype.draw = function(_point) {

    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.PCV.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Invisible boundary
    var r = 200;
    ctx.arc(0, 0, r, 0, Math.PI * 2, true);

    // Set line attributes
    ctx.lineWidth = 0;
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.closePath();

    this.drawBoundary(_point);


    // Non boundary paths
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

        var angle = Math.PI / 180;
        var angles = [33, 64 , 121, 153, 200, 232, 305, 338];
        var blood_color = 'rgba(188, 25, 0, 1)';

        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var blob = new ED.Point(0, 0);
            blob.setWithPolars(155, angle * angles[i]);
            this.drawSpot(ctx, blob.x, blob.y, 20, blood_color);

            ctx.moveTo(0,0);
            //Bezier Curve to draw squiggly blood vessels - maybe later
            ctx.bezierCurveTo(0,0,0,0,blob.x, blob.y);
            ctx.lineWidth = 5;
            ctx.strokeStyle = blood_color;
            ctx.stroke();
        }
        ctx.closePath();
        ctx.beginPath();

        ctx.fillStyle = blood_color;
        ctx.ellipse(0,0, 85,70, 0, 0, 360);
        ctx.fill();
    }


    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));

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
ED.PCV.prototype.description = function() {
    return "";
};