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
 * Posterior chamber ICL
 *
 * @class ICL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ICL = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ICL";
	
	// Derived parameters
	this.axis = "";
	
	// Other parameters
	this.model = "";
	this.lengthICL = "";
	this.sphere;
	this.cylinder;
	this.opticalAxis;
	
	// Saved parameters
	this.savedParameterArray = [
		'originX',
		'originY', 
		'scaleX', 
		'scaleY', 
		'rotation',
		'axis',
		'model',
		'lengthICL',
		'sphere',
		'cylinder',
		'opticalAxis'
		];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'model':'Model',
		'lengthICL':'Length (mm)',
		'sphere':'Sphere (D)',
		'cylinder':'Cylinder (D)',
		'opticalAxis':'Axis (deg)'
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ICL.prototype = new ED.Doodle;
ED.ICL.prototype.constructor = ED.ICL;
ED.ICL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ICL.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default properties
 */
ED.ICL.prototype.setPropertyDefaults = function() {
	//this.addAtBack = true;
	this.isUnique = true;
	this.isMoveable = false;

	// Adjust ranges for simple parameters
	this.parameterValidationArray['rotation']['range'] = new ED.Range(340 * Math.PI / 180, 20 * Math.PI/180);
	//this.parameterValidationArray['rotation']['range'] = new ED.Range(0.888 * Math.PI/180, 1.11 * Math.PI);
	
	// Derived parameters (NB cannot use numerical approach to this axis since 'double' range not currently handled in core)
	this.parameterValidationArray['axis'] = {
		kind: 'derived',
		type: 'string',
		list: [
			'160', '161', '162', '163', '164', '165', '166', '167', '168', '169',
			'170', '171', '172', '173', '174', '175', '176', '177', '178', '179', 
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
			'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
		animate: false
	};
	
	// Other parameters
	this.parameterValidationArray['model'] = {
		kind: 'other',
		type: 'string',
		list: ['v4C', 'v4B'],
		animate: false
	};
	this.parameterValidationArray['lengthICL'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(11, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['sphere'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(-23, +10),
		precision: 2,
		animate: false
	};
	this.parameterValidationArray['cylinder'] = {
		kind: 'other',
		type: 'float',
		range: new ED.Range(+0, +6),
		precision: 2,
		animate: false
	};
	this.parameterValidationArray['opticalAxis'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(+0, +180),
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.ICL.prototype.setParameterDefaults = function() {
	this.setParameterFromString('axis', '180');
	this.setParameterFromString('model', 'v4C');
	this.setParameterFromString('lengthICL', '12');
	this.setParameterFromString('sphere', '0.00');
	this.setParameterFromString('cylinder', '0.00');
	this.setParameterFromString('opticalAxis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.ICL.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'rotation':
			var axis = ((360 - 180 * _value / Math.PI) % 180).toFixed(0);
			if (axis == '180') axis = '0';
			returnArray['axis'] = axis;
			break;

// 		case 'axis':
// 			returnArray['rotation'] = (180 - parseFloat(_value)) * Math.PI / 180;
// 			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ICL.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ICL.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Radius (used here to set handle location)
	//var r = 280;
	var r = 170;
	
	// Optic
	ctx.moveTo(0, -218);
	ctx.bezierCurveTo(46, -217, 64, -203, 105, -201);
	ctx.bezierCurveTo(146, -199, 190, -190, 221, -190);
	ctx.bezierCurveTo(230, -190, 222, -198, 237, -197);
	ctx.bezierCurveTo(264, -196, 305, -207, 321, -176);
	ctx.bezierCurveTo(334, -149, 314, -143, 306, -118);
	ctx.bezierCurveTo(300, -60, 300, 60, 306, 118);
	ctx.bezierCurveTo(314, 143, 334, 149, 321, 176);
	ctx.bezierCurveTo(305, 207, 264, 196, 237, 197);
	ctx.bezierCurveTo(222, 198, 230, 190, 221, 190);
	ctx.bezierCurveTo(190, 190, 146, 199, 105, 201);
	ctx.bezierCurveTo(64, 203, 46, 217, 0, 218);
	ctx.bezierCurveTo(-46, 217, -64, 203, -105, 201)
	ctx.bezierCurveTo(-146, 199, -190, 190, -221, 190);
	ctx.bezierCurveTo(-230, 190, -222, 198, -237, 197);
	ctx.bezierCurveTo(-264, 196, -305, 207, -321, 176);
	ctx.bezierCurveTo(-334, 149, -314, 143, -306, 118);
	ctx.bezierCurveTo(-300, -60, -300, -60, -306, -118);
	ctx.bezierCurveTo(-314, -143, -334, -149, -321, -176);
	ctx.bezierCurveTo(-305, -207, -264, -196, -237, -197);
	ctx.bezierCurveTo(-222, -198, -230, -190, -221, -190);
	ctx.bezierCurveTo(-190, -190, -146, -199, -105, -201);
	ctx.bezierCurveTo(-64, -203, -46, -217, 0, -218);

	// Colour of fill is white but with transparency
	ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "darkgray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Curves near haptics
		ctx.beginPath();
		ctx.moveTo(-218, -192);
		ctx.bezierCurveTo(-228, -177, -279, -113, -279, 0);
		ctx.bezierCurveTo(-279, 113, -228, 177, -218, 192);
		ctx.moveTo(218, -192);
		ctx.bezierCurveTo(228, -177, 279, -113, 279, 0);
		ctx.bezierCurveTo(279, 113, 228, 177, 218, 192);
		ctx.stroke();
		
		// Central lenticule
		this.drawCircle(ctx, 0, 0, 170, "rgba(0,0,0,0)", 4, ctx.strokeStyle);
		
		// Spots
		this.drawCircle(ctx, -200, 0, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, 200, 0, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, -280, -160, 8, ctx.fillStyle, 4, ctx.strokeStyle);
		this.drawCircle(ctx, 280, 160, 8, ctx.fillStyle, 4, ctx.strokeStyle);
	}

	/*
	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	*/
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ICL.prototype.description = function() {
	var returnValue = "Implantable Collamer Lens";

	return returnValue;
}
