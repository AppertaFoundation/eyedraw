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
 * Hyphaema
 *
 * @class Hyphaema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Hyphaema = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Hyphaema";

	// Private parameters
	this.ro = 380;
	this.minimum = 304;
	this.csOriginY = 0;
    this.csOriginX = 50;
	this.csApexX = 0;

    // Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'csOriginY', 'csApexX', 'csOriginX'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.Hyphaema.prototype = new ED.Doodle;
ED.Hyphaema.prototype.constructor = ED.Hyphaema;
ED.Hyphaema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Hyphaema.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default dragging attributes
 */
ED.Hyphaema.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-470, -370);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, this.minimum);
};

/**
 * Sets default parameters
 */
ED.Hyphaema.prototype.setParameterDefaults = function() {
	this.apexY = 152;
	this.apexX = -420;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Hyphaema.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Hyphaema.superclass.draw.call(this, _point);

	// Calculate angle of apex above or below horizontal
	var phi = Math.asin(this.apexY / this.ro);

	this.drawDashedLine(ctx, Math.PI - phi);

	// Boundary path
	ctx.beginPath();

	// Arc from point on circumference level with apex point to other side
	ctx.arc(0, 0, this.ro, phi, Math.PI - phi, false);

	// Close path
	ctx.closePath();

	// Colour of fill, density depends on setting of apexX
	var density = (0.1 + (this.apexX + 50 + 420) / 111).toFixed(2);
	ctx.fillStyle = "rgba(255,0,0," + density + ")";

	// Set line attributes
	ctx.lineWidth = 1;

	// Colour of outer line
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
};

ED.Hyphaema.prototype.drawDashedLine = function(ctx, phi) {

	if (!this.isSelected || this.isForDrawing) {
		return;
	}
	ctx.save();
	ctx.beginPath();

	// Colour of fill
	ctx.fillStyle = "red";

	// Set line attributes
	ctx.lineWidth = 1;

	// Colour of outer line
	ctx.strokeStyle = ctx.fillStyle;

	const point = new ED.Point(0, 0);
	point.setWithPolars(this.ro, phi + (Math.PI/2));

	ctx.setLineDash([20,5]);
	ctx.lineWidth = 5;

	ctx.moveTo(point.x,point.y);
	ctx.lineTo(this.apexX, this.apexY);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Hyphaema.prototype.description = function() {
	var percent = 10 * Math.round(10 * (this.ro - this.apexY) / (2 * this.ro));
	return percent + "% hyphaema";
};

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {number} SnoMed code of entity represented by doodle
 */
ED.Hyphaema.prototype.snomedCode = function() {
	'use strict';

    return 75229002;
};
