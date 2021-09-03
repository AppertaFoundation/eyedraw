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
 * Nerve Fibre Defect
 *
 * @class ConjunctivalHaem
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ConjunctivalHaem = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "ConjunctivalHaem";
    this.haemorrhageGrade = 'None';
    this.swellingGrade = 'None';
    this.mucopurulent = false;
    this.conjunctivitisType = 'Follicular';
    this.hyperaemia = '+';

    // Saved parameters
    this.savedParameterArray = [
        'haemorrhageGrade',
        'swellingGrade',
        'conjunctivitisType',
        'hyperaemia',
        'mucopurulent',
        'arc',
        'rotation'
    ];

    this.controlParameterArray = {
        'conjunctivitisType': 'Conjunctivitis',
        'hyperaemia': 'Hyperaemia',
        'haemorrhageGrade': 'Haemorrhage',
        'swellingGrade':'Swelling',
        'mucopurulent': 'Mucopurulent'
    };

    // Call super-class constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

/**
 * Sets superclass and constructor
 */
ED.ConjunctivalHaem.prototype = new ED.Doodle;
ED.ConjunctivalHaem.prototype.constructor = ED.ConjunctivalHaem;
ED.ConjunctivalHaem.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ConjunctivalHaem.prototype.setHandles = function() {
    this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
    //this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
};

/**
 * Sets default dragging attributes
 */
ED.ConjunctivalHaem.prototype.setPropertyDefaults = function() {
    this.isMoveable = false;

    this.parameterValidationArray['haemorrhageGrade'] = {
        kind: 'other',
        type: 'string',
        list: ['None', '+', '++', '+++'],
        animate: false
    };

    this.parameterValidationArray['hyperaemia'] = {
        kind: 'other',
        type: 'string',
        list: ['None', '+', '++', '+++'],
        animate: false
    };

    this.parameterValidationArray['swellingGrade'] = {
        kind: 'other',
        type: 'string',
        list: ['None', '+', '++'],
        animate: false
    };
    this.parameterValidationArray['mucopurulent'] = {
        kind: 'derived',
        type: 'bool',
        display: true
    };
    this.parameterValidationArray['conjunctivitisType'] = {
        kind: 'other',
        type: 'string',
        list: [
            'None',
            'Follicular',
            'Papillary',
            'Giant Papillary'
        ],
        animate: false
    };
};

ED.ConjunctivalHaem.prototype.createPattern = function(density, colour) {
    var pattern = document.createElement('canvas');
    pattern.width = 20 * density;
    pattern.height = 20 * density;
    var pctx = pattern.getContext('2d');
    pctx.fillStyle = colour;
    pctx.fillRect(0,0,5* density,5 * density);
    pctx.fillRect(10 * density,10 * density,5 * density,5 * density);

    return pattern;
};

/**
 * Sets default parameters
 */
ED.ConjunctivalHaem.prototype.setParameterDefaults = function() {
    this.arc = 120 * Math.PI / 180;

    this.setRotationWithDisplacements(180, 0);
};

