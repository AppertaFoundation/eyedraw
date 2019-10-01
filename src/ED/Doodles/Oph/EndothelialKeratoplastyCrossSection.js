/**
 * OpenEyes
 *
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
 * 
 *
 * @class EndothelialKeratoplastyCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.EndothelialKeratoplastyCrossSection = function(_drawing, _parameterJSON) {
	
	// Set classname
	this.className = "EndothelialKeratoplastyCrossSection";

	// Private parameters
	this.pixelsPerMillimetre = 63.3333;
	this.initialRadius = 360;
	
	// Derived parameters
	this.diameter = 9;
	
	// Other parameters
	this.d = 100;
	this.typeSimple = 1; // inherited from en face view
							// 1: DSEK, 2: DMEAK
	this.handle1Y = -4.5 * this.pixelsPerMillimetre;
	this.handle1X = -60;
	this.handle2Y = 0;
	this.handle2X = -220;
	this.handle3Y = 4.5 * this.pixelsPerMillimetre;
	this.handle3X = -60;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY','d','diameter','typeSimple'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	
	this.linkedDoodleParameters = {
        'EndothelialKeratoplasty': {
            source: ['originY','apexY','d','diameter','typeSimple'],
            store: [['originX','csOriginX']]
        }
    };
}

/**
 * Sets superclass and constructor
 */
ED.EndothelialKeratoplastyCrossSection.prototype = new ED.Doodle;
ED.EndothelialKeratoplastyCrossSection.prototype.constructor = ED.EndothelialKeratoplastyCrossSection;
ED.EndothelialKeratoplastyCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EndothelialKeratoplastyCrossSection.prototype.setHandles = function() {
	// create 3 handles
/*
	for (var i = 0; i < 3; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}
*/
}

/**
 * Sets default properties
 */
ED.EndothelialKeratoplastyCrossSection.prototype.setPropertyDefaults = function() {
	this.isUnique = false;
	this.isFilled = false;
	
	this.apexY = -4.5 * this.pixelsPerMillimetre;
		
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-12.0 * this.pixelsPerMillimetre/2, -6.5 * this.pixelsPerMillimetre/2);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		animate: false
	};
	
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(6.5, 12),
		precision: 1,
		animate: true
	};
	
	this.parameterValidationArray['typeSimple'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 2),
		animate: false
	};
	
	// Create ranges to constrain handles
		// within dimension of graft, and within anterior chamber
/*
	this.handleCoordinateRangeArray = new Array();
	this.handleCoordinateRangeArray[0] = {
		x: new ED.Range(-500,+500), 
		y: new ED.Range(-4.5 * this.pixelsPerMillimetre, -4.5 * this.pixelsPerMillimetre)
	}
	this.handleCoordinateRangeArray[1] = {
		x: new ED.Range(-500,+500), 
		y: new ED.Range(-4.5 * this.pixelsPerMillimetre, 4.5 * this.pixelsPerMillimetre)
	}
	this.handleCoordinateRangeArray[2] = {
		x: new ED.Range(-500,+500), 
		y: new ED.Range(4.5 * this.pixelsPerMillimetre, 4.5 * this.pixelsPerMillimetre)
	}
*/
}

/**
 * Sets default parameters
 */
ED.EndothelialKeratoplastyCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 50; // as is in Cornea cross section doodle to dulicate bezier control points
	this.setParameterFromString('diameter', '9.0');
	
	// create the base squiggle
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
	this.squiggleArray.push(squiggle);
	
	// Populate with handles at equidistant points around circumference
	var point1 = new ED.Point(this.handle1X, this.handle1Y); // TODO: check this enables storing & rendering of cross section handle points, assuming pointsArray not stored for cross section doodles
	this.addPointToSquiggle(point1);
	var point2 = new ED.Point(this.handle2X, this.handle2Y); // TODO: check this enables storing & rendering of cross section handle points, assuming pointsArray not stored for cross section doodles
	this.addPointToSquiggle(point2);
	var point3 = new ED.Point(this.handle3X, this.handle3Y); // TODO: check this enables storing & rendering of cross section handle points, assuming pointsArray not stored for cross section doodles
	this.addPointToSquiggle(point3);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.EndothelialKeratoplastyCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			returnArray['diameter'] = -2 * _value/this.pixelsPerMillimetre;
			if (this.squiggleArray.length>0) {
				// update handle position
				
				var sup = this.getXLimitOnCornea(_value);
				var inf = this.getXLimitOnCornea(-_value);
				this.squiggleArray[0].pointsArray[0].y = new ED.Point(sup,_value);
				this.squiggleArray[0].pointsArray[2].y = new ED.Point(inf,-_value);
				
				// update handle range
/*
				this.handleCoordinateRangeArray[0] = {
					x: new ED.Range(sup,+200), 
					y: new ED.Range(_value, _value)
				}
*/
/*
				this.handleCoordinateRangeArray[1] = {
					x: new ED.Range(220+crrctr,220+crrctr), 
					y: new ED.Range(_value, -_value)
				}
*/
/*
				this.handleCoordinateRangeArray[2] = {
					x: new ED.Range(inf,+200), 
					y: new ED.Range(-_value, -_value)
				}
*/
			}
			this.handle1Y = _value;
			this.handle3Y = -_value;
			break;

		case 'diameter':
			returnArray['apexY'] = -_value * this.pixelsPerMillimetre/2;
			break;
		
		case 'd':
			returnArray['d'] = parseInt(_value);
			
			// update handle range boundaries
			
			// update handle positions
			
			break;
		
		case 'typeSimple':
			returnArray['typeSimple'] = parseInt(_value);
			break;
			
		case 'handles':
			//console.log(this.draggingHandleIndex);
			// update parameters storing handle positions
			if (this.draggingHandleIndex == 0) {
				this.handle1X = this.squiggleArray[0].pointsArray[0].x;
				this.handle1Y = this.squiggleArray[0].pointsArray[0].y;
			}
			else if (this.draggingHandleIndex == 1) {
				this.handle2X = this.squiggleArray[0].pointsArray[1].x;
				this.handle2Y = this.squiggleArray[0].pointsArray[1].y;
			}
			else if (this.draggingHandleIndex == 2) {
				this.handle3X = this.squiggleArray[0].pointsArray[2].x;
				this.handle3Y = this.squiggleArray[0].pointsArray[2].y;
			}
			
			// update range
			var x = this.getXLimitOnCornea(this.squiggleArray[0].pointsArray[this.draggingHandleIndex].y);
			this.handleCoordinateRangeArray[this.draggingHandleIndex].x = new ED.Range(x,+200);
			
			break;
	}

	return returnArray;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EndothelialKeratoplastyCrossSection.prototype.draw = function(_point) {

	// Get context
	var ctx = this.drawing.context;

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	// Call draw method in superclass
	ED.EndothelialKeratoplastyCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	// Calculate segment extent in terms of time along curve
	var startY = this.originY + this.apexY;
	var endY = this.originY - this.apexY;
	
	var startT = (startY + 380) / 760;
	if (startT<0) startT = 0;
	var endT = (endY + 380) / 760;
	if (endT>1) endT = 1;
	
	// define width using corrections for each bezier point
		// width depends on DMEK / DSAEK parameter
	var crrctr1 = 10;
	var crrctr2 = 6;
	var crrctr3 = 6;
	var crrctr4 = 4;
	if (this.typeSimple == 2) {
		crrctr1 = 50;
		crrctr2 = 30;
		crrctr3 = 30;
		crrctr4 = 20;
	}
		
	if (startT < 0.5) {
		
		var superiorBezier = new Object;
		var superiorBezierBack = new Object;

		// define start and end time points
		var tI0 = startT * 2;
		var tI1 = (endT < 0.5) ? endT * 2 : 1;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			superiorBezier.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240 + 160, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - 120 - this.originY);
			superiorBezier.EP = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120 + crrctr1, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160 + crrctr2, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(cornea.apexX + cornealThickness + crrctr3, cornea.apexY - 120 - this.originY);
			superiorBezierBack.EP = new ED.Point(cornea.apexX + cornealThickness + crrctr4, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {			
			superiorBezier.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240 + 120, -200 - this.originY);
			superiorBezier.CP2 = new ED.Point(-380 + 100, -140 - this.originY);
			superiorBezier.EP = new ED.Point(-380 + 100, 100 - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120 + crrctr1, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 120 + crrctr2, -200 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-380 + 100 + crrctr3, -140 - this.originY);
			superiorBezierBack.EP = new ED.Point(-380 + 100 + crrctr4, 100 - this.originY);
		}
		else {
			superiorBezier.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240 + 160, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(-320 + 100, -160 - this.originY);
			superiorBezier.EP = new ED.Point(-320 + 100, 0 - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120 + crrctr1, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160 + crrctr2, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-320 + 100 + crrctr3, -160 - this.originY);
			superiorBezierBack.EP = new ED.Point(-320 + 100 + crrctr4,0 - this.originY);
		}
		
			
		if (tI0 > 0) {
		// Trim start of curve			
			
			// front of cornea
			var sq0 = new ED.Point(0,0);
			sq0.y = (1-tI0)*(1-tI0)*(1-tI0)*superiorBezier.SP.y + 3*(1-tI0)*(1-tI0)*tI0*superiorBezier.CP1.y + 3*(1-tI0)*tI0*tI0*superiorBezier.CP2.y + tI0*tI0*tI0*superiorBezier.EP.y;
			sq0.x = (1-tI0)*(1-tI0)*(1-tI0)*superiorBezier.SP.x + 3*(1-tI0)*(1-tI0)*tI0*superiorBezier.CP1.x + 3*(1-tI0)*tI0*tI0*superiorBezier.CP2.x + tI0*tI0*tI0*superiorBezier.EP.x;
			
			var iP23 = new ED.Point(0,0);
			iP23.x = superiorBezier.CP1.x + tI0 * (superiorBezier.CP2.x - superiorBezier.CP1.x);
			iP23.y = superiorBezier.CP1.y + tI0 * (superiorBezier.CP2.y - superiorBezier.CP1.y);
			
			var iP34 = new ED.Point(0,0);
			iP34.x = superiorBezier.CP2.x + tI0 * (superiorBezier.EP.x - superiorBezier.CP2.x);
			iP34.y = superiorBezier.CP2.y + tI0 * (superiorBezier.EP.y - superiorBezier.CP2.y);
			
			var iP2334 = new ED.Point(0,0);
			iP2334.x = iP23.x + tI0 * (iP34.x - iP23.x);
			iP2334.y = iP23.y + tI0 * (iP34.y - iP23.y);
			
			superiorBezier.SP = sq0;
			superiorBezier.CP1 = iP2334;
			superiorBezier.CP2 = iP34;
			
			
			// back of cornea
			var sq0b = new ED.Point(0,0);
			sq0b.y = (1-tI0)*(1-tI0)*(1-tI0)*superiorBezierBack.SP.y + 3*(1-tI0)*(1-tI0)*tI0*superiorBezierBack.CP1.y + 3*(1-tI0)*tI0*tI0*superiorBezierBack.CP2.y + tI0*tI0*tI0*superiorBezierBack.EP.y;
			sq0b.x = (1-tI0)*(1-tI0)*(1-tI0)*superiorBezierBack.SP.x + 3*(1-tI0)*(1-tI0)*tI0*superiorBezierBack.CP1.x + 3*(1-tI0)*tI0*tI0*superiorBezierBack.CP2.x + tI0*tI0*tI0*superiorBezierBack.EP.x;
			
			var iP23b = new ED.Point(0,0);
			iP23b.x = superiorBezierBack.CP1.x + tI0 * (superiorBezierBack.CP2.x - superiorBezierBack.CP1.x);
			iP23b.y = superiorBezierBack.CP1.y + tI0 * (superiorBezierBack.CP2.y - superiorBezierBack.CP1.y);
			
			var iP34b = new ED.Point(0,0);
			iP34b.x = superiorBezierBack.CP2.x + tI0 * (superiorBezierBack.EP.x - superiorBezierBack.CP2.x);
			iP34b.y = superiorBezierBack.CP2.y + tI0 * (superiorBezierBack.EP.y - superiorBezierBack.CP2.y);
			
			var iP2334b = new ED.Point(0,0);
			iP2334b.x = iP23b.x + tI0 * (iP34b.x - iP23b.x);
			iP2334b.y = iP23b.y + tI0 * (iP34b.y - iP23b.y);
			
			superiorBezierBack.SP = sq0b;
			superiorBezierBack.CP1 = iP2334b;
			superiorBezierBack.CP2 = iP34b;
		}
		
		if (tI1 < 1) {
		// Trim end of curve
			
			// front of cornea
			var iq1 = new ED.Point(0,0);
			iq1.y = (1-tI1)*(1-tI1)*(1-tI1)*superiorBezier.SP.y + 3*(1-tI1)*(1-tI1)*tI1*superiorBezier.CP1.y + 3*(1-tI1)*tI1*tI1*superiorBezier.CP2.y + tI1*tI1*tI1*superiorBezier.EP.y;
			iq1.x = (1-tI1)*(1-tI1)*(1-tI1)*superiorBezier.SP.x + 3*(1-tI1)*(1-tI1)*tI1*superiorBezier.CP1.x + 3*(1-tI1)*tI1*tI1*superiorBezier.CP2.x + tI1*tI1*tI1*superiorBezier.EP.x;

			var iP12 = new ED.Point(0,0);
			iP12.x = superiorBezier.SP.x + tI1 * (superiorBezier.CP1.x - superiorBezier.SP.x);
			iP12.y = superiorBezier.SP.y + tI1 * (superiorBezier.CP1.y - superiorBezier.SP.y);
			
			var iP23 = new ED.Point(0,0);
			iP23.x = superiorBezier.CP1.x + tI1 * (superiorBezier.CP2.x - superiorBezier.CP1.x);
			iP23.y = superiorBezier.CP1.y + tI1 * (superiorBezier.CP2.y - superiorBezier.CP1.y);
			
			var iP1223 = new ED.Point(0,0);
			iP1223.x = iP12.x + tI1 * (iP23.x - iP12.x);
			iP1223.y = iP12.y + tI1 * (iP23.y - iP12.y);
			
			superiorBezier.CP1 = iP12;
			superiorBezier.CP2 = iP1223;
			superiorBezier.EP = iq1;
			
			
			// back of cornea
			var iq1b = new ED.Point(0,0);
			iq1b.y = (1-tI1)*(1-tI1)*(1-tI1)*superiorBezierBack.SP.y + 3*(1-tI1)*(1-tI1)*tI1*superiorBezierBack.CP1.y + 3*(1-tI1)*tI1*tI1*superiorBezierBack.CP2.y + tI1*tI1*tI1*superiorBezierBack.EP.y;
			iq1b.x = (1-tI1)*(1-tI1)*(1-tI1)*superiorBezierBack.SP.x + 3*(1-tI1)*(1-tI1)*tI1*superiorBezierBack.CP1.x + 3*(1-tI1)*tI1*tI1*superiorBezierBack.CP2.x + tI1*tI1*tI1*superiorBezierBack.EP.x;

			var iP12b = new ED.Point(0,0);
			iP12b.x = superiorBezierBack.SP.x + tI1 * (superiorBezierBack.CP1.x - superiorBezierBack.SP.x);
			iP12b.y = superiorBezierBack.SP.y + tI1 * (superiorBezierBack.CP1.y - superiorBezierBack.SP.y);
			
			var iP23b = new ED.Point(0,0);
			iP23b.x = superiorBezierBack.CP1.x + tI1 * (superiorBezierBack.CP2.x - superiorBezierBack.CP1.x);
			iP23b.y = superiorBezierBack.CP1.y + tI1 * (superiorBezierBack.CP2.y - superiorBezierBack.CP1.y);
			
			var iP1223b = new ED.Point(0,0);
			iP1223b.x = iP12b.x + tI1 * (iP23b.x - iP12b.x);
			iP1223b.y = iP12b.y + tI1 * (iP23b.y - iP12b.y);
			
			superiorBezierBack.CP1 = iP12b;
			superiorBezierBack.CP2 = iP1223b;
			superiorBezierBack.EP = iq1b;
		}
	}
	
	
	if (endT > 0.5) {
		
		var inferiorBezier = new Object;
		var inferiorBezierBack = new Object;
		
		// define start and end time points
		var tS0 = (startT > 0.5) ? (startT - 0.5) * 2 : 0;
		var tS1 = (endT - 0.5) * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			inferiorBezier.SP = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - this.originY);
			inferiorBezier.CP1 = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY + 120 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120 + 120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(cornea.apexX + cornealThickness + crrctr4, cornea.apexY - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(cornea.apexX + cornealThickness + crrctr3, cornea.apexY + 120 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160 + crrctr2, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120 + crrctr1, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			inferiorBezier.SP = new ED.Point(-380 + 100, 100 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-380 + 120, 220 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120 + 120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(-380 + 100 + crrctr4, 100 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-380 + 120 + crrctr3, 220 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160 + crrctr2, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120 + crrctr1, 380 - this.originY);
		}
		else {
			inferiorBezier.SP = new ED.Point(-320 + 100, -0 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-320 + 100, 160 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120 + 120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(-320 + 100 + crrctr4, -0 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-320 + 100 + crrctr3, 160 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160 + crrctr2, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120 + crrctr1, 380 - this.originY);
		}			
		
		
		if (tS0 > 0) {
		// Trim start of curve
		
			// front of cornea			
			var sq0 = new ED.Point(0,0);
			sq0.y = (1-tS0)*(1-tS0)*(1-tS0)*inferiorBezier.SP.y + 3*(1-tS0)*(1-tS0)*tS0*inferiorBezier.CP1.y + 3*(1-tS0)*tS0*tS0*inferiorBezier.CP2.y + tS0*tS0*tS0*inferiorBezier.EP.y;
			sq0.x = (1-tS0)*(1-tS0)*(1-tS0)*inferiorBezier.SP.x + 3*(1-tS0)*(1-tS0)*tS0*inferiorBezier.CP1.x + 3*(1-tS0)*tS0*tS0*inferiorBezier.CP2.x + tS0*tS0*tS0*inferiorBezier.EP.x;
			
			var sP23 = new ED.Point(0,0);
			sP23.x = inferiorBezier.CP1.x + tS0 * (inferiorBezier.CP2.x - inferiorBezier.CP1.x);
			sP23.y = inferiorBezier.CP1.y + tS0 * (inferiorBezier.CP2.y - inferiorBezier.CP1.y);
			
			var sP34 = new ED.Point(0,0);
			sP34.x = inferiorBezier.CP2.x + tS0 * (inferiorBezier.EP.x - inferiorBezier.CP2.x);
			sP34.y = inferiorBezier.CP2.y + tS0 * (inferiorBezier.EP.y - inferiorBezier.CP2.y);
			
			var sP2334 = new ED.Point(0,0);
			sP2334.x = sP23.x + tS0 * (sP34.x - sP23.x);
			sP2334.y = sP23.y + tS0 * (sP34.y - sP23.y);
			
			inferiorBezier.SP = sq0;
			inferiorBezier.CP1 = sP2334;
			inferiorBezier.CP2 = sP34;
			
			// back of cornea
			var sq0b = new ED.Point(0,0);
			sq0b.y = (1-tS0)*(1-tS0)*(1-tS0)*inferiorBezierBack.SP.y + 3*(1-tS0)*(1-tS0)*tS0*inferiorBezierBack.CP1.y + 3*(1-tS0)*tS0*tS0*inferiorBezierBack.CP2.y + tS0*tS0*tS0*inferiorBezierBack.EP.y;
			sq0b.x = (1-tS0)*(1-tS0)*(1-tS0)*inferiorBezierBack.SP.x + 3*(1-tS0)*(1-tS0)*tS0*inferiorBezierBack.CP1.x + 3*(1-tS0)*tS0*tS0*inferiorBezierBack.CP2.x + tS0*tS0*tS0*inferiorBezierBack.EP.x;
			
			var sP23b = new ED.Point(0,0);
			sP23b.x = inferiorBezierBack.CP1.x + tS0 * (inferiorBezierBack.CP2.x - inferiorBezierBack.CP1.x);
			sP23b.y = inferiorBezierBack.CP1.y + tS0 * (inferiorBezierBack.CP2.y - inferiorBezierBack.CP1.y);
			
			var sP34b = new ED.Point(0,0);
			sP34b.x = inferiorBezierBack.CP2.x + tS0 * (inferiorBezierBack.EP.x - inferiorBezierBack.CP2.x);
			sP34b.y = inferiorBezierBack.CP2.y + tS0 * (inferiorBezierBack.EP.y - inferiorBezierBack.CP2.y);
			
			var sP2334b = new ED.Point(0,0);
			sP2334b.x = sP23b.x + tS0 * (sP34b.x - sP23b.x);
			sP2334b.y = sP23b.y + tS0 * (sP34b.y - sP23b.y);
			
			inferiorBezierBack.SP = sq0b;
			inferiorBezierBack.CP1 = sP2334b;
			inferiorBezierBack.CP2 = sP34b;
		}
		
		if (tS1 < 1) {
		// Trim end of curve
		
			// front of cornea
			var sq1 = new ED.Point(0,0);
			sq1.y = (1-tS1)*(1-tS1)*(1-tS1)*inferiorBezier.SP.y + 3*(1-tS1)*(1-tS1)*tS1*inferiorBezier.CP1.y + 3*(1-tS1)*tS1*tS1*inferiorBezier.CP2.y + tS1*tS1*tS1*inferiorBezier.EP.y;
			sq1.x = (1-tS1)*(1-tS1)*(1-tS1)*inferiorBezier.SP.x + 3*(1-tS1)*(1-tS1)*tS1*inferiorBezier.CP1.x + 3*(1-tS1)*tS1*tS1*inferiorBezier.CP2.x + tS1*tS1*tS1*inferiorBezier.EP.x;

			var sP12 = new ED.Point(0,0);
			sP12.x = inferiorBezier.SP.x + tS1 * (inferiorBezier.CP1.x - inferiorBezier.SP.x);
			sP12.y = inferiorBezier.SP.y + tS1 * (inferiorBezier.CP1.y - inferiorBezier.SP.y);
			
			var sP23 = new ED.Point(0,0);
			sP23.x = inferiorBezier.CP1.x + tS1 * (inferiorBezier.CP2.x - inferiorBezier.CP1.x);
			sP23.y = inferiorBezier.CP1.y + tS1 * (inferiorBezier.CP2.y - inferiorBezier.CP1.y);
			
			var sP1223 = new ED.Point(0,0);
			sP1223.x = sP12.x + tS1 * (sP23.x - sP12.x);
			sP1223.y = sP12.y + tS1 * (sP23.y - sP12.y);

			inferiorBezier.CP1 = sP12;
			inferiorBezier.CP2 = sP1223;
			inferiorBezier.EP = sq1;
			
			
			// back of cornea
			var sq1b = new ED.Point(0,0);
			sq1b.y = (1-tS1)*(1-tS1)*(1-tS1)*inferiorBezierBack.SP.y + 3*(1-tS1)*(1-tS1)*tS1*inferiorBezierBack.CP1.y + 3*(1-tS1)*tS1*tS1*inferiorBezierBack.CP2.y + tS1*tS1*tS1*inferiorBezierBack.EP.y;
			sq1b.x = (1-tS1)*(1-tS1)*(1-tS1)*inferiorBezierBack.SP.x + 3*(1-tS1)*(1-tS1)*tS1*inferiorBezierBack.CP1.x + 3*(1-tS1)*tS1*tS1*inferiorBezierBack.CP2.x + tS1*tS1*tS1*inferiorBezierBack.EP.x;

			var sP12b = new ED.Point(0,0);
			sP12b.x = inferiorBezierBack.SP.x + tS1 * (inferiorBezierBack.CP1.x - inferiorBezierBack.SP.x);
			sP12b.y = inferiorBezierBack.SP.y + tS1 * (inferiorBezierBack.CP1.y - inferiorBezierBack.SP.y);
			
			var sP23b = new ED.Point(0,0);
			sP23b.x = inferiorBezierBack.CP1.x + tS1 * (inferiorBezierBack.CP2.x - inferiorBezierBack.CP1.x);
			sP23b.y = inferiorBezierBack.CP1.y + tS1 * (inferiorBezierBack.CP2.y - inferiorBezierBack.CP1.y);
			
			var sP1223b = new ED.Point(0,0);
			sP1223b.x = sP12b.x + tS1 * (sP23b.x - sP12b.x);
			sP1223b.y = sP12b.y + tS1 * (sP23b.y - sP12b.y);

			inferiorBezierBack.CP1 = sP12b;
			inferiorBezierBack.CP2 = sP1223b;
			inferiorBezierBack.EP = sq1b;
		}
	}
	
	if (inferiorBezier) {
		ctx.moveTo(inferiorBezier.EP.x, inferiorBezier.EP.y);	
		ctx.lineTo(inferiorBezierBack.EP.x, inferiorBezierBack.EP.y);
		ctx.bezierCurveTo(inferiorBezierBack.CP2.x, inferiorBezierBack.CP2.y, inferiorBezierBack.CP1.x, inferiorBezierBack.CP1.y, inferiorBezierBack.SP.x, inferiorBezierBack.SP.y);
		ctx.moveTo(inferiorBezier.EP.x, inferiorBezier.EP.y);
	}
	if (superiorBezier) {
		ctx.moveTo(superiorBezierBack.EP.x, superiorBezierBack.EP.y);
		ctx.bezierCurveTo(superiorBezierBack.CP2.x, superiorBezierBack.CP2.y, superiorBezierBack.CP1.x, superiorBezierBack.CP1.y, superiorBezierBack.SP.x, superiorBezierBack.SP.y);
		ctx.moveTo(superiorBezierBack.SP.x, superiorBezierBack.SP.y);
		ctx.lineTo(superiorBezier.SP.x, superiorBezier.SP.y);
	}
	
	
	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0,0,0,0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Draw endothelia
		ctx.beginPath();
		
		if (inferiorBezier) {
			ctx.moveTo(inferiorBezierBack.EP.x, inferiorBezierBack.EP.y);
			ctx.bezierCurveTo(inferiorBezierBack.CP2.x, inferiorBezierBack.CP2.y, inferiorBezierBack.CP1.x, inferiorBezierBack.CP1.y, inferiorBezierBack.SP.x, inferiorBezierBack.SP.y);
			if (superiorBezier) ctx.lineTo(superiorBezierBack.EP.x, superiorBezierBack.EP.y);
		}
		if (superiorBezier) {
			ctx.moveTo(superiorBezierBack.EP.x, superiorBezierBack.EP.y);
			ctx.bezierCurveTo(superiorBezierBack.CP2.x, superiorBezierBack.CP2.y, superiorBezierBack.CP1.x, superiorBezierBack.CP1.y, superiorBezierBack.SP.x, superiorBezierBack.SP.y);
		}
		
		// set style attributes
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 15;
		ctx.lineJoin='miter';
		ctx.miterLimit = 200;
		
		ctx.stroke();
	}
	
	// define handle positions
/*
	this.handleArray[0].location=this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	this.handleArray[1].location=this.transform.transformPoint(this.squiggleArray[0].pointsArray[1]);
	this.handleArray[2].location=this.transform.transformPoint(this.squiggleArray[0].pointsArray[2]);
*/
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


/**
 * 
 *
 * @returns {Float} X coordinate for Y along posterior corneal surface
 */
ED.EndothelialKeratoplastyCrossSection.prototype.getXLimitOnCornea = function(_y) {

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	var yTranspose = this.originY + _y; // transpose y to corneal plane
	
	var sp;
	var cp1;
	var cp2;
	var ep;
	
	// define width using corrections for each bezier point
		// width depends on DMEK / DSAEK parameter
	var crrctr1 = 10;
	var crrctr2 = 6;
	var crrctr3 = 6;
	var crrctr4 = 4;
	if (this.typeSimple == 2) {
		crrctr1 = 50;
		crrctr2 = 30;
		crrctr3 = 30;
		crrctr4 = 20;
	}
	
	var time = (yTranspose + 380) / 760;
	if (time<0) time = 0;
	if (time>1) time = 1;
	
	if (time <= 0.5) {
		time = time * 2;

		if (cornea && cornea.shape == "Keratoconus") {
			sp = new ED.Point(-120 + 120 + crrctr1, -380);
			cp1 = new ED.Point(-240 + 160 + crrctr2, -260);
			cp2 = new ED.Point(cornea.apexX + cornealThickness + crrctr3, cornea.apexY - 120);
			ep = new ED.Point(cornea.apexX + cornealThickness + crrctr4, cornea.apexY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			sp = new ED.Point(-120 + 120 + crrctr1, -380);
			cp1 = new ED.Point(-240 + 120 + crrctr2, -200);
			cp2 = new ED.Point(-380 + 100 + crrctr3, -140);
			ep = new ED.Point(-380 + 100 + crrctr4, 100);
		}
		else {
			sp = new ED.Point(-120 + 120 + crrctr1, -380);
			cp1 = new ED.Point(-240 + 160 + crrctr2, -260);
			cp2 = new ED.Point(-320 + 100 + crrctr3, -160);
			ep = new ED.Point(-320 + 100 + crrctr4, 0);
		}
	}
	
	
	if (time > 0.5) {		
		time = (time - 0.5) * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			sp = new ED.Point(cornea.apexX + cornealThickness + crrctr4, cornea.apexY );
			cp1 = new ED.Point(cornea.apexX + cornealThickness + crrctr3, cornea.apexY + 120 );
			cp2 = new ED.Point(-240 + 160 + crrctr2, 260 );
			ep = new ED.Point(-120 + 120 + crrctr1, 380 );
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			sp = new ED.Point(-380 + 100 + crrctr4, 100 );
			cp1 = new ED.Point(-380 + 120 + crrctr3, 220 );
			cp2 = new ED.Point(-240 + 160 + crrctr2, 260 );
			ep = new ED.Point(-120 + 120 + crrctr1, 380 );
		}
		else {
			sp = new ED.Point(-320 + 100 + crrctr4, -0 );
			cp1 = new ED.Point(-320 + 100 + crrctr3, 160 );
			cp2 = new ED.Point(-240 + 160 + crrctr2, 260 );
			ep = new ED.Point(-120 + 120 + crrctr1, 380 );
		}	
	}		

	var pointOnCornea = sp.bezierPointAtParameter(time, cp1, cp2, ep);

	return pointOnCornea.x;
}