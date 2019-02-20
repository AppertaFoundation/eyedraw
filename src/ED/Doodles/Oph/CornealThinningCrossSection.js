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
 *
 *
 * @class CornealThinningCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealThinningCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealThinningCrossSection";

	// Private parameters
	this.initialRadius = 81;
	this.cornealThickness = 110; // TODO: obtain from cornea eg. if keratoconus
	
	// Other parameters
	this.height = Math.round(this.initialRadius * 2 / 54);
	this.width = Math.round(this.initialRadius * 2 / 54);
	
	this.h = Math.round(this.initialRadius * 2 / 54);
	this.w = Math.round(this.initialRadius * 2 / 54);
	
	this.d = 0;
	this.p = 0;
	
	this.minY = this.initialRadius * -1;
	this.maxY = this.initialRadius;
	
	this.descemetacoele = false;
	this.perforation = false;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'height', 'width','h','w','minY','maxY','descemetacoele','perforation','apexX','apexY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

    this.linkedDoodleParameters = {
        'CornealThinning': {
            source: ['yMidPoint','h','w','originY','minY','maxY','descemetacoele','perforation'],
            store: [['apexX', 'csApexX'], ['apexY', 'csApexY'], ['originX', 'csOriginX']]
        }
    };
    
}

/**
 * Sets superclass and constructor
 */
