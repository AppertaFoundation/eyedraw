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
 * Corneal Oedema
 *
 * @class HeadPostures
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.HeadPostures = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "HeadPostures";

	// Derived parameters
	this.headTilt = "None";
	this.headTurn = "None";
	this.chinMovement = "None";
	this.tiltSeverity = 'None';
	this.turnSeverity = 'None';
	this.chinMoveSeverity = 'None';

	// Saved parameters
	this.savedParameterArray = ['headTilt', 'headTurn', 'chinMovement', 'tiltSeverity', 'turnSeverity', 'chinMoveSeverity', 'rotation', 'intensity', 'stromal', 'epithelial', 'endothelial'];

	// Parameters in doodle control bar (parameter name: parameter label)
// 	this.controlParameterArray = {'intensity':'Intensity',  'epithelial':'Epithelial', 'stromal':'Stromal','endothelial':'Endothelial'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.HeadPostures.prototype = new ED.Doodle;
ED.HeadPostures.prototype.constructor = ED.HeadPostures;
ED.HeadPostures.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HeadPostures.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, true);
}

/**
 * Sets default properties
 */
ED.HeadPostures.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isShowHighlight = false;
	
	// Create ranges to constrain handles
	this.handleCoordinateRangeArray = new Array();
	this.handleCoordinateRangeArray[0] = {
		x: new ED.Range(-300, +320),
		y: new ED.Range(-400, +350)
// 		y: new ED.Range(-0, +0)

	};

	this.parameterValidationArray['rotation']['range'].setMinAndMax(-0.17*Math.PI, +0.17*Math.PI);
		
}

/**
 * Sets default parameters
 */
