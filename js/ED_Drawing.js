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
ED.squiggleWidth = 
{
    Thin:4,
    Medium:12,
    Thick:20
}

/**
 * Flag to detect double clicks
 */
ED.recentClick = false;

/**
 * Eye (Some doodles behave differently according to side)
 */
ED.eye = 
{
    Right:0,
    Left:1
}

/**
 * Draw function mode (Canvas pointInPath function requires a path)
 */
ED.drawFunctionMode = 
{
    Draw:0,
    HitTest:1
}

/**
 * Mouse dragging mode
 */
ED.Mode = 
{
    None:0,
    Move:1,
    Scale:2,
    Arc:3,
    Rotate:4,
    Apex:5,
    Handles:6,
    Draw:7
}

/**
 * Handle ring
 */
ED.handleRing =
{
    Inner:0,
    Outer:1
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
ED.findOffset = function(obj, curleft, curtop)
{
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
}

/*
 * Function to test whether a Javascript object is empty
 *
 * @param {Object} _object Object to apply test to
 * @returns {Bool} Indicates whether object is empty or not
 */
ED.objectIsEmpty = function (_object)
{
    for (var property in _object)
    {
        if (_object.hasOwnProperty(property)) return false;
    }
    
    return true;
}

/*
 * Returns true if browser is firefox
 *
 * @returns {Bool} True is browser is firefox
 */
ED.isFirefox = function()
{
    var index = 0;
    var ua = window.navigator.userAgent;
    index = ua.indexOf("Firefox");
    
    if (index > 0)
    {
        return true;
    }
    else
    {
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
ED.Mod = function Mod(_x, _y)
{
    return _x - Math.floor(_x/_y) * _y;
}

/**
 * Error handler
 *
 * @param {String} _class Class
 * @param {String} _method Method 
 * @param {String} _message Error message 
 */
ED.errorHandler = function(_class, _method, _message)
{
    console.log('EYEDRAW ERROR! class: [' + _class + '] method: [' + _method + '] message: [' + _message + ']');
}


/**
 * Array of 200 random numbers
 */
ED.randomArray = [0.6570,0.2886,0.7388,0.1621,0.9896,0.0434,0.1695,0.9099,0.1948,0.4433,0.1580,0.7392,0.8730,0.2165,0.7138,0.6316,0.3425,0.2838,0.4551,0.4153,0.7421,0.3364,0.6087,0.1986,0.5764,0.1952,0.6179,0.6699,0.0903,0.2968,0.2684,0.9383,0.2488,0.4579,0.2921,0.9085,0.7951,0.4500,0.2255,0.3366,0.6670,0.7300,0.5511,0.5623,0.1376,0.5553,0.9898,0.4317,0.5922,0.6452,0.5008,0.7077,0.0704,0.2293,0.5697,0.7415,0.1557,0.2944,0.4566,0.4129,0.2449,0.5620,0.4105,0.5486,0.8917,0.9346,0.0921,0.7998,0.7717,0.0357,0.1179,0.0168,0.1520,0.5187,0.3466,0.1663,0.5935,0.7524,0.8410,0.1859,0.6012,0.8171,0.9272,0.3367,0.8133,0.4868,0.3665,0.9625,0.7839,0.3052,0.1651,0.6414,0.7361,0.0065,0.3267,0.0554,0.3389,0.8967,0.8777,0.0557,0.9201,0.6015,0.2676,0.3365,0.2606,0.0989,0.2085,0.3526,0.8476,0.0146,0.0190,0.6896,0.5198,0.9871,0.0288,0.8037,0.6741,0.2148,0.2584,0.8447,0.8480,0.5557,0.2480,0.4736,0.8869,0.1867,0.3869,0.6871,0.1011,0.7561,0.7340,0.1525,0.9968,0.8179,0.7103,0.5462,0.4150,0.4187,0.0478,0.6511,0.0386,0.5243,0.7271,0.9093,0.4461,0.1264,0.0756,0.9405,0.7287,0.0684,0.2820,0.4059,0.3694,0.7641,0.4188,0.0498,0.7841,0.9136,0.6210,0.2249,0.9935,0.9709,0.0741,0.6218,0.3166,0.2237,0.7754,0.4191,0.2195,0.2935,0.4529,0.9112,0.9183,0.3275,0.1856,0.8345,0.0442,0.6297,0.9030,0.4689,0.9512,0.2219,0.9993,0.8981,0.1018,0.9362,0.6426,0.4563,0.1267,0.7889,0.5057,0.8588,0.4669,0.0687,0.6623,0.3681,0.8152,0.9004,0.0822,0.3652];

/**
 * A Drawing consists of one canvas element displaying one or more doodles;
 * Doodles are drawn in the 'doodle plane' consisting of a 1001 pixel square grid -500 to 500) with central origin, and negative Y upwards;
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
 * @param {Canvas} _canvas Canvas element 
 * @param {Eye} _eye Right or left eye
 * @param {String} _IDSuffix String suffix to identify HTML elements related to this drawing
 * @param {Bool} _isEditable Flag indicating whether canvas is editable or not
 * @param {Array} _options Associative array of optional parameters 
 */
//ED.Drawing = function(_canvas, _eye, _IDSuffix, _isEditable, _offsetX, _offsetY, _toImage)
ED.Drawing = function(_canvas, _eye, _IDSuffix, _isEditable, _options)
{
    // Defaults for optional parameters
    var offsetX = 0;
    var offsetY = 0;
    var toImage = false;
    this.controllerFunctionName = 'eyeDrawController';
    this.graphicsPath = 'graphics/';
    
    // If optional parameters exist, use them instead
    if (typeof(_options) != 'undefined')
    {
        if (_options['offsetX']) offsetX = _options['offsetX'];
        if (_options['offsetY']) offsetY = _options['offsetY'];
        if (_options['toImage']) toImage = _options['toImage'];
        if (_options['controllerFunctionName']) this.controllerFunctionName = _options['controllerFunctionName'];
        if (_options['graphicsPath']) this.graphicsPath = _options['graphicsPath'];
    }

	// Initialise properties
	this.canvas = _canvas;
	this.eye = _eye;
	this.IDSuffix = _IDSuffix;
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
    
    // Associative array of bound element no doodle values (ie value associated with deleted doodle)
    this.boundElementDeleteValueArray = new Array();
    
    // Grab the canvas parent element
	this.canvasParent = this.canvas.parentElement;
    
    // Array of objects requesting notifications
    this.notificationArray = new Array();
    
    // Optional tooltip (this property will be null is a span element with this id not found
    this.canvasTooltip = document.getElementById('canvasTooltip');
    
    // Make sure doodle plane fits within canvas
//    if (this.canvas.width >= this.canvas.height)
//    {
//        this.scale = this.canvas.width/1001;
//    }
//    else
//    {
//        this.scale = this.canvas.height/1001;
//    }
    this.scale = this.canvas.height/1001;
    
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
    
	// Set transform to map from doodle to canvas plane
	this.transform.translate(this.canvas.width/2, this.canvas.height/2);
	this.transform.scale(this.scale, this.scale);
	
	// Set inverse transform to map the other way
	this.inverseTransform = this.transform.createInverse();
	
	// Initialise canvas context transform by calling clear() method	
	this.clear();
	
	// Get reference to button elements
	this.moveToFrontButton = document.getElementById('moveToFront' + this.IDSuffix);
	this.moveToBackButton = document.getElementById('moveToBack' + this.IDSuffix);
	this.flipVerButton = document.getElementById('flipVer' + this.IDSuffix);
	this.flipHorButton = document.getElementById('flipHor' + this.IDSuffix);
	this.deleteSelectedDoodleButton = document.getElementById('deleteSelectedDoodle' + this.IDSuffix);
	this.lockButton = document.getElementById('lock' + this.IDSuffix);
	this.unlockButton = document.getElementById('unlock' + this.IDSuffix);
    this.squiggleSpan = document.getElementById('squiggleSpan' + this.IDSuffix);
    this.colourPreview = document.getElementById('colourPreview' + this.IDSuffix);
    this.fillRadio = document.getElementById('fillRadio' + this.IDSuffix);
    this.thickness = document.getElementById('thicknessSelect' + this.IDSuffix);
    
    // Add event listeners (NB within the event listener 'this' refers to the canvas, NOT the drawing instance)
    if (this.isEditable)
    {
        var drawing = this;
        
        // Mouse listeners
        this.canvas.addEventListener('mousedown', function(e) {
                                     var offset = ED.findOffset(this, offsetX, offsetY);
                                     var point = new ED.Point(e.pageX-offset.x,e.pageY-offset.y);
                                     drawing.mousedown(point);
                                     }, false);
        
        this.canvas.addEventListener('mouseup', function(e) { 
                                     var offset = ED.findOffset(this, offsetX, offsetY);
                                     var point = new ED.Point(e.pageX-offset.x,e.pageY-offset.y);
                                     drawing.mouseup(point); 
                                     }, false);
        
        this.canvas.addEventListener('mousemove', function(e) { 
                                     var offset = ED.findOffset(this, offsetX, offsetY);
                                     var point = new ED.Point(e.pageX-offset.x,e.pageY-offset.y);
                                     drawing.mousemove(point); 
                                     }, false);

        this.canvas.addEventListener('mouseover', function(e) {
                                     var offset = ED.findOffset(this, offsetX, offsetY);
                                     var point = new ED.Point(e.pageX-offset.x,e.pageY-offset.y);
                                     drawing.mouseover(point);
                                     }, false);
        
        this.canvas.addEventListener('mouseout', function(e) { 
                                     var offset = ED.findOffset(this, offsetX, offsetY);
                                     var point = new ED.Point(e.pageX-offset.x,e.pageY-offset.y);
                                     drawing.mouseout(point); 
                                     }, false);
        
//        this.canvas.addEventListener('mousewheel', function(e) {
//                                     e.preventDefault();
//                                     drawing.selectNextDoodle(e.wheelDelta);
//                                     }, false);
        
        // iOS listeners
        this.canvas.addEventListener('touchstart', function(e) {
                                     if (e.targetTouches[0] !== undefined) {
                                        var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft,e.targetTouches[0].pageY - this.offsetTop);
                                        e.preventDefault(); }
                                     drawing.mousedown(point); 
                                     }, false);
        
        this.canvas.addEventListener('touchend', function(e) {
                                     if (e.targetTouches[0] !== undefined) {
                                        var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft,e.targetTouches[0].pageY - this.offsetTop);
                                        drawing.mouseup(point); }
                                     }, false);
        
        this.canvas.addEventListener('touchmove', function(e) {
                                     if (e.targetTouches[0] !== undefined) {
                                        var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft,e.targetTouches[0].pageY - this.offsetTop);
                                        drawing.mousemove(point); }
                                     }, false);
        
        // Keyboard listener
        window.addEventListener('keydown',function(e) {
                                if (document.activeElement && document.activeElement.tagName == 'CANVAS') drawing.keydown(e);
                                }, true);
        
        
        // Stop browser stealing double click to select text
        this.canvas.onselectstart = function () { return false; }
    }
}

/**
 * Carries out initialisation of drawing (called after a controller has been instantiated to ensure notification)
 */
ED.Drawing.prototype.init = function()
{
    // Start loading of texture images (will send ready notification when ready)
    this.preLoadImagesFrom(this.graphicsPath);
}

/**
 * Replaces the canvas element inline with a PNG image, useful for printing
 */
