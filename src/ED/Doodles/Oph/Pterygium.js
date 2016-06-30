/**
 * Pterygium
 *
 * @class Pterygium
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Pterygium = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Pterygium";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Pterygium.prototype = new ED.Doodle;
ED.Pterygium.prototype.constructor = ED.Pterygium;
ED.Pterygium.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Pterygium.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Pterygium.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-450, +100);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI);
}

/**
 * Sets default parameters
 */
ED.Pterygium.prototype.setParameterDefaults = function() {
	this.apexY = -100;
	this.arc = 80 * Math.PI / 180;

	// Default to temporal quadrant
	this.setRotationWithDisplacements(90, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Pterygium.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);

	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952 / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

	// Connect across the bottom via the apex point
	var bp = +0.4;

	// Curve back to start via apex point
	ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
	ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200,200,200,0.5)";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
		// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Total number of vessels
		var v = 6;

		// Angular separation
		var phi = this.arc/v

		// Start and end points of vessel
		var sp = new ED.Point(0, 0);
		var ep = new ED.Point(0, 0);
		var ap = new ED.Point(this.apexX, this.apexY);

		// Path for vessels
		ctx.beginPath();

		// Radial vessels	
		for (var i = 0; i < v; i++) {
			var angle = Math.PI / 2 + phi/2 + arcEnd + i * phi;
			sp.setWithPolars(460, angle);
			
			// Go a proportion along line to apex Point
			var p = 0.8;
			ep.x = sp.x + p * (ap.x - sp.x);
			ep.y = sp.y + p * (ap.y - sp.y);
			ctx.moveTo(sp.x, sp.y);
			ctx.lineTo(ep.x, ep.y);
		}

		ctx.strokeStyle = "red";
		ctx.lineWidth = 8;
		
		ctx.stroke();
	}


	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
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
ED.Pterygium.prototype.description = function() {
	var returnString = "";

	// Size description
	if (this.arc < Math.PI / 4) returnString = "Small ";
	else returnString = "Large ";

	// U tear
	returnString += "Pterygium ";

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Pterygium.prototype.snomedCode = function() {
	return 77489003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Pterygium.prototype.diagnosticHierarchy = function() {
	return 4;
}
