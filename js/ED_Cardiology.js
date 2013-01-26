/**
 * @fileOverview Contains doodle subclasses for glaucoma
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 28th Ootober 2011
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
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Heart
 *
 * @class Heart
 * @property {String} className Name of doodle subclass
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
ED.Heart = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Heart";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Heart.prototype = new ED.Doodle;
ED.Heart.prototype.constructor = ED.Heart;
ED.Heart.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Heart.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Heart.prototype.setPropertyDefaults = function()
{
    //this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Heart.prototype.setParameterDefaults = function()
{
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Heart.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Heart.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(-287,	-51);
        
        ctx.bezierCurveTo(-344, 53, -346, 243, -116, 209);
        ctx.bezierCurveTo(5, 297, 269, 341, 312, 268);
        ctx.bezierCurveTo(387, 141, 319, -17, 237, -59);
        ctx.bezierCurveTo(225, -133, 141, -209, 65, -215);
        ctx.bezierCurveTo(55, -209, 43, -219, 53, -193);
        ctx.bezierCurveTo(133, -185, 201, -129, 216, -46);
        ctx.bezierCurveTo(205, -23, 167, 11, 187, 25);
        ctx.bezierCurveTo(202, 36, 192, -37, 235, -3);
        ctx.bezierCurveTo(291, 41, 333, 227, 295, 207);
        ctx.bezierCurveTo(195, 155, 153, 111, 97, 43);
        ctx.bezierCurveTo(74, 15, 177, 62, 181, 43);
        ctx.bezierCurveTo(187, 17, 109, 25, 55, 19);
        ctx.bezierCurveTo(31, -7, -172, -89, -173, -87);
        ctx.bezierCurveTo(-173, -84, -232, -117, -191, -73);
        ctx.bezierCurveTo(-115, -49, -61, -13, -37, -3);
        ctx.bezierCurveTo(-67, 45, -14, 171, 3, 165);
        ctx.bezierCurveTo(21, 159, -53, 45, 15, 23);
        ctx.bezierCurveTo(103, 87, 199, 183, 231, 249);
        ctx.bezierCurveTo(199, 297, -31, 243, -81, 199);
        ctx.bezierCurveTo(-53, 175, -8, 204, -13, 187);
        ctx.bezierCurveTo(-17, 171, -66, 181, -105, 185);
        ctx.bezierCurveTo(-331, 209, -289, 33, -273, -37);
        ctx.bezierCurveTo(-270, -47, -287, -51, -287, -51);

        
        ctx.closePath();
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Heart.prototype.description = function()
{
    return "Heart";
}

/**
 * Aorta
 *
 * @class Aorta
 * @property {String} className Name of doodle subclass
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
ED.Aorta = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Aorta";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Aorta.prototype = new ED.Doodle;
ED.Aorta.prototype.constructor = ED.Aorta;
ED.Aorta.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Aorta.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Aorta.prototype.setPropertyDefaults = function()
{
    this.isSelectable= false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Aorta.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.5;
    this.scaleY = 0.5;
    this.originX = -352;
    this.originY = -416;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Aorta.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Aorta.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(216, -112);
        ctx.bezierCurveTo(216, -112, 181, 46, 210, 40);
        ctx.bezierCurveTo(239, 33, 282, -111, 282, -111);

        ctx.moveTo(423, 335);
        ctx.bezierCurveTo(423, 335, 453, 57, 313, 31);
        ctx.bezierCurveTo(281, 26, 330, -100, 330, -100);
        
        ctx.moveTo(-1, -25);
        ctx.bezierCurveTo(-1, -25, 57, 2, 74, 41);
        ctx.bezierCurveTo(82, 61, 93, 79, 116, 78);
        ctx.bezierCurveTo(144, 78, 141, 42, 141, 7);
        ctx.bezierCurveTo(141, -50, 159, -97, 159, -97);

        ctx.moveTo(198, 582);
        ctx.bezierCurveTo(214, 619, 155, 663, 105, 649);
        
        ctx.moveTo(-39, 12);
        ctx.bezierCurveTo(-39, 12, 52, 54, 28, 133);
        ctx.bezierCurveTo(28, 133, -2, 180, -16, 200);
        ctx.bezierCurveTo(-49, 246, -125, 446, -28, 595);
        ctx.lineTo(-1, 640);
        ctx.bezierCurveTo(67, 725, 152, 624, 119, 566);
        ctx.bezierCurveTo(151, 598, 255, 603, 251, 514);
        ctx.bezierCurveTo(250, 473, 182, 418, 182, 418);
        ctx.bezierCurveTo(118, 352, 162, 209, 254, 211);
        ctx.bezierCurveTo(314, 212, 287, 365, 287, 365);
        
        //ctx.closePath();
        
        ctx.lineWidth = 8;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Aorta.prototype.description = function()
{
    return "Aorta";
}

/**
 * RightCoronaryArtery
 *
 * @class RightCoronaryArtery
 * @property {String} className Name of doodle subclass
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
ED.RightCoronaryArtery = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RightCoronaryArtery";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RightCoronaryArtery.prototype = new ED.Doodle;
ED.RightCoronaryArtery.prototype.constructor = ED.RightCoronaryArtery;
ED.RightCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RightCoronaryArtery.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.RightCoronaryArtery.prototype.setPropertyDefaults = function()
{
    this.isSelectable= false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.RightCoronaryArtery.prototype.setParameterDefaults = function()
{
    this.originX = 24;
    this.originY = 2;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RightCoronaryArtery.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RightCoronaryArtery.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(-54, 292);
        ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
        ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);        

//        ctx.moveTo(-210, -104);
//        ctx.bezierCurveTo(-253, -100, -259, -73, -254, -66);
        ctx.moveTo(-254, -66);
        ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
        ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
        ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);   
        
        ctx.moveTo(-244, -58);
        ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
        ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
        ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.RightCoronaryArtery.prototype.description = function()
{
    return "RightCoronaryArtery";
}

/**
 * LeftCoronaryArtery
 *
 * @class LeftCoronaryArtery
 * @property {String} className Name of doodle subclass
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
ED.LeftCoronaryArtery = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LeftCoronaryArtery";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LeftCoronaryArtery.prototype = new ED.Doodle;
ED.LeftCoronaryArtery.prototype.constructor = ED.LeftCoronaryArtery;
ED.LeftCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LeftCoronaryArtery.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.LeftCoronaryArtery.prototype.setPropertyDefaults = function()
{
    //this.isSelectable= false;
    
    // Update component of validation array for simple parameters
//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.LeftCoronaryArtery.prototype.setParameterDefaults = function()
{
    //    this.originX = -500;
    this.originY = 0;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -153;
    this.apexY = -84;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LeftCoronaryArtery.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LeftCoronaryArtery.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();

        // Start segment
        //ctx.moveTo(-210, -94);
        ctx.moveTo(this.apexX, this.apexY);
        //ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
        ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
        ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
        ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);
        
        ctx.moveTo(68, 136);
        ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
        ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
        ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
        ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
        ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);
        
        ctx.moveTo(200, 257);
        ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
        ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
        ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);
        
        ctx.moveTo(67, 143);
        ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
        ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
        ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);
        
        ctx.moveTo(103, 218);
        ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
        ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);
             
        ctx.moveTo(195, 136);
        ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
        ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
        ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);
        
        ctx.moveTo(164, 284);
        ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
        ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);
        
        ctx.lineTo(-6, 94);
        ctx.moveTo(221, 80);
        
        ctx.moveTo(135, -33);
        ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
        ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
        ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
        ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
        //
        ctx.moveTo(190, 133);
        ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
        ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);
        
        ctx.moveTo(54, -12);
        ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
        ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);
        
        // End segment
        ctx.moveTo(-38, 158);
        ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
        ctx.bezierCurveTo(-152, -40, -146, -27, this.apexX - 20, this.apexY);

        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.LeftCoronaryArtery.prototype.description = function()
{
    return "LeftCoronaryArtery";
}

/**
 * AnomalousVessels
 *
 * @class AnomalousVessels
 * @property {String} className Name of doodle subclass
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
ED.AnomalousVessels = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AnomalousVessels";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AnomalousVessels.prototype = new ED.Doodle;
ED.AnomalousVessels.prototype.constructor = ED.AnomalousVessels;
ED.AnomalousVessels.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AnomalousVessels.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AnomalousVessels.prototype.setPropertyDefaults = function()
{
    //this.isSelectable= false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.AnomalousVessels.prototype.setParameterDefaults = function()
{
    //    this.originX = -500;
    this.originY = -100;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AnomalousVessels.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AnomalousVessels.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(68, 136);
        ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
        ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
        ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
        ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
        ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);
        
        
        
        ctx.moveTo(200, 257);
        ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
        ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
        ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);
        
        ctx.lineTo(254, 89);
        ctx.moveTo(-6, 94);
        ctx.bezierCurveTo(-8, 113, -11, 132, -33, 164);
        
        ctx.moveTo(67, 143);
        ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
        ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
        ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);
        
        ctx.moveTo(103, 218);
        ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
        ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);
        
        ctx.moveTo(-54, 292);
        ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
        ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);
        
        ctx.lineTo(-91, 307);
        
        ctx.moveTo(195, 136);
        ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
        ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
        ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);
        
        ctx.moveTo(164, 284);
        ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
        ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);
        
        ctx.lineTo(-6, 94);
        ctx.moveTo(221, 80);
        //ctx.lineTo(257, 151);
        
        ctx.moveTo(257, 151);
        ctx.bezierCurveTo(257, 151, 278, 176, 288, 190);
        ctx.bezierCurveTo(297, 204, 312, 227, 304, 240);
        ctx.bezierCurveTo(291, 264, 223, 250, 200, 250);
        
        ctx.moveTo(-14, 278);
        ctx.bezierCurveTo(-14, 278, -49, 217, -98, 230);
        
        //ctx.lineTo(-48, 290);
        
        ctx.moveTo(135, -33);
        ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
        ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
        ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
        ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
        //
        ctx.moveTo(190, 133);
        ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
        ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);
        
        ctx.moveTo(54, -12);
        ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
        ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);
        
        ctx.moveTo(-210, -104);
        ctx.bezierCurveTo(-253, -100, -259, -73, -254, -66);
        ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
        ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
        ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);
        
        ctx.moveTo(-38, 158);
        ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
        ctx.bezierCurveTo(-152, -40, -206, -27, -238, -56);
        
        ctx.moveTo(-244, -58);
        ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
        ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
        ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);
        
        ctx.moveTo(-210, -94);
        ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
        ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
        ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
        ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);
        
        //ctx.closePath();
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.AnomalousVessels.prototype.description = function()
{
    return "AnomalousVessels";
}

/**
 * Lungs
 *
 * @class Lungs
 * @property {String} className Name of doodle subclass
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
ED.Lungs = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Lungs";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Lungs.prototype = new ED.Doodle;
ED.Lungs.prototype.constructor = ED.Lungs;
ED.Lungs.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lungs.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Lungs.prototype.setPropertyDefaults = function()
{
    this.isSelectable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Lungs.prototype.setParameterDefaults = function()
{
    this.apexY = -20;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lungs.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Lungs.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Right lung
    ctx.moveTo(-147, -281);
    ctx.bezierCurveTo(-224, -279, -414, 29, -426, 289);
    ctx.bezierCurveTo(-334, 226, -219, 196, -79, 236);
    ctx.bezierCurveTo(-6, 231, -71, -284, -147, -281);

    // Left Lung
    ctx.moveTo(147, -281);
    ctx.bezierCurveTo(224, -279, 414, 29, 426, 289);
    ctx.bezierCurveTo(334, 226, 219, 196, 79, 236);
    ctx.bezierCurveTo(6, 231, 71, -284, 147, -281);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Effusion
 *
 * @class Effusion
 * @property {String} className Name of doodle subclass
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
ED.Effusion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Effusion";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Effusion.prototype = new ED.Doodle;
ED.Effusion.prototype.constructor = ED.Effusion;
ED.Effusion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Effusion.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Effusion.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
    this.isRotatable = false;
    // Update component of validation array for simple parameters
    //this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    //this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Effusion.prototype.setParameterDefaults = function()
{
    this.apexX = -231;
    this.apexY = 136;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Effusion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Effusion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Right effusion
    ctx.moveTo(this.apexX, this.apexY);
    ctx.lineTo(-400 + (-136 + this.apexY) * -0.3, this.apexY);
    ctx.lineTo(-426, 289);
    //ctx.bezierCurveTo(-224, -279, -414, 29, -426, 289);
    ctx.bezierCurveTo(-334, 226, -219, 196, -79, 236);
    ctx.lineTo(-44, this.apexY);
    ctx.lineTo(this.apexX, this.apexY);
    //ctx.bezierCurveTo(-6, 231, -71, -284,this.apexX, this.apexY);
    
    // Left Lung
//    ctx.moveTo(147, -281);
//    ctx.bezierCurveTo(224, -279, 414, 29, 426, 289);
//    ctx.bezierCurveTo(334, 226, 219, 196, 79, 236);
//    ctx.bezierCurveTo(6, 231, 71, -284, 147, -281);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.Effusion.prototype.description = function()
{
    return "Pleural effusion "
}


/**
 * Bypass
 *
 * @class Bypass
 * @property {String} className Name of doodle subclass
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
ED.Bypass = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bypass";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bypass.prototype = new ED.Doodle;
ED.Bypass.prototype.constructor = ED.Bypass;
ED.Bypass.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bypass.prototype.setHandles = function()
{
//	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Bypass.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
    this.isRotatable = false;
    // Update component of validation array for simple parameters
//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bypass.prototype.setParameterDefaults = function()
{
    this.apexX = 40;
    this.apexY = -60;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bypass.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bypass.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Bypass graft
    var x = -320;
    var y = -200;
    var d = 150;
    var r = 20;
    cpX = x + (this.apexX - x)/2;
    cpY = y + (this.apexY - y)/2 - d;
    
    ctx.moveTo(x, y);
    //ctx.lineTo(x + (this.apexX - x)/2, y + (this.apexY - y)/2 - d);
    //ctx.lineTo(this.apexX, this.apexY);
    ctx.bezierCurveTo(cpX, cpY, cpX, cpY, this.apexX, this.apexY - r);
    ctx.lineTo(this.apexX, this.apexY + r);
    ctx.bezierCurveTo(cpX, cpY + r, cpX, cpY + r, x, y + r);
    ctx.closePath();
    
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 000, 000, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	//this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bypass.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // U tear
	returnString += "'U' tear at ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * Macular Thickening
 *
 * @class Crepitations
 * @property {String} className Name of doodle subclass
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
ED.Crepitations = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Crepitations";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Crepitations.prototype = new ED.Doodle;
ED.Crepitations.prototype.constructor = ED.Crepitations;
ED.Crepitations.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Crepitations.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Crepitations.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+50, +200);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Crepitations.prototype.setParameterDefaults = function()
{
	this.rotation = -Math.PI/4;
	this.apexX = 50;
	this.apexY = 0;
	
    this.setOriginWithDisplacements(-150, 300);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Crepitations.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Crepitations.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Start path
		ctx.beginPath();
		
		// Spacing of lines
		var d = 30;
		
		// Draw central line
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
        
		// Draw other lines
		for (var s = -1; s < 2; s += 2)
		{
			for (var y = d; y < r; y += d)
			{
				var x = this.xForY(r, y);
				ctx.moveTo(-x, s * y);
				ctx.lineTo(x, s * y);
			}
		}
		
		// Set attributes
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(200, 200, 200, 0.75)";
		
		// Draw lines
		ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
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
ED.Crepitations.prototype.description = function()
{
    return "Crepitations in left lower lobe";
}

/**
 * Wheeze
 *
 * @class Wheeze
 * @property {String} className Name of doodle subclass
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
ED.Wheeze = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Wheeze";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Wheeze.prototype = new ED.Doodle;
ED.Wheeze.prototype.constructor = ED.Wheeze;
ED.Wheeze.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Wheeze.prototype.setHandles = function()
{
//	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
//	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Wheeze.prototype.setPropertyDefaults = function()
{    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Wheeze.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Wheeze.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Wheeze.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, -50, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 8;
        
        // Red centre
        ctx.beginPath();
        ctx.arc(-50, 0, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(-34, -100);
        ctx.lineTo(66, -150);
        ctx.lineTo(66, -50);
        
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(50, -50, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        
        //ctx.lin
        ctx.closePath();
        ctx.fillStyle = "gray";
        ctx.fill();
	}
    
	// Coordinates of handles (in canvas plane)
//    var point = new ED.Point(0, 0);
//    point.setWithPolars(rc, Math.PI/4);
//	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.Wheeze.prototype.description = function()
{
    var returnString = "Signficant numbers of ";
    if (this.apexY > -100) returnString = "Moderate numbers of ";
    if (this.apexY > -50) returnString = "Several ";
	
	return returnString + "hard drusen";
}

/**
 * MetalStent
 *
 * @class MetalStent
 * @property {String} className Name of doodle subclass
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
ED.MetalStent = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MetalStent";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MetalStent.prototype = new ED.Doodle;
ED.MetalStent.prototype.constructor = ED.MetalStent;
ED.MetalStent.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MetalStent.prototype.setHandles = function()
{
    	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
    //	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.MetalStent.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MetalStent.prototype.setParameterDefaults = function()
{
    this.originX = -18;
    this.originY = 86;
    this.rotation = -4.985446531081719;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MetalStent.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY, this.rotation);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MetalStent.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.rect(-50, -10, 100, 20);
    
	// Set attributes
	ctx.lineWidth = 2;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
	// Coordinates of handles (in canvas plane)
    //    var point = new ED.Point(0, 0);
    //    point.setWithPolars(rc, Math.PI/4);
    //	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(-50, -10);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
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
ED.MetalStent.prototype.description = function()
{
    return "Metal stent";
}

/**
 * Stenosis
 *
 * @class Stenosis
 * @property {String} className Name of doodle subclass
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
ED.Stenosis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Stenosis";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.degree = 0;
    this.type = "Non-calcified";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Stenosis.prototype = new ED.Doodle;
ED.Stenosis.prototype.constructor = ED.Stenosis;
ED.Stenosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Stenosis.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Stenosis.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-10, +10);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
//    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
//    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
//    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['degree'] = {kind:'derived', type:'float', range:new ED.Range(0, 1.0), precision:0, animate:true};
    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Calcified', 'Non-calcified'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Stenosis.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('degree', '0');
    this.apexX = 0;
    this.apexY = 0;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Stenosis.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            returnArray['type']  = _value > 0?"Calcified":"Non-calcified";
            break;
            
        case 'apexY':
            returnArray['degree']  = _value/-1;
            break;
            
        case 'type':
            returnArray['apexX'] = _value == "Calcified"?+10:-10;
            break;
            
        case 'degree':
            returnArray['apexY'] = -1 * _value;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Stenosis.prototype.draw = function(_point)
{
    
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Stenosis.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	//ctx.rect(-100, -50, 200, 100);
    ctx.arc(0, 0, 30, 0, 2 * Math.PI, false);
    
	// Set attributes
	ctx.lineWidth = 2;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.strokeStyle = "blue";
    if (this.apexX > 0) ctx.fillStyle = "rgba(0, 0, 255," + (this.apexY/-100) + ")";
    else ctx.fillStyle = "rgba(0, 255, 0," + (this.apexY/-100) + ")";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
//        ctx.fillStyle = "blue";
//        
//        ctx.beginPath();
//        ctx.moveTo(-100, -50);
//        ctx.bezierCurveTo(this.apexX, this.apexY, this.apexX, this.apexY, 100, -50);
//        ctx.closePath();
//        ctx.fill();
//        
//        ctx.beginPath();
//        ctx.moveTo(-100, 50);
//        ctx.bezierCurveTo(this.apexX, -this.apexY, this.apexX, -this.apexY, 100, 50);
//        ctx.closePath();
//        ctx.fill();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Coordinates of handles (in canvas plane)
//    var point = new ED.Point(-100, -50);
//	this.handleArray[2].location = this.transform.transformPoint(point);
    point = new ED.Point(this.apexX, this.apexY);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
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
ED.Stenosis.prototype.description = function()
{
    return "Stenosis";
}
