/**
 * Doodles are components of drawings which have built in knowledge of what they represent, and how to behave when manipulated;
 * Doodles are drawn in the 'doodle plane' consisting of 1001 pixel square grid with central origin (ie -500 to 500) and
 * are rendered in a canvas element using a combination of the affine transform of the host drawing, and the doodle's own transform.
 *
 * @class Doodle
 * @property {Drawing} drawing Drawing to which this doodle belongs
 * @property {Int} originX X coordinate of origin in doodle plane
 * @property {Int} originY Y coordinate of origin in doodle plane
 * @property {Float} radius of doodle from origin (used for some rotatable doodles that are fixed at origin)
 * @property {Int} apexX X coordinate of apex in doodle plane
 * @property {Int} apexY Y coordinate of apex in doodle plane
 * @property {Float} scaleX Scale of doodle along X axis
 * @property {Float} scaleY Scale of doodle along Y axis
 * @property {Float} arc Angle of arc for doodles that extend in a circular fashion
 * @property {Float} rotation Angle of rotation from 12 o'clock
 * @property {Int} order Order in which doodle is drawn (0 first ie backmost layer)
 * @property {Array} squiggleArray Array containing squiggles (freehand drawings)
 * @property {AffineTransform} transform Affine transform which handles the doodle's position, scale and rotation
 * @property {AffineTransform} inverseTransform The inverse of transform
 * @property {Bool} isLocked True if doodle is locked (temporarily unselectable)
 * @property {Bool} isSelectable True if doodle is non-selectable
 * @property {Bool} isShowHighlight True if doodle shows a highlight when selected
 * @property {Bool} willStaySelected True if selection persists on mouseup
 * @property {Bool} isDeletable True if doodle can be deleted
 * @property {Bool} isSaveable Flag indicating whether doodle will be included in saved JSON string
 * @property {Bool} isOrientated True if doodle should always point to the centre (default = false)
 * @property {Bool} isScaleable True if doodle can be scaled. If false, doodle increases its arc angle
 * @property {Bool} isSqueezable True if scaleX and scaleY can be independently modifed (ie no fixed aspect ratio)
 * @property {Bool} isMoveable True if doodle can be moved. When combined with isOrientated allows automatic rotation.
 * @property {Bool} isRotatable True if doodle can be rotated
 * @property {Bool} isDrawable True if doodle accepts freehand drawings
 * @property {Bool} isUnique True if only one doodle of this class allowed in a drawing
 * @property {Bool} isArcSymmetrical True if changing arc does not change rotation
 * @property {Bool} addAtBack True if new doodles are added to the back of the drawing (ie first in array)
 * @property {Bool} isPointInLine True if centre of all doodles with this property should be connected by a line segment
 * @property {Bool} snapToGrid True if doodle should snap to a grid in doodle plane
 * @property {Bool} snapToQuadrant True if doodle should snap to a specific position in quadrant (defined in subclass)
 * @property {Bool} snapToPoints True if doodle should snap to one of a set of specific points
 * @property {Bool} snapToAngles True if doodle should snap to one of a set of specific rotation values
 * @property {Array} pointsArray Array of points to snap to
 * @property {Array} anglesArray Array of angles to snap to
 * @property {Bool} willReport True if doodle responds to a report request (can be used to suppress reports when not needed)
 * @property {Bool} willSync Flag used to indicate whether doodle will synchronise with another doodle
 * @property {Float} radius Distance from centre of doodle space, calculated for doodles with isRotable true
 * @property {Bool} isSelected True if doodle is currently selected
 * @property {Bool} isBeingDragged Flag indicating doodle is being dragged
 * @property {Int} draggingHandleIndex index of handle being dragged
 * @property {Range} draggingHandleRing Inner or outer ring of dragging handle
 * @property {Bool} isClicked Hit test flag
 * @property {Enum} drawFunctionMode Mode for boundary path
 * @property {Bool} isFilled True if boundary path is filled as well as stroked
 * @property {Bool} showsToolTip Shows a tooltip if true
 * @property {Int} frameCounter Keeps track of how many animation frames have been drawn
 * @property {Array} handleArray Array containing handles to be rendered
 * @property {Point} leftExtremity Point at left most extremity of doodle (used to calculate arc)
 * @property {Point} rightExtremity Point at right most extremity of doodle (used to calculate arc)
 * @property {Int} gridSpacing Separation of grid elements
 * @property {Int} gridDisplacementX Displacement of grid matrix from origin along x axis
 * @property {Int} gridDisplacementY Displacement of grid matrix from origin along y axis
 * @property {Float} version Version of doodle
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 * @param {Int} _order
 */
