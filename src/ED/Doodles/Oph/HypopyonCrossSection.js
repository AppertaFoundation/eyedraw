/**
 * OpenEyes
 * MSC
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
 * MSC TODO: (1) Calculate t instead of current estimation based on time so level with apexY
 *           (2) Calculate x coordinate of stop positon if within inf / sup zonules 
 *
 * @class HypopyonCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.HypopyonCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "HypopyonCrossSection";

	// Private parameters
	this.initialRadius = 360;
	
	// Derived parameters
	this.ro = 380;
	this.minimum = 304;
	
	// Saved parameters
	this.savedParameterArray = ['apexY', 'originX'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.HypopyonCrossSection.prototype = new ED.Doodle;
ED.HypopyonCrossSection.prototype.constructor = ED.HypopyonCrossSection;
ED.HypopyonCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HypopyonCrossSection.prototype.setHandles = function() {
}

/**
 * Sets default properties
 */
ED.HypopyonCrossSection.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.addAtBack = true;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, this.minimum);

}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.HypopyonCrossSection.prototype.dependentParameterValues = function(_parameter, _value) {
}

/**
 * Sets default parameters
 */
ED.HypopyonCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 50; // as is in Cornea cross section doodle to dulicate bezier control points
	
	this.apexY = 260;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HypopyonCrossSection.prototype.draw = function(_point) {
	
	// Get context
	var ctx = this.drawing.context;

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	// Call draw method in superclass
	ED.HypopyonCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	// Calculate segment extent in terms of time along curve
	var startY = this.apexY - this.apexY/12; //buffer needed as only estimating t
	var startT = (startY + 380) / 760;
	if (startT<0) startT = 0;
	var endT = 1;
		
	if (startT < 0.5) {
		
		var superiorBezierBack = new Object;

		// define start and end time points
		var tI0 = startT * 2;
		var tI1 = (endT < 0.5) ? endT * 2 : 1;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			superiorBezierBack.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - 120 - this.originY);
			superiorBezierBack.EP = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			superiorBezierBack.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 120, -200 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-380 + 100, -140 - this.originY);
			superiorBezierBack.EP = new ED.Point(-380 + 100, 100 - this.originY);
		}
		else {
			superiorBezierBack.SP = new ED.Point(-120 + 120, -380 - this.originY);
			superiorBezierBack.CP1 = new ED.Point(-240 + 160, -260 - this.originY);
			superiorBezierBack.CP2 = new ED.Point(-320 + 100, -160 - this.originY);
			superiorBezierBack.EP = new ED.Point(-320 + 100, 0 - this.originY);
		}
		
			
		if (tI0 > 0) {
		// Trim start of curve			
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
		
		var inferiorBezierBack = new Object;
		
		// define start and end time points
		var tS0 = (startT > 0.5) ? (startT - 0.5) * 2 : 0;
		var tS1 = (endT - 0.5) * 2;
		
		// default bezier points (as in cornea cross section)
		if (cornea && cornea.shape == "Keratoconus") {
			inferiorBezierBack.SP = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(cornea.apexX + cornealThickness, cornea.apexY + 120 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120, 380 - this.originY);
		}
		else if (cornea && cornea.shape == "Keratoglobus") {
			inferiorBezierBack.SP = new ED.Point(-380 + 100, 100 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-380 + 120, 220 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120, 380 - this.originY);
		}
		else {
			inferiorBezierBack.SP = new ED.Point(-320 + 100, -0 - this.originY);
			inferiorBezierBack.CP1 = new ED.Point(-320 + 100, 160 - this.originY);
			inferiorBezierBack.CP2 = new ED.Point(-240 + 160, 260 - this.originY);
			inferiorBezierBack.EP = new ED.Point(-120 + 120, 380 - this.originY);
		}			
		
		
		if (tS0 > 0) {
		// Trim start of curve
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
	
	// Get relative lens position to draw around
	var lens = this.drawing.lastDoodleOfClass('LensCrossSection');
	var iris = this.drawing.lastDoodleOfClass('AntSegCrossSection');
	
	var marginX = (iris) ? iris.apexX: -20;

	if (lens) {
		// Displacement of lens from centre
		var ld = 100;
	
		// Angle of arc or lens
		var theta = Math.asin(240 / 300);
	
		// X coordinate of centre of lens arc
		var x = 300 * Math.cos(theta);
		
		if (lens.originX + ld + x - 300 - this.originX < iris.apexX) marginX = lens.originX + ld + x - 300 - this.originX;
	}
	
/*
	var lens = this.drawing.lastDoodleOfClass('LensCrossSection');
	if (lens) {
		// angle from lens arc centre to edge
		var theta = Math.asin(207 / 300);
		
		// angle from lens arc centre to y=apexY on lens arc
		var phi = (-this.apexY + lens.originY) / 300; 
		if (phi < 0) phi = 0;
				
		// if apex above top of lens capsule
		if (phi>theta) {
			phi = theta;
			
			var sp = new ED.Point(74, -349);
			var ep = new ED.Point(14 + lens.originX, -207 + lens.originY);
			var supZonule = sp;
			
			// but within zonules
			if (this.apexY > sp.y) {
				var angle = Math.atan(Math.abs((sp.y - ep.y)/(sp.x - ep.x)));
				var o = Math.abs(ep.y - this.apexY);
				var a = o / Math.tan(angle);
				
// 				supZonule.x += a;
				supZonule.y = (this.apexY < sp.y) ? sp.y : this.apexY;
			}
		}
		
		// if apex within lens capsule
		var pho = (this.apexY > lens.originY) ? (-this.apexY + lens.originY) / 300 + Math.PI : Math.PI;
		
		// if apex below lens capsule
		var infZonule = new ED.Point(14 + lens.originX, 207 + lens.originY);
		if (pho < Math.PI - theta) {
			infZonule.y = this.apexY;
		}

	}
*/

	// Draw it
	if (inferiorBezierBack) {
		ctx.moveTo(inferiorBezierBack.EP.x, inferiorBezierBack.EP.y);
		ctx.bezierCurveTo(inferiorBezierBack.CP2.x, inferiorBezierBack.CP2.y, inferiorBezierBack.CP1.x, inferiorBezierBack.CP1.y, inferiorBezierBack.SP.x, inferiorBezierBack.SP.y);
	}
	if (superiorBezierBack) {
		ctx.bezierCurveTo(superiorBezierBack.CP2.x, superiorBezierBack.CP2.y, superiorBezierBack.CP1.x, superiorBezierBack.CP1.y, superiorBezierBack.SP.x, superiorBezierBack.SP.y);
		if (!iris) ctx.lineTo(marginX, superiorBezierBack.SP.y);
		else {
			var x1 = (marginX < superiorBezierBack.SP.x) ? superiorBezierBack.SP.x : marginX;
// 			if (x1 < iris.apexX - 40) x1 = iris.apexX - 40;
			ctx.lineTo(x1, superiorBezierBack.SP.y);
			if (this.apexY < iris.apexY) {
				if (x1 > iris.apexX) x1 = iris.apexX;
				ctx.lineTo(x1, iris.apexY);
				ctx.lineTo(iris.apexX, iris.apexY);

			}

// 			if (this.apexY < iris.apexY) ctx.lineTo(iris.apexX, iris.apexY);
// 			else ctx.lineTo()
		}
	}
	
	if (!iris) {
		ctx.lineTo(marginX, inferiorBezierBack.SP.y);
		ctx.lineTo(40, 460);
	}
	else {
		var x2 = (marginX < inferiorBezierBack.SP.x) ? inferiorBezierBack.SP.x : marginX;
		if (x2 > iris.apexX) x2 = iris.apexX;
		ctx.lineTo(x2, inferiorBezierBack.SP.y);
		if (this.apexY < -iris.apexY) {
			if (x2 < iris.apexX) x2 = iris.apexX;
			ctx.lineTo(x2, -iris.apexY);
			ctx.lineTo(iris.apexX, -iris.apexY);
		}
		ctx.lineTo(40, 460);
	}
	
/*
	if (!lens) {
		ctx.lineTo(120, inferiorBezierBack.SP.y);
		ctx.lineTo(120, 450);
	}
	
	else { // draw around lens capsule
		
		// top zonules
		if (phi == theta) {
			ctx.lineTo(supZonule.x, this.apexY);
			ctx.lineTo(14 + lens.originX, -207 + lens.originY);
		}
		// top half of lens capsule
		if (this.apexY < lens.originY) ctx.arc(lens.originX + 225, lens.originY, 300, Math.PI + phi, Math.PI, true);
		
		// bottom half of lens capsule
		if (pho > Math.PI - theta) ctx.arc(lens.originX + 225, lens.originY, 300, pho, Math.PI - theta, true);
		
		// bottom zonules
		ctx.lineTo(infZonule.x, infZonule.y);
		ctx.lineTo(74, 349);
		ctx.lineTo(120, 450);
	}
*/
	
	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 5;
	ctx.fillStyle = "rgba(221,209,171,1)";
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


