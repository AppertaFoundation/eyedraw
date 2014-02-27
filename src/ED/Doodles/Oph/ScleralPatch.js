/**
 * Scleral Patch
 *
 * @class ScleralPatch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ScleralPatch = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Patch";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ScleralPatch.prototype = new ED.Doodle;
ED.ScleralPatch.prototype.constructor = ED.ScleralPatch;
ED.ScleralPatch.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ScleralPatch.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.ScleralPatch.prototype.setPropertyDefaults = function() {
	//this.isOrientated = true;
	this.isSqueezable = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-20, +200);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -20);
}

/**
 * Sets default parameters
 */
ED.ScleralPatch.prototype.setParameterDefaults = function() {
    this.apexX = 50;
    this.apexY = -70;
    this.originY = -260;
    
    
    // Patchs are usually temporal
//    if(this.drawing.eye == ED.eye.Right)
//    {
//        this.originX = -260;
//        this.rotation = -Math.PI/4;
//    }
//    else
//    {
//        this.originX = 260;
//        this.rotation = Math.PI/4;
//    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ScleralPatch.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ScleralPatch.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    ctx.rect(-50, -50, 100, 100);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,50,0.5)";
    ctx.strokeStyle = "rgba(120,120,120,0.5)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

	}
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[3].location = this.transform.transformPoint(new ED.Point(50, -50));
    
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
ED.ScleralPatch.prototype.description = function() {
    return "Scleral patch";
}