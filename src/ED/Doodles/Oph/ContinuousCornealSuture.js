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
 * ContinuousCornealSuture
 *
 * @class ContinuousCornealSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ContinuousCornealSuture = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ContinuousCornealSuture";

	// Private parameters
	this.pixelsPerMillimetre = 63.3333;

	var cornealGraft = _drawing.firstDoodleOfClass("CornealGraft");
	this.cornealGraft = cornealGraft ? cornealGraft : null;
	this.setParametersFromCornealGraft();

	// Derived parameters
	this.suture = 'Nylon 10-0';
	this.removed = false;
	this.sutureBites = 16;
	this.biteLength = 2;
	this.sutureLength = this.biteLength * this.pixelsPerMillimetre; // correct default!


	// Saved parameters
	this.savedParameterArray = ['originX','originY','apexX','radius', 'rotation','removed','suture','sutureBites','biteLength','sutureLength'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'removed':'Removed','suture':'Suture','sutureBites':'Suture bites','biteLength':'Bite length'};
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ContinuousCornealSuture.prototype = new ED.Doodle;
ED.ContinuousCornealSuture.prototype.constructor = ED.ContinuousCornealSuture;
ED.ContinuousCornealSuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ContinuousCornealSuture.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.ContinuousCornealSuture.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;

	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(6.5 * this.pixelsPerMillimetre/2, 15 * this.pixelsPerMillimetre/2);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['suture'] = {
		kind: 'derived',
		type: 'string',
		list: ['Nylon 10-0', 'Nylon 11-0','Prolene','Vicryl'],
		animate: false
	};
	this.parameterValidationArray['removed'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['sutureBites'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(8, 40),
		animate: false
	};
	this.parameterValidationArray['biteLength'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 3),
		animate: false
	};
}

ED.ContinuousCornealSuture.prototype.setParametersFromCornealGraft = function() {
	if (this.cornealGraft) {
		this.radius = this.cornealGraft.diameter * this.pixelsPerMillimetre/2;
		this.originX = this.cornealGraft.originX;
		this.originY = this.cornealGraft.originY;
	}
};

/**
 * Sets default parameters
 */
ED.ContinuousCornealSuture.prototype.setParameterDefaults = function() {
/*
	this.setParameterFromString('tension', 'Tight');
	this.setParameterFromString('proudKnot', 'False');
*/
	// defaults
	this.apexX = 11.9 * this.pixelsPerMillimetre/2 - 50;
	this.radius = 374;
	this.setRotationWithDisplacements(0, 30); // rotation always dispalced for subsequent doodles
	this.setParametersFromCornealGraft();
	
	// inherit derived parameters from previous doodle of same class
	var previousDoodles = this.drawing.allDoodlesOfClass(this.className);
	if (previousDoodles.length>0) {
		var lastDoodle = previousDoodles[previousDoodles.length-1];
		this.setParameterWithAnimation("suture",lastDoodle.suture);
		this.setParameterWithAnimation("sutureBites",lastDoodle.sutureBites);
		this.setParameterWithAnimation("biteLength",lastDoodle.biteLength);
		this.setParameterWithAnimation("apexX",lastDoodle.apexX);
		
 		previousDoodles.push(this);
		var theta = (2*Math.PI/previousDoodles.length)/lastDoodle.sutureBites;
		for (var i=0; i<previousDoodles.length;i++) {
			previousDoodles[i].setSimpleParameter('rotation', i*theta);
		}
	}

}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.ContinuousCornealSuture.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'biteLength':
			returnArray['sutureLength'] = _value * this.pixelsPerMillimetre;
			break;
			
		case 'apexX':
			returnArray['radius'] = 50+_value;
			break;
			
	}

	return returnArray;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ContinuousCornealSuture.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ContinuousCornealSuture.superclass.draw.call(this, _point);
	
	// Move according to graft diameter
// 	var doodle = this.drawing.lastDoodleOfClass("CornealGraft");
	if (this.cornealGraft) {
		this.radius = this.cornealGraft.diameter * this.pixelsPerMillimetre/2;
	}

	// Boundary path
	ctx.beginPath();

	// Outer 360 arc around sutures
	ctx.arc(0, 0, this.radius + this.sutureLength/2,  0, Math.PI * 2, true);
	ctx.arc(0, 0, this.radius - this.sutureLength/2,  0, Math.PI * 2, false);

	ctx.closePath();

	// Invisible fill
	ctx.fillStyle = "rgba(255,255,255,0.0)";

	// Invisible boundary
	ctx.lineWidth = 0;
	ctx.strokeStyle = "rgba(255,255,255,0.0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Sutures
		var ro = this.radius + this.sutureLength/2;
		var ri = this.radius - this.sutureLength/2
	
		ctx.beginPath();
		for (var i = 0; i < this.sutureBites; i++) {
			// Suture points
			var phi1 = i * 2 * Math.PI/this.sutureBites;
			var phi2 = phi1 + Math.PI/this.sutureBites;
			
			var p1 = new ED.Point(0,0);
			p1.setWithPolars(ri, phi1);
			var p2 = new ED.Point(0,0);
			p2.setWithPolars(ro, phi2);

			if (phi1 == 0) {
				ctx.moveTo(p1.x, p1.y);
			}
			else {
				ctx.lineTo(p1.x, p1.y);
			}

			// Line to outer point
			ctx.lineTo(p2.x, p2.y);
		}

		// Put in last link
		ctx.closePath();

		// Draw sutures
		ctx.lineWidth = 4;
		ctx.strokeStyle = "rgba(0,0,0,0.8)";
		if (this.removed) ctx.strokeStyle = "rgba(150,150,150,0.5)";
		else if (this.suture == "Vicryl") ctx.strokeStyle = "rgba(55,0,123,1)";
		else if (this.suture == "Prolene") ctx.strokeStyle = "rgba(0,15,90,1)";
		ctx.stroke();
	}

 	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing && !this.cornealGraft) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
/*ED.ContinuousCornealSuture.prototype.snomedCode = function() {
	return (this.removed) ? 0 : 42505000; // only report code if suture hasnt been removed
};*/

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ContinuousCornealSuture.prototype.description = function() {
	return "Continuous corneal suture";
}
