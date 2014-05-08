/**
 * @fileOverview Contains doodle subclasses for glaucoma
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 28th Ootober 2011
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") {
	var ED = new Object();
}

/**
 * Heart
 *
 * @class Heart
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Heart = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Heart";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Heart.prototype = new ED.Doodle;
ED.Heart.prototype.constructor = ED.Heart;
ED.Heart.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Heart.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Heart.prototype.setPropertyDefaults = function() {
	//this.isDeletable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Heart.prototype.setParameterDefaults = function() {
	this.apexX = -460;
	this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Heart.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Heart.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		ctx.moveTo(-287, -51);

		ctx.bezierCurveTo(-344, 53, -346, 243, -116, 209);
		ctx.bezierCurveTo(5, 297, 269, 341, 312, 268);
		ctx.bezierCurveTo(387, 141, 319, -17, 237, -59);
		ctx.bezierCurveTo(225, -133, 141, -209, 65, -215);
		ctx.bezierCurveTo(55, -209, 43, -219, 53, -193);
		ctx.bezierCurveTo(133, -185, 201, -129, 216, -46);
		ctx.bezierCurveTo(205, -23, 167, 11, 187, 25);
		ctx.bezierCurveTo(202, 36, 192, -37, 235, -3);
		ctx.bezierCurveTo(291, 41, 333, 227, 295, 207);
		ctx.bezierCurveTo(195, 155, 153, 111, 97, 43);
		ctx.bezierCurveTo(74, 15, 177, 62, 181, 43);
		ctx.bezierCurveTo(187, 17, 109, 25, 55, 19);
		ctx.bezierCurveTo(31, -7, -172, -89, -173, -87);
		ctx.bezierCurveTo(-173, -84, -232, -117, -191, -73);
		ctx.bezierCurveTo(-115, -49, -61, -13, -37, -3);
		ctx.bezierCurveTo(-67, 45, -14, 171, 3, 165);
		ctx.bezierCurveTo(21, 159, -53, 45, 15, 23);
		ctx.bezierCurveTo(103, 87, 199, 183, 231, 249);
		ctx.bezierCurveTo(199, 297, -31, 243, -81, 199);
		ctx.bezierCurveTo(-53, 175, -8, 204, -13, 187);
		ctx.bezierCurveTo(-17, 171, -66, 181, -105, 185);
		ctx.bezierCurveTo(-331, 209, -289, 33, -273, -37);
		ctx.bezierCurveTo(-270, -47, -287, -51, -287, -51);


		ctx.closePath();

		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(200, 200, 200, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Heart.prototype.description = function() {
	return "Heart";
}

/**
 * Aorta
 *
 * @class Aorta
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Aorta = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Aorta";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Aorta.prototype = new ED.Doodle;
ED.Aorta.prototype.constructor = ED.Aorta;
ED.Aorta.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Aorta.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Aorta.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Aorta.prototype.setParameterDefaults = function() {
	this.scaleX = 0.5;
	this.scaleY = 0.5;
	this.originX = -352;
	this.originY = -416;
	this.apexX = -460;
	this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Aorta.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Aorta.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		ctx.moveTo(216, -112);
		ctx.bezierCurveTo(216, -112, 181, 46, 210, 40);
		ctx.bezierCurveTo(239, 33, 282, -111, 282, -111);

		ctx.moveTo(423, 335);
		ctx.bezierCurveTo(423, 335, 453, 57, 313, 31);
		ctx.bezierCurveTo(281, 26, 330, -100, 330, -100);

		ctx.moveTo(-1, -25);
		ctx.bezierCurveTo(-1, -25, 57, 2, 74, 41);
		ctx.bezierCurveTo(82, 61, 93, 79, 116, 78);
		ctx.bezierCurveTo(144, 78, 141, 42, 141, 7);
		ctx.bezierCurveTo(141, -50, 159, -97, 159, -97);

		ctx.moveTo(198, 582);
		ctx.bezierCurveTo(214, 619, 155, 663, 105, 649);

		ctx.moveTo(-39, 12);
		ctx.bezierCurveTo(-39, 12, 52, 54, 28, 133);
		ctx.bezierCurveTo(28, 133, -2, 180, -16, 200);
		ctx.bezierCurveTo(-49, 246, -125, 446, -28, 595);
		ctx.lineTo(-1, 640);
		ctx.bezierCurveTo(67, 725, 152, 624, 119, 566);
		ctx.bezierCurveTo(151, 598, 255, 603, 251, 514);
		ctx.bezierCurveTo(250, 473, 182, 418, 182, 418);
		ctx.bezierCurveTo(118, 352, 162, 209, 254, 211);
		ctx.bezierCurveTo(314, 212, 287, 365, 287, 365);

		//ctx.closePath();

		ctx.lineWidth = 12;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(100, 100, 100, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Aorta.prototype.description = function() {
	return "";
}

/**
 * RightCoronaryArtery
 *
 * @class RightCoronaryArtery
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RightCoronaryArtery = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RightCoronaryArtery";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RightCoronaryArtery.prototype = new ED.Doodle;
ED.RightCoronaryArtery.prototype.constructor = ED.RightCoronaryArtery;
ED.RightCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RightCoronaryArtery.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.RightCoronaryArtery.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.RightCoronaryArtery.prototype.setParameterDefaults = function() {
	this.originX = 24;
	this.originY = 2;
	this.scaleX = 1.5;
	this.scaleY = 1.5;
	this.apexX = -460;
	this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RightCoronaryArtery.prototype.draw = function(_point) {
	//console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RightCoronaryArtery.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		ctx.moveTo(-254, -66);
		ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
		ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
		ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);

		ctx.moveTo(-244, -58);
		ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
		ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
		ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);

		ctx.moveTo(-54, 292);
		ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
		ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);

		ctx.moveTo(-82, 306);
		ctx.lineTo(-142, 247);

		ctx.moveTo(-42, 286);
		ctx.lineTo(-96, 232);
		ctx.bezierCurveTo(-84, 218, -36, 250, -24, 276);

		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(100, 100, 100, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.RightCoronaryArtery.prototype.description = function() {
	return "";
}

/**
 * LeftCoronaryArtery
 *
 * @class LeftCoronaryArtery
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.LeftCoronaryArtery = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "LeftCoronaryArtery";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.LeftCoronaryArtery.prototype = new ED.Doodle;
ED.LeftCoronaryArtery.prototype.constructor = ED.LeftCoronaryArtery;
ED.LeftCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LeftCoronaryArtery.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.LeftCoronaryArtery.prototype.setPropertyDefaults = function() {
	//this.isSelectable= false;
	this.isDeletable = false;

	// Update component of validation array for simple parameters
	//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.LeftCoronaryArtery.prototype.setParameterDefaults = function() {

	this.originY = 0;
	this.scaleX = 1.5;
	this.scaleY = 1.5;
	this.apexX = -153;
	this.apexY = -84;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LeftCoronaryArtery.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.LeftCoronaryArtery.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(-100, -50, 100, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Start segment
		//ctx.moveTo(-210, -94);
		ctx.moveTo(this.apexX, this.apexY);
		//ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
		ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
		ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
		ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);

		ctx.moveTo(68, 136);
		ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
		ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
		ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
		ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
		ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);

		ctx.moveTo(200, 257);
		ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
		ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
		ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);

		ctx.moveTo(67, 143);
		ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
		ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
		ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);

		ctx.moveTo(103, 218);
		ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
		ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);

		ctx.moveTo(195, 136);
		ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
		ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
		ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);

		ctx.moveTo(164, 284);
		ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
		ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);

		ctx.lineTo(-6, 94);
		ctx.moveTo(221, 80);

		ctx.moveTo(135, -33);
		ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
		ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
		ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
		ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
		//
		ctx.moveTo(190, 133);
		ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
		ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);

		// Repairs
		ctx.moveTo(-4, 98);
		ctx.bezierCurveTo(-10, 136, -10, 136, -22, 156);

		ctx.moveTo(58, -10);
		ctx.bezierCurveTo(62, 18, 62, 18, 54, 42);

		ctx.moveTo(102, 10);
		ctx.bezierCurveTo(106, 38, 106, 38, 102, 56);

		ctx.moveTo(222, 90);
		ctx.bezierCurveTo(242, 92, 242, 92, 258, 94);

		ctx.moveTo(258, 142);
		ctx.bezierCurveTo(340, 264, 316, 250, 204, 244);

		ctx.moveTo(258, 142);
		ctx.bezierCurveTo(264, 164, 264, 164, 260, 176);

		ctx.moveTo(54, -12);
		ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
		ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);

		// End segment
		ctx.moveTo(-38, 158);
		ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
		if (this.apexX > -200) ctx.bezierCurveTo(-152, -40, -146, -27, this.apexX - 20, this.apexY);
		else ctx.bezierCurveTo(-152, -40, -146, -27, this.apexX - 8, this.apexY + 15);

		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(100, 100, 100, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.LeftCoronaryArtery.prototype.description = function() {
	if (this.apexX < -200) return "Anomalous insertion of left coronary artery";
	else return "";
}

/**
 * AnomalousVessels
 *
 * @class AnomalousVessels
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AnomalousVessels = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AnomalousVessels";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AnomalousVessels.prototype = new ED.Doodle;
ED.AnomalousVessels.prototype.constructor = ED.AnomalousVessels;
ED.AnomalousVessels.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AnomalousVessels.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AnomalousVessels.prototype.setPropertyDefaults = function() {
	//this.isSelectable= false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.AnomalousVessels.prototype.setParameterDefaults = function() {
	//    this.originX = -500;
	this.originY = -100;
	this.scaleX = 1.5;
	this.scaleY = 1.5;
	this.apexX = -460;
	this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AnomalousVessels.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.AnomalousVessels.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		ctx.moveTo(68, 136);
		ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
		ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
		ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
		ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
		ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);



		ctx.moveTo(200, 257);
		ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
		ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
		ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);

		ctx.lineTo(254, 89);
		ctx.moveTo(-6, 94);
		ctx.bezierCurveTo(-8, 113, -11, 132, -33, 164);

		ctx.moveTo(67, 143);
		ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
		ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
		ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);

		ctx.moveTo(103, 218);
		ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
		ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);

		ctx.moveTo(-54, 292);
		ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
		ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);

		ctx.lineTo(-91, 307);

		ctx.moveTo(195, 136);
		ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
		ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
		ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);

		ctx.moveTo(164, 284);
		ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
		ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);

		ctx.lineTo(-6, 94);
		ctx.moveTo(221, 80);
		//ctx.lineTo(257, 151);

		ctx.moveTo(257, 151);
		ctx.bezierCurveTo(257, 151, 278, 176, 288, 190);
		ctx.bezierCurveTo(297, 204, 312, 227, 304, 240);
		ctx.bezierCurveTo(291, 264, 223, 250, 200, 250);

		ctx.moveTo(-14, 278);
		ctx.bezierCurveTo(-14, 278, -49, 217, -98, 230);

		//ctx.lineTo(-48, 290);

		ctx.moveTo(135, -33);
		ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
		ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
		ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
		ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
		//
		ctx.moveTo(190, 133);
		ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
		ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);

		ctx.moveTo(54, -12);
		ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
		ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);

		ctx.moveTo(-210, -104);
		ctx.bezierCurveTo(-253, -100, -259, -73, -254, -66);
		ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
		ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
		ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);

		ctx.moveTo(-38, 158);
		ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
		ctx.bezierCurveTo(-152, -40, -206, -27, -238, -56);

		ctx.moveTo(-244, -58);
		ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
		ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
		ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);

		ctx.moveTo(-210, -94);
		ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
		ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
		ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
		ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);

		//ctx.closePath();

		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(200, 200, 200, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.AnomalousVessels.prototype.description = function() {
	return "AnomalousVessels";
}





/**
 * Bypass
 *
 * @class Bypass
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Bypass = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Bypass";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Bypass.prototype = new ED.Doodle;
ED.Bypass.prototype.constructor = ED.Bypass;
ED.Bypass.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bypass.prototype.setHandles = function() {
	//	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Bypass.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	// Update component of validation array for simple parameters
	//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bypass.prototype.setParameterDefaults = function() {
	var num = this.drawing.numberOfDoodlesOfClass(this.className);

	if (num == 0) {
		this.apexX = 40;
		this.apexY = -60;
	} else if (num == 1) {
		this.apexX = -11;
		this.apexY = 133;
	} else {
		this.apexX = -445;
		this.apexY = 205;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bypass.prototype.draw = function(_point) {
	//console.log(this.apexX, this.apexY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Bypass.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Start point and end point
	var startPoint = new ED.Point(-320, -200);
	var endPoint = new ED.Point(this.apexX, this.apexY);

	var d = startPoint.distanceTo(endPoint);
	var r = 20;
	var phi = Math.PI / 8;

	// Start point
	ctx.moveTo(startPoint.x, startPoint.y);

	// Calculate angle to apex point
	var angleToApex = Math.atan((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
	if (angleToApex < 0) angleToApex = Math.PI / 2 + (Math.PI / 2 + angleToApex);

	var firstPoint = new ED.Point(0, 0);
	firstPoint.setWithPolars(r, angleToApex);

	var firstControlPoint = new ED.Point(0, 0);
	firstControlPoint.setWithPolars(d / 2, angleToApex + Math.PI / 2 - phi);

	var secondPoint = new ED.Point(firstPoint.x + endPoint.x, firstPoint.y + endPoint.y);

	var fourthPoint = new ED.Point(0, 0);
	fourthPoint.setWithPolars(r, angleToApex + Math.PI);

	var thirdPoint = new ED.Point(fourthPoint.x + endPoint.x, fourthPoint.y + endPoint.y);


	ctx.lineTo(startPoint.x + firstPoint.x, startPoint.y + firstPoint.y);

	//ctx.lineTo(startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y);
	//ctx.lineTo(secondPoint.x, secondPoint.y);
	ctx.bezierCurveTo(startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y, startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y, secondPoint.x, secondPoint.y);



	//ctx.lineTo(x + (this.apexX - x)/2, y + (this.apexY - y)/2 - d);
	//ctx.lineTo(this.apexX, this.apexY);
	//ctx.bezierCurveTo(cpX, cpY, cpX, cpY, this.apexX, this.apexY - r);
	ctx.lineTo(endPoint.x, endPoint.y);
	ctx.lineTo(thirdPoint.x, thirdPoint.y);

	//ctx.lineTo(startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y);
	//ctx.lineTo(startPoint.x + fourthPoint.x, startPoint.y + fourthPoint.y);
	ctx.bezierCurveTo(startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y, startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y, startPoint.x + fourthPoint.x, startPoint.y + fourthPoint.y);

	ctx.closePath();


	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 000, 000, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	//this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Calculate arc (Arc property not used naturally in this doodle)
	this.leftExtremity = this.transform.transformPoint(new ED.Point(-40, -40));
	this.rightExtremity = this.transform.transformPoint(new ED.Point(40, -40));
	this.arc = this.calculateArc();

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bypass.prototype.description = function() {
	var artery = "";

	// Size description
	if (this.apexX > 0) artery = "left coronary artery";
	else if (this.apexX > -300) artery = "circumflex artery";
	else artery = "right coronary artery";

	return "Bypass graft to " + artery;
}



/**
 * MetalStent
 *
 * @class MetalStent
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MetalStent = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MetalStent";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MetalStent.prototype = new ED.Doodle;
ED.MetalStent.prototype.constructor = ED.MetalStent;
ED.MetalStent.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MetalStent.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.MetalStent.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MetalStent.prototype.setParameterDefaults = function() {
	this.originX = -18;
	this.originY = 86;
	this.rotation = -4.985446531081719;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MetalStent.prototype.draw = function(_point) {
	console.log(this.originX, this.originY, this.rotation);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MetalStent.superclass.draw.call(this, _point);

	// Stent radius
	var r = 50;
	var w = 10;
	var d = 10

	// Boundary path
	ctx.beginPath();

	// Exudate
	ctx.rect(-r, -w, 2 * r, 2 * w);

	// Set attributes
	ctx.lineWidth = 4;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		for (var i = 0; i < 10; i++) {
			ctx.moveTo(-r + i * d, -w);
			ctx.lineTo(-r + i * d, +w);
		}
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(-50, -10);
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
ED.MetalStent.prototype.description = function() {
	var artery;
	if (this.originX > 0) artery = "left coronary artery";
	else if (this.originX > -300) artery = "circumflex artery";
	else artery = "right coronary artery";

	return "Metal stent in " + artery;
}

/**
 * DrugStent
 *
 * @class DrugStent
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.DrugStent = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "DrugStent";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.DrugStent.prototype = new ED.Doodle;
ED.DrugStent.prototype.constructor = ED.DrugStent;
ED.DrugStent.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DrugStent.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.DrugStent.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DrugStent.prototype.setParameterDefaults = function() {
	this.originX = -18;
	this.originY = 86;
	this.rotation = -4.985446531081719;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DrugStent.prototype.draw = function(_point) {
	console.log(this.originX, this.originY, this.rotation);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DrugStent.superclass.draw.call(this, _point);

	// Stent radius
	var r = 50;
	var w = 10;
	var d = 20;

	// Boundary path
	ctx.beginPath();

	// Exudate
	ctx.rect(-r, -w, 2 * r, 2 * w);

	// Set attributes
	ctx.lineWidth = 4;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		for (var i = 0; i < 5; i++) {
			ctx.moveTo(-r + i * d, -w);
			ctx.lineTo(-r + (i + 1) * d, +w);
			ctx.moveTo(-r + (i + 1) * d, -w);
			ctx.lineTo(-r + i * d, +w);
		}
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(-50, -10);
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
ED.DrugStent.prototype.description = function() {
	var artery;
	if (this.originX > 0) artery = "left coronary artery";
	else if (this.originX > -300) artery = "circumflex artery";
	else artery = "right coronary artery";

	return "Metal stent in " + artery;
}

/**
 * Stenosis
 *
 * @class Stenosis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Stenosis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Stenosis";

	// Derived parameters
	this.degree = 0;
	this.type = "Calcified";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Stenosis.prototype = new ED.Doodle;
ED.Stenosis.prototype.constructor = ED.Stenosis;
ED.Stenosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Stenosis.prototype.setHandles = function() {
	//this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Stenosis.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-10, +10);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
	//    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
	//    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	//    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['degree'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0, 100),
		precision: 0,
		animate: true
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Calcified', 'Non-calcified'],
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Stenosis.prototype.setParameterDefaults = function() {
	this.setParameterFromString('degree', '0');
	this.setParameterFromString('type', 'Calcified');
	this.apexX = 0;
	this.apexY = 0;

	this.originX = -373;
	this.originY = 323;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Stenosis.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexX':
			returnArray['type'] = _value > 0 ? "Calcified" : "Non-calcified";
			break;

		case 'apexY':
			returnArray['degree'] = _value / -1;
			break;

		case 'type':
			returnArray['apexX'] = _value == "Calcified" ? +10 : -10;
			break;

		case 'degree':
			returnArray['apexY'] = -1 * _value;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Stenosis.prototype.draw = function(_point) {
	//console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Stenosis.superclass.draw.call(this, _point);

	// Exudate radius
	var r = 100;

	// Boundary path
	ctx.beginPath();

	// Stenosis
	ctx.arc(0, 0, 30, 0, 2 * Math.PI, false);

	// Set attributes
	ctx.lineWidth = 2;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "blue";
	//    if (this.apexX > 0) ctx.fillStyle = "rgba(0, 0, 255," + (this.apexY/-100) + ")";
	//    else ctx.fillStyle = "rgba(0, 255, 0," + (this.apexY/-100) + ")";
	ctx.fillStyle = "rgba(155, 155, 0," + (this.apexY / -100) + ")";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		if (this.type == "Calcified") {
			ctx.beginPath();
			ctx.arc(-10, -10, 8, 0, 2 * Math.PI, false);
			ctx.moveTo(+10, -10);
			ctx.arc(+10, -10, 8, 0, 2 * Math.PI, false);
			ctx.moveTo(+10, +10);
			ctx.arc(+10, +10, 8, 0, 2 * Math.PI, false);
			ctx.moveTo(-10, +10);
			ctx.arc(-10, +10, 8, 0, 2 * Math.PI, false);

			ctx.fillStyle = "white";
			ctx.fill();

		}
		//        ctx.fillStyle = "blue";
		//
		//        ctx.beginPath();
		//        ctx.moveTo(-100, -50);
		//        ctx.bezierCurveTo(this.apexX, this.apexY, this.apexX, this.apexY, 100, -50);
		//        ctx.closePath();
		//        ctx.fill();
		//
		//        ctx.beginPath();
		//        ctx.moveTo(-100, 50);
		//        ctx.bezierCurveTo(this.apexX, -this.apexY, this.apexX, -this.apexY, 100, 50);
		//        ctx.closePath();
		//        ctx.fill();
	}

	// Coordinates of handles (in canvas plane)
	point = new ED.Point(this.apexX, this.apexY);
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
ED.Stenosis.prototype.description = function() {
	var artery;
	if (this.originX > 0) artery = "left coronary artery";
	else if (this.originX > -300) artery = "circumflex artery";
	else artery = "right coronary artery";

	return this.degree.toString() + "% " + this.type + " stenosis in the " + artery;
}

/**
 * Groin
 *
 * @class Groin
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Groin = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Groin";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Groin.prototype = new ED.Doodle;
ED.Groin.prototype.constructor = ED.Groin;
ED.Groin.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Groin.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Groin.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Groin.prototype.setParameterDefaults = function() {}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Groin.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Groin.superclass.draw.call(this, _point);

	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.moveTo(12, 49);
	ctx.bezierCurveTo(37, 49, 68, 24, 68, 24);
	ctx.bezierCurveTo(73, 42, 136, 318, 136, 318);

	ctx.lineTo(460, 318);
	ctx.bezierCurveTo(460, 318, 468, 191, 468, 159);
	ctx.bezierCurveTo(468, 127, 451, -48, 451, -67);
	ctx.bezierCurveTo(451, -87, 444, -188, 444, -215);
	ctx.bezierCurveTo(444, -242, 407, -402, 407, -402);

	ctx.lineTo(-380, -402);
	ctx.bezierCurveTo(-380, -402, -417, -242, -417, -215);
	ctx.bezierCurveTo(-417, -189, -423, -87, -423, -67);
	ctx.bezierCurveTo(-423, -48, -440, 127, -440, 159);
	ctx.bezierCurveTo(-440, 191, -432, 318, -432, 318);

	ctx.lineTo(-112, 318);
	ctx.lineTo(-40, 24);
	ctx.bezierCurveTo(-27, 39, -10, 49, 15, 49);

	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 175, 175, 0.5)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		ctx.moveTo(-228, -189);

		ctx.lineTo(-158, -155);
		ctx.bezierCurveTo(-158, -155, -109, -113, -88, -75);
		ctx.bezierCurveTo(-74, -51, -65, -5, -40, 24);

		ctx.moveTo(255, -189);
		ctx.lineTo(186, -155);
		ctx.bezierCurveTo(186, -155, 136, -113, 115, -75);
		ctx.bezierCurveTo(102, -51, 92, -5, 68, 23);

		ctx.lineWidth = 4;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.strokeStyle = "rgba(100, 100, 100, 1)";
		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Groin.prototype.description = function() {
	return "Groin";
}

/**
 * Blot Haemorrhage
 *
 * @class Haematoma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Haematoma = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Haematoma";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Haematoma.prototype = new ED.Doodle;
ED.Haematoma.prototype.constructor = ED.Haematoma;
ED.Haematoma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Haematoma.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Haematoma.prototype.setParameterDefaults = function() {
	this.originX = -150;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Haematoma.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Haematoma.superclass.draw.call(this, _point);

	// Exudate radius
	var r = 30;

	// Boundary path
	ctx.beginPath();

	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Haematoma.prototype.groupDescription = function() {
	return "Haematoma";
}


/**
 * Blot Haemorrhage
 *
 * @class Bruising
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Bruising = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Bruising";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Bruising.prototype = new ED.Doodle;
ED.Bruising.prototype.constructor = ED.Bruising;
ED.Bruising.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bruising.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bruising.prototype.setParameterDefaults = function() {
	this.originX = -190;
	this.originY = 100;
	this.scaleY = 2;
}

/**
 * Sets default dragging attributes
 */
