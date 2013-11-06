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
 * RecordGrid
 *
 * @class RecordGrid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RecordGrid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RecordGrid";

	// Private parameters
	this.values = {'sys':160, 'dia':80, 'pul':60, 'res':30, 'oxi':100};		// Default values
	this.minutesPerCell = 5;					// 'Width' of each cell in minutes (default: 5 - try 1 for demo)
	this.minutesLabelArray = [0, 30];			// Labels for these minutes past the hour
	this.totalMinutes = 180;						// Total duration of record (default: 180 - try 30 for demo)
	this.numberCellsHorizontal = Math.round(this.totalMinutes/this.minutesPerCell) + 2;
	this.numberCellsVertical = 12;
	this.separationOfVerticalGridLines = _drawing.doodlePlaneWidth/this.numberCellsHorizontal;	
	this.index = 0;								// Index property is the number of the vertical line where a reading is entered
	this.firstCoordinate = - _drawing.doodlePlaneWidth/2;
	
	this.startDate = new Date();				// Starting date 2013,2,1,10,35
	this.gridStartDate = new Date();			// Starting date rounded to nearest minutesPerCell
	this.nowDate = new Date();					// The current date set by a timer
	this.setGridStartDate(this.startDate);		// Date of left hand edge of grid
	
	// Saved parameters
	this.savedParameterArray = ['startDate'];
	
	// Date objects need to be flagged to save and load properly
	this.parameterObjectTypeArray = {startDate:'date', gridStartDate:'date'};
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RecordGrid.prototype = new ED.Doodle;
ED.RecordGrid.prototype.constructor = ED.RecordGrid;
ED.RecordGrid.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.RecordGrid.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isShowHighlight = false;
	this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RecordGrid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RecordGrid.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	var xs = -this.drawing.doodlePlaneWidth/2;
	var ys = -this.drawing.doodlePlaneHeight/2;
	var xd = this.drawing.doodlePlaneWidth/this.numberCellsHorizontal;
	var yd = this.drawing.doodlePlaneHeight/this.numberCellsVertical;
	ctx.rect(xs, ys, this.drawing.doodlePlaneWidth, this.drawing.doodlePlaneHeight);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Horizontal grid lines
		for (var j = 0; j < this.numberCellsVertical; j++) {
			ctx.moveTo(xs, ys + j * yd);
			ctx.lineTo(xs + this.drawing.doodlePlaneWidth, ys + j * yd);
		}

		// Vertical grid lines
		for (var i = 0; i < this.numberCellsHorizontal; i++) {
			ctx.moveTo(xs + i * xd, ys);
			ctx.lineTo(xs + i * xd, ys + this.drawing.doodlePlaneHeight);
		}
		
		// Set line attributes
		ctx.lineWidth = 4;
		ctx.strokeStyle = "rgba(200,200,200,1)";

		// Draw grid lines
		ctx.stroke();
		
		// Draw timeLine in red
		var ms = this.nowDate - this.gridStartDate;
		this.timeLineX = this.firstCoordinate + (this.drawing.doodlePlaneWidth/this.numberCellsHorizontal) * ms/(60 * 1000 * this.minutesPerCell);
		ctx.beginPath();
		ctx.moveTo(this.timeLineX, ys);
		ctx.lineTo(this.timeLineX,  ys + this.drawing.doodlePlaneHeight);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "red";
		ctx.stroke();

		// Draw time values at top, but leave out edges
		for (var i = 1; i < this.numberCellsHorizontal; i++) {
			// Calculate date of line
			dateOfGridLine = new Date(this.gridStartDate.getTime() + i * this.minutesPerCell * 60000);
			var hour = dateOfGridLine.getHours();
			var minutes = dateOfGridLine.getMinutes();

			// Only put in markers for major timepoints		
			if (this.minutesLabelArray.indexOf(minutes) >= 0) {
				// Text of time display
				var hourText = hour.toString();
				if (hourText.length < 2) hourText = '0' + hourText;
				var minutesText = minutes.toString();
				if (minutesText.length < 2) minutesText = '0' + minutesText;
				var text = hourText + ':' + minutesText;
				
				// Text properties
				ctx.lineWidth = 1;
				ctx.font = "48px sans-serif";
				ctx.strokeStyle = "gray";
				ctx.fillStyle = "gray";
			
				// Draw text centred on grid line
				var textWidth = ctx.measureText(text).width;
				ctx.fillText(text, xs + i * xd - textWidth/2, ys + 50);
			}
		}
	}

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns an array of the values of the last entry if present
 *
 * @param {String} _type Type of readings
 * @return {Mixed} The last value if present, otherwise false
 */
ED.RecordGrid.prototype.getNextValues = function(_type) {
	// Get array of all the BPReading doodles (of both 'sys' and 'dia' stolic types
	var readingArray = this.drawing.allDoodlesOfClass('RecordReading');
	
	// Set default to beyond left border
	var lastX = -2000;
	
	// Set values to that of last entry
	for (var i = 0; i < readingArray.length; i++) {
		if (readingArray[i].type == _type) {
			this.values[_type] = readingArray[i].value;
			lastX = readingArray[i].originX;
			break;
		}
	}
	
	// Get current x coordinate for the time point
	var x = this.getGridX();
	
	// If its different from the last entry, then return the next values
	if (x > lastX) {
		return {'value':this.values[_type], 'originX':x};
	}
	else {
		return false;
	}
}

/**
 * Sets date properties so that a time may be displayed clearly
 *
 * @param {Date} _date Date object representing the date of the record grid start
 */
ED.RecordGrid.prototype.setGridStartDate = function(_date) {
	// Determine time coordinate of start of grid
	var nearestGridLine = Math.round(_date.getMinutes()/this.minutesPerCell) * this.minutesPerCell;
	var nearestGridLineBefore = Math.floor(_date.getMinutes()/this.minutesPerCell) * this.minutesPerCell;
	
	// Set grid start date to allow first reading to be on first line to right of left hand edge
	this.gridStartDate = _date;
	this.gridStartDate.setMinutes(nearestGridLineBefore);
	
	// Shave off one grid width if label is on left hand edge
	if (nearestGridLine == nearestGridLineBefore) {
		this.gridStartDate = new Date(this.gridStartDate.getTime() - this.minutesPerCell * 60000);
	}
		
	// Zero seconds
	this.gridStartDate.setSeconds(0);
}

/**
 * Gets X coordinate of nearest vertical grid line to current time
 */
ED.RecordGrid.prototype.getGridX = function() {
	// Get time diff in milliseconds from start of grid until now
	var ms = this.nowDate - this.gridStartDate;
	
	// Set index
	this.index = Math.round(ms/(60 * 1000 * this.minutesPerCell));
	
	// Return integer pixel value to allow reliable test of whether reading is already there
	return Math.round(this.firstCoordinate + this.index * this.separationOfVerticalGridLines);
}
