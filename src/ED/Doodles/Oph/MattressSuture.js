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
 * MattressSuture
 *
 * @class MattressSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MattressSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MattressSuture";

	// Saved parameters
	this.savedParameterArray = ['radius', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MattressSuture.prototype = new ED.Doodle;
ED.MattressSuture.prototype.constructor = ED.MattressSuture;
ED.MattressSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.MattressSuture.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.MattressSuture.prototype.setParameterDefaults = function() {
	this.radius = 374;
	this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MattressSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MattressSuture.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	var r = this.radius;
	ctx.rect(-40, -(r + 40), 80, 80);

	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(255,255,255,0.0)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.moveTo(-40, -(r + 40));
		ctx.lineTo(40, -(r + 40));
		ctx.lineTo(-40, -(r - 40));
		ctx.lineTo(40, -(r - 40));
		ctx.lineTo(-40, -(r + 40));

		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgba(0,0,120,0.7)";
		ctx.closePath();

		ctx.stroke();
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
ED.MattressSuture.prototype.description = function() {
	var returnString = "Mattress suture at ";

	returnString += this.clockHour() + " o'clock";

	return returnString;
}
