/**
 * Giant retinal tear
 *
 * @class GRT
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.GRT = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "GRT";

	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.GRT.prototype = new ED.Doodle;
ED.GRT.prototype.constructor = ED.GRT;
ED.GRT.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.GRT.prototype.setHandles = function() {
	this.handleArray[1] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.GRT.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-450, -250);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 2, Math.PI * 2);
}

/**
 * Sets default parameters
 */
ED.GRT.prototype.setParameterDefaults = function() {
	this.arc = 90 * Math.PI / 180;
	this.apexY = -350;
	this.setRotationWithDisplacements(0, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.GRT.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);

	// Fit outer curve just inside ora (ro = outer radius, rt = tear radius, ri = operculum (inner) radius)
	var ro = 952 / 2;
	var ri = -this.apexY;
	var rt = ri + (ro - ri) / 2;

	// Calculate parameters for arcs. Theta is outer arc, phi is base of tear
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;
	var phi = this.arc / 2.3;
	var tearStart = -Math.PI / 2 + phi;
	var tearEnd = -Math.PI / 2 - phi;

	// Coordinates of corners of arc
	var topRightX = ro * Math.sin(theta);
	var topRightY = -ro * Math.cos(theta);
	var topLeftX = -ro * Math.sin(theta);
	var topLeftY = topRightY;
	var middleRightX = rt * Math.sin(phi);
	var middleRightY = -rt * Math.cos(phi);
	var middleLeftX = -middleRightX;
	var middleLeftY = middleRightY;
	var bottomRightX = ri * Math.sin(theta);
	var bottomRightY = -ri * Math.cos(theta);
	var bottomLeftX = -bottomRightX;
	var bottomLeftY = bottomRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Straight line to base of tear then to start of operculum
	ctx.lineTo(middleLeftX, middleLeftY);
	ctx.lineTo(bottomLeftX, bottomLeftY);

	// Another arc going the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Straight line to base of tear on this side
	ctx.lineTo(middleRightX, middleRightY);

	// Close path to join to starting point
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 8;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.arc(0, 0, rt, tearStart, tearEnd, true);
		ctx.strokeStyle = "darkred";
		ctx.stroke();
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Drawing.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Drawing.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Drawing.Point(this.apexX, this.apexY));

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
ED.GRT.prototype.description = function() {
	var returnString = "Giant Retinal Tear ";

	// Use trigonometry on rotation field to get clock hour of start (0.2618 is PI/12)
	var start = this.rotation - this.arc / 2;
	var clockHour = Math.floor((((start + 0.2618) * 6 / Math.PI) + 12) % 12);
	if (clockHour == 0) clockHour = 12;

	// Get extent of tear in degrees
	var extent = (this.arc * 180 / Math.PI);

	// Round to nearest 10
	extent = 10 * Math.floor((extent + 5) / 10);

	returnString = returnString + extent + " degrees clockwise from " + clockHour + " o'clock";

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.GRT.prototype.snomedCode = function() {
	return 232004004;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.GRT.prototype.diagnosticHierarchy = function() {
	return 7;
}
