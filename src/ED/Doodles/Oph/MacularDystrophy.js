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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Blot Haemorrhage
 *
 * @class MacularDystrophy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MacularDystrophy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MacularDystrophy";

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MacularDystrophy.prototype = new ED.Doodle;
ED.MacularDystrophy.prototype.constructor = ED.MacularDystrophy;
ED.MacularDystrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularDystrophy.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.MacularDystrophy.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +100);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularDystrophy.prototype.setParameterDefaults = function() {
	this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularDystrophy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MacularDystrophy.superclass.draw.call(this, _point);

	// Radius
	var r = 150;

	// Boundary pathß
	ctx.beginPath();

	// Dystrophy
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(255,0,0,0)";
	ctx.fillStyle = "rgba(255,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		if (this.apexY < -50) {
			// Bull's eye maculopathy
			ctx.beginPath();
			ctx.moveTo(-200, 0);
			ctx.bezierCurveTo(-200, -70, -100, -140, 0, -140);
			ctx.bezierCurveTo(100, -140, 200, -70, 200, 0);
			ctx.bezierCurveTo(200, 70, 100, 140, 0, 140);
			ctx.bezierCurveTo(-100, 140, -200, 70, -200, 0);
			ctx.fillStyle = "rgba(223,80,20,1)";
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(-100, 0);
			ctx.bezierCurveTo(-100, -35, -50, -70, 0, -70);
			ctx.bezierCurveTo(50, -70, 100, -35, 100, 0);
			ctx.bezierCurveTo(100, 35, 50, 70, 0, 70);
			ctx.bezierCurveTo(-50, 70, -100, 35, -100, 0);
			ctx.fillStyle = "rgba(125,65,54,1)";
			ctx.fill();
		}
		else if (this.apexY < 0) {
			// Vitteliform
			ctx.beginPath();
			ctx.arc(0, 0, 100, 0, 2 * Math.PI, true);
			ctx.fillStyle = "yellow";
			ctx.strokeStyle = "brown";
			ctx.lineWidth = 20;
			ctx.fill();
			ctx.stroke();
		}
		else {
			// Atrophic
			ctx.beginPath();
			ctx.arc(0, 0, 120, 0, 2 * Math.PI, true);
			ctx.fillStyle = "rgba(255, 120, 120, 0.5)";
			ctx.strokeStyle = ctx.fillStyle;
			ctx.lineWidth = 1;
			ctx.fill();
		}
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.MacularDystrophy.prototype.groupDescription = function() {
	if (this.apexY < -50) {
		return "Bull's eye maculopathy";
	}
	else if (this.apexY < 0) {
		return "Vitelliform macular dystrophy";
	}
	else {
		return "Atrophic macular dystrophy";
	}
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.MacularDystrophy.prototype.snomedCode = function() {
	return 276436007;
}