ED.Doodle = function(_drawing, _parameterJSON) {
	// Function called as part of prototype assignment has no parameters passed
	if (typeof(_drawing) !== 'undefined') {
		// Drawing containing this doodle
		this.drawing = _drawing;

		// Unique ID of doodle within this drawing
		this.id = this.drawing.nextDoodleId();

		// Optional array of squiggles
		this.squiggleArray = new Array();

		// Transform used to draw doodle (includes additional transforms specific to the doodle)
		this.transform = new ED.AffineTransform();
		this.inverseTransform = new ED.AffineTransform();

		// Store created time
		this.createdTime = (new Date()).getTime();

		// Dragging defaults - set individual values in subclasses
		this.isLocked = false;
		this.isSelectable = true;
		this.isShowHighlight = true;
		this.willStaySelected = true;
		this.isDeletable = true;
		this.isSaveable = true;
		this.isOrientated = false;
		this.isScaleable = true;
		this.isSqueezable = false;
		this.isMoveable = true;
		this.isRotatable = true;
		this.isDrawable = false;
		this.isUnique = false;
		this.isArcSymmetrical = false;
		this.addAtBack = false;
		this.isPointInLine = false;
		this.snapToGrid = false;
		this.snapToQuadrant = false;
		this.snapToPoints = false;
		this.snapToAngles = false;
		this.snapToArc = false;
		this.willReport = true;
		this.willSync = true;

		// Calculate maximum range of origin:
		var halfWidth = Math.round(this.drawing.doodlePlaneWidth / 2);
		var halfHeight = Math.round(this.drawing.doodlePlaneHeight / 2);

		// Parameter validation array
		this.parameterValidationArray = {
			originX: {
				kind: 'simple',
				type: 'int',
				range: new ED.Range(-halfWidth, +halfWidth),
				defaultValue: +0,
				delta: 15
			},
			originY: {
				kind: 'simple',
				type: 'int',
				range: new ED.Range(-halfHeight, +halfHeight),
				defaultValue: +0,
				delta: 15
			},
			width: {
				kind: 'simple',
				type: 'int',
				range: new ED.Range(+100, +halfHeight),
				defaultValue: +50,
				delta: 15
			},
			height: {
				kind: 'simple',
				type: 'int',
				range: new ED.Range(+100, +halfWidth),
				defaultValue: +50,
				delta: 15
			},
			radius: {
				kind: 'simple',
				type: 'float',
				range: new ED.Range(+100, +450),
				precision: 6,
				defaultValue: +100,
				delta: 15
			},
			apexX: {
				kind: 'simple',
				type: 'int',
				defaultValue: +0,
				range: new ED.Range(-500, +500),
				delta: 15
			},
			apexY: {
				kind: 'simple',
				type: 'int',
				range: new ED.Range(-500, +500),
				defaultValue: +0,
				delta: 15
			},
			scaleX: {
				kind: 'simple',
				type: 'float',
				range: new ED.Range(+0.5, +4.0),
				precision: 6,
				defaultValue: +1,
				delta: 0.1
			},
			scaleY: {
				kind: 'simple',
				type: 'float',
				range: new ED.Range(+0.5, +4.0),
				precision: 6,
				defaultValue: +1,
				delta: 0.1
			},
			arc: {
				kind: 'simple',
				type: 'float',
				range: new ED.Range(Math.PI / 12, Math.PI * 2),
				precision: 6,
				defaultValue: Math.PI,
				delta: 0.1
			},
			rotation: {
				kind: 'simple',
				type: 'float',
				range: new ED.Range(0, 2 * Math.PI),
				precision: 6,
				defaultValue: +0,
				delta: 0.2
			},
		};

		// Optional array for saving non-bound parameters
		if (!this.savedParameterArray) {
			this.savedParameterArray = [];
		}

		// Optional array for parameters linked to elements in doodle control panel
		if (!this.controlParameterArray) {
			this.controlParameterArray = [];
		}

		// Optional array for saving details of object parameters for reconstitution from string
		if (!this.parameterObjectTypeArray) {
			this.parameterObjectTypeArray = [];
		}

		// Grid properties
		this.gridSpacing = 200;
		this.gridDisplacementX = 0;
		this.gridDisplacementY = 0;

		// Flags and other properties
		this.isBeingDragged = false;
		this.draggingHandleIndex = null;
		this.draggingHandleRing = null;
		this.isClicked = false;
		this.drawFunctionMode = ED.drawFunctionMode.Draw;
		this.isFilled = true;
		this.showsToolTip = true;
		this.derivedParametersArray = new Array(); // Array relating special parameters to corresponding common parameter
		this.animationFrameRate = 30; // Frames per second
		this.animationDataArray = new Array(); // Associative array, key = parameter name, value = array with animation info
		this.parentClass = ""; // Class of parent that a doodle is dependent on (parent auto-created)
		this.inFrontOfClassArray = new Array(); // Array of classes to put this doodle in front of (in order)

		// Array of points to snap to
		this.pointsArray = new Array();
		this.anglesArray = new Array();
		this.arcArray = new Array();
		this.quadrantPoint = new ED.Point(200, 200);

		// Bindings to HTML element values. Associative array with parameter name as key
		this.bindingArray = new Array();
		this.drawing.listenerArray[this.id] = new Array();

		// Array of 5 handles
		this.handleArray = new Array();
		this.handleArray[0] = new ED.Doodle.Handle(new ED.Point(-50, 50), false, ED.Mode.Scale, false);
		this.handleArray[1] = new ED.Doodle.Handle(new ED.Point(-50, -50), false, ED.Mode.Scale, false);
		this.handleArray[2] = new ED.Doodle.Handle(new ED.Point(50, -50), false, ED.Mode.Scale, false);
		this.handleArray[3] = new ED.Doodle.Handle(new ED.Point(50, 50), false, ED.Mode.Scale, false);
		this.handleArray[4] = new ED.Doodle.Handle(new ED.Point(this.apexX, this.apexY), false, ED.Mode.Apex, false);
		this.setHandles();

		// Extremities
		this.leftExtremity = new ED.Point(-100, -100);
		this.rightExtremity = new ED.Point(0, -100);

		// Version
		this.version = +1.1;

		// Set dragging default settings
		this.setPropertyDefaults();

		// Assign default values to simple parameters
		for (var parameter in this.parameterValidationArray) {
			var validation = this.parameterValidationArray[parameter];
			if (validation.kind == 'simple') {
				this[parameter] = validation.defaultValue;
			}
		}

		// New doodle (constructor called with _drawing parameter only)
		if (typeof(_parameterJSON) == 'undefined') {

			// Default is to put new doodle in front
			this.order = this.drawing.doodleArray.length;

			// Other initialisation
			this.setParameterDefaults();

			// Newly added doodles are selected
			this.isSelected = true;
		}
		// Doodle with passed parameters
		else {
			// Iterate array assigning values from passed array (arc and rotation are stored in degrees for legacy reasons)
			for (var p in _parameterJSON) {
				// Parameters arc and rotation are stored in degrees
				if (p == 'arc' || p == 'rotation') {
					this[p] = _parameterJSON[p] * Math.PI / 180;
				}
				// Squiggles
				else if (p == 'squiggleArray') {
					var squiggleArray = _parameterJSON[p];
					for (var j = 0; j < squiggleArray.length; j++) {
						// Get parameters and create squiggle
						var c = squiggleArray[j].colour;
						var colour = new ED.Colour(c.red, c.green, c.blue, c.alpha);
						var thickness = squiggleArray[j].thickness;
						var filled = squiggleArray[j].filled;
						var squiggle = new ED.Squiggle(this, colour, thickness, filled);

						// Add points to squiggle and complete it
						var pointsArray = squiggleArray[j].pointsArray;
						for (var k = 0; k < pointsArray.length; k++) {
							var point = new ED.Point(pointsArray[k].x, pointsArray[k].y);
							squiggle.addPoint(point);
						}
						squiggle.complete = true;

						// Add squiggle to doodle's squiggle array
						this.squiggleArray.push(squiggle);
					}
				}
				// Saved parameters (V1.3 method - keep for legacy data)
				else if (p == 'params') {
					for (var j = 0; j < _parameterJSON[p].length; j++) {
						var param_name = _parameterJSON[p][j].name;
						var param_value = _parameterJSON[p][j].value;
						this.setParameterFromString(param_name, param_value);
					}
				}
				// Other parameters
				else {
					// Complex objects (e.g. date)
					if (p in this.parameterObjectTypeArray) {
						this[p] = this.parseObjectString(_parameterJSON[p], this.parameterObjectTypeArray[p]);
					}
					// Other parameters are simple assignments
					else {
						this[p] = _parameterJSON[p];
					}
				}
			}

			// Set orientation if appropriate
			if (this.isOrientated) {
				this.rotation = this.orientation();
			}

			// Order
			this.order = +_parameterJSON['order'];

			// Update values of any derived parameters
			// 			for (var parameter in this.parameterValidationArray) {
			// 				var validation = this.parameterValidationArray[parameter];
			// 				if (validation.kind == 'simple') {
			// 					this.updateDependentParameters(parameter);
			// 				}
			// 			}
			for (var p in this.savedParameterArray) {
				this.updateDependentParameters(this.savedParameterArray[p]);
			}

			// Loaded doodles are not selected
			this.isSelected = false;
			this.isForDrawing = false;
		}
	}
}

/**
 * Parses JSON string to reconstitute parameters which are entries in this.parameterObjectTypeArray
 *
 * @param {String} _string String containing object from JSON string
 * @param {String} _type Type of object
 */
ED.Doodle.prototype.parseObjectString = function(_string, _type) {
	var returnObject = false;
	switch (_type) {
		case 'date':
			var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(_string);
			returnObject = new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
			break;

		default:
			ED.errorHandler('ED.Doodle', 'parseObjectString', 'Object type: ' + _type + ' currently not supported');
			break;
	}

	return returnObject;
}

/**
 * Sets default handle attributes (overridden by subclasses)
 */
ED.Doodle.prototype.setHandles = function() {}

/**
 * Sets default properties (overridden by subclasses)
 */
ED.Doodle.prototype.setPropertyDefaults = function() {}

/**
 * Sets default parameters (overridden by subclasses)
 */
ED.Doodle.prototype.setParameterDefaults = function() {}

/**
 * Sets position in array relative to other relevant doodles (overridden by subclasses)
 */
ED.Doodle.prototype.position = function() {}

/**
 * Called on attempt to delete doodle, and returns permission (overridden by subclasses)
 *
 * @returns {Bool} True if OK to delete
 */
ED.Doodle.prototype.willDelete = function() {
	return true;
}

/**
 * Moves doodle and adjusts rotation as appropriate
 *
 * @param {Float} _x Distance to move along x axis in doodle plane
 * @param {Float} _y Distance to move along y axis in doodle plane
 */
ED.Doodle.prototype.move = function(_x, _y) {

	// Ensure parameters are integers
	var x = Math.round(+_x);
	var y = Math.round(+_y);

	if (this.isMoveable) {
		// Enforce bounds
		var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX + x, this.scaleLevel);
		var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY + y, this.scaleLevel);

		// Move doodle to new position
		if (x != 0) this.setSimpleParameter('originX', newOriginX);
		if (y != 0) this.setSimpleParameter('originY', newOriginY);

		// Update dependencies
		this.updateDependentParameters('originX');
		this.updateDependentParameters('originY');

		// Only need to change rotation if doodle has moved
		if (x != 0 || y != 0) {
			// If doodle isOriented is true, rotate doodle around centre of canvas (eg makes 'U' tears point to centre)
			if (this.isOrientated) {

				// Alter orientation of doodle
				this.setSimpleParameter('rotation', this.orientation());

				// Update dependencies
				this.updateDependentParameters('rotation');
			}
		}

		// Notify (NB pass doodle in message array, since this is not necessarily selected)
		this.drawing.notify("doodleMoved", {
			doodle: this
		});
	}
}

