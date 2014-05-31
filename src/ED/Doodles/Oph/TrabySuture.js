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
 * TrabySuture suture
 *
 * @class TrabySuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TrabySuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TrabySuture";

	// Derived parameters
	this.type = 'Fixed';
	this.material = 'Nylon';
	this.size = '10/0';

	// Number of additional handles for releasable suture
	this.numberOfHandles = 5;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY', 'arc', 'rotation', 'type', 'material', 'size'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Shape', 'material':'Material', 'size':'Size'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TrabySuture.prototype = new ED.Doodle;
ED.TrabySuture.prototype.constructor = ED.TrabySuture;
ED.TrabySuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TrabySuture.prototype.setHandles = function() {
	// Rotation Handle
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.TrabySuture.prototype.setPropertyDefaults = function() {
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(+70, +70);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Fixed', 'Adjustable', 'Releasable'],
		animate: false
	};
	this.parameterValidationArray['material'] = {
		kind: 'derived',
		type: 'string',
		list: ['Nylon', 'Prolene', 'Vicryl', 'Silk'],
		animate: false
	}
	this.parameterValidationArray['size'] = {
		kind: 'derived',
		type: 'string',
		list: ['11/0', '10/0', '9/0', '8/0', '7/0', '6/0'],
		animate: false
	}
}

/**
 * Sets default parameters
 */
