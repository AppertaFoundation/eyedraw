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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Conjunctivitis
 *
 * @class Conjunctivitis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Conjunctivitis = function(_drawing, _parameterJSON) {
  // Set classname
  this.className = "Conjunctivitis";

  // Other parameters
  this.type = 'Papillary';
  this.mucopurulent = false;
  this.hyperaemia = "+";

  // Saved parameters
  this.savedParameterArray = ['type', 'mucopurulent', 'hyperaemia'];

  // Parameters in doodle control bar (parameter name: parameter label)
  this.controlParameterArray = {'type':'Type', 'mucopurulent':'Mucopurulent', 'hyperaemia':'Hyperaemia'};

  // Call superclass constructor
  ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Conjunctivitis.prototype = new ED.Doodle;
ED.Conjunctivitis.prototype.constructor = ED.Conjunctivitis;
ED.Conjunctivitis.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Conjunctivitis.prototype.setPropertyDefaults = function() {
  this.isUnique = true;
  this.isMoveable = false;
  this.isRotatable = false;

  // Add complete validation arrays for other parameters
  this.parameterValidationArray['type'] = {
    kind: 'other',
    type: 'string',
    list: ['Papillary', 'Follicular'],
    animate: false
  };
  this.parameterValidationArray['mucopurulent'] = {
    kind: 'derived',
    type: 'bool',
    display: true
  };
  this.parameterValidationArray['hyperaemia'] = {
    kind: 'other',
    type: 'string',
    list: ['+', '++', '+++'],
    animate: false
  };
}

/**
 * Sets default parameters
 */
ED.Conjunctivitis.prototype.setParameterDefaults = function() {
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Conjunctivitis.prototype.draw = function(_point) {

  // Get context
  var ctx = this.drawing.context;

  // Call draw method in superclass
  ED.AntSeg.superclass.draw.call(this, _point);

  // Radius of limbus
  var ro = 380;
  var ri = -this.apexY;
  var rs = 500;

  // Calculate parameters for arcs
  var arcStart = -Math.PI/2;
  var arcEnd = 2 * Math.PI - Math.PI/2;

  // Boundary path
  ctx.beginPath();

  // Interpalpebral fissure
  var bh = 350;
  var bv = 150;
  ctx.lineTo(0, -ro);
  ctx.bezierCurveTo(-bh, -ro, -rs, -bv, -rs, 0);
  ctx.bezierCurveTo(-rs, +bv, -bh, +ro, 0, +ro);
  ctx.bezierCurveTo(+bh, +ro, +rs, +bv, +rs, 0);
  ctx.bezierCurveTo(+rs, -bv, +bh, -ro, 0, -ro);

  // Do a 360 arc
  ctx.arc(0, 0, ro, arcStart, arcEnd, false);

  // Edge attributes
  ctx.lineWidth = 4;
  var ptrn = ctx.createPattern(this.drawing.imageArray['NewVesselPattern'], 'repeat');
  ctx.fillStyle = ptrn;
  ctx.strokeStyle = "pink";

  if (this.hyperaemia == "+") ctx.filter = "opacity(10%)";
  if (this.hyperaemia == "++") ctx.filter = "opacity(30%)";
  if (this.hyperaemia == "+++") ctx.filter = "opacity(50%)";

  // Draw boundary path (also hit testing)
  this.drawBoundary(_point);

  // Other paths and drawing here
  if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
  }

  ctx.filter = "none";

  // Return value indicating successful hit test
  return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Conjunctivitis.prototype.description = function() {
  var returnValue = this.type + " conjunctivitis";

  if (this.mucopurulent) returnValue += ", mucopurulent,";

  returnValue += " with " + this.hyperaemia + " hyperaemia";

  return returnValue;
}