/**
 * Calculates orientation based on x and y coordinates of doodle
 *
 * @returns {Float} Orientation in radians
 */
ED.Doodle.prototype.orientation = function() {
	// Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
	var canvasCentre = new ED.Point(0, 0);
	var canvasTop = new ED.Point(0, -100);

	// New position of doodle
	var newDoodleOrigin = new ED.Point(this.originX, this.originY);

	// Calculate angle to current position from centre relative to north
	return this.drawing.innerAngle(canvasTop, canvasCentre, newDoodleOrigin);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.draw = function(_point) {
	// Determine function mode
	if (typeof(_point) != 'undefined') {
		this.drawFunctionMode = ED.drawFunctionMode.HitTest;
	} else {
		this.drawFunctionMode = ED.drawFunctionMode.Draw;
	}

	// Get context
	var ctx = this.drawing.context;

	// Augment transform with properties of this doodle
	ctx.translate(this.originX, this.originY);
	ctx.rotate(this.rotation);
	ctx.scale(this.scaleX, this.scaleY);

	// Mirror with internal transform
	this.transform.setToTransform(this.drawing.transform);
	this.transform.translate(this.originX, this.originY);
	this.transform.rotate(this.rotation);
	this.transform.scale(this.scaleX, this.scaleY);

	// Update inverse transform
	this.inverseTransform = this.transform.createInverse();

	// Reset hit test flag
	this.isClicked = false;
}

/**
 * Draws selection handles and sets dragging mode which is determined by which handle and part of handle is selected
 * Function either performs a hit test or draws the handles depending on whether a valid Point object is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.drawHandles = function(_point) {
	// Reset handle index and selected ring
	if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
		this.draggingHandleIndex = null;
		this.draggingHandleRing = null;
	}

	// Get context
	var ctx = this.drawing.context;

	// Save context to stack
	ctx.save();

	// Reset context transform to identity matrix
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Dimensions and colour of handles
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "yellow";

	// Draw corner handles
	var arc = Math.PI * 2;

	for (var i = 0; i < this.handleArray.length; i++) {
		var handle = this.handleArray[i];

		if (handle.isVisible) {
			// Path for inner ring
			ctx.beginPath();
			ctx.arc(handle.location.x, handle.location.y, ED.handleRadius / 2, 0, arc, true);

			// Hit testing for inner ring
			if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
				if (ctx.isPointInPath(_point.x, _point.y)) {
					this.draggingHandleIndex = i;
					this.draggingHandleRing = ED.handleRing.Inner;
					this.drawing.mode = handle.mode;
					this.isClicked = true;
				}
			}

			// Path for optional outer ring
			if (this.isRotatable && handle.isRotatable) {
				ctx.moveTo(handle.location.x + ED.handleRadius, handle.location.y);
				ctx.arc(handle.location.x, handle.location.y, ED.handleRadius, 0, arc, true);

				// Hit testing for outer ring
				if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
					if (ctx.isPointInPath(_point.x, _point.y)) {
						this.draggingHandleIndex = i;
						if (this.draggingHandleRing == null) {
							this.draggingHandleRing = ED.handleRing.Outer;
							this.drawing.mode = ED.Mode.Rotate;
						}
						this.isClicked = true;
					}
				}
			}

			// Draw handles
			if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
				ctx.fill();
				ctx.stroke();
			}
		}
	}

	// Restore context
	ctx.restore();
}

/**
 * Draws the boundary path or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.drawBoundary = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// HitTest
	if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
		// Workaround for Mozilla bug 405300 https://bugzilla.mozilla.org/show_bug.cgi?id=405300
		if (ED.isFirefox()) {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			var hitTest = ctx.isPointInPath(_point.x, _point.y);
			ctx.restore();
		} else {
			var hitTest = ctx.isPointInPath(_point.x, _point.y);
		}

		if (hitTest) {
			// Set dragging mode
			if (this.isDrawable && this.isForDrawing) {
				this.drawing.mode = ED.Mode.Draw;
			} else {
				this.drawing.mode = ED.Mode.Move;
			}

			// Set flag indicating positive hit test
			this.isClicked = true;
		}
	}
	// Drawing
	else {
		// Specify highlight attributes
		if (this.isSelected && this.isShowHighlight) {
			ctx.shadowColor = "gray";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 20;
		}

		// Specify highlight attributes
		if (this.isForDrawing) {
			ctx.shadowColor = "blue";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 20;
		}

		// Fill path and draw it
		if (this.isFilled) {
			ctx.fill();
		}
		ctx.stroke();

		// Reset so shadow only on boundary
		ctx.shadowBlur = 0;

		// Draw any additional highlight items
		if (this.isSelected && this.isShowHighlight) {
			this.drawHighlightExtras();
		}
	}
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.Doodle.prototype.drawHighlightExtras = function() {
}

/**
 * Shows doodle parameter controls. Doodle must set display:true in parameterValidationArray
 *
 * @param {Bool} _flag Flag determining whether display is shown or not shown
 */
ED.Doodle.prototype.setDisplayOfParameterControls = function(_flag) {
	for (var parameter in this.parameterValidationArray) {
		var validation = this.parameterValidationArray[parameter];
		if (validation.display) {
			// Construct id of element
			var id = parameter + this.className + this.drawing.idSuffix;

			// Look for corresponding element and toggle display
			var element = document.getElementById(id);
			if (element) {
				// Get parent label
				var label = element.parentNode;
				if (_flag) {
					label.style.display = 'inline';
				} else {
					label.style.display = 'none';
				}

				// Ensure value of checkbox matches value of property
				element.checked = this[parameter];
			}
		}
	}
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Doodle.prototype.groupDescription = function() {
	return "";
}

/**
 * Runs when doodle is selected by the user
 */
// ED.Doodle.prototype.onSelection = function() {
// }

/**
 * Runs when doodle is deselected by the user
 */
// ED.Doodle.prototype.onDeselection = function() {
// }

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Doodle.prototype.description = function() {
	return "";
}

/**
 * Returns a String which, if not empty, determines the suffix following a group description
 *
 * @returns {String} Group description end
 */
ED.Doodle.prototype.groupDescriptionEnd = function() {
	return "";
}

/**
 * Returns a string containing a text description of the doodle. String taken from language specific ED_Tooltips.js
 *
 * @returns {String} Tool tip text
 */
ED.Doodle.prototype.tooltip = function() {
	var tip = ED.trans[this.className];
	if (typeof(tip) != 'undefined') {
		return tip;
	} else {
		return "";
	}
}

/**
 * Returns the SnoMed code of the doodle (overridden by subclasses)
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Doodle.prototype.snomedCode = function() {
	return 0;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest) (overridden by subclasses)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Doodle.prototype.diagnosticHierarchy = function() {
	return 0;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Doodle.prototype.dependentParameterValues = function(_parameter, _value) {
	return new Array();
}

/**
 * Updates dependent parameters
 *
 * @param {String} _parameter Name of parameter for which dependent parameters will be updated
 * @param {Boolean} _updateBindings Update the doodle form control bindings?
 */
ED.Doodle.prototype.updateDependentParameters = function(_parameter, _updateBindings) {
	// Retrieve list of dependent parameters and set them
	var valueArray = this.dependentParameterValues(_parameter, this[_parameter]);
	for (var parameter in valueArray) {
		this.setSimpleParameter(parameter, valueArray[parameter]);
	}

	// Update bindings
	if (_updateBindings || _updateBindings === undefined) {
		this.drawing.updateBindings(this);
	}
}

/**
 * Validates the value of a parameter, and returns it in appropriate format
 * If value is invalid, returns a constrained value or the original value
 * Called by event handlers of HTML elements
 *
 * @param {String} _parameter Name of the parameter
 * @param {Undefined} _value Value of the parameter to validate
 * @returns {Array} Array containing a bool indicating validity, and the correctly formatted value of the parameter
 */
ED.Doodle.prototype.validateParameter = function(_parameter, _value) {
	// Retrieve validation object for this doodle
	var validation = this.parameterValidationArray[_parameter];

	// Set return value;
	var value = "";

	if (validation) {
		// Validity flag
		var valid = false;

		// Enforce string type and trim it
		value = _value.toString().trim();

		switch (validation.type) {
			case 'string':

				// Check that its in list of valid values
				if (validation.list.indexOf(value) >= 0) {
					valid = true;
				}
				break;

			case 'float':

				// Test that value is a number
				if (ED.isNumeric(value)) {
					// Convert string to float value
					value = parseFloat(value);

					// Constrain value to allowable range
					value = validation.range.constrain(value);

					// Convert back to string, applying any formatting
					value = value.toFixed(validation.precision);

					valid = true;
				}
				break;

			case 'int':

				// Test that value is a number, and if not reset to current value of doodle
				if (ED.isNumeric(value)) {
					// Convert string to float value
					value = parseInt(value);

					// Constrain value to allowable range
					value = validation.range.constrain(value);

					// Convert back to string, applying any formatting
					value = value.toFixed(0);

					valid = true;
				}
				break;

			case 'mod':

				// Test that value is a number, and if not reset to current value of doodle
				if (ED.isNumeric(value)) {
					// Convert string to float value
					value = parseInt(value);

					// Constrain value to allowable range
					value = validation.range.constrain(value);

					// Deal with crossover
					if (validation.clock == 'top') {
						if (value == validation.range.min) value = validation.range.max;
					} else if (validation.clock == 'bottom') {
						if (value == validation.range.max) value = validation.range.min;
					}

					// Convert back to string, applying any formatting
					value = value.toFixed(0);

					valid = true;
				}
				break;

			case 'bool':

				// Event handler detects check box type and returns checked attribute
				if (_value == 'true' || _value == 'false') {
					// Convert to string for compatibility with setParameterFromString method
					value = _value;
					valid = true;
				}
				break;

			case 'colourString':
				// ***TODO*** Add some actual validation here
				valid = true;
				break;

			case 'freeText':
				// ***TODO*** Add some actual validation here
				valid = true;
				break;

			default:
				ED.errorHandler('ED.Drawing', 'eventHandler', 'Illegal validation type');
				break;
		}
	} else {
		ED.errorHandler('ED.Doodle', 'validateParameter', 'Unknown parameter name');
	}

	// If not valid, get current value of parameter
	if (!valid) {
		value = this.getParameter(_parameter);
		ED.errorHandler('ED.Doodle', 'validateParameter', 'Validation failure for parameter: ' + _parameter + ' with value: ' + _value);
	}

	// Return validity and value
	var returnArray = new Array();
	returnArray['valid'] = valid;
	returnArray['value'] = value;
	return returnArray;
}

/**
 * Generates a unique id for a control element bound to a parameter ***TODO*** improve this
 *
 * @param {String} _parameter Name of the parameter
 * @returns {String} ID for a control element
 */
ED.Doodle.prototype.parameterControlElementId = function(_parameter) {
	return this.drawing.canvas.id + '_' + _parameter + '_control';
}

/**
 * Runs when doodle is selected by the user
 */
ED.Doodle.prototype.onSelection = function() {
	// Show control bar
	if (this.drawing.showDoodleControls) {
		this.showDoodleControls();
	}
}

/**
 * Runs when doodle is deselected by the user
 */
ED.Doodle.prototype.onDeselection = function() {
	// Hide control bar
	if (this.drawing.showDoodleControls) {
		this.removeDoodleControls();
	}
}

/**
 * Creates an array of control elements
 * @return {Array}    The array of elements.
 */
ED.Doodle.prototype.getControlElements = function() {
	var elements = [];
	for (var parameter in this.controlParameterArray) {
		// Create element
		elements.push(
			this.parameterElement(parameter)
		);
	}
	return elements;
};

/**
 * Add bindings to the control elements.
 */
ED.Doodle.prototype.addControlBindings = function() {
	for (var parameter in this.controlParameterArray) {
		this.addBinding(parameter, {
			id: this.parameterControlElementId(parameter)
		});
	}
};

/**
 * Generate and append the control elements to the DOM.
 * @param  {HTMLElement} controlDiv The container element.
 */
ED.Doodle.prototype.showDoodleControls = function(controlDiv) {

	// Find the container element
	if (!controlDiv) {

		var id = this.drawing.canvas.id + '_' + 'controls';
		var controlDiv = document.getElementById(id);

		if (!controlDiv) {
			return ED.errorHandler('ED.Doodle', 'showDoodleControls', 'Unable to create doodle controls: element with id ' + id + ' does not exist');
		}
	}

	// Append controls to the container
	this.getControlElements().forEach(function(element) {
		controlDiv.appendChild(element);
	});
	// Add bindings
	this.addControlBindings();
};

/**
 * Remove controls elements.
 * @param  {HTMLElement} controlDiv The container element.
 */
ED.Doodle.prototype.removeDoodleControls = function(controlDiv) {

	// Find the container element
	if (!controlDiv) {
		var id = this.drawing.canvas.id + '_' + 'controls';
		var controlDiv = document.getElementById(id);

		if (!controlDiv) {
			return ED.errorHandler('ED.Doodle', 'removeDoodleControls', 'Unable to remove doodle controls: element with id ' + id + ' does not exist');
		}
	}

	// Remove all bindings
	for (var parameter in this.controlParameterArray) {
		this.removeBinding(parameter);
	}

	// Remove elements
	while(controlDiv.hasChildNodes()){
		controlDiv.removeChild(controlDiv.lastChild);
	}
};

/**
 * Creates an element for parameter in the doodle control bar
 *
 * @param {String} _parameter Name of the parameter
 * @returns {String} _id ID for a control element
 */
ED.Doodle.prototype.parameterElement = function(_parameter) {
	var element;
	switch (this.parameterValidationArray[_parameter].type) {
		case 'string':
			// Create a select element
			element = document.createElement('select');
			element.setAttribute('id', this.parameterControlElementId(_parameter));

			// Add options from validation array
			for (var i in this.parameterValidationArray[_parameter].list) {
				var option = document.createElement('option');
				option.innerText = this.parameterValidationArray[_parameter].list[i];
				//if (option.innerText == this[_parameter]) option.selected = true;
				element.appendChild(option);
			}
			break;

		case 'bool':
			// Create a checkbox element
			element = document.createElement('input');
    		element.type = 'checkbox';
    		element.setAttribute('id', this.parameterControlElementId(_parameter));
    		break;

		case 'colourString':
			// Create a colour picker
			element = document.createElement('select');
			element.setAttribute('id', this.parameterControlElementId(_parameter));

			// Add options from validation array
			for (var i in this.parameterValidationArray[_parameter].list) {
				var option = document.createElement('option');
				// Hack until colour picker worked out
				if (this.parameterValidationArray[_parameter].list[i] == "FF0000FF") {
					option.innerText = "Red";
				}
				else if (this.parameterValidationArray[_parameter].list[i] == "00FF00FF") {
					option.innerText = "Green";
				}
				else {
					option.innerText = "Blue";
				}
				option.value = this.parameterValidationArray[_parameter].list[i];
				element.appendChild(option);
			}
    		break;

		case 'freeText':
			// Create a text input element
			element = document.createElement('input');
    		element.type = 'text';
    		element.setAttribute('id', this.parameterControlElementId(_parameter));
    		break;

// 		case 'radio':
// 			// Create a radio button element
// 			element = document.createElement('input');
//     		element.type = 'checkbox';
//     		element.setAttribute('id', this.parameterControlElementId(_parameter));
//     		break;

		default:
			ED.errorHandler('ED.Doodle', 'parameterElement', 'Unexpected type: ' + this.parameterValidationArray[_parameter].type + ' for parameter: ' + _parameter);
			break;
	}

	// Create label  ***TODO*** deal with optional label and language
	var label = document.createElement('label');
	label.innerText = this.controlParameterArray[_parameter];
	label.setAttribute('for', this.parameterControlElementId(_parameter));

	// Wrap in div to allow display in vertical block
	var div = document.createElement('div');
	div.appendChild(label);
	div.appendChild(element);

	return div;
}

/**
 * Attempts to animate a change in value of a parameter
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 * @param {Boolean} _updateBindings Update the doodle form control bindings?
 */
ED.Doodle.prototype.setParameterWithAnimation = function(_parameter, _value, _updateBindings) {

	// Can doodle animate this parameter?
	if (this.parameterValidationArray[_parameter]['animate']) {
		var valueArray = this.dependentParameterValues(_parameter, _value);
		for (var parameter in valueArray) {
			// Read delta in units per frame
			var delta = this.parameterValidationArray[parameter]['delta'];

			// Calculate 'distance' to go
			var distance = valueArray[parameter] - this[parameter];

			// Calculate sign and apply to delta
			if (parameter == 'rotation') {
				// This formula works out correct distance and direction on a radians 'clock face' (ie the shortest way round)
				var sign = ((Math.PI - Math.abs(distance)) * distance) < 0 ? -1 : 1;
				distance = distance * sign;

				// Make distance positive
				if (distance < 0) distance += 2 * Math.PI;

				// Test for roughly half way
				if (distance > 3.141) {
					if (this.rotation < Math.PI) sign = -sign;
				}
			} else {
				var sign = distance < 0 ? -1 : 1;
			}
			delta = delta * sign;

			// Calculate number of frames to animate
			var frames = Math.abs(Math.floor(distance / delta));

			// Put results into an associative array for this parameter
			var array = {
				timer: null,
				delta: delta,
				frames: frames,
				frameCounter: 0
			};
			this.animationDataArray[parameter] = array;

			// Call animation method
			if (frames > 0) {
				this.increment(parameter, valueArray[parameter], _updateBindings);
			}
			// Increment may be too small to animate, but still needs setting
			else {
				// Set  parameter to exact value
				this.setSimpleParameter(parameter, valueArray[parameter]);

				// Update dependencies
				this.updateDependentParameters(parameter, _updateBindings);

				// Refresh drawing
				this.drawing.repaint();
			}
		}

	}
	// Otherwise just set it directly
	else {
		this.setParameterFromString(_parameter, _value.toString());
	}

	this.drawing.notify("setParameterWithAnimationComplete");
}

/**
 * Set the value of a doodle's parameter directly, and triggers a notification
 *
 * @param {String} _parameter Name of parameter
 * @param {Undefined} _value New value of parameter
 */
ED.Doodle.prototype.setSimpleParameter = function(_parameter, _value) {
	// Create notification message var messageArray = {eventName:_eventName, selectedDoodle:this.selectedDoodle, object:_object};
	var object = new Object;
	object.doodle = this;
	object.parameter = _parameter;
	object.value = _value;
	object.oldValue = this[_parameter];

	// Set parameter
	this[_parameter] = _value;

	// Trigger notification
	this.drawing.notify('parameterChanged', object);
}

/**
 * Set the value of a doodle's parameter from a string format following validation
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.setParameterFromString = function(_parameter, _value) {
	// Check type of passed value variable
	var type = typeof(_value);
	if (type != 'string') {
		ED.errorHandler('ED.Doodle', 'setParameterFromString', '_value parameter should be of type string, not ' + type);
	}

	// Retrieve validation object for this doodle
	var validation = this.parameterValidationArray[_parameter];

	if (validation) {
		// Set value according to type of parameter
		switch (validation.type) {
			case 'string':
				this[_parameter] = _value;
				break;

			case 'float':
				this[_parameter] = parseFloat(_value);
				break;

			case 'int':
				this[_parameter] = parseInt(_value);
				break;

			case 'mod':
				this[_parameter] = parseInt(_value);
				break;

			case 'bool':
				this[_parameter] = (_value == 'true');
				break;

			case 'colourString':
				this[_parameter] = _value;
				break;

			case 'freeText':
				this[_parameter] = _value;
				break;

			default:
				ED.errorHandler('ED.Doodle', 'setParameterFromString', 'Illegal validation type: ' + validation.type);
				break;
		}

		// Update dependencies
		this.updateDependentParameters(_parameter);

		// Update child dependencies of any derived parameters
		if (this.parameterValidationArray[_parameter]['kind'] == 'derived') {
			var valueArray = this.dependentParameterValues(_parameter, _value);
			for (var parameter in valueArray) {
				// Update dependencies
				this.updateDependentParameters(parameter);
			}
		}

		// Create notification message var messageArray = {eventName:_eventName, selectedDoodle:this.selectedDoodle, object:_object};
		var object = new Object;
		object.doodle = this;
		object.parameter = _parameter;
		object.value = _value;
		object.oldValue = this[_parameter];

		// Trigger notification
		this.drawing.notify('parameterChanged', object);
	} else {
		ED.errorHandler('ED.Doodle', 'setParameterFromString', 'No item in parameterValidationArray corresponding to parameter: ' + _parameter);
	}

	// Refresh drawing
	this.drawing.repaint();
}

/**
 * Set the value of a doodle's origin to avoid overlapping other doodles
 *
 * @param {String} _first Displacement of first doodle
 * @param {String} _next Displacement of subsequent doodles
 */
ED.Doodle.prototype.setOriginWithDisplacements = function(_first, _next) {
	this.originX = this.drawing.eye == ED.eye.Right ? -_first : _first;
	this.originY = -_first;

	// Get last doodle to be added
	if (this.addAtBack) {
		var doodle = this.drawing.firstDoodleOfClass(this.className);
	} else {
		var doodle = this.drawing.lastDoodleOfClass(this.className);
	}

	// If there is one, make position relative to it
	if (doodle) {
		var newOriginX = doodle.originX - _next;
		var newOriginY = doodle.originY - _next;

		this.originX = this.parameterValidationArray['originX']['range'].constrain(newOriginX);
		this.originY = this.parameterValidationArray['originY']['range'].constrain(newOriginY);
	}
}

/**
 * Set the value of a doodle's origin as if rotating
 *
 * @param {Int} _radius The radius of rotation
 * @param {Int} _first Rotation in degrees of first doodle anticlockwise right eye, clockwise left eye
 * @param {Int} _next Additional rotation of subsequent doodles
 */
ED.Doodle.prototype.setOriginWithRotations = function(_radius, _first, _next) {
	var direction = this.drawing.eye == ED.eye.Right ? -1 : 1;

	var origin = new ED.Point(0,0);
	origin.setWithPolars(_radius, direction * _first * Math.PI / 180);

	// Get last doodle to be added
	if (this.addAtBack) {
		var doodle = this.drawing.firstDoodleOfClass(this.className);
	} else {
		var doodle = this.drawing.lastDoodleOfClass(this.className);
	}

	// If there is one, make position relative to it
	if (doodle) {
		var doodleOrigin = new ED.Point(doodle.originX, doodle.originY);
		origin.setWithPolars(_radius, doodleOrigin.direction() + direction * _next * Math.PI / 180);
	}

	this.originX = origin.x;
	this.originY = origin.y;
}

/**
 * Set the value of a doodle's rotation to avoid overlapping other doodles
 *
 * @param {Int} _first Rotation in degrees of first doodle anticlockwise right eye, clockwise left eye
 * @param {Int} _next Additional rotation of subsequent doodles
 */
ED.Doodle.prototype.setRotationWithDisplacements = function(_first, _next) {
	var direction = this.drawing.eye == ED.eye.Right ? -1 : 1;
	var newRotation;

	// Get last doodle to be added
	if (this.addAtBack) {
		var doodle = this.drawing.firstDoodleOfClass(this.className);
	} else {
		var doodle = this.drawing.lastDoodleOfClass(this.className);
	}

	// If there is one, make rotation relative to it
	if (doodle) {
		newRotation = ((doodle.rotation * 180 / Math.PI + direction * _next + 360) % 360) * Math.PI / 180;
	} else {
		newRotation = ((direction * _first + 360) % 360) * Math.PI / 180;
	}

	this.rotation = this.parameterValidationArray['rotation']['range'].constrain(newRotation);
}

/**
 * Deselects doodle
 */
ED.Doodle.prototype.deselect = function() {
	// Deselect
	this.isSelected = false;
	this.drawing.selectedDoodle = null;

	// Refresh drawing
	this.drawing.repaint();
}

/**
 * Returns parameter values in validated string format
 *
 * @param {String} _parameter Name of parameter
 * @returns {String} Value of parameter
 */
ED.Doodle.prototype.getParameter = function(_parameter) {
	// Retrieve validation object for this doodle
	var validation = this.parameterValidationArray[_parameter];

	// Set return value;
	var value = "";

	if (validation) {
		switch (validation.type) {
			case 'string':
				value = this[_parameter];
				break;

			case 'float':
				// Convert to string, applying any formatting
				value = this[_parameter].toFixed(validation.precision);
				break;

			case 'int':
				// Convert to string, applying any formatting
				value = this[_parameter].toFixed(0);
				break;

			case 'mod':
				// Round to integer applying any formatting
				value = Math.round(this[_parameter]);

				// Deal with crossover
				if (validation.clock == 'top') {
					if (value == validation.range.min) value = validation.range.max;
				} else if (validation.clock == 'bottom') {
					if (value == validation.range.max) value = validation.range.min;
				}

				// Convert to string
				value = value.toFixed(0);
				break;

			case 'bool':
				value = this[_parameter].toString();
				break;

			case 'colourString':
				value = this[_parameter];
				break;

			case 'freeText':
				value = this[_parameter];
				break;

			default:
				ED.errorHandler('ED.Doodle', 'getParameter', 'Illegal validation type');
				break;
		}
	} else {
		ED.errorHandler('ED.Doodle', 'getParameter', 'No entry in parameterValidationArray corresponding to parameter: ' + _parameter);
	}

	// Return value
	return value;
}

/**
 * Uses a timeout to call itself and produce the animation
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 * @param {Boolean} _updateBindings Update the doodle form control bindings?
 */
ED.Doodle.prototype.increment = function(_parameter, _value, _updateBindings) {
	// Increment parameter and framecounter
	var currentValue = this[_parameter];
	this.animationDataArray[_parameter]['frameCounter']++;

	// Calculate interval between frames in milliseconds
	var interval = 1000 / this.animationFrameRate;

	// Complete or continue animation
	if (this.animationDataArray[_parameter]['frameCounter'] == this.animationDataArray[_parameter]['frames']) {
		// Set  parameter to exact value
		this.setSimpleParameter(_parameter, _value);

		// Update dependencies
		this.updateDependentParameters(_parameter, _updateBindings);

		// Stop timer
		clearTimeout(this.animationDataArray[_parameter]['timer']);
	} else {
		// Set parameter to new value
		this.setSimpleParameter(_parameter, currentValue + this.animationDataArray[_parameter]['delta']);

		// Update dependencies
		this.updateDependentParameters(_parameter, _updateBindings);

		// Start timer and set to call this function again after interval
		var doodle = this;
		this.animationDataArray[_parameter]['timer'] = setTimeout(function() {
			doodle.increment(_parameter, _value, _updateBindings);
		}, interval);
	}

	// Refresh drawing
	this.drawing.repaint();
}

/**
 * Adds a binding to the doodle. Only derived parameters can be bound
 *
 * @param {String} _parameter Name of parameter to be bound
 * @param {String} _fieldParameters Details of bound HTML element
 */
ED.Doodle.prototype.addBinding = function(_parameter, _fieldParameters) {
	var elementId = _fieldParameters['id'];
	var attribute = _fieldParameters['attribute'];

	// Check that doodle has a parameter of this name
	if (typeof(this[_parameter]) != 'undefined') {
		// Get reference to HTML element
		var element = document.getElementById(elementId);

		// Check element exists
		if (element != null) {
			// Add binding to array
			this.bindingArray[_parameter] = {
				'id': elementId,
				'attribute': attribute
			};

			// Attach onchange event of element with a function which calls the drawing event handler
			var drawing = this.drawing;
			var id = this.id;
			var className = this.className;
			var listener;

			// Set the parameter to the value of the element, and attach a listener
			switch (element.type) {
				case 'checkbox':
					if (attribute) {
						ED.errorHandler('ED.Doodle', 'addBinding', 'Binding to a checkbox with a non-standard attribute not yet supported');
					} else {
						// For parameters linked to an element with a saved value, set value to that of bound element
						if (this.savedParameterArray.indexOf(_parameter) < 0) {
							this.setParameterFromString(_parameter, element.checked.toString());
						}
						// Otherwise set element value to saved doodle parameter
						else {
							this.drawing.updateBindings(this);
						}
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.checked.toString());
						}, false);
					}
					break;

				case 'select-one':
					if (attribute) {
						if (element.selectedIndex > -1) {
							// For parameters linked to a saved value, set value to that of bound element
							if (this.savedParameterArray.indexOf(_parameter) < 0) {
								this.setParameterFromString(_parameter, element.options[element.selectedIndex].getAttribute(attribute));
							}
						}
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.options[this.selectedIndex].getAttribute(attribute));
						}, false);
					} else {
						// For parameters linked to an element with a saved value, set value to that of bound element
						if (this.savedParameterArray.indexOf(_parameter) < 0) {
							this.setParameterFromString(_parameter, element.value);
						}
						// Otherwise set element value to saved doodle parameter
						else {
							this.drawing.updateBindings(this);
						}
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.value);
						}, false);
					}
					break;

				case 'text':
					if (attribute) {
						ED.errorHandler('ED.Doodle', 'addBinding', 'Binding to a text field with a non-standard attribute not yet supported');
					} else {
						// For parameters linked to an element with a saved value, set value to that of bound element
						if (this.savedParameterArray.indexOf(_parameter) < 0) {
							this.setParameterFromString(_parameter, element.value);
						}
						// Otherwise set element value to saved doodle parameter
						else {
							this.drawing.updateBindings(this);
						}
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.value);
						}, false);
					}
					break;

				default:
					if (attribute) {
						this.setParameterFromString(_parameter, element.getAttribute(attribute));
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.getAttribute(attribute));
						}, false);
					} else {
						this.setParameterFromString(_parameter, element.value);
						element.addEventListener('change', listener = function(event) {
							drawing.eventHandler('onchange', id, className, this.id, this.value);
						}, false);
					}
					break;
			}

			// Add listener to array
			this.drawing.listenerArray[this.id][_parameter] = listener;
		} else {
			ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. DOM has no element with id: ' + elementId);
		}
	} else {
		ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. Doodle of class: ' + this.className + ' has no parameter of name: ' + _parameter);
	}
}

