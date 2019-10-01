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
	
	this.plane = 0;
	
	// Saved parameters
	this.savedParameterArray = ['apexY', 'arc', 'rotation','injection','stockersLine'];
	
	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'injection':'Injection',
		'stockersLine':"Stocker's line"
	};

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
	
	this.handleArray[5] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	this.handleArray[6] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.Pterygium.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isUnique = false;
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray.injection = {
		kind: 'derived',
		type: 'string',
		list: ['+', '++', '+++'],
		animate: true
	};
	this.parameterValidationArray.stockersLine = {
		kind: 'derived',
		type: 'bool',
		display: true
	};

	// Update component of validation array for simple parameters
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
	this.parameterValidationArray['apexY']['range'].setMinAndMax(-360, +100);
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI);
	this.parameterValidationArray['rotation']['range'].setMinAndMax(0, 2*Math.PI);
}

/**
 * Sets default parameters
 */
ED.Pterygium.prototype.setParameterDefaults = function() {
	this.apexY = -120;
	this.arc = 60 * Math.PI / 180;

	// Default to temporal quadrant
    this.setRotationWithDisplacements(270, 180);
	if (this.rotation>Math.PI) this.rotation = 1.5*Math.PI;
	
	this.setParameterFromString('injection', '+');
	this.setParameterFromString('stockersLine', 'false');
	
	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at  points around circumference
	var point = new ED.Point(-80, -170);
	this.squiggleArray[0].pointsArray[5] = point;
	point = new ED.Point(80, -170);
	this.squiggleArray[0].pointsArray[6] = point;

}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @param {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Pterygium.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = {},
		returnValue;

	switch (_parameter) {
		
		// insure handles y coodinate set distance away from apex
		case 'apexY':
			this.squiggleArray[0].pointsArray[5].y = _value - 50;
			this.squiggleArray[0].pointsArray[6].y = _value - 50;
			break;
			
		// constrain handles to only move in the X plane
		case 'handles':
			this.squiggleArray[0].pointsArray[this.draggingHandleIndex].y = this.apexY - 50;
			break;
	}

	return returnArray;
};


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
	var r = 470;

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

	// Bezier curves between handles, back to start point at bottom
	ctx.bezierCurveTo(topLeftX - 0.7*(topLeftX - this.squiggleArray[0].pointsArray[5].x), topLeftY, this.squiggleArray[0].pointsArray[5].x,this.squiggleArray[0].pointsArray[5].y, this.squiggleArray[0].pointsArray[5].x,this.squiggleArray[0].pointsArray[5].y);
	ctx.bezierCurveTo(this.squiggleArray[0].pointsArray[5].x, this.apexY, this.apexX, this.apexY, this.apexX, this.apexY);
	ctx.bezierCurveTo(this.apexX, this.apexY, this.squiggleArray[0].pointsArray[6].x, this.apexY, this.squiggleArray[0].pointsArray[6].x,this.squiggleArray[0].pointsArray[6].y);
	ctx.bezierCurveTo(this.squiggleArray[0].pointsArray[6].x,this.squiggleArray[0].pointsArray[6].y, topRightX - 0.7*(topRightX - this.squiggleArray[0].pointsArray[6].x), topRightY, topRightX, topRightY);


	// Set line attributes
	ctx.lineWidth = 4;
	
	switch (this.injection) {
		case '+':
			ctx.fillStyle = "rgba(255, 204, 204, 0.7)";
			break;
		case '++':
			ctx.fillStyle = "rgba(255, 153, 153, 0.7)";
			break;
		case '+++':
			ctx.fillStyle = "rgba(255, 102, 102, 0.7)";
			break;
	}
	
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
		// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Draw Stocker's line
		if (this.stockersLine) {
			ctx.beginPath();
			ctx.moveTo(this.squiggleArray[0].pointsArray[5].x - 20,this.squiggleArray[0].pointsArray[5].y + 20);
			ctx.bezierCurveTo(this.squiggleArray[0].pointsArray[5].x, this.apexY + 20, this.apexX, this.apexY + 20, this.apexX, this.apexY + 20);
			ctx.bezierCurveTo(this.apexX, this.apexY + 20, this.squiggleArray[0].pointsArray[6].x, this.apexY + 20, this.squiggleArray[0].pointsArray[6].x + 20,this.squiggleArray[0].pointsArray[6].y  + 20);
			ctx.strokeStyle = "brown";
			ctx.lineWidth = 8;
			ctx.stroke();
		}
		
		// Draw vessels
		var v = 6;
		var phi = this.arc/v;
		var lX = Math.abs(this.squiggleArray[0].pointsArray[5].x - this.squiggleArray[0].pointsArray[6].x);
		var xDif = lX/(v+1);

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
			ep.x = this.squiggleArray[0].pointsArray[5].x + xDif*(i+1);
// 			ep.x = sp.x + p * (ap.x - sp.x);
			ep.y = sp.y + p * (ap.y - sp.y);
			ctx.moveTo(sp.x, sp.y);
			ctx.bezierCurveTo(ep.x-0.7*(ep.x-sp.x), sp.y, ep.x, ep.y, ep.x, ep.y);
		}

		ctx.strokeStyle = "rgba(255,0,0,0.6)";
		switch (this.injection) {
		case '+':
			ctx.lineWidth = 4;
			break;
		case '++':
			ctx.lineWidth = 6;
			break;
		case '+++':
			ctx.lineWidth = 8;
			break;
	}
		
		ctx.stroke();
	}


	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));	
	this.handleArray[5].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[5]);
	this.handleArray[6].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[6]);

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
	
	// calculate distance between apex and visual axis
	var n = Math.sqrt((this.apexX*this.apexX) + (this.apexY*this.apexY));
	n = (n / 380 * 6).toFixed(2);
	
	var returnString = "";
	
	// If injection+++, then injected
	if (this.injection == "+++") returnString += "injected ";

	// Temrporal / nasal
	if (this.rotation>=0 && this.rotation< Math.PI) {
		if (this.drawing.eye == ED.eye.Right) returnString += "nasal ";
		else returnString += "temporal ";
	}
	else {
		if (this.drawing.eye == ED.eye.Right) returnString += "temporal ";
		else returnString += "nasal ";
	}
	
	returnString += "pterygium within " + n + "mm of visual axis";

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
	return 0;
}
