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
 *          Path to folder containing EyeDraw graphics, - onReadyCommandArray
 *          Array of commands and arguments to be run when images are loaded
 */
function eyeDrawInit(_properties)
{
	// Get reference to the drawing canvas
	var canvas = document.getElementById(_properties.canvasId);

    // Options array for drawing object
    var options = new Array();
    options['offsetX'] = _properties.offsetX;
    options['offsetY'] = _properties.offsetY;
    options['toImage'] = _properties.toImage;
    options['graphicsPath'] = _properties.graphicsPath;
    
    // Create a drawing linked to the canvas
	window[_properties.drawingName] = new ED.Drawing(canvas, _properties.eye, _properties.idSuffix, _properties.isEditable, options);
    
    // Create a controller object for this drawing
    var controller = new eyeDrawController(window[_properties.drawingName]);
    
    // Initialise drawing
    window[_properties.drawingName].init();
    
    // Controller class
    function eyeDrawController(_drawing)
    {
        // Assign controller properties
        this.drawing = _drawing;
        
        // Register controller for notifications
        _drawing.registerForNotifications(this, 'notificationHandler', []);
        
        // Method called for notification
        this.notificationHandler = function(_messageArray)
        {
            // Get reference to hidden input element
            var input = document.getElementById(_properties.inputId);
            
            // Handle events by name
            switch (_messageArray['eventName'])
            {
                // Drawing object ready
                case 'ready':
                    // If input exists and contains data, load it into the drawing
                    if (input != null && input.value.length > 0)
                    {
                        // Load drawing data from input element
                        this.drawing.loadDoodles(_properties.inputId);
                        
                        // Draw doodles
                        this.drawing.drawAllDoodles();
                    }
                    // Otherwise run commands in onLoadedCommand array
                    else
                    {
                        for ( var i = 0; i < _properties.onReadyCommandArray.length; i++)
                        {
                            // Get method name
                            var method = _properties.onReadyCommandArray[i][0];
                            var argumentArray = _properties.onReadyCommandArray[i][1];
                            
                            // Run method with arguments
                            var dood = this.drawing[method].apply(this.drawing, argumentArray);
                        }
                    }
                    
                    // Apply bindings (some weirdness here, sometimes interpreted as an array, sometimes as an object
                    //if (_properties.bindingArray.length > 0)
                    if (!ED.objectIsEmpty(_properties.bindingArray))
                    {
                        console.log('adding bindings');
                        this.drawing.addBindings(_properties.bindingArray);
                    }

                    // Apply delete values
                    if (!ED.objectIsEmpty(_properties.deleteValueArray))
                    {
                        console.log('adding elete vlues');
                        this.drawing.addDeleteValues(_properties.deleteValueArray);
                    }
                    
                    // Initialise hidden input
                    if (input != null)
                    {
                        input.value = window[_properties.drawingName].save();
                    }
                    
                    // Optionally make canvas element focussed
                    if (_properties.focus)
                    {
                        console.log('focus');
                        canvas.focus();
                    }
                    
                    break;
                    
                case 'doodleAdded':
                    // Save drawing to hidden input
                    if (input != null && input.value.length > 0)
                    {
                        input.value = this.drawing.save();
                    }
                    break;
                    
                case 'mousedragged':
                    // Save drawing to hidden input
                    if (input != null && input.value.length > 0)
                    {
                        input.value = this.drawing.save();
                    }
                    break;
                    
                case 'parameter':
                    // TEMP stop syncing if slave moves phako incision - put somewhere else
                    //                    if (_messageArray.selectedDoodle != null)
                    //                    {
                    //                        if (_messageArray.selectedDoodle.className == 'PhakoIncision')
                    //                        {
                    //                            //stopSync(_messageArray.selectedDoodle);
                    //                        }
                    //                    }
                    
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
                                var masterDoodle = _messageArray['object'].doodle;
                                
                                // Slave doodle (uses first doodle in the drawing matching the className)
                                var slaveDoodle = window[slaveDrawingName].firstDoodleOfClass(slaveClassNameArray[i]);
                                
                                // If master is being driven, both are defined, and slave doodle is set to sync, enact sync for the changed parameter
                                if (masterDoodle && slaveDoodle && slaveDoodle.willSync && masterDoodle.drawing.isActive)
                                {
                                    slaveDoodle.syncParameter(_messageArray.object.parameter, masterDoodle[_messageArray.object.parameter]);
                                    
                                    // Update any bindings to slave doodle
                                    window[slaveDrawingName].updateBindings(slaveDoodle);
                                }
                                
                            }
                        }
                    }
                    break;
                
                default:
                    //console.log(_messageArray['eventName']);
                    break;
            }
        }
    }
}


/*
 * Stops syncing for passed doodle
 * ***TODO*** Need to take this out of widget and put in app code somewhere
 */
function stopSync(_doodle)
{
    _doodle.willSync = false;
}


