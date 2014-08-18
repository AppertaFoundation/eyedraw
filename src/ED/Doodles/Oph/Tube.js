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
 * Tube tube
 *
 * @class Tube
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Tube = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Tube";

	// Derived parameters
	this.type = 'Baerveldt 103-250';
	this.platePosition = 'STQ';
	
	// Other Parameters
	this.bezierArray = new Array();

	// Saved parameters
	this.savedParameterArray = ['rotation', 'apexY', 'type'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Tube.prototype = new ED.Doodle;
ED.Tube.prototype.constructor = ED.Tube;
ED.Tube.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Tube.prototype.setHandles = function() {
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Tube.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = true;
	this.snapToAngles = true;
	this.isDeletable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-300, +300);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-600, -100);

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'other',
		type: 'string',
		list: ['Ahmed FP7', 'Baerveldt 103-250', 'Baerveldt 101-350', 'Baerveldt 103-350', 'Molteno Single'],
		animate: false
	};
	this.parameterValidationArray['platePosition'] = {
		kind: 'derived',
		type: 'string',
		list: ['STQ', 'SNQ', 'INQ', 'ITQ'],
		animate: true
	};

	// Array of angles to snap to
	var phi = Math.PI / 4;
	this.anglesArray = [phi, 3 * phi, 5 * phi, 7 * phi];
}

/**
 * Sets default parameters
 */
