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
 * Posterior chamber ICL
 *
 * @class ICL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ICL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ICL";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ICL.prototype = new ED.Doodle;
ED.ICL.prototype.constructor = ED.ICL;
ED.ICL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ICL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default properties
 */
ED.ICL.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ICL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ICL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius (used here to set handle location)
	var r = 280;
	
	// Optic
	ctx.moveTo(0, -218);
	ctx.bezierCurveTo(46, -217, 64, -203, 105, -201);
	ctx.bezierCurveTo(146, -199, 190, -190, 221, -190);
	ctx.bezierCurveTo(230, -190, 222, -198, 237, -197);
	ctx.bezierCurveTo(264, -196, 305, -207, 321, -176);
	ctx.bezierCurveTo(334, -149, 314, -143, 306, -118);
	ctx.bezierCurveTo(300, -60, 300, 60, 306, 118);
	ctx.bezierCurveTo(314, 143, 334, 149, 321, 176);
	ctx.bezierCurveTo(305, 207, 264, 196, 237, 197);
	ctx.bezierCurveTo(222, 198, 230, 190, 221, 190);
	ctx.bezierCurveTo(190, 190, 146, 199, 105, 201);
	ctx.bezierCurveTo(64, 203, 46, 217, 0, 218);
	ctx.bezierCurveTo(-46, 217, -64, 203, -105, 201)
	ctx.bezierCurveTo(-146, 199, -190, 190, -221, 190);
	ctx.bezierCurveTo(-230, 190, -222, 198, -237, 197);
	ctx.bezierCurveTo(-264, 196, -305, 207, -321, 176);
	ctx.bezierCurveTo(-334, 149, -314, 143, -306, 118);
	ctx.bezierCurveTo(-300, -60, -300, -60, -306, -118);
	ctx.bezierCurveTo(-314, -143, -334, -149, -321, -176);
	ctx.bezierCurveTo(-305, -207, -264, -196, -237, -197);
	ctx.bezierCurveTo(-222, -198, -230, -190, -221, -190);
	ctx.bezierCurveTo(-190, -190, -146, -199, -105, -201);
	ctx.bezierCurveTo(-64, -203, -46, -217, 0, -218);

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Curves near haptics
		ctx.beginPath();
		ctx.moveTo(-218, -192);
		ctx.bezierCurveTo(-228, -177, -279, -113, -279, 0);
		ctx.bezierCurveTo(-279, 113, -228, 177, -218, 192);
		ctx.moveTo(218, -192);
		ctx.bezierCurveTo(228, -177, 279, -113, 279, 0);
		ctx.bezierCurveTo(279, 113, 228, 177, 218, 192);
		ctx.stroke();
		
		// Central lenticule
		this.drawCircle(ctx, 0, 0, 170, "rgba(0,0,0,0)", 4, ctx.strokeStyle);
		
		// Spots
		this.drawCircle(ctx, -200, 0, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, 200, 0, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, -280, -160, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, 280, 160, 8, ctx.fillStyle, 4, ctx.strokeStyle);
	}

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
ED.ICL.prototype.description = function() {
	var returnValue = "Implantable Collamer Lens";

	return returnValue;
}
