/**
 * Javascript file containing functions for the EyeDraw widget
 *
 * @link http://www.openeyes.org.uk/
 * @copyright Copyright &copy; 2012 OpenEyes Foundation
 * @license http://www.yiiframework.com/license/
 * Modification date: 17th August 2012
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
 * @package EyeDraw
 * @author Bill Aylward <bill.aylward@openeyes.org>
 * @version 0.95
 */

/**
 * Function runs on page load to initialise an EyeDraw canvas
 * 
 * @param {array}
 *          _properties Array of properties passed from widget - drawingName The
 *          EyeDraw drawing object - canvasId The DOM id of the associated
 *          canvas element - eye The eye (right = 0, left = 1) ***TODO*** handle
 *          this better - idSuffix A suffix for DOM elements to distinguish
 *          those associated with this drawing object - isEditable Flag
 *          indicating whether drawing object is editable or not - graphicsPath
 *          Path to folder containing EyeDraw graphics, - onLoadedCommandArray
 *          Array of commands and arguments to be run when images are loaded
 */
function eyeDrawInit(_properties)
{
	// Get reference to the drawing canvas
	var canvas = document.getElementById(_properties.canvasId);

	// Create a drawing linked to the canvas
	window[_properties.drawingName] = new ED.Drawing(canvas, _properties.eye,
			_properties.idSuffix, _properties.isEditable, _properties.offset_x,
			_properties.offset_y, _properties.to_image);

    // Instantiate a controller object and register it for notifications
    var controller = new eyeDrawController(window[_properties.drawingName]);
    
	// Preload any images
	window[_properties.drawingName].preLoadImagesFrom(_properties.graphicsPath);
    
    // Controller class (need _idSuffix?)
    function eyeDrawController(_drawing)
    {
        // Assign controller properties
        this.drawing = _drawing;
        //this.idSuffix = _idSuffix;
        
        // Call back function
        this.callBack = callBack;
        
        // Register for notifications with drawing object
        this.drawing.registerForNotifications(this, 'callBack', ['loaded', 'doodleAdded', 'mouseDragged']);
        
        // Method called for notification
        function callBack(_messageArray)
        {
            console.log("Event: " + _messageArray['eventName']);
            // Get reference to hidden input element
            var input = document.getElementById(_properties.inputId);
            
            // Handle events by name
            switch (_messageArray['eventName'])
            {
                // Image files all loaded
                case 'loaded':
                    // If input contains data, load it into the drawing
                    if (input.value.length > 0)
                    {
                        // Load drawing data from input element
                        window[_properties.drawingName].loadDoodles(_properties.inputId);
                        
                        // Apply bindings
                        for ( var i = 0; i < _properties.bindingArray.length; i++)
                        {
                            // Doodle className
                            var className = _properties.bindingArray[i][0];
                            
                            // Binding
                            var binding = translateParameter(_properties.bindingArray[i][1]);
                            
                            // Get key of first and only element
                            for (var key in binding)
                            {
                            }
                            
                            // Get doodle corresponding to this class
                            var doodle = window[_properties.drawingName].firstDoodleOfClass(className);
                            if (doodle)
                            {
                                doodle.addBinding(key, binding[key]);
                            }
                        }
                        
                        // Draw doodles
                        window[_properties.drawingName].drawAllDoodles();
                    }
                    // Otherwise run commands in onLoadedCommand array
                    else
                    {
                        for ( var i = 0; i < _properties.onLoadedCommandArray.length; i++)
                        {
                            // Get method name
                            var method = _properties.onLoadedCommandArray[i][0];
                            
                            // Construct array containing arguments
                            var args = new Array();
                            for (var j = 0; j < _properties.onLoadedCommandArray[i][1].length; j++)
                            {
                                arg = translateParameter(_properties.onLoadedCommandArray[i][1][j]);
                                args[j] = arg;
                            }

                            // Run method with arguments
                            window[_properties.drawingName][method].apply(window[_properties.drawingName], args);
                        }
                    }
                    
                    // Initialise hidden input
                    input.value = window[_properties.drawingName].save();
                    
                    break;
                case 'doodleAdded':
                    // Save drawing to hidden input
                    input.value = window[_properties.drawingName].save();
                    break;
                case 'mouseDragged':
                    // Save drawing to hidden input
                    input.value = window[_properties.drawingName].save();
                    break;
                default:
                    console.log('Unhandled notification for message: ' + _messageArray['eventName']);
                    break;
            }
        }
    }    
}

