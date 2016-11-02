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
 * Lens Cross Section ***TODO***
 *
 * @class LensCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.LensCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "LensCrossSection";
	this.nuclearGrade = 'None';
	this.corticalGrade = 'None';
	this.posteriorSubcapsularGrade = 'None';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.LensCrossSection.prototype = new ED.Doodle;
ED.LensCrossSection.prototype.constructor = ED.LensCrossSection;
ED.LensCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.LensCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	this.parameterValidationArray['nuclearGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Mild', 'Moderate', 'Brunescent'],
		animate: false
	};

	this.parameterValidationArray['corticalGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Mild', 'Moderate', 'White'],
		animate: true
	};

	this.parameterValidationArray['posteriorSubcapsularGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Small', 'Medium', 'Large'],
		animate: false
	};

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +200);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-140, +140);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LensCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LensCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.LensCrossSection.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;

	// Arbitrary radius of curvature
	var r = 300;

	// Displacement of lens from centre
	var ld = 100;

	// Angle of arc
	var theta = Math.asin(h / r);

	// X coordinate of centre of circle
	var x = r * Math.cos(theta);

	// Measurements of nucleus
	var rn = r - 60;

	// Calculate nucleus angles
	var phi = Math.acos(x / rn);

	// Lens
	ctx.beginPath();

	// Draw lens with two sections of circumference of circle
	ctx.arc(ld - x, 0, r, theta, -theta, true);
	ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI - theta, true);

	// Draw it
	ctx.stroke();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Nucleus
		ctx.beginPath();
		ctx.moveTo(ld, rn * Math.sin(phi));
		ctx.arc(ld - x, 0, rn, phi, -phi, true);
		ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
		ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
		ctx.stroke();

		if (this.nuclearGrade != 'None') {
			var col;
			switch (this.nuclearGrade) {
				case 'Mild':
					col = -120;
					break;
				case 'Moderate':
					col = -80;
					break;
				case 'Brunescent':
					col = +0;
					break;
			}
			yellowColour = "rgba(255, 255, 0, 0.75)";
			var brownColour = "rgba(" + Math.round(120 - col) + ", " + Math.round(60 - col) + ", 0, 0.75)";
			var gradient = ctx.createRadialGradient(0, 0, 210, 0, 0, 50);
			gradient.addColorStop(0, yellowColour);
			gradient.addColorStop(1, brownColour);
			ctx.fillStyle = gradient;
			ctx.fill();
		}

		// Cortical Cataract
		if (this.corticalGrade != "None") {
			var apexY;

			switch (this.corticalGrade) {
				case 'Mild':
					apexY = -180;
					break;
				case 'Moderate':
					apexY = -100;
					break;
				case 'White':
					apexY = -20;
					break;
			}

			// Angle of arc
			var theta = Math.asin(h / r);

			// X coordinate of centre of circle
			var x = r * Math.cos(theta);

			// Radius of cortical cataract (half way between capsule and nucleus)
			var rco = r - 30;

			// Calculate nucleus angles
			theta = Math.acos(x / rco);

			// Calculate cataract angles
			var phi = Math.asin(-apexY / rco);

			// Boundary path
			ctx.beginPath();

			// Draw cataract with two sections of circumference of circle
			ctx.arc(ld - x, 0, rco, phi, theta, false);
			ctx.arc(ld + x, 0, rco, Math.PI - theta, Math.PI - phi, false);

			// Move to upper half and draw it
			var l = rco * Math.cos(phi);
			ctx.moveTo(ld - x + l, apexY);
			ctx.arc(ld - x, 0, rco, -phi, -theta, true);
			ctx.arc(ld + x, 0, rco, Math.PI + theta, Math.PI + phi, true);

			// Set line attributes
			ctx.lineWidth = 30;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.fillStyle = "rgba(0, 0, 0, 0)";
			ctx.strokeStyle = "rgba(200,200,200,0.75)";
			// Draw boundary path (also hit testing)
			this.drawBoundary(_point);
		}

		// Post SubCap Cataract
		if (this.posteriorSubcapsularGrade != "None") {
			var apexY;
			switch (this.posteriorSubcapsularGrade) {
				case 'Small':
					apexY = 30;
					break;
				case 'Medium':
					apexY = 60;
					break;
				case 'Large':
					apexY = 90;
					break;
			}

			// Angle of arc
			var theta = Math.asin(h / r);

			// X coordinate of centre of circle
			var x = r * Math.cos(theta);

			// Radius of cataract (Just inside capsule)
			var rco = r - 10;

			// Calculate cataract angles
			var phi = Math.asin(apexY / rco);

			// Boundary path
			ctx.beginPath();

			// Draw cataract with two sections of circumference of circle
			ctx.arc(ld - x, 0, rco, -phi, phi, false);

			// Set line attributes
			ctx.lineWidth = 10;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.fillStyle = "rgba(0, 0, 0, 0)";
			ctx.strokeStyle = "rgba(150,150,150,0.75)";

			// Draw boundary path (also hit testing)
			this.drawBoundary(_point);
		}


		// Zonules
		ctx.beginPath();

		// Top zonules
		ctx.moveTo(44 - this.originX + 80, -this.originY - 349);
		ctx.lineTo(64, -207);
		ctx.moveTo(44 - this.originX + 80, -this.originY - 349);
		ctx.lineTo(138, -207);
		ctx.moveTo(44 - this.originX + 120, -this.originY - 349);
		ctx.lineTo(64, -207);
		ctx.moveTo(44 - this.originX + 120, -this.originY - 349);
		ctx.lineTo(138, -207);

		// Bottom zonules
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(64, 207);
		ctx.moveTo(44 - this.originX + 80, -this.originY + 349);
		ctx.lineTo(138, 207);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(64, 207);
		ctx.moveTo(44 - this.originX + 120, -this.originY + 349);
		ctx.lineTo(138, 207);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "gray";
		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
