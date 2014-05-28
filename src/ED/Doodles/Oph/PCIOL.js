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
 * Posterior chamber IOL
 *
 * @class PCIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PCIOL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PCIOL";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// Invariate parameters
	this.scaleX = 0.75;
	this.scaleY = 0.75;
}

/**
 * Sets superclass and constructor
 */
ED.PCIOL.prototype = new ED.Doodle;
ED.PCIOL.prototype.constructor = ED.PCIOL;
ED.PCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PCIOL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.PCIOL.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isScaleable = false;
	this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PCIOL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PCIOL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius of IOL optic
	var r = 240;

	// Draw optic
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);

	// Draw upper haptic
	ctx.moveTo(150, -190);
	ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
	ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
	ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
	ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
	ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);

	// Draw lower haptic
	ctx.moveTo(-150, 190);
	ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
	ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
	ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
	ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
	ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
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
ED.PCIOL.prototype.description = function() {
	var returnValue = "Posterior chamber IOL";

	// Displacement limit
	var limit = 40;

	var displacementValue = "";

	if (this.originY < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " superiorly";
	}
	if (this.originY > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " inferiorly";
	}
	if (this.originX < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " temporally" : " nasally";
	}
	if (this.originX > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " nasally" : " temporally";
	}

	// Add displacement description
	if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;

	return returnValue;
}