ED.Drawing.prototype.replaceWithImage = function()
{
    // Create a new image element
	var img = document.createElement("img");
    
	// Base64 encoded PNG version of the canvas element
	img.setAttribute('src', this.canvas.toDataURL('image/png'));
	
	// Removes canvas and hidden input element (+ any other children) as they will be replaced with an image
	if(this.canvasParent.hasChildNodes())
	{
		while(this.canvasParent.childNodes.length >= 1)
		{
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
ED.Drawing.prototype.preLoadImagesFrom = function(_path)
{
    var drawing = this;
    var ready = false;
    
    // Iterate through array loading each image, calling checking function from onload event
    for (var key in this.imageArray)
    {
        // This line picked up by javadoc toolkit - @ignore does not work
        this.imageArray[key].onload = function()
        {
            drawing.checkAllLoaded();
        }
        
        // Error handling
        this.imageArray[key].onerror = function()
        {
            ED.errorHandler('ED.Drawing', 'preLoadImagesFrom', 'Error loading image files from directory: ' + _path);
        }

        // Attempt to load image file
        this.imageArray[key].src = _path + key + '.gif';
    }
}

/**
 * Checks all images are loaded then sends a notification
 */
ED.Drawing.prototype.checkAllLoaded = function()
{
    // Set flag to check loading
    var allLoaded = true;
    
    // Iterate through array loading each image, checking all are loaded
    for (var key in this.imageArray)
    {
        var imageLoaded = false;
        if (this.imageArray[key].width > 0) imageLoaded = true;
        
        // Check all are loaded
        allLoaded = allLoaded && imageLoaded;
    }
    
    // If all are loaded, send notification
    if (allLoaded)
    {
        if (!this.readyNotificationSent)
        {
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
ED.Drawing.prototype.registerForNotifications = function(_object, _methodName, _notificationList)
{
    // Put in default values for optional parameters
    if (typeof(_methodName) == 'undefined')
    {
        _methodName = 'notificationHandler';
    }
    if (typeof(_notificationList) == 'undefined')
    {
        _notificationList = new Array();
    }
    
    // Add object and details to notification array
    this.notificationArray[this.notificationArray.length] = {object:_object, methodName:_methodName, notificationList:_notificationList};
}

/**
 * Unregisters an object for notifications  ***TODO*** Need method of identifying objects for this to work
 *
 * @param {object} _object The object requesting notification
 */
ED.Drawing.prototype.unRegisterForNotifications = function(_object)
{
    // Get index of object in array
    var index = this.notificationArray.indexOf(_object);
    
    // If its there, remove it
    if (index >= 0)
    {
        this.notificationArray.splice(index, 1);
    }
}

/**
 * Send notifications to all registered objects
 *
 * @param {String} _eventName Name of event
 * @param {Object} _object An optional object which may accompany an event containing additional information
 */
ED.Drawing.prototype.notify = function(_eventName, _object)
{
    //console.log("Notifying for event: " + _eventName);
    
    // Create array containing useful information
    var messageArray = {eventName:_eventName, selectedDoodle:this.selectedDoodle, object:_object};
    
    // Call method on each registered object
    for (var i = 0; i < this.notificationArray.length; i++)
    {
        // Assign to variables to make code easier to read
        var list = this.notificationArray[i]['notificationList'];
        var object = this.notificationArray[i]['object'];
        var methodName = this.notificationArray[i]['methodName'];
        
        // Check that event is in notification list for this object, or array is empty implying all notifications 
        if (list.length == 0 || list.indexOf(_eventName) >= 0)
        {
            // Check method exists
            if (typeof(object[methodName]) != 'undefined')
            {
                // Call registered object using specified method, and passing message array
                object[methodName].apply(object, [messageArray]);
            }
            else
            {
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
ED.Drawing.prototype.loadDoodles = function(_id)
{
    var sourceElement = document.getElementById(_id);
    
    // If it contains something, load it (***TODO*** better error checking here)
    if (sourceElement.value.length > 0)
    {
        var doodleSet = window.JSON.parse(sourceElement.value);
        
        this.load(doodleSet);				 
    }
}

/**
 * Loads doodles from passed set in JSON format into doodleArray
 *
 * @param {Set} _doodleSet Set of doodles from server
 */
ED.Drawing.prototype.load = function(_doodleSet)
{
	// Iterate through set of doodles and load into doodle array
	for (var i = 0; i < _doodleSet.length; i++)
	{
		// Instantiate a new doodle object with parameters from doodle set
		this.doodleArray[i] = new ED[_doodleSet[i].subclass]
		(
         this,
         _doodleSet[i].originX,
         _doodleSet[i].originY,
         _doodleSet[i].radius,
         _doodleSet[i].apexX,
         _doodleSet[i].apexY,
         _doodleSet[i].scaleX,
         _doodleSet[i].scaleY,
         _doodleSet[i].arc,
         _doodleSet[i].rotation,
         _doodleSet[i].order
         );
        
		this.doodleArray[i].id = i;
        
        // Squiggle array
        if (typeof(_doodleSet[i].squiggleArray) != 'undefined')
        {
            for (var j = 0; j < _doodleSet[i].squiggleArray.length; j++)
            {
                // Get paramters and create squiggle
                var c = _doodleSet[i].squiggleArray[j].colour;
                var colour = new ED.Colour(c.red, c.green, c.blue, c.alpha);
                var thickness = _doodleSet[i].squiggleArray[j].thickness;
                var filled = _doodleSet[i].squiggleArray[j].filled;
                var squiggle = new ED.Squiggle(this.doodleArray[i], colour, thickness, filled);
                
                // Add points to squiggle and complete it
                var pointsArray = _doodleSet[i].squiggleArray[j].pointsArray;
                for (var k = 0; k < pointsArray.length; k++)
                {
                    var point = new ED.Point(pointsArray[k].x, pointsArray[k].y);
                    squiggle.addPoint(point);
                }
                squiggle.complete = true;
                
                // Add squiggle to doodle's squiggle array
                this.doodleArray[i].squiggleArray.push(squiggle);
            }
        }
	}
	
	// Sort array by order (puts back doodle first)
	this.doodleArray.sort(function(a,b){return a.order - b.order});
}

/**
 * Creates string containing drawing data in JSON format with surrounding square brackets
 *
 * @returns {String} Serialized data in JSON format with surrounding square brackets
 */
ED.Drawing.prototype.save = function()
{		 
    // Store current data in textArea
    return '[' + this.json() + ']';
}

/**
 * Creates string containing drawing data in JSON format
 *
 * @returns {String} Serialized data in JSON format
 */
ED.Drawing.prototype.json = function()
{
    var s = "";
    
    // Go through each member of doodle array, encoding it
	for (var i = 0; i < this.doodleArray.length; i++)
	{
        s = s + this.doodleArray[i].json() + ",";
    }
    
    // Remove last comma
    s = s.substring(0, s.length - 1);
    
    return s;
}

/**
 * Draws all doodles for this drawing
 */
ED.Drawing.prototype.drawAllDoodles = function()
{
    // Draw any connecting lines
    var ctx = this.context;
    ctx.beginPath();
    var started = false;
    var startPoint;
    
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        if (this.doodleArray[i].isPointInLine)
        {
            // Start or draw line
            if (!started)
            {
                ctx.moveTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
                started = true;
                startPoint = new ED.Point(this.doodleArray[i].originX, this.doodleArray[i].originY);
            }
            else
            {
                ctx.lineTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
            }
        }
    }
    
    // Optionally add line to start
    if (this.completeLine && typeof(startPoint) != 'undefined')
    {
        ctx.lineTo(startPoint.x, startPoint.y);
    }
    
    // Draw lines
    if (started)
    {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(20,20,20,1)";
        ctx.stroke();
    }
    
    
	// Draw doodles
	for (var i = 0; i < this.doodleArray.length; i++)
	{
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
ED.Drawing.prototype.mousedown = function(_point)
{
	// Set flag to indicate dragging can now take place
	this.mouseDown = true;
    
    // Detect double click
    if (ED.recentClick) this.doubleClick = true;
    ED.recentClick = true;
    var t = setTimeout("ED.recentClick = false;",this.doubleClickMilliSeconds);
    
	// Set flag to indicate success
	var found = false;
	this.selectedDoodle = null;
    
	// Cycle through doodles from front to back doing hit test
	for (var i = this.doodleArray.length - 1; i > -1; i--)
	{
		if (!found)
		{
			// Save context (draw method of each doodle may alter it)
			this.context.save();
            
			// Successful hit test?
			if (this.doodleArray[i].draw(_point))
			{
				if (this.doodleArray[i].isSelectable)
				{
                    // If double clicked, go into drawing mode
                    if (this.doubleClick && this.doodleArray[i].isSelected && this.doodleArray[i].isDrawable)
                    {
                        this.doodleArray[i].isForDrawing = true;
                    }
                    
					this.doodleArray[i].isSelected = true;
					this.selectedDoodle = this.doodleArray[i];
					found = true;
                    
                    // If for drawing, mouse down starts a new squiggle
                    if (!this.doubleClick && this.doodleArray[i].isForDrawing)
                    {
                        // Add new squiggle
                        this.doodleArray[i].addSquiggle();
                    }
				}
			}
			// Ensure that unselected doodles are marked as such
			else
			{
				this.doodleArray[i].isSelected = false;
                this.doodleArray[i].isForDrawing = false;
			}
			
			// Restore context
			this.context.restore();
		}
		else
		{
			this.doodleArray[i].isSelected = false;
            this.doodleArray[i].isForDrawing = false;
		}
		
		// Ensure drag flagged is off for each doodle
		this.doodleArray[i].isBeingDragged = false;
	}
    
    
    if (this.newPointOnClick && !found)
    {
        var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);
        
        var newPointInLine = this.addDoodle('PointInLine');
        newPointInLine.originX = mousePosDoodlePlane.x;
        newPointInLine.originY = mousePosDoodlePlane.y;
    }
	
	// Repaint
	this.repaint();
    
    // Notify
    this.notify("mousedown", _point);
}

/**
 * Responds to mouse move event in canvas according to the drawing mode
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mousemove = function(_point)
{
    // Start the hover timer (also resets it)
    this.startHoverTimer(_point);
    
    // Get selected doodle
    var doodle = this.selectedDoodle;
    
	// Only drag if mouse already down and a doodle selected
	if (this.mouseDown && doodle != null)
	{
		// Dragging not started
		if (!doodle.isBeingDragged)
		{
			// Flag start of dragging manoeuvre
			doodle.isBeingDragged = true;
		}
		// Dragging in progress
		else
		{
			// Get mouse position in doodle plane
			var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);
			var lastMousePosDoodlePlane = this.inverseTransform.transformPoint(this.lastMousePosition);
			
			// Get mouse positions in selected doodle's plane
			var mousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(_point);
			var lastMousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(this.lastMousePosition);
			
			// Get mouse positions in canvas plane relative to centre
			var mousePosRelCanvasCentre = new ED.Point(_point.x - this.canvas.width/2, _point.y - this.canvas.height/2);
			var lastMousePosRelCanvasCentre = new ED.Point(this.lastMousePosition.x - this.canvas.width/2, this.lastMousePosition.y - this.canvas.height/2);
            
			// Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
			var canvasCentre = new ED.Point(0, 0);
			var canvasTop = new ED.Point(0, -100);
			
			// Get coordinates of origin of doodle in doodle plane
			var doodleOrigin = new ED.Point(doodle.originX, doodle.originY);
            
			// Get position of point vertically above doodle origin in doodle plane
			var doodleTop = new ED.Point(doodle.originX, doodle.originY - 100);
			
			// Effect of dragging depends on mode
			switch (this.mode)
			{
				case ED.Mode.None:
					break;
                    
				case ED.Mode.Move:
					// If isMoveable is true, move doodle
					if (doodle.isMoveable)
					{
                        // Initialise new values to stop doodle getting 'trapped' at origin due to failure of non-zero test in snapToQuadrant
                        var newOriginX = doodle.originX;
                        var newOriginY = doodle.originY;
                        
                        // Enforce snap to grid
                        if (doodle.snapToGrid)
                        {
                            // Calculate mouse position and work out nearest position of a grid line
                            var testX = mousePosDoodlePlane.x - doodle.gridDisplacementX;
                            var gridSquaresX = Math.floor(testX/doodle.gridSpacing);
                            var gridRemainderX = ED.Mod(testX, doodle.gridSpacing);
                            newOriginX = doodle.gridDisplacementX + doodle.gridSpacing * (gridSquaresX + Math.round(gridRemainderX/doodle.gridSpacing));
                            
                            // Repeat for Y axis
                            var testY = mousePosDoodlePlane.y - doodle.gridDisplacementY;
                            var gridSquaresY = Math.floor(testY/doodle.gridSpacing);
                            var gridRemainderY = ED.Mod(testY, doodle.gridSpacing);
                            newOriginY = doodle.gridDisplacementY + doodle.gridSpacing * (gridSquaresY + Math.round(gridRemainderY/doodle.gridSpacing));
                            
                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Enforce snap to quadrant
                        else if (doodle.snapToQuadrant)
                        {
                            if (mousePosDoodlePlane.x != 0)
                            {
                                newOriginX = doodle.quadrantPoint.x * mousePosDoodlePlane.x/Math.abs(mousePosDoodlePlane.x);
                            }
                            if (mousePosDoodlePlane.y != 0)
                            {
                                newOriginY = doodle.quadrantPoint.y * mousePosDoodlePlane.y/Math.abs(mousePosDoodlePlane.y);
                            }
                            
                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Enforce snap to points
                        else if (doodle.snapToPoints)
                        {
                            newOriginX = doodle.nearestPointTo(mousePosDoodlePlane).x;
                            newOriginY = doodle.nearestPointTo(mousePosDoodlePlane).y;
                            
                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Normal move
                        else
                        {
                            doodle.move(mousePosDoodlePlane.x - lastMousePosDoodlePlane.x, mousePosDoodlePlane.y - lastMousePosDoodlePlane.y);
                        }
					}
					// Otherwise rotate it (if isRotatable)
					else 
					{
						if (doodle.isRotatable)
						{
							// Calculate angles from centre to mouse positions relative to north
							var oldAngle = this.innerAngle(canvasTop, canvasCentre, lastMousePosRelCanvasCentre);
							var newAngle = this.innerAngle(canvasTop, canvasCentre, mousePosRelCanvasCentre);
							
							// Work out difference, and change doodle's angle of rotation by this amount
							var angleDelta = newAngle - oldAngle;
                            
                            // Calculate new value of rotation                            
                            if (doodle.snapToAngles)
                            {
                                var newRotation = doodle.nearestAngleTo(newAngle);
                            }
                            else
                            {
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
					if (doodle.isScaleable)
					{
						// Get sign of scale (negative scales create horizontal and vertical flips)
						var signX = doodle.scaleX/Math.abs(doodle.scaleX);
						var signY = doodle.scaleY/Math.abs(doodle.scaleY);
                        
						// Calculate change in scale (sign change indicates mouse has moved across central axis)
						var changeX = mousePosSelectedDoodlePlane.x/lastMousePosSelectedDoodlePlane.x;
						var changeY = mousePosSelectedDoodlePlane.y/lastMousePosSelectedDoodlePlane.y;
						
						// Ensure scale change is same if not squeezable
						if (!doodle.isSqueezable)
						{
							if (changeX > changeY) changeY = changeX;
							else changeY = changeX;
						}
						
						// Check that mouse has not moved from one quadrant to another 
						if (changeX > 0 && changeY > 0)
						{
							// Now do scaling
							newScaleX = doodle.scaleX * changeX;
							newScaleY = doodle.scaleY * changeY;
							
							// Constrain scale
							newScaleX = doodle.parameterValidationArray['scaleX']['range'].constrain(Math.abs(newScaleX));
							newScaleY = doodle.parameterValidationArray['scaleY']['range'].constrain(Math.abs(newScaleY));

                            doodle.setSimpleParameter('scaleX', newScaleX * signX);
                            doodle.setSimpleParameter('scaleY', newScaleY * signY);
						}
						else
						{
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
                    if (doodle.draggingHandleIndex < 2)
                    {
                        deltaAngle = -deltaAngle;
                        rotationCorrection = -1;
                    }
                    
                    // Check for permitted range and stop dragging if exceeded
                    if (doodle.parameterValidationArray['arc']['range'].isBelow(doodle.arc + deltaAngle))
                    {
                        deltaAngle = doodle.parameterValidationArray['arc']['range'].min - doodle.arc;
                        doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].min);
                        this.mode = ED.Mode.None;
                    }
                    else if (doodle.parameterValidationArray['arc']['range'].isAbove(doodle.arc + deltaAngle))
                    {
                        
                        deltaAngle = doodle.parameterValidationArray['arc']['range'].max - doodle.arc;
                        //doodle.arc = doodle.parameterValidationArray['arc']['range'].max;
                        doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].max);
                        this.mode = ED.Mode.None;
                    }
                    else
                    {
                        doodle.setSimpleParameter('arc', doodle.arc + deltaAngle);
                    }
                    
                    // Update dependencies
                    doodle.updateDependentParameters('arc');
                   
                    // Correct rotation with counter-rotation
                    if (!doodle.isArcSymmetrical)
                    {
                        rotationCorrection = rotationCorrection * deltaAngle/2;
                        doodle.setSimpleParameter('rotation', doodle.rotation + rotationCorrection);
                        
                        // Update dependencies
                        doodle.updateDependentParameters('rotation');
                    }
                    
					break;
                    
				case ED.Mode.Rotate:
					if (doodle.isRotatable)
					{
						// Calculate angles from centre to mouse positions relative to north
						var oldAngle = this.innerAngle(doodleTop, doodleOrigin, lastMousePosDoodlePlane);
						var newAngle = this.innerAngle(doodleTop, doodleOrigin, mousePosDoodlePlane);
						
						// Work out difference, and change doodle's angle of rotation by this amount
						var deltaAngle = newAngle - oldAngle;
                        doodle.setSimpleParameter('rotation', doodle.rotation + deltaAngle);
                        
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
                    
				case ED.Mode.Handles:
					// Move handles to new position (Stored in a squiggle)
                    var i = doodle.draggingHandleIndex;
                    
                    
                    // TEMP testing constraining radius
                    var p = doodle.squiggleArray[0].pointsArray[i];
                    if (p.length() < doodle.rangeArray['radius'].max)
                    {
                        doodle.squiggleArray[0].pointsArray[i].x += (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
                        doodle.squiggleArray[0].pointsArray[i].y += (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);
                    }
                    else
                    {
                        if (p.x * p.x > p.y * p.y)
                        {
                            var ax = Math.abs(p.x);
                            p.x = (ax - 1) * p.x/ax;
                        }
                        else
                        {
                            var ay = Math.abs(p.y);
                            p.y = (ay - 1) * p.y/ay;
                        }
                    }
                    
                    // Enforce bounds
					doodle.squiggleArray[0].pointsArray[i].x = doodle.rangeOfHandlesXArray[i].constrain(doodle.squiggleArray[0].pointsArray[i].x);
					doodle.squiggleArray[0].pointsArray[i].y = doodle.rangeOfHandlesYArray[i].constrain(doodle.squiggleArray[0].pointsArray[i].y);
					break;
                    
                case ED.Mode.Draw:
                    var p = new ED.Point(mousePosSelectedDoodlePlane.x,mousePosSelectedDoodlePlane.y);
                    doodle.addPointToSquiggle(p);
                    break;
                    
				default:
					break;		
			}
            
			// Refresh drawing and update any bindings - order is important since draw method may alter value of parameters 
            this.repaint();	
            this.updateBindings();
		}
		
		// Store mouse position
		this.lastMousePosition = _point;
        
        // Notify
        this.notify("mousedragged", _point);
	}
}

/**
 * Responds to mouse up event in canvas
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */  
ED.Drawing.prototype.mouseup = function(_point)
{
	// Reset flags and mode
	this.mouseDown = false;
    this.doubleClick = false;
    this.mode = ED.Mode.None;
	
	// Reset selected doodle's dragging flag
	if (this.selectedDoodle != null)
	{
		this.selectedDoodle.isBeingDragged = false;
        
		// Optionally complete squiggle
		if (this.selectedDoodle.isDrawable)
		{
            this.selectedDoodle.completeSquiggle();
            this.drawAllDoodles();
		}
	}
    
	// Cycle through doodles from front to back doing hit test
	for (var i = this.doodleArray.length - 1; i > -1; i--)
	{
		if (this.doodleArray[i].className == 'Surgeon') {
			this.doodleArray[i].isSelected = false;
			this.doodleArray[i].drawing.repaint();
		}
	}
    
    // Notify
    this.notify("mouseup", _point);
}

/**
 * Responds to mouse out event in canvas, stopping dragging operation
 *
 * @param {Point} _point coordinates of mouse in canvas plane
 */  
ED.Drawing.prototype.mouseover = function(_point)
{
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
ED.Drawing.prototype.mouseout = function(_point)
{
    // Make drawing inactive
    this.isActive = false;
    
    // Stop the hover timer
    this.stopHoverTimer();
    
	// Reset flag and mode
	this.mouseDown = false;
    this.mode = ED.Mode.None;
	
	// Reset selected doodle's dragging flag
	if (this.selectedDoodle != null)
	{
		this.selectedDoodle.isBeingDragged = false;
        
        // Optionally complete squiggle
        if (this.selectedDoodle.isDrawable)
        {
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
ED.Drawing.prototype.keydown = function(e)
{
	// Keyboard action works on selected doodle
	if (this.selectedDoodle != null)
	{
        // Delete or move doodle
        switch (e.keyCode) {
            case 8:			// Backspace
                this.deleteSelectedDoodle();
                break;
            case 37:		// Left arrow
                this.selectedDoodle.move(-ED.arrowDelta,0);
                break;
            case 38:		// Up arrow
                this.selectedDoodle.move(0,-ED.arrowDelta);
                break;
            case 39:		// Right arrow
                this.selectedDoodle.move(ED.arrowDelta,0);
                break;
            case 40:		// Down arrow
                this.selectedDoodle.move(0,ED.arrowDelta);
                break;
            default:
                break;
        }
        
        // If alphanumeric, send to Lable doodle
        var code = 0;
        
        // Shift key has code 16
        if (e.keyCode != 16)
        {
            // Alphabetic
            if (e.keyCode >= 65 && e.keyCode <= 90)
            {
                if (e.shiftKey)
                {
                    code = e.keyCode;
                }
                else
                {
                    code = e.keyCode + 32;
                }
            }
            // Space or numeric
            else if (e.keyCode == 32 || (e.keyCode > 47 && e.keyCode < 58))
            {
                code = e.keyCode;
            }
        }
        
        // Currently only doodles of Lable class accept alphanumeric input
        if (code > 0 && this.selectedDoodle.className == "Lable")
        {
            this.selectedDoodle.addLetter(code);
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
ED.Drawing.prototype.startHoverTimer = function(_point)
{
    // Only show tooltips for editable drawings with a span element of id 'canvasTooltip'
    if (this.isEditable && this.canvasTooltip != null)
    {
        // Stop any existing timer
        this.stopHoverTimer();
        
        // Restart it 
        var drawing = this;
        this.hoverTimer = setTimeout(function() {drawing.hover(_point);}, 1000);
    }
}

/**
 * Stops the timer. Called by the mouseout event, and from the start of the startHoverTimer method
 *
 * @event
 */
ED.Drawing.prototype.stopHoverTimer = function()
{
    if (this.canvasTooltip != null)
    {
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
ED.Drawing.prototype.hover = function(_point)
{
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
ED.Drawing.prototype.showTooltip = function(_point)
{
    // Get coordinates of mouse
    var xAbs = _point.x;
    var yAbs = _point.y;
    if (this.canvas.offsetParent)
    {
        var obj = this.canvas;
        var keepGoing;
        
        // The tooltip <span> has an absolute position (relative to the 1st parent element that has a position other than static)
        do
        {
            // ***TODO*** is this a reliable way of getting the position attribute?
        	var position = document.defaultView.getComputedStyle(obj,null).getPropertyValue('position');
        	
            // Flag to continue going up the tree
        	keepGoing = false;
        	
            // Assign x and y values
        	if (position != null) 
        	{
        		if (position == 'static')
        		{
        			keepGoing = true;
        			xAbs += obj.offsetLeft;
            		yAbs += obj.offsetTop;
        		}
        	}
            
            // Does parent exist, or is origin for absolute positioning
            var keepGoing = keepGoing && (obj = obj.offsetParent) ;
            
        }
        while (keepGoing);
    }

    // Adjust coodinates of tooltip
    this.canvasTooltip.style.left = xAbs + "px";
    this.canvasTooltip.style.top = (yAbs + 18) + "px";
    
    // Set flag to indicate success
	var found = false;
    
    // Cycle through doodles from front to back doing hit test
	for (var i = this.doodleArray.length - 1; i > -1; i--)
	{
        if (!found)
		{
            // Save context (draw method of each doodle may alter it)
            this.context.save();
            
            // Successful hit test?
            if (this.doodleArray[i].draw(_point))
            {
                this.canvasTooltip.innerHTML = this.doodleArray[i].tooltip();
                found = true;
            }
            
            // Restore context
            this.context.restore();
        }
	}
    
    // Display tooltip
    if (this.canvasTooltip.innerHTML.length > 0)
    {
        this.canvasTooltip.style.display = 'block';
    }
}

/**
 * Hides a tooltip
 *
 * @event
 */
ED.Drawing.prototype.hideTooltip = function()
{
    this.canvasTooltip.style.display = 'none';
}

/**
 * Moves selected doodle to front
 */
ED.Drawing.prototype.moveToFront = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
		// Assign large number to selected doodle
		this.selectedDoodle.order = 1000;
		
		// Sort array by order (puts back doodle first)
		this.doodleArray.sort(function(a,b){return a.order - b.order});
		
		// Re-assign ordinal numbers to array
		for (var i = 0; i < this.doodleArray.length; i++)
		{
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
ED.Drawing.prototype.moveToBack = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
		// Assign negative order to selected doodle
		this.selectedDoodle.order = -1;
		
		// Sort array by order (puts back doodle first)
		this.doodleArray.sort(function(a,b){return a.order - b.order});
		
		// Re-assign ordinal numbers to array
		for (var i = 0; i < this.doodleArray.length; i++)
		{
			this.doodleArray[i].order = i;
		}
		
		// Refresh canvas
		this.repaint();
	}
    
    // Notify
    this.notify("moveToBack");
}

/**
 * Flips the doodle around a vertical axis
 */
ED.Drawing.prototype.flipVer = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
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
ED.Drawing.prototype.flipHor = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
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
ED.Drawing.prototype.deleteDoodle = function(_doodle)
{
    // Class name and flag for successful deletion
    var deletedClassName = false;
    
    var errorMessage = 'Attempt to delete a doodle that does not exist';

    // Iterate through doodle array looking for doodle
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        if (this.doodleArray[i].id == _doodle.id)
        {
            if (this.doodleArray[i].isDeletable)
            {
                deletedClassName = _doodle.className;
                
                // If its selected, deselect it
                if (this.selectedDoodle != null && this.selectedDoodle.id == _doodle.id)
                {
                    this.selectedDoodle = null;
                }

                
                // Remove bindings and reset values of bound elements
                for (var parameter in _doodle.bindingArray)
                {
                    //console.log('removing binding', parameter, _doodle.bindingArray[parameter]);
                    var element = document.getElementById(_doodle.bindingArray[parameter]);
                    if (element != null)
                    {
                        // Set new value of element
                        element.value = this.boundElementDeleteValueArray[_doodle.bindingArray[parameter]];
                        
                        // Remove binding from doodle (also removes event listener from element)
                        _doodle.removeBinding(parameter);
                    }
                }
                    
                // Remove it from array
                this.doodleArray.splice(i,1);
            }
            else
            {
                errorMessage = 'Attempt to delete a doodle that is not deletable, className: ' + _doodle.className;
            }
        }
	}
    
    // If successfully deleted, tidy up
    if (deletedClassName)
    {
        // Re-assign ordinal numbers within array
        for (var i = 0; i < this.doodleArray.length; i++)
        {
            this.doodleArray[i].order = i;
        }

        // Refresh canvas
        this.repaint();
        
        // Notify
        this.notify("doodleDeleted", deletedClassName);
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'deleteDoodle', errorMessage);
    }
}

/**
 * Deletes currently selected doodle
 */
ED.Drawing.prototype.deleteSelectedDoodle = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
        this.deleteDoodle(this.selectedDoodle);
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'deleteSelectedDoodle', 'Attempt to delete selected doodle, when none selected');
    }
}

/**
 * Deletes doodle with selected id
 */
ED.Drawing.prototype.deleteDoodleOfId = function(_id)
{
    var doodle = this.doodleOfId(_id);
    
    if (doodle)
    {
        this.deleteDoodle(doodle);
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'deleteDoodleOfId', 'Attempt to delete doodle with invalid id');
    }
}

/**
 * Locks selected doodle
 */
ED.Drawing.prototype.lock = function()
{
	// Should only be called if a doodle is selected, but check anyway
	if (this.selectedDoodle != null)
	{
		// Go through doodles locking any that are selected
		for (var i = 0; i < this.doodleArray.length; i++)
		{
			if (this.doodleArray[i].isSelected)
			{
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
ED.Drawing.prototype.unlock = function()
{
	// Go through doodles unlocking all
	for (var i = 0; i < this.doodleArray.length; i++)
	{
		this.doodleArray[i].isSelectable = true;
	}
	
	// Refresh canvas
	this.repaint();
}

/**
 * Deselect any selected doodles
 */
ED.Drawing.prototype.deselectDoodles = function()
{
    // Deselect all doodles
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        this.doodleArray[i].isSelected = false;
    }
    
    this.selectedDoodle = null;
    
    // Refresh drawing
    this.repaint();
}

/**
 * Use scroll to select next doodle in array (From an idea of Adrian Duke)
 */
ED.Drawing.prototype.selectNextDoodle = function(_value)
{
    // Increment current scrollValue
    this.scrollValue += _value;
    
    // Scroll direction
    var up = _value > 0?true:false;
    
    // 'Damp' scroll speed by waiting for larger increments
    var dampValue = 96;
    
    if (this.scrollValue > dampValue || this.scrollValue < -dampValue)
    {
        // Reset scrollValue
        this.scrollValue = 0;
        
        // Index of selected doodle
        var selectedIndex = -1;
        
        // Iterate through doodles
        for (var i = 0; i < this.doodleArray.length; i++)
        {
            if (this.doodleArray[i].isSelected)
            {
                selectedIndex = i;
                
                // Deselected currently selected doodle
                this.doodleArray[i].isSelected = false;
            }
            
        }
        
        // If there is a selection, change it
        if (selectedIndex >= 0)
        {
            // Change index
            if (up)
            {
                selectedIndex++;
                if (selectedIndex == this.doodleArray.length) selectedIndex = 0;
            }
            else
            {
                selectedIndex--;
                if (selectedIndex < 0) selectedIndex = this.doodleArray.length - 1;
            }
            
            // Wrap
            if (selectedIndex == this.doodleArray.length)
            {
                
            }
            
            this.doodleArray[selectedIndex].isSelected = true;
            this.selectedDoodle = this.doodleArray[selectedIndex];
        }
        
        // Refresh drawing
        this.repaint();
    }
}

/**
 * Marks the doodle as 'unmodified' so we can catch an event when it gets modified by the user
 */
ED.Drawing.prototype.isReady = function()
{
	this.modified = false;
	if (this.convertToImage)
	{
		this.replaceWithImage();
	}
}

/**
 * Adds a doodle to the drawing
 *
 * @param {String} _className Classname of doodle
 * @param {Array} _parameterDefaults Array of key value pairs containing default values or parameters
 * @param {Array} _parameterBindings Array of key value pairs. Key is element id, value is parameter to bind to
 * @returns {Doodle} The newly added doodle
 */
ED.Drawing.prototype.addDoodle = function(_className, _parameterDefaults, _parameterBindings)
{
    // Set flag to indicate whether a doodle of this className already exists
    var exists = this.hasDoodleOfClass(_className);
    
    // Check that class exists, and create a new doodle
    if (ED.hasOwnProperty(_className))
    {
        // Create new doodle of class
        var newDoodle = new ED[_className](this);
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'addDoodle', 'Unable to find definition for subclass ' + _className);
        return null;
    }
    
    // Check if one is already there if unique)
    if (!(newDoodle.isUnique && this.hasDoodleOfClass(_className)))
    {
        // Ensure no other doodles are selected
        for (var i = 0; i < this.doodleArray.length; i++)
        {
            this.doodleArray[i].isSelected = false;
        }

        // Set parameters for this doodle
        if (typeof(_parameterDefaults) != 'undefined')
        {
            for (var key in _parameterDefaults)
            {
                var res = newDoodle.validateParameter(key, _parameterDefaults[key]);
                if (res.valid)
                {
                    newDoodle.setParameterFromString(key, res.value);
                }
                else
                {
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
        if (newDoodle.isDrawable)
        {
            newDoodle.isForDrawing = true;
        }
        
        // Add to array
        this.doodleArray[this.doodleArray.length] = newDoodle;
        
        // Pre-existing binding
        if (!exists)
        {
            for (var parameter in this.bindingArray[_className])
            {
                // Value of element will be delete value (by definition), so use default value of doodle
                var value = newDoodle[parameter];

                // Add binding to the doodle (NB this will set value of new doodle to the value of the element)
                newDoodle.addBinding(parameter, this.bindingArray[_className][parameter]);

                // Trigger binding by setting parameter to itself
                newDoodle.setSimpleParameter(parameter, value);
                this.updateBindings(newDoodle);
            }
        }
        
        // Binding passed as an argument to this method
        if (typeof(_parameterBindings) != 'undefined')
        {
            for (var key in _parameterBindings)
            {
                // Add binding to the doodle
                newDoodle.addBinding(key, _parameterBindings[key]);
            }
        }
        
        // Notify
        this.notify("doodleAdded", newDoodle);
        
        // Place doodle and refresh drawing
        if (newDoodle.addAtBack)
        {
            // This method also calls the repaint method
            this.moveToBack();
        }
        else
        {
            // Refresh drawing
            this.repaint();
        }
        
        // Return doodle
        return newDoodle;
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'addDoodle', 'Attempt to add a second unique doodle of class ' + _className);
        return null;
    }
}


/**
 * Takes array of bindings, and adds them to the corresponding doodles. Adds andevent listener to create a doodle if it does not exist
 *
 * @param {Array} _bindingArray Associative array. Key is className, and each value is an array with key: parameter name, value: elementId
 */
ED.Drawing.prototype.addBindings = function(_bindingArray)
{
    // Store binding array as part of drawing object in order to restore bindings to doodles that are deleted and added again
    this.bindingArray = _bindingArray;
    
    // Get reference to this drawing object (for inner function)
    var drawing = this;
    
    // Iterate through classNames
    for (var className in _bindingArray)
    {
        // Look for the first doodle of this class to bind to
        var doodle = this.firstDoodleOfClass(className);
        
        // Iterate through bindings for this className
        for (parameter in _bindingArray[className])
        {
            // Add an event listener to the element to create a doodle on change, if it does not exist
            var element = document.getElementById(_bindingArray[className][parameter]);
            element.addEventListener('change', function (event) {
                 if (!drawing.hasDoodleOfClass(className))
                 {
                     drawing.addDoodle(className);
                 }
            },false);

            // Add binding to doodle if it exists
            if (doodle)
            {
                doodle.addBinding(parameter, _bindingArray[className][parameter]);
            }
        }
    }
}

/**
 * Takes an array of key value pairs and adds them to the boundElementDeleteValueArray
 *
 * @param {Array} _deleteValuesArray Associative array. Key is elementId, and value the value corresponding to an absent doodle
 */
ED.Drawing.prototype.addDeleteValues = function(_deleteValuesArray)
{
    for (elementId in _deleteValuesArray)
    {
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
ED.Drawing.prototype.eventHandler = function(_type, _doodleId, _className, _elementId, _value)
{
    //console.log("Event " + _type + ":" + _doodleId + ":" + _className + ":" + _elementId + ":" + _value);

    //var value;
    switch (_type)
    {
        // Onchange event
        case 'onchange':
            // Get reference to associated doodle
            var doodle = this.doodleOfId(_doodleId);
            
            // Process event
            if (doodle)
            {
                // Look for value in boundElementDeleteValueArray
                if (this.boundElementDeleteValueArray[_elementId] == _value)
                {
                    this.deleteDoodleOfId(_doodleId);                    
                }
                else
                {
                    // Set state of drawing to be active to allow synchronisation to work when changed by bound element
                    doodle.drawing.isActive = true;
                    
                    // Find key associated with the element id
                    var parameter;
                    for (var key in doodle.bindingArray)
                    {
                        if (doodle.bindingArray[key] == _elementId)
                        {
                            parameter = key;
                        }
                    }
                    
                    // Check validity of new value
                    var validityArray = doodle.validateParameter(parameter, _value);
                    
                    // If new value is valid, set it
                    if (validityArray.valid)
                    {
                        doodle.setParameterWithAnimation(parameter, validityArray.value);
                    }
                    else
                    {
                        ED.errorHandler('ED.Drawing', 'eventHandler', 'Attempt to change HTML element value to an invalid value for parameter ' + parameter);
                    }
                    
                    // Apply new value to element if necessary
                    if (_value != validityArray.value)
                    {
                        document.getElementById(_elementId).value = validityArray.value;
                    }
                    
                    
                    // ***TODO*** Need to reset state of drawing elsewhere, since this gets called before animation finished.
                    //doodle.drawing.isActive = false;
                }
            }
            else
            {
                ED.errorHandler('ED.Drawing', 'eventHandler', 'Doodle of id: ' + _doodleId + ' no longer exists');
            }
            break;
        default:
            break;
    }
}

// Checks that the value is numeric http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
ED.isNumeric = function(_value)
{
    return (_value - 0) == _value && _value.length > 0;
}

/**
 * Updates value of bound elements to the selected doodle. Called by methods which change parameter values
 *
 * @param {ED.Doodle} _doodle Optional doodle object to update drawings without a selected doodle
 */
ED.Drawing.prototype.updateBindings = function(_doodle)
{
    var doodle = _doodle;
    
    // Check for an argument, otherwise take selected doodle for this drawing
    if (typeof(doodle) == 'undefined')
    {
        doodle = this.selectedDoodle;
    }
    
    // No argment, so there must be a selected doodle to activate binding
    if (doodle != null)
    {
        // Iterate through this doodle's bindings array and alter value of HTML element
        for (var key in doodle.bindingArray)
        {
            document.getElementById(doodle.bindingArray[key]).value = doodle.getParameter(key);
        }
    }
    else
    {
        ED.errorHandler('ED.Drawing', 'updateBindings', 'Attempt to update bindings on null doodle');
    }
}

/**
 * Test if doodle of a class exists in drawing
 *
 * @param {String} _className Classname of doodle
 * @returns {Bool} True is a doodle of the class exists, otherwise false 
 */
ED.Drawing.prototype.hasDoodleOfClass = function(_className)
{
    var returnValue = false;
    
	// Go through doodle array looking for doodles of passed className
	for (var i = 0; i < this.doodleArray.length; i++)
	{
        if (this.doodleArray[i].className == _className)
        {
            returnValue = true;
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
ED.Drawing.prototype.firstDoodleOfClass = function(_className)
{
    var returnValue = false;
    
	// Go through doodle array looking for doodles of passed className
	for (var i = 0; i < this.doodleArray.length; i++)
	{
        if (this.doodleArray[i].className == _className)
        {
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
ED.Drawing.prototype.lastDoodleOfClass = function(_className)
{
    var returnValue = false;
    
	// Go through doodle array backwards looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--)
	{
        if (this.doodleArray[i].className == _className)
        {
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
 * @returns {Doodle} The last doodle of the passed className
 */
ED.Drawing.prototype.allDoodlesOfClass = function(_className)
{
    var returnValue = [];
    
	// Go through doodle array backwards looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--)
	{
        if (this.doodleArray[i].className == _className)
        {
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
ED.Drawing.prototype.setParameterValueForClass= function(_parameter, _value, _className)
{
    // Go through doodle array (backwards because of splice function) looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--)
	{
        // Find doodles of given class name
        if (this.doodleArray[i].className == _className)
        {
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
ED.Drawing.prototype.doodleOfId = function(_id)
{
    var doodle = false;
    
	// Go through doodle array looking for the corresponding doodle
	for (var i = 0; i < this.doodleArray.length; i++)
	{
        if (this.doodleArray[i].id == _id)
        {
            doodle = this.doodleArray[i];
            break;
        }
	}

	return doodle;
}

/**
 * Deletes all doodles that are deletable
 */
ED.Drawing.prototype.deleteAllDoodles = function()
{
	// Go through doodle array (backwards because of splice function)
	for (var i = this.doodleArray.length - 1; i >= 0; i--)
	{
        // Only delete deletable ones
        if (this.doodleArray[i].isDeletable)
        {
            this.deleteDoodle(this.doodleArray[i]);
        }
	}
}

/**
 * Deletes doodles of one class from the drawing
 *
 * @param {String} _className Classname of doodle
 */
ED.Drawing.prototype.deleteDoodlesOfClass = function(_className)
{
	// Go through doodle array (backwards because of splice function) looking for doodles of passed className
	for (var i = this.doodleArray.length - 1; i >= 0; i--)
	{
        // Find doodles of given class name
        if (this.doodleArray[i].className == _className)
        {
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
ED.Drawing.prototype.setParameterForDoodle = function(_doodle, _parameter, _value)
{
    // Determine whether doodle exists
    if (typeof(_doodle[_parameter]) != 'undefined')
    {
        _doodle[_parameter] = +_value;
    }
    else
    {
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
ED.Drawing.prototype.setParameterForDoodleOfClass = function(_className, _parameter, _value)
{
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
ED.Drawing.prototype.totalDegreesExtent = function(_class)
{
    var degrees = 0;
    
    // Calculate total for all doodles of this class
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        // Find doodles of given class name
        if (this.doodleArray[i].className == _class)
        {
            degrees += this.doodleArray[i].degreesExtent();
        }
    }
    
    // Overlapping doodles do not increase total beyond 360 degrees
    if (degrees > 360) degrees = 360;
    
    return degrees;
}

/**
 * Returns a string containing a description of the drawing
 *
 * @returns {String} Description of the drawing
 */
ED.Drawing.prototype.report = function()
{
	var returnString = "";
    var groupArray = new Array();
	
	// Go through every doodle
	for (var i = 0; i < this.doodleArray.length; i++)
	{
        var doodle = this.doodleArray[i];
        
        // Check for a group description
        if (doodle.groupDescription().length > 0)
        {
            // Create an array entry for it or add to existing
            if (typeof(groupArray[doodle.className]) == 'undefined')
            {
                groupArray[doodle.className] = doodle.groupDescription();
                groupArray[doodle.className] += doodle.description();
            }
            else
            {
                // Only add additional detail if supplied by descripton method
                if (doodle.description().length > 0)
                {
                    groupArray[doodle.className] += ", ";
                    groupArray[doodle.className] += doodle.description();
                }
            }
        }
        else
        {
            if (doodle.willReport)
            {
                // Get description
                var description = doodle.description();
                
                // If its not an empty string, add to the return
                if (description.length > 0)
                {
                    // If text there already, make it lower case and add a comma before
                    if (returnString.length == 0)
                    {
                        returnString += description;
                    }
                    else
                    {
                        returnString = returnString + ", " + description.firstLetterToLowerCase();
                    }
                }
            }
        }
	}
    
    // Go through group array adding descriptions
    for (className in groupArray)
    {
        // Get description
        var description = groupArray[className];
        
        // Replace last comma with a comma and 'and'
        description = description.addAndAfterLastComma();
        
        // If its not an empty string, add to the return
        if (description.length > 0)
        {
            // If text there already, make it lower case and add a comma before
            if (returnString.length == 0)
            {
                returnString += description;
            }
            else
            {
                returnString = returnString + ", " + description.firstLetterToLowerCase();
            }
        }				 
    }
	
    // Return result
	return returnString;
}


/**
 * Returns a SNOMED diagnostic code derived from the drawing, returns zero if no code
 *
 * @returns {Int} SnoMed code of doodle with highest postion in hierarchy
 */
ED.Drawing.prototype.diagnosis = function()
{
    var positionInHierarchy = 0;
    var returnCode = 0;
    
    // Loop through doodles with diagnoses, taking one highest in hierarchy
	for (var i = 0; i < this.doodleArray.length; i++)
    {
        var doodle = this.doodleArray[i];
        var code = doodle.snomedCode();
        if (code > 0)
        {
            var codePosition = doodle.diagnosticHierarchy();
            if (codePosition > positionInHierarchy)
            {
                positionInHierarchy = codePosition;
                returnCode = code;
            }
        }
    }
    
    return returnCode;
}

/**
 * Changes value of eye
 *
 * @param {String} _eye Eye to change to
 */
ED.Drawing.prototype.setEye = function(_eye)
{
    // Change eye
    if (_eye == "Right") this.eye = ED.eye.Right;
    if (_eye == "Left") this.eye = ED.eye.Left;
    
    // Refresh drawing
    this.repaint();
}

/**
 * Clears canvas and sets context
 */
ED.Drawing.prototype.clear = function()
{
	// Resetting a dimension attribute clears the canvas and resets the context
	this.canvas.width = this.canvas.width;
	
	// But, might not clear canvas, so do it explicitly
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	// Set context transform to map from doodle plane to canvas plane	
	this.context.translate(this.canvas.width/2, this.canvas.height/2);
	this.context.scale(this.scale, this.scale);	
}

/**
 * Clears canvas and draws all doodles
 */
ED.Drawing.prototype.repaint = function()
{
	// Clear canvas
	this.clear();
    
    // Draw background image (In doodle space because of transform)
    if (typeof(this.image) != 'undefined')
    {
        if (this.image.width >= this.image.height)
        {
            var height = 1000 * this.image.height/this.image.width;
            this.context.drawImage(this.image, -500, -height/2, 1000, height);
        }
        else
        {
            var width = 1000 * this.image.width/this.image.height;
            this.context.drawImage(this.image, -width/2, -500, width, 1000);
        }
    }
	
	// Redraw all doodles
	this.drawAllDoodles();
	
	// Enable or disable buttons which work on selected doodle
	if (this.selectedDoodle != null)
	{
		if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = false;
		if (this.moveToBackButton !== null) this.moveToBackButton.disabled = false;
		if (this.flipVerButton !== null) this.flipVerButton.disabled = false;
		if (this.flipHorButton !== null) this.flipHorButton.disabled = false;
		if (this.deleteSelectedDoodleButton !== null && this.selectedDoodle.isDeletable) this.deleteSelectedDoodleButton.disabled = false;
		if (this.lockButton !== null) this.lockButton.disabled = false;
        if (this.squiggleSpan !== null && this.selectedDoodle.isDrawable) this.squiggleSpan.style.display = "inline-block";
	}
	else
	{
		if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = true;
		if (this.moveToBackButton !== null) this.moveToBackButton.disabled = true;
		if (this.flipVerButton !== null) this.flipVerButton.disabled = true;
		if (this.flipHorButton !== null) this.flipHorButton.disabled = true;	 
		if (this.deleteSelectedDoodleButton !== null) this.deleteSelectedDoodleButton.disabled = true;
		if (this.lockButton !== null) this.lockButton.disabled = true;
        if (this.squiggleSpan !== null) this.squiggleSpan.style.display = "none";
	}
	
	// Go through doodles looking for any that are locked and enable/disable unlock button
    if (this.unlockButton != null)
    {
        this.unlockButton.disabled = true;
        for (var i = 0; i < this.doodleArray.length; i++)
        {
            if (!this.doodleArray[i].isSelectable)
            {
                this.unlockButton.disabled = false;
            }
        }
    }
    
    if (!this.modified)
    {
        this.modified = true;
    }
}

/**
 * Calculates angle between three points (clockwise from _pointA to _pointB in radians)
 *
 * @param {Point} _pointA First point
 * @param {Point} _pointM Mid point
 * @param {Point} _pointB Last point
 * @returns {Float} Angle between three points in radians (clockwise)
 */
ED.Drawing.prototype.innerAngle = function(_pointA, _pointM, _pointB)
{
	// Get vectors from midpoint to A and B
	var a = new ED.Point(_pointA.x - _pointM.x, _pointA.y - _pointM.y);
	var b = new ED.Point(_pointB.x - _pointM.x, _pointB.y - _pointM.y);
	
	return a.clockwiseAngleTo(b);
}

/**
 * Toggles drawing state for drawing points in line
 */
ED.Drawing.prototype.togglePointInLine = function()
{
    if (this.newPointOnClick)
    {
        this.newPointOnClick = false;
        this.completeLine = true;
        this.deselectDoodles();
        this.repaint();
    }
    else
    {
        this.newPointOnClick = true;
        this.completeLine = false;
    }
}

/**
 * Generates a numeric id guaranteed to be unique for the lifetime of the drawing object
 * (Index of doodleArray can be repeated if a doodle is deleted before adding another)
 * 
 * @returns {Int} Id of next doodle
 */
ED.Drawing.prototype.nextDoodleId = function()
{
    return this.lastDoodleId++;
}

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
ED.Report = function(_drawing)
{
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
	for (i = 0; i < this.drawing.doodleArray.length; i++)
	{
        doodle = this.drawing.doodleArray[i];
        
        // If its a RRD, add to RRD array
        if(doodle.className == "RRD")
        {
            this.rrdArray.push(doodle);
        }
    }
    
    // Second iteration for other doodles
	for (i = 0; i < this.drawing.doodleArray.length; i++)
	{
        doodle = this.drawing.doodleArray[i];
        
        // Star fold - PVR C
        if (doodle.className == "StarFold")
        {
            this.pvrType = 'C';
            pvrCDegrees += doodle.arc * 180/Math.PI;
        }
        // Anterior PVR
        else if (doodle.className == "AntPVR")
        {
            this.pvrType = 'C';
            AntPvrDegrees += doodle.arc * 180/Math.PI;
        }
        // Retinal breaks
        else if (doodle.className in breakClassArray)
        {
            // Bearing of break is calculated in two different ways
            var breakBearing = 0;
            if( doodle.className == "UTear" || doodle.className == "RoundHole" || doodle.className == "OuterLeafBreak")
            {
                breakBearing = (Math.round(Math.atan2(doodle.originX, -doodle.originY) * 180/Math.PI) + 360) % 360;
            }
            else
            {
                breakBearing = (Math.round(doodle.rotation * 180/Math.PI + 360)) % 360;
            }
            
            // Bool if break is in detached retina
            var inDetached = this.inDetachment(breakBearing);
            
            // Increment totals
            if(inDetached)
            {
                this.breaksInDetached++;
            }
            else
            {
                this.breaksInAttached++;
            }
            
            // Get largest break in radians
            if (inDetached && doodle.arc > this.largestBreakSize)
            {
                this.largestBreakSize = doodle.arc;
                this.largestBreakType = breakClassArray[doodle.className];
            }
            
            // Get lowest break
            var degreesFromSix = Math.abs(breakBearing - 180);
            
            if (inDetached && degreesFromSix < minDegreesFromSix)
            {
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
    var size = this.largestBreakSize * 180/Math.PI + 25;
    var remainder = size % 30;
    this.largestBreakSize = Math.floor((size - remainder) / 30);
}

/**
 * Accepts a bearing in degrees (0 is at 12 o'clock) and returns true if it is in an area of detachment
 *
 * @param {Float} _angle Bearing in degrees
 * @returns {Bool} True is the bearing intersects with an area of retinal deatchment
 */
ED.Report.prototype.inDetachment = function(_angle)
{
    var returnValue = false;
    
    // Iterate through retinal detachments
    for (key in this.rrdArray)
    {
        var rrd = this.rrdArray[key];
        
        // Get start and finish bearings of detachment in degrees
        var min = (rrd.rotation - rrd.arc/2) * 180/Math.PI;
        var max = (rrd.rotation + rrd.arc/2) * 180/Math.PI;
        
        // Convert to positive numbers
        var min = (min + 360)%360;
        var max = (max + 360)%360;
        
        // Handle according to whether RRD straddles 12 o'clock
        if (max < min)
        {
            if ((0 <= _angle && _angle <= max) || (min <= _angle && _angle <= 360))
            {
                returnValue = true;
            }
        }
        else if (max == min) // Case if detachment is total
        {
            return true;
        }
        else
        {
            if (min <= _angle && _angle <= max)
            {
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
ED.Report.prototype.extent = function()
{
    // Array of extents by quadrant
    var extentArray = new Array();
    if (this.drawing.eye == ED.eye.Right)
    {
        extentArray["SN"] = 0;
        extentArray["IN"] = 0;
        extentArray["IT"] = 0;
        extentArray["ST"] = 0;
    }
    else
    {
        extentArray["ST"] = 0;
        extentArray["IT"] = 0;
        extentArray["IN"] = 0;
        extentArray["SN"] = 0;
    }
    
    // get middle of first hour in degrees
    var midHour = 15;
    
    // Go through each quadrant counting extent of detachment
    for (quadrant in extentArray)
    {
        for (var i = 0; i < 3; i++)
        {
            var addition = this.inDetachment(midHour)?1:0;
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
ED.Report.prototype.isMacOff = function()
{
    var result = false;
    
    // Iterate through each detachment, one macoff is enough
    for (key in this.rrdArray)
    {
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
 * @property {Bool} isDeletable True if doodle can be deleted 
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
 * @property {Range} rangeOfOriginX Range of allowable scales
 * @property {Range} rangeOfOriginY Range of allowable scales
 * @property {Range} rangeOfScale Range of allowable scales
 * @property {Range} rangeOfArc Range of allowable Arcs
 * @property {Range} rangeOfApexX Range of allowable values of apexX
 * @property {Range} rangeOfApexY Range of allowable values of apexY
 * @property {Array} rangeOfHandlesXArray Array of four ranges of allowable values of x coordinate of handle
 * @property {Array} rangeOfHandlesYArray Array of four ranges of allowable values of y coordinate of handle
 * @property {Range} rangeOfRadius Range of allowable values of radius
 * @property {Bool} isSelected True if doodle is currently selected
 * @property {Bool} isBeingDragged Flag indicating doodle is being dragged
 * @property {Int} draggingHandleIndex index of handle being dragged
 * @property {Range} draggingHandleRing Inner or outer ring of dragging handle
 * @property {Bool} isClicked Hit test flag
 * @property {Enum} drawFunctionMode Mode for boundary path
 * @property {Bool} isFilled True if boundary path is filled as well as stroked
 * @property {Int} frameCounter Keeps track of how many animation frames have been drawn
 * @property {Array} handleArray Array containing handles to be rendered
 * @property {Point} leftExtremity Point at left most extremity of doodle (used to calculate arc)
 * @property {Point} rightExtremity Point at right most extremity of doodle (used to calculate arc)
 * @property {Int} gridSpacing Separation of grid elements
 * @property {Int} gridDisplacementX Displacement of grid matrix from origin along x axis
 * @property {Int} gridDisplacementY Displacement of grid matrix from origin along y axis
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Doodle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Function called as part of prototype assignment has no parameters passed
	if (typeof(_drawing) != 'undefined')
	{
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
		this.isDeletable = true;
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
        this.willReport = true;
        this.willSync = true;
        
        // Permitted ranges
//        this.rangeArray = {
//            originX:new ED.Range(-1000, +1000),
//            originY:new ED.Range(-1000, +1000),
//            radius:new ED.Range(100, 450),
//            apexX:new ED.Range(-500, +500),
//            apexY:new ED.Range(-500, +500),
//            scaleX:new ED.Range(+0.5, +4.0),
//            scaleY:new ED.Range(+0.5, +4.0),
//            arc:new ED.Range(Math.PI/6, Math.PI * 2),
//            rotation:new ED.Range(0, Math.PI * 2),
//        };
        
        // Parameter validation array
        this.parameterValidationArray = {
            originX:{kind:'simple', type:'int', range:new ED.Range(-500,+1000), delta:15},
            originY:{kind:'simple', type:'int', range:new ED.Range(-1000,+1000), delta:15},
            radius:{kind:'simple', type:'float', range:new ED.Range(+100,+450), precision:6, delta:15},
            apexX:{kind:'simple', type:'int', range:new ED.Range(-500,+500), delta:15},
            apexY:{kind:'simple', type:'int', range:new ED.Range(-500,+500), delta:15},
            scaleX:{kind:'simple', type:'float', range:new ED.Range(+0.5,+4.0), precision:6, delta:0.1},
            scaleY:{kind:'simple', type:'float', range:new ED.Range(+0.5,+4.0), precision:6, delta:0.1},
            arc:{kind:'simple', type:'float', range:new ED.Range(Math.PI/12, Math.PI * 2), precision:6, delta:0.1},
            rotation:{kind:'simple', type:'float', range:new ED.Range(0, 2 * Math.PI), precision:6, delta:0.1},
        };

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
        this.derivedParametersArray = new Array();  // Array relating special parameters to corresponding common parameter
        this.animationFrameRate = 30;           // Frames per second
        this.animationDataArray = new Array();   // Associative array, key = parameter name, value = array with animation info
        
        // Array of points to snap to
        this.pointsArray = new Array();
        this.anglesArray = new Array();
        this.quadrantPoint = new ED.Point(200, 200);
        
        // Bindings to HTML element values. Associative array with parameter name as key
        this.bindingArray = new Array();
        
		// Array of 5 handles
		this.handleArray = new Array();
		this.handleArray[0] = new ED.Handle(new ED.Point(-50, 50), false, ED.Mode.Scale, false);
		this.handleArray[1] = new ED.Handle(new ED.Point(-50, -50), false, ED.Mode.Scale, false);
		this.handleArray[2] = new ED.Handle(new ED.Point(50, -50), false, ED.Mode.Scale, false);
		this.handleArray[3] = new ED.Handle(new ED.Point(50, 50), false, ED.Mode.Scale, false);
		this.handleArray[4] = new ED.Handle(new ED.Point(this.apexX, this.apexY), false, ED.Mode.Apex, false);
		this.setHandles();
        
        // Extremities
        this.leftExtremity = new ED.Point(-100,-100);
        this.rightExtremity = new ED.Point(0,-100);
        
		// Set dragging default settings
		this.setPropertyDefaults();
        
		// New doodle (constructor called with _drawing parameter only)
		if (typeof(_originX) == 'undefined')
		{
			// Default set of parameters (Note use of unary + operator to type convert to numbers)
			this.originX = +0;
			this.originY = +0;
            this.radius = +100;
			this.apexX = +0;
			this.apexY = +0;
			this.scaleX = +1;
			this.scaleY = +1;
			this.arc = Math.PI;
			this.rotation = +0;
			this.order = this.drawing.doodleArray.length;
			
			this.setParameterDefaults();
			
			// Newly added doodles are selected
			this.isSelected = true;
		}
		// Doodle with passed parameters
		else
		{
			// Parameters
			this.originX = +_originX;
			this.originY = +_originY;
            this.radius = +_radius;
			this.apexX = +_apexX;
			this.apexY = +_apexY;
			this.scaleX = +_scaleX;
			this.scaleY = +_scaleY;
			this.arc = _arc * Math.PI/180;
			this.rotation = _rotation * Math.PI/180;
			this.order = +_order;
            
            // Update any derived parameters
            for (var parameter in this.parameterValidationArray)
            {
                var validation = this.parameterValidationArray[parameter];
                if (validation.kind == 'simple')
                {
                    this.updateDependentParameters(parameter);
                }
            }
            
			// Loaded doodles are not selected
			this.isSelected = false;
            this.isForDrawing = false;
		}
	}
}

/**
 * Sets default handle attributes (overridden by subclasses)
 */
ED.Doodle.prototype.setHandles = function()
{
}

/**
 * Sets default properties (overridden by subclasses)
 */
ED.Doodle.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (overridden by subclasses)
 */
ED.Doodle.prototype.setParameterDefaults = function()
{
}

/**
 * Moves doodle and adjusts rotation as appropriate
 *
 * @param {Float} _x Distance to move along x axis in doodle plane
 * @param {Float} _y Distance to move along y axis in doodle plane
 */
ED.Doodle.prototype.move = function(_x, _y)
{
    // Ensure parameters are integers
    var x = Math.round(+_x);
    var y = Math.round(+_y);
    
    // Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
    var canvasCentre = new ED.Point(0, 0);
    var canvasTop = new ED.Point(0, -100);
    
    if (this.isMoveable)
    {
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
        if (x != 0 || y != 0)
        {
            // If doodle isOriented is true, rotate doodle around centre of canvas (eg makes 'U' tears point to centre)
            if (this.isOrientated)
            {
                // New position of doodle
                var newDoodleOrigin = new ED.Point(this.originX, this.originY);
                
                // Calculate angle to current position from centre relative to north
                var angle = this.drawing.innerAngle(canvasTop, canvasCentre, newDoodleOrigin);
                
                // Alter orientation of doodle
                this.setSimpleParameter('rotation', angle);
                
                // Update dependencies
                this.updateDependentParameters('rotation');
            }
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.draw = function(_point)
{
	// Determine function mode
	if (typeof(_point) != 'undefined')
	{
		this.drawFunctionMode = ED.drawFunctionMode.HitTest;
	}
	else
	{
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
ED.Doodle.prototype.drawHandles = function(_point)
{
	// Reset handle index and selected ring
	if (this.drawFunctionMode == ED.drawFunctionMode.HitTest)
	{
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
	var arc = Math.PI*2;
	
	for (var i = 0; i < this.handleArray.length; i++)
	{
		var handle = this.handleArray[i];
		
		if (handle.isVisible)
		{
			// Path for inner ring
			ctx.beginPath();
			ctx.arc(handle.location.x, handle.location.y, ED.handleRadius/2, 0, arc, true);
            
			// Hit testing for inner ring
			if (this.drawFunctionMode == ED.drawFunctionMode.HitTest)
			{
				if (ctx.isPointInPath(_point.x, _point.y))
				{
					this.draggingHandleIndex = i;
					this.draggingHandleRing = ED.handleRing.Inner;
					this.drawing.mode = handle.mode;
					this.isClicked = true;
				}
			}
			
			// Path for optional outer ring
			if (this.isRotatable && handle.isRotatable)
			{
				ctx.moveTo(handle.location.x + ED.handleRadius, handle.location.y);
				ctx.arc(handle.location.x, handle.location.y, ED.handleRadius, 0, arc, true);
				
				// Hit testing for outer ring
				if (this.drawFunctionMode == ED.drawFunctionMode.HitTest)
				{
					if (ctx.isPointInPath(_point.x, _point.y))
					{
						this.draggingHandleIndex = i;
						if (this.draggingHandleRing == null)
						{
							this.draggingHandleRing = ED.handleRing.Outer;
							this.drawing.mode = ED.Mode.Rotate;
						}
						this.isClicked = true;
					}
				}
			}

			// Draw handles
			if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
			{
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
ED.Doodle.prototype.drawBoundary = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// HitTest
	if (this.drawFunctionMode == ED.drawFunctionMode.HitTest)
	{
		// Workaround for Mozilla bug 405300 https://bugzilla.mozilla.org/show_bug.cgi?id=405300
		if (ED.isFirefox())
		{
			ctx.save();
			ctx.setTransform( 1, 0, 0, 1, 0, 0 );
			var hitTest = ctx.isPointInPath(_point.x, _point.y);
			ctx.restore();
		}
		else
		{
			var hitTest = ctx.isPointInPath(_point.x, _point.y);
		}
		
		if (hitTest)
		{
			// Set dragging mode
            if (this.isDrawable && this.isForDrawing)
            {
                this.drawing.mode = ED.Mode.Draw;
            }
            else
            {
                this.drawing.mode = ED.Mode.Move;
            }
			
			// Set flag indicating positive hit test
			this.isClicked = true;
		}
	}
	// Drawing
	else
	{
		// Specify highlight attributes
		if (this.isSelected && this.isShowHighlight)
		{
			ctx.shadowColor = "gray";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 20;
		}
        
        // Specify highlight attributes
		if (this.isForDrawing)
		{
			ctx.shadowColor = "blue";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 20;
		}
        
		// Fill path and draw it
		if (this.isFilled)
		{
			ctx.fill();
		}
		ctx.stroke();
        
        // Reset so shadow only on boundary
        ctx.shadowBlur = 0;
	}
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Doodle.prototype.groupDescription = function()
{
	return "";
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Doodle.prototype.description = function()
{
	return "";
}

/**
 * Returns a string containing a text description of the doodle. String taken from language specific ED_Tooltips.js
 *
 * @returns {String} Tool tip text
 */
ED.Doodle.prototype.tooltip = function()
{
    var tip = ED.trans[this.className];
    if (typeof(tip) != 'undefined')
    {
        return tip;
    }
    else
    {
        return "";
    }
}

/**
 * Returns the SnoMed code of the doodle (overridden by subclasses)
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Doodle.prototype.snomedCode = function()
{
	return 0;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest) (overridden by subclasses)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Doodle.prototype.diagnosticHierarchy = function()
{
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
ED.Doodle.prototype.dependentParameterValues = function(_parameter, _value)
{
    return new Array();
}

/**
 * Updates dependent parameters
 *
 * @param {String} _parameter Name of parameter for which dependent parameters will be updated
 */
ED.Doodle.prototype.updateDependentParameters = function(_parameter)
{
    // Retrieve list of dependent parameters and set them
    var valueArray = this.dependentParameterValues(_parameter, this[_parameter]);
    for (var parameter in valueArray)
    {
        this.setSimpleParameter(parameter, valueArray[parameter]);
        // Assign new value
        //this[parameter] = valueArray[parameter];
        
        // Notify change
        //this.drawing.notify(parameter, valueArray[parameter]);
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
ED.Doodle.prototype.validateParameter = function(_parameter, _value)
{
    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];
    
    // Set return value;
    var value = "";
    
    if (validation)
    {
        // Validity flag
        var valid = false;
        
        // Enforce string type and trim it
        value = _value.toString().trim();
        
        switch (validation.type)
        {
            case 'string':
                
                // Check that its in list of valid values
                if (validation.list.indexOf(value) >= 0)
                {
                    valid = true;
                }
                break;
                
            case 'float':
                
                // Test that value is a number
                if (ED.isNumeric(value))
                {
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
                if (ED.isNumeric(value))
                {
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
                if (ED.isNumeric(value))
                {
                    // Convert string to float value
                    value = parseInt(value);
                    
                    // Constrain value to allowable range
                    value = validation.range.constrain(value);
                    
                    // Deal with crossover
                    if (validation.clock == 'top')
                    {
                        if (value == validation.range.min) value = validation.range.max;
                    }
                    else if (validation.clock == 'bottom')
                    {
                        if (value == validation.range.max) value = validation.range.min;
                    }
                    
                    // Convert back to string, applying any formatting
                    value = value.toFixed(0);
                    
                    valid = true;
                }
                break;
                
            case 'bool':
                
                // Event handler detects check box type and returns checked attribute
                if (_value == 'true' || _value == 'false')
                {
                    // Convert to string for compatibility with setParameterFromString method
                    value = _value;
                    valid = true;
                }
                break;
                    
            default:
                ED.errorHandler('ED.Drawing', 'eventHandler', 'Illegal validation type');
                break;
        }
    }
    else
    {
        ED.errorHandler('ED.Doodle', 'validateParameter', 'Unknown parameter name');
    }
    
    // If not valid, get current value of parameter
    if (!valid)
    {
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
 * Attempts to animate a change in value of a parameter
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.setParameterWithAnimation = function(_parameter, _value)
{
    // Can doodle animate this parameter?
    if (this.parameterValidationArray[_parameter]['animate'])
    {
        var valueArray = this.dependentParameterValues(_parameter, _value);
        for (var parameter in valueArray)
        {
            // Read delta in units per frame
            var delta = this.parameterValidationArray[parameter]['delta'];
            
            // Calculate 'distance' to go
            var distance = valueArray[parameter] - this[parameter];
            
            // Calculate sign and apply to delta
            if (parameter == 'rotation')
            {
                // This formula works out correct distance and direction on a radians 'clock face' (ie the shortest way round)
                var sign = ((Math.PI - Math.abs(distance)) * distance) < 0?-1:1;
                distance = distance * sign;
                if (distance < 0) distance += 2 * Math.PI;
            }
            else
            {
                var sign = distance < 0?-1:1;
            }
            delta = delta * sign;
            
            // Calculate number of frames to animate
            var frames = Math.abs(Math.floor(distance/delta));
            
            // Put results into an associative array for this parameter
            var array = {timer:null, delta:delta, frames:frames, frameCounter:0};
            this.animationDataArray[parameter] = array;
            
            // Call animation method
            if (frames > 0)
            {
                this.increment(parameter, valueArray[parameter]);
            }
        }

    }
    // Otherwise just set it directly
    else
    {
        this.setParameterFromString(_parameter, _value);
    }
}

/**
 * Set the value of a doodle's parameter directly, and triggers a notification
 *
 * @param {String} _parameter Name of parameter
 * @param {Undefined} _value New value of parameter
 */
ED.Doodle.prototype.setSimpleParameter = function(_parameter, _value)
{
    // Set parameter
    this[_parameter] = _value;
    
    // Create notification message var messageArray = {eventName:_eventName, selectedDoodle:this.selectedDoodle, object:_object};
    var object = new Object;
    object.doodle = this;
    object.parameter = _parameter;
    object.value = _value;
    
    // Trigger notification
    this.drawing.notify('parameter', object);
}

/**
 * Set the value of a doodle's parameter from a string format following validation
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.setParameterFromString = function(_parameter, _value)
{
    // Check type of passed value variable
    var type = typeof(_value);
    if (type != 'string')
    {
        ED.errorHandler('ED.Doodle', 'setParameterFromString', '_value parameter should be of type string, not ' + type);
    }
    
    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];
    
    if (validation)
    {
        // Set value according to type of parameter
        switch (validation.type)
        {
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
                
            default:
                ED.errorHandler('ED.Doodle', 'setParameterFromString', 'Illegal validation type: ' + validation.type);
                break;
        }

        // Update dependencies
        this.updateDependentParameters(_parameter);
        
        // Update child dependencies of any derived parameters
        if (this.parameterValidationArray[_parameter]['kind'] == 'derived')
        {
            var valueArray = this.dependentParameterValues(_parameter, _value);
            for (var parameter in valueArray)
            {
                // Update dependencies
                this.updateDependentParameters(parameter);
            }
        }
    }
    else
    {
        ED.errorHandler('ED.Doodle', 'setParameterFromString', 'No item in parameterValidationArray corresponding to parameter: ' + _parameter);
    }

    // Refresh drawing
    this.drawing.repaint();
}

/**
 * Returns parameter values in validated string format
 *
 * @param {String} _parameter Name of parameter
 * @returns {String} Value of parameter
 */
ED.Doodle.prototype.getParameter = function(_parameter)
{
    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];
    
    // Set return value;
    var value = "";
    
    if (validation)
    {
        switch (validation.type)
        {
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
                if (validation.clock == 'top')
                {
                    if (value == validation.range.min) value = validation.range.max;
                }
                else if (validation.clock == 'bottom')
                {
                    if (value == validation.range.max) value = validation.range.min;
                }
                
                // Convert to string
                value = value.toFixed(0);
                break;
        
            case 'bool':
                value = this[_parameter].toString();
                break;

            default:
                ED.errorHandler('ED.Doodle', 'getParameter', 'Illegal validation type');
                break;
        }
    }
    else
    {
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
 */
ED.Doodle.prototype.increment = function(_parameter, _value)
{
    // Increment parameter and framecounter
    var currentValue = this[_parameter];
    this.animationDataArray[_parameter]['frameCounter']++;
    
    // Calculate interval between frames in milliseconds
    var interval = 1000/this.animationFrameRate;
    
    // Complete or continue animation
    if (this.animationDataArray[_parameter]['frameCounter'] == this.animationDataArray[_parameter]['frames'])
    {
        // Set  parameter to exact value
        this.setSimpleParameter(_parameter, _value);
        
        // Update dependencies
        this.updateDependentParameters(_parameter);
        
        // Stop timer
        clearTimeout(this.animationDataArray[_parameter]['timer']);
    }
    else
    {
        // Set parameter to new value
        this.setSimpleParameter(_parameter, currentValue + this.animationDataArray[_parameter]['delta']);
        
        // Update dependencies
        this.updateDependentParameters(_parameter);
        
        // Start timer and set to call this function again after interval
        var doodle = this;
        this.animationDataArray[_parameter]['timer'] = setTimeout(function() {doodle.increment(_parameter, _value);}, interval);
    }
    
    // Refresh drawing
    this.drawing.repaint();
}

/**
 * Adds a binding to the doodle. Only derived parameters can be bound
 *
 * @param {String} _parameter Name of parameter to be bound
 * @param {String} _id Id of bound HTML element
 */
ED.Doodle.prototype.addBinding = function(_parameter, _id)
{
    // Check that doodle has a parameter of this name
    if (typeof(this[_parameter]) != 'undefined')
    {
        // Get reference to HTML element
        var element = document.getElementById(_id);
        
        // Check element exists
        if (element != null)
        {
            // Add binding to array
            this.bindingArray[_parameter] = _id;
            
            // Set parameter to value of element
            this.setParameterFromString(_parameter, element.value);
            
            // Attach onchange event of element with a function which calls the drawing event handler
            var drawing = this.drawing;
            var id = this.id;
            var className = this.className;
            var listener;
            element.addEventListener('change', listener = function (event) {
                                     if (this.type == 'checkbox')
                                     {
                                        drawing.eventHandler('onchange', id, className, this.id, this.checked.toString());
                                     }
                                     else
                                     {
                                        drawing.eventHandler('onchange', id, className, this.id, this.value);
                                     }
                                     },false);
            
            // Add listener to array
            var array = new Array();
            array[_parameter] = listener;
            this.drawing.listenerArray[this.id] = array;
        }
        else
        {
            ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. DOM has no element with id: ' + _id);
        }
    }
    else
    {
        ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. Doodle of class: ' + this.className + ' has no parameter of name: ' + _parameter);
    }
}

/**
 * Removes a binding from a doodle
 *
 * @param {String} _parameter Name of parameter whosse binding is to be removed
 */
ED.Doodle.prototype.removeBinding = function(_parameter)
{
    // Get id of corresponding element
    var elementId;
    for (parameter in this.bindingArray)
    {
        if (parameter == _parameter)
        {
            elementId = this.bindingArray[_parameter];
        }
    }
    
    // Remove entry in binding array
    delete this.bindingArray[_parameter];
    
    // Remove event listener
    var element = document.getElementById(elementId);
    element.removeEventListener('change', this.drawing.listenerArray[this.id][parameter], false);
    
    // Remove entry in listener array
    delete this.drawing.listenerArray[this.id];
}

/**
 * Returns the position converted to clock hours
 *
 * @returns {Int} Clock hour from 1 to 12
 */
ED.Doodle.prototype.clockHour = function()
{
    var clockHour;
    
    if (this.isRotatable && !this.isMoveable)
    {
        clockHour = ((this.rotation * 6/Math.PI) + 12) % 12;
    }
    else
    {
        var twelvePoint = new ED.Point(0,-100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6/Math.PI) + 12) % 12;
    }
    
    clockHour = clockHour.toFixed(0);
    if (clockHour == 0) clockHour = 12;				 
    return clockHour
}

/**
 * Returns the rotation converted to degrees
 *
 * @returns {Int} Degrees from 0 to 360
 */
ED.Doodle.prototype.degrees = function()
{
    var degrees;
    
    if (this.isRotatable && !this.isMoveable)
    {
        degrees = ((this.rotation * 180/Math.PI) + 360) % 360;
    }
    else
    {
        var twelvePoint = new ED.Point(0,-100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        degrees = ((twelvePoint.clockwiseAngleTo(thisPoint) * 180/Math.PI) + 360) % 360;
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
ED.Doodle.prototype.clockHourExtent = function()
{
    var clockHourStart;
    var clockHourEnd;
    
    if (this.isRotatable && !this.isMoveable)
    {
        clockHourStart = (((this.rotation - this.arc/2) * 6/Math.PI) + 12) % 12;
        clockHourEnd = (((this.rotation + this.arc/2) * 6/Math.PI) + 12) % 12;
    }
    else
    {
        var twelvePoint = new ED.Point(0,-100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6/Math.PI) + 12) % 12;
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
ED.Doodle.prototype.degreesExtent = function()
{
    var degrees = this.arc * 180/Math.PI;
    var intDegrees = Math.round(degrees);
    return intDegrees;
}

/**
 * Adds a new squiggle to the doodle's squiggle array
 */
ED.Doodle.prototype.addSquiggle = function()
{
    // Get preview colour (returned as rgba(r,g,b))
    var colourString = this.drawing.colourPreview.style.backgroundColor;
    
    // Use regular expression to extract rgb values from returned value
    var colourArray = colourString.match(/\d+/g);
    
    // Get solid or clear
    var filled = this.drawing.fillRadio.checked;
    
    // Line thickness
    var thickness = this.drawing.thickness.value;
    var lineThickness;
    switch (thickness)
    {
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
    
    // Create new squiggle of selected colour
    var colour = new ED.Colour(colourArray[0], colourArray[1], colourArray[2], 1);
    var squiggle = new ED.Squiggle(this, colour, lineThickness, filled);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
}

/**
 * Adds a point to the active squiggle (the last in the squiggle array)
 *
 * @param {Point} _point The point in the doodle plane to be added
 */
ED.Doodle.prototype.addPointToSquiggle = function(_point)
{
    if(this.squiggleArray.length > 0)
    {
        var index = this.squiggleArray.length - 1;
        var squiggle = this.squiggleArray[index];
        
        squiggle.addPoint(_point);
    }
}

/**
 * Complete the active squiggle (last in the array)
 */
ED.Doodle.prototype.completeSquiggle = function()
{
    if(this.squiggleArray.length > 0)
    {
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
ED.Doodle.prototype.calculateArc = function()
{
    // Transform extremity points to origin of 0,0
    var left = new ED.Point(this.leftExtremity.x - this.drawing.canvas.width/2, this.leftExtremity.y - this.drawing.canvas.height/2);
    var right = new ED.Point(this.rightExtremity.x - this.drawing.canvas.width/2, this.rightExtremity.y - this.drawing.canvas.height/2);
    
    // Return angle between them
    return left.clockwiseAngleTo(right);
}

/**
 * Finds the nearest point in the doodle pointsArray
 *
 * @param {ED.Point} _point The point to test
 * @returns {ED.Point} The nearest point
 */
ED.Doodle.prototype.nearestPointTo = function(_point)
{
    // Check that pointsArray has content
    if (this.pointsArray.length > 0)
    {
        var min = 10000000; // Greater than square of maximum separation in doodle plane
        var index = 0;
        
        // Iterate through points array to find nearest point
        for (var i = 0; i < this.pointsArray.length; i++)
        {
            var p = this.pointsArray[i];
            var d = (_point.x - p.x) * (_point.x - p.x) + (_point.y - p.y) * (_point.y - p.y);
            
            if (d < min)
            {
                min = d;
                index = i;
            }
        }
        
        return this.pointsArray[index];
    }
    // Otherwise generate error and return passed point
    else
    {
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
ED.Doodle.prototype.nearestAngleTo = function(_angle)
{
    // Check that anglesArray has content
    if (this.anglesArray.length > 0)
    {
        var min = 2 * Math.PI; // Greater than one complete rotation
        var index = 0;
        
        // Iterate through angles array to find nearest point
        for (var i = 0; i < this.anglesArray.length; i++)
        {
            var p = this.anglesArray[i];
            
            var d = Math.abs(p - _angle);

            if (d < min)
            {
                min = d;
                index = i;
            }
        }
        
        return this.anglesArray[index];
    }
    // Otherwise generate error and return passed angle
    else
    {
        ED.errorHandler('ED.Doodle', 'nearestAngleTo', 'Attempt to calculate nearest angle with an empty angles array');
        return _angle;
    }
}

/**
 * Returns a doodle in JSON format
 *
 * @returns {String} A JSON encoded string representing the variable properties of the doodle
 */
ED.Doodle.prototype.json = function()
{
	var s = '{';
    s = s + '"subclass": ' + '"' + this.className + '", '
    s = s + '"originX": ' + this.originX.toFixed(0) + ', '
    s = s + '"originY": ' + this.originY.toFixed(0) + ', '
    s = s + '"radius": ' + this.radius.toFixed(0) + ', '
    s = s + '"apexX": ' + this.apexX.toFixed(0) + ', '
    s = s + '"apexY": ' + this.apexY.toFixed(0) + ', '
    s = s + '"scaleX": ' + this.scaleX.toFixed(2) + ', '
    s = s + '"scaleY": ' + this.scaleY.toFixed(2) + ', '
    s = s + '"arc": ' + (this.arc * 180/Math.PI).toFixed(0)  + ', '
    s = s + '"rotation": ' + (this.rotation * 180/Math.PI).toFixed(0) + ', '
    s = s + '"order": ' + this.order.toFixed(0) + ', '
    
    s = s + '"squiggleArray": ['; 
    for (var j = 0; j < this.squiggleArray.length; j++)
    {
        s = s + this.squiggleArray[j].json() + ', ';
    }
    s = s + ']';
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
ED.Doodle.prototype.drawSpot = function(_ctx, _x, _y, _r, _colour)
{
    _ctx.beginPath();
    _ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
    _ctx.fillStyle = _colour;
    _ctx.fill();
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
ED.Doodle.prototype.drawCircle = function(_ctx, _x, _y, _r, _fillColour, _lineWidth, _strokeColour)
{
    _ctx.beginPath();
    _ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
    _ctx.fillStyle = _fillColour;
    _ctx.fill();
	_ctx.lineWidth = _lineWidth;
	_ctx.strokeStyle = _strokeColour;
    _ctx.stroke();
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
ED.Doodle.prototype.drawLine = function(_ctx, _x1, _y1, _x2, _y2, _w, _colour)
{
    _ctx.beginPath();
    _ctx.moveTo(_x1, _y1);
    _ctx.lineTo(_x2, _y2);
    _ctx.lineWidth = _w;
    _ctx.strokeStyle = _colour;
    _ctx.stroke();		
}


/**
 * Draws a laser spot
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 */
ED.Doodle.prototype.drawLaserSpot = function(_ctx, _x, _y)
{
    this.drawCircle(_ctx, _x, _y, 15, "Yellow", 10, "rgba(255, 128, 0, 1)");
}

/**
 * Outputs doodle information to the console
 */
ED.Doodle.prototype.debug = function()
{
    console.log('org: ' + this.originX + " : " + this.originY);
    console.log('apx: ' + this.apexX + " : " + this.apexY);
    console.log('rot: ' + this.rotation * 180/Math.PI);
    console.log('arc: ' + this.arc * 180/Math.PI);
}

/**
 * Enacts a predefined sync action in response to a change in a simple parameter
 *
 * @param _parameter The parameter that has been changed in the master doodle
 */
ED.Doodle.prototype.syncParameter = function(_parameterName, _parameterValue)
{
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
ED.Handle = function(_location, _isVisible, _mode, _isRotatable)
{
	// Properties
	if (_location == null)
	{
		this.location = new ED.Point(0,0);
	}
	else
	{
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
ED.Range = function(_min, _max)
{
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
ED.Range.prototype.setMinAndMax = function(_min, _max)
{
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
ED.Range.prototype.isBelow = function(_num)
{
	if (_num < this.min)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Returns true if the parameter is more than the maximum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is more than the maximum
 */
ED.Range.prototype.isAbove = function(_num)
{
	if (_num > this.max)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Returns true if the parameter is inclusively within the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includes = function(_num)
{
	if (_num < this.min || _num > this.max)
	{
		return false;
	}
	else
	{
		return true;
	}
}

/**
 * Constrains a value to the limits of the range
 *
 * @param {Float} _num
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrain = function(_num)
{
	if (_num < this.min)
	{
		return this.min;
	}
	else if (_num > this.max)
	{
		return this.max;
	}
	else
	{
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
ED.Range.prototype.includesInAngularRange = function(_angle, _isDegrees)
{
    // Arbitrary radius
    var r = 100;
    
    // Points representing vectos of angles within range
    var min = new ED.Point(0,0);
    var max = new ED.Point(0,0);
    var angle = new ED.Point(0,0);
    
    // Set points using polar coordinates
    if (!_isDegrees)
    {
        min.setWithPolars(r, this.min);
        max.setWithPolars(r, this.max);
        angle.setWithPolars(r, _angle);
    }
    else
    {
        min.setWithPolars(r, this.min * Math.PI/180);
        max.setWithPolars(r, this.max * Math.PI/180);
        angle.setWithPolars(r, _angle * Math.PI/180);
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
ED.Range.prototype.constrainToAngularRange = function(_angle, _isDegrees)
{
    // No point in constraining unless range is less than 360 degrees!
    if ((this.max - this.min) < (_isDegrees?360:(2 * Math.PI)))
    {
        // Arbitrary radius
        var r = 100;
        
        // Points representing vectors of angles within range
        var min = new ED.Point(0,0);
        var max = new ED.Point(0,0);
        var angle = new ED.Point(0,0);
        
        // Set points using polar coordinates
        if (!_isDegrees)
        {
            min.setWithPolars(r, this.min);
            max.setWithPolars(r, this.max);
            angle.setWithPolars(r, _angle);
        }
        else
        {
            min.setWithPolars(r, this.min * Math.PI/180);
            max.setWithPolars(r, this.max * Math.PI/180);
            angle.setWithPolars(r, _angle * Math.PI/180);
        }
        
        // Return appropriate value depending on relationshipt to range
        if (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max))
        {
            return _angle;
        }
        else
        {
            if (angle.clockwiseAngleTo(min) < max.clockwiseAngleTo(angle))
            {
                return this.min;
            }
            else
            {
                return this.max;
            }
        }
    }
    else
    {
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
ED.Point = function(_x, _y)
{
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
ED.Point.prototype.setWithPolars = function(_r, _p)
{
    this.x = Math.round(_r * Math.sin(_p));
    this.y = Math.round(-_r * Math.cos(_p));
}

/**
 * Calculates the distance between this point and another
 *
 * @param {Point} _point
 * @returns {Float} Distance from the passed point
 */ 
ED.Point.prototype.distanceTo = function(_point)
{
	return Math.sqrt(Math.pow(this.x - _point.x, 2) + Math.pow(this.y - _point.y, 2));
}

/**
 * Calculates the dot product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The dot product
 */
ED.Point.prototype.dotProduct = function(_point)
{
	return this.x * _point.x + this.y * _point.y;
}

/**
 * Calculates the cross product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The cross product
 */
ED.Point.prototype.crossProduct = function(_point)
{
	return this.x * _point.y - this.y * _point.x;
}

/**
 * Calculates the length of the point treated as a vector
 *
 * @returns {Float} The length
 */
ED.Point.prototype.length = function()
{
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * Calculates the direction of the point treated as a vector
 *
 * @returns {Float} The angle from zero (north) going clockwise
 */
ED.Point.prototype.direction = function()
{
    var north = new ED.Point(0, -100);
    
	return north.clockwiseAngleTo(this);
}

/**
 * Inner angle to other vector from same origin going round clockwise from vector a to vector b
 *
 * @param {Point} _point
 * @returns {Float} The angle in radians
 */
ED.Point.prototype.clockwiseAngleTo = function(_point)
{
	var angle =  Math.acos(this.dotProduct(_point)/(this.length() * _point.length()));
	if (this.crossProduct(_point) < 0)
	{
		return 2 * Math.PI - angle;
	}
	else
	{
		return angle;
	}
}

/**
 * Creates a control point on a tangent to the radius of the point at an angle of phi from the radius
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.tangentialControlPoint = function(_phi)
{
    // Calculate length of line from origin to point and direction (clockwise from north)
    var r = this.length();
    var angle = this.direction();
    
    // Calculate length of control point
    var h = r/Math.cos(_phi);
    
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
ED.Point.prototype.json = function()
{
    return "{\"x\":" + this.x.toFixed(2) + ",\"y\":" + this.y.toFixed(2) + "}";
}


/**
 * Creates a new transformation matrix initialised to the identity matrix
 *
 * @class AffineTransform
 * @property {Array} components Array representing 3x3 matrix
 */
ED.AffineTransform = function()
{
	// Properties - array of arrays of column values one for each row
	this.components = [[1,0,0],[0,1,0],[0,0,1]];
}

/**
 * Sets matrix to identity matrix
 */
ED.AffineTransform.prototype.setToIdentity = function()
{
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
ED.AffineTransform.prototype.setToTransform = function(_transform)
{
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
ED.AffineTransform.prototype.translate = function(_x, _y)
{
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
ED.AffineTransform.prototype.scale = function(_sx, _sy)
{
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
ED.AffineTransform.prototype.rotate = function(_rad)
{
	// Calulate trigonometry
	var c = Math.cos(_rad);
	var s = Math.sin(_rad);
	
	// Make new matrix for transform
	var matrix = [[0,0,0],[0,0,0],[0,0,0]];
	
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
ED.AffineTransform.prototype.transformPoint = function(_point)
{
	var newX = _point.x * this.components[0][0] + _point.y * this.components[0][1] + 1 * this.components[0][2];
	var newY = _point.x * this.components[1][0] + _point.y * this.components[1][1] + 1 * this.components[1][2];
    
	return new ED.Point(newX, newY);
}

/**
 * Calculates determinant of transform matrix
 *
 * @returns {Float} determinant
 */
ED.AffineTransform.prototype.determinant = function()
{
	return	this.components[0][0] * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]) - 
    this.components[0][1] * (this.components[1][0] * this.components[2][2] - this.components[1][2] * this.components[2][0]) +
    this.components[0][2] * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
}

/**
 * Inverts transform matrix
 *
 * @returns {Array} inverse matrix
 */
ED.AffineTransform.prototype.createInverse = function()
{
	// Create new matrix 
	var inv = new ED.AffineTransform();
	
	var det = this.determinant();
	
	//if (det != 0)
	var invdet = 1/det;
	
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
ED.Squiggle = function(_doodle, _colour, _thickness, _filled)
{
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
ED.Squiggle.prototype.addPoint = function(_point)
{
    this.pointsArray.push(_point);
}

/**
 * Returns a squiggle in JSON format
 *
 * @returns {String} A JSON encoded string representing the squiggle
 */
ED.Squiggle.prototype.json = function()
{
	var s = '{';
    s = s + '"colour": ' + this.colour.json() + ', ';
    s = s + '"thickness": ' + this.thickness + ', ';
    s = s + '"filled": "' + this.filled + '", ';
    
    s = s + '"pointsArray": [';
    for (var i = 0; i < this.pointsArray.length; i++)
	{
        s = s + this.pointsArray[i].json() + ', ';
    }
    s = s + ']';
    s = s + '}';
    
    return s;
}

/**
 * A colour in the RGB space;
 * Usage: var c = new ED.Colour(0, 0, 255, 0.75); ctx.fillStyle = c.rgba();
 *
 * @property {Int} red The red value
 * @property {Int} green The green value
 * @property {Int} blue The blue value
 * @property {Float} alpha The alpha value
 * @param {Int} _red
 * @param {Int} _green
 * @param {Int} _blue
 * @param {Float} _alpha
 */
ED.Colour = function(_red, _green, _blue, _alpha)
{
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
ED.Colour.prototype.setWithHexString = function(_hexString)
{
    // ***TODO*** add some string reality checks here
    this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)),16);
    this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)),16);
    this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)),16);
}

/**
 * Returns a colour in Javascript rgba format
 *
 * @returns {String} Colour in rgba format
 */
ED.Colour.prototype.rgba = function()
{
    return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
}

/**
 * Returns a colour in JSON format
 *
 * @returns {String} A JSON encoded string representing the colour
 */
ED.Colour.prototype.json = function()
{
    return "{\"red\":" + this.red + ",\"green\":" + this.green + ",\"blue\":" + this.blue + ",\"alpha\":" + this.alpha + "}";
}

/**
 * Additional function for String object
 *
 * @returns {String} String with first letter made lower case, unless part of an abbreviation
 */
String.prototype.firstLetterToLowerCase = function()
{
    var secondChar = this.charAt(1);
    
    if (secondChar == secondChar.toUpperCase())
    {
        return this;
    }
    else
    {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
}

/**
 * Additional function for String object
 *
 * @returns {String} String with last ', ' replaced with ', and '
 */
String.prototype.addAndAfterLastComma = function()
{
    // Search backwards from end of string for comma
    var found = false;
    for (var pos = this.length - 1; pos >= 0; pos--)
    {
        if (this.charAt(pos) == ',')
        {
            found = true;
            break;
        }
    }
    
    if (found) return this.substring(0, pos) + ", and" + this.substring(pos+1, this.length);
    else return this;
}
