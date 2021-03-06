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
 * Anterior Synechiae
 *
 * @class AntSynech
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AntSynech = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AntSynech";

	// Private parameters
	this.rtmi = 304;
	this.riri = 176;
	this.colour = (typeof default_iris_colour) !== 'undefined' ? default_iris_colour : 'Blue';

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation', 'apexY', 'colour'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'colour' : 'Colour',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AntSynech.prototype = new ED.Doodle;
ED.AntSynech.prototype.constructor = ED.AntSynech;
ED.AntSynech.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSynech.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSynech.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-480, -260);
	this.parameterValidationArray['arc']['range'].setMinAndMax(30 * Math.PI / 180, Math.PI * 2);

	this.parameterValidationArray['colour'] = {
		kind: 'other',
		type: 'string',
		list: ['Blue', 'Brown', 'Gray', 'Green'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.AntSynech.prototype.setParameterDefaults = function() {
	this.arc = 30 * Math.PI / 180;
	this.apexY = -this.rtmi;
	this.setRotationWithDisplacements(0, -60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSynech.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AntSynech.superclass.draw.call(this, _point);

	// AntSynech is at equator
	var ras = -this.apexY;
	this.rir = this.riri;

	var r = this.rir + (ras - this.rir) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;
	var outArcStart = -Math.PI / 2 + theta - Math.PI / 14;
	var outArcEnd = -Math.PI / 2 - theta + Math.PI / 14;

	// Coordinates of 'corners' of AntSynech
	var topRightX = this.rir * Math.sin(theta);
	var topRightY = -this.rir * Math.cos(theta);
	var topLeftX = -this.rir * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Path
	ctx.arc(0, 0, this.rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, outArcEnd, outArcStart, false);

	// Close path
	ctx.closePath();

	// Set fill attributes (same colour as Iris)
	switch (this.colour) {
		case 'Blue':
			ctx.fillStyle = "rgba(160, 221, 251, 1)";
			break;
		case 'Brown':
			ctx.fillStyle = "rgba(203, 161, 134, 1)";
			break;
		case 'Gray':
			ctx.fillStyle = "rgba(177, 181, 172, 1)";
			break;
		case 'Green':
			ctx.fillStyle = "rgba(169, 206, 141, 1)";
			break;
	}
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
	ctx.lineWidth = 4;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));

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
ED.AntSynech.prototype.groupDescription = function() {
	// Calculate total extent in degrees
	var degrees = this.drawing.totalDegreesExtent(this.className);

	// Return string
	return "Anterior synechiae over " + degrees.toString() + " degrees";
}
