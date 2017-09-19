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
 * Cornea Cross Section ***TODO***
 *
 * @class CorneaCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CorneaCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CorneaCrossSection";

	// Other parameters
	this.shape = "";
	this.pachymetry = 540;
	
	// Saved parameters
	this.savedParameterArray = ['shape', 'pachymetry', 'originX', 'apexX', 'apexY'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'shape':'Shape',
		'pachymetry':'Pachymetry',
	};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

    this.linkedDoodleParameters = {
        'Cornea': {
            source: ['shape', 'pachymetry'],
            store: [['apexX', 'csApexX'], ['apexY', 'csApexY'], ['originX', 'csOriginX']]
        }
    };
}

/**
 * Sets superclass and constructor
 */
ED.CorneaCrossSection.prototype = new ED.Doodle;
ED.CorneaCrossSection.prototype.constructor = ED.CorneaCrossSection;
ED.CorneaCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorneaCrossSection.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CorneaCrossSection.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
	
	// Update validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-365, -300);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +100);
	
	// Other parameters
	this.parameterValidationArray['shape'] = {
		kind: 'other',
		type: 'string',
		list: ['Normal', 'Keratoconus', 'Keratoglobus'],
		animate: false
	};
	this.parameterValidationArray['pachymetry'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(400, 700),
		precision: 1,
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorneaCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 50;
	this.apexX = -363;
	this.apexY = 0;
	this.setParameterFromString('shape', 'Normal');
	this.setParameterFromString('pachymetry', '540');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorneaCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'pachymetry':
			returnArray['pachymetry'] = _value;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorneaCrossSection.prototype.draw = function(_point) {
// 	console.log(this.apexX, this.apexY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CorneaCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Top cut away
	ctx.moveTo(60, -480);
	ctx.lineTo(-80, -480);
	ctx.bezierCurveTo(-100, -440, -100, -440, -120, -380);

	// Front of cornea
	switch (this.shape) {
		case "Normal":
			ctx.bezierCurveTo(-240, -260, -320, -160, -320, 0);
			ctx.bezierCurveTo(-320, 160, -240, 260, -120, 380);
			break;
		
		case "Keratoconus":
			ctx.bezierCurveTo(-240, -260, this.apexX, this.apexY - 100, this.apexX, this.apexY);
			ctx.bezierCurveTo(this.apexX, this.apexY + 100, -240, 260, -120, 380);
			break;
			
		case "Keratoglobus":
			ctx.bezierCurveTo(-240, -260, -380, -100, -380, 100);
			ctx.bezierCurveTo(-380, 200, -240, 360, -120, 380);
			break;
	}

	// Bottom cut away
	ctx.bezierCurveTo(-100, 440, -100, 440, -80, 480);
	ctx.lineTo(60, 480);
	ctx.lineTo(0, 380);

	// Back of cornea
	var thickness = this.pachymetry/5;
	switch (this.shape) {
		case "Normal":
			ctx.bezierCurveTo(-80, 260, -220, 180, -220, 0);
			ctx.bezierCurveTo(-220, -180, -80, -260, 0, -380);
			break;
		
		case "Keratoconus":
			ctx.bezierCurveTo(-80, 260, this.apexX + thickness, this.apexY + 120, this.apexX + thickness, this.apexY);
			ctx.bezierCurveTo(this.apexX + thickness, this.apexY - 120, -80, -260, 0, -380);
			break;
			
		case "Keratoglobus":
			ctx.bezierCurveTo(-80, 260, -260, 220, -280, 100);
			ctx.bezierCurveTo(-280, -140, -120, -200, 0, -380);
			break;
	}

	// Close path
	ctx.closePath();

	// Set path attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245, 245, 245, 0.5)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Top sclera
		ctx.beginPath();
		ctx.moveTo(56, -478);
		ctx.lineTo(-78, -478);
		ctx.bezierCurveTo(-98, -440, -96, -440, -118, -378);
		ctx.lineTo(-4, -378);
		ctx.lineTo(56, -478);

		// Bottom scleral
		ctx.moveTo(56, 478);
		ctx.lineTo(-78, 478);
		ctx.bezierCurveTo(-98, 440, -96, 440, -118, 378);
		ctx.lineTo(-4, 378);
		ctx.closePath();

		ctx.fillStyle = "rgba(255,255,185,1)";
		ctx.fill();
	}
	
	// Apex handle not present if normal
	if (this.shape == "Keratoconus") {
		// Coordinates of handles (in canvas plane)
		this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

		// Draw handles if selected
		if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
