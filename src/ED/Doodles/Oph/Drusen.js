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
 * Hard Drusen
 *
 * @class Drusen
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Drusen = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Drusen";

    this.drusenType = 'Hard';
    this.blur = 0;

	// Saved parameters
	this.savedParameterArray = ['apexY', 'scaleX', 'scaleY', 'drusenType', 'blur'];

    this.controlParameterArray = {
        'drusenType':'Drusen type'
    }

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Drusen.prototype = new ED.Doodle;
ED.Drusen.prototype.constructor = ED.Drusen;
ED.Drusen.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Drusen.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Drusen.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);

    this.parameterValidationArray.drusenType = {
        kind: 'derived',
        type: 'string',
        list: ['Hard', 'Soft', 'Confluent'],
    };
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Drusen.prototype.setParameterDefaults = function() {
	// Hard drusen is displaced for Fundus, central for others
	if (this.drawing.hasDoodleOfClass('Fundus')) {
		this.originX = this.drawing.eye == ED.eye.Right ? -100 : 100;
		this.scaleX = 0.5;
		this.scaleY = 0.5;
	}

    this.setParameterFromString('drusenType', 'Hard');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Drusen.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = new Array();

    switch (_parameter) {
        case 'drusenType':
            switch (_value) {
                case 'Hard':
                    returnArray.blur = 0;
                    break;
                case 'Soft':
                    returnArray.blur = 1;
                    break;
                case 'Confluent':
                    returnArray.blur = 2;
                    break;
            }
	}

	return returnArray;

}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Drusen.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Drusen.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Invisible boundary
	var r = 200;
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Colours
		var fill = "lightgray";

		var dr = 10 / this.scaleX;

		var p = new ED.Point(0, 0);
		var n = 20 + Math.abs(Math.floor(this.apexY / 2));
		var blur = this.drusenType === 'Hard' ? 0 :(this.drusenType === 'Soft' ? 1 : 2);
        var filter = 'blur(0px)';
        if(blur === 1 || blur === 2){
            filter = 'blur(' + blur + 'px)';
        }

		for (var i = 0; i < n; i++) {
			p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, dr, 0, Math.PI * 2, true);

            //Because of performance reasons we do not set the filer while the user dragging
            if(!this.drawing.mouseIsDown){
                ctx.filter = filter;
			}
            ctx.fillStyle = fill;
            ctx.strokeStyle = fill;
            ctx.lineWidth = 0;

            ctx.fill();
            ctx.stroke();

            ctx.restore();
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
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
ED.Drusen.prototype.description = function() {
	var returnString = "Signficant numbers of ";
	if (this.apexY > -100) returnString = "Moderate numbers of ";
	if (this.apexY > -50) returnString = "Several ";

	return returnString + "hard drusen";
}

