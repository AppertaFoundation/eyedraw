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
 * Corneal Oedema
 *
 * @class CornealGraft
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealGraft = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealGraft";

	// Private parameters
	this.pixelsPerMillimetre = 63.3333;
	this.sutureLength = 60;

	// Derived parameters
	this.diameter = 7.5;
	
	// Other parameters
	this.type = 'Penetrating';
	this.showSutures = true;
	this.sutureType = 'Interrupted';
	this.numberOfSutures = 16;
	this.opaque = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'type', 'showSutures', 'sutureType', 'numberOfSutures', 'opaque'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type', 'showSutures':'Show Sutures', 'sutureType':'Suture type', 'numberOfSutures':'Sutures', 'opaque':'Opaque'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealGraft.prototype = new ED.Doodle;
ED.CornealGraft.prototype.constructor = ED.CornealGraft;
ED.CornealGraft.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealGraft.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CornealGraft.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = true;

	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-8.5 * this.pixelsPerMillimetre/2, -6.5 * this.pixelsPerMillimetre/2);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Penetrating', 'DMEK', 'DSEAK'],
		animate: false
	};
	this.parameterValidationArray['showSutures'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(6.5, 8.5),
		precision: 1,
		animate: true
	};
	this.parameterValidationArray['sutureType'] = {
		kind: 'derived',
		type: 'string',
		list: ['Interrupted', 'Continuous', 'None'],
		animate: false
	};
	this.parameterValidationArray['numberOfSutures'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(4, 32),
		animate: false
	};
	this.parameterValidationArray['opaque'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.CornealGraft.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '7.5');
	this.setParameterFromString('sutureType', 'Continuous');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealGraft.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			returnArray['diameter'] = -2 * _value/this.pixelsPerMillimetre;
			break;

		case 'diameter':
			returnArray['apexY'] = -_value * this.pixelsPerMillimetre/2;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealGraft.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealGraft.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Circular graft
	var r = -this.apexY;

	// Outer 360 arc
	ctx.arc(0, 0, r,  0, Math.PI * 2, true);

	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.stroke();
	if (this.opaque) {
		ctx.fillStyle = "rgba(150, 150, 150, 0.8)";
		ctx.fill();
	}

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (this.showSutures) {
			// Sutures
			var ro = -this.apexY + this.sutureLength/2;
			var ri = -this.apexY - this.sutureLength/2
		
			ctx.beginPath();
			for (var i = 0; i < this.numberOfSutures; i++) {
				// Suture points
				var phi = i * 2 * Math.PI/this.numberOfSutures;
				var p1 = new ED.Point(0,0);
				p1.setWithPolars(ri, phi);
				var p2 = new ED.Point(0,0);
				p2.setWithPolars(ro, phi);

				// No sutures
				if (this.sutureType == 'None') {
					this.drawSpot(ctx, p1.x, p1.y, 3, "gray");
					this.drawSpot(ctx, p2.x, p2.y, 3, "gray");
				}

				// Inner suture point
				if (phi == 0) {
					ctx.moveTo(p1.x, p1.y);
				}
				else {
					if (this.sutureType == 'Interrupted') {
						ctx.moveTo(p1.x, p1.y);
					}
					else if (this.sutureType == 'Continuous') {
						ctx.lineTo(p1.x, p1.y);
					}
				}

				// Line to outer point
				if (this.sutureType != 'None') {
					ctx.lineTo(p2.x, p2.y);
				}
			}

			// Put in last link
			if (this.sutureType == 'Continuous') {
				ctx.closePath();
			}

			// Draw sutures
			ctx.strokeStyle = "gray";
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

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
ED.CornealGraft.prototype.description = function() {
	return "Corneal Graft";
}
