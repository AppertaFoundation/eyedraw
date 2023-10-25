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
 * Lids
 *
 * @class Lids
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Lids = function (_drawing, _parameterJSON) {
	// Set classname
	this.className = "Lids";

	// Saved parameters
	this.savedParameterArray = ['apexX', 'apexY', 'dir'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
	if (this.drawing.eye === ED.eye.Left) {
		this.drawing.flipDrawingHorizontally();
	}
};

/**
 * Sets superclass and constructor
 */
ED.Lids.prototype = new ED.Doodle;
ED.Lids.prototype.constructor = ED.Lids;
ED.Lids.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lids.prototype.setHandles = function () {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, true);
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, true);
};

/**
 * Sets default dragging attributes
 */
ED.Lids.prototype.setPropertyDefaults = function () {
	this.isDeletable = false;
	this.isMoveable = false;
	this.isScalable = false;
	this.isRotatable = false;
	this.isShowHighlight = false;

	if (this.drawing.eye != ED.eye.Right) {
		this.drawing.flipDrawingHorizontally();
	}
	this.dir = +1;


	// Create ranges to constrain handles
	this.handleCoordinateRangeArray = [];
	this.handleCoordinateRangeArray[0] = {
		// lower lid
		x: new ED.Range(-260, +260),
		y: new ED.Range(+30, +300)
	};
	this.handleCoordinateRangeArray[1] = {
		// upper lid
		x: new ED.Range(-0, +0),
		y: new ED.Range(-120, +110)
	};
}

/**
 * Sets default parameters
 */
