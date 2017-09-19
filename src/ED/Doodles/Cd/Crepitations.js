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
 * Crepitations
 *
 * @class Crepitations
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Crepitations = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Crepitations";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Crepitations.prototype = new ED.Doodle;
ED.Crepitations.prototype.constructor = ED.Crepitations;
ED.Crepitations.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Crepitations.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Crepitations.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+50, +200);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Crepitations.prototype.setParameterDefaults = function() {
	this.rotation = -Math.PI / 4;
	this.apexX = 50;
	this.apexY = 0;

	this.setOriginWithDisplacements(-150, 300);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Crepitations.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Crepitations.superclass.draw.call(this, _point);

	// Crepitation radius
	var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);

	// Boundary path
	ctx.beginPath();

	// Crepitation
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Start path
		ctx.beginPath();

		// Spacing of lines
		var d = 30;

		// Draw central line
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);

		// Draw other lines
		for (var s = -1; s < 2; s += 2) {
			for (var y = d; y < r; y += d) {
				var x = this.xForY(r, y);
				ctx.moveTo(-x, s * y);
				ctx.lineTo(x, s * y);
			}
		}

		// Set attributes
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(200, 200, 200, 0.75)";

		// Draw lines
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Crepitations.prototype.description = function() {
	var lung = this.originX > 0 ? " left lung" : " right lung";
	var lobe = this.originY > 0 ? " lower lobe of" : " upper lobe of";

	return 'crepitations' + lobe + lung;
}
