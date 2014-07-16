/**
 * @fileOverview Contains the core classes for EyeDraw
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 1.2
 *
 * Modification date: 28th March 2012
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

var ED = ED || {};

/**
 * A Drawing consists of one canvas element displaying one or more doodles;
 * Doodles are drawn in the 'doodle plane' consisting of a (nominal) 1001 pixel square grid -500 to 500) with central origin, and negative Y upwards
 * Affine transforms are used to convert points in the doodle plane to the canvas plane, the plane of the canvas element;
 * Each doodle contains additional transforms to handle individual position, rotation, and scale.
 *
 * @class Drawing
 * @property {Canvas} canvas A canvas element used to edit and display the drawing
 * @property {Eye} eye Right or left eye (some doodles display differently according to side)
 * @property {Bool} isEditable Flag indicating whether canvas is editable or not
 * @property {Context} context The 2d context of the canvas element
 * @property {Array} doodleArray Array of doodles in the drawing
 * @property {AffineTransform} transform Transform converts doodle plane -> canvas plane
 * @property {AffineTransform} inverseTransform Inverse transform converts canvas plane -> doodle plane
 * @property {Doodle} selectedDoodle The currently selected doodle, null if no selection
 * @property {Bool} mouseDown Flag indicating whether mouse is down in canvas
 * @property {Mode} mode The current mouse dragging mode
 * @property {Point} lastMousePosition Last position of mouse in canvas coordinates
 * @property {Image} image Optional background image
 * @property {Int} doubleClickMilliSeconds Duration of double click
 * @property {Bool} newPointOnClick Flag indicating whether a mouse click will create a new PointInLine doodle
 * @property {Bool} completeLine Flag indicating whether to draw an additional line to the first PointInLine doodle
 * @property {Float} scale Scaling of transformation from canvas to doodle planes, preserving aspect ratio and maximising doodle plnae
 * @property {Float} globalScaleFactor Factor used to scale all added doodles to this drawing, defaults to 1
 * @property {Int} scrollValue Current value of scrollFactor
 * @property {Int} lastDoodleId id of last doodle to be added
 * @property {Bool} isActive Flag indicating that the mouse is interacting with the drawing
 * @property {Bool} isNew Flag indicating that the drawing is new (false after doodles loaded from an input string)
 * @property {Bool} isReady Flag indicating that the drawing has finished loading (set by widget controller)
 * @property {Bool} showDoodleControls Flag indicating whether doodles should display controls when selected
 * @property {Float} scaleOn Options for setting scale to either width or height
 * @param {Canvas} _canvas Canvas element
 * @param {Eye} _eye Right or left eye
 * @param {String} _idSuffix String suffix to identify HTML elements related to this drawing
 * @param {Bool} _isEditable Flag indicating whether canvas is editable or not
 * @param {Array} _options Associative array of optional parameters
 */

ED.Drawing = function(_canvas, _eye, _idSuffix, _isEditable, _options) {

	// Check we're working with an actual canvas HTML element.
	if (!_canvas || !(_canvas instanceof HTMLCanvasElement)) {
		ED.errorHandler('ED.Drawing', 'constructor', 'Invalid canvas element');
		return;
	}

	// Defaults for optional parameters
	var offsetX = 0;
	var offsetY = 0;
	var toImage = false;
	var globalScaleFactor = 1;
	var toggleScaleFactor = 0;

	this.graphicsPath = 'assets/img';
	this.scaleOn = 'height';

	// If optional parameters exist, use them instead
	if (typeof(_options) != 'undefined') {
		if (_options['offsetX']) offsetX = _options['offsetX'];
		if (_options['offsetY']) offsetY = _options['offsetY'];
		if (_options['toImage']) toImage = _options['toImage'];
		if (_options['graphicsPath']) this.graphicsPath = _options['graphicsPath'];
		if (_options['scaleOn']) this.scaleOn = _options['scaleOn'];
		if (_options['scale']) globalScaleFactor = _options['scale'];
		if (_options['toggleScale']) toggleScaleFactor = _options['toggleScale'];
	}

	// Initialise properties
	this.drawingName = _options.drawingName;
	this.canvas = _canvas;
	this.eye = _eye;
	this.idSuffix = _idSuffix;
	this.isEditable = _isEditable;
	this.hoverTimer = null;
	this.convertToImage = (toImage && !this.isEditable) ? true : false;
	this.context = this.canvas.getContext('2d');
	this.doodleArray = new Array();
	this.bindingArray = new Array();
	this.listenerArray = new Array();
	this.transform = new ED.AffineTransform();
	this.inverseTransform = new ED.AffineTransform();
	this.selectedDoodle = null;
	this.mouseDown = false;
	this.doubleClick = false;
	this.mode = ED.Mode.None;
	this.lastMousePosition = new ED.Point(0, 0);
	this.doubleClickMilliSeconds = 250;
	this.readyNotificationSent = false;
	this.newPointOnClick = false;
	this.completeLine = false;
	this.globalScaleFactor = globalScaleFactor;
	this.toggleScaleFactor = toggleScaleFactor;
	this.origScaleLevel = globalScaleFactor;
	this.scrollValue = 0;
	this.lastDoodleId = 0;
	this.isActive = false;
	this.isNew = true;
	this.isReady = false;
	this.showDoodleControls = false;

	// Freehand drawing properties NB from November 2013 moved to Freehand doodle
// 	this.squiggleColour = new ED.Colour(0, 255, 0, 1);
// 	this.squiggleWidth = ED.squiggleWidth.Medium;
// 	this.squiggleStyle = ED.squiggleStyle.Outline;

	// Put settings into display canvas
// 	this.refreshSquiggleSettings();

	// Associative array of bound element no doodle values (ie value associated with deleted doodle)
	this.boundElementDeleteValueArray = new Array();

	// Grab the canvas parent element
	this.canvasParent = this.canvas.parentElement;

	// Array of objects requesting notifications
	this.notificationArray = new Array();

	// Optional tooltip (this property will be null if a span element with this id not found
	this.canvasTooltip = document.getElementById(this.canvas.id + 'Tooltip');

	// Make sure doodle plane fits within canvas (Height priority)
	if (this.scaleOn == 'height') {
		this.scale = this.canvas.height / 1001;
	} else {
		this.scale = this.canvas.width / 1001;
	}

	// Calculate dimensions of doodle plane
	this.doodlePlaneWidth = this.canvas.width / this.scale;
	this.doodlePlaneHeight = this.canvas.height / this.scale;

	// Array of images to be preloaded
	this.imageArray = new Array();
	this.imageArray['LatticePattern'] = new Image();
	this.imageArray['CribriformPattern'] = new Image();
	this.imageArray['CribriformPatternSmall'] = new Image();
	this.imageArray['CryoPattern'] = new Image();
	this.imageArray['AntPVRPattern'] = new Image();
	this.imageArray['LaserPattern'] = new Image();
	this.imageArray['FuchsPattern'] = new Image();
	this.imageArray['PSCPattern'] = new Image();
	this.imageArray['MeshworkPatternLight'] = new Image();
	this.imageArray['MeshworkPatternMedium'] = new Image();
	this.imageArray['MeshworkPatternHeavy'] = new Image();
	this.imageArray['NewVesselPattern'] = new Image();
	this.imageArray['OedemaPattern'] = new Image();
	this.imageArray['OedemaPatternBullous'] = new Image();
	this.imageArray['BrownSpotPattern'] = new Image();

	// Set transform to map from doodle to canvas plane
	this.transform.translate(this.canvas.width / 2, this.canvas.height / 2);
	this.transform.scale(this.scale, this.scale);

	// Set inverse transform to map the other way
	this.inverseTransform = this.transform.createInverse();

	// Initialise canvas context transform by calling clear() method
	this.clear();

	// Selection rectangle
	this.selectionRectangleIsBeingDragged = false;
	this.selectionRectangleStart = new ED.Point(0, 0);
	this.selectionRectangleEnd = new ED.Point(0, 0);

	// Add event listeners (NB within the event listener 'this' refers to the canvas, NOT the drawing instance)
	if (this.isEditable) {
		var drawing = this;

		// Mouse listeners
		this.canvas.addEventListener('mousedown', function(e) {
			var position = ED.findPosition(this, e);
			var point = new ED.Point(position.x, position.y);
			drawing.mousedown(point);
		}, false);

		this.canvas.addEventListener('mouseup', function(e) {
			var position = ED.findPosition(this, e);
			var point = new ED.Point(position.x, position.y);
			drawing.mouseup(point);
		}, false);

		this.canvas.addEventListener('mousemove', function(e) {
			var position = ED.findPosition(this, e);
			var point = new ED.Point(position.x, position.y);
			drawing.mousemove(point);
		}, false);

		this.canvas.addEventListener('mouseover', function(e) {
			var position = ED.findPosition(this, e);
			var point = new ED.Point(position.x, position.y);
			drawing.mouseover(point);
		}, false);

		this.canvas.addEventListener('mouseout', function(e) {
			var position = ED.findPosition(this, e);
			var point = new ED.Point(position.x, position.y);
			drawing.mouseout(point);
		}, false);

		document.body.addEventListener('mousedown', function onBodyMouseDown(e) {

			// Deselect all doodles if the user clicks anywhere on the page that is
			// not the canvas itself, nor the doodle popup, nor any toolbar buttons.

			var elem = e.target;
			var isEyeDrawElement = false;

			var ignore = '(' + [
				'ed-doodle-popup',
				'ed-button',
				'ed-canvas',
				'ed-selected-doodle-select'
			].join(')|(') + ')';

			do {
				isEyeDrawElement = new RegExp(ignore).test(elem.className);
			} while (
				(elem = elem.parentNode) && (elem !== document.body) && (!isEyeDrawElement)
			);

			if (!isEyeDrawElement) {
				drawing.deselectDoodles();
			}
		}, false);

		//        this.canvas.addEventListener('mousewheel', function(e) {
		//                                     e.preventDefault();
		//                                     drawing.selectNextDoodle(e.wheelDelta);
		//                                     }, false);

		// iOS listeners
    this.canvas.addEventListener('touchstart', function(e) {
      if (e.targetTouches[0] !== undefined) {
        var canvas_pos = drawing.getPositionOfElement(drawing.canvas);
        var point = new ED.Point(e.targetTouches[0].pageX - canvas_pos[0] - this.offsetLeft, e.targetTouches[0].pageY - canvas_pos[1]);
        e.preventDefault();
      } else {
        ED.errorHandler('ED.Drawing', 'Class', 'Touches undefined: ');
      }
      drawing.mousedown(point);
    }, false);

    this.canvas.addEventListener('touchend', function(e) {
      if (e.targetTouches[0] !== undefined) {
        var canvas_pos = drawing.getPositionOfElement(drawing.canvas);
        var point = new ED.Point(e.targetTouches[0].pageX - canvas_pos[0] - this.offsetLeft, e.targetTouches[0].pageY - canvas_pos[1]);
        drawing.mouseup(point);
      }
    }, false);

    this.canvas.addEventListener('touchmove', function(e) {
      if (e.targetTouches[0] !== undefined) {
        var canvas_pos = drawing.getPositionOfElement(drawing.canvas);
        var point = new ED.Point(e.targetTouches[0].pageX - canvas_pos[0] - this.offsetLeft, e.targetTouches[0].pageY - canvas_pos[1]);
        drawing.mousemove(point);
      }
    }, false);

		// Keyboard listener
		window.addEventListener('keydown', function(e) {
			if (document.activeElement === _canvas) drawing.keydown(e);
		}, true);

		// Stop browser stealing double click to select text
		this.canvas.onselectstart = function() {
			return false;
		}
	}
}

