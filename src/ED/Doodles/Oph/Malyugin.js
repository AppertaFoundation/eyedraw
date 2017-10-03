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
 * Macular hole
 *
 * @class Malyugin
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Malyugin = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Malyugin";

	// Saved parameters
	this.savedParameterArray = ['scaleX', 'scaleY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Malyugin.prototype = new ED.Doodle;
ED.Malyugin.prototype.constructor = ED.Malyugin;
ED.Malyugin.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Malyugin.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.Malyugin.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = true;
	this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.Malyugin.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(25, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Malyugin.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Malyugin.superclass.draw.call(this, _point);

	// If iris there, take account of pupil size
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) length = -doodle.apexY;

	// Half side length and radius of ring
	var l = 300;
	var r = 40;


	// Fudge factors to make ring look close to pupil margin
	var j1 = Math.PI/6;
	var j2 = Math.PI/12;

	// If iris there, take account of pupil size
	var doodle = this.drawing.lastDoodleOfClass("AntSeg");
	if (doodle) {
		var pr = -doodle.apexY;
		//l = pr - r/2;
		l = pr;
	}

	// Boundary path
	ctx.beginPath();

	// Ring (for icon)
	/*
	ctx.moveTo(-l + r,-l);
	ctx.lineTo(l - r, -l);
	ctx.arc(l - r, -l + r, r, -Math.PI/2, Math.PI * 1.5, false);
	ctx.moveTo(l, -l + r);
	ctx.lineTo(l, l - r);
	ctx.arc(l - r, l - r, r, 0, Math.PI * 2, false);
	ctx.moveTo(l - r, l);
	ctx.lineTo(-l + r, l);
	ctx.arc(-l + r, l - r, r, Math.PI/2, Math.PI * 2.5, false);
	ctx.moveTo(-l, l - r);
	ctx.lineTo(-l, -l + r);
	ctx.arc(-l + r, -l + r, r, Math.PI, Math.PI * 3, false);
	*/

	var p = new ED.Point(l, 0);
	var a = Math.PI/4;
	var b = Math.PI/4;

	ctx.moveTo(p.x, p.y);
	p.setWithPolars(l, a);
 	ctx.arc(p.x, p.y, r, 0 - b + j1, 0 - 3 * b - j2, true);

 	p.setCoordinates(0, -l);
 	ctx.moveTo(p.x, p.y);
 	a = a - Math.PI/2;
 	p.setWithPolars(l, a);
	ctx.arc(p.x, p.y, r, 0 - 3 * b + j1, 0 - 5 * b - j2, true);

	p.setCoordinates(-l, 0);
 	ctx.moveTo(p.x, p.y);
 	a = a - Math.PI/2;
 	p.setWithPolars(l, a);
	ctx.arc(p.x, p.y, r, 0 - 5 * b + j1, 0 - 7 * b - j2, true);

	p.setCoordinates(0, l);
 	ctx.moveTo(p.x, p.y);
 	a = a - Math.PI/2;
 	p.setWithPolars(l, a);
	ctx.arc(p.x, p.y, r, 0 - 7 * b + j1, 0 - 9 * b - j2, true);

	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	point = new ED.Point(l, 0);
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
ED.Malyugin.prototype.description = function() {
	return "Malyugin ring";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Malyugin.prototype.snomedCode = function() {
	//return 232006002;
}

