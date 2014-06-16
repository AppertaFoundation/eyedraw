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
 * Represents a range of numerical values
 *
 * @class Range
 * @property {Float} min Minimum value
 * @property {Float} max Maximum value
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range = function(_min, _max) {
	// Properties
	this.min = _min;
	this.max = _max;
}

/**
 * Set min and max with one function call
 *
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range.prototype.setMinAndMax = function(_min, _max) {
	// Set properties
	this.min = _min;
	this.max = _max;
}

/**
 * Returns true if the parameter is less than the minimum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is less than the minimum
 */
ED.Range.prototype.isBelow = function(_num) {
	if (_num < this.min) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns true if the parameter is more than the maximum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is more than the maximum
 */
ED.Range.prototype.isAbove = function(_num) {
	if (_num > this.max) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns true if the parameter is inclusively within the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includes = function(_num) {
	if (_num < this.min || _num > this.max) {
		return false;
	} else {
		return true;
	}
}

/**
 * Constrains a value to the limits of the range
 *
 * @param {Float} _num
 * @param {Float} _scaleLevel The drawing scale level.
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrain = function(_num, _scaleLevel) {

	_scaleLevel = _scaleLevel === undefined ? 1 : _scaleLevel

	var min = this.min * _scaleLevel;
	var max = this.max * _scaleLevel;

	if (_num < min) {
		return min;
	} else if (_num > max) {
		return max;
	} else {
		return _num;
	}
}

/**
 * Returns true if the parameter is within the 'clockface' range represented by the min and max values
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includesInAngularRange = function(_angle, _isDegrees) {
	// Arbitrary radius
	var r = 100;

	// Points representing vectos of angles within range
	var min = new ED.Point(0, 0);
	var max = new ED.Point(0, 0);
	var angle = new ED.Point(0, 0);

	// Set points using polar coordinates
	if (!_isDegrees) {
		min.setWithPolars(r, this.min);
		max.setWithPolars(r, this.max);
		angle.setWithPolars(r, _angle);
	} else {
		min.setWithPolars(r, this.min * Math.PI / 180);
		max.setWithPolars(r, this.max * Math.PI / 180);
		angle.setWithPolars(r, _angle * Math.PI / 180);
	}

	return (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max));
}

/**
 * Constrains a value to the limits of the angular range
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrainToAngularRange = function(_angle, _isDegrees) {
	// No point in constraining unless range is less than 360 degrees!
	if ((this.max - this.min) < (_isDegrees ? 360 : (2 * Math.PI))) {
		// Arbitrary radius
		var r = 100;

		// Points representing vectors of angles within range
		var min = new ED.Point(0, 0);
		var max = new ED.Point(0, 0);
		var angle = new ED.Point(0, 0);

		// Set points using polar coordinates
		if (!_isDegrees) {
			min.setWithPolars(r, this.min);
			max.setWithPolars(r, this.max);
			angle.setWithPolars(r, _angle);
		} else {
			min.setWithPolars(r, this.min * Math.PI / 180);
			max.setWithPolars(r, this.max * Math.PI / 180);
			angle.setWithPolars(r, _angle * Math.PI / 180);
		}

		// Return appropriate value depending on relationship to range
		if (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max)) {
			return _angle;
		} else {
			if (angle.clockwiseAngleTo(min) < max.clockwiseAngleTo(angle)) {
				return this.min;
			} else {
				return this.max;
			}
		}
	} else {
		return _angle;
	}
}