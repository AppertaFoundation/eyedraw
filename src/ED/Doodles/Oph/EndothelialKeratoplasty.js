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
 * Endothelial Keraoplasty (DSAEK / DMEK)
 *
 * @class EndothelialKeratoplasty
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.EndothelialKeratoplasty = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "EndothelialKeratoplasty";

	// Private parameters
	this.pixelsPerMillimetre = 63.3333;
	this.antsegRadius = 190;

	// Derived parameters
	this.diameter = 9;
	this.type = 'DMEK';
	this.typeSimple = 1;
	
	// cross section parameters
	this.csOriginX = 0;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'type','typeSimple','csOriginX'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.EndothelialKeratoplasty.prototype = new ED.Doodle;
ED.EndothelialKeratoplasty.prototype.constructor = ED.EndothelialKeratoplasty;
ED.EndothelialKeratoplasty.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EndothelialKeratoplasty.prototype.setHandles = function() {
// 	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default properties
 */
ED.EndothelialKeratoplasty.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isUnique = false;

	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-11.9 * this.pixelsPerMillimetre/2, -6.5 * this.pixelsPerMillimetre/2);

	// Create ranges to constrain handles
	this.handleCoordinateRangeArray = new Array();
	this.handleCoordinateRangeArray[0] = {
		x: new ED.Range(-0, +0), 
		y: new ED.Range(-2.9 * this.pixelsPerMillimetre/2, 2.5 * this.pixelsPerMillimetre/2)
	}

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['DMEK', 'DSAEK'],
		animate: false
	};
	this.parameterValidationArray['typeSimple'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 2),
		animate: false
	};
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(6.5, 12),
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.EndothelialKeratoplasty.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '9.0');
// 	this.setParameterFromString('sutureType', 'Continuous');
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);
	
	// Add point to squiggle for handle
	var point = new ED.Point(0, 0);
	this.addPointToSquiggle(point);	
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.EndothelialKeratoplasty.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			returnArray['diameter'] = -2 * _value/this.pixelsPerMillimetre;
			
			// update range for x and y accordingly
			var y = Math.sqrt((this.antsegRadius+this.antsegRadius+_value)*(this.antsegRadius+this.antsegRadius+_value) - this.originY*this.originY); 
			var x = Math.sqrt((this.antsegRadius+this.antsegRadius+_value)*(this.antsegRadius+this.antsegRadius+_value) - this.originX*this.originX); 

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
				var newY = this.parameterValidationArray['originY']['range'].max;
			}
			else {
				var newY = this.parameterValidationArray['originY'] ['range'].constrain(this.originY);
			}
			this.setSimpleParameter('originY', newY);
			
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
			var y = Math.sqrt((this.antsegRadius+this.antsegRadius+newApexY)*(this.antsegRadius+this.antsegRadius+newApexY) - this.originY*this.originY); 
			var x = Math.sqrt((this.antsegRadius+this.antsegRadius+newApexY)*(this.antsegRadius+this.antsegRadius+newApexY) - this.originX*this.originX); 

			this.parameterValidationArray['originY']['range'].setMinAndMax(-y,+y);
			this.parameterValidationArray['originX']['range'].setMinAndMax(-x,+x);
			
			var newX = this.parameterValidationArray['originX'] ['range'].constrain(this.originX);
			var newY = this.parameterValidationArray['originY'] ['range'].constrain(this.originY);
			this.setSimpleParameter('originY', newY);
			this.setSimpleParameter('originX', newX);
			break;
		
		case 'type':
			if (_value=="DMEK") returnArray['typeSimple'] = 1;
			else returnArray['typeSimple'] = 2;
			break;
			
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EndothelialKeratoplasty.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.EndothelialKeratoplasty.superclass.draw.call(this, _point);

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

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	ctx.closePath();

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	}

	// Coordinates of handles (in canvas plane)
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
/*
ED.EndothelialKeratoplasty.prototype.snomedCode = function() {
	return (this.depth=="Full" ? 424960002 : 0); // no appropriate SNOMED CT code available for DSEAK/DMEK in 2017 v1.36.4
}
*/

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EndothelialKeratoplasty.prototype.description = function() {
	return this.type;
}
