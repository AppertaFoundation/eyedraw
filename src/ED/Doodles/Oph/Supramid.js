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
 * Supramid suture
 *
 * @class Supramid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Supramid = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Supramid";
	
	// Other parameters
	this.percent = '50';

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'rotation', 'percent'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'percent':'Percentage of tube'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Supramid.prototype = new ED.Doodle;
ED.Supramid.prototype.constructor = ED.Supramid;
ED.Supramid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Supramid.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Supramid.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-800, +800);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-800, +800);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['percent'] = {
		kind: 'other',
		type: 'string',
		list: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Supramid.prototype.setParameterDefaults = function() {
	this.apexX = -660;
	this.apexY = 30;
	
	this.setParameterFromString('percent', '50');

	// Make rotation same as tube
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		this.rotation = doodle.rotation;
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Supramid.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Get tube doodle
	var doodle = this.drawing.lastDoodleOfClass("Tube");
	if (doodle) {
		this.rotation = doodle.rotation;
	}

	// Call draw method in superclass
	ED.Supramid.superclass.draw.call(this, _point);

	// Calculate key points for supramid bezier
	var startPoint = new ED.Point(this.apexX, this.apexY);
	var tubePoint = new ED.Point(0, -700);

	// Boundary path
	ctx.beginPath();

	// Rectangle around end of suture
	ctx.rect(this.apexX - 100, this.apexY - 100, 200, 200);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	if (this.isSelected) ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
	else ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (doodle) {
			// Suture
			var xDev = startPoint.x/Math.abs(startPoint.x) * 100;
			ctx.beginPath()
			ctx.moveTo(startPoint.x, startPoint.y);
			/*
			ctx.bezierCurveTo(startPoint.x + xDev, startPoint.y - 100, tubePoint.x + xDev, tubePoint.y, doodle.bezierArray['sp'].x, doodle.bezierArray['sp'].y);
			ctx.bezierCurveTo(doodle.bezierArray['cp1'].x, doodle.bezierArray['cp1'].y, doodle.bezierArray['cp2'].x, doodle.bezierArray['cp2'].y, doodle.bezierArray['ep'].x, doodle.bezierArray['ep'].y);
			*/
			ctx.bezierCurveTo(startPoint.x + xDev, startPoint.y - 100, tubePoint.x + xDev, tubePoint.y, doodle.bezierArray['sp'].x, doodle.bezierArray['sp'].y);

			// Calculate total length of path
			var totalLength = 0;
			totalLength += doodle.bezierArray['sp'].distanceTo(doodle.bezierArray['cp1']);
			totalLength += doodle.bezierArray['cp1'].distanceTo(doodle.bezierArray['cp2']);
			totalLength += doodle.bezierArray['cp2'].distanceTo(doodle.bezierArray['ep']);
			
			// Calculate desired length
			var desiredLength = totalLength * parseFloat(this.percent)/100;
			
			// Create line segments appropriately
			var keepGoing = true;
			var remainingLength = desiredLength;
			
			var segmentLength = doodle.bezierArray['sp'].distanceTo(doodle.bezierArray['cp1']);
			if (segmentLength < remainingLength) {
				remainingLength -= segmentLength;
				ctx.lineTo(doodle.bezierArray['cp1'].x, doodle.bezierArray['cp1'].y);
			}
			else {
				var prop = remainingLength * 100/segmentLength;
				var p = doodle.bezierArray['sp'].pointAtPercentageFromPointToPoint(prop, doodle.bezierArray['cp1']);
				ctx.lineTo(p.x, p.y);
				keepGoing = false;
			}

			if (keepGoing) {
				segmentLength = doodle.bezierArray['cp1'].distanceTo(doodle.bezierArray['cp2']);
				if (segmentLength < remainingLength) {
					remainingLength -= segmentLength;
					ctx.lineTo(doodle.bezierArray['cp2'].x, doodle.bezierArray['cp2'].y);
				}
				else {
					var prop = remainingLength * 100/segmentLength;
					var p = doodle.bezierArray['cp1'].pointAtPercentageFromPointToPoint(prop, doodle.bezierArray['cp2']);
					ctx.lineTo(p.x, p.y);
					keepGoing = false;
				}
			}

			if (keepGoing) {						
				segmentLength = doodle.bezierArray['cp2'].distanceTo(doodle.bezierArray['ep']);
				if (segmentLength < remainingLength) {
					remainingLength -= segmentLength;
					ctx.lineTo(doodle.bezierArray['ep'].x, doodle.bezierArray['ep'].y);
				}
				else {
					var prop = remainingLength * 100/segmentLength;
					var p = doodle.bezierArray['cp2'].pointAtPercentageFromPointToPoint(prop, doodle.bezierArray['ep']);
					ctx.lineTo(p.x, p.y);
					keepGoing = false;
				}
			}
						
// 			ctx.lineTo(doodle.bezierArray['cp1'].x, doodle.bezierArray['cp1'].y);
// 			ctx.lineTo(doodle.bezierArray['cp2'].x, doodle.bezierArray['cp2'].y);
// 			ctx.lineTo(doodle.bezierArray['ep'].x, doodle.bezierArray['ep'].y);
			
			
			ctx.lineWidth = 4;
			ctx.strokeStyle = "purple";
			ctx.stroke();
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
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
// ED.Supramid.prototype.getParameter = function(_parameter)
// {
//     var returnValue;
//
//     switch (_parameter)
//     {
//         // Position of end of suture
//         case 'endPosition':
//             var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
//
//             if (r < 280 ) returnValue = 'in the AC';
//             else returnValue = ((r - 280)/14).toFixed(0) + 'mm from limbus';
//             break;
//
//         default:
//             returnValue = "";
//             break;
//     }
//
//     return returnValue;
// }

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Supramid.prototype.description = function() {
	return "Supramid suture";
}
