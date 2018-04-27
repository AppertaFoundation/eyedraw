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
 * Blot Haemorrhage
 *
 * @class RPEAtrophy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.RPEAtrophy = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "RPEAtrophy";
	
	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'apexX', 'apexY'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.RPEAtrophy.prototype = new ED.Doodle;
ED.RPEAtrophy.prototype.constructor = ED.RPEAtrophy;
ED.RPEAtrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RPEAtrophy.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.RPEAtrophy.prototype.setPropertyDefaults = function() {
    this.isRotatable = false;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +80);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);

    this.parameterValidationArray['originX']['range'].setMinAndMax(-260-30, 150+30);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-220-30, 220+30);
};

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RPEAtrophy.prototype.setParameterDefaults = function() {
	this.setOriginWithDisplacements(0, -60);
    this.apexX = 40;
}

ED.RPEAtrophy.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = new Array();

    switch (_parameter) {
        case 'scaleY':
            var r = 72;

            this.parameterValidationArray['originX']['range'].setMinAndMax(-260-30+r*_value-72, 150+30-r*_value+72);
            this.parameterValidationArray['originY']['range'].setMinAndMax(-220-30+r*_value-72, 220+30-r*_value+72);

            var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY);
            var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX);

            this.setSimpleParameter('originX', newOriginX);
            this.setSimpleParameter('originY', newOriginY);

console.log(-r*_value);

			break;
    }
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RPEAtrophy.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RPEAtrophy.superclass.draw.call(this, _point);

	// Radius
	var r = 72;

	// Boundary path
	ctx.beginPath();

	// Haemorrhage
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);

	// Set attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = ctx.fillStyle;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Non boundary paths
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        // Colours
        var fill = "rgba(111, 82, 76, " + (0.2+(this.apexX/100)) +")";

        var dr = 10 / this.scaleX;

        var p = new ED.Point(0, 0);
        var n = 40 + Math.abs(Math.floor(this.apexY / 2));
        for (var i = 0; i < n; i++) {
            p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
            this.drawSpot(ctx, p.x, p.y, dr, fill);
        }
    }

	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0);
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.RPEAtrophy.prototype.groupDescription = function() {
	return "RPE atrophy";
}
