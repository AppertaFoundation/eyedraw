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
 * Cornea Cross Section ***TODO***
 *
 * @class CorneaCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CorneaCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CorneaCrossSection";

	// Saved parameters
	//this.savedParameterArray = ['apexY', 'apexX'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CorneaCrossSection.prototype = new ED.Doodle;
ED.CorneaCrossSection.prototype.constructor = ED.CorneaCrossSection;
ED.CorneaCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CorneaCrossSection.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorneaCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorneaCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CorneaCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Top cut away
	ctx.moveTo(60, -480);
	ctx.lineTo(-80, -480);

	// Front of cornea
	ctx.bezierCurveTo(-100, -440, -100, -440, -120, -380);
	ctx.bezierCurveTo(-240, -260, -320, -160, -320, 0);
	ctx.bezierCurveTo(-320, 160, -240, 260, -120, 380);
	ctx.bezierCurveTo(-100, 440, -100, 440, -80, 480);

	// Bottom cut away
	ctx.lineTo(60, 480);
	ctx.lineTo(0, 380);

	// Back of cornea
	ctx.bezierCurveTo(-80, 260, -220, 180, -220, 0);
	ctx.bezierCurveTo(-220, -180, -80, -260, 0, -380);

	// Close path
	ctx.closePath();

	// Set path attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245, 245, 245, 0.5)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Top sclera
		ctx.beginPath();
		ctx.moveTo(56, -478);
		ctx.lineTo(-78, -478);
		ctx.bezierCurveTo(-98, -440, -96, -440, -118, -378);
		ctx.lineTo(-4, -378);
		ctx.lineTo(56, -478);

		// Bottom scleral
		ctx.moveTo(56, 478);
		ctx.lineTo(-78, 478);
		ctx.bezierCurveTo(-98, 440, -96, 440, -118, 378);
		ctx.lineTo(-4, 378);
		ctx.closePath();

		ctx.fillStyle = "rgba(255,255,185,1)";
		ctx.fill();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