ED.TrabySuture.prototype.setParameterDefaults = function() {
	this.apexX = +50;
	this.apexY = +70;
	this.material = 'Nylon';
	this.size = '10/0';
	
	// Suture position depends on presence of a trabeculectomy flap
	var trabyFlap = this.drawing.lastDoodleOfClass('TrabyFlap');
	if (trabyFlap) {
		var number = this.drawing.numberOfDoodlesOfClass("TrabySuture");
		var gsf = this.drawing.globalScaleFactor;
		var p;
		
		switch (number) {
			// First suture is top left
			case 0:
				p = new ED.Point(-1 * trabyFlap.right.x * gsf, (trabyFlap.height + 0 * (trabyFlap.right.y - trabyFlap.height)) * gsf);
				p.setWithPolars(p.length(), p.direction() + trabyFlap.rotation);
				this.originX = p.x;
				this.originY = p.y;
				this.rotation = trabyFlap.rotation;
				this.scaleX = this.scaleX * -1;
				break;
			// Second suture is top right
			case 1:
				p = new ED.Point(+1 * trabyFlap.right.x * gsf, (trabyFlap.height + 0 * (trabyFlap.right.y - trabyFlap.height)) * gsf);
				p.setWithPolars(p.length(), p.direction() + trabyFlap.rotation);
				this.originX = p.x;
				this.originY = p.y;
				this.rotation = trabyFlap.rotation;
				break;
			case 2:
				var doodle1 = this.drawing.firstDoodleOfClass("TrabySuture");
				var doodle2 = this.drawing.lastDoodleOfClass("TrabySuture");
				this.originX = doodle1.originX + (doodle2.originX - doodle1.originX)/2;
				this.originY = doodle1.originY + (doodle2.originY - doodle1.originY)/2;
				this.rotation = doodle2.rotation;
				break;
			default:
				this.setOriginWithDisplacements(0, -40);
				break;
		}
		
	}
	else {
		this.setOriginWithDisplacements(0, -40);
	}

	// Make type same as last one
	var doodle = this.drawing.lastDoodleOfClass("TrabySuture");
	if (doodle) {
		this.type = doodle.type;
	}
	else {
		this.type = 'Releasable';
	}
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate handle array (value of d determines size) for releasable suture
	var d = 50;
	var positionSet = [
		{x: d, y: -d},
		{x: -d, y: d},
		{x: -d, y: 3 * d},
		{x: 0, y: 7 * d},
		{x: d, y: 2 * d},
	];
	for (var i = 0; i < positionSet.length; i++) {
		var point = new ED.Point(positionSet[i].x, positionSet[i].y);
		this.addPointToSquiggle(point);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrabySuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrabySuture.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Outline
	ctx.rect(-40, -70, 80, 100);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,255,0)";
	if (this.isSelected) {
		ctx.strokeStyle = "gray";
	} else {
		ctx.strokeStyle = "rgba(255,255,255,0)";
	}

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Suture path
		ctx.beginPath();

		// Type of suture
		switch (this.type) {
			case 'Releasable':
				// Decorative knot between first two points
				var fp = this.squiggleArray[0].pointsArray[0];
				ctx.moveTo(fp.x, fp.y);
				var tp = this.squiggleArray[0].pointsArray[1];
								
				// ***TODO*** not sure this function is working as planned, but result here is OK
				var cp1 = fp.pointAtAngleToLineToPointAtProportion(Math.PI/3, tp, 0.5);
				var cp2 = fp.pointAtAngleToLineToPointAtProportion(-Math.PI/3, tp, 0.5);
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);

				// First three segments are straight				
				var tp = this.squiggleArray[0].pointsArray[0];
				ctx.moveTo(tp.x, tp.y);
				for (var i = 1; i < 3; i++) {
					tp = this.squiggleArray[0].pointsArray[i];
					ctx.lineTo(tp.x, tp.y);
					fp = tp;
				}

				// Next two segments are curved
				var fp = this.squiggleArray[0].pointsArray[2];
				var tp = this.squiggleArray[0].pointsArray[3];
				var p = 2;
				var cp1 = new ED.Point(fp.x, fp.y + (tp.y - fp.y)/p);
				var cp2 = new ED.Point(tp.x - (tp.x - fp.x)/p, tp.y);				
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
				
				fp = this.squiggleArray[0].pointsArray[3];
				tp = this.squiggleArray[0].pointsArray[4];
				p = 2;
				cp1 = new ED.Point(fp.x + (tp.x - fp.x)/p, fp.y);
				cp2 = new ED.Point(tp.x, tp.y - (tp.y - fp.y)/p);
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
					
				// Array of handles for releasable suture
				for (var i = 0; i < this.numberOfHandles; i++) {
					this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
					this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
				}
				break;

			case 'Adjustable':
				ctx.moveTo(-2, 64);
				ctx.bezierCurveTo(20, 36, -15, 16, -16, -7);
				ctx.bezierCurveTo(-18, -30, -12, -43, -4, -43);
				ctx.bezierCurveTo(6, -43, 12, -28, 12, -9);
				ctx.bezierCurveTo(12, 11, 0, 23, -2, 30);
				ctx.bezierCurveTo(-3, 36, 3, 37, 2, 30);
				ctx.bezierCurveTo(2, 20, -4, 24, -3, 29);
				ctx.bezierCurveTo(-3, 36, 14, 37, 23, 56);
				ctx.bezierCurveTo(32, 74, 34, 100, 34, 100);
				
				this.handleArray.length = 1;
				this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Rotate, false);
				this.handleArray[0].location = this.transform.transformPoint(new ED.Point(40, -70));
				break;

			case 'Fixed':
				ctx.moveTo(0, -30);
				ctx.bezierCurveTo(5, -10, 5, 10, 0, 30);
				ctx.bezierCurveTo(-5, 10, -5, -10, 0, -30);
				ctx.moveTo(-5, 50);
				ctx.lineTo(0, 30);
				ctx.lineTo(5, 50);
				
				this.handleArray.length = 1;
				this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Rotate, false);
				this.handleArray[0].location = this.transform.transformPoint(new ED.Point(40, -70));
				break;
		}

		// Set line attributes
		ctx.lineWidth = 8;
		ctx.fillStyle = "rgba(0, 0, 0, 0)";
		ctx.strokeStyle = "purple";

		// Draw line
		ctx.stroke();
	}

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
ED.TrabySuture.prototype.description = function() {
	var returnValue = this.size + " " + this.material + " " + this.type + " suture at " + this.clockHour() + " o'clock";

	return returnValue;
}