ED.Drawing.prototype.getPositionOfElement = function(element) {
    var x=0;
    var y=0;
    while(true){
        x += element.offsetLeft;
        y += element.offsetTop;
        if(element.offsetParent === null){
            break;
        }
        element = element.offsetParent;
    }
    return [x, y];
}

/**
 * Carries out initialisation of drawing (called after a controller has been instantiated to ensure notification)
 */
ED.Drawing.prototype.init = function() {
	// Start loading of texture images (will send ready notification when ready)
	/* FIXME */
	this.preLoadImagesFrom(this.graphicsPath + '/' + 'patterns/');
}

/**
 * Replaces the canvas element inline with a PNG image, useful for printing
 */
ED.Drawing.prototype.replaceWithImage = function() {
	// Create a new image element
	var img = document.createElement("img");

	// Base64 encoded PNG version of the canvas element
	img.setAttribute('src', this.canvas.toDataURL('image/png'));

	// Removes canvas and hidden input element (+ any other children) as they will be replaced with an image
	if (this.canvasParent.hasChildNodes()) {
		while (this.canvasParent.childNodes.length >= 1) {
			this.canvasParent.removeChild(this.canvasParent.firstChild);
		}
	}

	this.canvasParent.appendChild(img);
}

/**
 * Preloads image files
 *
 * @param {String} Relative path to directory where images are stored
 */
ED.Drawing.prototype.preLoadImagesFrom = function(_path) {
	var drawing = this;
	var ready = false;

	// Iterate through array loading each image, calling checking function from onload event
	for (var key in this.imageArray) {
		// This line picked up by javadoc toolkit - @ignore does not work
		this.imageArray[key].onload = function() {
			drawing.checkAllLoaded();
		}

		// Error handling
		this.imageArray[key].onerror = (function(key){
			return function() {
				ED.errorHandler('ED.Drawing', 'preLoadImagesFrom', 'Error loading image file "' + key + '.gif" from directory: "' + _path + '"');
			}
		}(key));

		// Attempt to load image file
		this.imageArray[key].src = _path + key + '.gif';
	}
}

/**
 * Checks all images are loaded then sends a notification
 */
ED.Drawing.prototype.checkAllLoaded = function() {
	// Set flag to check loading
	var allLoaded = true;

	// Iterate through array loading each image, checking all are loaded
	for (var key in this.imageArray) {
		var imageLoaded = false;
		if (this.imageArray[key].width > 0) imageLoaded = true;

		// Check all are loaded
		allLoaded = allLoaded && imageLoaded;
	}

	// If all are loaded, send notification
	if (allLoaded) {
		if (!this.readyNotificationSent) {
			//this.onready();
			this.readyNotificationSent = true;

			// Notify
			this.notify("ready");
		}
	}
}

/**
 * Registers an object to receive notifications
 *
 * @param {Object} _object The object requesting notification
 * @param {String} _methodName The method in the receiving object which is called for a notification. Defaults to 'notificationHandler'
 * @param {Array} _notificationList Array of strings listing the notifications the object is interested in. If empty, receives all.
 */
ED.Drawing.prototype.registerForNotifications = function(_object, _methodName, _notificationList) {

	// Put in default values for optional parameters
	if (typeof(_methodName) == 'undefined') {
		_methodName = 'notificationHandler';
	}
	if (typeof(_notificationList) == 'undefined') {
		_notificationList = new Array();
	}

	// Add object and details to notification array
	this.notificationArray.push({
		object: _object,
		methodName: _methodName,
		notificationList: _notificationList
	});
}

/**
 * Unregisters an object for notifications  ***TODO*** Need method of identifying objects for this to work
 *
 * @param {object} _object The object requesting notification
 */
ED.Drawing.prototype.unRegisterForNotifications = function(_object) {
	// Get index of object in array
	var index = this.notificationArray.indexOf(_object);

	// If its there, remove it
	if (index >= 0) {
		this.notificationArray.splice(index, 1);
	}
}

/**
 * Send notifications to all registered objects
 *
 * @param {String} _eventName Name of event
 * @param {Object} _object An optional object which may accompany an event containing additional information
 */
ED.Drawing.prototype.notify = function(_eventName, _object) {
	//console.log("Notifying for event: " + _eventName);

	// Create array containing useful information
	var messageArray = {
		eventName: _eventName,
		selectedDoodle: this.selectedDoodle,
		object: _object
	};

	// console.log(this.notificationArray);
	//


	// Call method on each registered object
	for (var i = 0; i < this.notificationArray.length; i++) {

		// Assign to variables to make code easier to read
		var list = this.notificationArray[i]['notificationList'];
		var object = this.notificationArray[i]['object'];
		var methodName = this.notificationArray[i]['methodName'];

		// console.log(_eventName);

		// Check that event is in notification list for this object, or array is empty implying all notifications
		if (list.length == 0 || list.indexOf(_eventName) >= 0) {
			// Check method exists
			if (typeof(object[methodName]) != 'undefined') {
				// Call registered object using specified method, and passing message array
				object[methodName].apply(object, [messageArray]);
			} else {
				ED.errorHandler('ED.Drawing', 'notify', 'Attempt to call undefined notification handler method');
			}
		}
	}
}

/**
 * Loads doodles from an HTML element
 *
 * @param {string} _id Id of HTML input element containing JSON data
 */
ED.Drawing.prototype.loadDoodles = function(_id) {
	// Get element containing JSON string
	var sourceElement = document.getElementById(_id);

	// If it exists and contains something, load it
	if (sourceElement && sourceElement.value.length > 0) {
		var doodleSet = window.JSON.parse(sourceElement.value);
		this.load(doodleSet);

		// Set isNew flag
		this.isNew = false;

		// Notify
		this.notify("doodlesLoaded");
	}
}

/**
 * Loads doodles from passed set in JSON format into doodleArray
 *
 * @param {Set} _doodleSet Set of doodles from server
 */
ED.Drawing.prototype.load = function(_doodleSet) {
	// Iterate through set of doodles and load into doodle array
	for (var i = 0; i < _doodleSet.length; i++) {
		// Check that class definition exists, otherwise skip it
		if (ED[_doodleSet[i].subclass] === undefined) {
			ED.errorHandler('ED.Drawing', 'load', 'Unrecognised doodle: ' + _doodleSet[i].subclass);
			break;
		}

		// Instantiate a new doodle object with parameters from doodle set
		this.doodleArray[i] = new ED[_doodleSet[i].subclass](this, _doodleSet[i]);
		this.doodleArray[i].id = i;
	}

	// Sort array by order (puts back doodle first)
	this.doodleArray.sort(function(a, b) {
		return a.order - b.order
	});
}

/**
 * Creates string containing drawing data in JSON format with surrounding square brackets
 *
 * @returns {String} Serialized data in JSON format with surrounding square brackets
 */
ED.Drawing.prototype.save = function() {
	// Store current data in textArea
	return '[' + this.json() + ']';
}

/**
 * Creates string containing drawing data in JSON format
 *
 * @returns {String} Serialized data in JSON format
 */
ED.Drawing.prototype.json = function() {
	var s = "";

	// Go through each member of doodle array, encoding it
	for (var i = 0; i < this.doodleArray.length; i++) {
		var doodle = this.doodleArray[i];
		if (doodle.isSaveable) {
			s = s + doodle.json() + ",";
		}
	}

	// Remove last comma
	s = s.substring(0, s.length - 1);

	return s;
}

/**
 * Draws all doodles for this drawing
 */
ED.Drawing.prototype.drawAllDoodles = function() {
	// Draw any connecting lines
	var ctx = this.context;
	ctx.beginPath();
	var started = false;
	var startPoint;

	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].isPointInLine) {
			// Start or draw line
			if (!started) {
				ctx.moveTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
				started = true;
				startPoint = new ED.Point(this.doodleArray[i].originX, this.doodleArray[i].originY);
			} else {
				ctx.lineTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
			}
		}
	}

	// Optionally add line to start
	if (this.completeLine && typeof(startPoint) != 'undefined') {
		ctx.lineTo(startPoint.x, startPoint.y);
	}

	// Draw lines
	if (started) {
		ctx.lineWidth = 4;
		ctx.strokeStyle = "rgba(20,20,20,1)";
		ctx.stroke();
	}

	// Draw doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		// Save context (draw method of each doodle may alter it)
		this.context.save();

		// Draw doodle
		this.doodleArray[i].draw();

		// Restore context
		this.context.restore();
	}
}

/**
 * Responds to mouse down event in canvas, cycles through doodles from front to back.
 * Selected doodle is first selectable doodle to have click within boundary path.
 * Double clicking on a selected doodle promotes it to drawing mode (if is drawable)
 *
 * @event
 * @param {Point} _point Coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mousedown = function(_point) {
	// Set flag to indicate dragging can now take place
	this.mouseDown = true;

	// Detect double click
	if (ED.recentClick) this.doubleClick = true;
	ED.recentClick = true;
	var t = setTimeout("ED.recentClick = false;", this.doubleClickMilliSeconds);

	// Set flags
	var found = false;
	this.lastSelectedDoodle = this.selectedDoodle;
	this.selectedDoodle = null;

	// Cycle through doodles from front to back doing hit test
	for (var i = this.doodleArray.length - 1; i > -1; i--) {
		if (!found) {
			// Save context (draw method of each doodle may alter it)
			this.context.save();

			// Successful hit test?
			if (this.doodleArray[i].draw(_point)) {
				if (this.doodleArray[i].isSelectable) {
					// If double clicked, go into drawing mode
					if (this.doubleClick && this.doodleArray[i].isSelected && this.doodleArray[i].isDrawable) {
						this.doodleArray[i].isForDrawing = true;
					}

					found = true;
					this.selectDoodle(this.doodleArray[i]);

					// If for drawing, mouse down starts a new squiggle
					if (!this.doubleClick && this.doodleArray[i].isForDrawing) {
						// Add new squiggle
						this.doodleArray[i].addSquiggle();
					}
				}
			}
			// Ensure that unselected doodles are marked as such
			else {
				this.doodleArray[i].isSelected = false;
				this.doodleArray[i].isForDrawing = false;
			}

			// Restore context
			this.context.restore();
		} else {
			this.doodleArray[i].isSelected = false;
			this.doodleArray[i].isForDrawing = false;
		}

		// Ensure drag flagged is off for each doodle
		this.doodleArray[i].isBeingDragged = false;
	}

	// If no doodles selected, run onDeselection code for last doodle
	if (!this.selectedDoodle) {
		if (this.lastSelectedDoodle) this.lastSelectedDoodle.onDeselection();
	}

	// Notify if doodle is deselected ***TODO*** move to onDeselection code for doodle to make this trigger for all deselections
	if (this.lastSelectedDoodle) {
		if (this.lastSelectedDoodle != this.selectedDoodle) {
			// Notify
			this.notify("doodleDeselected");
		}
	}

	// Drawing
	if (this.newPointOnClick && !found) {
		var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);

		var newPointInLine = this.addDoodle('PointInLine');
		newPointInLine.originX = mousePosDoodlePlane.x;
		newPointInLine.originY = mousePosDoodlePlane.y;
	}

	// Multiple Selecting
	/*
    if (!found)
    {
        this.mode = ED.Mode.Select;
        this.selectionRectangleStart = this.inverseTransform.transformPoint(_point);
    }
     */

	// Repaint
	this.repaint();

	// Notify
	this.notify("mousedown", {
		drawing: this,
		point: _point
	});
}

