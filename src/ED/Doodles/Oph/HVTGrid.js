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
 * HVTGrid
 *
 * @class HVTGrid ***TODO***
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.HVTGrid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "HVTGrid";

	// Call super-class constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.HVTGrid.prototype = new ED.Doodle;
ED.HVTGrid.prototype.constructor = ED.HVTGrid;
ED.HVTGrid.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.HVTGrid.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isShowHighlight = false;
	this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVTGrid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.HVTGrid.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of HVT doodle
	var ro = 125;
	var d = ro * 2;
	ctx.moveTo(-2 * d, 0);
	ctx.lineTo(+2 * d, 0);
	ctx.moveTo(-d, -d);
	ctx.lineTo(-d, +d);
	ctx.moveTo(+d, -d);
	ctx.lineTo(+d, +d);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}
