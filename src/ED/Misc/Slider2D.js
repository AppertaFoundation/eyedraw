/**
 * Slider2D
 *
 * @class Slider2D
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
ED.Slider2D = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Slider2D";
	
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.sphereSign = ' ';
    this.sphereInteger = 0;
    this.sphereFractional = 0;
    this.cylinderSign = ' ';
    this.cylinderInteger = 0;
    this.cylinderFractional = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Slider2D.prototype = new ED.Doodle;
ED.Slider2D.prototype.constructor = ED.Slider2D;
ED.Slider2D.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Slider2D.prototype.setPropertyDefaults = function()
{
    this.snapToGrid = true;
    this.gridSpacing = 5;
    this.isShowHighlight = false;
    
    // Update component of validation array for simple parameters (enable 2D control by adding -50, +50 apexX range
    this.parameterValidationArray['originX']['range'].setMinAndMax(-400, +400);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-400, +400);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['sphereSign'] = {kind:'derived', type:'string', list:['+', '=', '-'], animate:true};
    this.parameterValidationArray['sphereInteger'] = {kind:'derived', type:'int', range:new ED.Range(0, +20), animate:true};
    this.parameterValidationArray['sphereFractional'] = {kind:'derived', type:'string', list:['.00', '.25', '.50', '.75'], animate:true};
    this.parameterValidationArray['cylinderSign'] = {kind:'derived', type:'string', list:['+', '=', '-'], animate:true};
    this.parameterValidationArray['cylinderInteger'] = {kind:'derived', type:'int', range:new ED.Range(0, +20), animate:true};
    this.parameterValidationArray['cylinderFractional'] = {kind:'derived', type:'string', list:['.00', '.25', '.50', '.75'], animate:true};
}

/**
 * Sets default parameters
 */
ED.Slider2D.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('sphereSign', '=');
    this.setParameterFromString('sphereInteger', '0');
    this.setParameterFromString('sphereFractional', '.00');
    this.setParameterFromString('cylinderSign', '=');
    this.setParameterFromString('cylinderInteger', '0');
    this.setParameterFromString('cylinderFractional', '.00');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Slider2D.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'sphereSign':
        	switch (_value)
        	{
        		case '+':
        			returnArray['originY'] = -1 * Math.abs(this.originY);
        			break;
        		
        		case '=':
        			returnArray['originY'] = 0;
        			break;
        			
        		case '-':
        			returnArray['originY'] = Math.abs(this.originY);
        			break;
			}
            break;

        case 'sphereInteger':
        	returnArray['originY'] = (20 * (parseInt(_value) + parseFloat(this.sphereFractional))) * (this.sphereSign == '-'?1:-1);
            break;

        case 'sphereFractional':
        	returnArray['originY'] = (20 * (this.sphereInteger + parseFloat(_value))) * (this.sphereSign == '-'?1:-1);
            break;

        case 'cylinderSign':
        	switch (_value)
        	{
        		case '+':
        			returnArray['originX'] = Math.abs(this.originX);
        			break;
        		
        		case '=':
        			returnArray['originX'] = 0;
        			break;
        			
        		case '-':
        			returnArray['originX'] = -1 * Math.abs(this.originX);
        			break;
			}
            break;

        case 'cylinderInteger':
        	returnArray['originX'] = (20 * (parseInt(_value) + parseFloat(this.sphereFractional))) * (this.sphereSign == '-'?-1:1);
            break;

        case 'cylinderFractional':
        	returnArray['originX'] = (20 * (this.sphereInteger + parseFloat(_value))) * (this.sphereSign == '-'?-1:1);
            break;
                                              
        case 'originY':
        	// Sign
        	if (_value > 0) returnArray['sphereSign'] = '-';
        	else if (_value < 0) returnArray['sphereSign'] = '+';
        	else returnArray['sphereSign'] = '=';
        	
        	// Integer
        	returnArray['sphereInteger'] = Math.floor(Math.abs(_value/20));

            // Fractional
            var diff = Math.abs(_value/20) - Math.floor(Math.abs(_value/20));
            if (diff == 0) returnArray['sphereFractional'] = '.00';
            if (diff == 0.25) returnArray['sphereFractional'] = '.25';
            if (diff == 0.5) returnArray['sphereFractional'] = '.50';
            if (diff == 0.75) returnArray['sphereFractional'] = '.75';            
            break;
            
        case 'originX':
        	// Sign
        	if (_value < 0) returnArray['cylinderSign'] = '-';
        	else if (_value > 0) returnArray['cylinderSign'] = '+';
        	else returnArray['cylinderSign'] = '=';
        	
        	// Integer
        	returnArray['cylinderInteger'] = Math.floor(Math.abs(_value/20));

            // Fractional
            var diff = Math.abs(_value/20) - Math.floor(Math.abs(_value/20));
            if (diff == 0) returnArray['cylinderFractional'] = '.00';
            if (diff == 0.25) returnArray['cylinderFractional'] = '.25';
            if (diff == 0.5) returnArray['cylinderFractional'] = '.50';
            if (diff == 0.75) returnArray['cylinderFractional'] = '.75';            
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Slider2D.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Slider2D.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Slider shape
    var d = 30;
    var w = 80;
    ctx.moveTo(0, -w - d);
    ctx.lineTo(d, -w);
    ctx.lineTo(w, -w);
    ctx.lineTo(w, -d);
    ctx.lineTo(w + d, 0);
    ctx.lineTo(w, d);
    ctx.lineTo(w, w);
    ctx.lineTo(d, w);
    ctx.lineTo(0, w + d);
    ctx.lineTo(-d, w);
    ctx.lineTo(-w, w);
    ctx.lineTo(-w, d);
    ctx.lineTo(-w - d, 0);
    ctx.lineTo(-w, -d);
    ctx.lineTo(-w, -w);
    ctx.lineTo(-d, -w);
    ctx.closePath();
	//ctx.rect(-50, -50, 100, 100);

	// Set line attributes
	ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    
    // Vertical gradient fill
    var bottomColour = "rgba(130, 205, 205, 0.5)";
    var topColour = "rgba(170, 225, 225, 0.5)";
    var gradient = ctx.createLinearGradient(0, -25, 0, 25);
    gradient.addColorStop(0, topColour);
    gradient.addColorStop(1, bottomColour);
    ctx.fillStyle = gradient;

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Axes
        ctx.beginPath();
        
		// Axes
		var l = 100;
		ctx.moveTo(0, -l);
		ctx.lineTo(0, l);
		ctx.moveTo(-l, 0);
		ctx.lineTo(l, 0);
		ctx.moveTo(0, -l);
        
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
		
	// Return value indicating successful hittest
	return this.isClicked;
}