/**
 * Responds to mouse move event in canvas according to the drawing mode
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mousemove = function(_point) {
	// Notify
	this.notify("mousemove", {
		drawing: this,
		point: _point
	});

	// Get selected doodle
	var doodle = this.selectedDoodle;

	if (doodle && this.selectedDoodle.isLocked) {
		return;
	}

	// Draw selection rectangle
	/*
    if (this.mode == ED.Mode.Select)
    {
        if (!this.selectionRectangleIsBeingDragged)
        {
            this.selectionRectangleIsBeingDragged = true;
        }

        this.selectionRectangleEnd = this.inverseTransform.transformPoint(_point);
        this.repaint();
    }
    */

	// Store action for notification
	var action = "";

	// Start the hover timer (also resets it)
	this.startHoverTimer(_point);

	// Only drag if mouse already down and a doodle selected
	if (this.mouseDown && doodle != null) {

		// Dragging not started
		if (!doodle.isBeingDragged) {
			// Flag start of dragging manoeuvre
			doodle.isBeingDragged = true;
		}
		// Dragging in progress
		else {
			// Get mouse position in doodle plane
			var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);
			var lastMousePosDoodlePlane = this.inverseTransform.transformPoint(this.lastMousePosition);

			// Get mouse positions in selected doodle's plane
			var mousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(_point);
			var lastMousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(this.lastMousePosition);

			// Get mouse positions in canvas plane relative to centre
			var mousePosRelCanvasCentre = new ED.Point(_point.x - this.canvas.width / 2, _point.y - this.canvas.height / 2);
			var lastMousePosRelCanvasCentre = new ED.Point(this.lastMousePosition.x - this.canvas.width / 2, this.lastMousePosition.y - this.canvas.height / 2);

			// Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
			var canvasCentre = new ED.Point(0, 0);
			var canvasTop = new ED.Point(0, -100);

			// Get coordinates of origin of doodle in doodle plane
			var doodleOrigin = new ED.Point(doodle.originX, doodle.originY);

			// Get position of point vertically above doodle origin in doodle plane
			var doodleTop = new ED.Point(doodle.originX, doodle.originY - 100);

			// Effect of dragging depends on mode
			switch (this.mode) {
				case ED.Mode.None:
					break;

				case ED.Mode.Move:
					// If isMoveable is true, move doodle
					if (doodle.isMoveable) {
						// Initialise new values to stop doodle getting 'trapped' at origin due to failure of non-zero test in snapToQuadrant
						var newOriginX = doodle.originX;
						var newOriginY = doodle.originY;

						// Enforce snap to grid
						if (doodle.snapToGrid) {
							// Calculate mouse position and work out nearest position of a grid line
							var testX = mousePosDoodlePlane.x - doodle.gridDisplacementX;
							var gridSquaresX = Math.floor(testX / doodle.gridSpacing);
							var gridRemainderX = ED.Mod(testX, doodle.gridSpacing);
							newOriginX = doodle.gridDisplacementX + doodle.gridSpacing * (gridSquaresX + Math.round(gridRemainderX / doodle.gridSpacing));

							// Repeat for Y axis
							var testY = mousePosDoodlePlane.y - doodle.gridDisplacementY;
							var gridSquaresY = Math.floor(testY / doodle.gridSpacing);
							var gridRemainderY = ED.Mod(testY, doodle.gridSpacing);
							newOriginY = doodle.gridDisplacementY + doodle.gridSpacing * (gridSquaresY + Math.round(gridRemainderY / doodle.gridSpacing));

							// Doodle's move method notifies and also sets orientation
							doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
						}
						// Enforce snap to quadrant
						else if (doodle.snapToQuadrant) {
							if (mousePosDoodlePlane.x != 0) {
								newOriginX = doodle.quadrantPoint.x * mousePosDoodlePlane.x / Math.abs(mousePosDoodlePlane.x);
							}
							if (mousePosDoodlePlane.y != 0) {
								newOriginY = doodle.quadrantPoint.y * mousePosDoodlePlane.y / Math.abs(mousePosDoodlePlane.y);
							}

							// Doodle's move method notifies and also sets orientation
							doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
						}
						// Enforce snap to points
						else if (doodle.snapToPoints) {
							newOriginX = doodle.nearestPointTo(mousePosDoodlePlane).x;
							newOriginY = doodle.nearestPointTo(mousePosDoodlePlane).y;

							// Doodle's move method notifies and also sets orientation
							doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
						}
						// Normal move
						else {
							doodle.move(mousePosDoodlePlane.x - lastMousePosDoodlePlane.x, mousePosDoodlePlane.y - lastMousePosDoodlePlane.y);
						}

						action = 'move';
					}
					// Otherwise rotate it (if isRotatable)
					else {
						if (doodle.isRotatable) {
							// Calculate angles from centre to mouse positions relative to north
							var oldAngle = this.innerAngle(canvasTop, canvasCentre, lastMousePosRelCanvasCentre);
							var newAngle = this.innerAngle(canvasTop, canvasCentre, mousePosRelCanvasCentre);

							// Work out difference, and change doodle's angle of rotation by this amount
							var angleDelta = newAngle - oldAngle;

							// Calculate new value of rotation
							if (doodle.snapToAngles) {
								var newRotation = doodle.nearestAngleTo(newAngle);
							} else {
								var newRotation = ED.Mod(doodle.rotation + angleDelta, 2 * Math.PI);
							}

							// Restrict to allowable range
							doodle.setSimpleParameter('rotation', doodle.parameterValidationArray['rotation']['range'].constrainToAngularRange(newRotation, false));

							// Update dependencies
							doodle.updateDependentParameters('rotation');

							// Adjust radius property
							var oldRadius = Math.sqrt(lastMousePosDoodlePlane.x * lastMousePosDoodlePlane.x + lastMousePosDoodlePlane.y * lastMousePosDoodlePlane.y);
							var newRadius = Math.sqrt(mousePosDoodlePlane.x * mousePosDoodlePlane.x + mousePosDoodlePlane.y * mousePosDoodlePlane.y);
							var radiusDelta = doodle.radius + (newRadius - oldRadius);

							// Keep within bounds
							doodle.setSimpleParameter('radius', doodle.parameterValidationArray['radius']['range'].constrain(radiusDelta));

							// Update dependencies
							doodle.updateDependentParameters('radius');
						}
					}
					break;
				case ED.Mode.Scale:
					if (doodle.isScaleable) {
						// Get sign of scale (negative scales create horizontal and vertical flips)
						var signX = doodle.scaleX / Math.abs(doodle.scaleX);
						var signY = doodle.scaleY / Math.abs(doodle.scaleY);

						// Calculate change in scale (sign change indicates mouse has moved across central axis)
						var changeX = mousePosSelectedDoodlePlane.x / lastMousePosSelectedDoodlePlane.x;
						var changeY = mousePosSelectedDoodlePlane.y / lastMousePosSelectedDoodlePlane.y;

						// Ensure scale change is same if not squeezable
						if (!doodle.isSqueezable) {
							if (changeX > changeY) changeY = changeX;
							else changeY = changeX;
						}

						// Check that mouse has not moved from one quadrant to another
						if (changeX > 0 && changeY > 0) {
							// Now do scaling
							newScaleX = doodle.scaleX * changeX;
							newScaleY = doodle.scaleY * changeY;

							// Constrain scale
							newScaleX = doodle.parameterValidationArray['scaleX']['range'].constrain(Math.abs(newScaleX), this.globalScaleFactor);
							newScaleY = doodle.parameterValidationArray['scaleY']['range'].constrain(Math.abs(newScaleY), this.globalScaleFactor);

							doodle.setSimpleParameter('scaleX', newScaleX * signX);
							doodle.setSimpleParameter('scaleY', newScaleY * signY);

							// Update dependencies
							doodle.updateDependentParameters('scaleX');
							doodle.updateDependentParameters('scaleY');
						} else {
							this.mode = ED.Mode.None;
						}
					}
					break;

				case ED.Mode.Arc:

					// Calculate angles from centre to mouse positions relative to north
					var newAngle = this.innerAngle(doodleTop, doodleOrigin, mousePosSelectedDoodlePlane);
					var oldAngle = this.innerAngle(doodleTop, doodleOrigin, lastMousePosSelectedDoodlePlane);

					// Work out difference, and sign of rotation correction
					var deltaAngle = newAngle - oldAngle;
					if (doodle.isArcSymmetrical) deltaAngle = 2 * deltaAngle;
					rotationCorrection = 1;

					// Arc left or right depending on which handle is dragging
					if (doodle.draggingHandleIndex < 2) {
						deltaAngle = -deltaAngle;
						rotationCorrection = -1;
					}

					// Handle snapping
					if (doodle.snapToArc) {
						// Correct for negative handle
						if (rotationCorrection < 0) {
							newAngle = 2 * Math.PI - ED.positiveAngle(newAngle);
						}
						doodle.setSimpleParameter('arc', doodle.nearestArcTo(doodle.arc / 2 + newAngle));
					} else {
						// Check for permitted range and stop dragging if exceeded
						if (doodle.parameterValidationArray['arc']['range'].isBelow(doodle.arc + deltaAngle)) {
							deltaAngle = doodle.parameterValidationArray['arc']['range'].min - doodle.arc;
							doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].min);
							this.mode = ED.Mode.None;
						} else if (doodle.parameterValidationArray['arc']['range'].isAbove(doodle.arc + deltaAngle)) {

							deltaAngle = doodle.parameterValidationArray['arc']['range'].max - doodle.arc;
							//doodle.arc = doodle.parameterValidationArray['arc']['range'].max;
							doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].max);
							this.mode = ED.Mode.None;
						} else {
							doodle.setSimpleParameter('arc', doodle.arc + deltaAngle);
						}
					}

					// Update dependencies
					doodle.updateDependentParameters('arc');

					// Correct rotation with counter-rotation
					if (!doodle.isArcSymmetrical) {
						rotationCorrection = rotationCorrection * deltaAngle / 2;
						doodle.setSimpleParameter('rotation', doodle.rotation + rotationCorrection);

						// Update dependencies
						doodle.updateDependentParameters('rotation');
					}
					break;

				case ED.Mode.Rotate:

					if (doodle.isRotatable) {
						// Calculate angles from centre to mouse positions relative to north
						var oldAngle = this.innerAngle(doodleTop, doodleOrigin, lastMousePosDoodlePlane);
						var newAngle = this.innerAngle(doodleTop, doodleOrigin, mousePosDoodlePlane);

						// Work out difference, and change doodle's angle of rotation by this amount
						var deltaAngle = newAngle - oldAngle;
						//deltaAngle = ED.positiveAngle(deltaAngle);
						var newRotation = doodle.rotation + deltaAngle;
						newRotation = ED.positiveAngle(newRotation);

						// Restrict to allowable range
						doodle.setSimpleParameter('rotation', doodle.parameterValidationArray['rotation']['range'].constrainToAngularRange(newRotation, false));

						// Update dependencies
						doodle.updateDependentParameters('rotation');
					}
					break;

				case ED.Mode.Apex:
					// Move apex to new position
					var newApexX = doodle.apexX + (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
					var newApexY = doodle.apexY + (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);

					// Enforce bounds
					doodle.setSimpleParameter('apexX', doodle.parameterValidationArray['apexX']['range'].constrain(newApexX));
					doodle.setSimpleParameter('apexY', doodle.parameterValidationArray['apexY']['range'].constrain(newApexY));

					// Update dependencies
					doodle.updateDependentParameters('apexX');
					doodle.updateDependentParameters('apexY');
					break;

				case ED.Mode.Size:
					// Alter width and height accordingly
					var newWidth = doodle.width + 2 * (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
					var newHeight = doodle.height - 2 * (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);

					// Enforce bounds
					doodle.setSimpleParameter('width', doodle.parameterValidationArray['width']['range'].constrain(newWidth));
					doodle.setSimpleParameter('height', doodle.parameterValidationArray['height']['range'].constrain(newHeight));

					// Update dependencies
					doodle.updateDependentParameters('width');
					doodle.updateDependentParameters('height');
					break;

				case ED.Mode.Handles:

					// Move handles to new position (Stored in a squiggle)
					var index = doodle.draggingHandleIndex;

					// Get new position into a point object
					var newPosition = new ED.Point(0, 0);
					newPosition.x = doodle.squiggleArray[0].pointsArray[index].x + (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
					newPosition.y = doodle.squiggleArray[0].pointsArray[index].y + (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);

					// Constraining coordinates handle with optional range array (set in a subclass)
					if (typeof(doodle.handleCoordinateRangeArray) != 'undefined') {
						newPosition.x = doodle.handleCoordinateRangeArray[index]['x'].constrain(newPosition.x);
						newPosition.y = doodle.handleCoordinateRangeArray[index]['y'].constrain(newPosition.y);
					}

					// Constraining radius and angle of handle with optional range array (set in a subclass)
					if (typeof(doodle.handleVectorRangeArray) != 'undefined') {
						var length = doodle.handleVectorRangeArray[index]['length'].constrain(newPosition.length());
						var angle = doodle.handleVectorRangeArray[index]['angle'].constrainToAngularRange(newPosition.direction(), false);
						newPosition.setWithPolars(length, angle);
					}

					// Set new position for handle
					doodle.squiggleArray[0].pointsArray[index].x = newPosition.x;
					doodle.squiggleArray[0].pointsArray[index].y = newPosition.y;

					// Update dependencies (NB handles is not stricly a parameter, but this will call the appropriate doodle methods)
					doodle.updateDependentParameters('handles');
					break;

				case ED.Mode.Draw:
					var p = new ED.Point(mousePosSelectedDoodlePlane.x, mousePosSelectedDoodlePlane.y);
					doodle.addPointToSquiggle(p);
					break;

				case ED.Mode.Select:
					var p = new ED.Point(mousePosSelectedDoodlePlane.x, mousePosSelectedDoodlePlane.y);
					// console.log('Selecting ', p.x, p.y);
					break;

				default:
					break;
			}

			// Update any bindings NB temporarilly moved to updateDependentParameters method which SHOULD be called for all relevant changes in this method
			//this.updateBindings();
		}

		// Store mouse position
		this.lastMousePosition = _point;

		// Notify
		this.notify("mousedragged", {
			point: _point,
			action: action
		});

		// Refresh
		this.repaint();
	}
}

