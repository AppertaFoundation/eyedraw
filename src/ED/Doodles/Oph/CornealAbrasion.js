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
 * Corneal abrasion
 *
 * @class CornealAbrasion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealAbrasion = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealAbrasion";

	// Private property
	this.isInVisualAxis = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealAbrasion.prototype = new ED.Doodle;
ED.CornealAbrasion.prototype.constructor = ED.CornealAbrasion;
ED.CornealAbrasion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealAbrasion.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealAbrasion.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);
}

/**
 * Sets default parameters
 */
ED.CornealAbrasion.prototype.setParameterDefaults = function() {
	this.scaleX = 1.5;
	this.scaleY = 1;
	this.setOriginWithDisplacements(0, 25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealAbrasion.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealAbrasion.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// CornealAbrasion
	var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);

	// Close path
	ctx.closePath();

	// Create fill
	var alpha = -this.apexY / 100;
	ctx.fillStyle = "rgba(0, 255, 0, 1)";

	// Semi -transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.CornealAbrasion.prototype.description = function() {
	var returnString = "";

	// Calculate size
	var averageScale = this.scaleX + this.scaleY;

	// Arbitrary cutoffs
	if (averageScale < 2) returnString = "Small ";
	else if (averageScale < 4) returnString = "Medium ";
	else returnString = "Large ";

	returnString += "corneal abrasion";

	return returnString;
}