ED.CornealThinningCrossSection.prototype = new ED.Doodle;
ED.CornealThinningCrossSection.prototype.constructor = ED.CornealThinningCrossSection;
ED.CornealThinningCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealThinningCrossSection.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CornealThinningCrossSection.prototype.setPropertyDefaults = function() {
		
	this.isMoveable = true;
	this.isRotatable = false;
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(+50, +50);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
	
	var startY = 200;
	
	var t = (startY + 380) / 760; // segment extent in terms of time along curve
	var bezierPoint = this.getCornealBezierPoint(t); // point on cornea epithelium at time t
	this.parameterValidationArray['apexX']['range'].setMinAndMax(bezierPoint.x+15, bezierPoint.x+100); // set range for apexX
	
	// Validation arrays for other parameters
	this.parameterValidationArray['height'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['width'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['depth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['h'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};
	this.parameterValidationArray['w'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: [0, 1],
		animate: false
	};
	this.parameterValidationArray['p'] = {
		kind: 'other',
		type: 'int',
		range: [0, 1],
		animate: false
	};
	this.parameterValidationArray['descemetacoele'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['perforation'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['minY'] = {
		kind: 'other',
		type: 'int',
		range: [-500,500],
		animate: false
	};
	this.parameterValidationArray['maxY'] = {
		kind: 'other',
		type: 'int',
		range: [-500,500],
		animate: false
	};
	
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealThinningCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'width':
			returnArray['w'] = parseInt(_value);
			break;

		case 'height':
			returnArray['h'] = parseInt(_value);
			break;

		case 'depth':
			returnArray['d'] = parseInt(_value);
			break;
			
		case 'h':
			returnArray['height'] = _value;
			
			// extent of apex point along cornea in terms of time
			var newY = this.minY + 0.5*(this.maxY-this.minY);			
			var t = (newY + this.originY + 380) / 760;

			// point at time t along corneal epithelium
			var bezierPoint = this.getCornealBezierPoint(t);			

			// angle of line perpendicular to cornea at time t
			var perpAngle = this.getAnglePerpendicularToCornea(t);
			
			// point on perpendicular line on cornea endothelium 
			var o = this.cornealThickness * Math.sin(perpAngle);
			var a = this.cornealThickness * Math.cos(perpAngle);
			var newMaxPoint = new ED.Point(bezierPoint.x+o,bezierPoint.y+a);	

			var currentMaxApexX = this.parameterValidationArray['apexX']['range']['max']; // store previous max value
			
			// set new range for apexX
			this.parameterValidationArray['apexX']['range'].setMinAndMax(bezierPoint.x+15, newMaxPoint.x);
			
			// update apexX value so maintains distance from corneal endothelium
			var newApexX = this.parameterValidationArray['apexX']['range']['max'] - (currentMaxApexX-this.apexX);
 			newApexX = this.parameterValidationArray['apexX']['range'].constrain(newApexX);
			this.setParameterFromString('apexX', newApexX.toString()); //using this method so will update dependent apexY value	
			break;
		
		case 'd':
			returnArray['depth'] = _value;
			break;
			
		case 'w':
			returnArray['width'] = _value;
			break;
		
		case 'originY':
			// extent of apex point along cornea in terms of time
			var newY = this.minY + 0.5*(this.maxY-this.minY);			
			var t = (newY + _value + 380) / 760;

			// point at time t along corneal epithelium
			var bezierPoint = this.getCornealBezierPoint(t);			

			// angle of line perpendicular to cornea at time t
			var perpAngle = this.getAnglePerpendicularToCornea(t);			

			// point on perpendicular line on cornea endothelium 
			var o = this.cornealThickness * Math.sin(perpAngle);
			var a = this.cornealThickness * Math.cos(perpAngle);
			var newMaxPoint = new ED.Point(bezierPoint.x+o,bezierPoint.y+a);	

			var currentMaxApexX = this.parameterValidationArray['apexX']['range']['max']; // store previous max value

			// set new range for apexX
			this.parameterValidationArray['apexX']['range'].setMinAndMax(bezierPoint.x+15, newMaxPoint.x);
			
			// update apexX value so maintains distance from posterior corneal surface
			var newApexX = this.parameterValidationArray['apexX']['range']['max'] - (currentMaxApexX-this.apexX);
 			newApexX = this.parameterValidationArray['apexX']['range'].constrain(newApexX);
			this.setParameterFromString('apexX', newApexX.toString()); //using this method so will update dependent apexY value	
			break;
			
		case 'apexX':
			// extent of apex point along cornea in terms of time
			var newY = this.minY + 0.5*(this.maxY-this.minY);			
			var t = (newY + this.originY + 380) / 760;
			var tplus = t + 0.01;
			var tminus = t - 0.01;

			// point at time t along corneal epithelium
			var bezierPoint = this.getCornealBezierPoint(t);			
			var bezierPointMinus = this.getCornealBezierPoint(tminus);	// point just before t		
			var bezierPointPlus = this.getCornealBezierPoint(tplus);	// point just after t	
			
			// calculate equation of line perpendicular to cornea at point t
			var m = (bezierPointMinus.y-bezierPointPlus.y) / (bezierPointMinus.x-bezierPointPlus.x);
			var c = bezierPoint.y - (-1/m)*bezierPoint.x; // gradient of perpendicular line negative reciprocal
			
			// constrain apexY to be on perpendicular line with current apexX value
			var y = (-1/m) * _value + c;
			this.setSimpleParameter('apexY', y);
			
			// get distance from cornea epithelium to point
			var apexPoint = new ED.Point(_value, y);
			var d = bezierPoint.distanceTo(apexPoint);
			
			// check if cornea is perforated
			if (d>=this.cornealThickness - 5) {
				this.setParameterFromString('perforation',"true");
				this.setParameterFromString('descemetacoele',"false");
			}
			else if (d>=this.cornealThickness - 15) { // NB 15 is an arbitary small value
				this.setParameterFromString('descemetacoele',"true");
				this.setParameterFromString('perforation',"false");
			}
			else {
				this.setParameterFromString('descemetacoele',"false");
				this.setParameterFromString('perforation',"false");
			}
			break;
		
		case 'perforation':
			var valueStr = (_value==true) ? 1 : 0;
			returnArray['p'] = valueStr;
			break;
		
		case 'descemetacoele':
			var valueStr = (_value==true) ? 1 : 0;
			returnArray['d'] = valueStr;
			break;
		
		case 'p':
			returnArray['p'] = _value
			break;
			
		case 'd':
			returnArray['d'] = _value
			break;

	}

	return returnArray;
}

/**
 * Sets default parameters
 */
ED.CornealThinningCrossSection.prototype.setParameterDefaults = function() {

	this.originY = 200;
	this.originX = 50; // as is in Cornea cross section doodle to dulicate bezier control points

	this.setParameterWithAnimation('apexX',-200);
// 	this.apexY = 0;

}

/**
 * Returns the angle of a perpendicular line to a point on the cornea at a certain time point, in radians
 *
 * @param {Float} _time 0-1 value for point in time along bezier curve
 */
ED.CornealThinningCrossSection.prototype.getAnglePerpendicularToCornea = function(_time) {

	var tplus = _time + 0.01;
	var tminus = _time - 0.01;

	var bezierPointMinus = this.getCornealBezierPoint(tminus);			
	var bezierPointPlus = this.getCornealBezierPoint(tplus);			
	
	var angle = Math.atan(Math.abs((bezierPointPlus.x-bezierPointMinus.x)/(bezierPointPlus.y-bezierPointMinus.y)))
	var perpAngle = angle + 0.5*Math.PI;
	
	return perpAngle;
}


/**
 * Returns the (x,y) coordinates of a point on the cornea at a certain point in time
 *
 * @param {Float} _time 0-1 value for point in time along bezier curve
 */
ED.CornealThinningCrossSection.prototype.getCornealBezierPoint = function(_time) {
	
	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var bezier = new Object;
	
	// define bezier points	
	if (_time < 0.5) {
		
		var t = _time * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			bezier.SP = new ED.Point(-120, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240, -260 - this.originY);
			bezier.CP2 = new ED.Point(cornea.apexX, cornea.apexY - 100 - this.originY);
			bezier.EP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			bezier.SP = new ED.Point(-120, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240, -260 - this.originY);
			bezier.CP2 = new ED.Point(-380, -100 - this.originY);
			bezier.EP = new ED.Point(-380, 100 - this.originY);
		}
		else {
			bezier.SP = new ED.Point(-120, -380 - this.originY);
			bezier.CP1 = new ED.Point(-240, -260 - this.originY);
			bezier.CP2 = new ED.Point(-320, -160 - this.originY);
			bezier.EP = new ED.Point(-320, 0 - this.originY);
		}
	}
	else {
		
		var t = (_time - 0.5) * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			bezier.SP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
			bezier.CP1 = new ED.Point(cornea.apexX, cornea.apexY + 100 - this.originY);
			bezier.CP2 = new ED.Point(-240, 260 - this.originY);
			bezier.EP = new ED.Point(-120, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			bezier.SP = new ED.Point(-380, 100 - this.originY);
			bezier.CP1 = new ED.Point(-380, 200 - this.originY);
			bezier.CP2 = new ED.Point(-240, 360 - this.originY);
			bezier.EP = new ED.Point(-120, 380 - this.originY);
		}
		else {
			bezier.SP = new ED.Point(-320, -0 - this.originY);
			bezier.CP1 = new ED.Point(-320, 160 - this.originY);
			bezier.CP2 = new ED.Point(-240, 260 - this.originY);
			bezier.EP = new ED.Point(-120, 380 - this.originY);
		}
	}
			
	// solve
	var point = bezier.SP.bezierPointAtParameter(t,bezier.CP1,bezier.CP2,bezier.EP);
	
	return point;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealThinningCrossSection.prototype.draw = function(_point) {

	var backgroundFillColour = this.drawing.canvas.style.backgroundColor;
	// in case canvas has no background fill
	//@TODO : this.drawing.canvas.style.backgroundColor is always empty so hack #dae6f1 into here
	if (!backgroundFillColour) {
		backgroundFillColour = "#dae6f1";
	}
	
	// Get context
	var ctx = this.drawing.context;

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	// Call draw method in superclass
	ED.CornealThinningCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	// Calculate segment extent in terms of time along curve
	var startY = this.minY + this.originY;
	var endY = this.maxY + this.originY;
	var startT = (startY + 380) / 760;
	if (startT<0) startT = 0;
	var endT = (endY + 380) / 760;
	if (endT>1) endT = 1;
		
	if (startT < 0.5) {
		
		var superiorBezier = new Object;

		// define start and end time points
		var tI0 = startT * 2;
		var tI1 = (endT < 0.5) ? endT * 2 : 1;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(cornea.apexX, cornea.apexY - 100 - this.originY);
			superiorBezier.EP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(-380, -100 - this.originY);
			superiorBezier.EP = new ED.Point(-380, 100 - this.originY);
		}
		else {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(-320, -160 - this.originY);
			superiorBezier.EP = new ED.Point(-320, 0 - this.originY);
		}
		
			
		if (tI0 > 0) {
		// Trim start of curve			
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
			
		}
		
		if (tI1 < 1) {
		// Trim end of curve
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
			
		}
	}
	
	
	if (endT > 0.5) {
		
		var inferiorBezier = new Object;
		
		// define start and end time points
		var tS0 = (startT > 0.5) ? (startT - 0.5) * 2 : 0;
		var tS1 = (endT - 0.5) * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			inferiorBezier.SP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
			inferiorBezier.CP1 = new ED.Point(cornea.apexX, cornea.apexY + 100 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			inferiorBezier.SP = new ED.Point(-380, 100 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-380, 200 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 360 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
		}
		else {
			inferiorBezier.SP = new ED.Point(-320, -0 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-320, 160 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
		}			
		
		
		if (tS0 > 0) {
		// Trim start of curve
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
			
		}
		
		if (tS1 < 1) {
		// Trim end of curve
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
			
		}
	}

	// define points for arc
	var p1 = p3 = new ED.Point(0,0);
		
	if (inferiorBezier) p1 = inferiorBezier.EP;
	else if (superiorBezier) p1 = superiorBezier.EP;
	if (superiorBezier) p3 = superiorBezier.SP;
	else if (inferiorBezier) p3 = inferiorBezier.SP;
	
	var p2 = new ED.Point(this.apexX, this.apexY);
	
	// solve determinants 
		// to calculate radius and centre point of arc that passes through all 3 control points
	var A = p1.x*(p2.y-p3.y) - p1.y*(p2.x-p3.x) + p2.x*p3.y - p3.x*p2.y;
	var B = (p1.x*p1.x+p1.y*p1.y)*(p3.y-p2.y) + (p2.x*p2.x+p2.y*p2.y)*(p1.y-p3.y) + (p3.x*p3.x+p3.y*p3.y)*(p2.y-p1.y);
	var C = (p1.x*p1.x+p1.y*p1.y)*(p2.x-p3.x) + (p2.x*p2.x+p2.y*p2.y)*(p3.x-p1.x) + (p3.x*p3.x+p3.y*p3.y)*(p1.x-p2.x);
	var D = (p1.x*p1.x+p1.y*p1.y)*(p3.x*p2.y-p2.x*p3.y) + (p2.x*p2.x+p2.y*p2.y)*(p1.x*p3.y-p3.x*p1.y) + (p3.x*p3.x+p3.y*p3.y)*(p2.x*p1.y-p1.x*p2.y);
	
	var x = -B / (2*A); // arc centre x point
	var y = -C / (2*A); // arc centre y point
	
	var r = Math.sqrt((B*B+C*C-4*A*D)/(4*A*A)); // arc radius
	
	// get arc start and end bearings
	var p1trans = new ED.Point(p1.x-x,p1.y-y);
	var p2trans = new ED.Point(p2.x-x,p2.y-y);
	var p3trans = new ED.Point(p3.x-x,p3.y-y);
	var dir1 = p1trans.direction()-0.5*Math.PI; // offset by 90deg as ctx.arc() starts at east point of circle
	var dir3 = p3trans.direction()-0.5*Math.PI;

	var concaveUp = (this.apexX<x) ? false : true;
			
	// define boundary path				
	if (inferiorBezier) {
		ctx.moveTo(inferiorBezier.SP.x-5, inferiorBezier.SP.y);
		ctx.bezierCurveTo(inferiorBezier.CP1.x-5, inferiorBezier.CP1.y, inferiorBezier.CP2.x-5, inferiorBezier.CP2.y, inferiorBezier.EP.x-5, inferiorBezier.EP.y);
	}
	
	if (!concaveUp) ctx.arc(x,y,r,dir1,dir3,false);
	else ctx.arc(x,y,r,dir1,dir3,true);
	
	if (superiorBezier) {
		ctx.lineTo(superiorBezier.SP.x-5, superiorBezier.SP.y);
		ctx.bezierCurveTo(superiorBezier.CP1.x-5, superiorBezier.CP1.y, superiorBezier.CP2.x-5, superiorBezier.CP2.y, superiorBezier.EP.x-5, superiorBezier.EP.y);
	}	
	

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = backgroundFillColour;
	ctx.strokeStyle = backgroundFillColour;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	
		// draw corneal barrier
		ctx.beginPath();
		
		if (!concaveUp) {
			// concave arc
			ctx.moveTo(p1.x,p1.y);
			ctx.arc(x,y,r,dir1,dir3,false);
		}
		else {
			// convex arc
			ctx.moveTo(p3.x,p3.y);
			ctx.arc(x,y,r,dir3,dir1);
		}
		
		// Set attributes
		ctx.strokeStyle = "gray";
		
		ctx.stroke();
		
		if (this.perforation) {
			// draw white line alongside cornea to hide any curve within the AC
			ctx.beginPath();
			var xDif = 14; // shift line along x axis to cover area adjacent to cornea: half line width + line width of cornea outline
			switch (cornea.shape) {
				case "Normal":
					ctx.bezierCurveTo(-80+xDif, 260-this.originY, -220+xDif, 180-this.originY, -220+xDif, 0-this.originY);
					ctx.bezierCurveTo(-220+xDif, -180-this.originY, -80+xDif, -260-this.originY, 0+xDif, -380-this.originY);
					break;
				
				case "Keratoconus":
					ctx.bezierCurveTo(-80+xDif, 260-this.originY, cornea.apexX + cornealThickness+xDif, cornea.apexY + 120-this.originY, cornea.apexX + cornealThickness+xDif, cornea.apexY-this.originY);
					ctx.bezierCurveTo(cornea.apexX + cornealThickness+xDif, cornea.apexY - 120-this.originY, -80+xDif, -260-this.originY, 0+xDif, -380-this.originY);
					break;
					
				case "Keratoglobus":
					ctx.bezierCurveTo(-80+xDif, 260-this.originY, -260+xDif, 220-this.originY, -280+xDif, 100-this.originY);
					ctx.bezierCurveTo(-280+xDif, -140-this.originY, -120+xDif, -200-this.originY, 0+xDif, -380-this.originY);
					break;
			}
			
			ctx.strokeStyle = "white";
			ctx.lineWidth = 20;
			ctx.stroke();
		}
	}
	
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) {
		this.drawHandles(_point);
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