ED.Lids.prototype.setParameterDefaults = function () {
	if (this.drawing.eye !== ED.eye.Right) {
		this.drawing.flipDrawingHorizontally();
	}

	this.dir = +1;

	// handle start position
	this.apexX = 0;
	this.apexY = 110;

	// Create a squiggle to store the handles points
	let squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles on each lid
	var point1 = new ED.Point(0, 115);
	this.squiggleArray[0].pointsArray.push(point1);

	var point2 = new ED.Point(0, -90);
	this.squiggleArray[0].pointsArray.push(point2);
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lids.prototype.draw = function (_point) {
	// Get context
	let ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Lids.superclass.draw.call(this, _point);

	// Arc radius
	let d = 250;

	// control point height
	let h = 160;

	// control point width
	let w = 90;

	// Pupil radius
	let rP = 100;

	// punctum radius
	let p = 45;


	// Calculate control point positions for bezier curves
	let bMP = this.squiggleArray[0].pointsArray[0];
	let bStart = new ED.Point(d * this.dir, p + (bMP.y - 115) / 5);
	let bEnd = new ED.Point(-d * this.dir, 0);

	if (bMP.x * this.dir > 20) {
		bStart.x += (bMP.x - 20) / 5;
	}

	let bCP1 = new ED.Point(bMP.x + 60 * this.dir, bMP.y * 1.45);
	let bCP2 = new ED.Point(bMP.x - 180 * this.dir, bMP.y * 1.16);

	let tMP = this.squiggleArray[0].pointsArray[1];
	let tEnd = new ED.Point(d * this.dir, 0 + (tMP.y / 5 + 19));

	let tCP1 = new ED.Point(-85 * this.dir, tMP.y * 1.3);
	let tCP2 = new ED.Point(85 * this.dir, tMP.y * 1.35);

	// Boundary path
	ctx.beginPath();

	// Draw invisible boundary around canvas and lids
	ctx.moveTo(-510 * this.dir, -510);
	ctx.lineTo(-510 * this.dir, 510);
	ctx.lineTo(510 * this.dir, 510);
	ctx.lineTo(510 * this.dir, -510);
	ctx.lineTo(-510 * this.dir, -510);

	// Draw lids boundary
	ctx.moveTo(bEnd.x, bEnd.y);

	// Top lid
	// 	ctx.bezierCurveTo(-rP * 0.85 * this.dir, -h, rP * 1.05 * this.dir, -h, tEnd.x, tEnd.y);
	ctx.bezierCurveTo(tCP1.x, tCP1.y, tCP2.x, tCP2.y, tEnd.x, tEnd.y);

	// Punctum
	ctx.bezierCurveTo(d * 1.25 * this.dir, p * 0.9, d * 1.2 * this.dir, p, bStart.x, bStart.y);

	// Bottom lid
	ctx.bezierCurveTo(bCP1.x, bCP1.y, bCP2.x, bCP2.y, bEnd.x, bEnd.y);

	// Close path
	ctx.closePath();

	// Set drawing attributes
	ctx.lineWidth = 5;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "rgba(0,0,0,0)";
	ctx.shadowBlur = 15;
	ctx.shadowColor = "rgba(0,0,0,0.8)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode === ED.drawFunctionMode.Draw) {
		// lids outline
		ctx.beginPath();
		ctx.moveTo(-d * this.dir, 0);
		ctx.bezierCurveTo(tCP1.x, tCP1.y, tCP2.x, tCP2.y, tEnd.x, tEnd.y);
		ctx.bezierCurveTo(d * 1.25 * this.dir, p * 0.9, d * 1.2 * this.dir, p, bStart.x, bStart.y);
		ctx.bezierCurveTo(bCP1.x, bCP1.y, bCP2.x, bCP2.y, bEnd.x, bEnd.y);
		ctx.moveTo(-d * this.dir, 0);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
		// bottom lid ridge
		let bRidgeCP1 = new ED.Point(bMP.x - 170 * this.dir, bMP.y * 1.38);
		let bRidgeCP2 = new ED.Point(bMP.x + 70 * this.dir, bMP.y * 1.45);
		ctx.beginPath();
		ctx.moveTo(-d * this.dir, 0);
		ctx.bezierCurveTo(bRidgeCP1.x, bRidgeCP1.y, bRidgeCP2.x, bRidgeCP2.y, bStart.x, bStart.y);
		// 	ctx.strokeStyle = "gray";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();

		// start and end are messed up, but here they are fixed left to right
		this.lidCurveParams = {
			startPointTop: { x: -d * this.dir, y: 0 }, endPointTop: tEnd, controlPointTop1: tCP1, controlPointTop2: tCP2,
			endPointBottom: bStart, startPointBottom: bEnd, controlPointBottom1: bRidgeCP1, controlPointBottom2: bRidgeCP2
		};

		// top eye crease
		ctx.beginPath();
		ctx.moveTo(-d * this.dir - p * 0.9 * this.dir, p * 0.1);
		ctx.bezierCurveTo(-rP * 1.3 * this.dir, -h * 1.2, rP * this.dir, -h * 1.2, d * this.dir + p * this.dir, 0);
		ctx.lineWidth = 3;
		ctx.shadowBlur = 7;
		ctx.shadowColor = "black";
		ctx.stroke();
		ctx.closePath();

		this.drawLashes(ctx);
		this.drawPuncta(ctx);

		// eyebrow
		ctx.beginPath();
		ctx.moveTo((-d - 200) * this.dir, -100);
		ctx.bezierCurveTo(-185, -317, 85, -322, 250, -199);
		ctx.strokeStyle = "rgba(120, 120, 120, 1)";
		ctx.lineWidth = 15;
		ctx.shadowBlur = 0;
		ctx.stroke();
		ctx.closePath();

		// nose
		let n1 = { x: (-d + 550) * this.dir, y: -100 };
		ctx.beginPath();
		ctx.moveTo(n1.x, n1.y);
		ctx.bezierCurveTo(n1.x + 100, n1.y + 80, n1.x + 120, n1.y + 200, n1.x + 120, 500);
		ctx.strokeStyle = "rgba(200, 200, 200, 1)";
		ctx.lineWidth = 15;
		ctx.stroke();
		ctx.closePath();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]); // bottom lid - ectropion
	this.handleArray[1].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[1]); // top lid - ptosis

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) {
		this.drawHandles(_point);
	}

	// Return value indicating successful hittest
	return this.isClicked;
};

