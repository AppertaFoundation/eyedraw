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
 * Gonioscopy
 *
 * @class Gonioscopy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Gonioscopy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Gonioscopy";

	// Private parameters
	this.rsl = 480;
	this.rsli = 470;
	this.rtmo = 404;
	this.rtmi = 304;
	this.rcbo = 270;
	this.rcbi = 190;
	this.riro = 190;
	this.riri = 176;
	this.rpu = 100;

    this.mode = "Basic";

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'pigmentation':'Meshwork Pigmentation',
	};

	this.PigmentationVeryLight	= 'Very light';
	this.PigmentationLight		= 'Light';
	this.PigmentationModerate	= 'Moderate';
	this.PigmentationHeavy		= 'Heavy';
	this.PigmentationVeryHeavy	= 'Very heavy';
	this.pigmentation = this.PigmentationLight;

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'mode'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	this.updatePigmentation = function() {

		// inter-
		// vallum				suggested
		// begin	name		value
		// --------------------------------
		// [-500	Very Light	-500	)
		// [-460	Light		-460	)
		// [-440	Moderate	-430	)
		// [-420	Heavy		-420	)
		// [-390	Very Heavy	-390  -380)

		if (this.apexY < -460) this.pigmentation = this.PigmentationVeryLight;
		else if (this.apexY < -440) this.pigmentation = this.PigmentationLight;
		else if (this.apexY < -420) this.pigmentation = this.PigmentationModerate;
		else if (this.apexY < -390) this.pigmentation = this.PigmentationHeavy;
		else this.pigmentation = this.PigmentationVeryHeavy;
	};

	this.updatePigmentation();
}

/**
 * Sets superclass and constructor
 */
ED.Gonioscopy.prototype = new ED.Doodle;
ED.Gonioscopy.prototype.constructor = ED.Gonioscopy;
ED.Gonioscopy.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.Gonioscopy.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-500, -380);

    this.parameterValidationArray['mode'] = {
	kind: 'derived',
	type: 'string',
	list: ['Basic', 'Expert'],
	animate: false
    };

	// Other parameters
	this.parameterValidationArray['pigmentation'] = {
		kind: 'other',
		type: 'string',
		list: [
			this.PigmentationVeryLight,
			this.PigmentationLight,
			this.PigmentationModerate,
			this.PigmentationHeavy,
			this.PigmentationVeryHeavy,
		],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Gonioscopy.prototype.setParameterDefaults = function() {
	this.apexX = -460;
	this.apexY = -460;
    this.setParameterFromString('mode', 'Basic');
	this.setParameterFromString('pigmentation', this.PigmentationLight);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Gonioscopy.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = [];
	switch (_parameter) {
		case 'pigmentation':
			returnArray['pigmentation'] = _value;
			returnArray['apexX'] = -460;
			switch (_value) {
				case this.PigmentationVeryLight:
					returnArray['apexY'] = -500;
					break;
				case this.PigmentationLight:
					returnArray['apexY'] = -460;
					break;
				case this.PigmentationModerate:
					returnArray['apexY'] = -430;
					break;
				case this.PigmentationHeavy:
					returnArray['apexY'] = -420;
					break;
				case this.PigmentationVeryHeavy:
					returnArray['apexY'] = -390;
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
ED.Gonioscopy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Gonioscopy.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, this.rsl, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Trabecular meshwork
		ctx.beginPath();

		// Arc across, move to inner and arc back
		ctx.arc(0, 0, this.rtmo, arcStart, arcEnd, true);
		ctx.moveTo(this.rtmi, 0);
		ctx.arc(0, 0, this.rtmi, arcEnd, arcStart, false);

		// Set line attributes
		ctx.lineWidth = 1;

		this.updatePigmentation();
		switch (this.pigmentation) {
			case this.PigmentationVeryLight:
				ctx.fillStyle = "rgba(200, 200, 200, 1)";
				break;
			case this.PigmentationLight:
				ctx.fillStyle = "rgba(250, 200, 0, 1)";
				break;
			case this.PigmentationModerate:
				ctx.fillStyle = "rgba(200, 150, 0, 1)";
				break;
			case this.PigmentationHeavy:
				ctx.fillStyle = "rgba(150, 100, 0, 1)";
				break;
			case this.PigmentationVeryHeavy:
				ctx.fillStyle = "rgba(100, 50, 0, 1)";
				break;
		}

		// Stroke style
		ctx.strokeStyle = "rgba(200, 200, 200, 1)";

		// Draw it
		ctx.fill();
		ctx.stroke();

		// Ciliary Body
		ctx.beginPath();

		// Arc across, move to inner and arc back
		ctx.arc(0, 0, this.rcbo, arcStart, arcEnd, true);
		ctx.arc(0, 0, this.rcbi, arcEnd, arcStart, false);

		// Draw it
		ctx.fillStyle = "rgba(200, 200, 200, 1)";
		ctx.fill();

		// Draw radial lines
		var firstAngle = 15;
		var innerPoint = new ED.Point(0, 0);
		var outerPoint = new ED.Point(0, 0);
		var i = 0;

		// Loop through clock face
		for (i = 0; i < 12; i++) {
			// Get angle
			var angleInRadians = (firstAngle + i * 30) * Math.PI / 180;
			innerPoint.setWithPolars(this.rcbi, angleInRadians);

			// Set new line
			ctx.beginPath();
			ctx.moveTo(innerPoint.x, innerPoint.y);

			// Some lines are longer, wider and darker
			if (i == 1 || i == 4 || i == 7 || i == 10) {
				outerPoint.setWithPolars(this.rsl + 80, angleInRadians);
				ctx.lineWidth = 6;
				ctx.strokeStyle = "rgba(20, 20, 20, 1)";
			} else {
				outerPoint.setWithPolars(this.rsl, angleInRadians);
				ctx.lineWidth = 2;
				ctx.strokeStyle = "rgba(137, 137, 137, 1)";
			}

			// Draw line
			ctx.lineTo(outerPoint.x, outerPoint.y);
			ctx.closePath();
			ctx.stroke();
		}

		// Iris
		ctx.beginPath();

		// Arc across, move to inner and arc back
		ctx.arc(0, 0, this.riro, arcStart, arcEnd, true);
		ctx.arc(0, 0, this.riri, arcEnd, arcStart, false);

		// Set attributes
		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgba(180, 180, 180, 1)";
		ctx.fillStyle = "rgba(200, 200, 200, 1)";

		// Draw it
		ctx.fill();
		ctx.stroke();
	}

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Gonioscopy.prototype.description = function() {
	return "TM pigmentation: " + this.pigmentation;
}
