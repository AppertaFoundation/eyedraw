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
 * Sector PRP
 *
 * @class RetinalArteryOcclusionPostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RetinalArteryOcclusionPostPole = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RetinalArteryOcclusionPostPole";

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'arc', 'rotation'];

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RetinalArteryOcclusionPostPole.prototype = new ED.Doodle;
ED.RetinalArteryOcclusionPostPole.prototype.constructor = ED.RetinalArteryOcclusionPostPole;
ED.RetinalArteryOcclusionPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RetinalArteryOcclusionPostPole.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.RetinalArteryOcclusionPostPole.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RetinalArteryOcclusionPostPole.prototype.setParameterDefaults = function() {
	this.arc = Math.PI / 2;
	this.apexY = -100;
	this.setRotationWithDisplacements(45, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RetinalArteryOcclusionPostPole.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RetinalArteryOcclusionPostPole.superclass.draw.call(this, _point);

	// Radii
	var ro = 420;
	var ri = -this.apexY;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of CircumferentialBuckle
	var topRightX = ro * Math.sin(theta);
	var topRightY = -ro * Math.cos(theta);
	var topLeftX = -ro * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200,200,200,0.5)";
	ctx.strokeStyle = "rgba(200,200,200,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Cherry red spot
		if (this.apexY > -70) {
			ctx.beginPath();
			ctx.arc(0, 0, -this.apexY, 0, 2 * Math.PI, true);
			ctx.fillStyle = "rgba(200,0,0,0.5)";
			ctx.fill();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Drawing.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Drawing.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RetinalArteryOcclusionPostPole.prototype.description = function() {
	var returnString = "";

	// Type
	var type = this.type();
	switch (type){
		case 'branch':
			if (this.rotation > Math.PI / 2 && this.rotation < 3 * Math.PI / 2) {
				returnString = 'Inferotemporal ';
			}
			else {
				returnString = 'Superotemporal ';
			}
			returnString += 'branch ';
			break;

		case 'hemispheric':
			if (this.rotation > Math.PI / 2 && this.rotation < 3 * Math.PI / 2) {
				returnString = 'Inferior ';
			}
			else {
				returnString = 'Superior ';
			}
			returnString += 'hemispheric ';
			break;

		case 'central':
			returnString += 'Central ';
			break;
	}
	returnString += "retinal artery occlusion";

	// Macula
	if (this.apexY < -150) {
		returnString += ' sparing';
	}
	else {
		returnString += ' involving';
	}

	returnString += ' the macula';

	if (this.apexY > -70) returnString += ' with a cherry red spot';

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RetinalArteryOcclusionPostPole.prototype.snomedCode = function() {
	// Type
	var type = this.type();
	switch (type) {
		case 'branch':
			return 232035005;
			break;
		case 'hemispheric':
			return 232035005;
			break;
		case 'central':
			return 38742007;
			break;
	}
}

/**
 * Determines type of the vein occlusion
 *
 * @returns {String} String describing type of occlusion
 */
ED.RetinalArteryOcclusionPostPole.prototype.type = function() {
	// Arc defines type
	if (this.arc > 1.5 * Math.PI) return "central";
	else if (this.arc > 0.8 * Math.PI) return 'hemispheric';
	else return 'branch';
}
