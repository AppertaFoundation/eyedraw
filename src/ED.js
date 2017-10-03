/* global jQuery:false */

/**
 * Namespace for all EyeDraw classes
 * @namespace ED
 */
var ED = ED || {};

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
};

/**
 * SquiggleStyle
 */
ED.squiggleStyle = {
	Outline: 0,
	Solid: 1
};

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
};

/**
 * Draw function mode (Canvas pointInPath function requires a path)
 */
ED.drawFunctionMode = {
	Draw: 0,
	HitTest: 1
};

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
};

/**
 * Handle ring
 */
ED.handleRing = {
	Inner: 0,
	Outer: 1
};

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
		} while (!!(obj = obj.offsetParent));
		return {
			left: curleft,
			top: curtop
		};
	}
};

ED.findPosition = function(obj, event) {
	var offset;
	if (typeof jQuery !== 'undefined') {
		offset = jQuery(obj).offset();
	} else {
		offset = ED.findOffset(obj, 0, 0);
	}
	return {
		x: event.pageX - offset.left,
		y: event.pageY - offset.top
	};
};

/*
 * Function to test whether a Javascript object is empty
 *
 * @param {Object} _object Object to apply test to
 * @returns {Bool} Indicates whether object is empty or not
 */
ED.objectIsEmpty = function(_object) {
	for (var property in _object) {
		if (_object.hasOwnProperty(property)) {
			return false;
		}
	}

	return true;
};

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
};

// Checks that the value is numeric http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
ED.isNumeric = function(_value) {
	return (_value - 0) == _value && _value.length > 0;
};

/**
 * Returns 'true' remainder of a number divided by a modulus (i.e. always positive, unlike x%y)
 *
 * @param {Float} _x number
 * @param {Float} _y modulus
 * @returns {Float} True modulus of _x/_y
 */
ED.Mod = function Mod(_x, _y) {
	return _x - Math.floor(_x / _y) * _y;
};

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
};

/**
 * Error handler
 *
 * @param {String} _class Class
 * @param {String} _method Method
 * @param {String} _message Error message
 */
ED.errorHandler = function(_class, _method, _message) {
	console.trace('EYEDRAW ERROR! class: [' + _class + '] method: [' + _method + '] message: [' + _message + ']');
};

/**
 * Return a string with the first letter as uppercase.
 * @param  {String} str The string.
 */
ED.firstLetterToUpperCase = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Additional function for String object
 *
 * @returns {String} String with first letter made lower case, unless part of an abbreviation
 */
ED.firstLetterToLowerCase = function(str) {
	var secondChar = str.charAt(1);

	if (secondChar === secondChar.toUpperCase()) {
		return str;
	} else {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}
};

/**
 * Additional function for String object
 *
 * @returns {String} String with last ', ' replaced with ', and '
 */
ED.addAndAfterLastComma = function(str) {
	// Search backwards from end of string for comma
	var found = false;
	for (var pos = str.length - 1; pos >= 0; pos--) {
		if (str.charAt(pos) === ',') {
			found = true;
			break;
		}
	}

	if (found) {
		return str.substring(0, pos) + ", and" + str.substring(pos + 1, str.length);
	} else {
		return str;
	}
};

/**
 * Default titles
 * @type {Object}
 */
ED.titles = {};

/**
 * Set titles.
 * @param {Object} titles An object containing the doodle titles.
 */
ED.setTitles = function(titles) {
	$.extend(this.titles, titles);
};

/**
 * Array of 200 random numbers
 */
ED.randomArray = [0.6570, 0.2886, 0.7388, 0.1621, 0.9896, 0.0434, 0.1695, 0.9099, 0.1948, 0.4433, 0.1580, 0.7392, 0.8730, 0.2165, 0.7138, 0.6316, 0.3425, 0.2838, 0.4551, 0.4153, 0.7421, 0.3364, 0.6087, 0.1986, 0.5764, 0.1952, 0.6179, 0.6699, 0.0903, 0.2968, 0.2684, 0.9383, 0.2488, 0.4579, 0.2921, 0.9085, 0.7951, 0.4500, 0.2255, 0.3366, 0.6670, 0.7300, 0.5511, 0.5623, 0.1376, 0.5553, 0.9898, 0.4317, 0.5922, 0.6452, 0.5008, 0.7077, 0.0704, 0.2293, 0.5697, 0.7415, 0.1557, 0.2944, 0.4566, 0.4129, 0.2449, 0.5620, 0.4105, 0.5486, 0.8917, 0.9346, 0.0921, 0.7998, 0.7717, 0.0357, 0.1179, 0.0168, 0.1520, 0.5187, 0.3466, 0.1663, 0.5935, 0.7524, 0.8410, 0.1859, 0.6012, 0.8171, 0.9272, 0.3367, 0.8133, 0.4868, 0.3665, 0.9625, 0.7839, 0.3052, 0.1651, 0.6414, 0.7361, 0.0065, 0.3267, 0.0554, 0.3389, 0.8967, 0.8777, 0.0557, 0.9201, 0.6015, 0.2676, 0.3365, 0.2606, 0.0989, 0.2085, 0.3526, 0.8476, 0.0146, 0.0190, 0.6896, 0.5198, 0.9871, 0.0288, 0.8037, 0.6741, 0.2148, 0.2584, 0.8447, 0.8480, 0.5557, 0.2480, 0.4736, 0.8869, 0.1867, 0.3869, 0.6871, 0.1011, 0.7561, 0.7340, 0.1525, 0.9968, 0.8179, 0.7103, 0.5462, 0.4150, 0.4187, 0.0478, 0.6511, 0.0386, 0.5243, 0.7271, 0.9093, 0.4461, 0.1264, 0.0756, 0.9405, 0.7287, 0.0684, 0.2820, 0.4059, 0.3694, 0.7641, 0.4188, 0.0498, 0.7841, 0.9136, 0.6210, 0.2249, 0.9935, 0.9709, 0.0741, 0.6218, 0.3166, 0.2237, 0.7754, 0.4191, 0.2195, 0.2935, 0.4529, 0.9112, 0.9183, 0.3275, 0.1856, 0.8345, 0.0442, 0.6297, 0.9030, 0.4689, 0.9512, 0.2219, 0.9993, 0.8981, 0.1018, 0.9362, 0.6426, 0.4563, 0.1267, 0.7889, 0.5057, 0.8588, 0.4669, 0.0687, 0.6623, 0.3681, 0.8152, 0.9004, 0.0822, 0.3652];