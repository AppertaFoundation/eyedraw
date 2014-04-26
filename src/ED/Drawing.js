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

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
var ED = new Object();

/**
 * Radius of inner handle displayed with selected doodle
 * @constant
 */
ED.handleRadius = 15;

/**
 * Distance in doodle plane moved by pressing an arrow key
 * @constant
 */
ED.arrowDelta = 4;

/**
 * SquiggleWidth
 */
ED.squiggleWidth = {
	Thin: 4,
	Medium: 12,
	Thick: 20
}

/**
 * SquiggleStyle
 */
ED.squiggleStyle = {
	Outline: 0,
	Solid: 1
}

/**
 * Flag to detect double clicks
 */
ED.recentClick = false;

/**
 * Eye (Some doodles behave differently according to side)
 */
ED.eye = {
	Right: 0,
	Left: 1
}

/**
 * Draw function mode (Canvas pointInPath function requires a path)
 */
ED.drawFunctionMode = {
	Draw: 0,
	HitTest: 1
}

/**
 * Mouse dragging mode
 */
ED.Mode = {
	None: 0,
	Move: 1,
	Scale: 2,
	Arc: 3,
	Rotate: 4,
	Apex: 5,
	Handles: 6,
	Draw: 7,
	Select: 8,
	Size: 9
}

/**
 * Handle ring
 */
ED.handleRing = {
	Inner: 0,
	Outer: 1
}

/**
 * Flag to indicate when the drawing has been modified
 */
ED.modified = false;

/*
 * Chris Raettig's function for getting accurate mouse position in all browsers
 *
 * @param {Object} obj Object to get offset for, usually canvas object
 * @returns {Object} x and y values of offset
 */
ED.findOffset = function(obj, curleft, curtop) {
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return {
			left: curleft,
			top: curtop
		};
	}
}

ED.findPosition = function(obj, event) {
	if (typeof jQuery != 'undefined') {
		var offset = jQuery(obj).offset();
	} else {
		var offset = ED.findOffset(obj, 0, 0);
	}
	return {
		x: event.pageX - offset.left,
		y: event.pageY - offset.top
	};
}

/*
 * Function to test whether a Javascript object is empty
 *
 * @param {Object} _object Object to apply test to
 * @returns {Bool} Indicates whether object is empty or not
 */
ED.objectIsEmpty = function(_object) {
	for (var property in _object) {
		if (_object.hasOwnProperty(property)) return false;
	}

	return true;
}

/*
 * Returns true if browser is firefox
 *
 * @returns {Bool} True is browser is firefox
 */