/**
 * Removes a binding from a doodle
 *
 * @param {String} _parameter Name of parameter whosse binding is to be removed
 */
ED.Doodle.prototype.removeBinding = function(_parameter) {
	// Get id of corresponding element
	var elementId;
	for (var parameter in this.bindingArray) {
		if (parameter == _parameter) {
			elementId = this.bindingArray[_parameter]['id'];
		}
	}

	// Remove entry in binding array
	delete this.bindingArray[_parameter];

	// Remove event listener
	var element = document.getElementById(elementId);
	element.removeEventListener('change', this.drawing.listenerArray[this.id][_parameter], false);

	// Remove entry in listener array
	delete this.drawing.listenerArray[this.id][_parameter];
}

/**
 * Returns the roation converted to clock hours
 *
 * @param {Int} _Offset Optional integer offset (1 to 11)
 * @returns {Int} Clock hour from 1 to 12
 */
ED.Doodle.prototype.clockHour = function(_offset) {
	var clockHour;
	var offset;

	if (typeof(_offset) != 'undefined') offset = _offset
	else offset = 0;

	if (this.isRotatable && !this.isMoveable) {
		clockHour = ((this.rotation * 6 / Math.PI) + 12 + offset) % 12;
	} else {
		var twelvePoint = new ED.Point(0, -100);
		var thisPoint = new ED.Point(this.originX, this.originY);
		var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6 / Math.PI) + 12 + offset) % 12;
	}

	clockHour = clockHour.toFixed(0);
	if (clockHour == 0) clockHour = 12;
	return clockHour
}

