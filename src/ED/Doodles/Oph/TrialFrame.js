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
 * Trial Frame
 *
 * @class TrialFrame
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.TrialFrame = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "TrialFrame";
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.TrialFrame.prototype = new ED.Doodle;
ED.TrialFrame.prototype.constructor = ED.TrialFrame;
ED.TrialFrame.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TrialFrame.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;
	this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrialFrame.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrialFrame.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Settings
	var ro = 420;
	var rt = 340;
	var ri = 300;
	var d = 20;
	var height = 50;

	// Angles, phi gives a little extra at both ends of the frame
	var phi = -Math.PI / 20;
	var arcStart = 0 + phi;
	var arcEnd = Math.PI - phi;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, false);

	// Arc back
	ctx.arc(0, 0, ri, arcEnd, arcStart, true);

	ctx.closePath();

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(230,230,230,1)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Set font and colour
		ctx.font = height + "px sans-serif";
		ctx.fillStyle = "blue";

		ctx.beginPath();

		var theta = 0;

		// Points for each line
		var pi = new ED.Point(0, 0);
		var pj = new ED.Point(0, 0);
		var pt = new ED.Point(0, 0);
		var po = new ED.Point(0, 0);
		var pp = new ED.Point(0, 0);

		for (var i = 0; i < 19; i++) {
			var text = i.toFixed(0);
			theta = (-90 - i * 10) * Math.PI / 180;

			pi.setWithPolars(ri, theta);
			pj.setWithPolars(ri + d, theta);
			pt.setWithPolars(rt, theta);
			pp.setWithPolars(ro - d, theta);
			po.setWithPolars(ro, theta);

			ctx.moveTo(pi.x, pi.y);
			ctx.lineTo(pj.x, pj.y);
			ctx.moveTo(pp.x, pp.y);
			ctx.lineTo(po.x, po.y);

			ctx.save();
			ctx.translate(pt.x, pt.y);
			ctx.rotate(Math.PI + theta);
			ctx.textAlign = "center";
			ctx.fillText(text, 0, 80 / 2);
			ctx.restore();
		}

		ctx.moveTo(-20, 0);
		ctx.lineTo(20, 0);
		ctx.moveTo(0, -20);
		ctx.lineTo(0, 20);

		ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
