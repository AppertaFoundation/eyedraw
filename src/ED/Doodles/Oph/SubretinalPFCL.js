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
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Subretinal heavy liquid
 *
 * @class SubretinalPFCL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SubretinalPFCL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SubretinalPFCL";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'originX', 'originY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// Invariate parameters
	this.rotation = Math.PI / 4;
}

/**
 * Sets superclass and constructor
 */
ED.SubretinalPFCL.prototype = new ED.Doodle;
ED.SubretinalPFCL.prototype.constructor = ED.SubretinalPFCL;
ED.SubretinalPFCL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SubretinalPFCL.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.SubretinalPFCL.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -20);
}

/**
 * Sets default parameters
 */
ED.SubretinalPFCL.prototype.setParameterDefaults = function() {
	this.apexY = -40;

	// Displacement from fovea, and from last doodle
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var p = new ED.Point(doodle.originX, doodle.originY);

		var np = new ED.Point(0, 0);
		np.setWithPolars(p.length(), p.direction() + Math.PI / 6);

		this.move(np.x, np.y);
	} else {
		this.move((this.drawing.eye == ED.eye.Right ? -1 : 1) * 200, 0);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SubretinalPFCL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SubretinalPFCL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius
	var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);

	// Circular bleb
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set line attributes
	ctx.lineWidth = 1;

	var d = r / 1.1412135
	var lingrad = ctx.createLinearGradient(-d, -d, d, d);
	lingrad.addColorStop(0, 'rgba(255,255,255,1)');
	lingrad.addColorStop(0.7, 'rgba(200,200,200,1)');
	lingrad.addColorStop(1, 'rgba(140,140,140,1)');

	ctx.fillStyle = lingrad
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

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
ED.SubretinalPFCL.prototype.groupDescription = function() {
	return "Subretinal PFCL";
}