// a helper for epiphora to anchor to the lower lid
ED.Lids.prototype.getLidCurveParams = function () {
	return this.lidCurveParams;
};

ED.Lids.prototype.drawLashes = function (ctx) {
	ctx.beginPath();
	for (let t = 0.05; t < 1; t += 0.1) {
		let bezPoint = MathHelper.calculateBezierPoints(t, this.lidCurveParams.startPointBottom, this.lidCurveParams.endPointBottom, this.lidCurveParams.controlPointBottom1, this.lidCurveParams.controlPointBottom2);
		ctx.moveTo(bezPoint.x, bezPoint.y);
		ctx.quadraticCurveTo(bezPoint.x + 15, bezPoint.y + 15, bezPoint.x, bezPoint.y + 30);
	}
	for (let t = 0.05; t < 1; t += 0.1) {
		let bezPoint = MathHelper.calculateBezierPoints(t, this.lidCurveParams.startPointTop, this.lidCurveParams.endPointTop, this.lidCurveParams.controlPointTop1, this.lidCurveParams.controlPointTop2);
		ctx.moveTo(bezPoint.x, bezPoint.y);
		ctx.quadraticCurveTo(bezPoint.x + 15, bezPoint.y - 15, bezPoint.x, bezPoint.y - 30);
	}
	ctx.stroke();
};

ED.Lids.prototype.drawPuncta = function (ctx) {
	let y0 = 30;
	ctx.beginPath();
	let p1 = MathHelper.calculateBezierPoints(0.99, this.lidCurveParams.startPointTop, this.lidCurveParams.endPointTop, this.lidCurveParams.controlPointTop1, this.lidCurveParams.controlPointTop2);
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p1.x + 20, p1.y - 25);
	ctx.lineTo(340, y0);
	ctx.lineTo(400, y0);

	let p2 = MathHelper.calculateBezierPoints(0.99, this.lidCurveParams.startPointBottom, this.lidCurveParams.endPointBottom, this.lidCurveParams.controlPointBottom1, this.lidCurveParams.controlPointBottom2);
	ctx.moveTo(p2.x, p2.y);
	ctx.lineTo(p2.x + 20, p2.y + 25);
	ctx.lineTo(340, y0);

	ctx.strokeStyle = "rgba(250, 0, 0, 1)";
	ctx.lineWidth = 10;
	ctx.stroke();
	ctx.closePath();
};

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Lids.prototype.description = function () {
	let bMP = this.squiggleArray[0].pointsArray[0];
	let tMP = this.squiggleArray[0].pointsArray[1];

	let returnString = "";

	let ptosis = "";
	if (tMP.y >= -57 && tMP.y < -38) {
		ptosis = "Mild ptosis";
	}
	else if (tMP.y >= -38 && tMP.y < -19) {
		ptosis = "Moderate ptosis";
	} else if (tMP.y >= -19) {
		ptosis = "Severe ptosis";
	}

	// TODO: change to an arc tangent to define ectropion?
	let ectropion = "";

	if (bMP.y > 132 && bMP.x * this.dir > 90) {
		ectropion = "Medial ectropion";
	} else if (bMP.y > 132 && bMP.x * this.dir < -90) {
		ectropion = "Lateral ectropion";
	} else if (bMP.y > 132) {
		ectropion = "Ectropion";
	}

	if (ptosis.length > 0) {
		returnString += ptosis;
	}

	if (ptosis.length > 0 && ectropion.length > 0) {
		returnString += ", ";
	}

	if (ectropion.length > 0) {
		returnString += ectropion;
	}

	return returnString;
};