/**
 * Returns the quadrant of a doodle based on origin coordinates
 *
 * @returns {String} Description of quadrant
 */
ED.Doodle.prototype.quadrant = function() {
	var returnString = "";

	// Use trigonometry on rotation field to determine quadrant
	returnString += this.originY < 0 ? "supero" : "infero";
	if (this.drawing.eye == ED.eye.Right) {
		returnString += this.originX < 0 ? "temporal" : "nasal";
	} else {
		returnString += this.originX < 0 ? "nasal" : "temporal";
	}

	returnString += " quadrant";

	return returnString;
}

/**
 * Returns the rotation converted to degrees
 *
 * @returns {Int} Degrees from 0 to 360
 */
ED.Doodle.prototype.degrees = function() {
	var degrees;

	if (this.isRotatable && !this.isMoveable) {
		degrees = ((this.rotation * 180 / Math.PI) + 360) % 360;
	} else {
		var twelvePoint = new ED.Point(0, -100);
		var thisPoint = new ED.Point(this.originX, this.originY);
		degrees = ((twelvePoint.clockwiseAngleTo(thisPoint) * 180 / Math.PI) + 360) % 360;
	}

	degrees = degrees.toFixed(0);
	if (degrees == 0) degrees = 0;
	return degrees;
}

/**
 * Returns the extent converted to clock hours
 *
 * @returns {Int} Clock hour from 1 to 12
 */