ED.ConjunctivalHaem.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = [];

    switch (_parameter) {
        case 'conjunctivitisType':
            // this functionality caused a bug when page reloads (error screen eg)
            // it reverts back to '+' even if user selected '+++'
            // if (_value !== 'None') {
            //     returnArray['hyperaemia'] = '+';
            // }
            break;
    }

    return returnArray;
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ConjunctivalHaem.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.ConjunctivalHaem.superclass.draw.call(this, _point);

    // Radius of outer curve
    var ro = 730;
    var ri = 380;
    var r = 380;//ri + (ro - ri) / 2;

    // Calculate parameters for arcs
    var theta = this.arc / 2;
    var arcStart = -Math.PI / 2 + theta;
    var arcEnd = -Math.PI / 2 - theta;

    // Coordinates of 'corners' of ConjunctivalHaem
    var topRightX = r * Math.sin(theta);
    var topRightY = -r * Math.cos(theta);
    var topLeftX = -r * Math.sin(theta);
    var topLeftY = topRightY;

    // Boundary path
    ctx.beginPath();

    if (this.haemorrhageGrade !== 'None' || this.swellingGrade !== 'None' || this.conjunctivitisType !== 'None') {
        // Arc across to mirror image point on the other side
        ctx.arc(0, 0, ro, arcStart, arcEnd, true);

        // Arc back to mirror image point on the other side
        ctx.arc(0, 0, ri, arcEnd, arcStart, false);

        // Close path
        // ctx.closePath();

        // Set line attributes
        ctx.lineWidth = 0;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "#dae6f1";
    }

    // If Haemorrhage - then regardless of additionselection the fill in colour for haemorrhage is shown.
    if (this.haemorrhageGrade !== 'None') {

        let density = 1.5;
        let colour = "rgb(240,10,8)";

        if(this.haemorrhageGrade === '++' ) {
            colour = "rgb(208,10,8)";
            density = 1.25;
        }
        if(this.haemorrhageGrade === '+++' ) {
            colour = "rgb(148,10,8)";
            density = 1;
        }

        ctx.fillStyle = colour;

        if (this.hyperaemia === '+') ctx.filter = "opacity(10%)";
        if (this.hyperaemia === '++') ctx.filter = "opacity(30%)";
        if (this.hyperaemia === '+++') ctx.filter = "opacity(50%)";

    } else {
        let density = 1.5;
        let colour;

        if (this.conjunctivitisType !== 'None') {
            // PINK
            colour = "rgba(255, 192, 203)";

        } else if (this.conjunctivitisType === 'None' && this.swellingGrade !== 'None') {
            density = 1.5;
            colour = "rgba(149,179,217,0.75)";

            if (this.swellingGrade === '++' ) {
                density = 1.25;
                colour = "rgba(85,141,213,0.75)";
            }
        }

        ctx.fillStyle = ctx.createPattern(this.createPattern(density, colour), "repeat");
    }

    ctx.closePath();


    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Coordinates of handles (in canvas plane)
    this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
    this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Return value indicating successful hit test
    return this.isClicked;
};

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ConjunctivalHaem.prototype.groupDescription = function() {
    var doodles = this.drawing.allDoodlesOfClass(this.className);
    var returnObject = {};
    var returnString = "";

    for (let i = 0; i < doodles.length; i++) {
        let doodle = doodles[i];
        returnObject[this.getDescriptionForDoodle(doodle)] = this.getDescriptionForDoodle(doodle);
    }

    for (let desc in returnObject) {
        if (!returnObject.hasOwnProperty(desc)){
            continue;
        }
        if(returnString !== ''){
            returnString += ', ';
        }
        returnString += desc;
    }
    return returnString;

};

ED.ConjunctivalHaem.prototype.getDescriptionForDoodle = function(doodle) {
    let description = doodle.conjunctivitisType;
    description += ", hyperaemia " + doodle.hyperaemia;
    if (doodle.haemorrhageGrade !== 'None') {
        description += ", haemorrhage " + doodle.haemorrhageGrade + " at " + doodle.clockHour() + " o'clock";
    }

    if (doodle.swellingGrade !== 'None') {
        description += ", swelling " + doodle.swellingGrade + " at " + doodle.clockHour() + " o'clock";
    }

    if (doodle.mucopurulent === true) {
        description += ", mucopurulent";

    }

    return description;
};

ED.ConjunctivalHaem.prototype.snomedCodes = function()
{
    const snomedCodes = [];

    if (this.haemorrhageGrade !== 'None') {
        snomedCodes.push([1117005, 3]);
    }
    if (this.swellingGrade !== 'None') {
        snomedCodes.push([84178004, 3]);
    }
    if (this.conjunctivitisType === 'Papillary') {
        snomedCodes.push([416878008, 3]);
    }
    if (this.conjunctivitisType === 'Follicular') {
        snomedCodes.push([86402005, 3]);
    }

    return snomedCodes;
};