ED.isFirefox = function() {
	var index = 0;
	var ua = window.navigator.userAgent;
	index = ua.indexOf("Firefox");

	if (index > 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns 'true' remainder of a number divided by a modulus (i.e. always positive, unlike x%y)
 *
 * @param {Float} _x number
 * @param {Float} _y modulus
 * @returns {Float} True modulus of _x/_y
 */
ED.Mod = function Mod(_x, _y) {
	return _x - Math.floor(_x / _y) * _y;
}

/**
 * Converts an angle (positive or negative) into a positive angle (ie a bearing)
 *
 * @param {Float} _angle Angle in radians
 * @returns {Float} Positive angle between 0 and 2 * Pi
 */
ED.positiveAngle = function(_angle) {
	var circle = 2 * Math.PI;

	// First make it positive
	while (_angle < 0) {
		_angle += circle;
	}

	// Return remainder
	return _angle % circle;
}

/**
 * Error handler
 *
 * @param {String} _class Class
 * @param {String} _method Method
 * @param {String} _message Error message
 */
ED.errorHandler = function(_class, _method, _message) {
	console.log('EYEDRAW ERROR! class: [' + _class + '] method: [' + _method + '] message: [' + _message + ']');
}

/**
 * Array of 200 random numbers
 */
ED.randomArray = [0.6570, 0.2886, 0.7388, 0.1621, 0.9896, 0.0434, 0.1695, 0.9099, 0.1948, 0.4433, 0.1580, 0.7392, 0.8730, 0.2165, 0.7138, 0.6316, 0.3425, 0.2838, 0.4551, 0.4153, 0.7421, 0.3364, 0.6087, 0.1986, 0.5764, 0.1952, 0.6179, 0.6699, 0.0903, 0.2968, 0.2684, 0.9383, 0.2488, 0.4579, 0.2921, 0.9085, 0.7951, 0.4500, 0.2255, 0.3366, 0.6670, 0.7300, 0.5511, 0.5623, 0.1376, 0.5553, 0.9898, 0.4317, 0.5922, 0.6452, 0.5008, 0.7077, 0.0704, 0.2293, 0.5697, 0.7415, 0.1557, 0.2944, 0.4566, 0.4129, 0.2449, 0.5620, 0.4105, 0.5486, 0.8917, 0.9346, 0.0921, 0.7998, 0.7717, 0.0357, 0.1179, 0.0168, 0.1520, 0.5187, 0.3466, 0.1663, 0.5935, 0.7524, 0.8410, 0.1859, 0.6012, 0.8171, 0.9272, 0.3367, 0.8133, 0.4868, 0.3665, 0.9625, 0.7839, 0.3052, 0.1651, 0.6414, 0.7361, 0.0065, 0.3267, 0.0554, 0.3389, 0.8967, 0.8777, 0.0557, 0.9201, 0.6015, 0.2676, 0.3365, 0.2606, 0.0989, 0.2085, 0.3526, 0.8476, 0.0146, 0.0190, 0.6896, 0.5198, 0.9871, 0.0288, 0.8037, 0.6741, 0.2148, 0.2584, 0.8447, 0.8480, 0.5557, 0.2480, 0.4736, 0.8869, 0.1867, 0.3869, 0.6871, 0.1011, 0.7561, 0.7340, 0.1525, 0.9968, 0.8179, 0.7103, 0.5462, 0.4150, 0.4187, 0.0478, 0.6511, 0.0386, 0.5243, 0.7271, 0.9093, 0.4461, 0.1264, 0.0756, 0.9405, 0.7287, 0.0684, 0.2820, 0.4059, 0.3694, 0.7641, 0.4188, 0.0498, 0.7841, 0.9136, 0.6210, 0.2249, 0.9935, 0.9709, 0.0741, 0.6218, 0.3166, 0.2237, 0.7754, 0.4191, 0.2195, 0.2935, 0.4529, 0.9112, 0.9183, 0.3275, 0.1856, 0.8345, 0.0442, 0.6297, 0.9030, 0.4689, 0.9512, 0.2219, 0.9993, 0.8981, 0.1018, 0.9362, 0.6426, 0.4563, 0.1267, 0.7889, 0.5057, 0.8588, 0.4669, 0.0687, 0.6623, 0.3681, 0.8152, 0.9004, 0.0822, 0.3652];

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
	// Defaults for optional parameters
	var offsetX = 0;
	var offsetY = 0;
	var toImage = false;
	this.controllerFunctionName = 'eyeDrawController';
	this.graphicsPath = 'img/';
	this.scaleOn = 'height';

	// If optional parameters exist, use them instead
	if (typeof(_options) != 'undefined') {
		if (_options['offsetX']) offsetX = _options['offsetX'];
		if (_options['offsetY']) offsetY = _options['offsetY'];
		if (_options['toImage']) toImage = _options['toImage'];
		if (_options['controllerFunctionName']) this.controllerFunctionName = _options['controllerFunctionName'];
		if (_options['graphicsPath']) this.graphicsPath = _options['graphicsPath'];
		if (_options['scaleOn']) this.scaleOn = _options['scaleOn'];
	}

	// Initialise properties
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
	this.globalScaleFactor = 1;
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

	// Get reference to button elements
	this.moveToFrontButton = document.getElementById('moveToFront' + this.idSuffix);
	this.moveToBackButton = document.getElementById('moveToBack' + this.idSuffix);
	this.flipVerButton = document.getElementById('flipVer' + this.idSuffix);
	this.flipHorButton = document.getElementById('flipHor' + this.idSuffix);
	this.deleteSelectedDoodleButton = document.getElementById('deleteSelectedDoodle' + this.idSuffix);
	this.lockButton = document.getElementById('lock' + this.idSuffix);
	this.unlockButton = document.getElementById('unlock' + this.idSuffix);
	//this.squiggleSpan = document.getElementById('squiggleSpan' + this.idSuffix);
	//this.colourPreview = document.getElementById('colourPreview' + this.idSuffix);
	//this.fillRadio = document.getElementById('fillRadio' + this.idSuffix);
	//this.thickness = document.getElementById('thicknessSelect' + this.idSuffix);

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
	this.preLoadImagesFrom(this.graphicsPath);
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
		this.imageArray[key].onerror = function() {
			ED.errorHandler('ED.Drawing', 'preLoadImagesFrom', 'Error loading image files from directory: ' + _path);
		}

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
	this.notificationArray[this.notificationArray.length] = {
		object: _object,
		methodName: _methodName,
		notificationList: _notificationList
	};
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

	// Call method on each registered object
	for (var i = 0; i < this.notificationArray.length; i++) {
		// Assign to variables to make code easier to read
		var list = this.notificationArray[i]['notificationList'];
		var object = this.notificationArray[i]['object'];
		var methodName = this.notificationArray[i]['methodName'];

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

		// Apply global scale factor
		this.doodleArray[i].scaleX = this.doodleArray[i].scaleX * this.globalScaleFactor;
		this.doodleArray[i].scaleY = this.doodleArray[i].scaleY * this.globalScaleFactor;
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
				if (this.doodleArray[i].isSelectable && !this.doodleArray[i].isLocked) {
					// If double clicked, go into drawing mode
					if (this.doubleClick && this.doodleArray[i].isSelected && this.doodleArray[i].isDrawable) {
						this.doodleArray[i].isForDrawing = true;
					}

					this.doodleArray[i].isSelected = true;
					this.selectedDoodle = this.doodleArray[i];
					found = true;

					// Check if newly selected
					if (this.lastSelectedDoodle != this.selectedDoodle) {
						// Run onDeselection code for last doodle
						if (this.lastSelectedDoodle) this.lastSelectedDoodle.onDeselection();

						// Run onSelection code
						this.selectedDoodle.onSelection();

						// Notify
						this.notify("doodleSelected");
					}

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

	// Get selected doodle
	var doodle = this.selectedDoodle;

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
							newScaleX = doodle.parameterValidationArray['scaleX']['range'].constrain(Math.abs(newScaleX));
							newScaleY = doodle.parameterValidationArray['scaleY']['range'].constrain(Math.abs(newScaleY));

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
					console.log('Selecting ', p.x, p.y);
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
	if (this.selectedDoodle != null) {
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

	//    if (_element.checked)
	//    {
	//        console.log('YES');
	//    }
	//    else
	//    {
	//        console.log('NO');
	//    }
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
	if (this.selectedDoodle != null) {
		// Go through doodles locking any that are selected
		for (var i = 0; i < this.doodleArray.length; i++) {
			if (this.doodleArray[i].isSelected) {
				this.doodleArray[i].isLocked = true;
				this.doodleArray[i].isSelected = false;
				this.selectedDoodle = null;
			}
		}

		// Refresh canvas
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

	// Refresh canvas
	this.repaint();
}

/**
 * Deselect any selected doodles
 */
ED.Drawing.prototype.deselectDoodles = function() {
	// Deselect all doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		this.doodleArray[i].isSelected = false;
	}

	if (this.selectedDoodle) this.selectedDoodle.onDeselection();
	this.selectedDoodle = null;

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

	// Deselect doodles
	this.deselectDoodles();

	// Iterate through doodles
	for (var i = 0; i < this.doodleArray.length; i++) {
		if (this.doodleArray[i].id == _doodleId) {
			selectedIndex = i;
		}
	}

	if (selectedIndex >= 0) {
		this.doodleArray[selectedIndex].isSelected = true;
		this.selectedDoodle = this.doodleArray[selectedIndex];
		this.selectedDoodle.onSelection();

		// Refresh drawing
		this.repaint();
	}
}

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

		// Apply global scale factor
		newDoodle.scaleX = newDoodle.scaleX * this.globalScaleFactor;
		newDoodle.scaleY = newDoodle.scaleY * this.globalScaleFactor;

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

		// Run onSelection code
		this.selectedDoodle.onSelection();

		// Notify
		this.notify("doodleAdded", newDoodle);

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
		// Onchange event
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

					// Check validity of new value
					var validityArray = doodle.validateParameter(parameter, _value);

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

// Checks that the value is numeric http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
ED.isNumeric = function(_value) {
	return (_value - 0) == _value && _value.length > 0;
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
						returnString = returnString + ", " + description.firstLetterToLowerCase();
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
		description = description.addAndAfterLastComma() + endDescription;

		// If its not an empty string, add to the return
		if (description.length > 0) {
			// If text there already, make it lower case and add a comma before
			if (returnString.length == 0) {
				returnString += description;
			} else {
				returnString = returnString + ", " + description.firstLetterToLowerCase();
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

	// Enable or disable buttons which work on selected doodle
	if (this.selectedDoodle != null) {
		if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = false;
		if (this.moveToBackButton !== null) this.moveToBackButton.disabled = false;
		if (this.flipVerButton !== null) this.flipVerButton.disabled = false;
		if (this.flipHorButton !== null) this.flipHorButton.disabled = false;
		if (this.deleteSelectedDoodleButton !== null && this.selectedDoodle.isDeletable) this.deleteSelectedDoodleButton.disabled = false;
		if (this.lockButton !== null) this.lockButton.disabled = false;
		//if (this.squiggleSpan !== null && this.selectedDoodle.isDrawable) this.squiggleSpan.style.display = "inline-block";
	} else {
		if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = true;
		if (this.moveToBackButton !== null) this.moveToBackButton.disabled = true;
		if (this.flipVerButton !== null) this.flipVerButton.disabled = true;
		if (this.flipHorButton !== null) this.flipHorButton.disabled = true;
		if (this.deleteSelectedDoodleButton !== null) this.deleteSelectedDoodleButton.disabled = true;
		if (this.lockButton !== null) this.lockButton.disabled = true;
		//if (this.squiggleSpan !== null) this.squiggleSpan.style.display = "none";
	}

	// Go through doodles looking for any that are locked and enable/disable unlock button
	if (this.unlockButton != null) {
		this.unlockButton.disabled = true;
		for (var i = 0; i < this.doodleArray.length; i++) {
			if (this.doodleArray[i].isLocked) {
				this.unlockButton.disabled = false;
				break;
			}
		}
	}

	// Get reference to doodle toolbar
	var doodleToolbar = document.getElementById(this.canvas.id + 'doodleToolbar');
	if (doodleToolbar) {
		// Iterate through all buttons activating them
		var buttonArray = doodleToolbar.getElementsByTagName('button');
		for (var i = 0; i < buttonArray.length; i++) {
			buttonArray[i].disabled = false;
		}

		// Go through doodles looking for any that unique, and disable the corresponding add button
		for (var i = 0; i < this.doodleArray.length; i++) {
			// Button ID is concatenation of class name and id suffix
			var addButton = document.getElementById(this.doodleArray[i].className + this.idSuffix);
			if (addButton) {
				addButton.disabled = this.doodleArray[i].isUnique;
			}
		}
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

/**
 * An object of the Report class is used to extract data for the Royal College of Ophthalmologists retinal detachment dataset.
 * The object analyses an EyeDraw drawing, and sets the value of HTML elements on the page accordingly.
 *
 * @class Report
 * @property {Canvas} canvas A canvas element used to edit and display the drawing
 * @property {Int} breaksInAttached The number of retinal breaks in attached retina
 * @property {Int} breaksInDetached The number of retinal breaks in detached retina
 * @property {String} largestBreakType The type of the largest retinal break
 * @property {Int} largestBreakSize The size in clock hours of the largest retinal break
 * @property {Int} lowestBreakPosition The lowest position of any break in clock hours
 * @property {String} pvrType The type of PVR
 * @property {Int} pvrCClockHours The number of clock hours of posterior PVR type C
 * @property {Int} antPvrClockHours The number of clock hours of anterior PVR
 * @param Drawing _drawing The drawing object to be analysed
 */
ED.Report = function(_drawing) {
	// Properties
	this.drawing = _drawing;
	this.breaksInAttached = 0;
	this.breaksInDetached = 0;
	this.largestBreakType = 'Not found';
	this.largestBreakSize = 0;
	this.lowestBreakPosition = 12;
	this.pvrType = 'None';
	this.pvrCClockHours = 0;
	this.antPvrClockHours = 0;

	// Variables
	var pvrCDegrees = 0;
	var AntPvrDegrees = 0;
	var minDegreesFromSix = 180;

	// Create array of doodle classes which are retinal breaks
	var breakClassArray = new Array();
	breakClassArray["UTear"] = "U tear";
	breakClassArray["RoundHole"] = "Round hole";
	breakClassArray["Dialysis"] = "Dialysis";
	breakClassArray["GRT"] = "GRT";
	breakClassArray["MacularHole"] = "Macular hole";
	breakClassArray["OuterLeafBreak"] = "Outer Leaf Break";

	// Array of RRD doodles
	this.rrdArray = new Array();

	// First iteration to create array of retinal detachments
	var i, doodle;
	for (i = 0; i < this.drawing.doodleArray.length; i++) {
		doodle = this.drawing.doodleArray[i];

		// If its a RRD, add to RRD array
		if (doodle.className == "RRD") {
			this.rrdArray.push(doodle);
		}
	}

	// Second iteration for other doodles
	for (i = 0; i < this.drawing.doodleArray.length; i++) {
		doodle = this.drawing.doodleArray[i];

		// Star fold - PVR C
		if (doodle.className == "StarFold") {
			this.pvrType = 'C';
			pvrCDegrees += doodle.arc * 180 / Math.PI;
		}
		// Anterior PVR
		else if (doodle.className == "AntPVR") {
			this.pvrType = 'C';
			AntPvrDegrees += doodle.arc * 180 / Math.PI;
		}
		// Retinal breaks
		else if (doodle.className in breakClassArray) {
			// Bearing of break is calculated in two different ways
			var breakBearing = 0;
			if (doodle.className == "UTear" || doodle.className == "RoundHole" || doodle.className == "OuterLeafBreak") {
				breakBearing = (Math.round(Math.atan2(doodle.originX, -doodle.originY) * 180 / Math.PI) + 360) % 360;
			} else {
				breakBearing = (Math.round(doodle.rotation * 180 / Math.PI + 360)) % 360;
			}

			// Bool if break is in detached retina
			var inDetached = this.inDetachment(breakBearing);

			// Increment totals
			if (inDetached) {
				this.breaksInDetached++;
			} else {
				this.breaksInAttached++;
			}

			// Get largest break in radians
			if (inDetached && doodle.arc > this.largestBreakSize) {
				this.largestBreakSize = doodle.arc;
				this.largestBreakType = breakClassArray[doodle.className];
			}

			// Get lowest break
			var degreesFromSix = Math.abs(breakBearing - 180);

			if (inDetached && degreesFromSix < minDegreesFromSix) {
				minDegreesFromSix = degreesFromSix;

				// convert to clock hours
				var bearing = breakBearing + 15;
				remainder = bearing % 30;
				this.lowestBreakPosition = Math.floor((bearing - remainder) / 30);
				if (this.lowestBreakPosition == 0) this.lowestBreakPosition = 12;
			}
		}
	}

	// Star folds integer result (round up to one clock hour)
	pvrCDegrees += 25;
	var remainder = pvrCDegrees % 30;
	this.pvrCClockHours = Math.floor((pvrCDegrees - remainder) / 30);

	// Anterior PVR clock hours
	AntPvrDegrees += 25;
	remainder = AntPvrDegrees % 30;
	this.antPvrClockHours = Math.floor((AntPvrDegrees - remainder) / 30);

	// Convert largest break size to clockhours
	var size = this.largestBreakSize * 180 / Math.PI + 25;
	var remainder = size % 30;
	this.largestBreakSize = Math.floor((size - remainder) / 30);
}

/**
 * Accepts a bearing in degrees (0 is at 12 o'clock) and returns true if it is in an area of detachment
 *
 * @param {Float} _angle Bearing in degrees
 * @returns {Bool} True is the bearing intersects with an area of retinal deatchment
 */
ED.Report.prototype.inDetachment = function(_angle) {
	var returnValue = false;

	// Iterate through retinal detachments
	for (key in this.rrdArray) {
		var rrd = this.rrdArray[key];

		// Get start and finish bearings of detachment in degrees
		var min = (rrd.rotation - rrd.arc / 2) * 180 / Math.PI;
		var max = (rrd.rotation + rrd.arc / 2) * 180 / Math.PI;

		// Convert to positive numbers
		var min = (min + 360) % 360;
		var max = (max + 360) % 360;

		// Handle according to whether RRD straddles 12 o'clock
		if (max < min) {
			if ((0 <= _angle && _angle <= max) || (min <= _angle && _angle <= 360)) {
				returnValue = true;
			}
		} else if (max == min) // Case if detachment is total
		{
			return true;
		} else {
			if (min <= _angle && _angle <= max) {
				returnValue = true;
			}
		}
	}

	return returnValue;
}

/**
 * Extent of RRD in clock hours
 *
 * @returns {Array} An array of extents (1 to 3 clock hours) for each quadrant
 */
ED.Report.prototype.extent = function() {
	// Array of extents by quadrant
	var extentArray = new Array();
	if (this.drawing.eye == ED.eye.Right) {
		extentArray["SN"] = 0;
		extentArray["IN"] = 0;
		extentArray["IT"] = 0;
		extentArray["ST"] = 0;
	} else {
		extentArray["ST"] = 0;
		extentArray["IT"] = 0;
		extentArray["IN"] = 0;
		extentArray["SN"] = 0;
	}

	// get middle of first hour in degrees
	var midHour = 15;

	// Go through each quadrant counting extent of detachment
	for (quadrant in extentArray) {
		for (var i = 0; i < 3; i++) {
			var addition = this.inDetachment(midHour) ? 1 : 0;
			extentArray[quadrant] = extentArray[quadrant] + addition;
			midHour = midHour + 30;
		}
	}

	return extentArray;
}

/**
 * Returns true if the macular is off
 *
 * @returns {Bool} True if the macula is off
 */
ED.Report.prototype.isMacOff = function() {
	var result = false;

	// Iterate through each detachment, one macoff is enough
	for (key in this.rrdArray) {
		var rrd = this.rrdArray[key];
		if (rrd.isMacOff()) result = true;
	}

	return result;
}

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
	if (typeof(_drawing) != 'undefined') {
		// Drawing containing this doodle
		this.drawing = _drawing;

		// Unique ID of doodle within this drawing
		this.id = this.drawing.nextDoodleId();

		// Optional rray of squiggles
		this.squiggleArray = new Array();

		// Transform used to draw doodle (includes additional transforms specific to the doodle)
		this.transform = new ED.AffineTransform();
		this.inverseTransform = new ED.AffineTransform();

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
		this.handleArray[0] = new ED.Handle(new ED.Point(-50, 50), false, ED.Mode.Scale, false);
		this.handleArray[1] = new ED.Handle(new ED.Point(-50, -50), false, ED.Mode.Scale, false);
		this.handleArray[2] = new ED.Handle(new ED.Point(50, -50), false, ED.Mode.Scale, false);
		this.handleArray[3] = new ED.Handle(new ED.Point(50, 50), false, ED.Mode.Scale, false);
		this.handleArray[4] = new ED.Handle(new ED.Point(this.apexX, this.apexY), false, ED.Mode.Apex, false);
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
		var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX + x);
		var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY + y);

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
		var controlDiv = document.getElementById(this.drawing.canvas.id + '_' + 'controls');

		for (var parameter in this.controlParameterArray) {
			// Create element and add to control bar
			var element = this.parameterElement(parameter);
			controlDiv.appendChild(element);

			// Add binding
			this.addBinding(parameter, {id:this.parameterControlElementId(parameter)});
		}
	}
}

/**
 * Runs when doodle is deselected by the user
 */
ED.Doodle.prototype.onDeselection = function() {
	// Hide control bar
	if (this.drawing.showDoodleControls) {
		// Remove all bindings
		for (var parameter in this.controlParameterArray) {
			this.removeBinding(parameter);
		}

		// Remove all child elements in control div
		var controlDiv = document.getElementById(this.drawing.canvas.id + '_' + 'controls');
		while(controlDiv.hasChildNodes()){
			controlDiv.removeChild(controlDiv.lastChild);
		}
	}
}

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

				// String to output
				var o;

				// Special treatment according to parameter
				if (p == 'scaleX' || p == 'scaleY') {
					o = this[p].toFixed(2);
				} else if (p == 'arc' || p == 'rotation') {
					o = (this[p] * 180 / Math.PI).toFixed(0);
				} else if (p == 'originX' || p == 'originY' || p == 'radius' || p == 'apexX' || p == 'apexY' || p == 'width' || p == 'height') {
					o = this[p].toFixed(0);
				} else if (typeof(this[p]) == 'number') {
					o = this[p].toFixed(2);
				} else if (typeof(this[p]) == 'string') {
					o = '"' + this[p] + '"';
				} else if (typeof(this[p]) == 'boolean') {
					o = this[p];
				} else if (typeof(this[p]) == 'object') {
					o = JSON.stringify(this[p]);
				} else {
					ED.errorHandler('ED.Doodle', 'json', 'Attempt to create json for an unhandled parameter type: ' + typeof(this[p]));
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
}

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
ED.Handle = function(_location, _isVisible, _mode, _isRotatable) {
	// Properties
	if (_location == null) {
		this.location = new ED.Point(0, 0);
	} else {
		this.location = _location;
	}
	this.isVisible = _isVisible;
	this.mode = _mode;
	this.isRotatable = _isRotatable;
}


/**
 * Represents a range of numerical values
 *
 * @class Range
 * @property {Float} min Minimum value
 * @property {Float} max Maximum value
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range = function(_min, _max) {
	// Properties
	this.min = _min;
	this.max = _max;
}

/**
 * Set min and max with one function call
 *
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range.prototype.setMinAndMax = function(_min, _max) {
	// Set properties
	this.min = _min;
	this.max = _max;
}

/**
 * Returns true if the parameter is less than the minimum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is less than the minimum
 */
ED.Range.prototype.isBelow = function(_num) {
	if (_num < this.min) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns true if the parameter is more than the maximum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is more than the maximum
 */
ED.Range.prototype.isAbove = function(_num) {
	if (_num > this.max) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns true if the parameter is inclusively within the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includes = function(_num) {
	if (_num < this.min || _num > this.max) {
		return false;
	} else {
		return true;
	}
}

/**
 * Constrains a value to the limits of the range
 *
 * @param {Float} _num
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrain = function(_num) {
	if (_num < this.min) {
		return this.min;
	} else if (_num > this.max) {
		return this.max;
	} else {
		return _num;
	}
}

/**
 * Returns true if the parameter is within the 'clockface' range represented by the min and max values
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includesInAngularRange = function(_angle, _isDegrees) {
	// Arbitrary radius
	var r = 100;

	// Points representing vectos of angles within range
	var min = new ED.Point(0, 0);
	var max = new ED.Point(0, 0);
	var angle = new ED.Point(0, 0);

	// Set points using polar coordinates
	if (!_isDegrees) {
		min.setWithPolars(r, this.min);
		max.setWithPolars(r, this.max);
		angle.setWithPolars(r, _angle);
	} else {
		min.setWithPolars(r, this.min * Math.PI / 180);
		max.setWithPolars(r, this.max * Math.PI / 180);
		angle.setWithPolars(r, _angle * Math.PI / 180);
	}

	return (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max));
}

/**
 * Constrains a value to the limits of the angular range
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrainToAngularRange = function(_angle, _isDegrees) {
	// No point in constraining unless range is less than 360 degrees!
	if ((this.max - this.min) < (_isDegrees ? 360 : (2 * Math.PI))) {
		// Arbitrary radius
		var r = 100;

		// Points representing vectors of angles within range
		var min = new ED.Point(0, 0);
		var max = new ED.Point(0, 0);
		var angle = new ED.Point(0, 0);

		// Set points using polar coordinates
		if (!_isDegrees) {
			min.setWithPolars(r, this.min);
			max.setWithPolars(r, this.max);
			angle.setWithPolars(r, _angle);
		} else {
			min.setWithPolars(r, this.min * Math.PI / 180);
			max.setWithPolars(r, this.max * Math.PI / 180);
			angle.setWithPolars(r, _angle * Math.PI / 180);
		}

		// Return appropriate value depending on relationship to range
		if (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max)) {
			return _angle;
		} else {
			if (angle.clockwiseAngleTo(min) < max.clockwiseAngleTo(angle)) {
				return this.min;
			} else {
				return this.max;
			}
		}
	} else {
		return _angle;
	}
}

/**
 * Represents a point in two dimensional space
 * @class Point
 * @property {Int} x The x-coordinate of the point
 * @property {Int} y The y-coordinate of the point
 * @property {Array} components Array representing point in matrix notation
 * @param {Float} _x
 * @param {Float} _y
 */
ED.Point = function(_x, _y) {
	// Properties
	this.x = Math.round(+_x);
	this.y = Math.round(+_y);
	this.components = [this.x, this.y, 1];
}

/**
 * Sets properties of the point using polar coordinates
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _p Angle in radians from North going clockwise
 */
ED.Point.prototype.setWithPolars = function(_r, _p) {
	this.x = Math.round(_r * Math.sin(_p));
	this.y = Math.round(-_r * Math.cos(_p));
}

/**
 * Sets x and y of the point
 *
 * @param {Float} _x value of x
 * @param {Float} _y value of y
 */
ED.Point.prototype.setCoordinates = function(_x, _y) {
	this.x = _x;
	this.y = _y;
}

/**
 * Calculates the distance between this point and another
 *
 * @param {Point} _point
 * @returns {Float} Distance from the passed point
 */
ED.Point.prototype.distanceTo = function(_point) {
	return Math.sqrt(Math.pow(this.x - _point.x, 2) + Math.pow(this.y - _point.y, 2));
}

/**
 * Calculates the dot product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The dot product
 */
ED.Point.prototype.dotProduct = function(_point) {
	return this.x * _point.x + this.y * _point.y;
}

/**
 * Calculates the cross product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The cross product
 */
ED.Point.prototype.crossProduct = function(_point) {
	return this.x * _point.y - this.y * _point.x;
}

/**
 * Calculates the length of the point treated as a vector
 *
 * @returns {Float} The length
 */
ED.Point.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * Calculates the direction of the point treated as a vector
 *
 * @returns {Float} The angle from zero (north) going clockwise
 */
ED.Point.prototype.direction = function() {
	var north = new ED.Point(0, -100);

	return north.clockwiseAngleTo(this);
}

/**
 * Inner angle to other vector from same origin going round clockwise from vector a to vector b
 *
 * @param {Point} _point
 * @returns {Float} The angle in radians
 */
ED.Point.prototype.clockwiseAngleTo = function(_point) {
	var angle = Math.acos(this.dotProduct(_point) / (this.length() * _point.length()));
	if (this.crossProduct(_point) < 0) {
		return 2 * Math.PI - angle;
	} else {
		return angle;
	}
}

/**
 * Creates a new point at an angle
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.pointAtRadiusAndClockwiseAngle = function(_r, _phi) {
	// Calculate direction (clockwise from north)
	var angle = this.direction();

	// Create point and set length and direction
	var point = new ED.Point(0, 0);
	point.setWithPolars(_r, angle + _phi);

	return point;
}

/**
 * Creates a new point at an angle to and half way along a straight line between this point and another
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @param {Float} _point Point at other end of straight line
 * @returns {Point} A point object
 */
ED.Point.prototype.pointAtAngleToLineToPointAtProportion = function(_phi, _point, _prop) {
	// Midpoint in coordinates as if current point is origin
	var bp = new ED.Point((_point.x - this.x) * _prop, (_point.y - this.y) * _prop);

	// Calculate radius
	r = bp.length();

	// Create new point
	var point = bp.pointAtRadiusAndClockwiseAngle(r, _phi);

	// Shift origin back
	point.x += this.x;
	point.y += this.y;

	return point;
}


/**
 * Clock hour of point on clock face centred on origin
 *
 * @returns {Int} The clock hour
 */
ED.Point.prototype.clockHour = function(_point) {
	var twelvePoint = new ED.Point(0, -100);
	var clockHour = ((twelvePoint.clockwiseAngleTo(this) * 6 / Math.PI) + 12) % 12;

	clockHour = clockHour.toFixed(0);
	if (clockHour == 0) clockHour = 12;

	return clockHour;
}

/**
 * Creates a control point on a tangent to the radius of the point at an angle of phi from the radius
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.tangentialControlPoint = function(_phi) {
	// Calculate length of line from origin to point and direction (clockwise from north)
	var r = this.length();
	var angle = this.direction();

	// Calculate length of control point
	var h = r / Math.cos(_phi);

	// Create point and set length and direction
	var point = new ED.Point(0, 0);
	point.setWithPolars(h, angle + _phi);

	return point;
}

/**
 * Returns a point in JSON encoding
 *
 * @returns {String} point in JSON format
 */
ED.Point.prototype.json = function() {
	return "{\"x\":" + this.x.toFixed(2) + ",\"y\":" + this.y.toFixed(2) + "}";
}

/**
 * Creates a new transformation matrix initialised to the identity matrix
 *
 * @class AffineTransform
 * @property {Array} components Array representing 3x3 matrix
 */
ED.AffineTransform = function() {
	// Properties - array of arrays of column values one for each row
	this.components = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
}

/**
 * Sets matrix to identity matrix
 */
ED.AffineTransform.prototype.setToIdentity = function() {
	this.components[0][0] = 1;
	this.components[0][1] = 0;
	this.components[0][2] = 0;
	this.components[1][0] = 0;
	this.components[1][1] = 1;
	this.components[1][2] = 0;
	this.components[2][0] = 0;
	this.components[2][1] = 0;
	this.components[2][2] = 1;
}

/**
 * Sets the transform matrix to another
 *
 * @param {AffineTransform} _transform Array An affine transform
 */
ED.AffineTransform.prototype.setToTransform = function(_transform) {
	this.components[0][0] = _transform.components[0][0];
	this.components[0][1] = _transform.components[0][1];
	this.components[0][2] = _transform.components[0][2];
	this.components[1][0] = _transform.components[1][0];
	this.components[1][1] = _transform.components[1][1];
	this.components[1][2] = _transform.components[1][2];
	this.components[2][0] = _transform.components[2][0];
	this.components[2][1] = _transform.components[2][1];
	this.components[2][2] = _transform.components[2][2];
}

/**
 * Adds a translation to the transform matrix
 *
 * @param {float} _x value to translate along x-axis
 * @param {float} _y value to translate along y-axis
 */
ED.AffineTransform.prototype.translate = function(_x, _y) {
	this.components[0][2] = this.components[0][0] * _x + this.components[0][1] * _y + this.components[0][2];
	this.components[1][2] = this.components[1][0] * _x + this.components[1][1] * _y + this.components[1][2];
	this.components[2][2] = this.components[2][0] * _x + this.components[2][1] * _y + this.components[2][2];
}

/**
 * Adds a scale to the transform matrix
 *
 * @param {float} _sx value to scale along x-axis
 * @param {float} _sy value to scale along y-axis
 */
ED.AffineTransform.prototype.scale = function(_sx, _sy) {
	this.components[0][0] = this.components[0][0] * _sx;
	this.components[0][1] = this.components[0][1] * _sy;
	this.components[1][0] = this.components[1][0] * _sx;
	this.components[1][1] = this.components[1][1] * _sy;
	this.components[2][0] = this.components[2][0] * _sx;
	this.components[2][1] = this.components[2][1] * _sy;
}

/**
 * Adds a rotation to the transform matrix
 *
 * @param {float} _rad value to rotate by in radians
 */
ED.AffineTransform.prototype.rotate = function(_rad) {
	// Calulate trigonometry
	var c = Math.cos(_rad);
	var s = Math.sin(_rad);

	// Make new matrix for transform
	var matrix = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	// Apply transform
	matrix[0][0] = this.components[0][0] * c + this.components[0][1] * s;
	matrix[0][1] = this.components[0][1] * c - this.components[0][0] * s;
	matrix[1][0] = this.components[1][0] * c + this.components[1][1] * s;
	matrix[1][1] = this.components[1][1] * c - this.components[1][0] * s;
	matrix[2][0] = this.components[2][0] * c + this.components[2][1] * s;
	matrix[2][1] = this.components[2][1] * c - this.components[2][0] * s;

	// Change old matrix
	this.components[0][0] = matrix[0][0];
	this.components[0][1] = matrix[0][1];
	this.components[1][0] = matrix[1][0];
	this.components[1][1] = matrix[1][1];
	this.components[2][0] = matrix[2][0];
	this.components[2][1] = matrix[2][1];
}

/**
 * Applies transform to a point
 *
 * @param {Point} _point a point
 * @returns {Point} a transformed point
 */
ED.AffineTransform.prototype.transformPoint = function(_point) {
	var newX = _point.x * this.components[0][0] + _point.y * this.components[0][1] + 1 * this.components[0][2];
	var newY = _point.x * this.components[1][0] + _point.y * this.components[1][1] + 1 * this.components[1][2];

	return new ED.Point(newX, newY);
}

/**
 * Calculates determinant of transform matrix
 *
 * @returns {Float} determinant
 */
ED.AffineTransform.prototype.determinant = function() {
	return this.components[0][0] * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]) -
		this.components[0][1] * (this.components[1][0] * this.components[2][2] - this.components[1][2] * this.components[2][0]) +
		this.components[0][2] * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
}

/**
 * Inverts transform matrix
 *
 * @returns {Array} inverse matrix
 */
ED.AffineTransform.prototype.createInverse = function() {
	// Create new matrix
	var inv = new ED.AffineTransform();

	var det = this.determinant();

	//if (det != 0)
	var invdet = 1 / det;

	// Calculate components of inverse matrix
	inv.components[0][0] = invdet * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]);
	inv.components[0][1] = invdet * (this.components[0][2] * this.components[2][1] - this.components[0][1] * this.components[2][2]);
	inv.components[0][2] = invdet * (this.components[0][1] * this.components[1][2] - this.components[0][2] * this.components[1][1]);

	inv.components[1][0] = invdet * (this.components[1][2] * this.components[2][0] - this.components[1][0] * this.components[2][2]);
	inv.components[1][1] = invdet * (this.components[0][0] * this.components[2][2] - this.components[0][2] * this.components[2][0]);
	inv.components[1][2] = invdet * (this.components[0][2] * this.components[1][0] - this.components[0][0] * this.components[1][2]);

	inv.components[2][0] = invdet * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
	inv.components[2][1] = invdet * (this.components[0][1] * this.components[2][0] - this.components[0][0] * this.components[2][1]);
	inv.components[2][2] = invdet * (this.components[0][0] * this.components[1][1] - this.components[0][1] * this.components[1][0]);

	return inv;
}

/**
 * Squiggles are free-hand lines drawn by the mouse;
 * Points are stored in an array and represent points in the doodle plane
 *
 * @class Squiggle
 * @property {Doodle} doodle The doodle to which this squiggle belongs
 * @property {Colour} colour Colour of the squiggle
 * @property {Int} thickness Thickness of the squiggle in pixels
 * @property {Bool} filled True if squiggle is solid (filled)
 * @property {Array} pointsArray Array of points making up the squiggle
 * @property {Bool} complete True if the squiggle is complete (allows a filled squiggle to appear as a line while being created)
 * @param {Doodle} _doodle
 * @param {Colour} _colour
 * @param {Int} _thickness
 * @param {Bool} _filled
 */
ED.Squiggle = function(_doodle, _colour, _thickness, _filled) {
	this.doodle = _doodle;
	this.colour = _colour;
	this.thickness = _thickness;
	this.filled = _filled;

	this.pointsArray = new Array();
	this.complete = false;
}

/**
 * Adds a point to the points array
 *
 * @param {Point} _point
 */
ED.Squiggle.prototype.addPoint = function(_point) {
	this.pointsArray.push(_point);
}

/**
 * Returns a squiggle in JSON format
 *
 * @returns {String} A JSON encoded string representing the squiggle
 */
ED.Squiggle.prototype.json = function() {
	var s = '{';
	s = s + '"colour":' + this.colour.json() + ',';
	s = s + '"thickness": ' + this.thickness + ',';
	s = s + '"filled": "' + this.filled + '",';

	s = s + '"pointsArray":[';
	for (var i = 0; i < this.pointsArray.length; i++) {
		s = s + this.pointsArray[i].json();
		if (this.pointsArray.length - i > 1) {
			s = s + ',';
		}
	}
	s = s + ']';
	s = s + '}';

	return s;
}

/**
 * A colour in the RGB space;
 * Usage: var c = new ED.Colour(0, 0, 255, 0.75); ctx.fillStyle = c.rgba();
 *
 * @property {Int} red The red value as an integer from 0 to 255
 * @property {Int} green The green value as an integer from 0 to 255
 * @property {Int} blue The blue value as an integer from 0 to 255
 * @property {Float} alpha The alpha value as a float from 0 to 1
 * @param {Int} _red
 * @param {Int} _green
 * @param {Int} _blue
 * @param {Float} _alpha
 */
ED.Colour = function(_red, _green, _blue, _alpha) {
	this.red = _red;
	this.green = _green;
	this.blue = _blue;
	this.alpha = _alpha;
}

/**
 * Sets the colour from a hex encoded string
 *
 * @param {String} Colour in hex format (eg 'E0AB4F')
 */
ED.Colour.prototype.setWithHexString = function(_hexString) {
	// ***TODO*** add some string reality checks here
	this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)), 16);
	this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)), 16);
	this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)), 16);
	if (_hexString.length > 6) {
		this.alpha = parseInt((_hexString.charAt(6) + _hexString.charAt(7)), 16);
	}
}

