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
 * Patch
 *
 * @class Patch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Patch = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
	// Set classname
	this.className = "Patch";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Patch.prototype = new ED.Doodle;
ED.Patch.prototype.constructor = ED.Patch;
ED.Patch.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Patch.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	//this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Patch.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-20, +200);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -20);
}

/**
 * Sets default parameters
 */
ED.Patch.prototype.setParameterDefaults = function() {
	this.apexX = 50;
	this.apexY = -70;
	this.originY = -260;


	// Patchs are usually temporal
	//    if(this.drawing.eye == ED.eye.Right)
	//    {
	//        this.originX = -260;
	//        this.rotation = -Math.PI/4;
	//    }
	//    else
	//    {
	//        this.originX = 260;
	//        this.rotation = Math.PI/4;
	//    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patch.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Patch.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	ctx.rect(-50, -50, 100, 100);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(200,200,50,0.5)";
	ctx.strokeStyle = "rgba(120,120,120,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		//        // Suture knots
		//        this.drawSpot(ctx, -50, -50, 5, "blue");
		//        this.drawSpot(ctx, -50, 50, 5, "blue");
		//        this.drawSpot(ctx, 50, -50, 5, "blue");
		//        this.drawSpot(ctx, 50, 50, 5, "blue");
		//        
		//        // Suture thread ends
		//        this.drawLine(ctx, -60, -60, -50, -50, 2, "blue");
		//        this.drawLine(ctx, -50, -50, -60, -40, 2, "blue");
		//        this.drawLine(ctx, -60, 60, -50, 50, 2, "blue");
		//        this.drawLine(ctx, -50, 50, -60, 40, 2, "blue");
		//        this.drawLine(ctx, 60, -60, 50, -50, 2, "blue");
		//        this.drawLine(ctx, 50, -50, 60, -40, 2, "blue");
		//        this.drawLine(ctx, 60, 60, 50, 50, 2, "blue");
		//        this.drawLine(ctx, 50, 50, 60, 40, 2, "blue");
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(50, -50));
	//this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.Patch.prototype.description = function() {
	return "Scleral patch";
}
