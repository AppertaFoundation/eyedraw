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
 * @param {Object} _parameterJSON
 */
ED.Patch = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Patch";

	// Other parameters
	this.material = 'Sclera';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'width', 'height', 'apexX'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'material':'Material'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
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
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Size, false);
}

/**
 * Sets default dragging attributes
 */
ED.Patch.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['material'] = {
		kind: 'other',
		type: 'string',
		list: ['Sclera', 'Tenons', 'Tutoplast'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Patch.prototype.setParameterDefaults = function() {
	this.width = 200;
	this.height = 200;

	this.setParameterFromString('material', 'Sclera');
	
	// Position over tube if present
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		var isRE = (this.drawing.eye == ED.eye.Right);
		
		switch (doodle.platePosition) {
			case 'STQ':
				this.originX = isRE?-350:+350;
				this.originY = -350;
				this.rotation = (isRE?7:1) * Math.PI/4;
				break;
			case 'SNQ':
				this.originX = isRE?+350:-350;
				this.originY = -350;
				this.rotation = (isRE?1:7) * Math.PI/4;
				break;
			case 'INQ':
				this.originX = isRE?+350:-350;
				this.originY = +350;
				this.rotation = (isRE?3:5) * Math.PI/4;
				break;
			case 'ITQ':
				this.originX = isRE?-350:+350;
				this.originY = +350;
				this.rotation = (isRE?5:3) * Math.PI/4;
				break;	
		}
	}

	// Different size and position for a trabeculectomy flap
	var doodle = this.drawing.lastDoodleOfClass("TrabyFlap");
	if (doodle) {
		this.originY = -360;
		this.width = 488;
		this.height = 228;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Patch.prototype.draw = function(_point) {console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Patch.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
	ctx.closePath();

	// Colour of fill
	switch (this.material) {
		case 'Sclera':
			ctx.fillStyle = "rgba(200,200,50,0.5)";
			break;
		case 'Tenons':
			ctx.fillStyle = "rgba(200,200,200,0.5)";
			break;
		case 'Tutoplast':
			ctx.fillStyle = "rgba(230,230,230,0.5)";
			break;
	}
	ctx.strokeStyle = "rgba(120,120,120,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var xd = this.width/2;
		var yd = this.height/2 - 10;

		// Suture knots
		this.drawSpot(ctx, -xd, -yd, 5, "blue");
		this.drawSpot(ctx, -xd, yd, 5, "blue");
		this.drawSpot(ctx, xd, -yd, 5, "blue");
		this.drawSpot(ctx, xd, yd, 5, "blue");
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(this.width / 2, -this.height / 2));

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
	return this.material + " patch";
}
