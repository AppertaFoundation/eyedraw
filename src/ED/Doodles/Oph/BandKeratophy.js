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
    this.numberOfInnerHandles = 6;
    this.initialRadius = 380;
    this.opacity = 0.25;

    // Saved parameters
    this.savedParameterArray = ['originX', 'originY', 'rotation', 'gradeOfOpacity'];
    this.controlParameterArray = {
        'gradeOfOpacity': 'Opacity grade',
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
    this.handleArray[8] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[9] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);

    // Allow top handle to rotate doodle
    //this.handleArray[0].isRotatable = true;
};

ED.BandKeratophy.prototype.updateHandleCoordinateRanges = function() {
    var shapeControlPoints = {};
    shapeControlPoints.controlPointOuterTopLeft = new Vector2D(this.squiggleArray[0].pointsArray[2].x, this.squiggleArray[0].pointsArray[2].y);
    shapeControlPoints.controlPointInnerTopLeft = new Vector2D(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
    shapeControlPoints.controlPointInnerTopRight = new Vector2D(this.squiggleArray[0].pointsArray[5].x, this.squiggleArray[0].pointsArray[5].y);
    shapeControlPoints.controlPointOuterTopRight = new Vector2D(this.squiggleArray[0].pointsArray[3].x, this.squiggleArray[0].pointsArray[3].y);
    shapeControlPoints.controlPointOuterBottomRight = new Vector2D(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    shapeControlPoints.controlPointInnerBottomRight = new Vector2D(this.squiggleArray[0].pointsArray[7].x, this.squiggleArray[0].pointsArray[7].y);
    shapeControlPoints.controlPointInnerBottomLeft = new Vector2D(this.squiggleArray[0].pointsArray[6].x, this.squiggleArray[0].pointsArray[6].y);
    shapeControlPoints.controlPointOuterBottomLeft = new Vector2D(this.squiggleArray[0].pointsArray[1].x, this.squiggleArray[0].pointsArray[1].y);
    shapeControlPoints.controlPointInnerTopCenter = new Vector2D(this.squiggleArray[0].pointsArray[8].x, this.squiggleArray[0].pointsArray[8].y);
    shapeControlPoints.controlPointInnerBottomCenter = new Vector2D(this.squiggleArray[0].pointsArray[9].x, this.squiggleArray[0].pointsArray[9].y);

    this.handleCoordinateRangeArray = [];
    this.handleVectorRangeArray = [];

    /** Outer  handlers **/

    // let's set default entries because of handleVectorRangeArray
    for (var hcr = 0; hcr < this.numberOfOuterHandles; hcr++) {
        this.handleCoordinateRangeArray[hcr] = {
            x: new ED.Range(-400, +400),
            y: new ED.Range(-400, +400)
        };
    }

    var bottomRightIndex = 0;
    var bottomLeftIndex = 1;
    var topLeftIndex = 2;
    var topRightIndex = 3;
    var epsilonAngle = 3 / 180 * Math.PI;
    var gapAngle = 15 / 180 * Math.PI;
    var minMax = [
        {min: this.squiggleArray[0].pointsArray[topRightIndex].direction() + gapAngle, max: Math.PI - epsilonAngle},
        {min: Math.PI + epsilonAngle, max: this.squiggleArray[0].pointsArray[topLeftIndex].direction() - gapAngle},
        {min: this.squiggleArray[0].pointsArray[bottomLeftIndex].direction() + gapAngle, max: 2 * Math.PI - epsilonAngle},
        {min: 2 * Math.PI + epsilonAngle, max: this.squiggleArray[0].pointsArray[bottomRightIndex].direction() - gapAngle },
    ];

    // Create ranges to constrain handles
    for (var i = 0; i < this.numberOfOuterHandles; i++) {
        // Create a range object for each handle
        var range = {};
        range.length = new ED.Range(+390, +390);
        range.angle = new ED.Range(minMax[i].min, minMax[i].max);
        this.handleVectorRangeArray[i] = range;
    }


    /** Inner  handlers **/

    for (var ii = 0; ii < this.numberOfInnerHandles; ii++) {
        this.handleVectorRangeArray.push({
            'length' : new ED.Range(0, +390),
            'angle' : new ED.Range(0, 2 * Math.PI)
        });
    }

    var topCatmullRomSpline = this.createCatmullRomSpline([
        shapeControlPoints.controlPointOuterTopRight,
        shapeControlPoints.controlPointInnerTopRight,
        shapeControlPoints.controlPointInnerTopCenter,
        shapeControlPoints.controlPointInnerTopLeft,
        shapeControlPoints.controlPointOuterTopLeft,
    ]);

    var bottomCatmullRomSpline = this.createCatmullRomSpline([
        shapeControlPoints.controlPointOuterBottomLeft,
        shapeControlPoints.controlPointInnerBottomLeft,
        shapeControlPoints.controlPointInnerBottomCenter,
        shapeControlPoints.controlPointInnerBottomRight,
        shapeControlPoints.controlPointOuterBottomRight,
    ]);

    var searchMinimaOrMaximaOfSpline = function(spline, x, searchForMinima) {
        var searchFunction = searchForMinima ? Math.min : Math.max;
        var minimaOrMaxima = searchForMinima ? 500 : -500;
        var steps = 1000;
        var max_diff = 3;
        var dt = 1 / steps;
        for(var t = 0; t <= 1; t += dt) {
            var r = spline(t);
            if(Math.abs(r.x - x) < max_diff) {
                minimaOrMaxima = searchFunction(minimaOrMaxima, r.y);
            }
        }
        return minimaOrMaxima;
    }

    var space = 60;

    //left top
    this.handleCoordinateRangeArray[4] = {
        x: new ED.Range(-300, -100),
        y: new ED.Range(-390, searchMinimaOrMaximaOfSpline(bottomCatmullRomSpline,
            shapeControlPoints.controlPointInnerTopLeft.x, true) - space)
    };

    //top right
    this.handleCoordinateRangeArray[5] = {
        x: new ED.Range(100, 300),
        y: new ED.Range(-390, searchMinimaOrMaximaOfSpline(bottomCatmullRomSpline,
            shapeControlPoints.controlPointInnerTopRight.x, true) - space)
    };

    //bottom left
    this.handleCoordinateRangeArray[6] = {
        x: new ED.Range(-300, -100),
        y: new ED.Range(searchMinimaOrMaximaOfSpline(topCatmullRomSpline,
            shapeControlPoints.controlPointInnerBottomLeft.x, false) + space,
            390)
    };

    //bottom right
    this.handleCoordinateRangeArray[7] = {
        x: new ED.Range(100, 300),
        y: new ED.Range(searchMinimaOrMaximaOfSpline(topCatmullRomSpline,
            shapeControlPoints.controlPointInnerBottomRight.x, false) + space,
            390)
    };

    //top center
    this.handleCoordinateRangeArray[8] = {
        x: new ED.Range(-100, +100),
        y: new ED.Range(-390, searchMinimaOrMaximaOfSpline(bottomCatmullRomSpline,
            shapeControlPoints.controlPointInnerTopCenter.x, true) - space)
    };

    //bottom center
    this.handleCoordinateRangeArray[9] = {
        x: new ED.Range(-100, +100),
        y: new ED.Range(searchMinimaOrMaximaOfSpline(topCatmullRomSpline,
            shapeControlPoints.controlPointInnerBottomCenter.x, false) + space,
            390)
    };
}

ED.BandKeratophy.prototype.updateHandlePositions = function (){
    for(var index = 0; index < this.squiggleArray[0].pointsArray.length; ++index) {
        var newPosition = new ED.Point(
            this.handleCoordinateRangeArray[index]['x'].constrain(this.squiggleArray[0].pointsArray[index].x),
            this.handleCoordinateRangeArray[index]['y'].constrain(this.squiggleArray[0].pointsArray[index].y)
        );
        var length = this.handleVectorRangeArray[index]['length'].constrain(newPosition.length());
        var angle = this.handleVectorRangeArray[index]['angle'].constrainToAngularRange(newPosition.direction(), false);
        newPosition.setWithPolars(length, angle);

        // Set new position for handle
        this.squiggleArray[0].pointsArray[index].x = newPosition.x;
        this.squiggleArray[0].pointsArray[index].y = newPosition.y;
    }
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

    //top center
    this.addPointToSquiggle(new ED.Point(0, -90));

    //bottom center
    this.addPointToSquiggle(new ED.Point(0, 90));
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


ED.BandKeratophy.prototype.drawShape = function(ctx, center, radius, shapeControlPoints) {
    var parametricCurves = [
        this.createArcCurveFromPoints(center, radius,
            shapeControlPoints.controlPointOuterBottomRight, shapeControlPoints.controlPointOuterTopRight),
        this.createCatmullRomSpline([
            shapeControlPoints.controlPointOuterTopRight,
            shapeControlPoints.controlPointInnerTopRight,
            shapeControlPoints.controlPointInnerTopCenter,
            shapeControlPoints.controlPointInnerTopLeft,
            shapeControlPoints.controlPointOuterTopLeft,
        ]),
        this.createArcCurveFromPoints(center, radius,
            shapeControlPoints.controlPointOuterTopLeft, shapeControlPoints.controlPointOuterBottomLeft),
        this.createCatmullRomSpline([
            shapeControlPoints.controlPointOuterBottomLeft,
            shapeControlPoints.controlPointInnerBottomLeft,
            shapeControlPoints.controlPointInnerBottomCenter,
            shapeControlPoints.controlPointInnerBottomRight,
            shapeControlPoints.controlPointOuterBottomRight,
        ]),
    ];

    var parametricCurveTrim = [false, true, false, true,];  // Trim only the Catmull-Rom splines

    var resolution = 100;
    var dt = 1 / resolution;
    var startPoint = parametricCurves[0](0);
    ctx.moveTo(startPoint.x, startPoint.y);
    for(var i = 0; i < parametricCurves.length; ++i) {
        var tStart  = parametricCurveTrim[i] ? 0.03 : 0;
        var tEnd    = parametricCurveTrim[i] ? 0.97 : 1;
        for(var t = tStart; t <= tEnd; t += dt) {
            var actualPoint = parametricCurves[i](t);
            ctx.lineTo(actualPoint.x, actualPoint.y);
        }
    }
    ctx.strokeStyle = "rgb(0,0,0,0)";
    ctx.fillStyle = "rgb(169,169,169," + this.opacity + ")";
    ctx.fill();
};

ED.BandKeratophy.prototype.draw = function(_point) {
    this.updateHandleCoordinateRanges();
    this.updateHandlePositions();

    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.BandKeratophy.superclass.draw.call(this, _point);

    var shapeControlPoints = {};
    shapeControlPoints.controlPointOuterTopLeft = new Vector2D(this.squiggleArray[0].pointsArray[2].x, this.squiggleArray[0].pointsArray[2].y);
    shapeControlPoints.controlPointInnerTopLeft = new Vector2D(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
    shapeControlPoints.controlPointInnerTopRight = new Vector2D(this.squiggleArray[0].pointsArray[5].x, this.squiggleArray[0].pointsArray[5].y);
    shapeControlPoints.controlPointOuterTopRight = new Vector2D(this.squiggleArray[0].pointsArray[3].x, this.squiggleArray[0].pointsArray[3].y);
    shapeControlPoints.controlPointOuterBottomRight = new Vector2D(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    shapeControlPoints.controlPointInnerBottomRight = new Vector2D(this.squiggleArray[0].pointsArray[7].x, this.squiggleArray[0].pointsArray[7].y);
    shapeControlPoints.controlPointInnerBottomLeft = new Vector2D(this.squiggleArray[0].pointsArray[6].x, this.squiggleArray[0].pointsArray[6].y);
    shapeControlPoints.controlPointOuterBottomLeft = new Vector2D(this.squiggleArray[0].pointsArray[1].x, this.squiggleArray[0].pointsArray[1].y);
    shapeControlPoints.controlPointInnerTopCenter = new Vector2D(this.squiggleArray[0].pointsArray[8].x, this.squiggleArray[0].pointsArray[8].y);
    shapeControlPoints.controlPointInnerBottomCenter = new Vector2D(this.squiggleArray[0].pointsArray[9].x, this.squiggleArray[0].pointsArray[9].y);

    ctx.beginPath();
    this.drawShape(ctx, new Vector2D(0, 0), this.initialRadius, shapeControlPoints);
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
    this.handleArray[8].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[8]);
    this.handleArray[9].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[9]);

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
    return 'Band Keratophy ' + this.gradeOfOpacity;
};

ED.BandKeratophy.prototype.snomedCode = function()
{
    return 35055000;
};