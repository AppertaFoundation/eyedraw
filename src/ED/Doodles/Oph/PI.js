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
 * Peripheral iridectomy
 *
 * @class PI
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PI = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PI";

	// Derived parameters
	this.type = 'Surgical';
	
	// Saved parameters
	this.savedParameterArray = ['rotation', 'type'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PI.prototype = new ED.Doodle;
ED.PI.prototype.constructor = ED.PI;
ED.PI.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.PI.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Surgical', 'Laser'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.PI.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(30, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PI.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PI.superclass.draw.call(this, _point);

	// Outer radius
	var r = 360;

	// Boundary path
	ctx.beginPath();
	switch (this.type) {
		case 'Surgical':
			var phi = Math.PI / 24;
			ctx.arc(0, 0, r, -phi - Math.PI / 2, phi - Math.PI / 2, false);
			ctx.lineTo(0, -r * 0.8);
			ctx.closePath();
			break;
		case 'Laser':
			ctx.arc(0, -r * 0.9, 36, 0, Math.PI * 2, true);
			break;
	}

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";;

	// Colour of fill
	ctx.fillStyle = "rgba(218,230,241,1)";
	
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
ED.PI.prototype.description = function() {
	return "Peripheral iridectomy at " + this.clockHour() + " o'clock";
}

/**
 * Runs when doodle is selected by the user
 */
ED.PI.prototype.onSelection = function() {
	console.log('PI selected' + this.drawing.IDSuffix);
	
	var tableSelect = document.createElement('select');
	tableSelect.setAttribute('id', 'piTypeSelect');
	
	var option = document.createElement('option');
	//if (selectedValue == optionArray[i]) option.setAttribute('selected', 'true');
	option.innerText = 'Surgical';
	tableSelect.appendChild(option);
	option = document.createElement('option');
	option.innerText = 'Laser';
	tableSelect.appendChild(option);
	
	document.getElementById('doodleControls').appendChild(tableSelect);
	
	this.addBinding('type', {id:'piTypeSelect'});
}

/**
 * Runs when doodle is deselected by the user
 */
ED.PI.prototype.onDeselection = function() {
	console.log('PI deselected');
	this.removeBinding('type');
	document.getElementById('doodleControls').removeChild(document.getElementById('piTypeSelect'));
}
