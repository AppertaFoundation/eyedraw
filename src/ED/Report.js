/**
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * An object of the Report class is used to extract data for the Royal College of Ophthalmologists retinal detachment dataset.
 * The object analyses an EyeDraw drawing, and sets the value of HTML elements on the page accordingly.
 * @namespace ED.Report
 * @memberOf ED
 * @property {Canvas} canvas A canvas element used to edit and display the drawing
 * @property {Int} breaksInAttached The number of retinal breaks in attached retina
 * @property {Int} breaksInDetached The number of retinal breaks in detached retina
 * @property {String} largestBreakType The type of the largest retinal break
 * @property {Int} largestBreakSize The size in clock hours of the largest retinal break
 * @property {Int} lowestBreakPosition The lowest position of any break in clock hours
 * @property {String} pvrType The type of PVR
 * @property {Int} pvrCClockHours The number of clock hours of posterior PVR type C
 * @property {Int} antPvrClockHours The number of clock hours of anterior PVR
 * @param Drawing _drawing The drawing object to be analysed
 */
ED.Report = function(_drawing) {
	// Properties
	this.drawing = _drawing;
	this.breaksInAttached = 0;
	this.breaksInDetached = 0;
	this.largestBreakType = 'Not found';
	this.largestBreakSize = 0;
	this.lowestBreakPosition = 12;
	this.pvrType = 'None';
	this.pvrCClockHours = 0;
	this.antPvrClockHours = 0;

	// Variables
	var pvrCDegrees = 0;
	var AntPvrDegrees = 0;
	var minDegreesFromSix = 180;

	// Create array of doodle classes which are retinal breaks
	var breakClassArray = new Array();
	breakClassArray["UTear"] = "U tear";
	breakClassArray["RoundHole"] = "Round hole";
	breakClassArray["Dialysis"] = "Dialysis";
	breakClassArray["GRT"] = "GRT";
	breakClassArray["MacularHole"] = "Macular hole";
	breakClassArray["OuterLeafBreak"] = "Outer Leaf Break";

	// Array of RRD doodles
	this.rrdArray = new Array();

	// First iteration to create array of retinal detachments
	var i, doodle;
	for (i = 0; i < this.drawing.doodleArray.length; i++) {
		doodle = this.drawing.doodleArray[i];

		// If its a RRD, add to RRD array
		if (doodle.className == "RRD") {
			this.rrdArray.push(doodle);
		}
	}

	// Second iteration for other doodles
	for (i = 0; i < this.drawing.doodleArray.length; i++) {
		doodle = this.drawing.doodleArray[i];

		// Star fold - PVR C
		if (doodle.className == "StarFold") {
			this.pvrType = 'C';
			pvrCDegrees += doodle.arc * 180 / Math.PI;
		}
		// Anterior PVR
		else if (doodle.className == "AntPVR") {
			this.pvrType = 'C';
			AntPvrDegrees += doodle.arc * 180 / Math.PI;
		}
		// Retinal breaks
		else if (doodle.className in breakClassArray) {
			// Bearing of break is calculated in two different ways
			var breakBearing = 0;
			if (doodle.className == "UTear" || doodle.className == "RoundHole" || doodle.className == "OuterLeafBreak") {
				breakBearing = (Math.round(Math.atan2(doodle.originX, -doodle.originY) * 180 / Math.PI) + 360) % 360;
			} else {
				breakBearing = (Math.round(doodle.rotation * 180 / Math.PI + 360)) % 360;
			}

			// Bool if break is in detached retina
			var inDetached = this.inDetachment(breakBearing);

			// Increment totals
			if (inDetached) {
				this.breaksInDetached++;
			} else {
				this.breaksInAttached++;
			}

			// Get largest break in radians
			if (inDetached && doodle.arc > this.largestBreakSize) {
				this.largestBreakSize = doodle.arc;
				this.largestBreakType = breakClassArray[doodle.className];
			}

			// Get lowest break
			var degreesFromSix = Math.abs(breakBearing - 180);

			if (inDetached && degreesFromSix < minDegreesFromSix) {
				minDegreesFromSix = degreesFromSix;

				// convert to clock hours
				var bearing = breakBearing + 15;
				remainder = bearing % 30;
				this.lowestBreakPosition = Math.floor((bearing - remainder) / 30);
				if (this.lowestBreakPosition == 0) this.lowestBreakPosition = 12;
			}
		}
	}

	// Star folds integer result (round up to one clock hour)
	pvrCDegrees += 25;
	var remainder = pvrCDegrees % 30;
	this.pvrCClockHours = Math.floor((pvrCDegrees - remainder) / 30);

	// Anterior PVR clock hours
	AntPvrDegrees += 25;
	remainder = AntPvrDegrees % 30;
	this.antPvrClockHours = Math.floor((AntPvrDegrees - remainder) / 30);

	// Convert largest break size to clockhours
	var size = this.largestBreakSize * 180 / Math.PI + 25;
	var remainder = size % 30;
	this.largestBreakSize = Math.floor((size - remainder) / 30);
}

/**
 * Accepts a bearing in degrees (0 is at 12 o'clock) and returns true if it is in an area of detachment
 *
 * @param {Float} _angle Bearing in degrees
 * @returns {Bool} True is the bearing intersects with an area of retinal deatchment
 */
ED.Report.prototype.inDetachment = function(_angle) {
	var returnValue = false;

	// Iterate through retinal detachments
	for (key in this.rrdArray) {
		var rrd = this.rrdArray[key];

		// Get start and finish bearings of detachment in degrees
		var min = (rrd.rotation - rrd.arc / 2) * 180 / Math.PI;
		var max = (rrd.rotation + rrd.arc / 2) * 180 / Math.PI;

		// Convert to positive numbers
		var min = (min + 360) % 360;
		var max = (max + 360) % 360;

		// Handle according to whether RRD straddles 12 o'clock
		if (max < min) {
			if ((0 <= _angle && _angle <= max) || (min <= _angle && _angle <= 360)) {
				returnValue = true;
			}
		} else if (max == min) // Case if detachment is total
		{
			return true;
		} else {
			if (min <= _angle && _angle <= max) {
				returnValue = true;
			}
		}
	}

	return returnValue;
}

/**
 * Extent of RRD in clock hours
 *
 * @returns {Array} An array of extents (1 to 3 clock hours) for each quadrant
 */
ED.Report.prototype.extent = function() {
	// Array of extents by quadrant
	var extentArray = new Array();
	if (this.drawing.eye == ED.eye.Right) {
		extentArray["SN"] = 0;
		extentArray["IN"] = 0;
		extentArray["IT"] = 0;
		extentArray["ST"] = 0;
	} else {
		extentArray["ST"] = 0;
		extentArray["IT"] = 0;
		extentArray["IN"] = 0;
		extentArray["SN"] = 0;
	}

	// get middle of first hour in degrees
	var midHour = 15;

	// Go through each quadrant counting extent of detachment
	for (quadrant in extentArray) {
		for (var i = 0; i < 3; i++) {
			var addition = this.inDetachment(midHour) ? 1 : 0;
			extentArray[quadrant] = extentArray[quadrant] + addition;
			midHour = midHour + 30;
		}
	}

	return extentArray;
}

/**
 * Returns true if the macular is off
 *
 * @returns {Bool} True if the macula is off
 */
ED.Report.prototype.isMacOff = function() {
	var result = false;

	// Iterate through each detachment, one macoff is enough
	for (key in this.rrdArray) {
		var rrd = this.rrdArray[key];
		if (rrd.isMacOff()) result = true;
	}

	return result;
}
