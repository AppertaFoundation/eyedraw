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
 * Patient
 *
 * @class patient
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Patient = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Patient";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Patient.prototype = new ED.Doodle;
ED.Patient.prototype.constructor = ED.Patient;
ED.Patient.superclass = ED.Doodle.prototype;


/**
 * Sets default properties
 */
ED.Patient.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
		this.isScaleable = false;
		this.isMoveable = false;
		this.isDeletable = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Patient.prototype.setParameterDefaults = function() {
	this.scaleX = 0.75;
	this.scaleY = 0.75;
	this.setOriginWithDisplacements(100, 80);

}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patient.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Patient.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	ctx.moveTo(-522,141);
	ctx.bezierCurveTo(-533,9,-402,-46,-376,-48);
	ctx.bezierCurveTo(-350,-50,-101,-59,-79,-66);
	ctx.bezierCurveTo(-57,-74,-48,-101,-6,-121);
	ctx.bezierCurveTo(25,-132,49,-123,66,-114);
	ctx.bezierCurveTo(82,-105,88,-70,104,-68);
	ctx.bezierCurveTo(121,-66,141,-84,157,-66);
	ctx.bezierCurveTo(174,-48,141,-37,156,-26);
	ctx.bezierCurveTo(170,-15,178,-30,203,-22);
	ctx.bezierCurveTo(229,-15,289,9,310,18);
	ctx.bezierCurveTo(330,27,352,36,390,33);
	ctx.bezierCurveTo(429,29,421,13,438,-6);
	ctx.bezierCurveTo(454,-24,436,-30,463,-55);
	ctx.bezierCurveTo(482,-70,515,-66,515,-66);
	ctx.lineTo(526,-77);
	ctx.lineTo(540,-68);
	ctx.lineTo(561,-75);
	ctx.bezierCurveTo(561,-75,561,-101,573,-103);
	ctx.bezierCurveTo(586,-105,612,-70,630,-68);
	ctx.bezierCurveTo(649,-66,628,-81,658,-81);
	ctx.bezierCurveTo(687,-81,737,-50,760,-37);
	ctx.bezierCurveTo(782,-8,771,-20,782,10);
	ctx.bezierCurveTo(793,40,797,84,786,112);
	ctx.bezierCurveTo(775,139,762,152,738,161);
	ctx.bezierCurveTo(715,170,649,174,669,174);
	ctx.bezierCurveTo(689,174,562,174,583,172);
	ctx.bezierCurveTo(491,179,509,178,485,200);
	ctx.bezierCurveTo(462,222,474,258,456,291);
	ctx.bezierCurveTo(438,324,425,328,386,353);
	ctx.bezierCurveTo(245,379,64,436,14,396);
	ctx.bezierCurveTo(-2,370,2,366,-19,324);
	ctx.bezierCurveTo(-55,321,-237,334,-326,336);
	ctx.bezierCurveTo(-416,339,-511,273,-522,141);


	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = "";
	ctx.fillStyle = "";
	ctx.strokeStyle = "";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}