// Translates strings into arrays if appropriate
function translateParameter(_arg)
{
    switch (_arg.charAt(0))
    {
        // Regular array
        case "[":
            console.log("Call to translateParameter function for regular array ***TODO***");
            return _arg // ***TODO*** deal with regular array
            break;
            
        // Associative array
        case "{":
            // Create a new associative array
            var associativeArray = new Array();
            
            // Strip {} characters (***TODO*** should be able to do this with a grep expression)
            var arg = _arg.replace('{','');
            arg = arg.replace('}','');
            
            // Strip out white space
            arg = arg.replace(/\s/,'');
            
            // Split into individual members each of format key:value
            var members = arg.split(',');
            
            // Go through elements creating an associative array member for each
            for (var i = 0; i < members.length; i++)
            {
                // Break each couplet into two parts
                var parts = members[i].split(':');
                
                // Strip out any quotation marks from second part
                var secondPart = parts[1].replace(/("|')/g, "");
                associativeArray[parts[0]] = secondPart;
            }
                                                    
            return associativeArray;
            break;
                                                    
        // String
        default:
            return _arg;
            break;
    }
}


	// Set focus to the canvas element
//	if (_properties.focus) {
//		canvas.focus();
//	}

    
    
	// Wait for the drawing object to be ready before adding objects or other
	// commands
/*
	window[_properties.drawingName].onLoaded = function() {
		// Check for an element containing data
		var dataElement = document.getElementById(_properties.inputId);

		// If dataElement exists and contains data, load it into the drawing
		if (dataElement != null && dataElement.value.length > 0) {
			window[_properties.drawingName].loadDoodles(_properties.inputId);
			window[_properties.drawingName].drawAllDoodles();
		}

		// Otherwise iterate through the command array, constructing argument string
		// and running them
		else {
			for ( var i = 0; i < _properties.onLoadedCommandArray.length; i++) {
				// Get function name
				var func = _properties.onLoadedCommandArray[i][0];

				// Get arguments
				// var args = _properties.onLoadedCommandArray[i][1];
				var args = "";

				for ( var j = 0; j < _properties.onLoadedCommandArray[i][1].length; j++) {
					// ***TODO*** will this work >1 one argument?
					args += _properties.onLoadedCommandArray[i][1][j] + ",";
				}

				args = args.replace(/,$/, '').split(',');

				window[_properties.drawingName][func].apply(
						window[_properties.drawingName], args);
			}
		}

		// Load params
		for ( var i = 0; i < _properties.onLoadedParamsArray.length; i++) {
			window[_properties.drawingName]['setParameterForDoodleOfClass'].apply(
					window[_properties.drawingName], _properties.onLoadedParamsArray[i]);
		}

		// Mark the drawing unmodified
		window[_properties.drawingName]["isReady"]();

		// Initialise hidden input
		var input = document.getElementById(_properties.inputId);
		if (input) {
			input.value = window[_properties.drawingName].save();
		}

		// Detects changes in doodle parameters (eg from mouse dragging)
		window[_properties.drawingName].parameterListener = function() {
			// Pass drawing object to user function
			eDparameterListener(window[_properties.drawingName]);

			// Save changes to value of hidden element ***TODO*** clean this up since
			// duplicated in next function, maybe create a new EyeDraw method.
			var input = document.getElementById(_properties.inputId);
			if (input) {
				input.value = window[_properties.drawingName].save();
			}
		}

		// Save changes to value of hidden element
		window[_properties.drawingName].saveToInputElement = function() {
			var input = document.getElementById(_properties.inputId);
			if (input) {
				input.value = window[_properties.drawingName].save();
			}
		}
	}
 */
    
