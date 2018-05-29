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
 * Cypass (single)
 *
 * @class Cypass
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Cypass = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Cypass";

	// Private parameters
	this.limbus = -400;

    // Derived parameters
    this.miotic = 'Miochol';
    this.viscoelastic = 'Viscoelastic';
    this.complication = 'Haemorrhage +';

	// Saved parameters
	this.savedParameterArray = ['rotation', 'radius', 'miotic', 'viscoelastic', 'complication'];

    this.controlParameterArray = {
        'miotic':'Miotic',
        'viscoelastic':'Viscoelastic',
        'complication':'Complication',
    };

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Cypass.prototype = new ED.Doodle;
ED.Cypass.prototype.constructor = ED.Cypass;
ED.Cypass.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Cypass.prototype.setPropertyDefaults = function() {
    this.isScaleable = false;
    this.isMoveable = false;
    this.isUnique = true;

    this.parameterValidationArray['miotic'] = {
        kind: 'derived',
        type: 'string',
        list: ['Miochol', 'Carbachol', 'Pilocarpine 2%'],
        animate: true
    };

    this.parameterValidationArray['viscoelastic'] = {
        kind: 'derived',
        type: 'string',
        list: ['Viscoelastic'],
        animate: true
    };

    this.parameterValidationArray['complication'] = {
        kind: 'derived',
        type: 'string',
        list: ['Haemorrhage +', 'Haemorrhage ++', 'Haemorrhage +++'],
        animate: true
    };
}

/**
 * Sets default parameters
 */
ED.Cypass.prototype.setParameterDefaults = function() {

    this.radius = 462;
    this.setRotationWithDisplacements(315, 270);

    this.parameterValidationArray['radius']['range'].setMinAndMax(415, 480);

    this.setParameterFromString('miotic', 'Miochol');
    this.setParameterFromString('viscoelastic', 'Viscoelastic');
    this.setParameterFromString('complication', 'Haemorrhage +');
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cypass.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;
    var r = this.radius;

	// Call draw method in superclass
	ED.Cypass.superclass.draw.call(this, _point);

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.fillStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var ring = {w: 14, h: 36},
            ringDistance = 19;

		//Corneal incision
        ctx.beginPath();
        ctx.moveTo(360,-60);
        ctx.lineTo(360,60);
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.stroke();
        ctx.closePath();

		// Body
		ctx.beginPath();

		//the body
        ctx.rect(-200-(r), -10, 300, 20);

        //rings
        for (var i = 1; i < 4; i++) {
            ctx.rect( (99-(r)-5) - (i*ringDistance), -18, ring.w, ring.h);
        }

        //collar
        ctx.rect(99-(r), -(18), ring.w + 6, ring.h);

		ctx.fillStyle = "rgba(112, 96, 0, 1)";
		ctx.fill();
        ctx.closePath();

        //fenestrations
        ctx.beginPath();
        for (var i = 1; i < 6; i++) {
            ctx.arc((-200-(r)+5)+(i*40), 0, 5, 0, 2 * Math.PI, false);
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
        ctx.closePath();

        //we redraw an invisible device body to be draggable
        ctx.beginPath();
        ctx.rect(-200-(r), -15, 300, 30);
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fill();
	}

	// Return value indicating successful hittest
	return this.isClicked;
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Cypass.prototype.description = function() {
	var desc = '';

    desc += "Miotic: " + this.miotic + "\n";
    desc += "Viscoelastic: " + this.viscoelastic + "\n";
    desc += "Complication: " + this.complication + "\n";
    desc += "Cypass stent at " + this.clockHour(-3) + " o'clock";

    return desc;
};
