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
 * Corneal Graft
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
// 	this.sutureLength = 60;
	this.antsegRadius = 190;

	// Derived parameters
	this.diameter = 9;
	this.depth = 100;
	this.interruptedSutures = 0;
	this.existingSutures = 0;
	
	this.csOriginX = 50;
	
	// Other parameters
	this.d = 100;
// 	this.type = 'Penetrating';
/*    // Reference to sutures removed throughout as to be a separate doodle
	this.showSutures = true;
	this.sutureType = 'Interrupted';
	this.numberOfSutures = 16;
*/
// 	this.opaque = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'depth','d','interruptedSutures','existingSutures','csOriginX' /* 'type', */ /* 'showSutures', 'sutureType', 'numberOfSutures',  *//* 'opaque' */];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'depth':'Depth (%)','interruptedSutures':'Interrupted sutures' /* 'type':'Type', */ /* 'showSutures':'Show Sutures', 'sutureType':'Suture type', 'numberOfSutures':'Sutures',  *//* 'opaque':'Opaque' */};

	var individualSutures = _drawing.allDoodlesOfClass("CornealSuture");
	var continuousSutures = _drawing.allDoodlesOfClass("ContinuousCornealSuture");
	var sutures = individualSutures.concat(continuousSutures);
	for (var i = 0; i < sutures.length; i++) {
		var suture = sutures[i];
		if (!suture.cornealGraft) {
			suture.cornealGraft = this;
			suture.setParametersFromCornealGraft();
		}
	}

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
// 	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default properties
 */
ED.CornealGraft.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = true;

	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-11.9 * this.pixelsPerMillimetre/2, -6.5 * this.pixelsPerMillimetre/2);

	// Create ranges to constrain handles
	this.handleCoordinateRangeArray = new Array();
	this.handleCoordinateRangeArray[0] = {
		x: new ED.Range(-0, +0), 
		y: new ED.Range(-2.9 * this.pixelsPerMillimetre/2, 2.5 * this.pixelsPerMillimetre/2)
	}

	// Add complete validation arrays for derived parameters
/*
	this.parameterValidationArray['depth'] = {
		kind: 'derived',
		type: 'string',
		list: ['Full', 'Partial (DALK)'],
		animate: false
	};
*/
	this.parameterValidationArray['depth'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(1, 100),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		animate: false
	};
	this.parameterValidationArray['interruptedSutures'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0, 50),
		animate: false
	};
	this.parameterValidationArray['existingSutures'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0, 50),
		animate: false
	};
/*
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Penetrating', 'DMEK', 'DSEAK'],
		animate: false
	};
*/
/*
	this.parameterValidationArray['showSutures'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
*/
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(6.5, 12),
		animate: true
	};
/*
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
*/
/*
	this.parameterValidationArray['opaque'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
*/
}

/**
 * Sets default parameters
 */
ED.CornealGraft.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '9.0');
// 	this.setParameterFromString('sutureType', 'Continuous');
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);
	
	// Add point to squiggle for handle
	var point = new ED.Point(0, 0);
	this.addPointToSquiggle(point);
	
	// count number of sutures present in doodle before added
	this.existingSutures = this.drawing.numberOfDoodlesOfClass('CornealSuture');
	
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
			
			// update range for x and y accordingly
			var y = Math.sqrt((this.antsegRadius+this.antsegRadius+_value)*(this.antsegRadius+this.antsegRadius+_value) - this.originX*this.originX);
			var x = Math.sqrt((this.antsegRadius+this.antsegRadius+_value)*(this.antsegRadius+this.antsegRadius+_value) - this.originY*this.originY);

			this.parameterValidationArray['originY']['range'].setMinAndMax(-y,+y);
			this.parameterValidationArray['originX']['range'].setMinAndMax(-x,+x);
			
			// If being synced, make sensible decision about y
/*
			if (!this.drawing.isActive) {
				var newX = this.parameterValidationArray['originX'] ['range'].max;
				var newY = this.parameterValidationArray['originY'] ['range'].max;
			}
			else {
*/
				var newX = this.parameterValidationArray['originX'] ['range'].constrain(this.originX);
				var newY = this.parameterValidationArray['originY'] ['range'].constrain(this.originY);