ED.Tube.prototype.setParameterDefaults = function() {
	this.apexY = -300;
	//this.setParameterFromString('type', 'Baerveldt');
	this.setParameterFromString('platePosition', 'STQ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Tube.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	var isRE = (this.drawing.eye == ED.eye.Right);
	var phi = Math.PI / 4;

	switch (_parameter) {
		case 'rotation':
			if (this.rotation > 0 && this.rotation <= 2 * phi) {
				returnArray['platePosition'] = isRE ? 'SNQ' : 'STQ';
			} else if (this.rotation > 2 * phi && this.rotation <= 4 * phi) {
				returnArray['platePosition'] = isRE ? 'INQ' : 'ITQ';
			} else if (this.rotation > 4 * phi && this.rotation <= 6 * phi) {
				returnArray['platePosition'] = isRE ? 'ITQ' : 'INQ';
			} else {
				returnArray['platePosition'] = isRE ? 'STQ' : 'SNQ';
			}
			break;

		case 'platePosition':
			switch (_value) {
				case 'STQ':
					if (isRE) {
						returnArray['rotation'] = 7 * phi;
					} else {
						returnArray['rotation'] = phi;
					}
					break;
				case 'SNQ':
					if (isRE) {
						returnArray['rotation'] = phi;
					} else {
						returnArray['rotation'] = 7 * phi;
					}
					break;
				case 'INQ':
					if (isRE) {
						returnArray['rotation'] = 3 * phi;
					} else {
						returnArray['rotation'] = 5 * phi;
					}
					break;
				case 'ITQ':
					if (isRE) {
						returnArray['rotation'] = 5 * phi;
					} else {
						returnArray['rotation'] = 3 * phi;
					}
					break;
			}
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Tube.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Tube.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Scaling factor
	var s = 0.41666667;

	// Vertical shift
	var d = -740;
	
	switch (this.type) {
		case 'Ahmed FP7':
			// Plate
			ctx.moveTo(-300 * s, 0 * s + d);
			ctx.bezierCurveTo(-300 * s, -100 * s + d, -200 * s, -400 * s + d, 0 * s, -400 * s + d);
			ctx.bezierCurveTo(200 * s, -400 * s + d, 300 * s, -100 * s + d, 300 * s, 0 * s + d);
			ctx.bezierCurveTo(300 * s, 140 * s + d, 200 * s, 250 * s + d, 0 * s, 250 * s + d);
			ctx.bezierCurveTo(-200 * s, 250 * s + d, -300 * s, 140 * s + d, -300 * s, 0 * s + d);

			// Connection flange
			ctx.moveTo(-160 * s, 230 * s + d);
			ctx.lineTo(-120 * s, 290 * s + d);
			ctx.lineTo(120 * s, 290 * s + d);
			ctx.lineTo(160 * s, 230 * s + d);
			ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
			break;

		case 'Ahmed S2':
			// Plate
			ctx.moveTo(-300 * s, 0 * s + d);
			ctx.bezierCurveTo(-300 * s, -100 * s + d, -200 * s, -400 * s + d, 0 * s, -400 * s + d);
			ctx.bezierCurveTo(200 * s, -400 * s + d, 300 * s, -100 * s + d, 300 * s, 0 * s + d);
			ctx.bezierCurveTo(300 * s, 140 * s + d, 200 * s, 250 * s + d, 0 * s, 250 * s + d);
			ctx.bezierCurveTo(-200 * s, 250 * s + d, -300 * s, 140 * s + d, -300 * s, 0 * s + d);

			// Connection flange
			ctx.moveTo(-160 * s, 230 * s + d);
			ctx.lineTo(-120 * s, 290 * s + d);
			ctx.lineTo(120 * s, 290 * s + d);
			ctx.lineTo(160 * s, 230 * s + d);
			ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
			break;
			
		case 'Ahmed S3':
			// Plate
			ctx.moveTo(-100 * s, 230 * s + d);
			ctx.lineTo(100 * s, 230 * s + d);
			ctx.lineTo(200 * s, 0 * s + d);
			ctx.lineTo(100 * s, -230 * s + d);
			ctx.lineTo(-100 * s, -230 * s + d);
			ctx.lineTo(-200 * s, 0 * s + d);
			ctx.lineTo(-100 * s, 230 * s + d);
				
			// Connection flange
			ctx.moveTo(-100 * s, 230 * s + d);
			ctx.lineTo(-100 * s, 290 * s + d);
			ctx.lineTo(100 * s, 290 * s + d);
			ctx.lineTo(100 * s, 230 * s + d);
			ctx.bezierCurveTo(100 * s, 250 * s + d, -100 * s, 250 * s + d, -100 * s, 230 * s + d);
			break;

		case 'Baerveldt 103-250':
			// Plate
			ctx.moveTo(0, 230 * s + d);
			ctx.lineTo(-100 * s, 230 * s + d);
			ctx.bezierCurveTo(-500 * s, 180 * s + d, -300 * s, -240 * s + d, 0, -200 * s + d);
			ctx.bezierCurveTo(300 * s, -240 * s + d, 500 * s, 180 * s + d, 100 * s, 230 * s + d);
			ctx.lineTo(0, 230 * s + d);

			// Connection flange
			ctx.moveTo(-160 * s, 230 * s + d);
			ctx.lineTo(-120 * s, 290 * s + d);
			ctx.lineTo(120 * s, 290 * s + d);
			ctx.lineTo(160 * s, 230 * s + d);
			ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
			break;
			
		case 'Baerveldt 101-350':
			// Plate
			ctx.moveTo(0, 230 * s + d);
			ctx.lineTo(-100 * s, 230 * s + d);
			ctx.bezierCurveTo(-150 * s, 230 * s + d, -600 * s, 0 * s + d, -300 * s, -200 * s + d);
			ctx.bezierCurveTo(-200 * s, -240 * s + d, 200 * s, -240 * s + d, 300 * s, -200 * s + d);
			ctx.bezierCurveTo(600 * s, 0 * s + d, 150 * s, 230 * s + d, 100 * s, 230 * s + d);
			ctx.lineTo(0, 230 * s + d);

			// Connection flange
			ctx.moveTo(-160 * s, 230 * s + d);
			ctx.lineTo(-120 * s, 290 * s + d);
			ctx.lineTo(120 * s, 290 * s + d);
			ctx.lineTo(160 * s, 230 * s + d);
			ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
			break;
			
		case 'Baerveldt 103-350':
			// Plate
			ctx.moveTo(0, 230 * s + d);
			ctx.lineTo(-100 * s, 230 * s + d);
			ctx.bezierCurveTo(-150 * s, 230 * s + d, -600 * s, 0 * s + d, -300 * s, -200 * s + d);
			ctx.bezierCurveTo(-200 * s, -240 * s + d, 200 * s, -240 * s + d, 300 * s, -200 * s + d);
			ctx.bezierCurveTo(600 * s, 0 * s + d, 150 * s, 230 * s + d, 100 * s, 230 * s + d);
			ctx.lineTo(0, 230 * s + d);

			// Connection flange
			ctx.moveTo(-160 * s, 230 * s + d);
			ctx.lineTo(-120 * s, 290 * s + d);
			ctx.lineTo(120 * s, 290 * s + d);
			ctx.lineTo(160 * s, 230 * s + d);
			ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
			break;
						
		case 'Molteno Single':
			// Plate
			ctx.arc(0, d, 310 * s, 0, Math.PI * 2, true);
			break;
			
		case 'Molteno 8mm':
			// Plate
			ctx.arc(0, d + 30, 250 * s, 0, Math.PI * 2, true);
			break;
	}

	// Set Attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(120,120,120,0.75)";
	ctx.fillStyle = "rgba(220,220,220,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Extras
		switch (this.type) {
			case 'Ahmed FP7':
				// Spots
				this.drawSpot(ctx, 0 * s, -230 * s + d, 20 * s, "white");
				this.drawSpot(ctx, -180 * s, -180 * s + d, 20 * s, "white");
				this.drawSpot(ctx, 180 * s, -180 * s + d, 20 * s, "white");

				// Trapezoid mechanism
				ctx.beginPath()
				ctx.moveTo(-100 * s, 230 * s + d);
				ctx.lineTo(100 * s, 230 * s + d);
				ctx.lineTo(200 * s, 0 * s + d);
				ctx.lineTo(40 * s, 0 * s + d);
				ctx.arcTo(0, -540 * s + d, -40 * s, 0 * s + d, 15);
				ctx.lineTo(-40 * s, 0 * s + d);
				ctx.lineTo(-200 * s, 0 * s + d);
				ctx.closePath();

				ctx.fillStyle = "rgba(250,250,250,0.7)";
				ctx.fill();

				// Lines
				ctx.moveTo(-80 * s, -40 * s + d);
				ctx.lineTo(-160 * s, -280 * s + d);
				ctx.moveTo(80 * s, -40 * s + d);
				ctx.lineTo(160 * s, -280 * s + d);
				ctx.lineWidth = 8;
				ctx.strokeStyle = "rgba(250,250,250,0.7)";
				ctx.stroke();

				// Ridge on flange
				ctx.beginPath()
				ctx.moveTo(-30 * s, 250 * s + d);
				ctx.lineTo(-30 * s, 290 * s + d);
				ctx.moveTo(30 * s, 250 * s + d);
				ctx.lineTo(30 * s, 290 * s + d);			
				break;
				
			case 'Ahmed S2':
				// Trapezoid mechanism
				ctx.beginPath()
				ctx.moveTo(-100 * s, 230 * s + d);
				ctx.lineTo(100 * s, 230 * s + d);
				ctx.lineTo(200 * s, 0 * s + d);
				ctx.lineTo(-40 * s, 0 * s + d);
				ctx.lineTo(-200 * s, 0 * s + d);
				ctx.closePath();
				ctx.fillStyle = "rgba(250,250,250,0.7)";
				ctx.fill();

				// Line
				ctx.beginPath();
				ctx.moveTo(-280 * s, 0 * s + d);
				ctx.lineTo(+280 * s, 0 * s + d);
				ctx.lineWidth = 8;
				ctx.strokeStyle = "rgba(250,250,250,0.7)";
				ctx.stroke();		
				break;
				
			case 'Ahmed S3':
				// Trapezoid mechanism
				ctx.beginPath()
				ctx.moveTo(-100 * s, 230 * s + d);
				ctx.lineTo(100 * s, 230 * s + d);
				ctx.lineTo(200 * s, 0 * s + d);
				ctx.lineTo(-40 * s, 0 * s + d);
				ctx.lineTo(-200 * s, 0 * s + d);
				ctx.closePath();
				ctx.fillStyle = "rgba(250,250,250,0.7)";
				ctx.fill();	
				break;
											
			case 'Baerveldt 103-250':
				// Spots
 				this.drawSpot(ctx, -120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");
				this.drawSpot(ctx, 120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");

				// Ridge on flange
				ctx.beginPath();
				ctx.moveTo(-30 * s, 250 * s + d);
				ctx.lineTo(-30 * s, 290 * s + d);
				ctx.moveTo(30 * s, 250 * s + d);
				ctx.lineTo(30 * s, 290 * s + d);
				ctx.strokeStyle = "rgba(150,150,150,0.5)";
				ctx.stroke();
				break;
											
			case 'Baerveldt 101-350':
				// Spots
 				this.drawSpot(ctx, -120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");
				this.drawSpot(ctx, 120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");

				// Ridge on flange
				ctx.beginPath();
				ctx.moveTo(-30 * s, 250 * s + d);
				ctx.lineTo(-30 * s, 290 * s + d);
				ctx.moveTo(30 * s, 250 * s + d);
				ctx.lineTo(30 * s, 290 * s + d);
				ctx.strokeStyle = "rgba(150,150,150,0.5)";
				ctx.stroke();
				break;
											
			case 'Baerveldt 103-350':
				// Spots
 				this.drawSpot(ctx, -120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");
				this.drawSpot(ctx, 120 * s, 20 * s + d, 10, "rgba(150,150,150,0.5)");

				// Ridge on flange
				ctx.beginPath();
				ctx.moveTo(-30 * s, 250 * s + d);
				ctx.lineTo(-30 * s, 290 * s + d);
				ctx.moveTo(30 * s, 250 * s + d);
				ctx.lineTo(30 * s, 290 * s + d);
				ctx.strokeStyle = "rgba(150,150,150,0.5)";
				ctx.stroke();
				break;
												
		case 'Molteno Single':				
				// Inner ring
				ctx.beginPath();
				ctx.arc(0, d, 250 * s, 0, Math.PI * 2, true);
				ctx.stroke();

				// Suture holes
				this.drawSpot(ctx, -200 * s, 200 * s + d, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, -200 * s, -200 * s + d, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, 200 * s, -200 * s + d, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, 200 * s, 200 * s + d, 5, "rgba(255,255,255,1)");
				break;
				
		case 'Molteno 8mm':				
				// Inner ring
				ctx.beginPath();
				ctx.arc(0, d + 30, 200 * s, 0, Math.PI * 2, true);
				ctx.stroke();

				// Suture holes
				this.drawSpot(ctx, -160 * s, 160 * s + d + 30, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, -160 * s, -160 * s + d + 30, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, 160 * s, -160 * s + d + 30, 5, "rgba(255,255,255,1)");
				this.drawSpot(ctx, 160 * s, 160 * s + d + 30, 5, "rgba(255,255,255,1)");
				break;
		}

		/* Curvy tube abandoned, since Supramid needs adjusting along entire length and no function available to determine position on Bezier curve
		// Bezier points for curve of tube in array to export to Supramid
		this.bezierArray['sp'] = new ED.Point(0, 380 * s + d);
		this.bezierArray['cp1'] = new ED.Point(0, 420 * s + d);
		this.bezierArray['cp2'] = new ED.Point(this.apexX * 1.5, this.apexY + ((290 * s + d) - this.apexY) * 0.5);
		this.bezierArray['ep'] = new ED.Point(this.apexX, this.apexY);
		
		ctx.beginPath();
		ctx.moveTo(0, 290 * s + d);
		ctx.lineTo(this.bezierArray['sp'].x, this.bezierArray['sp'].y);		
 		ctx.bezierCurveTo(this.bezierArray['cp1'].x, this.bezierArray['cp1'].y, this.bezierArray['cp2'].x, this.bezierArray['cp2'].y, this.bezierArray['ep'].x, this.bezierArray['ep'].y);
 		*/
 		
 		// Straight line points for curve of tube in array to export to Supramid
 		this.bezierArray['sp'] = new ED.Point(0, 380 * s + d);
		this.bezierArray['cp1'] = new ED.Point(0, 420 * s + d);
		var apexPoint = new ED.Point(this.apexX, this.apexY);
		var entryPoint = new ED.Point(0,0);
		entryPoint.setWithPolars(430, apexPoint.direction());
		this.bezierArray['cp2'] = entryPoint;
		this.bezierArray['ep'] = apexPoint;

		ctx.beginPath();
		ctx.moveTo(0, 290 * s + d);
		ctx.lineTo(this.bezierArray['sp'].x, this.bezierArray['sp'].y);		
 		ctx.lineTo(this.bezierArray['cp1'].x, this.bezierArray['cp1'].y);
 		ctx.lineTo(this.bezierArray['cp2'].x, this.bezierArray['cp2'].y);
 		ctx.lineTo(this.bezierArray['ep'].x, this.bezierArray['ep'].y);
		
		// Simulate tube with gray line and white narrower line
		ctx.strokeStyle = "rgba(150,150,150,0.5)";
		ctx.lineWidth = 20;
		ctx.stroke();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 8;
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
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Tube.prototype.description = function() {
	var descArray = {
		STQ: 'superotemporal',
		SNQ: 'superonasal',
		INQ: 'inferonasal',
		ITQ: 'inferotemporal'
	};

	return this.type + " tube in the " + descArray[this.platePosition] + " quadrant";
}
