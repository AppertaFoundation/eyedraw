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
 * VitreousOpacity template with disc and arcades
 *
 * @class VitreousOpacity
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.VitreousOpacity = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "VitreousOpacity";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.VitreousOpacity.prototype = new ED.Doodle;
ED.VitreousOpacity.prototype.constructor = ED.VitreousOpacity;
ED.VitreousOpacity.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VitreousOpacity.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.VitreousOpacity.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isSqueezable = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters
 */
ED.VitreousOpacity.prototype.setParameterDefaults = function() {
	this.apexY = -100;
	this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VitreousOpacity.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.VitreousOpacity.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Boundary path
	ctx.beginPath();

	// Radius of opacity
	var ro = 200;

	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Opacity from apexY
	var opacity = 0.3 + 0.6 * (ro + 2 * this.apexY) / ro;
	ctx.fillStyle = "rgba(255, 0, 0," + opacity + ")";

	// Set attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle = "rgba(255, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	point = new ED.Drawing.Point(0, 0);
	point.setWithPolars(ro, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

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
ED.VitreousOpacity.prototype.description = function() {
	return "Vitreous haemorrhage";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.VitreousOpacity.prototype.snomedCode = function() {
	return 31341008;
}
