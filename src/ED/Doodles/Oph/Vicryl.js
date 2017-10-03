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
 * Vicryl suture
 *
 * @class Vicryl
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Vicryl = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Vicryl";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Vicryl.prototype = new ED.Doodle;
ED.Vicryl.prototype.constructor = ED.Vicryl;
ED.Vicryl.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Vicryl.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Vicryl.prototype.setParameterDefaults = function() {
	this.originY = -240;

	// Tubes are usually STQ
	if (this.drawing.eye == ED.eye.Right) {
		this.originX = -240;
		this.rotation = -Math.PI / 4;
	} else {
		this.originX = 240;
		this.rotation = Math.PI / 4;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Vicryl.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Vicryl.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Use arcTo to create an ellipsoid
	ctx.moveTo(-20, 0);
	ctx.arcTo(0, -20, 20, 0, 30);
	ctx.arcTo(0, 20, -20, 0, 30);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "purple";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Ends of suture
		ctx.beginPath();
		ctx.moveTo(35, -10);
		ctx.lineTo(20, 0);
		ctx.lineTo(35, 10);
		ctx.stroke();

		// Knot
		this.drawSpot(ctx, 20, 0, 4, "purple");
	}

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
ED.Vicryl.prototype.description = function() {
	return "Vicryl suture";
}
