/**
 * GraphAxes
 *
 * @class GraphAxes
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.GraphAxes = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "GraphAxes";

	// Call superclass constructor
ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.GraphAxes.prototype = new ED.Doodle;
ED.GraphAxes.prototype.constructor = ED.GraphAxes;
ED.GraphAxes.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.GraphAxes.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.GraphAxes.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.GraphAxes.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Axes
	var l = 400;
	ctx.moveTo(0, -l);
	ctx.lineTo(0, l);
	ctx.moveTo(-l, 0);
	ctx.lineTo(l, 0);
	ctx.moveTo(0, -l);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Axis markers
		ctx.beginPath();

		for (var y = -l; y <= l; y = y + 100) {
			if (y != 0) {
				ctx.moveTo(-20, y);
				ctx.lineTo(20, y);
			}
		}

		for (var x = -l; x <= l; x = x + 100) {
			if (x != 0) {
				ctx.moveTo(x, -20);
				ctx.lineTo(x, 20);
			}
		}

		ctx.stroke();

		// Labels
		ctx.font = "80px sans-serif";
		ctx.fillStyle = "gray";
		ctx.textAlign = 'center'
		ctx.fillText("+Sph", 0, -440);
		ctx.fillText("-Sph", 0, 480);
		ctx.fillText("+Cyl", 400, -40);
		ctx.fillText("-Cyl", -400, -40);
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}
