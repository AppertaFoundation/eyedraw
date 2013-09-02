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
 * @class RecordGrid ***TODO***
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RecordGrid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RecordGrid";

	// Private parameters
	this.numberCellsHorizontal = 30;
	this.numberCellsVertical = 12;
	this.index = 0;
	this.firstCoordinate = 0;
	this.values = {'sys':160, 'dia':80};
	
	// Saved parameters
	//this.savedParameterArray = [];
	
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
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RecordGrid.prototype.setParameterDefaults = function() {
	this.firstCoordinate = -this.drawing.doodlePlaneWidth/2;
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
	ctx.strokeStyle = "red";
	ctx.fillStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();

		// Horizontal grid lines
		for (var i = 0; i < this.numberCellsHorizontal; i++) {
			ctx.moveTo(xs + i * xd, ys);
			ctx.lineTo(xs + i * xd, ys + this.drawing.doodlePlaneHeight);
		}

		// Vertical grid lines
		for (var j = 0; j < this.numberCellsVertical; j++) {
			ctx.moveTo(xs, ys + j * yd);
			ctx.lineTo(xs + this.drawing.doodlePlaneWidth, ys + j * yd);
		} 
		
		// Set line attributes
		ctx.lineWidth = 4;
		ctx.strokeStyle = "gray";

		// Draw vessels
		ctx.stroke();
	}


	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RecordGrid.prototype.updateNextValues = function() {
	var readingArray = this.drawing.allDoodlesOfClass('BPReading');
	
	// Set values to that of last entry
	if (readingArray.length > 0) {
		this.values['sys'] = readingArray[1].value;
		this.values['dia'] = readingArray[0].value;
	}
	
	// Increase index
	this.index++;
}
