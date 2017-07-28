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
 * AC IOL Cross Section
 *
 * @class ACIOLCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ACIOLCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ACIOLCrossSection";
	
	// Saved parameters
	this.savedParameterArray = ['originX'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ACIOLCrossSection.prototype = new ED.Doodle;
ED.ACIOLCrossSection.prototype.constructor = ED.ACIOLCrossSection;
ED.ACIOLCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ACIOLCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.inFrontOfClassArray = ["HypopyonCrossSection", "HyphaemaCrossSection" ];
	this.addAtBack = true;
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-220, -100);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-140, +140);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.ACIOLCrossSection.prototype.setParameterDefaults = function() {
	this.originX = -140;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ACIOLCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ACIOLCrossSection.superclass.draw.call(this, _point);

	// Draw lens
	ctx.beginPath();
	ctx.ellipse(100, 0, 160, 20, 0.5 * Math.PI, 0, 2 * Math.PI);

	// Set line attributes
	ctx.lineWidth = 5;
	ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
	ctx.strokeStyle = "#898989";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		// Loops
		ctx.beginPath();
		ctx.arc(10 - this.originX, -310 - this.originY, 10, 0*Math.PI, 1*Math.PI, false);
		ctx.moveTo(5 - this.originX, -310 - this.originY);
		ctx.bezierCurveTo(80 - this.originX, -300 - this.originY, 70, -220, 100, -160);
		ctx.moveTo(40 - this.originX, 300 - this.originY);
		ctx.arc(10 - this.originX, 310 - this.originY, 10, 0, 1*Math.PI, true);
		ctx.moveTo(5 - this.originX, 310 - this.originY);
		ctx.bezierCurveTo(80 - this.originX, 300 - this.originY, 70, 220, 100, 160);
		ctx.strokeStyle = "#898989";
		ctx.stroke();

	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
