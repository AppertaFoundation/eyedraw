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
 * Ear Drum
 *
 * @class EarDrum
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.EarDrum = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "EarDrum";

	// Saved parameters
	//this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.EarDrum.prototype = new ED.Doodle;
ED.EarDrum.prototype.constructor = ED.EarDrum;
ED.EarDrum.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.EarDrum.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.EarDrum.prototype.setParameterDefaults = function() {
	//this.originY = -70;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EarDrum.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.EarDrum.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Ear drum boundary
	ctx.moveTo(-319, -94);
	ctx.bezierCurveTo(-321, -68, -330, 81, -278, 194);
	ctx.bezierCurveTo(-247, 261, -175, 336, -105, 371);
	ctx.bezierCurveTo(-58, 395, -5, 397, 46, 395);
	ctx.bezierCurveTo(166, 390, 231, 294, 236, 287);
	ctx.bezierCurveTo(301, 194, 347, 8, 322, -133);
	ctx.bezierCurveTo(304, -234, 284, -259, 251, -302);
	ctx.bezierCurveTo(191, -383, 69, -373, 15, -373);
	ctx.bezierCurveTo(-10, -373, -23, -393, -61, -390);
	ctx.bezierCurveTo(-93, -388, -107, -366, -141, -352);
	ctx.bezierCurveTo(-167, -337, -194, -345, -211, -330);
	ctx.bezierCurveTo(-229, -313, -236, -289, -254, -253);
	ctx.bezierCurveTo(-271, -218, -308, -152, -319, -94);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245,224,173,0.5)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.fillStyle = "rgba(255,255,255,0";
		
		// Wavy bit across top
		ctx.beginPath();
		ctx.moveTo(-237, -255);
		ctx.bezierCurveTo(-224, -269, -198, -270, -175, -272);
		ctx.bezierCurveTo(-151, -274, -127, -268, -92, -279);
		ctx.bezierCurveTo(-58, -290, -44, -303, -31, -314);
		ctx.bezierCurveTo(-18, -325, -4, -339, 30, -348);
		ctx.stroke();

		// Big separator with the notch
		ctx.beginPath();		
		ctx.moveTo(328, -14);
		ctx.bezierCurveTo(334, -136, 269, -283, 204, -320);
		ctx.bezierCurveTo(139, -357, 94, -347, 47, -339);
		ctx.bezierCurveTo(17, -332, -5, -304, -25, -291);
		ctx.bezierCurveTo(-46, -278, -71, -268, -86, -255);
		ctx.bezierCurveTo(-102, -242, -102, -227, -107, -212);
		ctx.bezierCurveTo(-112, -200, -115, -200, -128, -200);
		ctx.bezierCurveTo(-143, -201, -143, -202, -152, -212);
		ctx.bezierCurveTo(-162, -223, -156, -244, -169, -248);
		ctx.bezierCurveTo(-182, -251, -204, -246, -204, -246);
		ctx.bezierCurveTo(-259, -227, -321, -138, -321, -63);
		ctx.stroke();
		
		// Shading at top
		ctx.beginPath();
		ctx.moveTo(-207, -282);
		ctx.bezierCurveTo(-179, -279, -164, -280, -143, -292);
		ctx.moveTo(-207, -292);
		ctx.bezierCurveTo(-197, -289, -181, -290, -165, -295);
		ctx.moveTo(-201, -302);
		ctx.bezierCurveTo(-193, -299, -182, -302, -174, -305);
		ctx.moveTo(-96, -345);
		ctx.bezierCurveTo(-88, -351, -87, -352, -82, -363);
		ctx.moveTo(-92, -335);
		ctx.bezierCurveTo(-83, -341, -75, -349, -70, -359);
		ctx.moveTo(-92, -321);
		ctx.bezierCurveTo(-76, -330, -65, -345, -58, -359);
		ctx.moveTo(-87, -308);
		ctx.bezierCurveTo(-71, -317, -50, -339, -44, -354);
		ctx.moveTo(-87, -297);
		ctx.bezierCurveTo(-70, -308, -45, -327, -33, -348);
		ctx.moveTo(-82, -290);
		ctx.bezierCurveTo(-62, -301, -33, -324, -18, -348);
		ctx.stroke();
		
		// Large toungey thing
		ctx.beginPath();		
		ctx.moveTo(-204, -246);
		ctx.bezierCurveTo(-189, -199, -146, -200, -123, -195);
		ctx.bezierCurveTo(-99, -189, -91, -152, -92, -120);
		ctx.bezierCurveTo(-92, -88, -100, -58, -92, -21);
		ctx.bezierCurveTo(-83, 16, -55, 40, -47, 64);
		ctx.bezierCurveTo(-40, 87, -53, 99, -44, 117);
		ctx.bezierCurveTo(-38, 128, -38, 135, -18, 137);
		ctx.bezierCurveTo(1, 140, 2, 131, 7, 120);
		ctx.bezierCurveTo(16, 99, 16, 86, 10, 63);
		ctx.bezierCurveTo(4, 40, -20, 8, -27, -66);
		ctx.bezierCurveTo(-33, -129, -17, -167, -3, -223);
		ctx.bezierCurveTo(12, -278, 58, -321, 99, -345);
		ctx.setLineDash([10]);
		ctx.stroke();
		
		// Small toungey thing
		ctx.beginPath();		
		ctx.moveTo(56, -315);
		ctx.bezierCurveTo(56, -315, 68, -321, 84, -308);
		ctx.bezierCurveTo(100, -296, 126, -182, 137, -158);
		ctx.bezierCurveTo(148, -135, 143, -130, 159, -130);
		ctx.bezierCurveTo(175, -130, 183, -136, 185, -162);
		ctx.bezierCurveTo(187, -188, 169, -293, 151, -340);
		ctx.setLineDash([10]);
		ctx.stroke();
		
		// Lines
		ctx.beginPath();
		ctx.moveTo(-165, 230);
		ctx.lineTo(-44, 117);
		ctx.moveTo(-63, 356);
		ctx.lineTo(-1, 138);
		ctx.setLineDash([30,10]);
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}