/**
 * Responds to mouse up event in canvas
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseup = function(_point) {
	// Multiselect - Go through doodles seeing which are within dragging rectangle
	/*
    for (var i = 0; i < this.doodleArray.length; i++)
	{
        var doodle = this.doodleArray[i];
        var origin = new ED.Point(doodle.originX, doodle.originY);

        var p = this.transform.transformPoint(origin);

        // If doodle origin is in selection rectangle, select it
        if(this.selectionRectangleIsBeingDragged && this.context.isPointInPath(p.x, p.y))
        {
            doodle.isSelected = true;
        }
	}

    // TEMP - this is needed to ensure delete button is activated
    if (doodle) this.selectedDoodle = doodle;
     */

	// Reset flags and mode
	this.mouseDown = false;
	this.doubleClick = false;
	this.mode = ED.Mode.None;
	this.selectionRectangleIsBeingDragged = false;

	// Reset selected doodle's dragging flag
	if (this.selectedDoodle != null) {
		this.selectedDoodle.isBeingDragged = false;

		// Optionally complete squiggle
		if (this.selectedDoodle.isDrawable) {
			this.selectedDoodle.completeSquiggle();
			this.drawAllDoodles();
		}

		// Remove selection from some doodles
		if (!this.selectedDoodle.willStaySelected) {
			this.selectedDoodle.isSelected = false;
			this.selectedDoodle = null;
		}
	}

	// Redraw to get rid of select rectangle
	this.repaint();

	// Notify
	this.notify("mouseup", _point);
}

/**
 * Responds to mouse out event in canvas, stopping dragging operation
 *
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseover = function(_point) {
	// Make drawing active
	this.isActive = true;

	// Notify
	this.notify("mouseover", _point);
}

/**
 * Responds to mouse out event in canvas, stopping dragging operation
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseout = function(_point) {
	// Make drawing inactive
	this.isActive = false;

	// Stop the hover timer
	this.stopHoverTimer();

	// Reset flag and mode
	this.mouseDown = false;
	this.mode = ED.Mode.None;

	// Reset selected doodle's dragging flag
	if (this.selectedDoodle != null) {
		this.selectedDoodle.isBeingDragged = false;

		// Optionally complete squiggle
		if (this.selectedDoodle.isDrawable) {
			this.selectedDoodle.completeSquiggle();
			this.drawAllDoodles();
		}
	}

	// Notify
	this.notify("mouseout", _point);
}

/**
 * Responds to key down event in canvas
 *
 * @event
 * @param {event} e Keyboard event
 */
ED.Drawing.prototype.keydown = function(e) {
	// Keyboard action works on selected doodle
	if (this.selectedDoodle != null) {
		// Label doodle is special case - Deprecated since doodle control bar
		// if (this.selectedDoodle.className == "Label") {
		if (false) {
			// Code to send to doodle
			var code = 0;

			// Shift key has code 16
			if (e.keyCode != 16) {
				// Alphabetic
				if (e.keyCode >= 65 && e.keyCode <= 90) {
					if (e.shiftKey) {
						code = e.keyCode;
					} else {
						code = e.keyCode + 32;
					}
				}
				// Space or numeric
				else if (e.keyCode == 32 || (e.keyCode > 47 && e.keyCode < 58)) {
					code = e.keyCode;
				}
				// Apostrophes
				else if (e.keyCode == 222) {
					if (e.shiftKey) {
						code = 34;
					} else {
						code = 39;
					}
				}
				// Colon and semicolon
				else if (e.keyCode == 186) {
					if (e.shiftKey) {
						code = 58;
					} else {
						code = 59;
					}
				}
				// Other punctuation
				else if (e.keyCode == 188 || e.keyCode == 190) {
					if (e.keyCode == 188) code = 44;
					if (e.keyCode == 190) code = 46;
				}
				// Backspace
				else if (e.keyCode == 8) {
					code = e.keyCode;
				}
				// Carriage return
				else if (e.keyCode == 13) {
					code = 13;
				}
			}

			// Carriage return stops editing
			if (code == 13) {
				this.deselectDoodles();
			}
			// Send code to label doodle
			else if (code > 0) {
				this.selectedDoodle.addLetter(code);
			}
		} else {
			// Delete or move doodle
			switch (e.keyCode) {
				case 8: // Backspace
					if (this.selectedDoodle.className != "Label") this.deleteSelectedDoodle();
					break;
				case 37: // Left arrow
					this.selectedDoodle.move(-ED.arrowDelta, 0);
					break;
				case 38: // Up arrow
					this.selectedDoodle.move(0, -ED.arrowDelta);
					break;
				case 39: // Right arrow
					this.selectedDoodle.move(ED.arrowDelta, 0);
					break;
				case 40: // Down arrow
					this.selectedDoodle.move(0, ED.arrowDelta);
					break;
				default:
					break;
			}
		}

		// Refresh canvas
		this.repaint();

		// Prevent key stroke bubbling up (***TODO*** may need cross browser handling)
		e.stopPropagation();
		e.preventDefault();

		this.notify("keydown", e.keyCode);
	}
}

/**
 * Starts a timer to display a tooltip simulating hover. Called from the mousemove event
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.startHoverTimer = function(_point) {
	// Only show tooltips for editable drawings with a span element of id 'canvasTooltip'
	if (this.isEditable && this.canvasTooltip != null) {
		// Stop any existing timer
		this.stopHoverTimer();

		// Restart it
		var drawing = this;
		this.hoverTimer = setTimeout(function() {
			drawing.hover(_point);
		}, 1000);
	}
}

/**
 * Stops the timer. Called by the mouseout event, and from the start of the startHoverTimer method
 *
 * @event
 */
ED.Drawing.prototype.stopHoverTimer = function() {
	if (this.canvasTooltip != null) {
		// Reset any existing timer
		clearTimeout(this.hoverTimer);

		// Clear text
		this.canvasTooltip.innerHTML = "";

		// Hide hover
		this.hideTooltip();
	}
}

