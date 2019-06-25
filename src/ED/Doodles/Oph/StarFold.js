/**
 * Star fold of PVR
 *
 * @class StarFold
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.StarFold = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "StarFold";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'apexY', 'scaleX', 'scaleY', 'arc', 'rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.StarFold.prototype = new ED.Doodle;
ED.StarFold.prototype.constructor = ED.StarFold;
ED.StarFold.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.StarFold.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Doodle.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.StarFold.prototype.setPropertyDefaults = function() {
	this.isOrientated = true;
	this.isSqueezable = true;
	this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +250);
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
}

/**
 * Sets default parameters
 */
ED.StarFold.prototype.setParameterDefaults = function() {
	this.apexY = 50;

	// Example of x4 drawing in doodle space
	this.scaleX = 0.25;
	this.scaleY = 0.25;

	// Place at 6 o'clock
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var p = new ED.Point(doodle.originX, doodle.originY);

		var np = new ED.Point(0, 0);
		np.setWithPolars(p.length(), p.direction() + Math.PI / 6);

		this.move(np.x, np.y);
	} else {
		this.move(0, 400);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.StarFold.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.StarFold.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	ctx.moveTo(0, -this.apexY);
	ctx.bezierCurveTo(100, -50, 260, -240, 300, -200);
	ctx.bezierCurveTo(340, -160, 100, -100, 2 * this.apexY, 0);
	ctx.bezierCurveTo(100, 100, 340, 160, 300, 200);
	ctx.bezierCurveTo(260, 240, 100, 50, 0, this.apexY);
	ctx.bezierCurveTo(-100, 50, -260, 240, -300, 200);
	ctx.bezierCurveTo(-340, 160, -100, 100, -2 * this.apexY, 0);
	ctx.bezierCurveTo(-100, -100, -340, -160, -300, -200);
	ctx.bezierCurveTo(-260, -240, -100, -50, 0, -this.apexY);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "lightgreen";
	ctx.strokeStyle = "green";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Calculate arc for doodles with no natural arc setting
	this.arc = Math.atan2(600 * this.scaleX, Math.abs(this.originY));

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(-300, 200));
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
ED.StarFold.prototype.description = function() {
	var returnString = "Star fold at ";

	// Location (clockhours)
	returnString += this.clockHour() + " o'clock";

	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.StarFold.prototype.snomedCode = function() {
	return 232018006;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.StarFold.prototype.diagnosticHierarchy = function() {
	return 0;
}
