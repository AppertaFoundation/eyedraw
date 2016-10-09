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
 * Posterior chamber IOL
 *
 * @class IOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.IOL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "IOL";

	// Other parameters
	this.type = "PC";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'type'];
	 
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.IOL.prototype = new ED.Doodle;
ED.IOL.prototype.constructor = ED.IOL;
ED.IOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IOL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default properties
 */
ED.IOL.prototype.setPropertyDefaults = function() {
	this.addAtBack = this.type == 'PC'?true:false;
	this.isUnique = true;
	
	// Validation arrays for derived and other parameters
	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: ['PC', 'AC', 'Iris Clip'],
		animate: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.IOL.prototype.setParameterDefaults = function() {
	this.setParameterFromString('type', 'PC');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.IOL.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IOL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.IOL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	switch (this.type) {
		case 'PC':
			// Radius of IOL optic
			var r = 180;

			// Draw optic
			ctx.arc(0, 0, r, 0, Math.PI * 2, false);

			// Upper haptic
			ctx.moveTo(112.5, -142.5);
			ctx.bezierCurveTo(120, -150, 142.5, -262.5, 120, -285);
			ctx.bezierCurveTo(67.5, -330, -112.5, -307.5, -165, -277.5);
			ctx.bezierCurveTo(-187.5, -262.5, -195, -300, -150, -322.5);
			ctx.bezierCurveTo(-82.5, -360, 97.5, -352.5, 150, -322.5);
			ctx.bezierCurveTo(202.5, -292.5, 165, -105, 165, -75);
	
			// Lower haptic
			ctx.moveTo(-112.5, 142.5);
			ctx.bezierCurveTo(-120, 150, -142.5, 262.5, -120, 285);
			ctx.bezierCurveTo(-67.5, 330, 112.5, 307.5, 165, 277.5);
			ctx.bezierCurveTo(187.5, 262.5, 195, 300, 150, 322.5);
			ctx.bezierCurveTo(82.5, 360, -97.5, 352.5, -150, 322.5);
			ctx.bezierCurveTo(-202.5, 292.5, -165, 105, -165, 75);
			break;
			
		case 'AC':
			// Radius of IOL optic
			var r = 192;

			// Draw optic
			ctx.arc(0, 0, r, 0, Math.PI * 2, false);

			// Upper haptic
			ctx.moveTo(120, -152);
			ctx.bezierCurveTo(128, -160, 136, -168, 128, -184);
			ctx.bezierCurveTo(120, -200, 80, -224, 40, -232);
			ctx.bezierCurveTo(0, -240, -176, -264, -184, -272);
			ctx.bezierCurveTo(-200, -288, -176, -336, -160, -344);
			ctx.bezierCurveTo(-144, -352, -144, -352, -120, -360);
			ctx.bezierCurveTo(-96, -368, -104, -344, -96, -336);
			ctx.bezierCurveTo(-88, -328, 88, -328, 96, -336);
			ctx.bezierCurveTo(104, -344, 96, -368, 120, -360);
			ctx.bezierCurveTo(144, -352, 144, -352, 160, -344);
			ctx.bezierCurveTo(176, -336, 144, -320, 120, -312);
			ctx.bezierCurveTo(96, -304, -96, -304, -120, -312);
			ctx.bezierCurveTo(-144, -320, -152, -296, -136, -288);
			ctx.bezierCurveTo(-120, -280, 16, -264, 56, -256);
			ctx.bezierCurveTo(96, -248, 152, -224, 168, -200);
			ctx.bezierCurveTo(184, -176, 176, -112, 176, -80);

			// Lower haptic
			ctx.moveTo(-120, 152);
			ctx.bezierCurveTo(-128, 160, -136, 168, -128, 184);
			ctx.bezierCurveTo(-120, 200, -80, 224, -40, 232);
			ctx.bezierCurveTo(0, 240, 176, 264, 184, 272);
			ctx.bezierCurveTo(200, 288, 176, 336, 160, 344);
			ctx.bezierCurveTo(144, 352, 144, 352, 120, 360);
			ctx.bezierCurveTo(96, 368, 104, 344, 96, 336);
			ctx.bezierCurveTo(88, 328, -88, 328, -96, 336);
			ctx.bezierCurveTo(-104, 344, -96, 368, -120, 360);
			ctx.bezierCurveTo(-144, 352, -144, 352, -160, 344);
			ctx.bezierCurveTo(-176, 336, -144, 320, -120, 312);
			ctx.bezierCurveTo(-96, 304, 96, 304, 120, 312);
			ctx.bezierCurveTo(144, 320, 152, 296, 136, 288);
			ctx.bezierCurveTo(120, 280, -16, 264, -56, 256);
			ctx.bezierCurveTo(-96, 248, -152, 224, -168, 200);
			ctx.bezierCurveTo(-184, 176, -176, 112, -176, 80);
			break;
			
		case 'Iris Clip':
			// Radius (used here to set handle location)
			var r = 240;
			
			// Optic
			ctx.moveTo(-260, 0);
			ctx.bezierCurveTo(-260, -100, -220, -220, 0, -220);
			ctx.bezierCurveTo(220, -220, 260, -100, 260, 0);
			ctx.bezierCurveTo(260, 100, 220, 220, 0, 220);
			ctx.bezierCurveTo(-220, 220, -260, 100, -260, 0);

			// Left hand clamp
			ctx.moveTo(-330, -10);
			ctx.bezierCurveTo(-335, -10, -335, -15, -335, -25);
			ctx.bezierCurveTo(-335, -43, -332, -86, -312, -106);
			ctx.bezierCurveTo(-292, -125, -265, -125, -252, -125);
			ctx.bezierCurveTo(-239, -125, -196, -125, -191, -116);
			ctx.bezierCurveTo(-187, -110, -189, -104, -194, -93);
			ctx.bezierCurveTo(-198, -82, -218, -50, -218, 0);
			ctx.bezierCurveTo(-218, 50, -198, 82, -194, 93);
			ctx.bezierCurveTo(-189, 104, -187, 110, -191, 116);
			ctx.bezierCurveTo(-196, 125, -239, 125, -252, 125);
			ctx.bezierCurveTo(-265, 125, -292, 125, -312, 106);
			ctx.bezierCurveTo(-332, 86, -335, 43, -335, 25);
			ctx.bezierCurveTo(-335, 15, -335, 10, -330, 10);
			ctx.bezierCurveTo(-325, 10, -320, 20, -320, 25);
			ctx.bezierCurveTo(-321, 22, -320, 33, -319, 47);
			ctx.bezierCurveTo(-319, 54, -314, 61, -308, 66);
			ctx.bezierCurveTo(-302, 71, -288, 77, -273, 77);
			ctx.bezierCurveTo(-258, 77, -250, 74, -243, 66);
			ctx.bezierCurveTo(-237, 58, -239, 0, -239, 0);
			ctx.bezierCurveTo(-239, 0, -237, -58, -243, -66);
			ctx.bezierCurveTo(-250, -74, -258, -77, -273, -77);
			ctx.bezierCurveTo(-288, -77, -302, -71, -308, -66);
			ctx.bezierCurveTo(-314, -61, -319, -54, -319, -47);
			ctx.bezierCurveTo(-320, -33, -321, -22, -320, -25);
			ctx.bezierCurveTo(-320, -20, -325, -10, -330, -10);

			// Right hand clamp (NB NOT mirror image, since winding affects transparency)
			ctx.moveTo(330, 10);
			ctx.bezierCurveTo(335, 10, 335, 15, 335, 25);
			ctx.bezierCurveTo(335, 43, 332, 86, 312, 106);
			ctx.bezierCurveTo(292, 125, 265, 125, 252, 125);
			ctx.bezierCurveTo(239, 125, 196, 125, 191, 116);
			ctx.bezierCurveTo(187, 110, 189, 104, 194, 93);
			ctx.bezierCurveTo(198, 82, 218, 50, 218, 0);
			ctx.bezierCurveTo(218, -50, 198, -82, 194, -93);
			ctx.bezierCurveTo(189, -104, 187, -110, 191, -116);
			ctx.bezierCurveTo(196, -125, 239, -125, 252, -125);
			ctx.bezierCurveTo(265, -125, 292, -125, 312, -106);
			ctx.bezierCurveTo(332, -86, 335, -43, 335, -25);
			ctx.bezierCurveTo(335, -15, 335, -10, 330, -10);
			ctx.bezierCurveTo(325, -10, 320, -20, 320, -25);
			ctx.bezierCurveTo(321, -22, 314, -61, 319, -47);
			ctx.bezierCurveTo(319, -54, 314, -61, 308, -66);
			ctx.bezierCurveTo(302, -71, 288, -77, 273, -77);
			ctx.bezierCurveTo(258, -77, 250, -74, 243, -66);
			ctx.bezierCurveTo(237, -58, 239, 0, 239, 0);
			ctx.bezierCurveTo(239, 0, 237, 58, 243, 66);
			ctx.bezierCurveTo(250, 74, 258, 77, 273, 77);
			ctx.bezierCurveTo(288, 77, 302, 71, 308, 66);
			ctx.bezierCurveTo(314, 61, 319, 54, 319, 47);
			ctx.bezierCurveTo(320, 33, 321, 22, 320, 25);
			ctx.bezierCurveTo(320, 20, 325, 10, 330, 10);
			break;
	}

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.IOL.prototype.description = function() {
	var returnValue = "";
	
	switch (this.type) {
		case 'PC':
			returnValue = "Posterior Chamber IOL";
			break;
			
		case 'AC':
			returnValue = "Anterior Chamber IOL";
			break;
			
		case 'Iris Clip':
			returnValue = "Iris clip IOL";
			break;
	}

	// Displacement limit
	var limit = 40;

	var displacementValue = "";

	if (this.originY < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " superiorly";
	}
	if (this.originY > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += " inferiorly";
	}
	if (this.originX < -limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " temporally" : " nasally";
	}
	if (this.originX > limit) {
		if (displacementValue.length > 0) displacementValue += " and";
		displacementValue += (this.drawing.eye == ED.eye.Right) ? " nasally" : " temporally";
	}

	// Add displacement description
	if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;

	return returnValue;
}
