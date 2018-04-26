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
 * MaculaPostPole template with disc and arcades
 *
 * @class MaculaPostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MaculaPostPole = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MaculaPostPole";

    // Other parameters
    this.watzke = 'Not assessed';

	// Saved parameters
	this.savedParameterArray = ['watzke'];

    this.controlParameterArray = {
        'watzke': 'Watzke Result'
    };

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MaculaPostPole.prototype = new ED.Doodle;
ED.MaculaPostPole.prototype.constructor = ED.MaculaPostPole;
ED.MaculaPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MaculaPostPole.prototype.setHandles = function() {}

/**
 * Set default properties
 */
ED.MaculaPostPole.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
    this.willReport = true;
    this.inFrontOfClassArray = ['PostPole'];

    this.parameterValidationArray.watzke = {
		kind: 'derived',
		type: 'string',
		list: ['Not assessed', 'Normal', 'Abnormal'],
		animate: true
    };
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MaculaPostPole.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;
    var foveaX = 0;

	// Call draw method in superclass
	ED.MaculaPostPole.superclass.draw.call(this, _point);

	// Disc location
	var x = this.drawing.eye == ED.eye.Right ? 300 : -300;

	// Boundary path
	ctx.beginPath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(249,187,76,0)";
	ctx.fillStyle = "rgba(249,187,76,0)";

	ctx.arc(0,0,20,0,2*Math.PI,true);

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MaculaPostPole.prototype.description = function() {
    var returnValue = "";
    returnValue += 'Watzke: ' + this.watzke.toLowerCase() + " ";

    if (returnValue.length === 0 && this.drawing.doodleArray.length === 1) {
        returnValue = "No abnormality";
	}

	return returnValue;
}