ED.Doodle.prototype.clockHourExtent = function() {
	var clockHourStart;
	var clockHourEnd;

	if (this.isRotatable && !this.isMoveable) {
		clockHourStart = (((this.rotation - this.arc / 2) * 6 / Math.PI) + 12) % 12;
		clockHourEnd = (((this.rotation + this.arc / 2) * 6 / Math.PI) + 12) % 12;
	} else {
		var twelvePoint = new ED.Point(0, -100);
		var thisPoint = new ED.Point(this.originX, this.originY);
		var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6 / Math.PI) + 12) % 12;
	}

	clockHourStart = clockHourStart.toFixed(0);
	if (clockHourStart == 0) clockHourStart = 12;
	clockHourEnd = clockHourEnd.toFixed(0);
	if (clockHourEnd == 0) clockHourEnd = 12;
	return "from " + clockHourStart + " to " + clockHourEnd;
}

/**
 * Returns the extent converted to degrees
 *
 * @returns {Int} Extent 0 to 360 degrees
 */
ED.Doodle.prototype.degreesExtent = function() {
	var degrees = this.arc * 180 / Math.PI;
	var intDegrees = Math.round(degrees);
	return intDegrees;
}

/**
 * Returns the location relative to the disc
 *
 * @returns {String} Text description of location
 */