/**
 * Triggered by the hover timer
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.hover = function(_point) {
	this.showTooltip(_point);

	// Notify
	this.notify("hover", _point);
}

/**
 * Shows a tooltip if present
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.showTooltip = function(_point) {


	// DISABLED TOOLTIPS AS PART OF #OED-4
	return;

	// Get coordinates of mouse
	var xAbs = _point.x;
	var yAbs = _point.y;
	if (this.canvas.offsetParent) {
		var obj = this.canvas;
		var keepGoing;

		// The tooltip <span> has an absolute position (relative to the 1st parent element that has a position other than static)
		do {
			// ***TODO*** is this a reliable way of getting the position attribute?
			var position = document.defaultView.getComputedStyle(obj, null).getPropertyValue('position');

			// Flag to continue going up the tree
			keepGoing = false;

			// Assign x and y values
			if (position != null) {
				if (position == 'static') {
					keepGoing = true;
					xAbs += obj.offsetLeft;
					yAbs += obj.offsetTop;
				}
			}

			// Does parent exist, or is origin for absolute positioning
			var keepGoing = keepGoing && (obj = obj.offsetParent);

		}
		while (keepGoing);
	}

	// Adjust coodinates of tooltip
	this.canvasTooltip.style.left = xAbs + "px";
	this.canvasTooltip.style.top = (yAbs + 18) + "px";

	// Set flag to indicate success
	var found = false;

	// Cycle through doodles from front to back doing hit test
	for (var i = this.doodleArray.length - 1; i > -1; i--) {
		if (!found) {
			// Save context (draw method of each doodle may alter it)
			this.context.save();

			// Successful hit test?
			if (this.doodleArray[i].draw(_point) && this.doodleArray[i].showsToolTip) {
				this.canvasTooltip.innerHTML = this.doodleArray[i].tooltip();
				found = true;
			}

			// Restore context
			this.context.restore();
		}
	}

	// Display tooltip
	if (this.canvasTooltip.innerHTML.length > 0) {
		this.canvasTooltip.style.display = 'block';
	}
}

/**
 * Hides a tooltip
 *
 * @event
 */
ED.Drawing.prototype.hideTooltip = function() {
	this.canvasTooltip.style.display = 'none';
}

/**
 * Moves selected doodle to front
 */
ED.Drawing.prototype.moveToFront = function() {

	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null) {

		if (this.selectedDoodle.isLocked) {
			return;
		}

		// Assign large number to selected doodle
		this.selectedDoodle.order = 1000;

		// Sort array by order (puts back doodle first)
		this.doodleArray.sort(function(a, b) {
			return a.order - b.order
		});

		// Re-assign ordinal numbers to array
		for (var i = 0; i < this.doodleArray.length; i++) {
			this.doodleArray[i].order = i;
		}

		// Refresh canvas
		this.repaint();
	}

	// Notify
	this.notify("moveToFront");
}

/**
 * Moves selected doodle to back
 */
ED.Drawing.prototype.moveToBack = function() {

	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle !== null) {

		if (this.selectedDoodle.isLocked) {
			return;
		}

		// Assign negative order to selected doodle
		this.selectedDoodle.order = -1;

		// Sort array by order (puts back doodle first)
		this.doodleArray.sort(function(a, b) {
			return a.order - b.order
		});

		// Re-assign ordinal numbers to array
		for (var i = 0; i < this.doodleArray.length; i++) {
			this.doodleArray[i].order = i;
		}

		// Refresh canvas
		this.repaint();
	}

	// Notify
	this.notify("moveToBack");
}

/**
 * Moves a doodle next to the first doodle of the passed class name
 *
 * @param {Doodle} _doodle The doodle to move
 * @param {String} _className Classname of doodle to move next to
 * @param {Bool} _inFront True if doodle placed in front, otherwise behind
 */
ED.Drawing.prototype.moveNextTo = function(_doodle, _className, _inFront) {
	// Check that _className has an instance
	if (this.hasDoodleOfClass(_className)) {
		// Don't assume that _doodle is in front, so start by putting it there, and reorder
		_doodle.order = 1000;
		this.doodleArray.sort(function(a, b) {
			return a.order - b.order
		});
		for (var i = 0; i < this.doodleArray.length; i++) {
			this.doodleArray[i].order = i;
		}

		// Interate through doodle array altering order
		var offset = 0;
		for (var i = 0; i < this.doodleArray.length - 1; i++) {
			this.doodleArray[i].order = i + offset;

			// Look for doodle of passed classname (will definitely be found first)
			if (this.doodleArray[i].className == _className) {
				offset = 1;
				if (_inFront) {
					_doodle.order = i + 1;
				} else {
					_doodle.order = i;
					this.doodleArray[i].order = i + 1;
				}
			}
		}

		// Sort array by order (puts back doodle first)
		this.doodleArray.sort(function(a, b) {
			return a.order - b.order
		});
	}
}

/**
 * Flips the doodle around a vertical axis
 */
ED.Drawing.prototype.flipVer = function() {
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null) {
		// Vertical axis involved altering sign of scale y
		this.selectedDoodle.scaleY = this.selectedDoodle.scaleY * -1;

		// Refresh canvas
		this.repaint();
	}

	// Notify
	this.notify("flipVer");
}

/**
 * Flips the doodle around a horizontal axis
 */
ED.Drawing.prototype.flipHor = function() {
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null) {
		// Horizontal axis involved altering sign of scale x
		this.selectedDoodle.scaleX = this.selectedDoodle.scaleX * -1;

		// Refresh canvas
		this.repaint();
	}

	// Notify
	this.notify("flipHor");
}

/**
 * Deletes a doodle
 *
 * @param {Doodle} The doodle to be deleted
 */
ED.Drawing.prototype.deleteDoodle = function(_doodle) {
	// Class name and flag for successful deletion
	var deletedClassName = false;

	var errorMessage = 'Attempt to delete a doodle that does not exist';

	// Check that doodle will delete
	if (_doodle.willDelete()) {
		// Iterate through doodle array looking for doodle
		for (var i = 0; i < this.doodleArray.length; i++) {
			if (this.doodleArray[i].id == _doodle.id) {
				if (this.doodleArray[i].isDeletable) {
					deletedClassName = _doodle.className;

					// If its selected, deselect it
					if (this.selectedDoodle != null && this.selectedDoodle.id == _doodle.id) {
						this.selectedDoodle.onDeselection();
						this.selectedDoodle = null;
					}

					// Remove bindings and reset values of bound elements
					for (var parameter in _doodle.bindingArray) {
						var elementId = _doodle.bindingArray[parameter]['id'];
						var attribute = _doodle.bindingArray[parameter]['attribute'];

						var element = document.getElementById(elementId);
						var value = this.boundElementDeleteValueArray[elementId];

						// If available, set the value of the bound element to the appropriate value
						if (element != null && typeof(value) != 'undefined') {
							// Set the element according to the value
							switch (element.type) {
								case 'checkbox':
									if (attribute) {
										ED.errorHandler('ED.Drawing', 'deleteDoodle', 'Binding to a checkbox with a non-standard attribute not yet supported');
									} else {
										if (value == "true") {
											element.setAttribute('checked', 'checked');
										} else {
											element.removeAttribute('checked');
										}
									}
									break;

								case 'select-one':
									if (attribute) {
										for (var j = 0; j < element.length; j++) {
											if (element.options[j].getAttribute(attribute) == value) {
												element.value = element.options[j].value;
												break;
											}
										}
									} else {
										element.value = value;
									}
									break;

								default:
									if (attribute) {
										element.setAttribute(attribute, value);
									} else {
										element.value = value;
									}
									break;
							}
						}

						// Remove binding from doodle (also removes event listener from element)
						_doodle.removeBinding(parameter);
					}

					// Remove it from array
					this.doodleArray.splice(i, 1);
				} else {
					errorMessage = 'Attempt to delete a doodle that is not deletable, className: ' + _doodle.className;
				}
			}
		}
	} else {
		errorMessage = 'Doodle refused permission to be deleted, className: ' + _doodle.className;
	}

	// If successfully deleted, tidy up
	if (deletedClassName) {
		// Re-assign ordinal numbers within array
		for (var i = 0; i < this.doodleArray.length; i++) {
			this.doodleArray[i].order = i;
		}

		// Refresh canvas
		this.repaint();

		// Notify
		this.notify("doodleDeleted", deletedClassName);
	} else {
		ED.errorHandler('ED.Drawing', 'deleteDoodle', errorMessage);
	}
}


/**
 * Deletes currently selected doodle
 */
ED.Drawing.prototype.deleteSelectedDoodle = function() {
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null) {
		this.deleteDoodle(this.selectedDoodle);
	} else {
		ED.errorHandler('ED.Drawing', 'deleteSelectedDoodle', 'Attempt to delete selected doodle, when none selected');
	}

	// Multiple select
	/*
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        if (this.doodleArray[i].isSelected)
        {
            this.deleteDoodle(this.doodleArray[i]);
        }
    }
     */
}

/**
 * Resets the eyedraw canvas completely including any related form inputs
 */

ED.Drawing.prototype.resetEyedraw = function() {
	this.deleteAllDoodles();
	this.deselectDoodles();
	this.drawAllDoodles();
}

/**
 * Set the scale level for drawing and all doodles
 * @param  {Number} level     Scale level.
 * @param  {String} eventName Event name to notify.
 */
ED.Drawing.prototype.setScaleForDrawingAndDoodles = function(level) {

	this.globalScaleFactor = level;

	this.doodleArray.forEach(function(doodle) {
		doodle.setScaleLevel(level);
	});

	this.repaint();
};

/**
 * This should be called only once the drawing is ready.
 * @param {[type]} level [description]
 */
ED.Drawing.prototype.setScaleLevel = function(level) {
	this.setScaleForDrawingAndDoodles(level);
	this.notifyZoomLevel();
};

/**
 * Toggles the scale level of the drawing.
 * We're only supporting two zoom levels: "in" and "out".
 */
ED.Drawing.prototype.toggleZoom = function() {
	if (!this.toggleScaleFactor) return;
	var scale = this.globalScaleFactor === this.toggleScaleFactor ? this.origScaleLevel : this.toggleScaleFactor;
	this.setScaleLevel(scale);
};

ED.Drawing.prototype.notifyZoomLevel = function() {

	var zoomIn = 'drawingZoomIn';
	var zoomOut = 'drawingZoomOut';
	var evt;

	if (this.origScaleLevel < this.toggleScaleFactor) {
		evt = (this.globalScaleFactor < this.toggleScaleFactor) ? zoomOut : zoomIn;
	} else {
		evt = (this.globalScaleFactor <= this.toggleScaleFactor) ? zoomOut : zoomIn;
	}

	this.notify('drawingZoom');
	this.notify(evt);
};

/**
 * Sets a property on currently selected doodle NB currently only supports boolean properties
 *
 * @param {Object} _element An HTML element which called this function
 * @param {String} _property The name of the property to switch
 */
ED.Drawing.prototype.setSelectedDoodle = function(_element, _property) {
	// Get value of check box
	var value = _element.checked ? "true" : "false";

	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null) {
		this.selectedDoodle.setParameterFromString(_property, value);
	} else {
		ED.errorHandler('ED.Drawing', 'setSelectedDoodle', 'Attempt to set a property on the selected doodle, when none selected');
	}
}

/**
 * Deletes doodle with selected id
 */
