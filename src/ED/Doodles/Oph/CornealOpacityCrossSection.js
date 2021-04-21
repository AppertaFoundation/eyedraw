/**
 * OpenEyes
 * MSC
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
 * TODO: shape contour, fix length of line calculation for corneas where the apex is not along the origin
 *
 * @class CornealOpacityCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealOpacityCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealOpacityCrossSection";

	// Private parameters
	this.initialRadius = 81;
	
	// Other parameters
	this.fHeight = Math.round(this.initialRadius * 2 / 54);
	this.fWidth = Math.round(this.initialRadius * 2 / 54);
	this.depth = 33;
	this.infiltrateWidth = 0;
	
	this.h = Math.round(this.initialRadius * 2 / 54);
	this.w = Math.round(this.initialRadius * 2 / 54);
	this.d = 33;
	this.iW = 0;
	
	this.minY = this.initialRadius * -1;
	this.maxY = this.initialRadius;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'fHeight', 'fWidth', 'depth', 'infiltrateWidth','d','minY','maxY'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'fHeight':'Height', 'fWidth':'Width', 'depth':'Depth (%)', 'infiltrateWidth':'Infiltrate fWidth'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// for historical records, where fWidth was saved as width
	this.fWidth = this.fWidth || this.width;
	this.fHeight = this.fHeight || this.height;

	this.linkedDoodleParameters = {
        'CornealOpacity': {
			source: ['d','originY','minY','maxY']
        }
    };
};

/**
 * Sets superclass and constructor
 */
ED.CornealOpacityCrossSection.prototype = new ED.Doodle;
ED.CornealOpacityCrossSection.prototype.constructor = ED.CornealOpacityCrossSection;
ED.CornealOpacityCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealOpacityCrossSection.prototype.setHandles = function() {
}

/**
 * Sets default properties
 */
ED.CornealOpacityCrossSection.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
		
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(+50, +50);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
	
	// Validation arrays for other parameters
	this.parameterValidationArray['fHeight'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['fWidth'] = {
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
	this.parameterValidationArray['infiltrateWidth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0, 15),
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
	};this.parameterValidationArray['iW'] = {
		kind: 'other',
		type: 'int',
		range: [0, 15],
		animate: false
	};
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: [1, 100],
		animate: false
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
ED.CornealOpacityCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'fWidth':
			returnArray['w'] = parseInt(_value);
			break;

		case 'fHeight':
			returnArray['h'] = parseInt(_value);
			break;
			
		case 'infiltrateWidth':
			returnArray['iW'] = parseInt(_value);
			break;
		
		case 'depth':
			returnArray['d'] = parseInt(_value);
			break;
			
		case 'h':
			returnArray['fHeight'] = _value;
			break;
		
		case 'd':
			returnArray['depth'] = _value;
			break;
			
		case 'w':
			returnArray['fWidth'] = _value;
			break;
		
		case 'iW':
			returnArray['infiltrateWidth'] = _value;
			break;

	}

	return returnArray;
}

/**
 * Sets default parameters
 */
