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
 * Posterior subcapsular cataract
 *
 * @class PostSubcapCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PostSubcapCataract = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PostSubcapCataract";

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PostSubcapCataract.prototype = new ED.Doodle;
ED.PostSubcapCataract.prototype.constructor = ED.PostSubcapCataract;
ED.PostSubcapCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostSubcapCataract.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PostSubcapCataract.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.parentClass = "Lens";
	this.inFrontOfClassArray = ["Lens"];
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+35, +100);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, -35);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostSubcapCataract.prototype.setParameterDefaults = function() {
	this.apexX = 35;
	this.apexY = 35;
	this.radius = 50;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostSubcapCataract.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexX':
			returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
			break;

		case 'apexY':
			returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostSubcapCataract.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PostSubcapCataract.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// PostSubcapCataract
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;

	// create pattern
	var ptrn = ctx.createPattern(this.drawing.imageArray['PSCPattern'], 'repeat');
	ctx.fillStyle = ptrn;

	ctx.strokeStyle = "lightgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(this.radius, Math.PI / 4);
	this.handleArray[4].location = this.transform.transformPoint(point);

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
ED.PostSubcapCataract.prototype.description = function() {
	return "Posterior subcapsular cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.PostSubcapCataract.prototype.snomedCode = function() {
	return 315353005;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PostSubcapCataract.prototype.diagnosticHierarchy = function() {
	return 3;
}
