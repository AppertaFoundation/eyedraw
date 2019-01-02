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
 * Anterior Segment Cross Section ***TODO***
 *
 * @class AntSegCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AntSegCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AntSegCrossSection";

	// Derived parameters
	this.pupilSize = 'Large';

	this.colour = 'Blue';
    
	// Saved parameters
	this.savedParameterArray = ['apexY', 'apexX','colour','c'];

    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

  	this.linkedDoodleParameters = {
    	'AntSeg': {
      		source: ['apexY', 'colour'],
      		store: [['apexX', 'csApexX']]
    	}
  	};

	// Invariant simple parameters
	this.originX = 44;
}

/**
 * Sets superclass and constructor
 */
ED.AntSegCrossSection.prototype = new ED.Doodle;
ED.AntSegCrossSection.prototype.constructor = ED.AntSegCrossSection;
ED.AntSegCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSegCrossSection.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSegCrossSection.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	//this.parameterValidationArray['apexX']['range'].setMinAndMax(-140, 0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['pupilSize'] = {
		kind: 'derived',
		type: 'string',
		list: ['Large', 'Medium', 'Small'],
		animate: true
	};
	
	this.parameterValidationArray['c'] = {
		kind: 'other',
		type: 'int',
		animate: false
	};
	
	this.parameterValidationArray.colour = {
		kind: 'other',
		type: 'string',
		list: ['Blue', 'Brown', 'Gray', 'Green'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSegCrossSection.prototype.setParameterDefaults = function() {
	this.setParameterFromString('pupilSize', 'Large');
	this.setParameterFromString('c', '1');
	this.apexX = 24;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSegCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			// ***TOSDP*** Putting this here will cancel out any saved value of apexX
			// Set apexX and its limits for apexX according to value of apexY (prevents collisions with cornea and lens)
				/// MSC: Max position dependent on lens type present
			var lens = this.drawing.lastDoodleOfClass('LensCrossSection');
			if (!lens) lens = this.drawing.lastDoodleOfClass('PCIOLCrossSection');
			if (!lens) lens = this.drawing.lastDoodleOfClass('ToricPCIOLCrossSection');

			var maxApexX = (lens.className == 'LensCrossSection') ? 32 - (72 / 220) * (this.apexY + 280) + lens.originX - 44: (lens.className == 'PCIOLCrossSection' || lens.className == 'ToricPCIOLCrossSection') ? lens.originX - 21 : 25;
			this.parameterValidationArray['apexX']['range'].setMinAndMax(-40 - (140 / 220) * (this.apexY + 280), maxApexX);

			// If being synced, make sensible decision about x
			// Commented out by MCS as was preventing display of saved values ... the above prevents overlap with the PCIOL though
			// if (!this.drawing.isActive) {
			// 	var newOriginX = this.parameterValidationArray['apexX']['range'].max;
			// } else {
			// 	var newOriginX = this.parameterValidationArray['apexX']['range'].constrain(this.apexX);
			// }
			// this.setSimpleParameter('apexX', newOriginX);

			// Set pupil size value
			if (_value < -200) returnArray['pupilSize'] = 'Large';
			else if (_value < -100) returnArray['pupilSize'] = 'Medium';
			else returnArray['pupilSize'] = 'Small';
			break;

		case 'pupilSize':
			switch (_value) {
				case 'Large':
					returnArray['apexY'] = -260;
					break;
				case 'Medium':
					returnArray['apexY'] = -200;
					break;
				case 'Small':
					returnArray['apexY'] = -100;
					break;
			}
			break;

		// commented out by MCS as seems to be blocking correct colour selection in view mode
		// case 'c':
		// 	if (_value === 1) returnArray['colour'] = 'Blue';
		// 	else if (_value === 2) returnArray['colour'] = 'Brown';
		// 	else if (_value === 3) returnArray['colour'] = 'Gray';
		// 	else returnArray['colour'] = 'Green';
		// 	break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSegCrossSection.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AntSegCrossSection.superclass.draw.call(this, _point);

	// If lens there, take account of pupil size
	var marginX = this.apexX;
	//    var doodle = this.drawing.lastDoodleOfClass("LensCrossSection");
	//    if (doodle) marginX -= 44 - doodle.originX;

	// Boundary path
	ctx.beginPath();

	// Bottom cut away
	ctx.moveTo(60, 480);
	ctx.lineTo(140, 480);
	ctx.lineTo(140, 380);

	// Bottom ciliary body
	ctx.bezierCurveTo(120, 340, 120, 340, 100, 380);
	ctx.bezierCurveTo(80, 340, 80, 340, 60, 380);

	// Bottom pupil and angle
	var f = Math.abs(marginX) * 0.15;
	ctx.bezierCurveTo(40, 460, marginX + 60 + f, -this.apexY, marginX, -this.apexY);
	ctx.bezierCurveTo(marginX - 60 - f, -this.apexY, -21, 317, 0, 380);

	// Top cut away
	ctx.moveTo(60, -480);
	ctx.lineTo(140, -480);
	ctx.lineTo(140, -380);

	// Bottom ciliary body
	ctx.bezierCurveTo(120, -340, 120, -340, 100, -380);
	ctx.bezierCurveTo(80, -340, 80, -340, 60, -380);

	// Bottom pupil and angle
	ctx.bezierCurveTo(40, -460, marginX + 60 + f, this.apexY, marginX, this.apexY);
	ctx.bezierCurveTo(marginX - 60 - f, this.apexY, -21, -317, 0, -380);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle = "rgba(0,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	    // colour fill for iris
		ctx.lineWidth = 4;
		ctx.strokeStyle = "gray";
		switch (this.colour) {
			case 'Blue':
				ctx.fillStyle = "rgba(160, 221, 251, 1)";
				break;
			case 'Brown':
				ctx.fillStyle = "rgba(203, 161, 134, 1)";
				break;
			case 'Gray':
				ctx.fillStyle = "rgba(177, 181, 172, 1)";
				break;
			case 'Green':
				ctx.fillStyle = "rgba(169, 206, 141, 1)";
				break;
		}
		
// 		ctx.fillStyle = "rgba(255, 160, 40, 1)";
		
		// bottom iris
		ctx.beginPath();
		ctx.moveTo(70, 380);
		ctx.lineTo(55, 380);
		ctx.bezierCurveTo(40, 460, marginX + 60 + f, -this.apexY, marginX, -this.apexY);
		ctx.bezierCurveTo(marginX - 60 - f, -this.apexY, -21, 317, 0, 380);
		ctx.lineTo(55,480);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();	
		
		// top iris
		ctx.beginPath();
		ctx.moveTo(70,-380);
		ctx.lineTo(55,-380);
		ctx.bezierCurveTo(40, -460, marginX + 60 + f, this.apexY, marginX, this.apexY);
		ctx.bezierCurveTo(marginX - 60 - f, this.apexY, -21, -317, 0, -380);
		ctx.lineTo(55, -480);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		ctx.fillStyle = "rgba(255, 160, 40, 1)";		
		// top cilliary body and cutaway
		ctx.beginPath();
		ctx.moveTo(55, -480);
		ctx.lineTo(140, -480);
		ctx.lineTo(140, -380);
	
		ctx.bezierCurveTo(120, -340, 120, -340, 100, -380);
		ctx.bezierCurveTo(80, -340, 80, -340, 55, -380);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		
		// bottom cilliary body	and cut away
		ctx.beginPath();
		ctx.moveTo(55, 480);
		ctx.lineTo(140, 480);
		ctx.lineTo(140, 380);
	
		ctx.bezierCurveTo(120, 340, 120, 340, 100, 380);
		ctx.bezierCurveTo(80, 340, 80, 340, 55, 380);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
