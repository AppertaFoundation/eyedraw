/**
 * (C) OpenEyes Foundation, 2019
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.openeyes.org.uk
 *
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (C) 2019, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

var MathHelper = MathHelper || {};

MathHelper.calculateLinearFunctionFromPoints = function (x1, y1, x2, y2, x) {

    var a = (y2 - y1) / (x2 - x1);
    var b = y2 - a * x2;
    return a * x + b;
};

MathHelper.perpendicularToLine = function (x1, y1, x2, y2, x3, y3, dist) {
    let a = y1 - y2;
    let b = x2 - x1;
    let norm = Math.sqrt(a * a + b * b);
    a = a / norm;
    b = b / norm;
    let x4 = x3 + a * dist;
    let y4 = y3 + b * dist;
    return { x: x4, y: y4 };
};

// point of a cubic bezier curve at t
MathHelper.calculateBezierPoints = function (t, startPoint, endPoint, controlPoint1, controlPoint2) {
    let B0_t = Math.pow(1 - t, 3);
    let B1_t = 3 * t * Math.pow((1 - t), 2);
    let B2_t = 3 * Math.pow(t, 2) * (1 - t);
    let B3_t = Math.pow(t, 3);
    let x = (B0_t * startPoint.x) + (B1_t * controlPoint1.x) + (B2_t * controlPoint2.x) + (B3_t * endPoint.x);
    let y = (B0_t * startPoint.y) + (B1_t * controlPoint1.y) + (B2_t * controlPoint2.y) + (B3_t * endPoint.y);
    return { x: x, y: y };
};

// subsegment of a cubic bezier curve between t0 and t1
MathHelper.bezierSegment = function (t0, t1, startPoint, endPoint, controlPoint1, controlPoint2) {
    let newStartPoint = {};
    let newEndPoint = {};
    let newControlPoint1 = {};
    let newControlPoint2 = {};
    let u0 = 1 - t0;
    let u1 = 1 - t1;
    //  Q1 = u0u0u0 P1 + (t0u0u0 + u0t0u0 + u0u0t0) P2 + (t0t0u0 + u0t0t0 + t0u0t0) P3 + t0t0t0 P4
    newStartPoint.x = startPoint.x * u0 * u0 * u0 + controlPoint1.x * (t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0) + controlPoint2.x * (t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0) + endPoint.x * t0 * t0 * t0;
    newStartPoint.y = startPoint.y * u0 * u0 * u0 + controlPoint1.y * (t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0) + controlPoint2.y * (t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0) + endPoint.y * t0 * t0 * t0;
    // Q2 = u0u0u1 P1 + (t0u0u1 + u0t0u1 + u0u0t1) P2 + (t0t0u1 + u0t0t1 + t0u0t1) P3 + t0t0t1 P4
    newControlPoint1.x = startPoint.x * u0 * u0 * u1 + controlPoint1.x * (t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1) + controlPoint2.x * (t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1) + endPoint.x * t0 * t0 * t1;
    newControlPoint1.y = startPoint.y * u0 * u0 * u1 + controlPoint1.y * (t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1) + controlPoint2.y * (t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1) + endPoint.y * t0 * t0 * t1;
    //  Q3 = u0u1u1 P1 +                                           (t0u1u1 + u0t1u1 + u0u1t1) P2 +                     (t0t1u1 + u0t1t1 + t0u1t1) P3 +             t0t1t1 P4
    newControlPoint2.x = startPoint.x * u0 * u1 * u1 + controlPoint1.x * (t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1) + controlPoint2.x * (t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1) + endPoint.x * t0 * t1 * t1;
    newControlPoint2.y = startPoint.y * u0 * u1 * u1 + controlPoint1.y * (t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1) + controlPoint2.y * (t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1) + endPoint.y * t0 * t1 * t1;
    //  Q4 =                       u1u1u1 P1 +                 (t1u1u1 + u1t1u1 + u1u1t1) P2 +                 (t1t1u1 + u1t1t1 + t1u1t1) P3 +              t1t1t1 P4
    newEndPoint.x = startPoint.x * u1 * u1 * u1 + controlPoint1.x * (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) + controlPoint2.x * (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) + endPoint.x * t1 * t1 * t1;
    newEndPoint.y = startPoint.y * u1 * u1 * u1 + controlPoint1.y * (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) + controlPoint2.y * (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) + endPoint.y * t1 * t1 * t1;

    return { startPoint: newStartPoint, endPoint: newEndPoint, controlPoint1: newControlPoint1, controlPoint2: newControlPoint2 };
};

// helper to find t given x (stone age solution for LidMass doodle)
MathHelper.bezierTgivenX = function (startPoint, endPoint, controlPoint1, controlPoint2, x, isReverse) {
    if (isReverse) {
        for (let t = 1; t >= 0; t -= 0.01) {
            let p = MathHelper.calculateBezierPoints(t, startPoint, endPoint, controlPoint1, controlPoint2);
            if (p.x < x) {
                return t;
            }
        }
    }
    else {
        for (let t = 0; t <= 1; t += 0.01) {
            let p = MathHelper.calculateBezierPoints(t, startPoint, endPoint, controlPoint1, controlPoint2);
            if (p.x > x) {
                return t;
            }
        }
    }
    return isReverse ? 0 : 1;
};