// 			}
			this.setSimpleParameter('originY', newY);
			this.setSimpleParameter('originX', newX);
			break;

		case 'diameter':
			returnArray['apexY'] = -_value * this.pixelsPerMillimetre/2;
			break;
		
		case 'originX':
			// update boundary range for y coordinate so constrained within AntSeg
				// using equation of circle, using (radius of antseg + difference in graft size) for length of one side
			var y = Math.sqrt((this.antsegRadius+this.antsegRadius+this.apexY)*(this.antsegRadius+this.antsegRadius+this.apexY) - _value*_value); 
			this.parameterValidationArray['originY']['range'].setMinAndMax(-y,+y);
			
			// If being synced, make sensible decision about y
			if (!this.drawing.isActive) {
				var newY = this.originY;
			}
			else {
				var newY = this.parameterValidationArray['originY'] ['range'].constrain(this.originY);
			}
			this.setSimpleParameter('originY', newY);
			
			// update suture positions, if appropriate
			var continuousSutures = this.drawing.allDoodlesOfClass("ContinuousCornealSuture");
			if (continuousSutures.length>0) {
				for (var i=0; i<continuousSutures.length;i++) {
					if (continuousSutures[i].cornealGraft == this) continuousSutures[i].setSimpleParameter('originX', _value);
				}
			}
			var individualSutures = this.drawing.allDoodlesOfClass("CornealSuture");
			if (individualSutures.length>0) {
				for (var i=0; i<individualSutures.length;i++) {
					if (individualSutures[i].cornealGraft == this) individualSutures[i].setSimpleParameter('originX', _value);
				}
			}
			
			// update rejection, if present
			var rejectionDoodle = this.drawing.lastDoodleOfClass("CornealGraftRejection");
			if (rejectionDoodle && rejectionDoodle.cornealGraft == this) {		  			
				rejectionDoodle.setSimpleParameter('originX', _value);		
  				rejectionDoodle.computeDoodleHeight();		
  			}
			break;
		
		case 'originY':
			// update boundary range for x coordinate within a circle
			var x = Math.sqrt((this.antsegRadius+this.antsegRadius+this.apexY)*(this.antsegRadius+this.antsegRadius+this.apexY) - _value*_value);
			this.parameterValidationArray['originX']['range'].setMinAndMax(-x,+x);
			
			// If being synced, make sensible decision about x 
			if (!this.drawing.isActive) {
				var newX = this.originX;
			}
			else {
				var newX = this.parameterValidationArray['originX'] ['range'].constrain(this.originX);
			}
			this.setSimpleParameter('originX', newX);
			
			// update suture positions, if appropriate
			var continuousSutures = this.drawing.allDoodlesOfClass("ContinuousCornealSuture");
			if (continuousSutures.length>0) {
				for (var i=0; i<continuousSutures.length;i++) {
					if (continuousSutures[i].cornealGraft == this) continuousSutures[i].setSimpleParameter('originY', _value);
				}
			}
			var individualSutures = this.drawing.allDoodlesOfClass("CornealSuture");
			if (individualSutures.length>0) {
				for (var i=0; i<individualSutures.length;i++) {
					if (individualSutures[i].cornealGraft == this) individualSutures[i].setSimpleParameter('originY', _value);
				}
			}
			
			// update rejection, if present
			var rejectionDoodle = this.drawing.lastDoodleOfClass("CornealGraftRejection");
			if (rejectionDoodle && rejectionDoodle.cornealGraft == this) {
				rejectionDoodle.setSimpleParameter('originY', _value);		
  				rejectionDoodle.computeDoodleHeight();		
  			}
			break;
			
		case 'depth':
			returnArray['d'] = parseInt(_value);
			break;
			
		case 'handles':
			// update apex and diameter values - historically used to draw doodle (TODO remove)
			var newApexY = this.squiggleArray[0].pointsArray[0].y - 9 * this.pixelsPerMillimetre/2;
			returnArray['diameter'] = -2 * newApexY/this.pixelsPerMillimetre;
			returnArray['apexY'] = newApexY;
			
			// update origin range
			var y = Math.sqrt((this.antsegRadius+this.antsegRadius+newApexY)*(this.antsegRadius+this.antsegRadius+newApexY) - this.originX*this.originX);
			var x = Math.sqrt((this.antsegRadius+this.antsegRadius+newApexY)*(this.antsegRadius+this.antsegRadius+newApexY) - this.originY*this.originY);

			this.parameterValidationArray['originY']['range'].setMinAndMax(-y,+y);
			this.parameterValidationArray['originX']['range'].setMinAndMax(-x,+x);
			
			var newX = this.parameterValidationArray['originX'] ['range'].constrain(this.originX);
			var newY = this.parameterValidationArray['originY'] ['range'].constrain(this.originY);
			this.setSimpleParameter('originY', newY);
			this.setSimpleParameter('originX', newX);
			
			// and update synced continuous suture doodle
			var continuousSutures = this.drawing.allDoodlesOfClass("ContinuousCornealSuture");
			if (continuousSutures.length>0) {
				for (var i=0; i<continuousSutures.length;i++) {
					if (continuousSutures[i].cornealGraft == this) {
						continuousSutures[i].setSimpleParameter('originY', newY);
						continuousSutures[i].setSimpleParameter('originX', newX);
					}
				}
			}
			
			var individualSutures = this.drawing.allDoodlesOfClass("CornealSuture");
			if (individualSutures.length>0) {
				for (var i=0; i<individualSutures.length;i++) {
					if (individualSutures[i].cornealGraft == this) {
						individualSutures[i].setSimpleParameter('originY', newY);
						individualSutures[i].setSimpleParameter('originX', newX);
					}
				}
			}
			break;
		
		case 'interruptedSutures':
			// use parameter to add /remove sutures from drawing.
			if (this.drawing.isActive) {
				var currentNumber = this.getSutures();
				var difference = _value - currentNumber;
				if (difference>0) {
					for (var i=0; i<difference; i++) {
						this.drawing.addDoodle('CornealSuture');
					}
				}
				else if (difference<0) {
					difference = Math.abs(difference);
					for (var i=0; i<difference; i++) {
						var suture = this.drawing.lastDoodleOfClass('CornealSuture');
						this.drawing.deleteDoodle(suture);
					}
				}

				// adjust angle between sutures so equidistant
				var sutures = this.drawing.allDoodlesOfClass('CornealSuture');
				var theta = (2*Math.PI)/_value;
				for (var j=0; j<sutures.length;j++) {
					sutures[j].setSimpleParameter('rotation',theta*j);
				}
			}
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
/*
	if (this.opaque) {
		ctx.fillStyle = "rgba(150, 150, 150, 0.8)";
		ctx.fill();
	}
*/

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	ctx.closePath();

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
/*
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
*/
	}

	// Coordinates of handles (in canvas plane)
// 	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CornealGraft.prototype.snomedCode = function() {
	return (this.depth=="Full" ? 424960002 : 0); // no SNOMED CT code available for DALK in 2017 v1.36.4
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealGraft.prototype.description = function() {
	
	this.interruptedSutures = this.getSutures(); // update suture counter
	
	var strng = "Penetrating keratoplasty";
	
	if (this.depth<100) strng = "Deep anterior lamellar keratoplasty";
// 	if (this.depth !== "Full") strng = "Deep anterior lamellar keratoplasty";
	
	return strng;
}

/**
 * Counts the number of sutures associated with this doodle in the drawing
 * 
 * @returns {Int} Number of corneal suture doodles
 */
ED.CornealGraft.prototype.getSutures = function() {
	
	var sutures = this.drawing.allDoodlesOfClass('CornealSuture');
	var counter = 0;
	
	for (var i=0;i<sutures.length;i++) {
		if (sutures[i].cornealGraft === this && !sutures[i].removed) counter++; // won't count sutures not associated with graft / "removed" sutures
	}
	
	return counter;
}
