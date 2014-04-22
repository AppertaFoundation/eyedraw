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
 * A colour in the RGB space;
 * Usage: var c = new ED.Drawing.Colour(0, 0, 255, 0.75); ctx.fillStyle = c.rgba();
 *
 * @property {Int} red The red value as an integer from 0 to 255
 * @property {Int} green The green value as an integer from 0 to 255
 * @property {Int} blue The blue value as an integer from 0 to 255
 * @property {Float} alpha The alpha value as a float from 0 to 1
 * @param {Int} _red
 * @param {Int} _green
 * @param {Int} _blue
 * @param {Float} _alpha
 */
ED.Drawing.Colour = function(_red, _green, _blue, _alpha) {
	this.red = _red;
	this.green = _green;
	this.blue = _blue;
	this.alpha = _alpha;
}

/**
 * Sets the colour from a hex encoded string
 *
 * @param {String} Colour in hex format (eg 'E0AB4F')
 */
ED.Drawing.Colour.prototype.setWithHexString = function(_hexString) {
	// ***TODO*** add some string reality checks here
	this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)), 16);
	this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)), 16);
	this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)), 16);
	if (_hexString.length > 6) {
		this.alpha = parseInt((_hexString.charAt(6) + _hexString.charAt(7)), 16);
	}
}

/**
 * Outputs the colour as a hex string
 *
 * @returns {String} Colour in hex format (eg 'E0AB4F')
 */
ED.Drawing.Colour.prototype.hexString = function() {
	var hexString = "";

	// temporary while awaiting internet! Works for red and green only
	if (this.red > 0) return "FF0000FF";
	else return "00FF00FF";

	// ***TODO*** add some string reality checks here
// 	this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)), 16);
// 	this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)), 16);
// 	this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)), 16);
// 	if (_hexString.length > 6) {
// 		this.alpha = parseInt((_hexString.charAt(6) + _hexString.charAt(7)), 16);
// 	}
}

/**
 * Returns a colour in Javascript rgba format
 *
 * @returns {String} Colour in rgba format
 */
ED.Drawing.Colour.prototype.rgba = function() {
	return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
}

/**
 * Returns a colour in JSON format
 *
 * @returns {String} A JSON encoded string representing the colour
 */
ED.Drawing.Colour.prototype.json = function() {
	return "{\"red\":" + this.red + ",\"green\":" + this.green + ",\"blue\":" + this.blue + ",\"alpha\":" + this.alpha + "}";
}
