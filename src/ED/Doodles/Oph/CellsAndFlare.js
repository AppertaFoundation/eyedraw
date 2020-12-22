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
 * AC Inflammation
 *
 * @class CellsAndFlare
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CellsAndFlare = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CellsAndFlare";

	this.cells = 'Not Checked';
	this.flare = 'Not Checked';
	this.sentinel = false;

	// Saved parameters
	this.savedParameterArray = [
        'cells', 'flare'
	];

	this.controlParameterArray = {
		'cells': 'Cells',
		'flare': 'Flare',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.CellsAndFlare.prototype = new ED.Doodle;
ED.CellsAndFlare.prototype.constructor = ED.CellsAndFlare;
ED.CellsAndFlare.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CellsAndFlare.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = true;
	this.inFrontOfClassArray = ['Hypopyon', 'Hyphaema'];

	this.parameterValidationArray.cells = {
		kind: 'other',
		type: 'string',
		list: ['Not Checked', '0 (>1)', '0.5+ (1-5)', '1+ (6-15)', '2+ (16-25)', '3+ (26-50)', '4+ (>50)'],
		animate: false
	};

	this.parameterValidationArray.flare = {
		kind: 'other',
		type: 'string',
		list: ['Not Checked', '0 (None)', '1+ (Faint)', '2+ (Moderate)', '3+ (Marked)', '4+ (Intense)'],
		animate: false
	};
};

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CellsAndFlare.prototype.setParameterDefaults = function() {
	this.scaleX = 1.3;
	this.scaleY = 1.3;

	// Hard drusen is displaced for Fundus, central for others
	if (this.drawing.hasDoodleOfClass('Fundus')) {
		this.originX = this.drawing.eye == ED.eye.Right ? -100 : 100;
	}
};

ED.CellsAndFlare.prototype.dependentParameterValues = function(_parameter, _value) {
	let returnArray = {};
	switch (_parameter) {
	}

	return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CellsAndFlare.prototype.draw = function(_point) {

	// Call draw method in superclass
	ED.CellsAndFlare.superclass.draw.call(this, _point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CellsAndFlare.prototype.description = function() {
	let returnValue = ``;   

	if (this.cells && this.cells !== 'Not Checked') {
		returnValue += ", cells: " + this.cells;
	}

	if (this.flare && this.flare !== 'Not Checked') {
		returnValue += ", flare: " + this.flare;
	}

	return returnValue;
};
