/**
 * OpenEyes
 *
 * (C) OpenEyes Foundation, 2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Corneal Laceration drawing
 *
 * @class CornealLaceration
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealLaceration = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealLaceration";

	this.plane = 0;
	
	// derived parameter
	this.lacerationDepth = 0;
	this.lacType = "laceration";
	this.complete = false;
	this.irisProlapse = false;
	this.boundaryMin = -450;
	this.boundaryWidth = 900;
	this.numberOfHandles = 0;
	this.mousePoint = new ED.Point(-550,-550); //default off canvas so not visible

	// Saved parameters
	this.savedParameterArray = ['complete','lacerationDepth','numberOfHandles','irisProlapse'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'lacerationDepth':'Laceration Depth %',
		'irisProlapse':'Iris prolapse'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

}

/**
 * Sets superclass and constructor
 */
ED.CornealLaceration.prototype = new ED.Doodle;
ED.CornealLaceration.prototype.constructor = ED.CornealLaceration;
ED.CornealLaceration.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealLaceration.prototype.setHandles = function() {
	if (this.numberOfHandles>0) {
		for (var i = 0; i < this.numberOfHandles; i++) {
			this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
		}
	}
}

/**
 * Sets default dragging attributes
 */
ED.CornealLaceration.prototype.setPropertyDefaults = function() {
	this.isRotatable = false;
	this.isFilled = false;
	this.isMoveable = false;

	this.parameterValidationArray['lacerationDepth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		animate: false
	};
	this.parameterValidationArray['lacType'] = {
		kind: 'derived',
		type: 'string',
		list: ['laceration', 'cornealscleral laceration'],
		animate: false
	};
	this.parameterValidationArray['irisProlapse'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};

	var d = this;

	//Complete doodle on double click
	d.drawing.canvas.addEventListener('dblclick', function(e) {
		if (d.isSelected && !d.complete) {
			//Deletion of handle upon completion removed DAC 20170411
			/*d.squiggleArray[0].pointsArray.shift();
			d.handleArray.shift();
			d.numberOfHandles--;*/
			d.complete = true;
			d.drawing.repaint();
		}
	}, false);

	//Draws straight line to mouse
	this.drawing.canvas.addEventListener('mousemove', function(e) {
		if (!d.complete) {
			var position = ED.findPosition(this, e);
			var mousePosDoodlePlane = d.drawing.inverseTransform.transformPoint(position); // coordinates of mouse in doodle plane
			d.mousePoint = new ED.Point(mousePosDoodlePlane.x, mousePosDoodlePlane.y);
			d.drawing.repaint();
		}
	}, false);

	//Draws handle at mousedown location
	this.drawing.canvas.addEventListener('mousedown', function(e) {
		if (d.draggingHandleIndex==null && d.isSelected && !d.complete) {
			var position = ED.findPosition(this, e);
			var mousePosDoodlePlane = d.drawing.inverseTransform.transformPoint(position); // coordinates of mouse in doodle plane
			if (mousePosDoodlePlane.x>d.boundaryMin && mousePosDoodlePlane.y>d.boundaryMin && mousePosDoodlePlane.x<(d.boundaryMin+d.boundaryWidth) && mousePosDoodlePlane.y<(d.boundaryMin+d.boundaryWidth)) {
				d.addHandle(mousePosDoodlePlane);
			}
		}
	}, false);

}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CornealLaceration.prototype.setParameterDefaults = function() {
	// create the base squiggle
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
	this.squiggleArray.push(squiggle);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealLaceration.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'handles':
		returnArray['lacType'] = this.calculateLacerationType();
		break;
		case 'complete':
			if (this.complete) {
				this.numberOfHandles = this.squiggleArray[0].pointsArray.length - 1;
				this.setHandles();
			}
	}
	return returnArray;
}


