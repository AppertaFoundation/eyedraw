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

    // Instantiate a controller object
    var controller = new eyeDrawController(window[_properties.drawingName]);
    
	// Preload any images
	window[_properties.drawingName].preLoadImagesFrom(_properties.graphicsPath);
    
    // Controller class
    function eyeDrawController(_drawing)
    {
        // Assign controller properties
        this.drawing = _drawing;
        //this.idSuffix = _idSuffix;
        
        // Call back function
        this.callBack = callBack;
        
        // Register for notifications with drawing object
        this.drawing.registerForNotifications(this, 'callBack', ['loaded', 'doodleAdded', 'mouseDragged', 'parameter']);
        
        // Method called for notification
        function callBack(_messageArray)
        {
            //console.log("Event: ", _properties.idSuffix, _messageArray['eventName']);
            //console.log($(this));
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
                        this.drawing.loadDoodles(_properties.inputId);
                        
                        // Draw doodles
                        this.drawing.drawAllDoodles();
                    }
                    // Otherwise run commands in onLoadedCommand array
                    else
                    {
                        for ( var i = 0; i < _properties.onLoadedCommandArray.length; i++)
                        {
                            // Get method name
                            var method = _properties.onLoadedCommandArray[i][0];
                            var argumentArray = _properties.onLoadedCommandArray[i][1];

                            // Run method with arguments
                            var dood = this.drawing[method].apply(this.drawing, argumentArray);
                        }
                    }
                    
                    // Apply bindings
                    if (ED.objectIsEmpty(_properties.bindingArray.length))
                    {
                        this.drawing.addBindings(_properties.bindingArray);
                    }

                    // Initialise hidden input
                    input.value = window[_properties.drawingName].save();
                    
                    break;
                case 'doodleAdded':
                    // Save drawing to hidden input
                    input.value = this.drawing.save();
                    break;
                case 'mouseDragged':
                    // Save drawing to hidden input
                    input.value = this.drawing.save();
                    break;
                case 'parameter':
                    // Iterate through sync array
                    for (var idSuffix in _properties.syncArray)
                    {
                        // Iterate through each specified className
                        for (var className in _properties.syncArray[idSuffix])
                        {
                            // Get array of specified slave doodle class names
                            var slaveClassNameArray = _properties.syncArray[idSuffix][className];
                            
                            // Iterate through it, 
                            for (var i = 0; i < slaveClassNameArray.length; i++)
                            {
                                // Derive name of drawing to sync to
                                var slaveDrawingName = 'ed_drawing_edit_' + idSuffix;

                                // Master doodle
                                var masterDoodle = this.drawing.selectedDoodle;
                                
                                // Slave doodle (uses first doodle in the drawing matching the className)
                                var slaveDoodle = window[slaveDrawingName].firstDoodleOfClass(slaveClassNameArray[i]);

                                // If both are defined, enact sync for the changed parameter
                                if (masterDoodle && slaveDoodle)
                                {
                                    slaveDoodle.syncParameter(_messageArray.object.parameter, masterDoodle[_messageArray.object.parameter]);
                                }
                                
                                // Update any bindings to slave doodle
                                window[slaveDrawingName].updateBindings(slaveDoodle);
                            }
                        }
                    }
                    break;
                default:
                    console.log('Unhandled notification for message: ' + _messageArray['eventName']);
                    break;
            }
        }
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
    