ED.Doodle.prototype.locationRelativeToDisc = function() {
	var locationString = "";

	// Right eye
	if (this.drawing.eye == ED.eye.Right) {
		if (this.originX > 180 && this.originX < 420 && this.originY > -120 && this.originY < 120) {
			locationString = "at the disc";
		} else {
			locationString += this.originY <= 0 ? "supero" : "infero";
			locationString += this.originX <= 300 ? "temporally" : "nasally";
		}
	}
	// Left eye
	else {
		if (this.originX < -180 && this.originX > -420 && this.originY > -120 && this.originY < 120) {
			locationString = "at the disc";
		} else {
			locationString += this.originY <= 0 ? "supero" : "infero";
			locationString += this.originX >= -300 ? "temporally" : "nasally";
		}
	}

	return locationString;
}

/**
 * Returns the location relative to the fovea
 *
 * @returns {String} Text description of location
 */
ED.Doodle.prototype.locationRelativeToFovea = function() {
	var locationString = "";

	// Right eye
	if (this.drawing.eye == ED.eye.Right) {
		if (this.originX > -10 && this.originX < 10 && this.originY > -10 && this.originY < 10) {
			locationString = "at the fovea";
		} else {
			locationString += this.originY <= 0 ? "supero" : "infero";
			locationString += this.originX <= 0 ? "temporal" : "nasal";
			locationString += " to the fovea";
		}
	}
	// Left eye
	else {
		if (this.originX > -10 && this.originX < 10 && this.originY > -10 && this.originY < 10) {
			locationString = "at the fovea";
		} else {
			locationString += this.originY <= 0 ? "supero" : "infero";
			locationString += this.originX >= 0 ? "temporally" : "nasally";
			locationString += " to the fovea";
		}
	}
	return locationString;
}

/**
 * Adds a new squiggle to the doodle's squiggle array
 */
ED.Doodle.prototype.addSquiggle = function() {
	// Get colour (stored as a HEX string in the doodle) and create colour object
	var colourObject = new ED.Colour(0, 0, 0, 1);
	colourObject.setWithHexString(this.colourString);

	// Line thickness
	var lineThickness;
	switch (this.thickness) {
		case "Thin":
			lineThickness = ED.squiggleWidth.Thin;
			break;
		case "Medium":
			lineThickness = ED.squiggleWidth.Medium;
			break;
		case "Thick":
			lineThickness = ED.squiggleWidth.Thick;
			break;
		default:
			lineThickness = ED.squiggleWidth.Thin;
			break;
	}

	// Create new squiggle
	var squiggle = new ED.Squiggle(this, colourObject, lineThickness, this.filled);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);
}


/**
 * Adds a point to the active squiggle (the last in the squiggle array)
 *
 * @param {Point} _point The point in the doodle plane to be added
 */
ED.Doodle.prototype.addPointToSquiggle = function(_point) {
	if (this.squiggleArray.length > 0) {
		var index = this.squiggleArray.length - 1;
		var squiggle = this.squiggleArray[index];

		squiggle.addPoint(_point);
	}
}

/**
 * Complete the active squiggle (last in the array)
 */
ED.Doodle.prototype.completeSquiggle = function() {
	if (this.squiggleArray.length > 0) {
		var index = this.squiggleArray.length - 1;
		var squiggle = this.squiggleArray[index];

		squiggle.complete = true;
	}
}

/**
 * Calculates arc for doodles without a natural arc value
 *
 * @returns Arc value in radians
 */
ED.Doodle.prototype.calculateArc = function() {
	// Transform extremity points to origin of 0,0
	var left = new ED.Point(this.leftExtremity.x - this.drawing.canvas.width / 2, this.leftExtremity.y - this.drawing.canvas.height / 2);
	var right = new ED.Point(this.rightExtremity.x - this.drawing.canvas.width / 2, this.rightExtremity.y - this.drawing.canvas.height / 2);

	// Return angle between them
	return left.clockwiseAngleTo(right);
}

/**
 * Finds the nearest point in the doodle pointsArray
 *
 * @param {ED.Point} _point The point to test
 * @returns {ED.Point} The nearest point
 */
ED.Doodle.prototype.nearestPointTo = function(_point) {
	// Check that pointsArray has content
	if (this.pointsArray.length > 0) {
		var min = 10000000; // Greater than square of maximum separation in doodle plane
		var index = 0;

		// Iterate through points array to find nearest point
		for (var i = 0; i < this.pointsArray.length; i++) {
			var p = this.pointsArray[i];
			var d = (_point.x - p.x) * (_point.x - p.x) + (_point.y - p.y) * (_point.y - p.y);

			if (d < min) {
				min = d;
				index = i;
			}
		}

		return this.pointsArray[index];
	}
	// Otherwise generate error and return passed point
	else {
		ED.errorHandler('ED.Doodle', 'nearestPointTo', 'Attempt to calculate nearest points with an empty points array');
		return _point;
	}
}

/**
 * Finds the nearest angle in the doodle anglesArray
 *
 * @param {Float} _angle The angle to test
 * @returns {Float} The nearest angle
 */
ED.Doodle.prototype.nearestAngleTo = function(_angle) {
	// Check that anglesArray has content
	if (this.anglesArray.length > 0) {
		var min = 2 * Math.PI; // Greater than one complete rotation
		var index = 0;

		// Iterate through angles array to find nearest point
		for (var i = 0; i < this.anglesArray.length; i++) {
			var p = this.anglesArray[i];

			var d = Math.abs(p - _angle);

			if (d < min) {
				min = d;
				index = i;
			}
		}

		return this.anglesArray[index];
	}
	// Otherwise generate error and return passed angle
	else {
		ED.errorHandler('ED.Doodle', 'nearestAngleTo', 'Attempt to calculate nearest angle with an empty angles array');
		return _angle;
	}
}

/**
 * Finds the nearest arc in the doodle arcArray
 *
 * @param {Float} _arc The angle to test
 * @returns {Float} The nearest angle
 */
ED.Doodle.prototype.nearestArcTo = function(_arc) {
	// Check that arcArray has content
	if (this.arcArray.length > 0) {
		var min = 2 * Math.PI; // Greater than one complete rotation
		var index = 0;

		// Iterate through angles array to find nearest point
		for (var i = 0; i < this.arcArray.length; i++) {
			var p = this.arcArray[i];

			var d = Math.abs(p - _arc);

			if (d < min) {
				min = d;
				index = i;
			}
		}

		return this.arcArray[index];
	}
	// Otherwise generate error and return passed arc
	else {
		ED.errorHandler('ED.Doodle', 'nearestArcTo', 'Attempt to calculate nearest arc with an empty arc array');
		return _arc;
	}
}

/**
 * Returns a doodle in JSON format
 *
 * @returns {String} A JSON encoded string representing the variable properties of the doodle
 */
