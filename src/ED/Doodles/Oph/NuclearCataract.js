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
 * Nuclear cataract
 *
 * @class NuclearCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.NuclearCataract = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "NuclearCataract";

	// Derived parameters
	this.grade = 'Mild';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataract.prototype = new ED.Doodle;
ED.NuclearCataract.prototype.constructor = ED.NuclearCataract;
ED.NuclearCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataract.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataract.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.parentClass = "Lens";
	this.inFrontOfClassArray = ["Lens", "PostSubcapCataract" ];
	this.addAtBack = true;

	// Update validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-120, +0);
	this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['Mild', 'Moderate', 'Brunescent'],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.NuclearCataract.prototype.setParameterDefaults = function() {
	this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.NuclearCataract.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -80) returnArray['grade'] = 'Mild';
			else if (_value < -40) returnArray['grade'] = 'Moderate';
			else returnArray['grade'] = 'Brunescent';
			break;

		case 'grade':
			switch (_value) {
				case 'Mild':
					returnArray['apexY'] = -120;
					break;
				case 'Moderate':
					returnArray['apexY'] = -80;
					break;
				case 'Brunescent':
					returnArray['apexY'] = +0;
					break;
			}
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.NuclearCataract.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.NuclearCataract.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// NuclearCataract
	ctx.arc(0, 0, 200, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;

	// Colors for gradient
	yellowColour = "rgba(255, 255, 0, 0.75)";
	var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";

	// Radial gradient
	var gradient = ctx.createRadialGradient(0, 0, 210, 0, 0, 50);
	gradient.addColorStop(0, yellowColour);
	gradient.addColorStop(1, brownColour);

	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

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
ED.NuclearCataract.prototype.description = function() {
	return this.getParameter('grade') + " nuclear cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.NuclearCataract.prototype.snomedCode = function() {
	return 53889007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.NuclearCataract.prototype.diagnosticHierarchy = function() {
	return 3;
}