ED.CornealOpacityCrossSection.prototype.setParameterDefaults = function() {

	// when loaded, they don't get initialized
	this.fHeight = Math.round(this.initialRadius * 2 / 54);
	this.fWidth = Math.round(this.initialRadius * 2 / 54);

	this.originX = 50; // as is in Cornea cross section doodle to dulicate bezier control points
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealOpacityCrossSection.prototype.draw = function(_point) {

	// Get context
	var ctx = this.drawing.context;

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	// Call draw method in superclass
	ED.CornealOpacityCrossSection.superclass.draw.call(this, _point);

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
		var superiorBezierBack = new Object;

		// define start and end time points
		var tI0 = startT * 2;
		var tI1 = (endT < 0.5) ? endT * 2 : 1;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(cornea.apexX, cornea.apexY - 100 - this.originY);
			superiorBezier.EP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120*this.depth/100, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160*this.depth/100, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(cornea.apexX + cornealThickness*this.depth/100, cornea.apexY - 120 - this.originY);
			superiorBezierBack.EP = new ED.Point(cornea.apexX + cornealThickness*this.depth/100, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(-380, -100 - this.originY);
			superiorBezier.EP = new ED.Point(-380, 100 - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120*this.depth/100, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 120*this.depth/100, -200 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-380 + 100*this.depth/100, -140 - this.originY);
			superiorBezierBack.EP = new ED.Point(-380 + 100*this.depth/100, 100 - this.originY);
		}
		else {
			superiorBezier.SP = new ED.Point(-120, -380 - this.originY);
			superiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
			superiorBezier.CP2 = new ED.Point(-320, -160 - this.originY);
			superiorBezier.EP = new ED.Point(-320, 0 - this.originY);
			
			superiorBezierBack.SP = new ED.Point(-120 + 120*this.depth/100, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160*this.depth/100, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-320 + 100*this.depth/100, -160 - this.originY);
			superiorBezierBack.EP = new ED.Point(-320 + 100*this.depth/100, 0 - this.originY);
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
			inferiorBezier.SP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
			inferiorBezier.CP1 = new ED.Point(cornea.apexX, cornea.apexY + 100 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(cornea.apexX + cornealThickness*this.depth/100, cornea.apexY - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(cornea.apexX + cornealThickness*this.depth/100, cornea.apexY + 120 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160*this.depth/100, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120*this.depth/100, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			inferiorBezier.SP = new ED.Point(-380, 100 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-380, 200 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 360 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(-380 + 100*this.depth/100, 100 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-380 + 120*this.depth/100, 220 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160*this.depth/100, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120*this.depth/100, 380 - this.originY);
		}
		else {
			inferiorBezier.SP = new ED.Point(-320, -0 - this.originY);
			inferiorBezier.CP1 = new ED.Point(-320, 160 - this.originY);
			inferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
			inferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
			
			inferiorBezierBack.SP = new ED.Point(-320 + 100*this.depth/100, -0 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-320 + 100*this.depth/100, 160 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160*this.depth/100, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120*this.depth/100, 380 - this.originY);
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
		ctx.moveTo(inferiorBezierBack.EP.x, inferiorBezierBack.EP.y);
		ctx.bezierCurveTo(inferiorBezierBack.CP2.x, inferiorBezierBack.CP2.y, inferiorBezierBack.CP1.x, inferiorBezierBack.CP1.y, inferiorBezierBack.SP.x, inferiorBezierBack.SP.y);
		ctx.lineTo(inferiorBezier.SP.x, inferiorBezier.SP.y);
		ctx.bezierCurveTo(inferiorBezier.CP1.x, inferiorBezier.CP1.y, inferiorBezier.CP2.x, inferiorBezier.CP2.y, inferiorBezier.EP.x, inferiorBezier.EP.y);
	}
	if (superiorBezier) {
		ctx.moveTo(superiorBezierBack.EP.x, superiorBezierBack.EP.y);
		ctx.bezierCurveTo(superiorBezierBack.CP2.x, superiorBezierBack.CP2.y, superiorBezierBack.CP1.x, superiorBezierBack.CP1.y, superiorBezierBack.SP.x, superiorBezierBack.SP.y);
		ctx.lineTo(superiorBezier.SP.x, superiorBezier.SP.y);
		ctx.bezierCurveTo(superiorBezier.CP1.x, superiorBezier.CP1.y, superiorBezier.CP2.x, superiorBezier.CP2.y, superiorBezier.EP.x, superiorBezier.EP.y);
	}
	
	
	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "gray";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// Infiltrate
		if (this.infiltrateWidth > 0) {
			// Re do all calculations, with extra length and width proportional to infiltrate width
			var iEndY = this.maxY + this.originY + 0.5 * this.infiltrateWidth * 2 * 54;
			var iStartY = this.minY + this.originY - 0.5 * this.infiltrateWidth * 2 * 54;
			
			var iStartT = (iStartY + 380) / 760;
			if (iStartT<0) iStartT = 0;
			var iEndT = (iEndY + 380) / 760;
			if (iEndT>1) iEndT = 1;
			
			var averageDimension = (this.fHeight + this.fWidth) / 2;
			var averageDimensionTotal = (this.fHeight + this.fWidth + 4*this.infiltrateWidth) / 2;


			var infiltrateScale = this.depth / averageDimension * averageDimensionTotal;
			if (infiltrateScale > 100) infiltrateScale = 100;
				
			if (iStartT < 0.5) {
				
				var iSuperiorBezier = new Object;
				var iSuperiorBezierBack = new Object;
		
				// define start and end time points
				var itI0 = iStartT * 2;
				var itI1 = (iEndT < 0.5) ? iEndT * 2 : 1;
				var ibtI0 = itI0 * infiltrateScale/100;
/* 				if (ibtI0 < itI0)  */ibtI0 = itI0;
				var ibtI1 = itI1 * infiltrateScale/100;
/* 				if (ibtI1 > itI1) */ ibtI1 = itI1;
						
				// default bezier points (as in cornea cross section)
				if (cornea && cornea.shape == "Keratoconus") {
					iSuperiorBezier.SP = new ED.Point(-120, -380 - this.originY);
					iSuperiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
					iSuperiorBezier.CP2 = new ED.Point(cornea.apexX, cornea.apexY - 100 - this.originY);
					iSuperiorBezier.EP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
					
					iSuperiorBezierBack.SP = new ED.Point(-120 + 120*infiltrateScale/100, -380 - this.originY);
					iSuperiorBezierBack.CP1 = new ED.Point(-240 + 160*infiltrateScale/100, -260 - this.originY);
					iSuperiorBezierBack.CP2 = new ED.Point(cornea.apexX + cornealThickness*infiltrateScale/100, cornea.apexY - 120 - this.originY);
					iSuperiorBezierBack.EP = new ED.Point(cornea.apexX + cornealThickness*infiltrateScale/100, cornea.apexY - this.originY);
				}
				else if (cornea && cornea.shape == "Keratoglobus") {
					iSuperiorBezier.SP = new ED.Point(-120, -380 - this.originY);
					iSuperiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
					iSuperiorBezier.CP2 = new ED.Point(-380, -100 - this.originY);
					iSuperiorBezier.EP = new ED.Point(-380, 100 - this.originY);
					
					iSuperiorBezierBack.SP = new ED.Point(-120 + 120*infiltrateScale/100, -380 - this.originY);
					iSuperiorBezierBack.CP1 = new ED.Point(-240 + 120*infiltrateScale/100, -200 - this.originY);
					iSuperiorBezierBack.CP2 = new ED.Point(-380 + 100*infiltrateScale/100, -140 - this.originY);
					iSuperiorBezierBack.EP = new ED.Point(-380 + 100*infiltrateScale/100, 100 - this.originY);
				}
				else {
					iSuperiorBezier.SP = new ED.Point(-120, -380 - this.originY);
					iSuperiorBezier.CP1 = new ED.Point(-240, -260 - this.originY);
					iSuperiorBezier.CP2 = new ED.Point(-320, -160 - this.originY);
					iSuperiorBezier.EP = new ED.Point(-320, 0 - this.originY);
					
					iSuperiorBezierBack.SP = new ED.Point(-120 + 120*infiltrateScale/100, -380 - this.originY);
					iSuperiorBezierBack.CP1 = new ED.Point(-240 + 160*infiltrateScale/100, -260 - this.originY);
					iSuperiorBezierBack.CP2 = new ED.Point(-320 + 100*infiltrateScale/100, -160 - this.originY);
					iSuperiorBezierBack.EP = new ED.Point(-320 + 100*infiltrateScale/100, 0 - this.originY);
				}
				
					
				if (itI0 > 0) {
				// Trim start of curve
				
					// front of cornea			
					var isq0 = new ED.Point(0,0);
					isq0.y = (1-itI0)*(1-itI0)*(1-itI0)*iSuperiorBezier.SP.y + 3*(1-itI0)*(1-itI0)*itI0*iSuperiorBezier.CP1.y + 3*(1-itI0)*itI0*itI0*iSuperiorBezier.CP2.y + itI0*itI0*itI0*iSuperiorBezier.EP.y;
					isq0.x = (1-itI0)*(1-itI0)*(1-itI0)*iSuperiorBezier.SP.x + 3*(1-itI0)*(1-itI0)*itI0*iSuperiorBezier.CP1.x + 3*(1-itI0)*itI0*itI0*iSuperiorBezier.CP2.x + itI0*itI0*itI0*iSuperiorBezier.EP.x;
					
					var iiP23 = new ED.Point(0,0);
					iiP23.x = iSuperiorBezier.CP1.x + itI0 * (iSuperiorBezier.CP2.x - iSuperiorBezier.CP1.x);
					iiP23.y = iSuperiorBezier.CP1.y + itI0 * (iSuperiorBezier.CP2.y - iSuperiorBezier.CP1.y);
					
					var iiP34 = new ED.Point(0,0);
					iiP34.x = iSuperiorBezier.CP2.x + itI0 * (iSuperiorBezier.EP.x - iSuperiorBezier.CP2.x);
					iiP34.y = iSuperiorBezier.CP2.y + itI0 * (iSuperiorBezier.EP.y - iSuperiorBezier.CP2.y);
					
					var iiP2334 = new ED.Point(0,0);
					iiP2334.x = iiP23.x + itI0 * (iiP34.x - iiP23.x);
					iiP2334.y = iiP23.y + itI0 * (iiP34.y - iiP23.y);
					
					iSuperiorBezier.SP = isq0;
					iSuperiorBezier.CP1 = iiP2334;
					iSuperiorBezier.CP2 = iiP34;
				}
				if (ibtI0 > 0) {
		
					// back of cornea
					var isq0b = new ED.Point(0,0);
					isq0b.y = (1-ibtI0)*(1-ibtI0)*(1-ibtI0)*iSuperiorBezierBack.SP.y + 3*(1-ibtI0)*(1-ibtI0)*ibtI0*iSuperiorBezierBack.CP1.y + 3*(1-ibtI0)*ibtI0*ibtI0*iSuperiorBezierBack.CP2.y + ibtI0*ibtI0*ibtI0*iSuperiorBezierBack.EP.y;
					isq0b.x = (1-ibtI0)*(1-ibtI0)*(1-ibtI0)*iSuperiorBezierBack.SP.x + 3*(1-ibtI0)*(1-ibtI0)*ibtI0*iSuperiorBezierBack.CP1.x + 3*(1-ibtI0)*ibtI0*ibtI0*iSuperiorBezierBack.CP2.x + ibtI0*ibtI0*ibtI0*iSuperiorBezierBack.EP.x;
					
					var iiP23b = new ED.Point(0,0);
					iiP23b.x = iSuperiorBezierBack.CP1.x + ibtI0 * (iSuperiorBezierBack.CP2.x - iSuperiorBezierBack.CP1.x);
					iiP23b.y = iSuperiorBezierBack.CP1.y + ibtI0 * (iSuperiorBezierBack.CP2.y - iSuperiorBezierBack.CP1.y);
					
					var iiP34b = new ED.Point(0,0);
					iiP34b.x = iSuperiorBezierBack.CP2.x + ibtI0 * (iSuperiorBezierBack.EP.x - iSuperiorBezierBack.CP2.x);
					iiP34b.y = iSuperiorBezierBack.CP2.y + ibtI0 * (iSuperiorBezierBack.EP.y - iSuperiorBezierBack.CP2.y);
					
					var iiP2334b = new ED.Point(0,0);
					iiP2334b.x = iiP23b.x + ibtI0 * (iiP34b.x - iiP23b.x);
					iiP2334b.y = iiP23b.y + ibtI0 * (iiP34b.y - iiP23b.y);
					
					iSuperiorBezierBack.SP = isq0b;
					iSuperiorBezierBack.CP1 = iiP2334b;
					iSuperiorBezierBack.CP2 = iiP34b;
				}
				
				if (itI1 < 1) {
				// Trim end of curve
					
					// front of cornea
					var iiq1 = new ED.Point(0,0);
					iiq1.y = (1-itI1)*(1-itI1)*(1-itI1)*iSuperiorBezier.SP.y + 3*(1-itI1)*(1-itI1)*itI1*iSuperiorBezier.CP1.y + 3*(1-itI1)*itI1*itI1*iSuperiorBezier.CP2.y + itI1*itI1*itI1*iSuperiorBezier.EP.y;
					iiq1.x = (1-itI1)*(1-itI1)*(1-itI1)*iSuperiorBezier.SP.x + 3*(1-itI1)*(1-itI1)*itI1*iSuperiorBezier.CP1.x + 3*(1-itI1)*itI1*itI1*iSuperiorBezier.CP2.x + itI1*itI1*itI1*iSuperiorBezier.EP.x;
		
					var iiP12 = new ED.Point(0,0);
					iiP12.x = iSuperiorBezier.SP.x + itI1 * (iSuperiorBezier.CP1.x - iSuperiorBezier.SP.x);
					iiP12.y = iSuperiorBezier.SP.y + itI1 * (iSuperiorBezier.CP1.y - iSuperiorBezier.SP.y);
					
					var iiP23 = new ED.Point(0,0);
					iiP23.x = iSuperiorBezier.CP1.x + itI1 * (iSuperiorBezier.CP2.x - iSuperiorBezier.CP1.x);
					iiP23.y = iSuperiorBezier.CP1.y + itI1 * (iSuperiorBezier.CP2.y - iSuperiorBezier.CP1.y);
					
					var iiP1223 = new ED.Point(0,0);
					iiP1223.x = iiP12.x + itI1 * (iiP23.x - iiP12.x);
					iiP1223.y = iiP12.y + itI1 * (iiP23.y - iiP12.y);
					
					iSuperiorBezier.CP1 = iiP12;
					iSuperiorBezier.CP2 = iiP1223;
					iSuperiorBezier.EP = iiq1;
				
				}
				if (ibtI1 > 0) {
					// back of cornea
					var iiq1b = new ED.Point(0,0);
					iiq1b.y = (1-ibtI1)*(1-ibtI1)*(1-ibtI1)*iSuperiorBezierBack.SP.y + 3*(1-ibtI1)*(1-ibtI1)*ibtI1*iSuperiorBezierBack.CP1.y + 3*(1-ibtI1)*ibtI1*ibtI1*iSuperiorBezierBack.CP2.y + ibtI1*ibtI1*ibtI1*iSuperiorBezierBack.EP.y;
					iiq1b.x = (1-ibtI1)*(1-ibtI1)*(1-ibtI1)*iSuperiorBezierBack.SP.x + 3*(1-ibtI1)*(1-ibtI1)*ibtI1*iSuperiorBezierBack.CP1.x + 3*(1-ibtI1)*ibtI1*ibtI1*iSuperiorBezierBack.CP2.x + ibtI1*ibtI1*ibtI1*iSuperiorBezierBack.EP.x;
		
					var iiP12b = new ED.Point(0,0);
					iiP12b.x = iSuperiorBezierBack.SP.x + ibtI1 * (iSuperiorBezierBack.CP1.x - iSuperiorBezierBack.SP.x);
					iiP12b.y = iSuperiorBezierBack.SP.y + ibtI1 * (iSuperiorBezierBack.CP1.y - iSuperiorBezierBack.SP.y);
					
					var iiP23b = new ED.Point(0,0);
					iiP23b.x = iSuperiorBezierBack.CP1.x + ibtI1 * (iSuperiorBezierBack.CP2.x - iSuperiorBezierBack.CP1.x);
					iiP23b.y = iSuperiorBezierBack.CP1.y + ibtI1 * (iSuperiorBezierBack.CP2.y - iSuperiorBezierBack.CP1.y);
					
					var iiP1223b = new ED.Point(0,0);
					iiP1223b.x = iiP12b.x + ibtI1 * (iiP23b.x - iiP12b.x);
					iiP1223b.y = iiP12b.y + ibtI1 * (iiP23b.y - iiP12b.y);
					
					iSuperiorBezierBack.CP1 = iiP12b;
					iSuperiorBezierBack.CP2 = iiP1223b;
					iSuperiorBezierBack.EP = iiq1b;
				}
			
			}
			
			
			if (iEndT > 0.5) {
				
				var iInferiorBezier = new Object;
				var iInferiorBezierBack = new Object;
				
				// define start and end time points
				var itS0 = (iStartT > 0.5) ? (iStartT - 0.5) * 2 : 0;
				var itS1 = (iEndT - 0.5) * 2;
				var ibtS0 = itS0 * infiltrateScale/100;
/* 				if (ibtS0<tS0) */ ibtS0 = itS0;
				var ibtS1 = itS1 * infiltrateScale/100;
/* 				if (ibtS1>tS1) */ ibtS1 = itS1;
				
				// default bezier points (as in cornea cross section)
				if (cornea && cornea.shape == "Keratoconus") {
					iInferiorBezier.SP = new ED.Point(cornea.apexX, cornea.apexY - this.originY);
					iInferiorBezier.CP1 = new ED.Point(cornea.apexX, cornea.apexY + 100 - this.originY);
					iInferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
					iInferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
					
					iInferiorBezierBack.SP = new ED.Point(cornea.apexX + cornealThickness*infiltrateScale/100, cornea.apexY - this.originY);
					iInferiorBezierBack.CP1 = new ED.Point(cornea.apexX + cornealThickness*infiltrateScale/100, cornea.apexY + 120 - this.originY);
					iInferiorBezierBack.CP2 = new ED.Point(-240 + 160*infiltrateScale/100, 260 - this.originY);
					iInferiorBezierBack.EP = new ED.Point(-120 + 120*infiltrateScale/100, 380 - this.originY);
				}
				else if (cornea && cornea.shape == "Keratoglobus") {
					iInferiorBezier.SP = new ED.Point(-380, 100 - this.originY);
					iInferiorBezier.CP1 = new ED.Point(-380, 200 - this.originY);
					iInferiorBezier.CP2 = new ED.Point(-240, 360 - this.originY);
					iInferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
					
					iInferiorBezierBack.SP = new ED.Point(-380 + 100*infiltrateScale/100, 100 - this.originY);
					iInferiorBezierBack.CP1 = new ED.Point(-380 + 120*infiltrateScale/100, 220 - this.originY);
					iInferiorBezierBack.CP2 = new ED.Point(-240 + 160*infiltrateScale/100, 260 - this.originY);
					iInferiorBezierBack.EP = new ED.Point(-120 + 120*infiltrateScale/100, 380 - this.originY);
				}
				else {
					iInferiorBezier.SP = new ED.Point(-320, -0 - this.originY);
					iInferiorBezier.CP1 = new ED.Point(-320, 160 - this.originY);
					iInferiorBezier.CP2 = new ED.Point(-240, 260 - this.originY);
					iInferiorBezier.EP = new ED.Point(-120, 380 - this.originY);
					
					iInferiorBezierBack.SP = new ED.Point(-320 + 100*infiltrateScale/100, -0 - this.originY);
					iInferiorBezierBack.CP1 = new ED.Point(-320 + 100*infiltrateScale/100, 160 - this.originY);
					iInferiorBezierBack.CP2 = new ED.Point(-240 + 160*infiltrateScale/100, 260 - this.originY);
					iInferiorBezierBack.EP = new ED.Point(-120 + 120*infiltrateScale/100, 380 - this.originY);
				}	
				
				if (itS0 > 0) {
				// Trim start of curve	
				
					// front of cornea		
					var isq0 = new ED.Point(0,0);
					isq0.y = (1-itS0)*(1-itS0)*(1-itS0)*iInferiorBezier.SP.y + 3*(1-itS0)*(1-itS0)*itS0*iInferiorBezier.CP1.y + 3*(1-itS0)*itS0*itS0*iInferiorBezier.CP2.y + itS0*itS0*itS0*iInferiorBezier.EP.y;
					isq0.x = (1-itS0)*(1-itS0)*(1-itS0)*iInferiorBezier.SP.x + 3*(1-itS0)*(1-itS0)*itS0*iInferiorBezier.CP1.x + 3*(1-itS0)*itS0*itS0*iInferiorBezier.CP2.x + itS0*itS0*itS0*iInferiorBezier.EP.x;
					
					var isP23 = new ED.Point(0,0);
					isP23.x = iInferiorBezier.CP1.x + itS0 * (iInferiorBezier.CP2.x - iInferiorBezier.CP1.x);
					isP23.y = iInferiorBezier.CP1.y + itS0 * (iInferiorBezier.CP2.y - iInferiorBezier.CP1.y);
					
					var isP34 = new ED.Point(0,0);
					isP34.x = iInferiorBezier.CP2.x + itS0 * (iInferiorBezier.EP.x - iInferiorBezier.CP2.x);
					isP34.y = iInferiorBezier.CP2.y + itS0 * (iInferiorBezier.EP.y - iInferiorBezier.CP2.y);
					
					var isP2334 = new ED.Point(0,0);
					isP2334.x = isP23.x + itS0 * (isP34.x - isP23.x);
					isP2334.y = isP23.y + itS0 * (isP34.y - isP23.y);
					
					iInferiorBezier.SP = isq0;
					iInferiorBezier.CP1 = isP2334;
					iInferiorBezier.CP2 = isP34;
				}
				if (ibtS0 > 0) {	
					// back of cornea
					var isq0b = new ED.Point(0,0);
					isq0b.y = (1-ibtS0)*(1-ibtS0)*(1-ibtS0)*iInferiorBezierBack.SP.y + 3*(1-ibtS0)*(1-ibtS0)*ibtS0*iInferiorBezierBack.CP1.y + 3*(1-ibtS0)*ibtS0*ibtS0*iInferiorBezierBack.CP2.y + ibtS0*ibtS0*ibtS0*iInferiorBezierBack.EP.y;
					isq0b.x = (1-ibtS0)*(1-ibtS0)*(1-ibtS0)*iInferiorBezierBack.SP.x + 3*(1-ibtS0)*(1-ibtS0)*ibtS0*iInferiorBezierBack.CP1.x + 3*(1-ibtS0)*ibtS0*ibtS0*iInferiorBezierBack.CP2.x + ibtS0*ibtS0*ibtS0*iInferiorBezierBack.EP.x;
					
					var isP23b = new ED.Point(0,0);
					isP23b.x = iInferiorBezierBack.CP1.x + ibtS0 * (iInferiorBezierBack.CP2.x - iInferiorBezierBack.CP1.x);
					isP23b.y = iInferiorBezierBack.CP1.y + ibtS0 * (iInferiorBezierBack.CP2.y - iInferiorBezierBack.CP1.y);
					
					var isP34b = new ED.Point(0,0);
					isP34b.x = iInferiorBezierBack.CP2.x + ibtS0 * (iInferiorBezierBack.EP.x - iInferiorBezierBack.CP2.x);
					isP34b.y = iInferiorBezierBack.CP2.y + ibtS0 * (iInferiorBezierBack.EP.y - iInferiorBezierBack.CP2.y);
					
					var isP2334b = new ED.Point(0,0);
					isP2334b.x = isP23b.x + ibtS0 * (isP34b.x - isP23b.x);
					isP2334b.y = isP23b.y + ibtS0 * (isP34b.y - isP23b.y);
					
					iInferiorBezierBack.SP = isq0b;
					iInferiorBezierBack.CP1 = isP2334b;
					iInferiorBezierBack.CP2 = isP34b;
				}
				
				if (itS1 < 1) {
				// Trim end of curve
				
					// front of cornea
					var isq1 = new ED.Point(0,0);
					isq1.y = (1-itS1)*(1-itS1)*(1-itS1)*iInferiorBezier.SP.y + 3*(1-itS1)*(1-itS1)*itS1*iInferiorBezier.CP1.y + 3*(1-itS1)*itS1*itS1*iInferiorBezier.CP2.y + itS1*itS1*itS1*iInferiorBezier.EP.y;
					isq1.x = (1-itS1)*(1-itS1)*(1-itS1)*iInferiorBezier.SP.x + 3*(1-itS1)*(1-itS1)*itS1*iInferiorBezier.CP1.x + 3*(1-itS1)*itS1*itS1*iInferiorBezier.CP2.x + itS1*itS1*itS1*iInferiorBezier.EP.x;
		
					var isP12 = new ED.Point(0,0);
					isP12.x = iInferiorBezier.SP.x + itS1 * (iInferiorBezier.CP1.x - iInferiorBezier.SP.x);
					isP12.y = iInferiorBezier.SP.y + itS1 * (iInferiorBezier.CP1.y - iInferiorBezier.SP.y);
					
					var isP23 = new ED.Point(0,0);
					isP23.x = iInferiorBezier.CP1.x + itS1 * (iInferiorBezier.CP2.x - iInferiorBezier.CP1.x);
					isP23.y = iInferiorBezier.CP1.y + itS1 * (iInferiorBezier.CP2.y - iInferiorBezier.CP1.y);
					
					var isP1223 = new ED.Point(0,0);
					isP1223.x = isP12.x + itS1 * (isP23.x - isP12.x);
					isP1223.y = isP12.y + itS1 * (isP23.y - isP12.y);
		
					iInferiorBezier.CP1 = isP12;
					iInferiorBezier.CP2 = isP1223;
					iInferiorBezier.EP = isq1;
					
					// back of cornea
					var isq1b = new ED.Point(0,0);
					isq1b.y = (1-ibtS1)*(1-ibtS1)*(1-ibtS1)*iInferiorBezierBack.SP.y + 3*(1-ibtS1)*(1-ibtS1)*ibtS1*iInferiorBezierBack.CP1.y + 3*(1-ibtS1)*ibtS1*ibtS1*iInferiorBezierBack.CP2.y + ibtS1*ibtS1*ibtS1*iInferiorBezierBack.EP.y;
					isq1b.x = (1-ibtS1)*(1-ibtS1)*(1-ibtS1)*iInferiorBezierBack.SP.x + 3*(1-ibtS1)*(1-ibtS1)*ibtS1*iInferiorBezierBack.CP1.x + 3*(1-ibtS1)*ibtS1*ibtS1*iInferiorBezierBack.CP2.x + ibtS1*ibtS1*ibtS1*iInferiorBezierBack.EP.x;
		
					var isP12b = new ED.Point(0,0);
					isP12b.x = iInferiorBezierBack.SP.x + ibtS1 * (iInferiorBezierBack.CP1.x - iInferiorBezierBack.SP.x);
					isP12b.y = iInferiorBezierBack.SP.y + ibtS1 * (iInferiorBezierBack.CP1.y - iInferiorBezierBack.SP.y);
					
					var isP23b = new ED.Point(0,0);
					isP23b.x = iInferiorBezierBack.CP1.x + ibtS1 * (iInferiorBezierBack.CP2.x - iInferiorBezierBack.CP1.x);
					isP23b.y = iInferiorBezierBack.CP1.y + ibtS1 * (iInferiorBezierBack.CP2.y - iInferiorBezierBack.CP1.y);
					
					var isP1223b = new ED.Point(0,0);
					isP1223b.x = isP12b.x + ibtS1 * (isP23b.x - isP12b.x);
					isP1223b.y = isP12b.y + ibtS1 * (isP23b.y - isP12b.y);
		
					iInferiorBezierBack.CP1 = isP12b;
					iInferiorBezierBack.CP2 = isP1223b;
					iInferiorBezierBack.EP = isq1b;
					
				}
				
			}

			// Draw infiltrate
			ctx.beginPath();
			
			if (iInferiorBezier) {
				ctx.moveTo(iInferiorBezierBack.EP.x, iInferiorBezierBack.EP.y); // starts at bottom of back inferior bezier
				ctx.bezierCurveTo(iInferiorBezierBack.CP2.x, iInferiorBezierBack.CP2.y, iInferiorBezierBack.CP1.x, iInferiorBezierBack.CP1.y, iInferiorBezierBack.SP.x, iInferiorBezierBack.SP.y);				
			}
			
			
			if (iSuperiorBezierBack && iSuperiorBezierBack.EP.y>=iSuperiorBezierBack.SP.y) {
				ctx.moveTo(iSuperiorBezierBack.EP.x, iSuperiorBezierBack.EP.y); // start at bottom of back superior curve (closest to midpoint)
				ctx.bezierCurveTo(iSuperiorBezierBack.CP2.x, iSuperiorBezierBack.CP2.y, iSuperiorBezierBack.CP1.x, iSuperiorBezierBack.CP1.y, iSuperiorBezierBack.SP.x, iSuperiorBezierBack.SP.y);
				ctx.lineTo(iSuperiorBezier.SP.x, iSuperiorBezier.SP.y);
				ctx.bezierCurveTo(iSuperiorBezier.CP1.x, iSuperiorBezier.CP1.y, iSuperiorBezier.CP2.x, iSuperiorBezier.CP2.y, iSuperiorBezier.EP.x, iSuperiorBezier.EP.y); // end at bottom of front superior bezier (near midpoint)
			}
			else if (iSuperiorBezier) {
				ctx.lineTo(iSuperiorBezier.SP.x, iSuperiorBezier.SP.y);
				ctx.bezierCurveTo(iSuperiorBezier.CP1.x, iSuperiorBezier.CP1.y, iSuperiorBezier.CP2.x, iSuperiorBezier.CP2.y, iSuperiorBezier.EP.x, iSuperiorBezier.EP.y);
			}
			
			if (iInferiorBezier) {
				ctx.lineTo(iInferiorBezier.SP.x, iInferiorBezier.SP.y); // top of inferior bezier at the front
				ctx.bezierCurveTo(iInferiorBezier.CP1.x, iInferiorBezier.CP1.y, iInferiorBezier.CP2.x, iInferiorBezier.CP2.y, iInferiorBezier.EP.x, iInferiorBezier.EP.y); // ends at bottom of front inferior bezier
			}
			if (iInferiorBezierBack && iInferiorBezierBack.EP.y>=iInferiorBezierBack.SP.y) {
				ctx.lineTo(iInferiorBezierBack.EP.x, iInferiorBezierBack.EP.y);
			}
			else ctx.lineTo(iSuperiorBezierBack.EP.x,iSuperiorBezierBack.EP.y);
			
			ctx.fillStyle = "rgba(0,0,0,0.2)";
			ctx.fill();
			
			// fill opacity on top of
			ctx.beginPath();
			if (inferiorBezier) {
				ctx.moveTo(inferiorBezierBack.EP.x, inferiorBezierBack.EP.y);
				ctx.bezierCurveTo(inferiorBezierBack.CP2.x, inferiorBezierBack.CP2.y, inferiorBezierBack.CP1.x, inferiorBezierBack.CP1.y, inferiorBezierBack.SP.x, inferiorBezierBack.SP.y);
				ctx.lineTo(inferiorBezier.SP.x, inferiorBezier.SP.y);
				ctx.bezierCurveTo(inferiorBezier.CP1.x, inferiorBezier.CP1.y, inferiorBezier.CP2.x, inferiorBezier.CP2.y, inferiorBezier.EP.x, inferiorBezier.EP.y);
			}
			if (superiorBezier) {
				ctx.moveTo(superiorBezierBack.EP.x, superiorBezierBack.EP.y);
				ctx.bezierCurveTo(superiorBezierBack.CP2.x, superiorBezierBack.CP2.y, superiorBezierBack.CP1.x, superiorBezierBack.CP1.y, superiorBezierBack.SP.x, superiorBezierBack.SP.y);
				ctx.lineTo(superiorBezier.SP.x, superiorBezier.SP.y);
				ctx.bezierCurveTo(superiorBezier.CP1.x, superiorBezier.CP1.y, superiorBezier.CP2.x, superiorBezier.CP2.y, superiorBezier.EP.x, superiorBezier.EP.y);
			}
			ctx.fillStyle = "gray";
			ctx.fill();
		}
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


