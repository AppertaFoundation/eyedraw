/**
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2014
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Represents a point in two dimensional space
 * @class Point
 * @property {Int} x The x-coordinate of the point
 * @property {Int} y The y-coordinate of the point
 * @property {Array} components Array representing point in matrix notation
 * @param {Float} _x
 * @param {Float} _y
 */
ED.Point = function(_x, _y) {
	// Properties
	this.x = Math.round(+_x);
	this.y = Math.round(+_y);
	this.components = [this.x, this.y, 1];
}

/**
 * Sets properties of the point using polar coordinates
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _p Angle in radians from North going clockwise
 */
ED.Point.prototype.setWithPolars = function(_r, _p) {
	this.x = Math.round(_r * Math.sin(_p));
	this.y = Math.round(-_r * Math.cos(_p));
}

/**
 * Sets x and y of the point
 *
 * @param {Float} _x value of x
 * @param {Float} _y value of y
 */
ED.Point.prototype.setCoordinates = function(_x, _y) {
	this.x = _x;
	this.y = _y;
}

/**
 * Calculates the distance between this point and another
 *
 * @param {Point} _point
 * @returns {Float} Distance from the passed point
 */
ED.Point.prototype.distanceTo = function(_point) {
	return Math.sqrt(Math.pow(this.x - _point.x, 2) + Math.pow(this.y - _point.y, 2));
}

/**
 * Calculates the dot product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The dot product
 */
ED.Point.prototype.dotProduct = function(_point) {
	return this.x * _point.x + this.y * _point.y;
}

/**
 * Calculates the cross product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The cross product
 */
ED.Point.prototype.crossProduct = function(_point) {
	return this.x * _point.y - this.y * _point.x;
}

/**
 * Calculates the length of the point treated as a vector
 *
 * @returns {Float} The length
 */
ED.Point.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * Calculates the direction of the point treated as a vector
 *
 * @returns {Float} The angle from zero (north) going clockwise
 */
ED.Point.prototype.direction = function() {
	var north = new ED.Point(0, -100);

	return north.clockwiseAngleTo(this);
}

/**
 * Inner angle to other vector from same origin going round clockwise from vector a to vector b
 *
 * @param {Point} _point
 * @returns {Float} The angle in radians
 */
ED.Point.prototype.clockwiseAngleTo = function(_point) {
	var angle = Math.acos(this.dotProduct(_point) / (this.length() * _point.length()));
	if (this.crossProduct(_point) < 0) {
		return 2 * Math.PI - angle;
	} else {
		return angle;
	}
}

/**
 * Creates a new point at an angle
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.pointAtRadiusAndClockwiseAngle = function(_r, _phi) {
	// Calculate direction (clockwise from north)
	var angle = this.direction();

	// Create point and set length and direction
	var point = new ED.Point(0, 0);
	point.setWithPolars(_r, angle + _phi);

	return point;
}

/**
 * Creates a new point at an angle to and half way along a straight line between this point and another
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @param {Float} _point Point at other end of straight line
 * @returns {Point} A point object
 */
ED.Point.prototype.pointAtAngleToLineToPointAtProportion = function(_phi, _point, _prop) {
	// Midpoint in coordinates as if current point is origin
	var bp = new ED.Point((_point.x - this.x) * _prop, (_point.y - this.y) * _prop);

	// Calculate radius
	r = bp.length();

	// Create new point
	var point = bp.pointAtRadiusAndClockwiseAngle(r, _phi);

	// Shift origin back
	point.x += this.x;
	point.y += this.y;

	return point;
}


/**
 * Clock hour of point on clock face centred on origin
 *
 * @returns {Int} The clock hour
 */
ED.Point.prototype.clockHour = function(_point) {
	var twelvePoint = new ED.Point(0, -100);
	var clockHour = ((twelvePoint.clockwiseAngleTo(this) * 6 / Math.PI) + 12) % 12;

	clockHour = clockHour.toFixed(0);
	if (clockHour == 0) clockHour = 12;

	return clockHour;
}

/**
 * Creates a control point on a tangent to the radius of the point at an angle of phi from the radius
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.tangentialControlPoint = function(_phi) {
	// Calculate length of line from origin to point and direction (clockwise from north)
	var r = this.length();
	var angle = this.direction();

	// Calculate length of control point
	var h = r / Math.cos(_phi);

	// Create point and set length and direction
	var point = new ED.Point(0, 0);
	point.setWithPolars(h, angle + _phi);

	return point;
}

/**
 * Creates a new point on a straight line between two points at a proportional distance 
 *
 * @param {Float} _percent Percentage distance along line
 * @param {Point} _ep End point
 * @returns {Point} _point Point
 */
ED.Point.prototype.pointAtPercentageFromPointToPoint = function(_percent, _point) {
	// Calculate distances (clockwise from north)
	var xIncrement = (_point.x - this.x) * _percent/100;
	var yIncrement = (_point.y - this.y) * _percent/100;

	// Create point and set length and direction
	var point = new ED.Point(this.x + xIncrement, this.y + yIncrement);

	return point;
}

/**
 * Returns a point in JSON encoding
 *
 * @returns {String} point in JSON format
 */
ED.Point.prototype.json = function() {
	return "{\"x\":" + this.x.toFixed(2) + ",\"y\":" + this.y.toFixed(2) + "}";
}