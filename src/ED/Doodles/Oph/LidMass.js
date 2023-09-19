/**
 * (C) OpenEyes Foundation, 2020
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.openeyes.org.uk
 *
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (C) 2020, Apperta Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

/**
 * LidMass
 *
 * @class LidMass
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.LidMass = function (_drawing, _parameterJSON) {
    // Set classname
    this.className = "LidMass";

    this.numberOfHandles = 4;
    this.initialRadius = 120;
    this.attachment = 'Top lid';
    this.reset = false;
    this.massWidth = 12;
    this.massHeight = 12;

    this.type = 'Multicystic';
    this.surroundingRedness = false;
    this.surfaceBloodVessels = false;
    this.lashesAbsent = true;
    this.showCaliper = true;
    this.caliperLength = 10; // in mm

    // handle indices for convenience
    this.leftI = 0;
    this.rightI = 2;
    this.topI = 1;
    this.bottomI = 3;

    // Saved parameters
    this.savedParameterArray = ['type', 'originX', 'originY', 'showCaliper', 'caliperLength', 'massHeight', 'massWidth', 'lashesAbsent', 'surroundingRedness', 'surfaceBloodVessels', 'attachment'];

    // Parameters in doodle control bar (parameter name: parameter label)
    this.controlParameterArray = {
        'attachment': 'Attached to:',
        'type': 'Type',
        'surroundingRedness': 'Surrounding redness',
        'surfaceBloodVessels': 'Surface blood vessels',
        'lashesAbsent': 'Lashes absent',
        'showCaliper': 'Caliper',
        'caliperLength': 'Caliper length (mm)'
    };

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);

    this.leftPoint = this.squiggleArray[0].pointsArray[this.leftI];
    this.rightPoint = this.squiggleArray[0].pointsArray[this.rightI];
    this.topPoint = this.squiggleArray[0].pointsArray[this.topI];
    this.bottomPoint = this.squiggleArray[0].pointsArray[this.bottomI];
    this.firstRun = true;

};

/**
 * Sets superclass and constructor
 */
ED.LidMass.prototype = new ED.Doodle;
ED.LidMass.prototype.constructor = ED.LidMass;
ED.LidMass.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LidMass.prototype.setHandles = function () {
    // Array of handles
    for (var i = 0; i < this.numberOfHandles; i++) {
        this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    }
    this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[5] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[6] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    this.caliperHandle1 = this.handleArray[4];
    this.caliperHandle2 = this.handleArray[5];
    this.caliperHandleMiddle = this.handleArray[6];
};

ED.LidMass.prototype.setPropertyDefaults = function () {
    this.isSqueezable = true;
    this.isRotatable = false;

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray.attachment = {
        kind: 'derived',
        type: 'string',
        list: ['Top lid', 'Bottom lid', 'No attachment'],
        animate: true
    };
    this.parameterValidationArray.type = {
        kind: 'derived',
        type: 'string',
        list: ['Nodular', 'Cystic', 'Multicystic', 'Ulcerated', 'Necrotic', 'Pigmented', 'Papillomatous'],
        animate: true
    };
    this.parameterValidationArray['surroundingRedness'] = {
        kind: 'derived',
        type: 'bool',
        display: true
    };
    this.parameterValidationArray['surfaceBloodVessels'] = {
        kind: 'derived',
        type: 'bool',
        display: true
    };
    this.parameterValidationArray['lashesAbsent'] = {
        kind: 'derived',
        type: 'bool',
        display: true
    };
    this.parameterValidationArray['showCaliper'] = {
        kind: 'derived',
        type: 'bool',
        default: 'true',
        display: true
    };
    this.parameterValidationArray['caliperLength'] = {
        kind: 'other',
        type: 'int',
        range: new ED.Range(0, 240),
        animate: false
    };
};

