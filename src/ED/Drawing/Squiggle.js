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
 * Squiggles are free-hand lines drawn by the mouse;
 * Points are stored in an array and represent points in the doodle plane
 *
 * @class Squiggle
 * @property {Doodle} doodle The doodle to which this squiggle belongs
 * @property {Colour} colour Colour of the squiggle
 * @property {Int} thickness Thickness of the squiggle in pixels
 * @property {Bool} filled True if squiggle is solid (filled)
 * @property {Array} pointsArray Array of points making up the squiggle
 * @property {Bool} complete True if the squiggle is complete (allows a filled squiggle to appear as a line while being created)
 * @param {Doodle} _doodle
 * @param {Colour} _colour
 * @param {Int} _thickness
 * @param {Bool} _filled
 */
ED.Squiggle = function(_doodle, _colour, _thickness, _filled) {
	this.doodle = _doodle;
	this.colour = _colour;
	this.thickness = _thickness;
	this.filled = _filled;

	this.pointsArray = new Array();
	this.complete = false;
}

/**
 * Adds a point to the points array
 *
 * @param {Point} _point
 */
ED.Squiggle.prototype.addPoint = function(_point) {
	this.pointsArray.push(_point);
}

/**
 * Returns a squiggle in JSON format
 *
 * @returns {String} A JSON encoded string representing the squiggle
 */
ED.Squiggle.prototype.json = function() {
	var s = '{';
	s = s + '"colour":' + this.colour.json() + ',';
	s = s + '"thickness": ' + this.thickness + ',';
	s = s + '"filled": "' + this.filled + '",';

	s = s + '"pointsArray":[';
	for (var i = 0; i < this.pointsArray.length; i++) {
		s = s + this.pointsArray[i].json();
		if (this.pointsArray.length - i > 1) {
			s = s + ',';
		}
	}
	s = s + ']';
	s = s + '}';

	return s;
}