ED.Drawing.prototype.deleteDoodleOfId = function(_id) {
	var doodle = this.doodleOfId(_id);

	if (doodle) {
		this.deleteDoodle(doodle);
	} else {
		ED.errorHandler('ED.Drawing', 'deleteDoodleOfId', 'Attempt to delete doodle with invalid id');
	}
}

/**
 * Locks selected doodle
 */
ED.Drawing.prototype.lock = function() {
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle !== null) {
		this.selectedDoodle.isLocked = true;
		this.notify("doodleLocked");
		this.repaint();
	}
}

/**
 * Unlocks all doodles
 */
ED.Drawing.prototype.unlock = function() {
	// Go through doodles unlocking all
	for (var i = 0; i < this.doodleArray.length; i++) {
		this.doodleArray[i].isLocked = false;
	}
	this.notify("doodleUnlocked");
	// Refresh canvas
	this.repaint();
}

/**
 * Toggle doodle help text
 */
ED.Drawing.prototype.toggleHelp = function() {
	this.notify('toggleDoodleHelp');
};

/**
 * Deselect any selected doodles
 */
ED.Drawing.prototype.deselectDoodles = function() {

	// Deselect all doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		this.doodleArray[i].isSelected = false;
	}

	if (this.selectedDoodle) {
		this.selectedDoodle.onDeselection();
		this.selectedDoodle = null;
	}

	this.notify("doodleDeselected");

	// Refresh drawing
	this.repaint();
}

/**
 * Use scroll to select next doodle in array (From an idea of Adrian Duke)
 *
 * @param {Int} _value Value of scroll wheel
 */
ED.Drawing.prototype.selectNextDoodle = function(_value) {
	// Increment current scrollValue
	this.scrollValue += _value;

	// Scroll direction
	var up = _value > 0 ? true : false;

	// 'Damp' scroll speed by waiting for larger increments
	var dampValue = 96;

	if (this.scrollValue > dampValue || this.scrollValue < -dampValue) {
		// Reset scrollValue
		this.scrollValue = 0;

		// Index of selected doodle
		var selectedIndex = -1;

		// Iterate through doodles
		for (var i = 0; i < this.doodleArray.length; i++) {
			if (this.doodleArray[i].isSelected) {
				selectedIndex = i;

				// Deselected currently selected doodle
				this.doodleArray[i].isSelected = false;
			}
		}

		// If there is a selection, change it
		if (selectedIndex >= 0) {
			// Change index
			if (up) {
				selectedIndex++;
				if (selectedIndex == this.doodleArray.length) selectedIndex = 0;
			} else {
				selectedIndex--;
				if (selectedIndex < 0) selectedIndex = this.doodleArray.length - 1;
			}

			// Wrap
			if (selectedIndex == this.doodleArray.length) {

			}

			this.doodleArray[selectedIndex].isSelected = true;
			this.selectedDoodle = this.doodleArray[selectedIndex];
		}

		// Refresh drawing
		this.repaint();
	}
}

/**
 * Sets a doodle as selected
 *
 * @param {Int} _doodleId Value of scroll wheel
 */
ED.Drawing.prototype.setDoodleAsSelected = function(_doodleId) {
	var selectedIndex = -1;

	// Iterate through doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].id == _doodleId) {
			selectedIndex = i;
		}
	}

	if (selectedIndex >= 0) {
		var doodle = this.doodleArray[selectedIndex];
		this.selectDoodle(doodle);
	}
}

/**
 * Mark a doodle as selected
 * @param  {ED.Doodle} doodle
 */
ED.Drawing.prototype.selectDoodle = function(doodle) {

	this.deselectDoodles();

	doodle.isSelected = true;
	this.selectedDoodle = doodle;

	// Run onDeselection code for last doodle
	if (this.lastSelectedDoodle) this.lastSelectedDoodle.onDeselection();

	// Notify
	this.notify("doodleSelected");

	// Run onSelection code
	this.selectedDoodle.onSelection();

	this.repaint();
};

/**
 * Marks the doodle as 'unmodified' so we can catch an event when it gets modified by the user
 */
ED.Drawing.prototype.isReady = function() {
	this.modified = false;
	if (this.convertToImage) {
		this.replaceWithImage();
	}
}

/**
 * Adds a doodle to the array
 *
 * @param {String} _className Class name of doodle
 * @param {Array} _parameterDefaults Array of key value pairs containing default values or parameters
 * @param {Array} _parameterBindings Array of key value pairs. Key is element id, value is parameter to bind to
 * @returns {Doodle} The newly added doodle
 */
ED.Drawing.prototype.addDoodle = function(_className, _parameterDefaults, _parameterBindings) {
	// Set flag to indicate whether a doodle of this className already exists
	var doodleExists = this.hasDoodleOfClass(_className);

	// Check that class exists, and create a new doodle
	if (ED.hasOwnProperty(_className)) {
		// Create new doodle of class
		var newDoodle = new ED[_className](this);

		// Create an instance of the parent if it does not already exist
		/*
        if (newDoodle.parentClass.length > 0)
        {
            if (!this.hasDoodleOfClass(newDoodle.parentClass))
            {
                this.addDoodle(newDoodle.parentClass);
            }
        }
        */
	} else {
		ED.errorHandler('ED.Drawing', 'addDoodle', 'Unable to find definition for subclass ' + _className);
		return null;
	}

	// Check if one is already there if unique)
	if (!(newDoodle.isUnique && this.hasDoodleOfClass(_className))) {
		// Ensure no other doodles are selected, and run onDeselection code if appropriate
		for (var i = 0; i < this.doodleArray.length; i++) {
			if (this.doodleArray[i].isSelected) this.doodleArray[i].onDeselection();
			this.doodleArray[i].isSelected = false;
		}

		// Set parameters for this doodle
		if (typeof(_parameterDefaults) != 'undefined') {
			for (var key in _parameterDefaults) {
				var res = newDoodle.validateParameter(key, _parameterDefaults[key]);
				if (res.valid) {
					newDoodle.setParameterFromString(key, res.value);
				} else {
					ED.errorHandler('ED.Drawing', 'addDoodle', 'ParameterDefaults array contains an invalid value for parameter ' + key);
				}
			}
		}

		// New doodles are selected by default
		this.selectedDoodle = newDoodle;

		// If drawable, also go into drawing mode
		if (newDoodle.isDrawable) {
			newDoodle.isForDrawing = true;
		}

		// Add to array
		this.doodleArray[this.doodleArray.length] = newDoodle;

		// Pre-existing binding
		if (!doodleExists) {
			for (var parameter in this.bindingArray[_className]) {
				var elementId = this.bindingArray[_className][parameter]['id'];
				var attribute = this.bindingArray[_className][parameter]['attribute'];
				var element = document.getElementById(elementId);

				// Get the value of the element
				var value;

				// Set the value to the value of the element
				switch (element.type) {
					case 'checkbox':
						if (attribute) {
							ED.errorHandler('ED.Drawing', 'addDoodle', 'Binding to a checkbox with a non-standard attribute not yet supported');
						} else {
							value = element.checked.toString();
						}
						break;

					case 'select-one':
						if (attribute) {
							if (element.selectedIndex > -1) {
								value = element.options[element.selectedIndex].getAttribute(attribute);
							}
						} else {
							value = element.value;
						}
						break;

					default:
						if (attribute) {
							value = element.getAttribute(attribute);
						} else {
							value = element.value;
						}
						break;
				}

				// If the element value is equal to the delete value, use the default value of the doodle instead
				if (value == this.boundElementDeleteValueArray[elementId]) {
					value = newDoodle[parameter];
				}

				// Check validity of new value
				var validityArray = newDoodle.validateParameter(parameter, value);

				// If new value is valid, set it, otherwise use default value of doodle
				if (validityArray.valid) {
					newDoodle.setParameterFromString(parameter, validityArray.value);
					//newDoodle.setSimpleParameter(parameter, validityArray.value);
					newDoodle.updateDependentParameters(parameter);
					//newDoodle.setParameterWithAnimation(parameter, validityArray.value);
				} else {
					value = newDoodle[parameter];
					ED.errorHandler('ED.Drawing', 'addDoodle', 'Invalid value for parameter: ' + parameter);
				}

				// Add binding to the doodle (NB this will set value of new doodle to the value of the element)
				newDoodle.addBinding(parameter, this.bindingArray[_className][parameter]);

				// Trigger binding by setting parameter
				//newDoodle.setSimpleParameter(parameter, value);
				newDoodle.setParameterFromString(parameter, validityArray.value);
				newDoodle.updateDependentParameters(parameter);
				this.updateBindings(newDoodle);
			}
		}

		// Binding passed as an argument to this method
		if (typeof(_parameterBindings) != 'undefined') {
			for (var key in _parameterBindings) {
				// Add binding to the doodle
				newDoodle.addBinding(key, _parameterBindings[key]);
			}
		}

		if (newDoodle.addAtBack) {
			// This method also calls the repaint method
			this.moveToBack();
		} else {
			// Refresh drawing
			this.repaint();
		}

		// Notify
		this.notify("doodleAdded", newDoodle);

		// Run onSelection code
		this.selectedDoodle.onSelection();

		// Return doodle
		return newDoodle;
	} else {
		ED.errorHandler('ED.Drawing', 'addDoodle', 'Attempt to add a second unique doodle of class ' + _className);
		return null;
	}
}

/**
 * Takes array of bindings, and adds them to the corresponding doodles. Adds an event listener to create a doodle if it does not exist
 *
 * @param {Array} _bindingArray Associative array. Key is className, and each value is an array with key: parameter name, value: elementId
 */
ED.Drawing.prototype.addBindings = function(_bindingArray) {
	// Store binding array as part of drawing object in order to restore bindings to doodles that are deleted and added again
	this.bindingArray = _bindingArray;

	// Get reference to this drawing object (for inner function)
	var drawing = this;

	// Iterate through classNames
	for (var className in _bindingArray) {
		// Look for the first doodle of this class to bind to
		var doodle = this.firstDoodleOfClass(className);

		// Iterate through bindings for this className
		for (var parameter in _bindingArray[className]) {
			// Get reference to element
			var elementId = _bindingArray[className][parameter]['id'];
			var element = document.getElementById(elementId);

			if (element) {
				// Add an event listener to the element to create a bound doodle on change, if it does not exist
				element.addEventListener('change', (function(className) {
					return function(event) {
						if (!drawing.hasDoodleOfClass(className)) {
							drawing.addDoodle(className);
							drawing.deselectDoodles();
						}
					};
				}(className)), false);

				// Add binding to doodle if it exists
				if (doodle) {
					doodle.addBinding(parameter, _bindingArray[className][parameter]);
				}
			} else {
				ED.errorHandler('ED.Drawing', 'addBindings', 'Attempt to add binding for an element that does not exist for parameter: ' + parameter);
			}
		}
	}
}

/**
 * Takes an array of key value pairs and adds them to the boundElementDeleteValueArray
 *
 * @param {Array} _deleteValuesArray Associative array. Key is elementId, and value the value corresponding to an absent doodle
 */
