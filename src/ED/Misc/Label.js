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
 * Label
 *
 * @class Label
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Label = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Label";

	// Private parameters
	this.labelText = "";
	this.lastOriginX = 0;
	this.lastOriginY = 0;

	// Label width and height
	this.labelWidth = 0;
	this.labelHeight = 80;

	// Label font
	this.labelFont = "60px sans-serif";

	// Horizontal padding between label and boundary path
	this.padding = 10;

	// Maximum length
	this.maximumLength = 20;

	// Flag to indicate first edit
	this.isEdited = false;
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexX', 'apexY', 'labelText', 'lastOriginX', 'lastOriginY'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'labelText':'Text'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Label.prototype = new ED.Doodle;
ED.Label.prototype.constructor = ED.Label;
ED.Label.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Label.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Label.prototype.setPropertyDefaults = function() {
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-1000, +1000);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-1000, +1000);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['labelText'] = {
		kind: 'derived',
		type: 'freeText',
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Label.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, -100);
	this.lastOriginX = this.originX;
	this.lastOriginY = this.originY;
	this.apexX = +100;
	this.apexY = -150;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Label.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'originX':
			returnArray['apexX'] = this.apexX - (_value - this.lastOriginX) / this.drawing.globalScaleFactor;
			this.lastOriginX = _value;
			break;
		case 'originY':
			returnArray['apexY'] = this.apexY - (_value - this.lastOriginY) / this.drawing.globalScaleFactor;
			this.lastOriginY = _value;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Label.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Label.superclass.draw.call(this, _point);

	// Set font
	ctx.font = this.labelFont;

	// Calculate pixel width of text with padding
	this.labelWidth = ctx.measureText(this.labelText).width + this.padding * 2;

	// Boundary path
	ctx.beginPath();

	// label boundary
	ctx.rect(-this.labelWidth / 2, -this.labelHeight / 2, this.labelWidth, this.labelHeight);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	this.isFilled = false;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	if (this.isSelected) ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Draw text
		ctx.fillText(this.labelText, -this.labelWidth / 2 + this.padding, this.labelHeight / 6);

		// Coordinate of start of arrow
		var arrowStart = new ED.Point(0, 0);

		// Calculation of which quadrant arrowEnd is in
		var q;
		if (this.apexX == 0) q = 2;
		else q = Math.abs(this.apexY / this.apexX);

		// Set start
		if (this.apexY <= 0 && q >= 1) {
			arrowStart.x = 0;
			arrowStart.y = -this.labelHeight / 2;
		}
		if (this.apexX <= 0 && q < 1) {
			arrowStart.x = -this.labelWidth / 2;
			arrowStart.y = 0;
		}
		if (this.apexY > 0 && q >= 1) {
			arrowStart.x = 0;
			arrowStart.y = this.labelHeight / 2;
		}
		if (this.apexX > 0 && q < 1) {
			arrowStart.x = this.labelWidth / 2;
			arrowStart.y = 0;
		}

		// Coordinates of end of arrow
		var arrowEnd = new ED.Point(this.apexX, this.apexY);

		// Draw arrow
		ctx.beginPath();
		ctx.moveTo(arrowStart.x, arrowStart.y);
		ctx.lineTo(arrowEnd.x, arrowEnd.y);
		ctx.strokeStyle = "Gray";
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Runs when doodle is selected by the user
 */
ED.Label.prototype.onSelection = function() {
	// Call method in superclass
	ED.Label.superclass.onSelection.call(this);
	
	// Set focus to control to allow immediate typing
	document.getElementById(this.parameterControlElementId('labelText')).focus();
}

/**
 * Adds a letter to the label text
 *
 * @param {Int} _keyCode Keycode of pressed key
 */
// ED.Label.prototype.addLetter = function(_keyCode) {
// 	// Need code here to convert to character
// 	var character = String.fromCharCode(_keyCode);
// 
// 	if (!this.isEdited) {
// 		this.labelText = "";
// 		this.isEdited = true;
// 	}
// 
// 	// Use backspace to edit
// 	if (_keyCode == 8) {
// 		if (this.labelText.length > 0) this.labelText = this.labelText.substring(0, this.labelText.length - 1);
// 	} else {
// 		if (this.labelText.length < this.maximumLength) this.labelText += character;
// 	}
// 
// 	// Save changes by triggering parameterChanged method in controller
// 	if (this.isEdited) {
// 		// Create notification message
// 		var object = new Object;
// 		object.doodle = this;
// 
// 		// Trigger notification
// 		this.drawing.notify('parameterChanged', object);
// 	}
// }
