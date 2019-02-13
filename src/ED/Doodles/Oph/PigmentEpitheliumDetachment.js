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
 * Pigment epithelium detachment
 *
 * @class PigmentEpitheliumDetachment
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.PigmentEpitheliumDetachment = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "PigmentEpitheliumDetachment";

	// Private parameters
	this.discRadius = 84;

	// Derived parameters
	this.type = 'Serous';
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.PigmentEpitheliumDetachment.prototype = new ED.Doodle;
ED.PigmentEpitheliumDetachment.prototype.constructor = ED.PigmentEpitheliumDetachment;
ED.PigmentEpitheliumDetachment.superclass = ED.Doodle.prototype;

/**=
 * Sets handle attributes
 */
ED.PigmentEpitheliumDetachment.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PigmentEpitheliumDetachment.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.parameterValidationArray['apexX']['range'].setMinAndMax(+30, +400);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Serous', 'Drusenoid', 'Type 1 neovascularisation','Type 3 neovascularisation RAP','PCV'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.PigmentEpitheliumDetachment.prototype.setParameterDefaults = function() {
	this.apexX = 2 * this.discRadius;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PigmentEpitheliumDetachment.prototype.dependentParameterValues = function(_parameter, _value) {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PigmentEpitheliumDetachment.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.PigmentEpitheliumDetachment.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Basic shape for serous PED
	var r = this.apexX;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Set attributes
	var grd = ctx.createRadialGradient(0, 0, r*0.8, 0, 0, r);
	grd.addColorStop(0, "rgba(215,215,215,0.9)");
	grd.addColorStop(1, "rgba(215,215,215,0)");

	ctx.lineWidth = 4;
	
	ctx.fillStyle = grd;
	ctx.strokeStyle = ctx.fillStyle;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		switch (this.type) {
			case 'Drusenoid':
				ctx.beginPath();
				ctx.fillStyle = "rgba(255,195,0,1)";
				var n = 5; // number of mini circles to draw
				var theta = 2 * Math.PI / n;
				
				var c = 0.35 * this.apexX; // distance to centre of mini circles
				var r = 0.3 * this.apexX; // radius of mini circles
				
				for (var ii=0;ii<n;ii++) {
					var p = new ED.Point(0,0);
					p.setWithPolars(c,theta*ii);
					
					// draw arc
					ctx.moveTo(p.x+r,p.y);
					ctx.arc(p.x,p.y,r,0,2*Math.PI);
					ctx.fill();
										
				}
				
				// draw arc in centre to ensure no unfilled area
				ctx.moveTo(0,0);
				ctx.arc(0,0,r,0,2*Math.PI);
				ctx.fill();
				
				// repeat with smaller, brown dots
				r = 10;
				ctx.beginPath();
				ctx.fillStyle = "rgba(100,25,25,1)";
				for (ii=0;ii<n;ii++) {
					var c2 = c * ED.randomArray[ii];
					p = new ED.Point(0,0);
					p.setWithPolars(c2,theta*ii);
					
					// draw arc
					ctx.moveTo(p.x+r,p.y);
					ctx.arc(p.x,p.y,r,0,2*Math.PI);
					ctx.fill();
										
				}
								
				break;
			
			case 'Type 1 neovascularisation':
				var r = this.discRadius / 1.2;
				
				var grd2 = ctx.createRadialGradient(0, 0, r*0.5, 0, 0, r);
				grd2.addColorStop(0, "red");
				grd2.addColorStop(1, "rgba(255,0,0,0)");
	
				ctx.beginPath();
				ctx.arc(0,0,r,0,2*Math.PI);
				ctx.fillStyle = grd2;
				ctx.fill();
				
				break;
				
			case 'Type 3 neovascularisation RAP':
				var r = this.discRadius / 2;
				ctx.beginPath();
				ctx.arc(0,0,r,0,2*Math.PI);
				ctx.fillStyle = "red";
				ctx.fill();
				break;
				
			case 'PCV':
				ctx.beginPath();
				// draw central elipse
				ctx.ellipse(0,0,20,30,0.5*Math.PI,0,2*Math.PI);
				
				// draw spokes
				var n = 12;
				var theta = 2 * Math.PI / n;
				var l = this.discRadius / 1.5;
				var r = 8;
				for (var ii=0;ii<n;ii++) {
					if (ii!=0 && ii!=3 && ii!=6 && ii!=9) {
						p = new ED.Point(0,0);
						p.setWithPolars(l,theta*ii);
					
						// draw line to point
						ctx.moveTo(0,0);
						ctx.lineTo(p.x,p.y);
						
						// draw arc
						ctx.moveTo(p.x+r,p.y);
						ctx.arc(p.x,p.y,r,0,2*Math.PI);
					}	
				}
				
				ctx.lineWidth = 2;
				ctx.fillStyle = "rgba(205,0,0,1)";
				ctx.strokeStyle = ctx.fillStyle;
				ctx.stroke();
				ctx.fill();
				break;

			
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
ED.PigmentEpitheliumDetachment.prototype.description = function() {
	
	var returnStr = "";
	
	switch (this.type) {
		case 'Serous':
			returnStr = "Serous PED";
			break;
		case 'Drusenoid':
			returnStr = "Drusenoid PED";
			break;
		case 'Type 1 neovascularisation':
			returnStr = "Neovascular PED Type 1";
			break;
		case 'Type 3 neovascularisation RAP':
			returnStr = "Neovascular PED Type 3 RAP";
			break;
		case 'PCV':
			returnStr = "PED with PCV";
			break;
	}
	
	return returnStr;
}

ED.PigmentEpitheliumDetachment.prototype.snomedCodes = function() {
	
    snomedCodes = [];
    
    if (this.type==='Drusenoid') snomedCodes.push([342581000119102, 3]);
    else snomedCodes.push([52002008, 3]);
    
    if (this.type==='Type 1 neovascularisation' || this.type==='Type 3 neovascularisation RAP') {
        snomedCodes.push([75971007, 3]);
    }
    else if (this.type==='PCV') {
        snomedCodes.push([313001006, 3]);
    }
    
    return snomedCodes;
}