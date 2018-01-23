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
 * Hard Drusen
 *
 * @class Telangiectasis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Telangiectasis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Telangiectasis";

	// Saved parameters
	this.savedParameterArray = ['originX', 'apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Telangiectasis.prototype = new ED.Doodle;
ED.Telangiectasis.prototype.constructor = ED.Telangiectasis;
ED.Telangiectasis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Telangiectasis.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Telangiectasis.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-100, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Telangiectasis.prototype.setParameterDefaults = function() {
	this.originX = this.drawing.eye == ED.eye.Right ? -160 : 160;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Telangiectasis.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Telangiectasis.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 100;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Telangiectasis
		var fill = "red";

		var dr = 10 / this.scaleX;

		var p = new ED.Point(0, 0);
		var n = 10;
		for (var i = 0; i < n; i++) {
			p.setWithPolars(r * 0.8 * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
			this.drawSpot(ctx, p.x, p.y, dr, fill);
		}

		// Ring of Exudate
		if (this.apexY < - 50) {
			fill = "yellow";
			n = 18;
			for (var i = 0; i < n; i++) {
				p.setWithPolars(r, 2 * Math.PI * i/n);
				this.drawSpot(ctx, p.x, p.y, dr, fill);
			}
		}

		// Pigmentation
		fill = "brown";
		n = Math.abs(Math.floor(this.apexX / 10));
		for (var i = 0; i < n; i++) {
			p.setWithPolars(r * 0.8 * ED.randomArray[i + 10], 2 * Math.PI * ED.randomArray[i + 100]);
			this.drawSpot(ctx, p.x, p.y, dr * 2, fill);
		}
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
ED.Telangiectasis.prototype.description = function() {
	return "Parafoveal telangiectasia";
}
