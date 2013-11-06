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
 *	OperatingTable
 *
 * @class  OperatingTable
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.OperatingTable = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "OperatingTable";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.OperatingTable.prototype = new ED.Doodle;
ED.OperatingTable.prototype.constructor = ED.OperatingTable;
ED.OperatingTable.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.OperatingTable.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OperatingTable.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.OperatingTable.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Head
	ctx.arc(0, -0, 60, 0, Math.PI * 2, true);

	// Set Attributes
	ctx.lineWidth = 30;
	ctx.strokeStyle = "rgba(120,120,120,1)";
	ctx.fillStyle = "rgba(220,220,220,1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Bed
		ctx.rect(-100, 20, 200, 400);

		// Set Attributes
		ctx.lineWidth = 8;
		ctx.strokeStyle = "rgba(120,120,120,1)";
		ctx.fillStyle = "rgba(220,220,220,1)";

		ctx.fill();
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}