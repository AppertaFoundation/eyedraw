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
 * Sclerostomy - bind an HTML element with 'overallGauge' parameter in order to achieve one way binding
 *
 * Also an example of using 'spare' properties to save otherwise unsaved parameters
 *
 * @class Sclerostomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Sclerostomy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Sclerostomy";

	// Private parameters
	this.parsPlana = -560;

	// Derived parameters
	this.overallGauge = '23g';
	this.gauge = '23g';
	this.isSutured = false;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Sclerostomy.prototype = new ED.Doodle;
ED.Sclerostomy.prototype.constructor = ED.Sclerostomy;
ED.Sclerostomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Sclerostomy.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Sclerostomy.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-660, -460);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['overallGauge'] = {
		kind: 'derived',
		type: 'string',
		list: ['20g', '23g', '25g', '27g'],
		animate: true
	};
	this.parameterValidationArray['gauge'] = {
		kind: 'derived',
		type: 'string',
		list: ['20g', '23g', '25g', '27g'],
		animate: true
	};
	this.parameterValidationArray['isSutured'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Sets default parameters
 */
ED.Sclerostomy.prototype.setParameterDefaults = function() {
	this.apexY = -600;
	this.gauge = "23g";
	this.isSutured = false;

	// Arc property is unused, so used it to store isSutured property
	this.arc = 1;

	this.setRotationWithDisplacements(60, -45);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Sclerostomy.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'apexY':
			if (_value < -610) returnArray['gauge'] = "20g";
			else if (_value < -560) returnArray['gauge'] = "23g";
			else if (_value < -510) returnArray['gauge'] = "25g";
			else returnArray['gauge'] = "27g";
			break;

		case 'overallGauge':
			returnArray['gauge'] = _value;
			break;

		case 'gauge':
			if (_value == "20g") returnArray['apexY'] = -650;
			else if (_value == "23g") returnArray['apexY'] = -600;
			else if (_value == "25g") returnArray['apexY'] = -550;
			else returnArray['apexY'] = -500;
			break;

		case 'arc':
			if (_value < 2) returnArray['isSutured'] = false;
			else returnArray['isSutured'] = true;
			break;

		case 'isSutured':
			if (_value) returnArray['arc'] = 3;
			else returnArray['arc'] = 1;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Sclerostomy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Sclerostomy.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Port
	ctx.rect(-60, this.parsPlana - 120, 120, 160);

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.fillStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Draw different shape according to gauge
		switch (this.gauge) {
			case "20g":
				ctx.beginPath();
				ctx.moveTo(-50, this.parsPlana);
				ctx.bezierCurveTo(-30, this.parsPlana - 30, 30, this.parsPlana - 30, 50, this.parsPlana);
				ctx.bezierCurveTo(30, this.parsPlana + 30, -30, this.parsPlana + 30, -50, this.parsPlana);
				ctx.closePath();
				ctx.fillStyle = "red";
				ctx.fill();
				break;

			case "23g":
				ctx.beginPath();
				ctx.rect(-60, this.parsPlana - 120, 120, 60);
				ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-30, this.parsPlana - 60, 60, 60);
				ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-30, this.parsPlana, 60, 100);
				ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
				ctx.fill();
				break;

			case "25g":
				ctx.beginPath();
				ctx.rect(-50, this.parsPlana - 120, 100, 60);
				ctx.fillStyle = "rgba(255, 128, 0, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-20, this.parsPlana - 60, 40, 60);
				ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-20, this.parsPlana, 40, 100);
				ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
				ctx.fill();
				break;

			case "27g":
				ctx.beginPath();
				ctx.rect(-40, this.parsPlana - 120, 80, 60);
				ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-15, this.parsPlana - 60, 30, 60);
				ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
				ctx.fill();
				ctx.beginPath();
				ctx.rect(-15, this.parsPlana, 30, 100);
				ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
				ctx.fill();
				break;
		}
		ctx.fill();

		// Draw suture
		if (this.isSutured || this.gauge == "20g") {
			ctx.beginPath();
			ctx.moveTo(-40, this.parsPlana + 40);
			ctx.lineTo(-40, this.parsPlana - 40);
			ctx.lineTo(+40, this.parsPlana + 40);
			ctx.lineTo(+40, this.parsPlana - 40);
			ctx.lineTo(-40, this.parsPlana + 40);

			ctx.lineWidth = 6;
			ctx.strokeStyle = "rgba(0,0,120,0.7)";
			ctx.closePath();
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
 * Draws extra items if the doodle is highlighted
 */
ED.Sclerostomy.prototype.drawHighlightExtras = function() {
	// Get context
	var ctx = this.drawing.context;

	// Draw text description of gauge
	ctx.lineWidth = 1;
	ctx.fillStyle = "gray";
	ctx.font = "64px sans-serif";
	ctx.fillText(this.gauge, 80, this.parsPlana + 20);
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Sclerostomy.prototype.groupDescription = function() {
	return "Sclerostomies at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.description = function() {
	// Sutured?
	var sutured = this.isSutured ? " (sutured)" : "";

	// Location (clockhours)
	return this.clockHour() + sutured;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.groupDescriptionEnd = function() {
	return " o'clock";
}
