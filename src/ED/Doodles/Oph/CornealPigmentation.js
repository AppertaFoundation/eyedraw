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
 * CornealPigmentationtherapy
 *
 * @class CornealPigmentation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealPigmentation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealPigmentation";
	
	// Other parameters
	this.level = 'Epithelial';
	this.type = 'Iron';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'rotation', 'level', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'level':'Level', 'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealPigmentation.prototype = new ED.Doodle;
ED.CornealPigmentation.prototype.constructor = ED.CornealPigmentation;
ED.CornealPigmentation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealPigmentation.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CornealPigmentation.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -40);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['level'] = {
		kind: 'derived',
		type: 'string',
		list: ['Epithelial', 'Subepithelial', 'Anterior stromal', 'Mid stromal', 'Posterior stromal', 'Descemet\'s'],
		animate: true
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Iron', 'Melanin', 'Blood', 'Copper', 'Lead', 'Organic', 'Unknown'],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.CornealPigmentation.prototype.setParameterDefaults = function() {
	this.setParameterFromString('level', 'Epithelial');
	this.apexY = -200;

	// Put control handle at 45 degrees
	this.rotation = Math.PI / 4;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealPigmentation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealPigmentation.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Circular scar
	var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);

	// Circular scar
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set line attributes  
	ctx.lineWidth = 4;
	var ptrn = ctx.createPattern(this.drawing.imageArray['BrownSpotPattern'], 'repeat');
	ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(200, 200, 200, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.CornealPigmentation.prototype.groupDescription = function() {
	return "CornealPigmentation";
}