ED.Drawing.prototype.addDeleteValues = function(_deleteValuesArray) {
	for (elementId in _deleteValuesArray) {
		this.boundElementDeleteValueArray[elementId] = _deleteValuesArray[elementId];
	}
}

/**
 * Called by events attached to HTML elements such as <input>
 *
 * @param {String} _type Type of event, only onchange is currently implemented
 * @param {Int} _doodleId The id of the doodle containing the binding
 * @param {String} _className The class name of the doodle containing the binding (for recreation if deleted)
 * @param {String} _elementId The id attribute of the element
 * @returns {Value} The current value of the element
 */
ED.Drawing.prototype.eventHandler = function(_type, _doodleId, _className, _elementId, _value) {
	//console.log("Event: " + _type + " doodleId: " + _doodleId + " doodleClass: " + _className + " elementId: " + _elementId + " value: " + _value);


	switch (_type) {
		case 'oninput':
		case 'onchange':
			// Get reference to associated doodle
			var doodle = this.doodleOfId(_doodleId);

			// Process event
			if (doodle) {
				// Look for value in boundElementDeleteValueArray
				if (this.boundElementDeleteValueArray[_elementId] == _value) {
					this.deleteDoodleOfId(_doodleId);
				} else {
					// Set state of drawing to be active to allow synchronisation to work when changed by bound element
					doodle.drawing.isActive = true;

					// Find key associated with the element id
					var parameter;
					for (var key in doodle.bindingArray) {
						if (doodle.bindingArray[key]['id'] == _elementId) {
							parameter = key;
						}
					}

					// Check validity of new value, only trim the value if change event
					var validityArray = doodle.validateParameter(parameter, _value, (_type === 'onchange'));

					// If new value is valid, set it
					if (validityArray.valid) {

						// [OE-4028] We do not want the doodle animation to update the bindings for the
						// following reasons:
						// 1) The form control is already set with the correct value.
						// 2) We do not want the value to update incrementally with the animation.
						var updateBindings = false;

						// Animate the doodle with the value of the form control.
						doodle.setParameterWithAnimation(parameter, validityArray.value, updateBindings);
					} else {
						ED.errorHandler('ED.Drawing', 'eventHandler', 'Attempt to change HTML element value to an invalid value for parameter ' + parameter);
					}

					// Apply new value to element if necessary
					if (_value != validityArray.value) {
						var element = document.getElementById(_elementId);
						var attribute = doodle.bindingArray[parameter]['attribute'];

						// Set the element according to the value
						switch (element.type) {
							case 'checkbox':
								if (attribute) {
									ED.errorHandler('ED.Drawing', 'eventHandler', 'Binding to a checkbox with a non-standard attribute not yet supported');
								} else {
									console.log('setting checkbox - needs testing with a suitable doodle');
									if (value == "true") {
										element.setAttribute('checked', 'checked');
									} else {
										element.removeAttribute('checked');
									}
								}
								break;

							case 'select-one':
								if (attribute) {
									for (var i = 0; i < element.length; i++) {
										if (element.options[i].getAttribute(attribute) == validityArray.value) {
											element.value = element.options[i].value;
											break;
										}
									}
								} else {
									element.value = validityArray.value;
								}
								break;

							case 'text':
								if (attribute) {
									ED.errorHandler('ED.Drawing', 'eventHandler', 'Binding to a textfield with a non-standard attribute not yet supported');
								} else {
									console.log('setting textfield - needs testing with a suitable doodle');
									element.value = validityArray.value;
								}
								break;

							default:
								if (attribute) {
									element.setAttribute(attribute, validityArray.value);
								} else {
									element.value = validityArray.value;
								}
								break;
						}
					}


					// ***TODO*** Need to reset state of drawing elsewhere, since this gets called before animation finished.
					//doodle.drawing.isActive = false;
				}
			} else {
				ED.errorHandler('ED.Drawing', 'eventHandler', 'Doodle of id: ' + _doodleId + ' no longer exists');
			}
			break;
		default:
			break;
	}
}

/**
 * Updates value of bound elements to the selected doodle. Called by methods which change parameter values
 *
 * @param {ED.Doodle} _doodle Optional doodle object to update drawings without a selected doodle
 */
ED.Drawing.prototype.updateBindings = function(_doodle) {
	var doodle = _doodle;

	// Check for an argument, otherwise take selected doodle for this drawing
	if (typeof(doodle) == 'undefined') {
		doodle = this.selectedDoodle;
	}

	// Update bindings for this doodle
	if (doodle != null) {
		// Iterate through this doodle's bindings array and alter value of HTML element
		for (var parameter in doodle.bindingArray) {
			var element = document.getElementById(doodle.bindingArray[parameter]['id']);
			var attribute = doodle.bindingArray[parameter]['attribute'];
			var value = doodle.getParameter(parameter);

			// Modify value of element according to type
			switch (element.type) {
				case 'checkbox':
					if (attribute) {
						ED.errorHandler('ED.Drawing', 'updateBindings', 'Binding to a checkbox with a non-standard attribute not yet supported');
					} else {
						if (value == "true") {
							element.setAttribute('checked', 'checked');
						} else {
							element.removeAttribute('checked');
						}
					}
					break;

				case 'select-one':
					if (attribute) {
						for (var i = 0; i < element.length; i++) {
							if (element.options[i].getAttribute(attribute) == value) {
								element.value = element.options[i].value;
								break;
							}
						}
					} else {
						element.value = value;
					}
					break;

				case 'text':
					if (attribute) {
						ED.errorHandler('ED.Drawing', 'updateBindings', 'Binding to a textfield with a non-standard attribute not yet supported');
					} else {
						element.value = value;
					}
					break;

				default:
					if (attribute) {
						element.setAttribute(attribute, value);
					} else {
						element.value = value;
					}
					break;
			}
		}
	} else {
		// Since moving updateBindings method, this is no longer an error
		//ED.errorHandler('ED.Drawing', 'updateBindings', 'Attempt to update bindings on null doodle');
	}
}

/**
 * Test if doodle of a class exists in drawing
 *
 * @param {String} _className Classname of doodle
 * @returns {Bool} True is a doodle of the class exists, otherwise false
 */
ED.Drawing.prototype.hasDoodleOfClass = function(_className) {
	var returnValue = false;

	// Go through doodle array looking for doodles of passed className
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].className == _className) {
			returnValue = true;
		}
	}

	return returnValue;
}

/** Counts number of doodles of passed class
 *
 * @param {String} _className Classname of doodle
 * @returns {Int} Number of doodles of the class
 */
ED.Drawing.prototype.numberOfDoodlesOfClass = function(_className) {
	var returnValue = 0;

	// Go through doodle array looking for doodles of passed className
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].className == _className) {
			returnValue++;
		}
	}

	return returnValue;
}

/**
 * Returns first doodle of the passed className, or false if does not exist
 *
 * @param {String} _className Classname of doodle
 * @returns {Doodle} The first doodle of the passed className
 */
ED.Drawing.prototype.firstDoodleOfClass = function(_className) {
	var returnValue = false;

	// Go through doodle array looking for doodles of passed className
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].className == _className) {
			returnValue = this.doodleArray[i];
			break;
		}
	}

	return returnValue;
}


/**
 * Returns last doodle of the passed className, or false if does not exist
 *
 * @param {String} _className Classname of doodle
 * @returns {Doodle} The last doodle of the passed className
 */
ED.Drawing.prototype.lastDoodleOfClass = function(_className) {
	var returnValue = false;

	// Go through doodle array backwards looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--) {
		if (this.doodleArray[i].className == _className) {
			returnValue = this.doodleArray[i];
			break;
		}
	}

	return returnValue;
}

/**
 * Returns all doodles of the passed className
 *
 * @param {String} _className Classname of doodle
 * @returns {Array} Array of doodles of the passed className
 */
ED.Drawing.prototype.allDoodlesOfClass = function(_className) {
	var returnValue = [];

	// Go through doodle array backwards looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--) {
		if (this.doodleArray[i].className == _className) {
			returnValue.push(this.doodleArray[i]);
		}
	}

	return returnValue;
}

/**
 * Sets a parameter value for all doodles of this class
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _className Classname of doodle
 * @param {String} _value New value of parameter
 */
ED.Drawing.prototype.setParameterValueForClass = function(_parameter, _value, _className) {
	// Go through doodle array (backwards because of splice function) looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--) {
		// Find doodles of given class name
		if (this.doodleArray[i].className == _className) {
			var doodle = this.doodleArray[i];

			// Set parameter
			doodle.setParameterWithAnimation(_parameter, _value);
		}
	}

	// Refresh drawing
	this.repaint();
}

/**
 * Returns the doodle with the corresponding id
 *
 * @param {Int} Id Id of doodle
 * @returns {Doodle} The doodle with the passed id
 */
ED.Drawing.prototype.doodleOfId = function(_id) {
	var doodle = false;

	// Go through doodle array looking for the corresponding doodle
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].id == _id) {
			doodle = this.doodleArray[i];
			break;
		}
	}

	return doodle;
}

/**
 * Deletes all doodles that are deletable
 */
ED.Drawing.prototype.deleteAllDoodles = function() {
	// Go through doodle array (backwards because of splice function)
	for (var i = this.doodleArray.length - 1; i >= 0; i--) {
		// Only delete deletable ones
		if (this.doodleArray[i].isDeletable) {
			this.deleteDoodle(this.doodleArray[i]);
		}
	}
}

/**
 * Deletes doodles of one class from the drawing
 *
 * @param {String} _className Classname of doodle
 */
ED.Drawing.prototype.deleteDoodlesOfClass = function(_className) {
	// Go through doodle array (backwards because of splice function) looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--) {
		// Find doodles of given class name
		if (this.doodleArray[i].className == _className) {
			this.deleteDoodle(this.doodleArray[i]);
		}
	}
}

/**
 * Updates a doodle with a new value of a parameter ***TODO** These two methods need updating with new notification system
 *
 * @param {Doodle} _doodle The doodle to be updated
 * @param {String} _parameter Name of the parameter
 * @param {Any} _value New value of the parameter
 */
ED.Drawing.prototype.setParameterForDoodle = function(_doodle, _parameter, _value) {
	// Determine whether doodle exists
	if (typeof(_doodle[_parameter]) != 'undefined') {
		_doodle[_parameter] = +_value;
	} else {
		_doodle.setParameterFromString(_parameter, _value);
	}

	// Save to hidden input, if exists, and refresh drawing
	if (typeof(this.saveToInputElement) != 'undefined') this.saveToInputElement();
	this.repaint();
}

/**
 * Updates a doodle of class with a vew value of a parameter. Use if only one member of a class exists
 *
 * @param {String} _className The name of the doodle class to be updated
 * @param {String} _parameter Name of the parameter
 * @param {Any} _value New value of the parameter
 */
