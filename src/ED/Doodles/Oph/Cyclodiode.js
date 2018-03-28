/**
 * Cyclodiode
 *
 * @class Cyclodiode
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Cyclodiode = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Cyclodiode";

	// Other parameters
	this.circumferenceDeg = 360;
	this.avoidHorizontals = false;

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation', 'avoidHorizontals', 'circumferenceDeg'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'circumferenceDeg':"Circumference (deg)", 'avoidHorizontals':'Avoid horizontals'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Cyclodiode.prototype = new ED.Doodle;
ED.Cyclodiode.prototype.constructor = ED.Cyclodiode;
ED.Cyclodiode.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Cyclodiode.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.Cyclodiode.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, 2 * Math.PI);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
	this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);

	// Add complete validation arrays for other parameters
	this.parameterValidationArray['avoidHorizontals'] = {
		kind: 'other',
		type: 'bool',
		animate: false
	};
	this.parameterValidationArray['circumferenceDeg'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 360),
		precision: 1,
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.Cyclodiode.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 2 * Math.PI;

	// Make a subsequent one 90 degress to last one of same class
	this.setRotationWithDisplacements(135, -90);

	// Match subsequent properties
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.arc = doodle.arc;
	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Cyclodiode.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'circumferenceDeg':
			returnArray['arc'] = _value / 180 * Math.PI;
			break;
			
		case 'arc':
			returnArray['circumferenceDeg'] = Math.round(_value * 180 / Math.PI);
			break;

	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cyclodiode.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Cyclodiode.superclass.draw.call(this, _point);

	// Radii
	var ro = 495;
	var ri = 420;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

	// Close path
	ctx.closePath();

	// Colour of fill
	ctx.fillStyle = "rgba(218,230,241,0)";

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line
	ctx.strokeStyle = "rgba(218,230,241,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Centre point of spot
		var sp = new ED.Point(0, 0);

		//ctx.beginPath();

		// Spots
		var phi  = (2*Math.PI)/30; // radians for 1 spot
		var noSpots = this.arc / phi;
		for (var i = 0; i < noSpots; i++) {
			var theta = Math.PI / 2 + arcEnd + i * phi;
			sp.setWithPolars(r, theta);
			this.drawSpot(ctx, sp.x, sp.y, 20, "red");
		}
		
		// Horizontals (if avoided)
		if (this.avoidHorizontals) {
			
			// save current context
			ctx.save();
			
			// reverse doodle's rotation so horizontals correct in canvas plane
			ctx.rotate(-this.rotation);
			
			// begin path
			ctx.beginPath();
			
			// draw white square to mask dots underneath
			ctx.fillStyle = "white";
			ctx.fillRect(ri,-50,ro-ri-6,100);
			ctx.fillRect(-ro,-50,ro-ri-6,100);
			ctx.closePath();
			
			// line styles
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.lineWidth = "20";
			ctx.lineCap="round";
						
			// draw arrow pointing down
			ctx.moveTo(ro-5,-35);
			ctx.lineTo(ri+(ro-ri)/2,-15);
			ctx.lineTo(ri+5,-35);
			
			// draw arrow pointing up
			ctx.moveTo(ro-5,+35);
			ctx.lineTo(ri+(ro-ri)/2,+15);
			ctx.lineTo(ri+5,+35);
			
			// draw arrow pointing down
			ctx.moveTo(-ro+5,-35);
			ctx.lineTo(-(ri+(ro-ri)/2),-15);
			ctx.lineTo(-ri-5,-35);
			
			// draw arrow pointing up
			ctx.moveTo(-ro+5,+35);
			ctx.lineTo(-(ri+(ro-ri)/2),+15);
			ctx.lineTo(-ri-5,+35);
			
			ctx.stroke();
			ctx.closePath();
						
			// restore doodle context 
			ctx.restore();
						
			// calculate if 2 horizontal points lie in path & draw
			
		}
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

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
ED.Cyclodiode.prototype.groupDescription = function() {
	var returnString = "Cyclodiode " + this.circumferenceDeg + " degrees";
	if (this.avoidHorizontals) returnString += " avoiding the horizontals";

	// Unless nearly complete, include quadrant
/*
	if (this.arc < 1.8 * Math.PI) {
		returnString += " centred "

		// Use trigonometry on rotation field to determine quadrant
		returnString += (Math.cos(this.rotation) > 0 ? "supero" : "infero");
		returnString += (Math.sin(this.rotation) > 0 ? (this.drawing.eye == ED.eye.Right ? "nasally" : "temporally") : (this.drawing.eye == ED.eye.Right ? "temporally" : "nasally"));
	}
*/
	return returnString
}