ED.HeadPostures.prototype.setParameterDefaults = function() {
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	var point = new ED.Point(0, 0);
	this.squiggleArray[0].pointsArray.push(point);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HeadPostures.prototype.draw = function(_point) {
	
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.HeadPostures.superclass.draw.call(this, _point);
	var pnt = this.squiggleArray[0].pointsArray[0];
	
	var headArc = {
		'radius' : 230 + ((Math.abs(pnt.x)>70) ? ((Math.abs(pnt.x)<250) ? ((Math.abs(pnt.x)-70)/20) : ((180/20))) : 0),
		'centreX' : 0 + ((pnt.x>40) ? (pnt.x-40)/3: 0) + ((pnt.x<-40) ? (pnt.x+40)/3: 0),
		'centreY' : -130 + ((pnt.y<-300) ? (pnt.y+300)/2000 : 0) + ((Math.abs(pnt.x)>170) ? (Math.abs(pnt.x)-170)/5: 0), 
		'startAngle' : 0.05 * Math.PI,
		'endAngle' : Math.PI * 0.95,
		'skewR' : {
			'x' : 0.12 + ((pnt.x>100) ? ((pnt.x>250) ? (250-100)/200 : (pnt.x-100)/200) : 0) - ((pnt.x>100) ? ((Math.abs(pnt.x)-100)/700) : 0),
			'y' : 8/5 + ((pnt.y<50) ? (pnt.y)/1000 : 50/1000) + ((pnt.y<-350) ? (pnt.y+350)/1000 : 0) + ((pnt.x>300) ? (pnt.x-300)/1000: 0)
		},
		'skewL' : {
			'x' : 0.12 - ((pnt.x<-100) ? ((pnt.x<-250) ? (-250+100)/200 : (pnt.x+100)/200) : 0) + ((pnt.x<-100) ? ((pnt.x+100)/700) : 0),
			'y' : 8/5 + ((pnt.y<50) ? (pnt.y)/1000 : 50/1000) + ((pnt.y<-350) ? (pnt.y+350)/1000 : 0) - ((pnt.x<-300) ? (pnt.x+300)/1000: 0)
		}
	};
	var theta = (headArc.endAngle - headArc.startAngle) * 0.5 + Math.PI;
	headArc.startX = headArc.centreX + Math.sin(theta) * headArc.radius;
	headArc.endX = headArc.centreX - Math.sin(theta) * headArc.radius;
	headArc.startY = headArc.centreY - Math.cos(theta) * headArc.radius;
	headArc.endY = headArc.startY;
	
	var chinArc = {
		'radius' : 110 + ((pnt.y!==0) ? Math.abs(pnt.y/10) : 0)  - ((pnt.y>150) ? (pnt.y-150)/10 : 0) - ((Math.abs(pnt.x)>50) ? ((Math.abs(pnt.x)-50)/5) : 0),
		'centreX' : 0 + pnt.x,
		'centreY' : 150 + ((pnt.y<0) ? pnt.y/5 : 0) - ((Math.abs(pnt.x)<40) ? Math.abs(pnt.x)/40: 1) - ((Math.abs(pnt.x)>100) ? (Math.abs(pnt.x)-100) / 20 : 0), 
		'startAngle' : 0.7*Math.PI,
		'endAngle' : 0.3*Math.PI,
		'height' : 27 - ((Math.abs(pnt.x)>50) ? ((Math.abs(pnt.x)-50)/10) : 0),
		'skewR' : {
			'x' : 0.5,
			'y' : 1 + ((pnt.x<-100) ? ((Math.abs(pnt.x)-100)/1000) : 0)
		},
		'skewL' : {
			'x' : 0.5,
			'y' : 1
		},
	};
	theta = (chinArc.endAngle - chinArc.startAngle) * 0.5 + Math.PI;
	chinArc.startX = chinArc.centreX - Math.sin(theta) * chinArc.radius;
	chinArc.endX = chinArc.centreX + Math.sin(theta) * chinArc.radius;
	chinArc.startY = chinArc.centreY - Math.cos(theta) * chinArc.radius - ((pnt.x<-100) ? ((Math.abs(pnt.x)-100)/5) : 0);
	chinArc.endY = chinArc.startY + ((pnt.x<-100) ? ((Math.abs(pnt.x)-100)/5) : 0);
// 	if (chinArc.endX > headArc.endX) chinArc.centre = headArc.endX - chinArc.radius;
	
	var cheekL = {
		'skew1' : {
			'x' : 0.1 - ((pnt.x<-100) ? ((pnt.x+100)/1000) : 0),
			'y' : 0.2 + ((pnt.x<-100) ? ((pnt.x+100)/700) : 0)
		},
		'skew2' : {
			'x' : 0.2,
			'y' : 0.5 - ((pnt.x<-100) ? ((pnt.x+100)/700) : 0)
		},
	}
	var cheekR = {
		'skew1' : {
			'x' : 0.2 + ((pnt.x<-100) ? ((Math.abs(pnt.x)-100)/700) : 0),
			'y' : 0.5 + ((pnt.x>100) ? ((Math.abs(pnt.x)-100)/700) : 0)
		},
		'skew2' : {
			'x' : 1.1 - ((pnt.x>100) ? ((Math.abs(pnt.x)-100)/1000) : 0),
			'y' : 0.2 - ((pnt.x>100) ? ((Math.abs(pnt.x)-100)/700) : 0)
		},
	}
	
	// Boundary path
	ctx.beginPath();

	// all head controls
/*
	ctx.arc(headArc.endX, headArc.endY, 5, 0, 2*Math.PI, true);
	ctx.arc(headArc.endX + headArc.skewL.x*headArc.radius, headArc.endY - headArc.radius*headArc.skewL.y, 5, 0 , 2*Math.PI, true);
	ctx.arc(headArc.startX - headArc.skewR.x*headArc.radius, headArc.startY - headArc.radius*headArc.skewR.y, 5, 0 , 2*Math.PI, true);
	ctx.arc(headArc.startX, headArc.startY, 5, 0, 2*Math.PI, true);
*/

/*
	// head centre
	ctx.moveTo(headArc.centreX, headArc.centreY);
	ctx.arc(headArc.centreX, headArc.centreY, 5, 0, 2*Math.PI, true);
	// chin centre
	ctx.moveTo(chinArc.centreX, chinArc.centreY);
	ctx.arc(chinArc.centreX, chinArc.centreY, 5, 0, 2*Math.PI, true);
*/
	
	// Head top
	ctx.moveTo(headArc.endX, headArc.endY);
	ctx.bezierCurveTo(headArc.endX + headArc.skewL.x*headArc.radius, headArc.endY - headArc.radius*headArc.skewL.y, headArc.startX - headArc.skewR.x*headArc.radius, headArc.startY - headArc.radius*headArc.skewR.y, headArc.startX, headArc.startY);

	// R cheek controls
/*
	ctx.arc(headArc.startX + cheekR.skew1.x*(chinArc.startX - headArc.startX), headArc.startY + cheekR.skew1.y*(chinArc.startY - headArc.startY), 5, 0, 2*Math.PI, true);
	ctx.arc(headArc.startX*cheekR.skew2.x, chinArc.startY  - cheekR.skew2.y*(chinArc.startY - headArc.startY), 5, 0, 2*Math.PI, true);
	ctx.lineTo(chinArc.startX, chinArc.startY);
	
*/
	// R cheek
// 	ctx.moveTo(headArc.startX, headArc.startY);
	ctx.bezierCurveTo(headArc.startX + cheekR.skew1.x*(chinArc.startX - headArc.startX), headArc.startY + cheekR.skew1.y*(chinArc.startY - headArc.startY), headArc.startX*cheekR.skew2.x, chinArc.startY  - cheekR.skew2.y*(chinArc.startY - headArc.startY), chinArc.startX, chinArc.startY);
	
	// all chin controls
/*
	ctx.arc(chinArc.startX, chinArc.startY, 5, 0, 2*Math.PI, true);
	ctx.arc(chinArc.endX - chinArc.skewR.x*(chinArc.endX - chinArc.startX) - chinArc.height, chinArc.skewR.y*chinArc.startY + chinArc.height, 5, 0 , 2*Math.PI, true);
	ctx.arc(chinArc.endX - chinArc.skewL.x*(chinArc.endX - chinArc.startX) + chinArc.height, chinArc.endY*chinArc.skewL.y + chinArc.height, 5, 0 , 2*Math.PI, true);
	ctx.arc(chinArc.endX, chinArc.endY, 5, 0, 2*Math.PI, true);
*/

	// chin
	ctx.moveTo(chinArc.startX, chinArc.startY);
	ctx.bezierCurveTo(chinArc.endX - chinArc.skewR.x*(chinArc.endX - chinArc.startX) - chinArc.height, chinArc.skewR.y*chinArc.startY + chinArc.height, chinArc.endX - chinArc.skewL.x*(chinArc.endX - chinArc.startX) + chinArc.height, chinArc.endY*chinArc.skewL.y + chinArc.height, chinArc.endX, chinArc.endY);
	
	// L cheek controls
/*
	ctx.arc(headArc.endX + cheekL.skew1.x*(chinArc.startX - headArc.startX), chinArc.endY  - cheekL.skew1.y*(chinArc.endY - headArc.endY), 5, 0, 2*Math.PI, true);
	ctx.arc(headArc.endX - cheekL.skew2.x*(headArc.endX - chinArc.endX), headArc.endY + cheekL.skew2.y*(chinArc.endY - headArc.endY), 5, 0, 2*Math.PI, true);
	ctx.lineTo(headArc.endX, headArc.endY);
	ctx.moveTo(chinArc.endX, chinArc.endY);
	
*/
	// L cheek
	ctx.bezierCurveTo(headArc.endX + cheekL.skew1.x*(chinArc.startX - headArc.startX), chinArc.endY  - cheekL.skew1.y*(chinArc.endY - headArc.endY), headArc.endX - cheekL.skew2.x*(headArc.endX - chinArc.endX), headArc.endY + cheekL.skew2.y*(chinArc.endY - headArc.endY), headArc.endX, headArc.endY);


	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "white"
	ctx.strokeStyle = "black";
	ctx.shadowBlur = 20;
	ctx.shadowOffsetX = 15;
	ctx.shadowOffsetY = 5;
	ctx.shadowColor = "rgba(0,0,0,0.8)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowColor = "rgba(0,0,0,0.8)";
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		var p = this.squiggleArray[0].pointsArray[0];
		/// head shadow
		
		/// neck shadow
/*
		ctx.beginPath();
		ctx.moveTo(-85, 400);
		ctx.bezierCurveTo(-77,190,0,350,80,250);
		
		ctx.lineWidth = 70;
		ctx.strokeStyle = "rgba(0, 0, 255, 0.035)";
		ctx.stroke();
		ctx.closePath();
*/
		
		
		/// hairline marking centre of face
/*
		ctx.beginPath();
		// mark X plane
		ctx.moveTo(-170, -p.y);
		ctx.lineTo(170, -p.y);
		// mark Y plane
		ctx.moveTo(p.x, -250);
		ctx.lineTo(p.x, 200);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 7;
		ctx.stroke();
*/

		// inner shadow
/*
		ctx.beginPath();

		// R cheek
		ctx.moveTo(headArc.startX, headArc.startY);
		ctx.bezierCurveTo(headArc.startX + cheekR.skew1.x*(chinArc.startX - headArc.startX), headArc.startY + cheekR.skew1.y*(chinArc.startY - headArc.startY), headArc.startX*cheekR.skew2.x, chinArc.startY  - cheekR.skew2.y*(chinArc.startY - headArc.startY), chinArc.startX, chinArc.startY);
	
		ctx.shadowColor = 'blue';
	    ctx.strokeStyle = "rgba(0,0,0,1)";
	    ctx.shadowBlur = 20;
	    ctx.shadowOffsetX = 20;
	    ctx.shadowOffsetY = -5;
	    ctx.stroke();
	    ctx.closePath();
	    
	    ctx.shadowBlur = 0;
	    ctx.shadowOffsetX = 0;
	    ctx.shadowOffsetY = 0;
*/
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	
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
ED.HeadPostures.prototype.description = function() {
// 	return "Corneal oedema";
}