/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealLaceration.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealLaceration.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Draw rectangle for boundary drawing area over entire canvas if doodle incomplete
	if (!this.complete) {
		ctx.rect(this.boundaryMin, this.boundaryMin, this.boundaryWidth, this.boundaryWidth);
		this.hitTestMethod = 'path';
		ctx.lineWidth = 2;
	}
	// Otherwise draw boundary rectangle around the doodle
	else {
		this.hitTestMethod = 'stroke';
        var squiggle = this.squiggleArray[0];
		// drawing lines for hit test
		ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.lineWidth = 10; // set wider for hit testing
        for (var i = this.numberOfHandles-1; i >= 0; i--) {
            ctx.lineTo(squiggle.pointsArray[i].x, squiggle.pointsArray[i].y);
        }
        ctx.stroke();
	}

	// Close path
	ctx.closePath();

	// Set attributes for border (colour changes to indicate drawing mode)

	this.isFilled = false;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	if (this.isSelected && !this.complete) ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (this.numberOfHandles>0) {
			// Get coordinates of mouse in doodle plane
			// Draw straight line between points in squiggle array
			var squiggle = this.squiggleArray[0];
			ctx.beginPath();
			// Squiggle attributes
			ctx.lineWidth = 5;
			ctx.strokeStyle = "blue";


			// Iterate through squiggle points
			for (var i = this.numberOfHandles-1; i >= 0; i--) {
				ctx.lineTo(squiggle.pointsArray[i].x, squiggle.pointsArray[i].y);
			}
			// Line to mouse coordinates, if selected, incomplete, and within boundary
			if (this.isSelected && this.draggingHandleIndex==null && !this.complete) {
					if (this.mousePoint.x>this.boundaryMin && this.mousePoint.y>this.boundaryMin && this.mousePoint.x<(this.boundaryMin+this.boundaryWidth) && this.mousePoint.y<(this.boundaryMin+this.boundaryWidth)) {
					ctx.lineTo(this.mousePoint.x,this.mousePoint.y);
				}
			}
			ctx.stroke();
		}

		// Draw circle to indicate position for next handle
		if (!this.complete && this.isSelected && this.mousePoint.x>this.boundaryMin && this.mousePoint.y>this.boundaryMin && this.mousePoint.x<(this.boundaryMin+this.boundaryWidth) && this.mousePoint.y<(this.boundaryMin+this.boundaryWidth)) {
			ctx.beginPath();
			ctx.arc(this.mousePoint.x,this.mousePoint.y,25,0,2*Math.PI);
			ctx.strokeStyle="red";
			ctx.fillStyle="yellow";
			ctx.fill();
			ctx.stroke();
		}
	}

	// Coordinates of handles (in canvas plane)
	if (this.numberOfHandles>0) {
		for (var i = 0; i < this.numberOfHandles; i++) {
			this.handleArray[i].location=this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
		}
	}

	// Draw handles if selected but not if for drawing
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}


ED.CornealLaceration.prototype.description = function() {
	var s = this.squiggleArray[0];	
	//Linear distance of laceration (scale 380px:6mm)
	var linearDistance = (this.numberOfHandles>=2) ? 6*( Math.sqrt(Math.pow(s.pointsArray[0].x - s.pointsArray[this.numberOfHandles-1].x,2) + Math.pow(s.pointsArray[0].y - s.pointsArray[this.numberOfHandles-1].y,2)) )/380 : 0;	
	var linearDistanceShort = linearDistance.toFixed(2);
	this.lacType = this.calculateLacerationType();
	
	var text = "";
	
	if (this.lacerationDepth == 100) text += 'Full thickness ' + this.lacType + ' ' + linearDistanceShort +'mm';
	else  if (this.lacerationDepth > 0) text += 'Partial thickness ' +  this.lacType + ' ' + linearDistanceShort +'mm, '+ this.lacerationDepth + '%';
	else text += this.lacType + ' ' + linearDistanceShort + 'mm';

	return text;
}
 	
//Computes laceration type
ED.CornealLaceration.prototype.calculateLacerationType = function() {
	var i=0;
	var scleralInvolvement = false;
	while (!scleralInvolvement && i<this.numberOfHandles) { 
		var p = this.squiggleArray[0].pointsArray[i];
		//Distance of handle from the origin
		var distance = Math.sqrt(p.x*p.x + p.y*p.y);
		//Tests whether a handle is within the sclera
		if (distance > 380) scleralInvolvement = true;
		i++;
	}

	var lacType = (scleralInvolvement) ? "corneoscleral laceration" : "corneal laceration";
	return lacType;
}

ED.CornealLaceration.prototype.addHandle = function(_position) {
	// Add point to squiggle array
	this.squiggleArray[0].pointsArray.splice(0, 0, _position);
	// Add handle to handle array
	this.handleArray.splice(0,0,(new ED.Doodle.Handle(null, true, ED.Mode.Handles, false)));
	// Increase handle counter
	this.numberOfHandles++;
		
	this.lacType = this.calculateLacerationType();
	this.updateDependentParameters('handles');
}



