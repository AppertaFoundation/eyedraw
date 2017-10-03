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
 * Lungs
 *
 * @class Lungs
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Lungs = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Lungs";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Lungs.prototype = new ED.Doodle;
ED.Lungs.prototype.constructor = ED.Lungs;
ED.Lungs.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.Lungs.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lungs.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Lungs.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Right lung
	ctx.moveTo(-147, -281);
	ctx.bezierCurveTo(-224, -279, -414, 29, -426, 289);
	ctx.bezierCurveTo(-334, 226, -219, 196, -79, 236);
	ctx.bezierCurveTo(-6, 231, -71, -284, -147, -281);

	// Left Lung
	ctx.moveTo(147, -281);
	ctx.bezierCurveTo(224, -279, 414, 29, 426, 289);
	ctx.bezierCurveTo(334, 226, 219, 196, 79, 236);
	ctx.bezierCurveTo(6, 231, 71, -284, 147, -281);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Calculate arc (Arc property not used naturally in this doodle)
// 	this.leftExtremity = this.transform.transformPoint(new ED.Point(-40, -40));
// 	this.rightExtremity = this.transform.transformPoint(new ED.Point(40, -40));
// 	this.arc = this.calculateArc();

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Lungs.prototype.description = function() {
	return this.drawing.doodleArray.length == 1 ? "No abnormality" : "";
}
