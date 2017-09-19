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
 * @class RetinalHaemorrhage
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RetinalHaemorrhage = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RetinalHaemorrhage";
	
	// Derived parameters
	this.layer = 'Pre-retinal';
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'layer':'Layer'};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RetinalHaemorrhage.prototype = new ED.Doodle;
ED.RetinalHaemorrhage.prototype.constructor = ED.RetinalHaemorrhage;
ED.RetinalHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RetinalHaemorrhage.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.RetinalHaemorrhage.prototype.setPropertyDefaults = function() {
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['layer'] = {
		kind: 'other',
		type: 'string',
		list: ['Pre-retinal', 'Intra-retinal', 'Sub-retinal', 'Sub-RPE'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RetinalHaemorrhage.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, -60);
	this.setParameterFromString('layer', 'Pre-retinal');
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RetinalHaemorrhage.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RetinalHaemorrhage.superclass.draw.call(this, _point);

	// Radius
	var r = 90;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	
	switch (this.layer) {
		case 'Pre-retinal':
			ctx.fillStyle = "rgba(255,0,0,1.0)";
			ctx.strokeStyle = ctx.fillStyle;
			break;
		case 'Intra-retinal':
			ctx.fillStyle = "rgba(255,0,0,0.75)";
			ctx.strokeStyle = ctx.fillStyle;
			break;
		case 'Sub-retinal':
			ctx.fillStyle = "rgba(255,0,0,0.5)";
			ctx.strokeStyle = ctx.fillStyle;
			break;
		case 'Sub-RPE':
			ctx.fillStyle = "rgba(255,0,0,0.25)";
			ctx.strokeStyle = ctx.fillStyle;
			break;
	}

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
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.RetinalHaemorrhage.prototype.groupDescription = function() {
	var returnString = "";
	
	switch (this.layer) {
		case 'Pre-retinal':
			returnString = 'Pre-retinal'
			break;
		case 'Intra-retinal':
			returnString = 'Intra-retinal'
			break;
		case 'Sub-retinal':
			returnString = 'Sub-retinal'
			break;
		case 'Sub-RPE':
			returnString = 'Sub-RPE'
			break;
	}
	
	returnString += ' haemorrhage';
	
	return returnString;
}