/**
 * Outputs the colour as a hex string
 *
 * @returns {String} Colour in hex format (eg 'E0AB4F')
 */
ED.Colour.prototype.hexString = function() {
	var hexString = "";

	// temporary while awaiting internet! Works for red and green only
	if (this.red > 0) return "FF0000FF";
	else return "00FF00FF";

	// ***TODO*** add some string reality checks here
// 	this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)), 16);
// 	this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)), 16);
// 	this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)), 16);
// 	if (_hexString.length > 6) {
// 		this.alpha = parseInt((_hexString.charAt(6) + _hexString.charAt(7)), 16);
// 	}
}

/**
 * Returns a colour in Javascript rgba format
 *
 * @returns {String} Colour in rgba format
 */
ED.Colour.prototype.rgba = function() {
	return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
}

/**
 * Returns a colour in JSON format
 *
 * @returns {String} A JSON encoded string representing the colour
 */
ED.Colour.prototype.json = function() {
	return "{\"red\":" + this.red + ",\"green\":" + this.green + ",\"blue\":" + this.blue + ",\"alpha\":" + this.alpha + "}";
}

/**
 * Additional function for String object
 *
 * @returns {String} String with first letter made lower case, unless part of an abbreviation
 */
String.prototype.firstLetterToLowerCase = function() {
	var secondChar = this.charAt(1);

	if (secondChar == secondChar.toUpperCase()) {
		return this;
	} else {
		return this.charAt(0).toLowerCase() + this.slice(1);
	}
}

/**
 * Additional function for String object
 *
 * @returns {String} String with last ', ' replaced with ', and '
 */
String.prototype.addAndAfterLastComma = function() {
	// Search backwards from end of string for comma
	var found = false;
	for (var pos = this.length - 1; pos >= 0; pos--) {
		if (this.charAt(pos) == ',') {
			found = true;
			break;
		}
	}

	if (found) return this.substring(0, pos) + ", and" + this.substring(pos + 1, this.length);
	else return this;
}

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
