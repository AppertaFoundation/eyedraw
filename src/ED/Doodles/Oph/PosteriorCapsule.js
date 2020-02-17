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
 * PosteriorCapsule
 *
 * @class PosteriorCapsule
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PosteriorCapsule = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PosteriorCapsule";

	// Derived parameters
	this.opacity = 'None';
	this.capsulotomy = 'None';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'opacity', 'capsulotomy'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'opacity':'Opacity',
		'capsulotomy':'Capsulotomy',
		};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorCapsule.prototype = new ED.Doodle;
ED.PosteriorCapsule.prototype.constructor = ED.PosteriorCapsule;
ED.PosteriorCapsule.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PosteriorCapsule.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);

	this.parameterValidationArray['opacity'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Mild', 'Moderate', 'Severe'],
		animate: false
	};
	this.parameterValidationArray['capsulotomy'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Diamond', 'Circle'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PosteriorCapsule.prototype.setParameterDefaults = function() {}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PosteriorCapsule.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PosteriorCapsule.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var ro = 240;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		// Capsulotomy
		if (this.capsulotomy != '1') {
			ctx.beginPath();
			ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
			var ri = 140;
			ctx.moveTo(ri, 0);

			switch (this.capsulotomy) {
				case 'Diamond':
					ctx.lineTo(0, ri);
					ctx.lineTo(-ri, 0);
					ctx.lineTo(0, -ri);
					ctx.lineTo(ri, 0);
					ctx.closePath();
					break;
				case 'Circle':
					ctx.arc(0, 0, ri, 0, 2 * Math.PI, false);
					break;
			}
		}

		// Pattern

		var ptrn = ctx.createPattern(this.drawing.imageArray['PSCPattern'], 'repeat');
		
		if (this.opacity > 1) {ctx.fillStyle = ptrn;}
		ctx.fill();

		// Opacity
		switch (this.opacity) {
			case 'None':
				ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
				break;
			case 'Mild':
				ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
				break;
			case 'Moderate':
				ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
				break;
			case 'Severe':
				ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
				break;
			default:
				ctx.fillStyle = "rgba(255, 150, 100, 0.1)";
				break;
		}
		ctx.fill();
		ctx.stroke();
	}

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
ED.PosteriorCapsule.prototype.description = function() {
	var returnValue = "";

	if (this.opacity != 'None') {
		returnValue += this.opacity + " posterior capsular opacity";
	}

	switch (this.opacity) {
		case 'None':
			returnValue = 'No posterior capsule opacification';
			break;
		case 'Mild':
			returnValue = "Mild posterior capsule opacification";
			break;
		case 'Moderate':
			returnValue = "Moderate posterior capsule opacification";
			break;
		case 'Severe':
			returnValue = "Severe posterior capsule opacification";
			break;
	}

	switch (this.capsulotomy) {
		case 'None':
			returnValue += " with no shaped capsulotomy";
			break;
		case 'Diamond':
			returnValue = "Diamond shaped capsulotomy of posterior capsule";
			break;
		case 'Circle':
			returnValue = "Circle shaped capsulotomy of posterior capsule";
			break;
	}

	return returnValue;
};
