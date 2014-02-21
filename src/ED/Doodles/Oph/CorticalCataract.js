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
 * A cortical cataract
 *
 * @class CorticalCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CorticalCataract = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CorticalCataract";

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
ED.CorticalCataract.prototype = new ED.Doodle;
ED.CorticalCataract.prototype.constructor = ED.CorticalCataract;
ED.CorticalCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataract.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataract.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isRotatable = false;
	this.isUnique = true;
	this.parentClass = "Lens";
	this.inFrontOfClassArray = ["Lens", "PostSubcapCataract", "NuclearCataract"];

	// Update validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
	this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['grade'] = {
		kind: 'derived',
		type: 'string',
		list: ['Mild', 'Moderate', 'White'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataract.prototype.setParameterDefaults = function() {
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
ED.CorticalCataract.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -120) returnArray['grade'] = 'Mild';
			else if (_value < -60) returnArray['grade'] = 'Moderate';
			else returnArray['grade'] = 'White';
			break;

		case 'grade':
			switch (_value) {
				case 'Mild':
					returnArray['apexY'] = -180;
					break;
				case 'Moderate':
					returnArray['apexY'] = -100;
					break;
				case 'White':
					returnArray['apexY'] = -20;
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
ED.CorticalCataract.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CorticalCataract.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Parameters
	var n = 16; // Number of cortical spokes
	var ro = 240; // Outer radius of cataract
	var rs = 230; // Outer radius of spoke
	var theta = 2 * Math.PI / n; // Angle of outer arc of cortical shard
	var phi = theta / 2; // Half theta
	var ri = -this.apexY; // Radius of inner clear area

	// Draw cortical spokes
	var sp = new ED.Point(0, 0);
	sp.setWithPolars(rs, -phi);
	ctx.moveTo(sp.x, sp.y);

	for (var i = 0; i < n; i++) {
		var startAngle = i * theta - phi;
		var endAngle = startAngle + theta;

		var op = new ED.Point(0, 0);
		op.setWithPolars(rs, startAngle);
		ctx.lineTo(op.x, op.y);

		//ctx.arc(0, 0, ro, startAngle, endAngle, false);
		var ip = new ED.Point(0, 0);
		ip.setWithPolars(ri, i * theta);
		ctx.lineTo(ip.x, ip.y);
	}

	ctx.lineTo(sp.x, sp.y);

	// Surrounding ring
	ctx.moveTo(ro, 0);
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Set boundary path attributes
	ctx.lineWidth = 4;
	ctx.lineJoin = 'bevel';
	ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "rgba(200,200,200,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing here
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
ED.CorticalCataract.prototype.description = function() {
	return this.getParameter('grade') + " cortical cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CorticalCataract.prototype.snomedCode = function() {
	return 193576003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CorticalCataract.prototype.diagnosticHierarchy = function() {
	return 3;
}
