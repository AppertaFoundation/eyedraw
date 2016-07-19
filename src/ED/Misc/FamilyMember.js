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
	this.linked = false;
	this.orphan = true;
	this.significant = true;
	this.familyId = 0;
	this.isNode = true;
	this.singleton = true;
	this.multipleBirth = false;
	this.conditionArray = [];
	this.selectedInTable = false;
	this.noPopup = true;
	
	// Derived parameters
	this.dimension = 38;
	this.zoomFactor = 1;
	this.gender = 'Male';
// 	this.drawStub = false;
	this.status = "Unknown";
	this.deceased = false;
	this.isProband = false;
	this.condition = "";
	this.gene = "";
	this.personName = "";
	this.age = "";
	this.dob = "";
	this.adoptedIn = false;
	this.duplicateNumber = 0;
	this.numberOfConditions = 0;
	this.condArray = [];
	
	// re do...
	this.disorders = [{
		'status':'Unknown',
		'onset':'',
		'gene':''
	},
	{
		'status':'Unknown',
		'onset':'',
		'gene':''
	},
	{
		'status':'Unknown',
		'onset':'',
		'gene':''
	},
	{
		'status':'Unknown',
		'onset':'',
		'gene':''
	}];	
	this.comments = "";
	this.hospitalNumber = "";
	this.YOD = "";
	this.IUFD = false;
	this.fetusWks = "";
	this.pdId = "";
	this.comments = "";
		
	this.highlight = false;
	this.hasHoverMenu = true;
	this.spouseStyle = "black";
	this.parentsStyle = "black";
	this.sonStyle = "black";
	this.daughterStyle = "black";
	this.sisterStyle = "black";
	this.brotherStyle = "black";
	this.deleteStyle = "rgba(255,0,0,0.6)";
	this.nodeFillColours = [ "rgba(25,25,140,1)","#00CC00",'#FFCC00','red' ];
	this.nodeFillColoursLighter = [ "#dfd9ee","#ccf4cc",'#fff4cc','#ffcccc' ];


	// Saved parameters (NB not for saving in JSON, but stops controls resetting values)
	this.savedParameterArray = ['disorders','comments','gender', 'status', 'deceased', 'condition','gene','personName','dob','age', 'adoptedIn','condArray','hospitalNumber'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'personName':'Name(s)', 'gender':'Gender', 'dob':'Date of birth', 'disorders':'Disorders', 'deceased':'Deceased', 'IUFD':'IUFD', 'adoptedIn':'Adopted', 'comments':'Comments'};

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
	
	var conditionList = ['+ Add new'];
	conditionList = conditionList.concat(this.conditionArray);
	conditionList.push('');
	
	// Calculate maximum range of origin:
	var halfWidth = (this.drawing.doodlePlaneWidth / 2);
	var halfHeight = (this.drawing.doodlePlaneHeight / 2);
	
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['originX'] = {
		kind: 'simple',
		type: 'float',
		range: new ED.Range(-10000, +10000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['originY'] = {
		kind: 'simple',
		type: 'float',
		range: new ED.Range(-10000, +10000),
		precision: 20,
		animate: true
	};
	this.parameterValidationArray['gender'] = {
		kind: 'derived',
		type: 'string',
		list: ['Male', 'Female', 'Unknown'],
		animate: false
	};
	this.parameterValidationArray['deceased'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['IUFD'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['isProband'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['disorders'] = {
		kind: 'derived',
		type: 'table',
		rows: family.conditionArray,
		rowHeader: 'Disorder(s)',
		columns: [
		{
			header: 'Status',
			kind: 'derived',
			type: 'string',
			list: ['Unknown','Affected', 'Unaffected', 'Carrier'],
			doodleField: 'status',
			animate: false
		},
		{
			header: 'Onset age',
			kind: 'derived',
			type: 'freeText',
			doodleField: 'onset',
			animate: false
		},
		{
			header: 'Gene',
			kind: 'derived',
			type: 'freeText',
			doodleField: 'gene',
			animate: false
		}
		]
	};
	this.parameterValidationArray['hospitalNumber'] = {
		kind: 'derived',
		type: 'freeText',
		animate: false
	};

	this.parameterValidationArray['personName'] = {
		kind: 'derived',
		type: 'freeText',
		animate: false
	};
	this.parameterValidationArray['dob'] = {
		kind: 'derived',
		type: 'freeText',
		animate: false
	};
	this.parameterValidationArray['adoptedIn'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
	this.parameterValidationArray['comments'] = {
		kind: 'derived',
		type: 'freeText',
		display: false,
		longText: true
	};
	this.parameterValidationArray['status'] = {
		kind: 'derived',
		type: 'string',
		list: ['Unknown','Affected', 'Unaffected'],
		animate: false
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
			if (this.node) this.node.gender = _value.charAt(0);
			break;
		case 'status':
			if (this.node) this.node.status = _value;
			break;
		case 'deceased':
			if (this.node) this.node.deceased = _value == "true"?true:false;
			break;
		case 'condition':
			if (this.node) this.node.condition = _value;
/*
			this.condArray = _value.split(',');
			var index = this.condArray.indexOf('');
			if (index > -1) {
			    this.condArray.splice(index, 1);
			}
			index = this.condArray.indexOf('undefined');
			if (index > -1) {
			    this.condArray.splice(index, 1);
			}
			this.numberOfConditions = this.condArray.length;
*/
/*
			if (this.numberOfConditions>0) { 
				this.affected = true;
				if (this.node) this.node.affected = true;
			}
*/
			break;
		case 'personName':
			if (this.node) this.node.personName = _value;
			break;
		case 'gene':
			if (this.node) this.node.gene = _value;
			break;
		case 'age':
			if (this.node) this.node.age = _value;
			family.nSignificantNodes++;
			break;
		case 'dob':
			if (this.node) {
				this.node.dob = _value;
				var today = new Date();
				var age = today - new Date(_value.split('/')[2], _value.split('/')[1] - 1, _value.split('/')[0]);
				this.age = Math.floor(age/31536000000);
				this.node.age = this.age;
			}
			break;
		case 'adoptedIn':
			if (this.node) this.node.adoptedIn = _value == "true"?true:false;
			break;
	}
	
	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FamilyMember.prototype.draw = function(_point) {
	if (this.significant) {
		var generation = (family.generationsArray.length <= 2) ? family.generationsArray.indexOf(this.generationRank) + 2 : family.generationsArray.indexOf(this.generationRank) + 1;
		var generationsNumber = (family.generationsArray.length <= 2) ? family.generationsArray.length + 1 : family.generationsArray.length;
		var generationHeight = ((family.canvasHeight / (generationsNumber + 1)) / family.canvasHeight * 1000) * family.zoomFactor;
		if (generationHeight < ((this.dimension * 3.5) / this.drawing.scale)) generationHeight = ((this.dimension * 3.5) / this.drawing.scale);
		
		this.condArray = this.condition.split(',');
		var index = this.condArray.indexOf('');
		if (index > -1) {
		    this.condArray.splice(index, 1);
		}
		index = this.condArray.indexOf('undefined');
		if (index > -1) {
		    this.condArray.splice(index, 1);
		}
		this.numberOfConditions = 0;
		this.conditionArray = [];
		for (var mm=0; mm<this.disorders.length; mm++) {
			if (this.disorders[mm].status =="Affected") { 
				this.conditionArray[this.numberOfConditions] = family.conditionArray[mm];
				this.numberOfConditions++;
			}
		}
		
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
		ctx.lineWidth = 4 * this.zoomFactor;
	
		if (this.linked || this.selectingLink) ctx.strokeStyle = "rgba(255,0,0,1)";
		else if (this.isSelected) ctx.strokeStyle = "rgba(0,0,0,1)";
		else if (this.drawing.selectedDoodle ) ctx.strokeStyle = "#bfbfbf";
		else ctx.strokeStyle = "rgba(0,0,0,1)";
		
		if (this.status=="Affected" && this.isSelected) ctx.fillStyle = this.nodeFillColours[0];
		else if (this.status=="Affected" && this.drawing.selectedDoodle  ) ctx.fillStyle = this.nodeFillColoursLighter[0];
		else if (this.status=="Affected") ctx.fillStyle = this.nodeFillColours[0];
		else ctx.fillStyle = "rgba(255,255,255,1)";
		
		// highlight node when hover over associated row in table of members
		if (this.highlight) {
			ctx.shadowColor = "rgba(0,0,255,0.8)";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 10;
		}
		
		// Draw boundary path (also hit testing)
		this.drawBoundary(_point);
		ctx.shadowBlur = 0;
	
		// Non boundary paths
		if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
			if (this.multipleBirth || (this.orphan && this.singleton)) {}
			else if (this.adoptedIn) {
				// draw dashed stalk
				ctx.beginPath();
				ctx.moveTo(0, -this.dimension);
// 				ctx.lineTo(0,-this.generationHeight*this.zoomFactor*0.4*0.2);
				ctx.moveTo(0, -this.generationHeight*this.zoomFactor*0.4*0.4);
				ctx.lineTo(0,-this.generationHeight*this.zoomFactor*0.4*0.5);
				ctx.moveTo(0, -this.generationHeight*this.zoomFactor*0.4*0.6);
				ctx.lineTo(0,-this.generationHeight*this.zoomFactor*0.4*0.8);
				ctx.moveTo(0, -this.generationHeight*this.zoomFactor*0.4*0.9);
				ctx.lineTo(0,-this.generationHeight*this.zoomFactor*0.4);
				ctx.moveTo(0, -this.dimension);
				if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "#bfbfbf";
				else ctx.strokeStyle = "black";
			    ctx.lineWidth = 3 * this.zoomFactor;
				ctx.stroke();
			}
			else {
				// draw dashed stalk
				ctx.beginPath();
				ctx.moveTo(0, -this.dimension);
				ctx.lineTo(0, -this.generationHeight * this.zoomFactor * 0.4);
				ctx.moveTo(0, -this.dimension);
				if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "#bfbfbf";
				else ctx.strokeStyle = "black";
			    //if (this.adoptedIn) ctx.setLineDash([10,15]);
			    ctx.lineWidth = 3 * this.zoomFactor;
				ctx.stroke();
				//ctx.setLineDash([]);
			}
	
			if (this.isProband) {
	/*
				var d = this.dimension * 1.3;
				var l = 7;
				ctx.beginPath();
				ctx.moveTo(-l, d);
				ctx.lineTo(l, d);
				ctx.lineTo(0, d - l);
				ctx.closePath();
	            if (this.drawing.selectedDoodle  ) ctx.fillStyle = "rgba(100,100,100,0.2)";
			    else ctx.fillStyle = "rgba(100,100,100,0.9)";
			    if (this.isSelected && this.isLocked) ctx.strokeStyle = "rgba(0,0,0,0.9)";
			    else if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "rgba(100,100,100,0.2)";
			    else ctx.strokeStyle = "rgba(0,0,0,0.9)";
				ctx.fill();
				ctx.stroke();
	*/
				var pX = this.dimension * 0.9;
				var pY = this.dimension * 1;
				if (this.gender == 'Male') pY = this.dimension * 1.3;
				var r = this.dimension * 0.6;
				var l = this.dimension * 0.3;
	
				ctx.beginPath();
				ctx.moveTo(-pX - r, pY + r);
				ctx.lineTo(-pX, pY);
				ctx.lineTo(-pX - l, pY);
				ctx.lineTo(-pX, pY + l);
				ctx.lineTo(-pX, pY);
				ctx.closePath();
				ctx.lineJoin="round";
				ctx.lineWidth = 2.5*this.zoomFactor;
	            if (this.drawing.selectedDoodle  ) ctx.fillStyle = "rgba(100,100,100,0.2)";
			    else ctx.fillStyle = "rgba(0,0,0,0.9)";
			    if (this.isSelected && this.isLocked) ctx.strokeStyle = "rgba(0,0,0,0.9)";
			    else if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "rgba(100,100,100,0.2)";
			    else ctx.strokeStyle = "rgba(0,0,0,0.9)";
				ctx.fill();
				ctx.stroke();
			}
			
			// fill with pie slices indicating multiple conditions
			if (this.numberOfConditions > 0) {
				if (this.gender=='Female') {
					var theta = 2 * Math.PI / this.numberOfConditions;
					for (var w=0; w<this.numberOfConditions; w++) {
						var n = family.conditionArray.indexOf(this.conditionArray[w]);
						var phi = theta + w*theta;
						ctx.beginPath();
						ctx.moveTo(0,0);
						if (w=='0') ctx.arc(0, 0, this.dimension-1, 0, 2*Math.PI, true);
						else ctx.arc(0, 0, this.dimension-1, 0.5*Math.PI, 0.5*Math.PI + theta*w, true);
						ctx.lineTo(0,0);
						if (this.isSelected) ctx.fillStyle = this.nodeFillColours[n];
						else if (this.drawing.selectedDoodle  ) ctx.fillStyle = this.nodeFillColoursLighter[n];
						else ctx.fillStyle = this.nodeFillColours[n];
						ctx.fill();
						ctx.closePath();
					}
				}
				else if (this.gender == 'Male') {
					var l = 2*this.dimension / this.numberOfConditions;
					for (var w=0; w<this.numberOfConditions; w++) {
						var n = family.conditionArray.indexOf(this.conditionArray[w]);
						ctx.beginPath();
						ctx.moveTo(-this.dimension, -this.dimension);
						ctx.rect(-this.dimension+2*this.zoomFactor, -this.dimension+2*this.zoomFactor, 2*this.dimension - l*w -4*this.zoomFactor, 2*this.dimension -4*this.zoomFactor);
						if (this.isSelected) ctx.fillStyle = this.nodeFillColours[n];
						else if (this.drawing.selectedDoodle  ) ctx.fillStyle = this.nodeFillColoursLighter[n];
						else ctx.fillStyle = this.nodeFillColours[n];
						ctx.fill();
						ctx.closePath();
					}
				}
				else {
					var l = this.dimension / this.numberOfConditions;
					for (var w=0; w<this.numberOfConditions; w++) {
						var n = family.conditionArray.indexOf(this.conditionArray[w]);
						ctx.beginPath();
						ctx.moveTo(0, -this.dimension);
						ctx.lineTo(this.dimension - l*w, 0 - l*w);
						ctx.lineTo(0 - l*w, this.dimension - l*w);
						ctx.lineTo(-this.dimension, 0);
						ctx.lineTo(0, -this.dimension);
						if (this.isSelected) ctx.fillStyle = this.nodeFillColours[n];
						else if (this.drawing.selectedDoodle  ) ctx.fillStyle = this.nodeFillColoursLighter[n];
						else ctx.fillStyle = this.nodeFillColours[n];
						ctx.fill();
						ctx.closePath();
					}
				}
			}
			
			
			if (this.deceased || this.IUFD) {
				var d = this.dimension * 1.4;
				ctx.beginPath();
				ctx.moveTo(-d, d);
				ctx.lineTo(d, -d);
				if (this.isSelected && !this.isLocked) ctx.strokeStyle = "rgba(0,0,0,0.4)";
				else if (this.isSelected && this.isLocked) ctx.strokeStyle = "rgba(0,0,0,0.9)";
			    else if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "rgba(100,100,100,0.2)";
			    else ctx.strokeStyle = "rgba(0,0,0,0.9)";
			    ctx.lineWidth = 5 * this.zoomFactor;
				ctx.stroke();
			}
			
			if (this.adoptedIn) {
				var d = this.dimension * 1.4;
				var dOverX = this.dimension*0.4;
				ctx.beginPath();
				ctx.moveTo(-d+dOverX, -d);
				ctx.lineTo(-d, -d);
				ctx.lineTo(-d, d);
				ctx.lineTo(-d+dOverX, d);
				ctx.moveTo(d-dOverX, -d);
				ctx.lineTo(d, -d);
				ctx.lineTo(d, d);
				ctx.lineTo(d-dOverX, d);
				if (this.isSelected && this.isLocked) ctx.strokeStyle = "rgba(0,0,0,0.9)";
			    else if (this.drawing.selectedDoodle  ) ctx.strokeStyle = "rgba(100,100,100,0.2)";
			    else ctx.strokeStyle = "rgba(0,0,0,0.9)";
				ctx.stroke();
			}
			
			if (this.duplicateNumber>0) {
				var w = ctx.measureText(this.duplicateNumber).width;
				var h = this.dimension * 1.7;
	// 	        ctx.fillText(lbl1, -width1 / 2 + 10, height1);
		        
		        var textScale1 = 54 * this.zoomFactor;
				ctx.font = textScale1 + "px sans-serif"; // need to correct for smaller / bigger nodes!
				if (this.isSelected && this.isLocked) ctx.fillStyle = "rgba(0,0,0,0.9)";
				else if (this.drawing.selectedDoodle  ) ctx.fillStyle = "rgba(100,100,100,0.2)";
				else ctx.fillStyle = "rgba(0,0,0,0.9)";
	
				if (this.duplicateNumber<10) ctx.fillText(this.duplicateNumber, -2.5 * w * this.zoomFactor, this.dimension * 0.5);
				ctx.fillText(this.duplicateNumber, -3 * w * this.zoomFactor, this.dimension * 0.5);
			}
			
			if (this.isSelected && !this.isLocked) {		
			    ctx.lineWidth = 3 * this.zoomFactor;
				
				if (this.hasHoverMenu) {
				    // spouse
				    ctx.beginPath();
				    ctx.moveTo(-this.dimension, 0);
				    ctx.lineTo(-1.45 * this.dimension, 0);
				    if (this.gender == "Male") ctx.arc(-1.7 * this.dimension,0,0.25 * this.dimension, 0, 2 * Math.PI);
				    else ctx.rect(-1.9 * this.dimension,-0.2 * this.dimension, 0.45 * this.dimension, 0.45 * this.dimension);
		            ctx.strokeStyle = this.spouseStyle;
		            ctx.closePath();
		            ctx.stroke();
		            
		            // sister
		            ctx.beginPath();
		            ctx.moveTo(0,-this.dimension);
		            ctx.lineTo(0, -1.5 * this.dimension);
				    ctx.lineTo(1.55 * this.dimension,-1.5 * this.dimension);
				    ctx.lineTo(1.55 * this.dimension,-0.2 * this.dimension);
				    ctx.moveTo(1.75 * this.dimension+1.5*this.zoomFactor,0);
				    ctx.arc(1.55 * this.dimension,0,0.25 * this.dimension, 0, 2 * Math.PI);
				    ctx.strokeStyle = this.sisterStyle;
				    ctx.closePath();
		            ctx.stroke();
		
				    // brother
				    ctx.beginPath();
				    ctx.moveTo(1.55 * this.dimension,-1.5 * this.dimension);
				    ctx.lineTo(2.25 * this.dimension,-1.5 * this.dimension);
				    ctx.lineTo(2.25 * this.dimension,-0.2 * this.dimension);
				    ctx.rect(2.05 * this.dimension,-0.2 * this.dimension, 0.45 * this.dimension, 0.45 * this.dimension);
		            ctx.strokeStyle = this.brotherStyle;
		            ctx.closePath();
		            ctx.stroke();
		
		            //parents
		                // i only want this menu if node has no parents?!
		            if (this.orphan) {
		                ctx.beginPath();
				        ctx.moveTo(0, -this.dimension);
		                ctx.lineTo(0, -2.2 * this.dimension);
		                ctx.moveTo(-0.3 * this.dimension, -2.2 * this.dimension);
		                ctx.arc(-0.5 * this.dimension,-2.2 * this.dimension,0.25 * this.dimension, 0, 2 * Math.PI);
		                ctx.lineTo(0.3 * this.dimension, -2.2 * this.dimension);
		                ctx.rect(0.3 * this.dimension,-2.4 * this.dimension, 0.45 * this.dimension, 0.45 * this.dimension);
		                ctx.strokeStyle = this.parentsStyle;
		                ctx.closePath();
		                ctx.stroke();
		            }
		
		            // daughter 
		            ctx.beginPath();
		            ctx.moveTo(-0.03*this.dimension,this.dimension);
		            ctx.lineTo(-0.03*this.dimension,1.6 * this.dimension);
		            ctx.lineTo(-0.5 * this.dimension,1.6 * this.dimension);
		            ctx.lineTo(-0.5 * this.dimension,2 * this.dimension);
		            ctx.moveTo(-0.3 * this.dimension+1.5*this.zoomFactor,2.2 * this.dimension);
		            ctx.arc(-0.5 * this.dimension,2.2 * this.dimension,0.25 * this.dimension, 0, 2 * Math.PI);
		            ctx.strokeStyle = this.daughterStyle;
		            ctx.closePath();
		            ctx.stroke();
		            
		            //son
		            ctx.beginPath();
		            ctx.moveTo(0.03*this.dimension,this.dimension);
		            ctx.lineTo(0.03*this.dimension,1.6 * this.dimension);
		            ctx.lineTo(0.5 * this.dimension, 1.6 * this.dimension);
		            ctx.lineTo(0.5 * this.dimension, 2 * this.dimension);
		            ctx.rect(0.3 * this.dimension,2 * this.dimension, 0.45 * this.dimension, 0.45 * this.dimension);
		            ctx.strokeStyle = this.sonStyle;
		            ctx.closePath();
				    ctx.stroke();
				    
				    // delete cross
				    ctx.beginPath();
				    ctx.strokeStyle = this.deleteStyle;
		            ctx.lineWidth = 5 * this.zoomFactor;
		            ctx.capStyle = "round";
		            ctx.moveTo(1.2 * this.dimension, 1.2 * this.dimension);
		            ctx.lineTo(1.5 * this.dimension, 1.55 * this.dimension);
		            ctx.moveTo(1.5 * this.dimension, 1.2 * this.dimension);
		            ctx.lineTo(1.2 * this.dimension, 1.55 * this.dimension);
		            ctx.closePath();
		            ctx.stroke();
			    
				    // link symbol
				    ctx.beginPath();
		            ctx.moveTo(-0.2 * this.dimension, 0.05* this.dimension);
		            ctx.lineTo(0.2 * this.dimension,0.05* this.dimension);
		            ctx.moveTo(-0.2 * this.dimension, -0.05* this.dimension);
		            ctx.lineTo(0.2 * this.dimension,-0.05* this.dimension);
		            ctx.moveTo(-0.16 * this.dimension, 0.15 * this.dimension);
		            ctx.arc(-0.22 * this.dimension, 0, 0.16 * this.dimension, Math.PI * 0.3, Math.PI * 1.75);
		            ctx.moveTo(0.16 * this.dimension, 0.15 * this.dimension);
		            ctx.arc(0.22 * this.dimension, 0, 0.16 * this.dimension, Math.PI * 0.7, Math.PI * 1.25,true);
		            ctx.moveTo(0,0);
		            ctx.closePath();
	            
	            }
	            
	            if (this.overLink) ctx.lineWidth = 3 * this.zoomFactor;
	            else ctx.lineWidth = 2 * this.zoomFactor;
	            if (this.linked || this.overLink) ctx.strokeStyle = "red";
			    else if (this.status=="Affected") ctx.strokeStyle = "white";
			    else ctx.strokeStyle = "black";
			    ctx.stroke();
			}
	
	        
			// define contents of first line of labels
			    // as fill text won't do line breaks
			var lbl1 = ""
			if (this.IUFD) lbl1 += "IUFD";
			if (this.personName !=="") lbl1 = lbl1 + this.personName;
			if (this.personName !=="" && this.age !=="") lbl1 = lbl1 + ', ';
			if (this.age !=="" && !this.deceased && !this.IUFD) lbl1 = lbl1 + this.age;
			
			// define contents of second line
			var lbl2 = "";
	/*
			if (this.condition !=="") lbl2 = lbl2 + this.condition;
			if (this.condition !=="" && this.gene !=="") lbl2 = lbl2 + " (" + this.gene + ")";
			else 
	*/
			if (this.gene !=="") lbl2 = lbl2 + this.gene;
			
			// text styles
			var textScale2 = 28 * this.zoomFactor;
			ctx.font = textScale2 + "px sans-serif";
			if (this.isSelected && this.isLocked) ctx.fillStyle = "rgba(0,0,0,0.9)";
			else if (this.drawing.selectedDoodle  ) ctx.fillStyle = "rgba(100,100,100,0.2)";
			else ctx.fillStyle = "rgba(0,0,0,0.9)";
			
			// draw label line 1
			var width1 = ctx.measureText(lbl1).width + 10 * 2;
			var height1 = this.dimension * 1.8;
			if (this.isProband || this.adoptedIn) height1 = this.dimension * 2.2;
	        ctx.fillText(lbl1, -width1 / 2 + 10, height1);
	        
	        // draw label line 2
			var width2 = ctx.measureText(lbl2).width + 10 * 2;
			var height2 = this.dimension * 1.8;
			if (this.isProband && lbl1=="") height2 = this.dimension * 2.8;
			else if (lbl1 !=="" && this.isProband) height2 = this.dimension * 2.8;
			else if (lbl1 !=="") height2 = this.dimension * 2.5;
	        ctx.fillText(lbl2, -width2 / 2 + 10, height2);
		}
	}
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Sets characteristics of the member from the node
 */
ED.FamilyMember.prototype.setNode = function(_node) {
	this.node = _node;
	if (this.node.gender == 'F') this.gender = 'Female';
	else if (this.node.gender == 'M') this.gender = 'Male';
	else this.gender = 'Unknown';
	
	this.isProband = this.node.isProband;
	this.status = this.node.status;
	this.deceased = this.node.deceased;
	this.condition = this.node.condition;
	this.personName = this.node.personName;
	this.age = this.node.age;
	this.dob = this.node.dob;
	this.gene = this.node.gene;
	this.orphan = this.node.orphan;
	this.familyId = this.node.index;
	this.adoptedIn = this.node.adoptedIn;
	this.singleton = this.node.singleton;
	this.multipleBirth = this.node.multipleBirth;
	this.duplicateNumber = this.node.duplicateNumber;
	this.duplicateMaster = this.node.duplicateMaster;
	this.conditionArray = family.conditionArray.value;
	this.zoomFactor = family.zoomFactor;
	this.dimension = family.nodeDimension * this.zoomFactor;
	this.originX = ((this.node.p.x / family.canvasWidth) * 1000 - 500) * this.zoomFactor + family.xDisplacement;
	this.originY = ((this.node.p.y / family.canvasHeight) * 1000 - 500) * this.zoomFactor + family.yDisplacement;
	this.significant = this.node.significant;
	this.generationHeight = family.genHeight;
	this.pdId = this.node.pdId;	
}


/**
 * Create html content for member in sidebar table & highlight node
 * Runs when hover on node
 */
ED.FamilyMember.prototype.expandMemberTableRow = function() {
	if (this.node) this.setNode(this.node);

	// highlight node
	this.highlight = true;

	var row = document.getElementById(this.familyId + "Row");
	
	// retain identifier from old row as currently not stored within doodle parameters...
// 	var pedigreeIdentifier = document.getElementById(this.familyId + "HeaderId").innerHTML;
	var pedigreeIdentifier = this.pdId;
	
	var d = "";
	for (var i=0; i<family.conditionArray.length; i++) {
		if (this.disorders[i].status=='Affected' || this.disorders[i].status=='Unffected' || this.disorders[i].status=='Carrier') {
			d += family.conditionArray[i];
			if (this.disorders[i].status.length > 0 || this.disorders[i].onset.length > 0 || this.disorders[i].gene.length > 0) {
				d += " (" + this.disorders[i].status;
				if (this.disorders[i].status.length > 0 && this.disorders[i].gene.length > 0) d += ", ";
				d += this.disorders[i].gene;
				if ((this.disorders[i].status.length > 0 || this.disorders[i].gene.length > 0) && this.disorders[i].onset.length > 0) d += ", ";
				if (this.disorders[i].onset.length > 0) d += "onset " + this.disorders[i].onset + "yrs"
				d += ")";
			}
			d += "; ";
		}
	}
	
	var details = "";
	if (this.deceased) {
		details += "Deceased";
		if (this.YOD.length>0) details += ", " + this.YOD;
		details += "; "
	}
	if (this.IUFD) {
		details += "IUFD";
		if (this.fetusWks.length>0) details += " " + this.fetusWks + "Wks"
		details += "; "
	}
	if (this.adoptedIn) {
		details += "Adopted; ";
	}
	
	var content = "<div id='" + this.familyId + "HeaderId' class='PD-row-header-first'>" + pedigreeIdentifier + "</div><div class='PD-row-field-header'>" + this.personName + "</div><div class='PD-row-clear'></div><div class='PD-row-field-header'>Gender:</div><div class='PD-row-field-summary'>" + this.gender + "</div><div class='PD-row-clear'></div><div class='PD-row-field-header'>DOB:</div><div class='PD-row-field-summary'>" + this.dob + "</div><div class='PD-row-clear'></div><div class='PD-row-field-header'>Disorder(s):</div><div class='PD-row-field-summary'>" + d + "</div><div class='PD-row-clear'></div><div class='PD-row-field-header'>Details:</div><div class='PD-row-field-summary'>" + details + "</div><div class='PD-row-clear'></div><div class='PD-row-field-header'>Comments:</div><div class='PD-row-field-summary'>" + this.comments + "</div><div class='PD-row-clear'></div>";	
	row.innerHTML = content;
	
	if (this.selectedInTable) {		
		var b = document.createElement("div");
		b.className = "PD-member-btn edit";
		b.id = this.familyId + "EditBtn";
		row.appendChild(b);
		
		var dood = this;
		b.addEventListener("mouseup", function() {
			family.drawing.selectDoodle(dood);
		});
	}
}


/**
 * Create html content for member in sidebar table
 * Runs when click on node
 */
ED.FamilyMember.prototype.editMemberTableRow = function() {	
	if (this.node) this.setNode(this.node);
	
	var parentElement = document.getElementById('pedigreeMemberList');
	var row = document.getElementById(this.familyId + "Row");

	// height related to number of items in disorders array
	var h = 270 + 25*family.conditionArray.length;
	row.style.height = h + "px";

	// include pedigree identifier, delete and finishedEditing icons at top
	var content = "<div id='" + this.familyId + "HeaderId' class='PD-row-header-first'>" + this.pdId + "</div><div class='PD-row-clear'></div>";
	row.innerHTML = content;
	
	var deleteIcon = document.createElement("div");
	deleteIcon.className = "PD-member-btn delete";
	deleteIcon.id = this.familyId + "DeleteBtn";
	deleteIcon.style.top = row.offsetTop + "px";
		
	var completeIcon = document.createElement("div");
	completeIcon.className = "PD-member-btn complete";
	completeIcon.id = this.familyId + "CompleteBtn";
	completeIcon.style.top = row.offsetTop + "px";
	
	// create control parameters
	var dood = this;
	for (var key in this.controlParameterArray) {
		var paramHTML = "";
		var field = this.controlParameterArray[key];
		var param = this.parameterValidationArray[key];
		var element;
		
		// Attach onchange event of element with a function which calls the drawing event handler
		var id = this.id;
		var className = this.className;
		var listener;
		
		switch (param.type) {
			//// as with OE control parameters
			// textbox
			case 'freeText':
				if (param.longText) {
					element = document.createElement('textarea');
		    		element.setAttribute('id', this.parameterControlElementId(key));
				}
				else {
					element = document.createElement('input');
		    		element.type = 'text';
		    		element.setAttribute('id', this.parameterControlElementId(key));
				}
				break;
				
			// dropdown
			case 'string':
				element = document.createElement('select');
				element.setAttribute('id', this.parameterControlElementId(key));
				
				for (var i in param.list) {
					var option = document.createElement('option');
					option.innerText = param.list[i];
					element.appendChild(option);
				}
				break;
				
			// checkbox
			case 'bool':
				element = document.createElement('input');
	    		element.type = 'checkbox';
	    		element.setAttribute('id', this.parameterControlElementId(key));
	    		break;
	    	
	    	// table
	    	case 'table':
	    		row.innHTML += "<div></div>"
	    		element = document.createElement('table');
	    		var content = "";
	    		
	    		// Table headers
	    		content += "<tr>";
	    		content += "<td>" + param.rowHeader + "</td>"; 
	    		for (var k=0; k<param.columns.length; k++) {
		    		content += "<td>" + param.columns[k].header + "</td>";
	    		}
	    		content += "</tr>";
	    		
	    		// rows
	    		for (var j=0; j<param.rows.length; j++) {
		    		content += "<tr>";
		    		content += "<td>" + param.rows[j] + "</td>";
		    		for (var l=0; l<param.columns.length; l++) {
			    		content += "<td>";
			    		
			    		var c = param.columns[l];
			    		
			    		var elmt;
			    		switch (c.type) {
				    		case 'freeText':
					    		content += "<span class='txtPD'><input type='text' id='" + key + "_" + j + "_" + c.doodleField + "' value='" + this[key][j][c.doodleField] + "' onchange='family.drawing.selectedDoodle.changeParamN(this.id, this.value)'></span>"
// 					    		elmt.setAttribute('id', this.parameterControlElementId(key));
				    			break;
				    		
				    		case 'string':
				    			content += "<select id='" + key + "_" + j + "_" + c.doodleField + "' onchange='family.drawing.selectedDoodle.changeParamN(this.id, this.value)'>"
				    			for (var i in c.list) {
					    			content += "<option value='" + c.list[i] + "' ";
					    			if (this[key][j][c.doodleField] == c.list[i]) content +="selected";
					    			content += ">" + c.list[i] + "</option>";
								}
								content += "</select>"
				    			break;
			    		}
			    		content += "</td>";
			    	}
		    		content += "</tr>";
	    		}
	
	    		element.innerHTML = content;
	    		element.className = "PD-sidebar-parameter-table-row";
				
	    	default:
				ED.errorHandler('ED.Doodle', 'parameterElement', 'Unexpected type: ' + this.parameterValidationArray[key].type + ' for parameter: ' + key);
				break;
				
		}
		if (param.type !== "table") {
			// Set element value from doodle
			element.value = this[key];
			
			// Add event listener for onchange event, as with OE parameters
			element.addEventListener('change', function() {
				var paramComponents = this.id.split("_");
				var param = paramComponents[1];
				
				var value = (this.type === "checkbox") ? this.checked.toString() : this.value;
				var validityArray = dood.validateParameter(param, value);
							
				if (validityArray.valid) {
					dood.setParameterWithAnimation(param, validityArray.value, false);
				}
			}, false);
			
			// Create label
			var label = document.createElement('label');
			label.innerText = this.controlParameterArray[key];
			label.setAttribute('for', this.parameterControlElementId(key));
		}
		
		
		// Wrap in div to allow display in vertical block
		var div = document.createElement('div');
		div.className = "PD-param-edit-row";

		if (param.type !== "table") div.appendChild(label);
		div.appendChild(element);
		if (param.type == "table" && family.conditionArray.length==0) div.innerHTML += "<div class='PD-newCondition2'><i>No disorders associated with pedigree</i></div>";
		row.appendChild(div);
// 		row.innerHTML += "<div class='PD-row-clear'></div>";

	}
	row.appendChild(completeIcon);
	row.appendChild(deleteIcon);

	deleteIcon.addEventListener('mousedown', function() {
		family.drawing.deleteSelectedNode()
	});
	completeIcon.addEventListener('mousedown', function() {
		family.drawing.deselectDoodles()
	});

}

/**
 * Create html content for member in sidebar table
 * Runs when click on node
 */
ED.FamilyMember.prototype.moveMemberTableRow = function() {
	// retain identifier from old row as currently not stored within doodle parameters...
// 	var pedigreeIdentifier = document.getElementById(this.familyId + "HeaderId").innerHTML;
	var pedigreeIdentifier = this.pdId;
	
	// remove existing row in table
	var row = document.getElementById(this.familyId + "Row");
	var parentElement = document.getElementById('pedigreeMemberList');
	parentElement.removeChild(row);
	
	// create new row at top of table with additional content
	var newRow = document.createElement("div");
	newRow.id = this.familyId + "Row";
	newRow.className = "PD-sidebar-content PD-sidebar-member-row";
	newRow.style.boxShadow = "0px 0px 20px 0px rgba(0, 0, 255, 0.6)";

	if (this.drawing.doodleArray.length==1) parentElement.appendChild(newRow);
	else {
		var topRow = parentElement.firstChild;
		parentElement.insertBefore(newRow, topRow);
	}
	
	parentElement.scrollTop = 0;

}

/**
 * Create html content for member in sidebar table
 * Runs when click on node
 */
ED.FamilyMember.prototype.updateMemberParameter = function(_key, _value) {
	this[_key] = _value;
	this.drawing.repaint();
}

// TODO VALIDATE VALUES...
ED.FamilyMember.prototype.changeParamN = function(_inputId, _value) {
	var p = _inputId.split("_");
	var paramName = p[0];
	var n = p[1];
	var field = p[2];
	
	this[paramName][n][field] = _value;
	// push back to node
	if (this.node) this.node[paramName][n][field] = _value;
	family.drawFamily();
	family.drawing.selectDoodle(this);
}