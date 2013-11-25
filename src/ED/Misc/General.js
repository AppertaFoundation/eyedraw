

/**
 *	Mouse test - used for testing detection of mouse pointer
 *
 * @class  MouseTest
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MouseTest = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MouseTest";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MouseTest.prototype = new ED.Doodle;
ED.MouseTest.prototype.constructor = ED.MouseTest;
ED.MouseTest.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.MouseTest.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MouseTest.prototype.draw = function(_point) {
	//if (_point) console.log(_point.x, _point.y);

	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MouseTest.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Square
	var width = 200;
	ctx.rect(-width / 2, -width / 2, width, width);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "white"
	ctx.strokeStyle = "blue";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	if (this.isClicked) console.log(_point.x, _point.y);

	// Non boundary paths here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Return value indicating successful hittest
	return this.isClicked;
}
