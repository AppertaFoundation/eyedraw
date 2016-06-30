/*

The CommandGenerator class is used to generate canvas commands from a given SVG object.
It uses values to translate and scale the output - these are altered by using the input fields in the UI.
Two sets of commands are generated - one for use in a doodle class, the second set for use in previewing the
generated shape.

Standard use:

var CG = new app.CommandGenerator('canvasView', 'commandView', 'xOffset', 'yOffset', 'scale');
// oDom must be a traversable SVG object containing paths
CG.setSvg(oDOM);
// Generate text version of commands and preview canvas
CG.generateCanvasCommands();

*/
/*

* @class CommandGenerator

* @property {Object} commandConstants string mappings for SVG commands to their canvas equivalent
* @property (Float) SCALE used to translate SVG coords
* @property (Float) X_OFFSET used to translate SVG coords
* @property (Float) Y_OFFSET used to translate SVG coords
* @property (Float) Y_OFFSET used to translate SVG coords
* @property (Float) PREVIEW_OFFSET used to translate SVG coords for use in the preview pane
* @property (String) pattern regex used to parse the paths from the SVG

* @param {String} canvasElement ID of dom element to be used as canvas
* @param {String} viewElement ID of dom element to be used for command output
* @param {String} xInput ID of dom element to be used as input for X_OFFSET
* @param {String} yInput ID of dom element to be used as input for Y_OFFSET
* @param {String} scaleInput ID of dom element to be used as input for SCALE

*/
(function(App){

	var CommandGenerator = function(canvasElement, viewElement, xInput, yInput, scaleInput){
		this.init(canvasElement, viewElement, xInput, yInput, scaleInput);
	};

	CommandGenerator.prototype = {

		Construtor: CommandGenerator,

		commandConstants: {
			M: 'ctx.moveTo(',
			C: 'ctx.bezierCurveTo(',
			L: 'ctx.lineTo(',
			end: ');\n'
		},
		SCALE: 2.4,
		PREVIEW_SCALE: 0.75,
		X_OFFSET: 280,
		Y_OFFSET: 390,
		PREVIEW_OFFSET: 151, // To center on canvas simulating how doodles are positioned
		pattern: /[M|C|L][^a-z]*/ig, // Regex for parsing path components from svg

		init: function(canvasElement, viewElement, xInput, yInput, scaleInput){
			this.setCanvasView(canvasElement);
			this.setCommandView(viewElement);
			this.setInputComponents(xInput, yInput, scaleInput);
		},

		getPathFromSvg: function(svg){
			var paths = svg.getElementsByTagName('path');
			var pathString = this.getLikelyPath(paths);
			return pathString;
		},

		getLikelyPath: function(paths){
			var coords = '';
			for(var i = 0;i < paths.length;i++){
				var tempCoords = paths[i].getAttribute('d');
				coords += ' ' + tempCoords;
			}
			return coords;
		},

		showCommands: function(commands){
			this.commandView.innerHTML = commands;
		},

		renderCanvas: function(commands){
			this.canvasView.width = this.canvasView.width;
			var ctx = this.canvasView.getContext('2d');
			ctx.beginPath();
			// execute string based canvas commands
			eval(commands);

			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.stroke();
		},

		getCanvasCommands: function(pathString){

			//	Each part of the path - M|C|L followed by any type of character
			var out = pathString.match(this.pattern);
			var outputCommands = [];
			var previewOutputCommands = [];

			// Loop over each bezier line
			for(var i = 0;i < out.length;i++){

				var outCommand,
				previewOutCommand,
				tempCommand,
				commandType,
				subCommands,
				coords,
				previewCords;
				// Tidy input
				tempCommand = out[i].trim().replace(/ /g, ',');
				// Get type of command M|C|L
				commandType = tempCommand[0];
				// Remove command type from string
				tempCommand = tempCommand.slice(1,-1);
				subCommands = tempCommand.split(',');
				coords = [];
				previewCords = [];

				//	Process numbers by appling scale and offset values
				for(var i2 = 0;i2 < subCommands.length;i2++){
					var coord = parseFloat(subCommands[i2]);
					var pCoord = coord;
					var yTest = (i2 + 1) % 2;

					if(yTest === 0){
						coord = Math.round((coord - this.Y_OFFSET) * this.SCALE);
						pCoord = Math.round((pCoord - (this.Y_OFFSET - this.PREVIEW_OFFSET)) * this.PREVIEW_SCALE);
					} else {
						coord = Math.round((coord - this.X_OFFSET) * this.SCALE);
						pCoord = Math.round((pCoord - (this.X_OFFSET - this.PREVIEW_OFFSET)) * this.PREVIEW_SCALE);
					}

					coords.push(coord);
					previewCords.push(pCoord);
				}

				// Combine coords back into single string
				coords = coords.join(',');
				// Construct the whole output command string
				outCommand = [
					this.commandConstants[commandType],
					coords,
					this.commandConstants.end
				].join('');

				previewOutCommand = [
					this.commandConstants[commandType],
					previewCords,
					this.commandConstants.end
				].join('');

				//	Push into array of output commands
				outputCommands.push(outCommand);
				previewOutputCommands.push(previewOutCommand);

			}

			return {
				output: outputCommands.join(''),
				preview: previewOutputCommands.join('')
			};

		},

		generateCanvasCommands: function(){
			var path = this.getPathFromSvg(this.svg);
			if(!path){
				alert('No paths found in file');
				return;
			}
			var commands = this.getCanvasCommands(path);
			this.showCommands(commands.output);
			this.renderCanvas(commands.preview);
		},

		setSvg: function(svg){
			this.svg = svg;
		},

		setCommandView: function(elementId){
			this.commandView = document.getElementById(elementId);
		},

		setCanvasView: function(elementId){
			this.canvasView = document.getElementById(elementId);
		},

		setInputComponents: function(xInput, yInput, scaleInput){
			this.xInput = document.getElementById(xInput);
			this.yInput = document.getElementById(yInput);
			this.scaleInput = document.getElementById(scaleInput);

			this.xInput.value = this.X_OFFSET;
			this.yInput.value = this.Y_OFFSET;
			this.scaleInput.value = this.SCALE;

			this.bindInputEvents();
		},

		bindInputEvents: function(){
			var self = this;

			this.xInput.addEventListener('input', function(){
				self.setXOffset(self.xInput.value);
			}, false);

			this.yInput.addEventListener('input', function(){
				self.setYOffset(self.yInput.value);
			}, false);

			this.scaleInput.addEventListener('input', function(){
				self.setScale(self.scaleInput.value);
			}, false);

		},

		setScale: function(s){
			if(this.isNumber(s)){
				this.SCALE = s;
				this.generateCanvasCommands();
			} else {
				console.log('not a number: ' + s);
			}
		},

		setXOffset: function(x){
			if(this.isNumber(x)){
				this.X_OFFSET = x;
				this.generateCanvasCommands();
			} else {
				console.log('not a number: ' + x);
			}
		},

		setYOffset: function(y){
			if(this.isNumber(y)){
				this.Y_OFFSET = y;
				this.generateCanvasCommands();
			} else {
				console.log('not a number: ' + y);
			}
		},

		isNumber: function(val){
			var n = parseInt(val, 10);
			if(typeof n === 'number'){
				return true;
			}
			return false;
		},

	};

	var app = App || {};
	app.CommandGenerator = CommandGenerator;
	window.App = app;

})(window.App);