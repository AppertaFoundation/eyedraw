/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Family Member
 *
 * @class FamilyMember
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.FamilyMember = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "FamilyMember";

	// Special parameters (passed from Pedigree Object)
	this.node = null;

	// Derived parameters
	this.dimension = 32;
	this.gender = 'Male';
	this.drawStub = false;
	this.affected = false;
	this.deceased = false;
	this.isProband = false;
	this.condition = "";

	// Saved parameters (NB not for saving in JSON, but stops controls resetting values)
	this.savedParameterArray = ['gender', 'affected', 'deceased', 'condition'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'gender':'Gender', 'affected':'Affected', 'deceased':'Deceased', 'condition':'Text'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.FamilyMember.prototype = new ED.Doodle;
ED.FamilyMember.prototype.constructor = ED.FamilyMember;
ED.FamilyMember.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.FamilyMember.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['dimension'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Drawing.Range(0, 1000),
		animate: true
	};
	this.parameterValidationArray['gender'] = {
		kind: 'derived',
		type: 'string',
		list: ['Male', 'Female', 'Unknown'],
		animate: true
	};
	this.parameterValidationArray['drawStub'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['affected'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['deceased'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['isProband'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['condition'] = {
		kind: 'derived',
		type: 'freeText',
		animate: true
	};
}

/**
 * Sets default parameters
 */
ED.FamilyMember.prototype.setParameterDefaults = function() {

}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.FamilyMember.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'gender':
			if (this.node) this.node.member.gender = _value.charAt(0);
			updateMemberSet(this.node.member.name, 'gender', this.node.member.gender);
			break;
		case 'affected':
			if (this.node) this.node.member.affected = _value == "true"?true:false;
			updateMemberSet(this.node.member.name, 'affected', this.node.member.affected);
			break;
		case 'deceased':
			if (this.node) this.node.member.deceased = _value == "true"?true:false;
			updateMemberSet(this.node.member.name, 'deceased', this.node.member.deceased);
			break;
// 		case 'condition':
// 			if (this.node) this.node.member.condition = _value == "true"?true:false;
// 			updateMemberSet(this.node.member.name, 'deceased', this.node.member.deceased);
// 			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FamilyMember.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.FamilyMember.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();
	switch (this.gender) {
		case 'Male':
			ctx.rect(-this.dimension, -this.dimension, this.dimension * 2, this.dimension * 2);
			break;
		case 'Female':
			ctx.arc(0, 0, this.dimension, 0, Math.PI * 2, true);
			break;
		case 'Unknown':
			ctx.moveTo(0, -this.dimension);
			ctx.lineTo(-this.dimension, 0);
			ctx.lineTo(0, this.dimension);
			ctx.lineTo(this.dimension, 0);
			ctx.lineTo(0, -this.dimension);
			break;
	}

	// Set line attributes
	ctx.lineWidth = 4;

	// Colour of outer line is dark gray
	ctx.strokeStyle = "rgba(120,120,120,0.75)";

	// Colour of fill
	if (this.affected) ctx.fillStyle = "rgba(150,150,150,0.75)";
	else ctx.fillStyle = "rgba(255,255,255,0.75)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (this.drawStub) {
			ctx.beginPath();
			ctx.moveTo(0, -this.dimension);
			ctx.lineTo(0, -this.dimension * 2);
			ctx.stroke();
		}

		if (this.deceased) {
			var d = this.dimension * 1.2;
			ctx.beginPath();
			ctx.moveTo(-d, d);
			ctx.lineTo(d, -d);
			ctx.stroke();
		}

		if (this.isProband) {
			var d = this.dimension * 1.3;
			var l = 5;
			ctx.beginPath();
			ctx.moveTo(-l, d);
			ctx.lineTo(l, d);
			ctx.lineTo(0, d - l);
			ctx.closePath()
			ctx.fillStyle = "rgba(150,150,150,0.75)";
			ctx.fill();
			ctx.stroke();
		}

		// Draw condition
		ctx.font = "24px sans-serif";
		ctx.fillStyle = "rgba(100,100,100,0.75)";
		var width = ctx.measureText(this.condition).width + 10 * 2;
		ctx.fillText(this.condition, -width / 2 + 10, 64);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Sets characteristics of the member from the node
 *
 * @returns {String} Description of doodle
 */
ED.FamilyMember.prototype.setNode = function(_node) {
	this.node = _node;
	if (this.node.type == PD.NodeType.Female) this.gender = 'Female';
	if (this.node.type == PD.NodeType.Male) this.gender = 'Male';
	if (this.node.type == PD.NodeType.Unknown) this.gender = 'Unknown';

	this.isProband = this.node.member.isProband;
	this.affected = this.node.member.affected;
	this.deceased = this.node.member.deceased;
	this.condition = this.node.member.condition;
}