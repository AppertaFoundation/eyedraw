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
 * Family Member
 *
 * @class MemberConnector
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MemberConnector = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MemberConnector";

	// Special parameters (passed from Pedigree Object)
	this.relationship = null;

	// Derived parameters
	this.type = "mate";
	this.adoption = false;
	this.startX = 0;
	this.startY = 0;
	this.endX = 0;
	this.endY = 0;
	this.xOverhang = 0; // used for parentChild relationship, gives distance to centre point between parents 
	this.sibshipXtra = 0; //used for multipleBirth relationships and parentChild where child is multiplet
	this.generationHeight = 0;
// 	this.noSelection = true;
	this.multiplePartnerFrom = 0;
	this.multiplePartnerTo = 0;
	this.zoomFactor = 1;
	this.dimension = 38;
	this.significant = true;
	// Saved parameters
	//this.savedParameterArray = ['rotation', 'gender'];

	// Parameters in doodle control bar (parameter name: parameter label)
	//this.controlParameterArray = {'gender':'Gender'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MemberConnector.prototype = new ED.Doodle;
ED.MemberConnector.prototype.constructor = ED.MemberConnector;
ED.MemberConnector.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.MemberConnector.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isFilled = false;
	this.addAtBack = true;
	this.noPopup = true;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['zoomFactor'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-10, 10),
		precision: 3,
		animate: true
	};
	this.parameterValidationArray['startX'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['startY'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['endX'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['endY'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['multiplePartnerFrom'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(-2, 4), // limited to 4 as 
		animate: true
	};
	this.parameterValidationArray['multiplePartnerTo'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(-2, 4), // limited to 4 as 
		animate: true
	};
	this.parameterValidationArray['xOverhang'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['sibshipXtra'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(-100000, 100000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['generationHeight'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(0, 1000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['sib', 'mate','parentChild','mateConsang','mateSep','sibMZ','sibDZ'],
		animate: true
	};
	this.parameterValidationArray['significant'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.MemberConnector.prototype.setParameterDefaults = function() {
	// Calculate maximum range of origin:
	var halfWidth = Math.round(this.drawing.doodlePlaneWidth / 2);
	var halfHeight = Math.round(this.drawing.doodlePlaneHeight / 2);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['originX'] = {
		kind: 'simple',
		type: 'float',
		range: new ED.Range(-halfWidth, +halfWidth),
		animate: true
	};
	this.parameterValidationArray['originY'] = {
		kind: 'simple',
		type: 'float',
		range: new ED.Range(-halfHeight, +halfHeight),
		animate: true
	};
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MemberConnector.prototype.draw = function(_point) {	
	if (this.significant) {
		if (this.type=="mateConsang") this.addAtBack = false;
	
		// Get context
		var ctx = this.drawing.context;
		ctx.lineWidth = 3 * this.zoomFactor;
		
		// Colour of outer line is dark gray
		if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "#bfbfbf";
		else ctx.strokeStyle = "black";
	
		// Call draw method in superclass
		ED.MemberConnector.superclass.draw.call(this, _point);
	
		// Boundary path
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		switch (this.type) {
			case 'mate':
			// ensure startX always < endX just for xDif in multiple partners...
				var sX = (this.startX<= this.endX) ? this.startX : this.endX;
				var sY = (this.startX<= this.endX) ? this.startY : this.endY;
				var eX = (this.startX<= this.endX) ? this.endX : this.startX;
				var eY = (this.startX<= this.endX) ? this.endY : this.startY;
				
				var xDif1 = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerFrom*family.zoomFactor : 0;
				var xDif2 = (this.multiplePartnerTo>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerTo*family.zoomFactor : 0;
	// 			var xDif = (this.multiplePartner) ? 38*Math.sin(0.25*Math.PI) : 0;
				var yDif = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor + 16*this.multiplePartnerFrom*family.zoomFactor : 0;
				
				ctx.moveTo(sX + xDif1,sY);
				ctx.lineTo(sX + xDif1,sY+yDif);
				ctx.lineTo(eX - xDif2,eY+yDif);
				ctx.lineTo(eX - xDif2, eY);
				break;
			case 'mateSep':
			// ensure startX always < endX just to make life easier...
				var sX = (this.startX<= this.endX) ? this.startX : this.endX;
				var sY = (this.startX<= this.endX) ? this.startY : this.endY;
				var eX = (this.startX<= this.endX) ? this.endX : this.startX;
				var eY = (this.startX<= this.endX) ? this.endY : this.startY;
				
				var xDif1 = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerFrom*family.zoomFactor : 0;
				var xDif2 = (this.multiplePartnerTo>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerTo*family.zoomFactor : 0;
				var yDif = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor + 16*this.multiplePartnerFrom*family.zoomFactor : 0;
				
				ctx.moveTo(sX + xDif1,sY);
				ctx.lineTo(sX + xDif1, sY + yDif);
				ctx.lineTo(sX + Math.abs(0.35 * (sX - eX)) + 2*family.zoomFactor, eY + yDif);
				ctx.moveTo(sX + Math.abs(0.35 * (sX - eX)) + 5*family.zoomFactor + 2*family.zoomFactor, eY - 10*family.zoomFactor + yDif);
				ctx.lineTo(sX + Math.abs(0.35 * (sX - eX)) - 5*family.zoomFactor + 2*family.zoomFactor, eY + 10*family.zoomFactor + yDif);
				ctx.moveTo(sX + Math.abs(0.35 * (sX - eX)) + 15*family.zoomFactor, eY - 10*family.zoomFactor + yDif);
				ctx.lineTo(sX + Math.abs(0.35 * (sX - eX)) + 5*family.zoomFactor, eY + 10*family.zoomFactor + yDif);
				ctx.moveTo(sX + Math.abs(0.35 * (sX - eX))+10*family.zoomFactor, eY + yDif);
				ctx.lineTo(eX - xDif2, eY + yDif);
				ctx.lineTo(eX - xDif2, eY);
				break;
			case 'mateConsang':
			// ensure startX always < endX just to make life easier...
				var sX = (this.startX<= this.endX) ? this.startX : this.endX;
				var sY = (this.startX<= this.endX) ? this.startY : this.endY;
				var eX = (this.startX<= this.endX) ? this.endX : this.startX;
				var eY = (this.startX<= this.endX) ? this.endY : this.startY;
	
				var xDif1 = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerFrom*family.zoomFactor : 0;
				var xDif2 = (this.multiplePartnerTo>0) ? family.nodeDimension*family.zoomFactor - 8*this.multiplePartnerTo*family.zoomFactor : 0;
				var yDif = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor + 16*this.multiplePartnerFrom*family.zoomFactor : 0;
				
				ctx.moveTo(sX + xDif1, sY - 7*family.zoomFactor + yDif);
				ctx.lineTo(eX - xDif2, eY - 7*family.zoomFactor + yDif);
				ctx.moveTo(sX + xDif1, sY + 7*family.zoomFactor);
				ctx.lineTo(sX + xDif1, sY + 7*family.zoomFactor + yDif);
				ctx.lineTo(eX - xDif2, eY + 7*family.zoomFactor + yDif);
				ctx.lineTo(eX - xDif2, eY + 7*family.zoomFactor);
				break;
			case 'parentChild':
			// from parent node, to child
			// NB. child will always have two parents in the current set up...
			// deals with a single line for spouses and siblings with x overhang values
			// deals with differing heights if parents of multiple partner with value of multiplePartner
				var yDif = (this.multiplePartnerFrom>0) ? family.nodeDimension*family.zoomFactor + 16*this.multiplePartnerFrom*family.zoomFactor : 0;
				
				ctx.moveTo(this.startX + this.xOverhang, this.startY + yDif)
				ctx.lineTo(this.startX + this.xOverhang, this.endY - 0.4 * (this.generationHeight))
				ctx.lineTo(this.endX + this.sibshipXtra, this.endY - 0.4 * (this.generationHeight))
	// 			ctx.lineTo(this.endX, this.endY - 38);
				break;
			case 'sib':
			// uses the height of the generation to give the proportional stub height
	// 			ctx.moveTo(this.startX, this.startY - 38);
				ctx.moveTo(this.startX + this.sibshipXtra, this.startY - this.generationHeight * 0.4);
				ctx.lineTo(this.endX + this.xOverhang, this.endY - this.generationHeight * 0.4);
	// 			ctx.lineTo(this.endX, this.endY - 38);
				break;
			case 'sibMZ':			
				ctx.moveTo(this.startX, this.startY - family.nodeDimension*family.zoomFactor);
				ctx.lineTo(this.sibshipXtra, this.startY - this.generationHeight * 0.4)
				ctx.lineTo(this.endX, this.endY - family.nodeDimension*family.zoomFactor);
				break;
			case 'sibDZ':
			// uses the height of the generation to give the proportional stub height
				ctx.moveTo(this.startX, this.startY - family.nodeDimension*family.zoomFactor);
				ctx.lineTo(this.sibshipXtra, this.startY - this.generationHeight * 0.4)
				ctx.lineTo(this.endX, this.endY - family.nodeDimension*family.zoomFactor);
				break;
			default:
				break;
		}
	/*
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
	*/
	
		// Set line attributes
	// 	ctx.lineWidth = 4;
	// 	ctx.fillStyle = 'black';
	
		// Colour of outer line is dark gray
	/*
		if (this.drawing.selectedDoodle) ctx.strokeStyle = "#bfbfbf";
		else ctx.strokeStyle = "#3b3b3b";
	*/
		
		// Draw boundary path (also hit testing)
		this.drawBoundary(_point);
	
		// if type == parentChild, and child is adopted
		if (this.type=="mateConsang") {
			ctx.beginPath();
			ctx.moveTo(this.startX, this.startY - 6*family.zoomFactor);
			ctx.lineTo(this.endX, this.endY - 6*family.zoomFactor);
			ctx.lineTo(this.endX, this.endY + 6*family.zoomFactor);
			ctx.lineTo(this.startX, this.startY + 6*family.zoomFactor);
			ctx.lineTo(this.startX, this.startY-6*family.zoomFactor);
			ctx.closePath();
			ctx.fillStyle = 'white';
			ctx.fill();
		}
		
		// if type == MZ sibs, draw tiangle at top of sibship
		if (this.type =="sibMZ") {
			var sX = (this.startX<= this.endX) ? this.startX : this.endX;
			var sY = (this.startX<= this.endX) ? this.startY : this.endY;
			var eX = (this.startX<= this.endX) ? this.endX : this.startX;
			var eY = (this.startX<= this.endX) ? this.endY : this.startY;
			
			var theta1 = Math.atan(Math.abs((this.sibshipXtra-sX)) / (0.4*this.generationHeight-family.nodeDimension*family.zoomFactor));
			var xDif1 =  Math.tan(theta1) * (0.3*this.generationHeight-family.nodeDimension*family.zoomFactor);
			var theta2 = Math.atan(Math.abs((this.sibshipXtra-eX)) / (0.4*this.generationHeight-family.nodeDimension*family.zoomFactor));
			var xDif2 =  Math.tan(theta2) * (0.3*this.generationHeight-family.nodeDimension*family.zoomFactor);
			
			ctx.beginPath();		
			ctx.moveTo(sX + xDif1, this.startY - this.generationHeight * 0.3);
			ctx.lineTo(this.sibshipXtra, this.startY - this.generationHeight * 0.3);
			ctx.lineTo(eX - xDif2, this.startY - this.generationHeight * 0.3);
			ctx.lineTo(this.sibshipXtra, this.startY - this.generationHeight * 0.4);
			ctx.lineTo(sX + xDif1, this.startY - this.generationHeight * 0.3);
			ctx.closePath();
			if (this.drawing.selectedDoodle  ) ctx.fillStyle = "#bfbfbf";
			else ctx.fillStyle = "black";
			ctx.fill();
		}
	}
	// Return value indicating successful hittest
	return this.isClicked;
}

ED.MemberConnector.prototype.setEdge = function(_edge) {
	this.edge = _edge;

	this.familyIndex = this.edge.index;
    this.type = this.edge.type;
    this.significant = this.edge.significant;
	this.adoption = this.edge.adoption;
	this.startX = this.edge.startX;
	this.startY = this.edge.startY;
	this.endX = this.edge.endX;
	this.endY = this.edge.endY;
	this.xOverhang = this.edge.xOverhang; // used for parentChild relationship, gives distance to centre point between parents 
	this.sibshipXtra = this.edge.sibshipXtra; //used for multipleBirth relationships and parentChild where child is multiplet
	this.generationHeight = this.edge.generationHeight;
	this.multiplePartnerFrom = this.edge.multiplePartnerFrom;
	this.multiplePartnerTo = this.edge.multiplePartnerTo;
	this.zoomFactor = family.zoomFactor;
}