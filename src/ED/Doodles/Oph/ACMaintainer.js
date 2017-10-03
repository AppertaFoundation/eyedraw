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
 * Chandelier (single)
 *
 * @class ACMaintainer
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ACMaintainer = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ACMaintainer";

	// Private parameters
	this.limbus = -400;

	// Saved parameters
	this.savedParameterArray = ['rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ACMaintainer.prototype = new ED.Doodle;
ED.ACMaintainer.prototype.constructor = ED.ACMaintainer;
ED.ACMaintainer.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ACMaintainer.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ACMaintainer.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(180, 90);
	
	// Position over SidePort if present
	var doodle = this.drawing.lastDoodleOfClass("SidePort");
	if (doodle) {
		this.rotation = doodle.rotation;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ACMaintainer.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ACMaintainer.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Port
	ctx.rect(-60, this.limbus - 60, 120, 160);

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	ctx.fillStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Trocar
		ctx.beginPath();
		ctx.moveTo(-20, this.limbus + 60);
		ctx.lineTo(+20, this.limbus + 60);
		ctx.lineTo(+20, this.limbus + 160);
		ctx.lineTo(-20, this.limbus + 200);
		ctx.lineTo(-20, this.limbus + 60);
		ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
		ctx.fill();

		// Body
		ctx.beginPath();
		ctx.rect(-30, this.limbus, 60, 80);
		ctx.fillStyle = "rgba(120, 120, 120, 0.75)";
		ctx.fill();

		// Fibre optic
		ctx.beginPath();
		ctx.moveTo(0, this.limbus);
		ctx.bezierCurveTo(0, this.limbus - 50, 50, this.limbus - 100, 100, this.limbus - 100);
		ctx.lineWidth = 40;
		ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ACMaintainer.prototype.groupDescription = function() {
	return "Chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ACMaintainer.prototype.description = function() {
	// Location (clockhours)
	return this.clockHour() + " o'clock";
}