ED.LidMass.prototype.resetParameters = function () {
    this.massWidth = 12;
    this.massHeight = 12;

    switch (this.attachment) {
        case 'Top lid':
            this.topPoint.y = this.middlePoint.y - this.mm2pt(this.massHeight);
            this.leftPoint.x = -this.mm2pt(this.massWidth / 2);
            this.rightPoint.x = this.mm2pt(this.massWidth / 2);
            break;
        case 'Bottom lid':
            this.bottomPoint.y = this.middlePoint.y + this.mm2pt(this.massHeight);
            this.leftPoint.x = -this.mm2pt(this.massWidth / 2);
            this.rightPoint.x = this.mm2pt(this.massWidth / 2);
            break;
        case 'No attachment':
            this.leftPoint.x = -this.mm2pt(this.massWidth / 2);
            this.leftPoint.y = 0;
            this.rightPoint.x = this.mm2pt(this.massWidth / 2);
            this.rightPoint.y = 0;
            this.topPoint.x = 0;
            this.topPoint.y = -this.mm2pt(this.massHeight / 2);
            this.bottomPoint.x = 0;
            this.bottomPoint.y = this.mm2pt(this.massHeight / 2);
            break;
    }
    this.reset = false;
};

/**
 * Sets default parameters
 */
ED.LidMass.prototype.setParameterDefaults = function () {
    this.originY = 0;
    this.reset = true;

    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    this.squiggleArray.push(squiggle);
    // Populate with handles at  points around circumference
    for (let i = 0; i < this.numberOfHandles; i++) {
        let point = new ED.Point(0, 0);
        point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles + Math.PI * 1.75);
        this.addPointToSquiggle(point);
    }
    this.squiggleArray[0].pointsArray[4] = new ED.Point(200, 400); // caliper handles
    this.squiggleArray[0].pointsArray[5] = new ED.Point(400, 400); // caliper handles
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.LidMass.prototype.dependentParameterValues = function (_parameter, _value) {

    switch (_parameter) {
        case 'attachment': // if attachment changed, rest lid mass
            if (_value !== this.attachment) {
                this.reset = true;
                this.previousType = _value;
                if (_value === 'No attachment') {
                    this.originY = 0;
                    this.originX = -300;
                }
                else {
                    this.originY = 0;
                    this.originX = 0;
                }
            }
            break;
    }
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LidMass.prototype.draw = function (_point) {

    // place caliper center point
    if (this.firstRun) {
        const x = (this.squiggleArray[0].pointsArray[4].x + this.squiggleArray[0].pointsArray[5].x) / 2;
        const y = (this.squiggleArray[0].pointsArray[4].y + this.squiggleArray[0].pointsArray[5].y) / 2;
        this.squiggleArray[0].pointsArray[6] = new ED.Point(x, y);
    } // caliper handles


    // get lid parameters from base doodle
    let lidsDoodle = this.drawing.firstDoodleOfClass('Lids');
    if (lidsDoodle) {
        this.lidParams = lidsDoodle.getLidCurveParams();
    }

    const ctx = this.drawing.context;
    // Call draw method in superclass
    ED.LidMass.superclass.draw.call(this, _point);

    ctx.beginPath();
    switch (this.attachment) {
        case 'Top lid':
            this.drawTopAttachment(ctx);
            break;
        case 'Bottom lid':
            this.drawBottomAttachment(ctx);
            break;
        case 'No attachment':
            this.drawNoAttachment(ctx);
            break;
    }
    ctx.closePath();

    // Set attributes
    ctx.lineWidth = 4;
    let fillStyle = "rgba(150, 150, 150, ";
    let opacity = this.lashesAbsent ? '1' : '0.5';
    ctx.strokeStyle = "rgba(50, 50, 50, 1)";
    if (this.type === 'Pigmented') {
        fillStyle = "rgba(100, 50, 50, " + opacity + ')';
    } else if (this.type === 'Necrotic') {
        fillStyle = ctx.createPattern(this.necroticPattern(opacity), "repeat");
    } else {
        fillStyle += opacity + ')';
    }
    ctx.fillStyle = fillStyle;

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // draw ulcer
    if (this.type === 'Ulcerated') {
        ctx.beginPath();
        ctx.moveTo(this.ulcerPoint.x, this.ulcerPoint.y);
        ctx.arc(this.ulcerPoint.x, this.ulcerPoint.y, this.ulcerRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150, 0, 0, 1)";
        ctx.fill();
    }
    if (this.type === 'Cystic') {
        ctx.fillStyle = "rgba(150, 150, 0, 1)";
        ctx.strokeStyle = "rgba(50, 50, 50, 1)"; ctx.beginPath();
        ctx.arc(this.ulcerPoint.x, this.ulcerPoint.y, this.ulcerRadius / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x, this.ulcerPoint.y, this.ulcerRadius / 1.5, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (this.type === 'Multicystic') {
        let radius = this.ulcerRadius / 4;
        let xyDist = this.ulcerRadius / 2;
        ctx.fillStyle = "rgba(100, 50, 0, 1)";
        ctx.strokeStyle = "rgba(50, 50, 50, 1)";
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x, this.ulcerPoint.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x + xyDist, this.ulcerPoint.y + xyDist, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x - xyDist, this.ulcerPoint.y + xyDist, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x - xyDist, this.ulcerPoint.y - xyDist, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.ulcerPoint.x + xyDist, this.ulcerPoint.y - xyDist, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }
    if (this.surfaceBloodVessels) {
        this.drawBloodVessels(ctx);
    }

    // Coordinates of handles (in canvas plane)
    for (let i = 0; i < this.numberOfHandles + 3; i++) {
        this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
    }
    this.caliperHandle1.isVisible = this.showCaliper;
    this.caliperHandle2.isVisible = this.showCaliper;
    this.caliperHandleMiddle.isVisible = this.showCaliper;
    if (this.showCaliper) {
        this.drawCaliper(ctx);
    }

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) {
        this.drawHandles(_point);
    }
    if (this.firstRun) this.firstRun = false;

    // Return value indicating successful hittest
    return this.isClicked;
};

ED.LidMass.prototype.drawBottomAttachment = function (ctx) {

    this.parameterValidationArray.originX.range.setMinAndMax(this.lidParams.startPointTop.x - this.leftPoint.x, this.lidParams.endPointTop.x - this.rightPoint.x);
    this.parameterValidationArray.originY.range.setMinAndMax(0, 0);
    this.originY = 0;
    this.handleArray[this.topI].isVisible = false;
    this.handleArray[this.bottomI].isVisible = true;

    // originX in relation to lower lid
    let t0 = (-this.lidParams.startPointBottom.x + this.originX + 40) / Math.abs(this.lidParams.endPointBottom.x - this.lidParams.startPointBottom.x);
    this.middlePoint = MathHelper.calculateBezierPoints(t0, this.lidParams.startPointBottom, this.lidParams.endPointBottom, this.lidParams.controlPointBottom1, this.lidParams.controlPointBottom2);

    this.bottomPoint.x = 0;

    if (this.reset) {
        this.resetParameters();
    }

    this.massHeight = this.pt2mm(this.bottomPoint.y - this.middlePoint.y);
    this.massWidth = this.pt2mm(this.rightPoint.x - this.leftPoint.x);

    // constrain handles
    if (this.leftPoint.x > -20) {
        this.leftPoint.x = -20;
    }
    if (this.rightPoint.x < 20) {
        this.rightPoint.x = 20;
    }

    if (this.leftPoint.x < this.lidParams.startPointBottom.x - this.originX) {
        this.leftPoint.x = this.lidParams.startPointBottom.x - this.originX;
    }
    if (this.rightPoint.x > this.lidParams.endPointBottom.x - this.originX) {
        this.rightPoint.x = this.lidParams.endPointBottom.x - this.originX;
    }
    if (this.bottomPoint.y < this.middlePoint.y + 20) {
        this.bottomPoint.y = this.middlePoint.y + 20;
    }

    let t1 = MathHelper.bezierTgivenX(this.lidParams.startPointBottom, this.lidParams.endPointBottom, this.lidParams.controlPointBottom1, this.lidParams.controlPointBottom2, this.leftPoint.x + this.originX, true);
    let t2 = MathHelper.bezierTgivenX(this.lidParams.startPointBottom, this.lidParams.endPointBottom, this.lidParams.controlPointBottom1, this.lidParams.controlPointBottom2, this.rightPoint.x + this.originX, false);

    let curveSegment = MathHelper.bezierSegment(t1, t2, this.lidParams.startPointBottom, this.lidParams.endPointBottom, this.lidParams.controlPointBottom1, this.lidParams.controlPointBottom2);
    this.leftPoint.y = curveSegment.startPoint.y - this.originY;
    this.rightPoint.y = curveSegment.endPoint.y - this.originY;

    // draw lid attached part
    ctx.moveTo(curveSegment.startPoint.x - this.originX, curveSegment.startPoint.y - this.originY);
    ctx.bezierCurveTo(curveSegment.controlPoint1.x - this.originX, curveSegment.controlPoint1.y - this.originY, curveSegment.controlPoint2.x - this.originX, curveSegment.controlPoint2.y - this.originY, curveSegment.endPoint.x - this.originX, curveSegment.endPoint.y - this.originY);

    // Bottom curve
    let cp1 = this.bottomPoint.tangentialControlPoint(-Math.PI / 9);
    let cp2 = this.bottomPoint.tangentialControlPoint(Math.PI / 9);
    ctx.bezierCurveTo(this.rightPoint.x, this.rightPoint.y, cp1.x, cp1.y, this.bottomPoint.x, this.bottomPoint.y);
    ctx.bezierCurveTo(cp2.x, cp2.y, this.leftPoint.x, this.leftPoint.y, this.leftPoint.x, this.leftPoint.y);

    if (this.surroundingRedness) {
        let path1 = new Path2D();
        path1.moveTo(this.rightPoint.x, this.rightPoint.y)
        path1.bezierCurveTo(this.rightPoint.x, this.rightPoint.y, cp1.x, cp1.y, this.bottomPoint.x, this.bottomPoint.y);
        path1.bezierCurveTo(cp2.x, cp2.y, this.leftPoint.x, this.leftPoint.y, this.leftPoint.x, this.leftPoint.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        ctx.stroke(path1);
    }

    this.bloodVesselEndpoints = [];
    for (let t of [0.45, 0.55, 0.8, 0.88]) {
        this.bloodVesselEndpoints.push(MathHelper.calculateBezierPoints(t, this.rightPoint, this.bottomPoint, this.rightPoint, cp1))
    }
    for (let t of [0.15, 0.25, 0.47, 0.55]) {
        this.bloodVesselEndpoints.push(MathHelper.calculateBezierPoints(t, this.bottomPoint, this.leftPoint, cp2, this.leftPoint))
    }

    this.ulcerPoint = new ED.Point(0, (this.bottomPoint.y + this.middlePoint.y) / 2);
    this.ulcerRadius = this.mm2pt(Math.min(this.massWidth, this.massHeight)) / 2 * 0.7;
};

ED.LidMass.prototype.drawTopAttachment = function (ctx) {
    this.parameterValidationArray.originX.range.setMinAndMax(this.lidParams.startPointTop.x - this.leftPoint.x, this.lidParams.endPointTop.x - this.rightPoint.x);
    this.parameterValidationArray.originY.range.setMinAndMax(0, 0);
    this.originY = 0;
    this.handleArray[this.topI].isVisible = true;
    this.handleArray[this.bottomI].isVisible = false;
    // originX in relation to upper lid
    let t0 = (-this.lidParams.startPointTop.x + this.originX) / Math.abs(this.lidParams.endPointTop.x - this.lidParams.startPointTop.x);
    this.middlePoint = MathHelper.calculateBezierPoints(t0, this.lidParams.startPointTop, this.lidParams.endPointTop, this.lidParams.controlPointTop1, this.lidParams.controlPointTop2);

    this.topPoint.x = 0;
    if (this.reset) {
        this.resetParameters();
    }

    this.massHeight = this.pt2mm(this.middlePoint.y - this.topPoint.y);
    this.massWidth = this.pt2mm(this.rightPoint.x - this.leftPoint.x);


    // constrain handles
    if (this.leftPoint.x > -20) {
        this.leftPoint.x = -20;
    }
    if (this.rightPoint.x < 20) {
        this.rightPoint.x = 20;
    }
    if (this.leftPoint.x < this.lidParams.startPointTop.x - this.originX) {
        this.leftPoint.x = this.lidParams.startPointTop.x - this.originX;
    }
    if (this.rightPoint.x > this.lidParams.endPointTop.x - this.originX) {
        this.rightPoint.x = this.lidParams.endPointTop.x - this.originX;
    }
    if (this.topPoint.y > this.middlePoint.y - 20) {
        this.topPoint.y = this.middlePoint.y - 20;
    }


    let t1 = (this.leftPoint.x - this.lidParams.startPointTop.x + this.originX) / Math.abs(this.lidParams.endPointTop.x - this.lidParams.startPointTop.x);
    let t2 = (this.rightPoint.x - this.lidParams.startPointTop.x + this.originX) / Math.abs(this.lidParams.endPointTop.x - this.lidParams.startPointTop.x);
    let curveSegment = MathHelper.bezierSegment(t1, t2, this.lidParams.startPointTop, this.lidParams.endPointTop, this.lidParams.controlPointTop1, this.lidParams.controlPointTop2);
    this.leftPoint.y = curveSegment.startPoint.y - this.originY;
    this.rightPoint.y = curveSegment.endPoint.y - this.originY;

    // draw lid attached part
    ctx.moveTo(curveSegment.startPoint.x - this.originX, curveSegment.startPoint.y - this.originY);
    ctx.bezierCurveTo(curveSegment.controlPoint1.x - this.originX, curveSegment.controlPoint1.y - this.originY, curveSegment.controlPoint2.x - this.originX, curveSegment.controlPoint2.y - this.originY, curveSegment.endPoint.x - this.originX, curveSegment.endPoint.y - this.originY);

    // Bottom curve
    let cp1 = this.topPoint.tangentialControlPoint(Math.PI / 9);
    let cp2 = this.topPoint.tangentialControlPoint(-Math.PI / 9);
    ctx.bezierCurveTo(this.rightPoint.x, this.rightPoint.y, cp1.x, cp1.y, this.topPoint.x, this.topPoint.y);
    ctx.bezierCurveTo(cp2.x, cp2.y, this.leftPoint.x, this.leftPoint.y, this.leftPoint.x, this.leftPoint.y);

    if (this.surroundingRedness) {
        let path1 = new Path2D();
        path1.moveTo(this.rightPoint.x, this.rightPoint.y)
        path1.bezierCurveTo(this.rightPoint.x, this.rightPoint.y, cp1.x, cp1.y, this.topPoint.x, this.topPoint.y);
        path1.bezierCurveTo(cp2.x, cp2.y, this.leftPoint.x, this.leftPoint.y, this.leftPoint.x, this.leftPoint.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        ctx.stroke(path1);
    }

    this.bloodVesselEndpoints = [];
    for (let t of [0.45, 0.55, 0.8, 0.88]) {
        this.bloodVesselEndpoints.push(MathHelper.calculateBezierPoints(t, this.rightPoint, this.topPoint, this.rightPoint, cp1))
    }
    for (let t of [0.15, 0.25, 0.47, 0.55]) {
        this.bloodVesselEndpoints.push(MathHelper.calculateBezierPoints(t, this.topPoint, this.leftPoint, cp2, this.leftPoint))
    }

    this.ulcerPoint = new ED.Point(0, (this.topPoint.y + this.middlePoint.y) / 2);
    this.ulcerRadius = this.mm2pt(Math.min(this.massWidth, this.massHeight)) / 2 * 0.7;
};

ED.LidMass.prototype.drawNoAttachment = function (ctx) {
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
    this.handleArray[this.topI].isVisible = true;
    this.handleArray[this.bottomI].isVisible = true;

    if (this.reset) {
        this.resetParameters();
    }

    this.massWidth = this.pt2mm(this.rightPoint.x - this.leftPoint.x);
    this.massHeight = this.pt2mm(this.bottomPoint.y - this.topPoint.y);

    // constrain handles
    if (this.leftPoint.x > -20) {
        this.leftPoint.x = -20;
    }
    if (this.rightPoint.x < 20) {
        this.rightPoint.x = 20;
    }
    if (this.bottomPoint.y < 20) {
        this.bottomPoint.y = 20;
    }
    if (this.topPoint.y > -20) {
        this.topPoint.y = -20;
    }

    this.middlePoint = { x: this.originX, y: this.originY };
    this.bloodVesselEndpoints = [];

    // Start curve
    ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    let phi = 2 * Math.PI / (3 * this.numberOfHandles);
    // Complete curve segments
    for (var i = 0; i < this.numberOfHandles; i++) {
        // From and to points
        let fp = this.squiggleArray[0].pointsArray[i];
        var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
        let tp = this.squiggleArray[0].pointsArray[toIndex];
        let cp1 = fp.tangentialControlPoint(+phi);
        let cp2 = tp.tangentialControlPoint(-phi);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);

        for (let t of [0.45, 0.55, 0.8, 0.88]) {
            this.bloodVesselEndpoints.push(MathHelper.calculateBezierPoints(t + i / 10, fp, tp, cp1, cp2));
        }
    }

    if (this.surroundingRedness) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        ctx.stroke();
    }
    this.ulcerPoint = new ED.Point(0, 0);
    this.ulcerRadius = this.mm2pt(Math.min(this.massWidth, this.massHeight)) / 2 * 0.7;
};

ED.LidMass.prototype.drawCaliper = function (ctx) {
    // if center squiggle moved, move the whole caliper
    let centerX = (this.squiggleArray[0].pointsArray[4].x + this.squiggleArray[0].pointsArray[5].x) / 2;
    let centerY = (this.squiggleArray[0].pointsArray[4].y + this.squiggleArray[0].pointsArray[5].y) / 2;
    if (this.squiggleArray[0].pointsArray[6].hasMoved) {
        let dx = this.squiggleArray[0].pointsArray[6].x - centerX;
        let dy = this.squiggleArray[0].pointsArray[6].y - centerY;
        this.squiggleArray[0].pointsArray[4].x += dx;
        this.squiggleArray[0].pointsArray[4].y += dy;
        this.squiggleArray[0].pointsArray[5].x += dx;
        this.squiggleArray[0].pointsArray[5].y += dy;
    }
    else {
        this.squiggleArray[0].pointsArray[6].x = centerX;
        this.squiggleArray[0].pointsArray[6].y = centerY;
    }

    // caliper handles should not move with the doodle
    let caliper1point = new ED.Point(this.squiggleArray[0].pointsArray[4].x - this.originX, this.squiggleArray[0].pointsArray[4].y - this.originY);
    let caliper2point = new ED.Point(this.squiggleArray[0].pointsArray[5].x - this.originX, this.squiggleArray[0].pointsArray[5].y - this.originY);
    let caliperMiddlePoint = new ED.Point(this.squiggleArray[0].pointsArray[6].x - this.originX, this.squiggleArray[0].pointsArray[6].y - this.originY);
    this.caliperHandle1.location = this.transform.transformPoint(caliper1point);
    this.caliperHandle2.location = this.transform.transformPoint(caliper2point);
    this.caliperHandleMiddle.location = this.transform.transformPoint(caliperMiddlePoint);
    ctx.beginPath();
    ctx.moveTo(caliper1point.x, caliper1point.y);
    ctx.lineTo(caliper2point.x, caliper2point.y);

    // the thingies at the ends of the caliper
    let t0 = new Turtle({ x: caliper1point.x, y: caliper1point.y, vx: caliper2point.x - caliper1point.x, vy: caliper2point.y - caliper1point.y });
    let p1 = t0.turnLeft().move(40).getPoint();
    ctx.moveTo(p1.x, p1.y);
    let p2 = t0.move(-80).getPoint();
    ctx.lineTo(p2.x, p2.y);
    let t1 = new Turtle({ x: caliper2point.x, y: caliper2point.y, vx: caliper1point.x - caliper2point.x, vy: caliper1point.y - caliper2point.y });
    p1 = t1.turnLeft().move(40).getPoint();
    ctx.moveTo(p1.x, p1.y);
    p2 = t1.move(-80).getPoint();
    ctx.lineTo(p2.x, p2.y);

    // text
    let t2 = new Turtle({ x: (caliper1point.x + caliper2point.x) / 2, y: (caliper1point.y + caliper2point.y) / 2, vx: caliper1point.x - caliper2point.x, vy: caliper1point.y - caliper2point.y });
    let p3 = t2.turnLeft().move(60).getPoint();

    ctx.font = '50px Ariel';
    ctx.textAlign = 'center';
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    let sc = this.drawing.isFlipped ? -1 : 1;
    ctx.save();
    ctx.scale(sc, 1);
    ctx.fillText(this.caliperLength + ' mm', p3.x * sc, p3.y);
    ctx.restore();

    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.scale(1, 1);
};

ED.LidMass.prototype.necroticPattern = function (opacity) {
    let pattern = document.createElement('canvas');
    pattern.width = 100;
    pattern.height = 200;
    let pctx = pattern.getContext('2d');
    pctx.fillStyle = "rgba(150, 250, 150," + opacity + ")";
    pctx.fillRect(0, 0, pattern.width, pattern.height);
    pctx.closePath;

    pctx.fillStyle = "rgba(150, 150, 150," + opacity + ")";
    pctx.moveTo(0, 0);
    pctx.lineTo(99, 199);
    pctx.lineTo(99, 99);
    pctx.lineTo(49, 0);
    pctx.fill();

    pctx.moveTo(0, 199);
    pctx.lineTo(49, 199);
    pctx.lineTo(0, 99);
    pctx.fill();

    return pattern;
};

ED.LidMass.prototype.drawBloodVessels = function (ctx) {
    for (let a0 = 0; a0 < this.bloodVesselEndpoints.length; a0 += 2) {
        this.bloodVessel(ctx, this.middlePoint.x - this.originX, this.middlePoint.y - this.originY, this.bloodVesselEndpoints[a0].x, this.bloodVesselEndpoints[a0].y, this.bloodVesselEndpoints[a0 + 1].x, this.bloodVesselEndpoints[a0 + 1].y);
    }
};

ED.LidMass.prototype.bloodVessel = function (ctx, x1, y1, x2, y2, x3, y3) {
    let path1 = new Path2D();
    path1.moveTo(x1, y1);
    path1.lineTo((x1 + x2) / 2, (y1 + y2) / 2);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
    ctx.stroke(path1);

    path1.moveTo(x2, y2);
    path1.lineTo((x1 + x2) / 2, (y1 + y2) / 2);
    path1.lineTo(x3, y3);
    ctx.lineWidth = 5;
    ctx.stroke(path1);
};

// conversions between points and millimeters, assuming a 12 mm cornea
ED.LidMass.prototype.mm2pt = function (mm) {
    return Math.round(mm / 6 * 120);
};

ED.LidMass.prototype.pt2mm = function (pt) {
    return Math.round(pt * 6 / 120);
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LidMass.prototype.description = function () {
    let returnValue = "";
    returnValue += this.type + " Lid Lesion, ";
    switch (this.attachment) {
        case 'No attachment':
            returnValue += 'unattached.';
            break;
        case 'Top lid':
            returnValue += 'attached to top lid.';
            break;
        case 'Bottom lid':
            returnValue += 'attached to bottom lid.';
            break;
    }
    returnValue += ' Width: ' + this.massWidth + 'mm, height: ' + this.massHeight + 'mm.';
    if (this.lashesAbsent) {
        returnValue += ' Lashes absent. ';
    }
    if (this.surfaceBloodVessels) {
        returnValue += ' Surface blood vessels. ';
    }
    if (this.surroundingRedness) {
        returnValue += ' Surrounding redness. ';
    }

    return returnValue;
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.LidMass.prototype.snomedCode = function () {
    return 0;
};
