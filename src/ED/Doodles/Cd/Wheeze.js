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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Wheeze
 *
 * @class Wheeze
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Wheeze = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Wheeze";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Wheeze.prototype = new ED.Doodle;
ED.Wheeze.prototype.constructor = ED.Wheeze;
ED.Wheeze.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Wheeze.prototype.setParameterDefaults = function() {
	this.scaleX = 0.6;
	this.scaleY = 0.6;
	
	this.setOriginWithDisplacements(-200, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Wheeze.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Wheeze.superclass.draw.call(this, _point);

	// Exudate radius
	var r = 100;

	// Boundary path
	ctx.beginPath();

	// Boundary
	ctx.arc(0, -50, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.fillStyle = "gray";
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 8;

		ctx.beginPath();
		ctx.arc(-50, 0, 20, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(-34, 0);
		ctx.lineTo(-34, -100);
		ctx.lineTo(66, -150);
		ctx.lineTo(66, -50);

		ctx.stroke();

		ctx.beginPath();
		ctx.arc(50, -50, 20, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.closePath();
		ctx.fillStyle = "gray";
		ctx.fill();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Wheeze.prototype.description = function() {
	var lung = this.originX > 0 ? " left lung" : " right lung";
	var lobe = this.originY > 0 ? " lower lobe of" : " upper lobe of";

	return 'wheeze' + lobe + lung;
}