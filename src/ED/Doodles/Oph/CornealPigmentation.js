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
 * 
 *
 * @class CornealPigmentation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealPigmentation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealPigmentation";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'apexX', 'scaleX','scaleY', 'rotation', 'level', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'level':'Level', 'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealPigmentation.prototype = new ED.Doodle;
ED.CornealPigmentation.prototype.constructor = ED.CornealPigmentation;
ED.CornealPigmentation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealPigmentation.prototype.setHandles = function() {
	
	// pigmentation density
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	
	// shape
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
	this.handleArray[4].isRotatable = true;
}

/**
 * Sets default properties
 */
ED.CornealPigmentation.prototype.setPropertyDefaults = function() {
	this.isSqueezable = true;
	
/*
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.2, +3);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.2, +3);
	
*/
	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-400, +400);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, +400);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['level'] = {
		kind: 'derived',
		type: 'string',
		list: ['Endothelium', 'Epithelial', 'Subepithelial', 'Anterior stromal', 'Mid stromal', 'Posterior stromal', 'Descemet\'s'],
		animate: true
	};
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Iron', 'Melanin', 'Blood', 'Copper', 'Lead', 'Organic', 'Unknown'],
		animate: true
	};
	
	this.handleVectorRangeArray = new Array();
	var range = new Object;
	range.length = new ED.Range(+1, +150);
	range.angle = new ED.Range(0.5*Math.PI, 0.5*Math.PI);
	this.handleVectorRangeArray[0] = range;
}

/**
 * Sets default parameters
 */
ED.CornealPigmentation.prototype.setParameterDefaults = function() {
	this.setParameterFromString('level', 'Endothelium');
  this.setParameterFromString('type', 'Melanin');
	this.apexY = -150;
	this.apexX = 30;
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	var point = new ED.Point(40, 0);
	this.addPointToSquiggle(point);

}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealPigmentation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealPigmentation.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	ctx.ellipse(0, 0, Math.abs(this.apexY), Math.abs(this.apexX), 0.5 * Math.PI, 0, 2 * Math.PI);
	
	// Set line attributes  
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.fillStyle = "rgba(0,0,0,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Pigment dots
		
		// Colours
		var fill = "brown";
		
		// Pigmentation density
		var pD = this.squiggleArray[0].pointsArray[0].x;
		
		// Radius
		var dr = 2;

		// Calculate shape area
		var A = Math.PI * Math.abs(this.apexX * this.apexY);
		
		// Calculate number of dots within boundary
		var n = A / 250 * (pD / 30);
		
		var p = new ED.Point(0, 0);
		
		// Calculate random positions for dots
/*
		var xS;
		var yS;
		for (var z=1; z<5; z++) {
			/// ED.randomArray is too short (length == 200)	, but using Math.random() means non reproducible, so do quarter at a time for more dots!
			var xS = (z < 3) ? -1 : 1;
			var yS = (z % 2 == 0) ? -1 : 1;
*/
			
			for (var i = 0; i < n; i++) {
				var j = (i < 150) ? i : (i < 199) ? i - 50 : (i < 249) ? i - 100 : (i < 299) ? i - 150 : (i < 349) ? i - 200 : i - 250;

				var k = (i < 200) ? i : (i < 398) ? (i - 199) : (i < 397) ? (i - 298) : (i - 396);

				var r = Math.sqrt(n * ED.randomArray[k]);
				var rX = this.apexX * ED.randomArray[k];
				var rY = this.apexY * ED.randomArray[j];
				var theta = 2 * Math.PI * ED.randomArray[j + 50];
								
/*
				p.x = Math.abs(rX * Math.cos(theta*r)) * xS;
				p.y = Math.abs(rY * Math.sin(theta*r)) * yS;
*/
				p.x = rX * Math.cos(theta*r);
				p.y = rY * Math.sin(theta*r);
				
				// Draw dot
				this.drawSpot(ctx, p.x, p.y, dr, fill);
			}
// 		}
		
		// Additionally draw spots at boundarys to ensure indicated
		this.drawSpot(ctx, 0, Math.abs(this.apexY), dr, fill);
		this.drawSpot(ctx, 0, -1 * Math.abs(this.apexY), dr, fill);
		this.drawSpot(ctx, Math.abs(this.apexX), 0, dr, fill);
		this.drawSpot(ctx, -1 * Math.abs(this.apexX), 0, dr, fill);
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
ED.CornealPigmentation.prototype.description = function() {
	
	// old ratio check method
	// var ratio = Math.abs(this.apexX / this.apexY);
	// var str = (ratio<2.5 && ratio>0.3) ? "Corneal pigmentation" : "Krukenberg spindle";
	if (this.type === 'Melanin' && this.level === 'Endothelium') {
		return 'Krukenberg spindle';
	}

	return 'Corneal pigmentation: ' + this.type + ', ' + this.level;
}
