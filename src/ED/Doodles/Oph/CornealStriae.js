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
 * Corneal Striae
 *
 * @class CornealStriae
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealStriae = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealStriae";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealStriae.prototype = new ED.Doodle;
ED.CornealStriae.prototype.constructor = ED.CornealStriae;
ED.CornealStriae.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealStriae.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealStriae.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealStriae.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// CornealStriae
	var r = 300;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);

	// Close path
	ctx.closePath();

	// Create fill
	ctx.fillStyle = "rgba(100,100,100,0)";
	ctx.strokeStyle = "rgba(100,100,100,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var st = -300;
		var d = 50;
		var w = 30;
		var s = 80;
		var x = -2 * s;

		ctx.beginPath();

		for (var i = 0; i < 5; i++) {
			ctx.moveTo(x + s * i, st);
			ctx.bezierCurveTo(x + s * i - w, st + 1 * d, x + s * i - w, st + 2 * d, x + s * i, st + 3 * d);
			ctx.bezierCurveTo(x + s * i + w, st + 4 * d, x + s * i + w, st + 5 * d, x + s * i, st + 6 * d);
			ctx.bezierCurveTo(x + s * i - w, st + 7 * d, x + s * i - w, st + 8 * d, x + s * i, st + 9 * d);
			ctx.bezierCurveTo(x + s * i + w, st + 10 * d, x + s * i + w, st + 11 * d, x + s * i, st + 12 * d);
		}

		ctx.lineWidth = 20;
		ctx.strokeStyle = "rgba(100,100,100,0.6)";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	//     this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	// 	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealStriae.prototype.description = function() {
	return "Striate keratopathy";
}