ED.Bruising.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	//    // Update component of validation array for simple parameters
	//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-10, +10);
	//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
	//    //    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
	//    //    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	//    //    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
	//
	//    // Add complete validation arrays for derived parameters
	//    this.parameterValidationArray['degree'] = {kind:'derived', type:'int', range:new ED.Range(0, 100), precision:0, animate:true};
	//    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Calcified', 'Non-calcified'], animate:true};
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bruising.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Bruising.superclass.draw.call(this, _point);

	// Exudate radius
	var r = 100;

	// Boundary path
	ctx.beginPath();

	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(127, 0, 127, 0.5)";
	ctx.fillStyle = "rgba(127, 0, 127, 0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Bruising.prototype.description = function() {
	return "Bruising";
}

/**
 * Bruit
 *
 * @class Bruit
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Bruit = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Bruit";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Bruit.prototype = new ED.Doodle;
ED.Bruit.prototype.constructor = ED.Bruit;
ED.Bruit.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bruit.prototype.setHandles = function() {
	//	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	//	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Bruit.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bruit.prototype.setParameterDefaults = function() {
	this.scaleX = 0.6;
	this.scaleY = 0.6;

	this.originX = -150;
	this.originY = -62;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bruit.prototype.draw = function(_point) {
	//console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Bruit.superclass.draw.call(this, _point);

	// Exudate radius
	var r = 100;

	// Boundary path
	ctx.beginPath();

	// Exudate
	ctx.arc(0, -50, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(155, 255, 255, 0)";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.fillStyle = "gray";
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 8;

		// Red centre
		ctx.beginPath();
		ctx.arc(-50, 0, 20, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(-34, 0);
		ctx.lineTo(-34, -100);
		ctx.lineTo(0, -80);

		ctx.stroke();

	}

	// Coordinates of handles (in canvas plane)
	//    var point = new ED.Point(0, 0);
	//    point.setWithPolars(rc, Math.PI/4);
	//	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
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
ED.Bruit.prototype.description = function() {
	//    var lung = this.originX > 0?" left lung":" right lung";
	//    var lobe = this.originY > 0?" lower lobe of":" upper lobe of";

	return 'Bruit';
}
