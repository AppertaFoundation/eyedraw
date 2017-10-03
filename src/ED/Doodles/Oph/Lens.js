/**
 * OpenEyes
 * MSC mod
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
 * Lens
 *
 * @class Lens
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Lens = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Lens";

	// Derived parameters
	this.nuclearGrade = 'None';
	this.corticalGrade = 'None';
	this.posteriorSubcapsularGrade = 'None';
	this.anteriorPolar = false;
	this.posteriorPolar = false;
	this.coronary = false;
	this.phakodonesis = false;
	this.csOriginX = 0;

	// Saved parameters
	this.savedParameterArray = ['rotation', 'originX', 'originY', 'nuclearGrade', 'corticalGrade', 'posteriorSubcapsularGrade', 'anteriorPolar', 'posteriorPolar', 'coronary', 'phakodonesis', 'csOriginX'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'nuclearGrade':'Nuclear',
		'corticalGrade':'Cortical',
		'posteriorSubcapsularGrade':'Posterior subcapsular',
		'anteriorPolar':'Anterior polar',
		'posteriorPolar':'Posterior polar',
		'coronary':'Coronary',
		'phakodonesis':'Phacodonesis',
		};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Lens.prototype = new ED.Doodle;
ED.Lens.prototype.constructor = ED.Lens;
ED.Lens.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Lens.prototype.setPropertyDefaults = function() {
	this.isUnique = true;
	this.addAtBack = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-125, +125);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-125, +125);

	this.parameterValidationArray['nuclearGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Mild', 'Moderate', 'Brunescent'],
		animate: false
	};
	this.parameterValidationArray['corticalGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Mild', 'Moderate', 'White'],
		animate: false
	};
	this.parameterValidationArray['posteriorSubcapsularGrade'] = {
		kind: 'derived',
		type: 'string',
		list: ['None', 'Small', 'Medium', 'Large'],
		animate: false
	};
	this.parameterValidationArray['anteriorPolar'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['posteriorPolar'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['coronary'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['phakodonesis'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Lens.prototype.setParameterDefaults = function() {}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lens.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Lens.superclass.draw.call(this, _point);

	// Height of cross section (half value of ro in AntSeg doodle)
	var ro = 240;

	// Boundary path
	ctx.beginPath();

	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

	// Move to inner circle
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		// Posterior subcapsular
		if (this.posteriorSubcapsularGrade != 'None') {
			var rp;
			switch (this.posteriorSubcapsularGrade) {
				case 'Small':
					rp = 30;
					break;
				case 'Medium':
					rp = 60;
					break;
				case 'Large':
					rp = 90;
					break;
			}
			ctx.beginPath();
			ctx.arc(0, 0, rp, 0, Math.PI * 2, false);
			var ptrn = ctx.createPattern(this.drawing.imageArray['PSCPattern'], 'repeat');
			ctx.fillStyle = ptrn;
			ctx.strokeStyle = "lightgray";
			ctx.fill();
			ctx.stroke();
		}

		// Posterior Polar
		if (this.posteriorPolar) {
			var rap = 50;
			ctx.beginPath();
			ctx.arc(0, 0, rap, 0, Math.PI * 2, false);
			ctx.fillStyle = "rgba(140,140,140,0.75)";
			ctx.strokeStyle = "gray";
			ctx.fill();
			ctx.stroke();
		}

		// Nuclear cataract
		var ri = ro - 60;
		ctx.beginPath();
		ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
		ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
		ctx.stroke();
		if (this.nuclearGrade != 'None') {
			var col;
			switch (this.nuclearGrade) {
				case 'Mild':
					col = -120;
					break;
				case 'Moderate':
					col = -80;
					break;
				case 'Brunescent':
					col = +0;
					break;
			}
			yellowColour = "rgba(255, 255, 0, 0.75)";
			var brownColour = "rgba(" + Math.round(120 - col) + ", " + Math.round(60 - col) + ", 0, 0.75)";
			var gradient = ctx.createRadialGradient(0, 0, 210, 0, 0, 50);
			gradient.addColorStop(0, yellowColour);
			gradient.addColorStop(1, brownColour);
			ctx.fillStyle = gradient;
			ctx.fill();
		}

		// Cortical cataract
		if (this.corticalGrade != 'None') {
			// Parameters
			var n = 16; // Number of cortical spokes
			var ro = 240; // Outer radius of cataract
			var rs = 230; // Outer radius of spoke
			var theta = 2 * Math.PI / n; // Angle of outer arc of cortical shard
			var phi = theta / 2; // Half theta
			var ri;
			switch (this.corticalGrade) {
				case 'Mild':
					ri = 180;
					break;
				case 'Moderate':
					ri = 100;
					break;
				case 'White':
					ri = 20;
					break;
			}

			// Spokes
			ctx.beginPath();
			var sp = new ED.Point(0, 0);
			sp.setWithPolars(rs, -phi);
			ctx.moveTo(sp.x, sp.y);

			for (var i = 0; i < n; i++) {
				var startAngle = i * theta - phi;
				var endAngle = startAngle + theta;

				var op = new ED.Point(0, 0);
				op.setWithPolars(rs, startAngle);
				ctx.lineTo(op.x, op.y);

				//ctx.arc(0, 0, ro, startAngle, endAngle, false);
				var ip = new ED.Point(0, 0);
				ip.setWithPolars(ri, i * theta);
				ctx.lineTo(ip.x, ip.y);
			}
			ctx.lineTo(sp.x, sp.y);

			// Ring
			ctx.moveTo(ro, 0);
			ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

			// Set boundary path attributes
			ctx.lineWidth = 4;
			ctx.lineJoin = 'bevel';
			ctx.fillStyle = "rgba(200,200,200,0.75)";
			ctx.fill();
		}

		// Coronary cataracts
		if (this.coronary) {
			// Spot data
			var rc = 130;
			var sr = 10;
			var inc = Math.PI / 8;

			// Iterate through radius and angle to draw spots
			for (var a = 0; a < 2 * Math.PI; a += inc) {
				var p = new ED.Point(0, 0);
				p.setWithPolars(rc, a);
				this.drawCircle(ctx, p.x, p.y, sr, "rgba(200,200,255,1)", 4, "rgba(200,200,255,1)");
			}
		}

		// Anterior Polar
		if (this.anteriorPolar) {
			var rap = 30;
			ctx.beginPath();
			ctx.arc(0, 0, rap, 0, Math.PI * 2, false);
			ctx.fillStyle = "rgba(120,120,120,0.5)";
			ctx.strokeStyle = "gray";
			ctx.fill();
			ctx.stroke();
		}
		
		// Phacodonesis
		if (this.phakodonesis) {
			// Sine wave between arrow heads:
			//Set amplitude and width of the wave as well as sample rate
			var amplitude = 20;
			var width = 100;
			var srate = 1;

			//Draw sine wave
			ctx.beginPath();
			ctx.moveTo(-150,0);
			for (x=0; x<=300; x+= srate){
				ctx.lineTo(-150+x, amplitude*Math.sin(2*Math.PI*x/width));
			}

			// Set line attributes
			ctx.lineWidth = 4;
			ctx.strokeStyle = "blue";
			ctx.stroke();

			// Left arrow:
			ctx.beginPath();
			ctx.moveTo(-150,-20);
			ctx.lineTo(-225,0);
			ctx.lineTo(-150,20);

			// Set line attributes
			ctx.lineWidth = 4;
			ctx.fillStyle = "blue";
			ctx.fill();

			// Right arrow:
			ctx.beginPath();
			ctx.moveTo(150,-20);
			ctx.lineTo(225,0);
			ctx.lineTo(150,20);

			// Set line attributes
			ctx.lineWidth = 4;
			ctx.fillStyle = "blue";
			ctx.fill();
		}

	}

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
ED.Lens.prototype.description = function() {
	returnValue = "";
	
	if (this.originY < -30) {
		returnValue += 'Lens subluxation: superior';
	}
	else if (this.originY > 30) {
		returnValue += 'Lens subluxation: inferior';
	}
	if (this.nuclearGrade != 'None') {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += this.nuclearGrade + ' nuclear cataract';
	}
	if (this.corticalGrade != 'None') {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += this.corticalGrade + ' cortical cataract';
	}
	if (this.posteriorSubcapsularGrade != 'None') {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += this.posteriorSubcapsularGrade + ' posterior subcapsular cataract';
	}
	if (this.coronary) {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += 'Coronary cataract';
	}
	if (this.anteriorPolar) {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += 'Anterior polar cataract';
	}
	if (this.posteriorPolar) {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += 'Posterior polar cataract';
	}
	if (this.phakodonesis) {
		returnValue += returnValue.length > 0?", ":"";
		returnValue += 'Phacodonesis';
	}
	return returnValue;
};

ED.Lens.prototype.snomedCodes = function()
{
	snomedCodes = new Array();
    if (this.nuclearGrade != 'None') {
        snomedCodes.push([53889007, 3]);
    }
    if (this.corticalGrade != 'None') {
        snomedCodes.push([193576003, 3]);
    }
    if (this.posteriorSubcapsularGrade != 'None') {
        snomedCodes.push([34533008, 3]);
    }
    if (this.coronary) {
    	snomedCodes.push([12195004, 3]);
    }
    if (this.anteriorPolar) {
    	snomedCodes.push([253224008, 3]);
    }
    if (this.posteriorPolar) {
        snomedCodes.push([253225009, 3]);
    }
    if (this.phakodonesis) {
    	snomedCodes.push([116669003, 3]);
    }

    return snomedCodes;
};
