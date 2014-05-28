/**
 * Dialysis
 *
 * @class Dialysis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Dialysis = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Dialysis";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Dialysis.prototype = new ED.Doodle;
ED.Dialysis.prototype.constructor = ED.Dialysis;
ED.Dialysis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Dialysis.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Dialysis.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-450, -250);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI);
}

/**
 * Sets default parameters
 */
ED.Dialysis.prototype.setParameterDefaults = function() {
	this.apexY = -350;
	this.arc = 60 * Math.PI / 180;

	// Default to inferoremporal quadrant
	this.setRotationWithDisplacements(140, 60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Dialysis.prototype.draw = function(_point) {
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
	var bp = +0.6;

	// Curve back to start via apex point
	ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
	ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);

	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

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
ED.Dialysis.prototype.description = function() {
	var returnString = "";

	// Size description
	if (this.arc < Math.PI / 4) returnString = "Small ";
	else returnString = "Large ";

	// U tear
	returnString += "dialysis ";

	// Location (clockhours)
	returnString += this.clockHour() + " o'clock";

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Dialysis.prototype.snomedCode = function() {
	return 232003005;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Dialysis.prototype.diagnosticHierarchy = function() {
	return 4;
}
