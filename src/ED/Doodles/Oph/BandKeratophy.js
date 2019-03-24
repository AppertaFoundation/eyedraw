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
 * The optic disc
 *
 * @class BandKeratophy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.BandKeratophy = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "BandKeratophy";

    // Private parameters
    this.numberOfOuterHandles = 4;
    this.numberOfInnerHandles = 4;
    this.initialRadius = 380;
    this.opacity = 0.25;

    // Saved parameters
    this.savedParameterArray = ['originX', 'originY', 'rotation', 'gradeOfOpacity'];
    this.controlParameterArray = {
        'gradeOfOpacity': 'Grade of opacity',
    };

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.BandKeratophy.prototype = new ED.Doodle;
ED.BandKeratophy.prototype.constructor = ED.BandKeratophy;
ED.BandKeratophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BandKeratophy.prototype.setHandles = function() {
    // Array of handles , 4 circular
    for (var i = 0; i < this.numberOfOuterHandles; i++) {
        this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    }

    //this.handleArray[0] - bottom right
    //this.handleArray[3] - top right

    this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[5] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[6] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[7] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);

    // Allow top handle to rotate doodle
    //this.handleArray[0].isRotatable = true;
};

/**
 * Sets default properties
 */
ED.BandKeratophy.prototype.setPropertyDefaults = function() {
    this.isScaleable = false;
    this.isMoveable = false;
    this.isUnique = true;
    this.isRotatable = false;

    this.parameterValidationArray.gradeOfOpacity = {
        kind: 'derived',
        type: 'string',
        list: ['+', '++', '+++', '++++']
    };

    /** Outer (circualar?) handlers **/
    var cir = (2 * Math.PI) / this.numberOfOuterHandles;
    var minMax = [
        {min: cir    , max: cir * 2},
        {min: cir * 2, max: cir * 3},
        {min: cir * 3, max: cir * 4},
        {min: cir * 4, max: cir    },
    ];

    // Create ranges to constrain handles
    this.handleVectorRangeArray = [];
    for (var i = 0; i < this.numberOfOuterHandles; i++) {
        // Create a range object for each handle
        var range = {};
        range.length = new ED.Range(+390, +390);
        range.angle = new ED.Range(minMax[i].min, minMax[i].max);
        this.handleVectorRangeArray[i] = range;
    }

    //create handleVectorRangeArray entry for all the inner handlers
    //this should not be necessary but it gives error if it isn't set
    // probably it should be in sync with this.handleArray
    for (var ii = 0; ii < this.numberOfInnerHandles; ii++) {
        this.handleVectorRangeArray.push({
            'length' : new ED.Range(-350, +350),
            'angle' : new ED.Range(2 * Math.PI / 180, 355 * Math.PI / 180)
        });
    }

    /** Inner handlers **/
    this.handleCoordinateRangeArray = [];
    // let's set default entries because of handleVectorRangeArray
    for (var hcr = 0; hcr < this.numberOfOuterHandles; hcr++) {
        this.handleCoordinateRangeArray[hcr] = {
            x: new ED.Range(-400, +400),
            y: new ED.Range(-400, +400)
        };
    }

    //left top
    this.handleCoordinateRangeArray[4] = {
        x: new ED.Range(-300, 0),
        y: new ED.Range(-100, +80)
    };

    this.handleCoordinateRangeArray[5] = {
        x: new ED.Range(0, 300),
        y: new ED.Range(-100, +80)
    };

    this.handleCoordinateRangeArray[6] = {
        x: new ED.Range(-300, 0),
        y: new ED.Range(-100, 80)
    };

    this.handleCoordinateRangeArray[7] = {
        x: new ED.Range(0, 300),
        y: new ED.Range(-100, 80)
    };
};

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.BandKeratophy.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = {};

    switch (_parameter) {
        case 'gradeOfOpacity':
            returnArray.opacity = (_value.length * 25) / 100;
            break;
    }

    return returnArray;
};

/**
 * Sets default parameters
 */
