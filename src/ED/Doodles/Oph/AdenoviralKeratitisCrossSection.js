/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2017
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
 * Adenoviral Keratitis Cross Section
 *
 * @class AdenoviralKeratitisCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.AdenoviralKeratitisCrossSection = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "AdenoviralKeratitisCrossSection";
	
	// Derived parameters
	this.h = 250;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'h'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.AdenoviralKeratitisCrossSection.prototype = new ED.Doodle;
ED.AdenoviralKeratitisCrossSection.prototype.constructor = ED.AdenoviralKeratitisCrossSection;
ED.AdenoviralKeratitisCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AdenoviralKeratitisCrossSection.prototype.setHandles = function() {
}

/**
 * Sets default properties
 */
ED.AdenoviralKeratitisCrossSection.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isFilled = false;
		
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(+50, +50);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
	
	this.parameterValidationArray['h'] = {
		kind: 'other',
		type: 'int',
		range: [0,1080],
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.AdenoviralKeratitisCrossSection.prototype.setParameterDefaults = function() {
	this.originX = 50; // as is in Cornea cross section doodle to dulicate bezier control points

}

/**
 * Draws a circular spot with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _r Radius
 * @param {String} _colour String containing colour
 */
ED.AdenoviralKeratitisCrossSection.prototype.drawOval = function(_ctx, _x, _y, _r, _rotation) {
	_ctx.save();
	_ctx.beginPath();
	_ctx.ellipse(_x, _y, 0.5*_r, _r, _rotation, 0, 2*Math.PI, true);
	_ctx.fillStyle = "rgba(215, 215, 215, 0.8)";
	_ctx.strokeStyle = "rgba(215, 215, 215, 0.8)";
	_ctx.shadowBlur = 2;
	_ctx.shadowColor="black";
	_ctx.lineWidth = 0;
	_ctx.fill();
	_ctx.stroke();
	_ctx.restore();
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AdenoviralKeratitisCrossSection.prototype.draw = function(_point) {	
	
	// Get context
	var ctx = this.drawing.context;

	var cornea = this.drawing.lastDoodleOfClass('CorneaCrossSection');
	var cornealThickness = cornea.pachymetry/5;

	// Call draw method in superclass
	ED.AdenoviralKeratitisCrossSection.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	
	// Calculate segment extent in terms of time along curve
	var r = this.h; // TO DO
	var startY = this.originY - r;
	var endY = this.originY + r;
		
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
		}
	}
	
	if (inferiorBezier) {
		ctx.moveTo(inferiorBezier.SP.x, inferiorBezier.SP.y);
		ctx.bezierCurveTo(inferiorBezier.CP1.x, inferiorBezier.CP1.y, inferiorBezier.CP2.x, inferiorBezier.CP2.y, inferiorBezier.EP.x, inferiorBezier.EP.y);
	}
	if (superiorBezier) {
		ctx.moveTo(superiorBezier.SP.x, superiorBezier.SP.y);
		ctx.bezierCurveTo(superiorBezier.CP1.x, superiorBezier.CP1.y, superiorBezier.CP2.x, superiorBezier.CP2.y, superiorBezier.EP.x, superiorBezier.EP.y);
	}
	
	
	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle = "rgba(0,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
		
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		var dr = 8 * ((this.apexX + 20) / 20) / this.scaleX;		
		var n = 4 + Math.abs(Math.floor(this.apexY / 8));
		
		var bezier;
		var p = new ED.Point(0, 0);
		var tP;
		var o = new ED.Point(0, 0);
		var angle;

		for (var i = 0; i < n; i++) {
			// random point in time
			tP = ED.randomArray[i+100];
			
			// set bezier appropriate for time point
			if (-r + this.h * 2 * tP + this.originY>0) bezier = inferiorBezier;
			else bezier = superiorBezier;
			
			// time along current bezier
			tP = (tP<=0.5) ? tP * 2 : (tP-0.5) * 2;
			
			// set point on bezier
			p.x = dr*0.5 + (1-tP)*(1-tP)*(1-tP)*bezier.SP.x + 3*(1-tP)*(1-tP)*tP*bezier.CP1.x + 3*(1-tP)*tP*tP*bezier.CP2.x + tP*tP*tP*bezier.EP.x;
			p.y = (1-tP)*(1-tP)*(1-tP)*bezier.SP.y + 3*(1-tP)*(1-tP)*tP*bezier.CP1.y + 3*(1-tP)*tP*tP*bezier.CP2.y + tP*tP*tP*bezier.EP.y;
			
			angle = p.direction() + 0.5*Math.PI;
						
			// draw spot
			this.drawOval(ctx, p.x, p.y, dr, angle);
		}
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
	
}


