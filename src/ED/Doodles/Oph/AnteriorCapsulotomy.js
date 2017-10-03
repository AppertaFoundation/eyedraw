/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

/**
 * Anterior capsulotomy ***TODO***
 *
 * @class AnteriorCapsulotomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AnteriorCapsulotomy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AnteriorCapsulotomy";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AnteriorCapsulotomy.prototype = new ED.Doodle;
ED.AnteriorCapsulotomy.prototype.constructor = ED.AnteriorCapsulotomy;
ED.AnteriorCapsulotomy.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.AnteriorCapsulotomy.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AnteriorCapsulotomy.prototype.setParameterDefaults = function() {}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AnteriorCapsulotomy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AnteriorCapsulotomy.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var ro = 240;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Move to inner circle
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var ri = ro - 60;

		// Edge of nucleus
		ctx.beginPath();
		ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
		ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