ED.BandKeratophy.prototype.setParameterDefaults = function() {
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    this.setParameterFromString('gradeOfOpacity', '+');

    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

    // Add it to squiggle array
    this.squiggleArray.push(squiggle);

    // top left, bottom left, bottom, right, top right
    var coords = [120, 240, 300, 60];

    // Populate with handles at equidistant points around circumference
    for (var i = 0; i < this.numberOfOuterHandles; i++) {
        var point = new ED.Point(0, 0);
        point.setWithPolars(this.initialRadius, coords[i] * Math.PI / 180);
        this.addPointToSquiggle(point);
    }

    //left top
    this.addPointToSquiggle(new ED.Point(-100, -100));

    //top right
    this.addPointToSquiggle(new ED.Point(100, -100));

    //bottom left
    this.addPointToSquiggle(new ED.Point(-100, 100));

    //bottom right
    this.addPointToSquiggle(new ED.Point(100, 100));
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */

ED.BandKeratophy.prototype.createArcCurveFromPoints = function(center, radius, startPoint, endPoint) {
    var createArcCurveFromAngles = function(center, radius, startAngle, endAngle) {
        var cirlceR = function(arc) {
            return new Vector2D(center.x + radius * Math.cos(arc), center.y - radius * Math.sin(arc));
        };
        return function(t) {
            var newt = t * (endAngle - startAngle) + startAngle;
            return cirlceR(newt);
        };
    };
    var startAngle = -1 * Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
    var endAngle = -1 * Math.atan2(endPoint.y - center.y, endPoint.x - center.x);
    if(startAngle > endAngle) {
        startAngle -= 2 * Math.PI;
    }
    return createArcCurveFromAngles(center, radius, startAngle, endAngle);
};

ED.BandKeratophy.prototype.createCatmullRomSpline = function(cps, ts, vStart, vEnd) {
    if(ts === undefined) {
        ts = [];
        for(var i = 0; i < cps.length; ++i) {
            ts.push(i);
        }
    }

    vStart = vStart || new Vector2D(0, 0);
    vEnd = vEnd || new Vector2D(0, 0);

    var Hermite = function(p0, v0, t0, p1, v1, t1, t) {
        var a0 = p0;
        var a1 = v0;
        var diff = t1 - t0;
        var diff_2 = diff * diff;
        var diff_3 = diff_2 * diff;
        var a2 = (p1.sub(p0).scale(3.0).scale(1 / diff_2)).sub((v1.add(v0.scale(2.0))).scale(1 / diff));
        var a3 = p0.sub(p1).scale(2.0).scale(1 / diff_3).add(v1.add(v0).scale(1 / diff_2));
        var x = t - t0;
        var x_2 = x * x;
        var x_3 = x_2 * x;
        return a3.scale(x_3).add(a2.scale(x_2).add(a1.scale(x).add(a0)));
    };

    var r = function(t) {
        t = Math.min(t, ts[ts.length - 1]);
        t = Math.max(t, ts[0]);	// clamp t

        var i = Math.floor(t);
        var vi = (i === 0) ?
            vStart :
            ((cps[i + 1].sub(cps[i])).scale(1 / (ts[i + 1] - ts[i])).
            add(cps[i].sub(cps[i - 1]).scale(1 / (ts[i] - ts[i - 1])))).
            scale(0.5);
        var vi_ = (i === cps.length - 2) ?
            vEnd :
            ((cps[i + 2].sub(cps[i + 1])).scale(1 / (ts[i + 2] - ts[i + 1])).
            add(cps[i + 1].sub(cps[i]).scale(1 / (ts[i + 1] - ts[i])))).
            scale(0.5);
        return Hermite(cps[i], vi, ts[i], cps[i + 1], vi_, ts[i + 1], t);
    };

    return function(t) {
        var newt = t * (ts[ts.length - 1] - ts[0]) + ts[0];
        return r(newt);
    };
};


ED.BandKeratophy.prototype.drawShape = function(ctx, center, radius, pointA, pointB, pointC, pointD, pointE, pointF, pointG, pointH) {
    var parametricCurves = [
        this.createArcCurveFromPoints(center, radius, pointE, pointD),
        this.createCatmullRomSpline([pointD, pointC, pointB, pointA]),
        this.createArcCurveFromPoints(center, radius, pointA, pointH),
        this.createCatmullRomSpline([pointH, pointG, pointF, pointE]),
    ];


    var resolution = 100;
    var dt = 1 / resolution;
    var startPoint = parametricCurves[0](0);
    ctx.moveTo(startPoint.x, startPoint.y);
    for(var i = 0; i < parametricCurves.length; ++i) {
        for(var t = 0; t <= 1; t += dt) {
            var actualPoint = parametricCurves[i](t);
            ctx.lineTo(actualPoint.x, actualPoint.y);
        }
    }

    ctx.fillStyle = "rgb(169,169,169," + this.opacity + ")";
    ctx.fill();
};

ED.BandKeratophy.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.BandKeratophy.superclass.draw.call(this, _point);

    var pointA = new Vector2D(this.squiggleArray[0].pointsArray[2].x, this.squiggleArray[0].pointsArray[2].y);
    var pointB = new Vector2D(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
    var pointC = new Vector2D(this.squiggleArray[0].pointsArray[5].x, this.squiggleArray[0].pointsArray[5].y);
    var pointD = new Vector2D(this.squiggleArray[0].pointsArray[3].x, this.squiggleArray[0].pointsArray[3].y);
    var pointE = new Vector2D(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    var pointF = new Vector2D(this.squiggleArray[0].pointsArray[7].x, this.squiggleArray[0].pointsArray[7].y);
    var pointG = new Vector2D(this.squiggleArray[0].pointsArray[6].x, this.squiggleArray[0].pointsArray[6].y);
    var pointH = new Vector2D(this.squiggleArray[0].pointsArray[1].x, this.squiggleArray[0].pointsArray[1].y);

    ctx.beginPath();
    this.drawShape(ctx, new Vector2D(0, 0), this.initialRadius, pointA, pointB, pointC, pointD, pointE, pointF, pointG, pointH);

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    ctx.beginPath();

    // Coordinates of expert handles (in canvas plane)
    for (var i = 0; i < this.numberOfOuterHandles; i++) {
        this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
    }

    this.handleArray[4].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[4]);
    this.handleArray[5].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[5]);
    this.handleArray[6].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[6]);
    this.handleArray[7].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[7]);

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
ED.BandKeratophy.prototype.description = function() {
    return 'Band Keratophy';
};

ED.AntSeg.prototype.snomedCode = function()
{
    return 35055000;
};