ED.Doodle.prototype.json = function() {

	// Start of JSON string
	var s = '{';

	// Version and doodle subclass
	s = s + '"version":' + this.version.toFixed(1) + ',';
	s = s + '"subclass":' + '"' + this.className + '",';

	// Only save values of parameters specified in savedParameterArray
	if (typeof(this.savedParameterArray) != 'undefined') {
		if (this.savedParameterArray.length > 0) {
			for (var i = 0; i < this.savedParameterArray.length; i++) {
				var p = this.savedParameterArray[i];

				// Value to output
				var o = this[p];

				// Offset the scale.
				switch(p) {
					case 'scaleX':
					case 'scaleY':
					case 'originX':
					case 'originY':
						o *= (1 / this.scaleLevel);
					break;
				}

				// Special treatment according to parameter
				if (p == 'scaleX' || p == 'scaleY') {
					o = o.toFixed(2)
				} else if (p == 'arc' || p == 'rotation') {
					o = (o * 180 / Math.PI).toFixed(0);
				} else if (p == 'originX' || p == 'originY' || p == 'radius' || p == 'apexX' || p == 'apexY' || p == 'width' || p == 'height') {
					o = o.toFixed(0);
				} else if (typeof(o) == 'number') {
					o = o.toFixed(2);
				} else if (typeof(o) == 'string') {
					o = '"' + o + '"';
				} else if (typeof(o) == 'boolean') {
					o = o;
				} else if (typeof(o) == 'object') {
					o = JSON.stringify(o);
				} else {
					ED.errorHandler('ED.Doodle', 'json', 'Attempt to create json for an unhandled parameter type: ' + typeof(o));
					o = "ERROR";
				}

				// Construct json
				s = s + '"' + p + '":' + o + ',';
			}
		}
	}

	// Optional squiggle array
	if (this.squiggleArray.length > 0) {
		s = s + '"squiggleArray":[';
		for (var j = 0; j < this.squiggleArray.length; j++) {
			s = s + this.squiggleArray[j].json();
			if (this.squiggleArray.length - j > 1) {
				s = s + ',';
			}
		}
		s = s + '],';
	}

	// Order
	s = s + '"order":' + this.order.toFixed(0);

	// End of JSON
	s = s + '}';

	return s;
}

/**
 * Draws a circular spot with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _r Radius
 * @param {String} _colour String containing colour
 */
ED.Doodle.prototype.drawSpot = function(_ctx, _x, _y, _r, _colour) {
	_ctx.save();
	_ctx.beginPath();
	_ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
	_ctx.fillStyle = _colour;
	_ctx.strokeStyle = _colour;
	_ctx.lineWidth = 0;
	_ctx.fill();
	_ctx.stroke();
	_ctx.restore();
}

/**
 * Draws a circle with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _r Radius
 * @param {String} _fillColour String containing fill colour
 * @param {Int} _lineWidth Line width in pixels
 * @param {String} _strokeColour String containing stroke colour
 */
ED.Doodle.prototype.drawCircle = function(_ctx, _x, _y, _r, _fillColour, _lineWidth, _strokeColour) {
	_ctx.save();
	_ctx.beginPath();
	_ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
	_ctx.fillStyle = _fillColour;
	_ctx.fill();
	_ctx.lineWidth = _lineWidth;
	_ctx.strokeStyle = _strokeColour;
	_ctx.stroke();
	_ctx.restore();
}

/**
 * Draws a line with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x1 X-coordinate of origin
 * @param {Float} _y1 Y-coordinate of origin
 * @param {Float} _x2 X-coordinate of origin
 * @param {Float} _y2 Y-coordinate of origin
 * @param {Float} _w Width of line
 * @param {String} _colour String containing colour
 */
ED.Doodle.prototype.drawLine = function(_ctx, _x1, _y1, _x2, _y2, _w, _colour) {
	_ctx.save();
	_ctx.beginPath();
	_ctx.moveTo(_x1, _y1);
	_ctx.lineTo(_x2, _y2);
	_ctx.lineWidth = _w;
	_ctx.strokeStyle = _colour;
	_ctx.stroke();
	_ctx.restore();
}

/**
 * Draws a laser spot
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 */
ED.Doodle.prototype.drawLaserSpot = function(_ctx, _x, _y) {
	this.drawCircle(_ctx, _x, _y, 15, "Yellow", 10, "rgba(255, 128, 0, 1)");
}

/**
 * Draws a haemorrhage orientated to be parallel to nerve fibre layer
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 */
ED.Doodle.prototype.drawNFLHaem = function(_ctx, _x, _y) {
	// Parameters
	var r = 10;

	// Create point from parameters
	var p = new ED.Point(_x, _y);

	// Create two new points 'tangential'
	var phi1 = p.direction() + Math.PI/2;
	var phi2 = p.direction() + 3 * Math.PI/2;
	var p1 = new ED.Point(0,0);
	p1.setWithPolars(r, phi1);
	var p2 = new ED.Point(0,0);
	p2.setWithPolars(r, phi2);

	// Draw line
	_ctx.beginPath();
	_ctx.moveTo(_x + p1.x, _y + p1.y);
	_ctx.lineTo(_x + p2.x, _y + p2.y);

	_ctx.lineWidth = 16;
	_ctx.lineCap = 'round';
	_ctx.strokeStyle = "rgba(255,0,0,0.5)";

	_ctx.stroke();
}

/**
 * Adds an ellipse to a path
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _w Width
 * @param {Float} _h Height
 */
ED.Doodle.prototype.addEllipseToPath = function(_ctx, _x, _y, _w, _h) {
  var kappa = 0.5522848;
  var ox = (_w / 2) * kappa;
  var oy = (_h / 2) * kappa;

  _ctx.moveTo(-_w/2, 0);
  _ctx.bezierCurveTo(_x - _w/2, _y - oy, _x - ox, _y - _h/2, _x, _y - _h/2);
  _ctx.bezierCurveTo(_x + ox, _y - _h/2, _x + _w/2, _y - oy, _x + _w/2, _y);
  _ctx.bezierCurveTo(_x + _w/2, _y + oy, _x + ox, _y + _h/2, _x, _y + _h/2);
  _ctx.bezierCurveTo(_x - ox, _y + _h/2, _x - _w/2, _y + oy, _x - _w/2, _y);
}

/**
 * Returns the x coordinate of a point given its y and the radius
 *
 * @param {Float} _r Radius to point
 * @param {Float} _y y coordinate of point
 * @returns {Float} x coordinate of point
 */
ED.Doodle.prototype.xForY = function(_r, _y) {
	return Math.sqrt(_r * _r - _y * _y);
};

/**
 * Set the scale level.
 * @param {Number} _level The scaling level.
 */
ED.Doodle.prototype.setScaleLevel = function(_newLevel) {

	var diff = _newLevel;
	if (_newLevel > this.scaleLevel) {
		diff /= this.scaleLevel;
	}

	this.adjustScaleAndPosition(diff);
	this.scaleLevel = _newLevel;
};

ED.Doodle.prototype.adjustScaleAndPosition = function(amount){
	this.scaleX *= amount;
	this.scaleY *= amount;
	this.originX *= amount;
	this.originY *= amount;
};

/**
 * Outputs doodle information to the console
 */
ED.Doodle.prototype.debug = function() {
	console.log('org: ' + this.originX + " : " + this.originY);
	console.log('apx: ' + this.apexX + " : " + this.apexY);
	console.log('rot: ' + this.rotation * 180 / Math.PI);
	console.log('arc: ' + this.arc * 180 / Math.PI);
}

/**
 * Represents a control handle on the doodle
 *
 * @class Handle
 * @property {Point} location Location in doodle plane
 * @property {Bool} isVisible Flag indicating whether handle should be shown
 * @property {Enum} mode The drawing mode that selection of the handle triggers
 * @property {Bool} isRotatable Flag indicating whether the handle shows an outer ring used for rotation
 * @param {Point} _location
 * @param {Bool} _isVisible
 * @param {Enum} _mode
 * @param {Bool} _isRotatable
 */
ED.Doodle.Handle = function(_location, _isVisible, _mode, _isRotatable) {
	// Properties
	if (_location == null) {
		this.location = new ED.Point(0, 0);
	} else {
		this.location = _location;
	}
	this.isVisible = _isVisible;
	this.mode = _mode;
	this.isRotatable = _isRotatable;
};