ED.Drawing.prototype.setParameterForDoodleOfClass = function(_className, _parameter, _value) {
	// Get pointer to doodle
	var doodle = this.firstDoodleOfClass(_className);

	// Set parameter for the doodle
	doodle.setParameterWithAnimation(_parameter, _value);

	// Save to hidden input, if exists, and refresh drawing
	if (typeof(this.saveToInputElement) != 'undefined') this.saveToInputElement();
	this.repaint();
}

/**
 * Returns the total extent in degrees covered by doodles of the passed class
 *
 * @param {String} _class Class of the doodle to be updated
 * @returns {Int} Total extent in degrees, with maximum of 360
 */
ED.Drawing.prototype.totalDegreesExtent = function(_class) {
	var degrees = 0;

	// Calculate total for all doodles of this class
	for (var i = 0; i < this.doodleArray.length; i++) {
		// Find doodles of given class name
		if (this.doodleArray[i].className == _class) {
			degrees += this.doodleArray[i].degreesExtent();
		}
	}

	// Overlapping doodles do not increase total beyond 360 degrees
	if (degrees > 360) degrees = 360;

	return degrees;
}

/**
 * Suppresses reporting for all doodles currently in drawing.
 */
ED.Drawing.prototype.suppressReports = function() {
	// Iterate through all doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		this.doodleArray[i].willReport = false;
	}
}

/**
 * Returns a string containing a description of the drawing
 *
 * @returns {String} Description of the drawing
 */
ED.Drawing.prototype.report = function() {
	var returnString = "";
	var groupArray = new Array();
	var groupEndArray = new Array();

	// Go through every doodle
	for (var i = 0; i < this.doodleArray.length; i++) {
		var doodle = this.doodleArray[i];

		// Reporting can be switched off with willReport flag
		if (doodle.willReport) {
			// Check for a group description
			if (doodle.groupDescription().length > 0) {
				// Create an array entry for it or add to existing
				if (typeof(groupArray[doodle.className]) == 'undefined') {
					groupArray[doodle.className] = doodle.groupDescription();
					groupArray[doodle.className] += doodle.description();
				} else {
					// Only add additional detail if supplied by description method
					if (doodle.description().length > 0) {
						groupArray[doodle.className] += ", ";
						groupArray[doodle.className] += doodle.description();
					}
				}

				// Check if there is a corresponding end description
				if (doodle.groupDescriptionEnd().length > 0) {
					if (typeof(groupEndArray[doodle.className]) == 'undefined') {
						groupEndArray[doodle.className] = doodle.groupDescriptionEnd();
					}
				}
			} else {
				// Get description
				var description = doodle.description();

				// If its not an empty string, add to the return
				if (description.length > 0) {
					// If text there already, make it lower case and add a comma before
					if (returnString.length == 0) {
						returnString += description;
					} else {
						returnString = returnString + ", " + ED.firstLetterToLowerCase(description);
					}
				}
			}
		}
	}

	// Go through group array adding descriptions
	for (className in groupArray) {
		// Get description
		var description = groupArray[className];

		// Get end description
		var endDescription = "";
		if (typeof(groupEndArray[className]) != 'undefined') {
			endDescription = groupEndArray[className];
		}

		// Replace last comma with a comma and 'and'
		description = ED.addAndAfterLastComma(description) + endDescription;

		// If its not an empty string, add to the return
		if (description.length > 0) {
			// If text there already, make it lower case and add a comma before
			if (returnString.length == 0) {
				returnString += description;
			} else {
				returnString = returnString + ", " + ED.firstLetterToLowerCase(description);
			}
		}
	}

	// Return result
	return returnString;
}


/**
 * Returns a SNOMED diagnostic code derived from the drawing, returns empty array if no code
 *
 * @returns {Int} SnoMed code of doodle with highest position in hierarchy
 */
ED.Drawing.prototype.diagnosis = function() {
	var topOfHierarchy = 0;
	var returnCodes = new Array();

	// Loop through doodles with diagnoses, taking one highest in hierarchy, or those that are equal
	for (var i = 0; i < this.doodleArray.length; i++) {
		var doodle = this.doodleArray[i];
		var code = doodle.snomedCode();
		if (code > 0) {
			var codePosition = doodle.diagnosticHierarchy();
			if (codePosition > topOfHierarchy) {
				topOfHierarchy = codePosition;
				returnCodes.push(code);
			} else if (codePosition == topOfHierarchy) {
				if (returnCodes.indexOf(code) < 0) {
					returnCodes.push(code);
				}
			}
		}
	}

	return returnCodes;
}

/**
 * Changes value of eye
 *
 * @param {String} _eye Eye to change to
 */
ED.Drawing.prototype.setEye = function(_eye) {
	// Change eye
	if (_eye == "Right") this.eye = ED.eye.Right;
	if (_eye == "Left") this.eye = ED.eye.Left;

	// Refresh drawing
	this.repaint();
}

/**
 * Clears canvas and sets context
 */
ED.Drawing.prototype.clear = function() {
	// Resetting a dimension attribute clears the canvas and resets the context
	this.canvas.width = this.canvas.width;

	// But, might not clear canvas, so do it explicitly
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// Set context transform to map from doodle plane to canvas plane
	this.context.translate(this.canvas.width / 2, this.canvas.height / 2);

	this.context.scale(this.scale, this.scale);
}

/**
 * Clears canvas and draws all doodles
 */
ED.Drawing.prototype.repaint = function() {
	// Clear canvas
	this.clear();

	// Draw background image (In doodle space because of transform)
	if (typeof(this.image) != 'undefined') {
		if (this.image.width >= this.image.height) {
			var height = 1000 * this.image.height / this.image.width;
			this.context.drawImage(this.image, -500, -height / 2, 1000, height);
		} else {
			var width = 1000 * this.image.width / this.image.height;
			this.context.drawImage(this.image, -width / 2, -500, width, 1000);
		}
	}

	// Redraw all doodles
	this.drawAllDoodles();

	// Go through doodles unsetting and then setting property display
	for (var i = 0; i < this.doodleArray.length; i++) {
		this.doodleArray[i].setDisplayOfParameterControls(false);
	}
	if (this.selectedDoodle != null) {
		this.selectedDoodle.setDisplayOfParameterControls(true);
	}

	// ***TODO*** ask Mark what this code is for
	if (!this.modified) {
		this.modified = true;
	}

	// Draw selection frame
	if (this.selectionRectangleIsBeingDragged) {
		// Get context
		var ctx = this.context;

		// Boundary path
		ctx.beginPath();

		// Square
		ctx.moveTo(this.selectionRectangleStart.x, this.selectionRectangleStart.y);
		ctx.lineTo(this.selectionRectangleEnd.x, this.selectionRectangleStart.y);
		ctx.lineTo(this.selectionRectangleEnd.x, this.selectionRectangleEnd.y);
		ctx.lineTo(this.selectionRectangleStart.x, this.selectionRectangleEnd.y);

		// Close path
		ctx.closePath();

		// Set line attributes
		ctx.lineWidth = 1;
		ctx.strokeStyle = "gray";

		ctx.stroke();
	}

	// Notify
	this.notify("drawingRepainted");
}

/**
 * Calculates angle between three points (clockwise from _pointA to _pointB in radians)
 *
 * @param {Point} _pointA First point
 * @param {Point} _pointM Mid point
 * @param {Point} _pointB Last point
 * @returns {Float} Angle between three points in radians (clockwise)
 */
ED.Drawing.prototype.innerAngle = function(_pointA, _pointM, _pointB) {
	// Get vectors from midpoint to A and B
	var a = new ED.Point(_pointA.x - _pointM.x, _pointA.y - _pointM.y);
	var b = new ED.Point(_pointB.x - _pointM.x, _pointB.y - _pointM.y);

	return a.clockwiseAngleTo(b);
}

/**
 * Toggles drawing state for drawing points in line
 */
ED.Drawing.prototype.togglePointInLine = function() {
	if (this.newPointOnClick) {
		this.newPointOnClick = false;
		this.completeLine = true;
		this.deselectDoodles();
		this.repaint();
	} else {
		this.newPointOnClick = true;
		this.completeLine = false;
	}
}

/**
 * Generates a numeric id guaranteed to be unique for the lifetime of the drawing object
 * (Index of doodleArray could be repeated if a doodle is deleted before adding another)
 *
 * @returns {Int} Id of next doodle
 */
ED.Drawing.prototype.nextDoodleId = function() {
	return this.lastDoodleId++;
}

ED.Drawing.prototype.getScaleLevel = function() {
	return this.globalScaleFactor;
};

/**
 * Changes the drawing colour of freehand drawing
 *
 * @param {Object} _colour Colour object
 * @returns {String} _hexColour A string describing the colour to use for freehand drawing
 */
// ED.Drawing.prototype.setSquiggleColour = function(_colour) {
// 	this.squiggleColour = _colour;
//
// 	this.refreshSquiggleSettings()
// }

/**
 * Changes the line width for freehand drawing
 *
 * @returns {Int} _hexColour A number describing the width
 */
// ED.Drawing.prototype.setSquiggleWidth = function(_width) {
// 	this.squiggleWidth = _width;
//
// 	this.refreshSquiggleSettings()
// }

/**
 * Changes the line width for freehand drawing
 *
 * @returns {int} _style A string describing the style to use for freehand drawing
 */
// ED.Drawing.prototype.setSquiggleStyle = function(_style) {
// 	this.squiggleStyle = _style;
//
// 	this.refreshSquiggleSettings()
// }

/**
 * Refreshes the display of settings for freehand drawing
 *
 * @returns {String} _hexColour A string describing the colour to use for freehand drawing
 */
// ED.Drawing.prototype.refreshSquiggleSettings = function() {
// 	// Get reference to canvas
// 	var displayCanvas = document.getElementById("squiggleSettings" + this.idSuffix);
//
// 	if (displayCanvas) {
// 		// Get context
// 		var ctx = displayCanvas.getContext('2d');
//
// 		// Reset canvas
// 		displayCanvas.width = displayCanvas.width;
// 		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//
// 		// Set colours
// 		ctx.strokeStyle = this.squiggleColour.rgba();
// 		ctx.fillStyle = this.squiggleColour.rgba();;
//
// 		// Line width
// 		ctx.beginPath();
// 		ctx.moveTo(3, 8);
// 		ctx.lineTo(20, 8);
// 		ctx.lineWidth = this.squiggleWidth / 2;
// 		ctx.stroke();
//
// 		// Outline or solid
// 		ctx.beginPath();
// 		ctx.rect(5, 19, 13, 8);
// 		ctx.lineWidth = 3;
// 		ctx.stroke();
// 		if (this.squiggleStyle == ED.squiggleStyle.Solid) {
// 			ctx.fill();
// 		}
// 	}
// }

///**
// * Static class to implement groups of doodles
// *
// * @returns {String}
// */
//ED.DoodleGroups =
//{
//    bar: function (val)
//    {
//        console.log(val);
//    },
//    foo: 2
//}
//
//ED.DoodleGroups.foo = 4;
