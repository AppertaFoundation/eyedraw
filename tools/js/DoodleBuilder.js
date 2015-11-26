(function(App, ED, $, Mustache){

	var app = App || {};

	var DoodleBuilder = app.DoodleBuilder || {};

	DoodleBuilder.templateUrl = 'templates/doodleClass.html';
	DoodleBuilder.template = '';

	DoodleBuilder.classDefaults = {
		'locked': false,
		'selectable': true,
		'stayselected': true,
		'squeezable': false,
		'drawable': false,
		'moveable': true,
		'rotatable': true,
		'scalable': true,
		'unique': false,
		'pointinline': false,
		'sync': true,
		'deletable': true,
		'saveable': true,
		'highlight': true,
		'orientated': false,
		'reportable': true,
		'scalexmin': 0.5,
		'scalexmax': 4,
		'scaleymin': 0.5,
		'scaleymax': 4,
		'apexxmin': -500,
		'apexxmax': 500,
		'apexymin': -500,
		'apexymax': 500
	};

	DoodleBuilder.classData = {
		'className': 'TempDoodle',
		'canvasCommands': '',
		'description': 'Temp description - should be replaced'
	};

	DoodleBuilder.controlSelector = '[data-doodle-value]';
	DoodleBuilder.doodleBackgroundSelector = '[data-doodle-background]';
	DoodleBuilder.currentDoodleBackground = 'AntSeg';
	DoodleBuilder.eyedrawController = null;

	DoodleBuilder.init = function(){
		console.log('init DoodleBuilder');

		//	Before binding controls set the defaults
		this.setDefaultControlValues();
		this.bindControls();

		$.get(this.templateUrl, {dataType: 'text'})
			.done(function(data){
				this.template = data;
				this.writeClassFromTemplate();
			}.bind(this))
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log('failed to get template', textStatus, errorThrown);
			});

	};

	DoodleBuilder.setDefaultControlValues = function() {
		for(var key in this.classDefaults){
			var $input = $('[data-doodle-value=' + key + ']');
			if(this.classDefaults[key] === true){
				$input.prop('checked', true);
			} else{
				$input.prop('checked', false);
			}

			this.classData[key] = this.classDefaults[key];

		}
	};

	DoodleBuilder.bindControls = function(){
		// Controls that update the generated Doodle class
		var $controls = $(this.controlSelector);

		$controls.on('input change', function(e){
			var $target = $(e.target);
			var val;
			if($target.is('[type=checkbox]')){
				val = $target.is(':checked');
			} else {
				val = $target.val();
			}

			this.setClassData($target.data('doodleValue'), val);
			this.writeClassFromTemplate();
			this.updateEyedraw();
		}.bind(this));

		var $backgroundDoodle = $(this.doodleBackgroundSelector);
		$backgroundDoodle.on('change', function(e){
			var $target = $(e.target);
			this.currentDoodleBackground = $target.val();
			console.log(this.currentDoodleBackground);
			this.updateEyedraw();
		}.bind(this));
	};

	DoodleBuilder.writeClassFromTemplate = function(){

		var data = this.classData;
		var jsString = Mustache.to_html(this.template, data);
		eval(jsString);

		return jsString;
	};

	DoodleBuilder.updateEyedraw = function(){

		if(this.eyedrawController){
			var d = this.eyedrawController.drawing;
			d.deleteAllDoodles(true);
			d.addDoodle(this.currentDoodleBackground, [], []);
			d.addDoodle(this.classData.className, [], []);
			// d.selectDoodle(this.classData.className);
		} else {
			this.initEyedraw();
		}
	};

	DoodleBuilder.initEyedraw = function(){
		var doodle = ['addDoodle', [this.classData.className]];

		ED.init({
			'drawingName': 'preview_canvas',
			'canvasId': 'preview_canvas',
			'eye': 0,
			'scale': 1,
			'toggleScale': 0,
			'idSuffix': 'right_461',
			'isEditable': true,
			'focus': false,
			'graphicsPath': '../assets/img/',
			'inputId': 'preview_input',
			'onReadyCommandArray': [
				['addDoodle', [this.currentDoodleBackground]],
				doodle,
				['deselectDoodles', []]
			],
			'onDoodlesLoadedCommandArray': [],
			'bindingArray': [],
			'deleteValueArray': [],
			'syncArray': [],
			'listenerArray': [],
			'offsetX': 0,
			'offsetY': 0,
			'toImage': false
		}, function(controller){
			this.eyedrawController = controller;
		}.bind(this));
	};

	DoodleBuilder.setClassData = function(dataKey, dataVal){

		//	Does this dataKey have a default value?
		//	Is this new value different to the default?
		//	If so add key of [keyname]_OR = true to classData
		//	If not make sure to remove that same key
		if(this.classDefaults.hasOwnProperty(dataKey)){
			if(this.classDefaults[dataKey] !== dataVal){
				this.classData[dataKey + '_override'] = true;
			} else {
				this.classData[dataKey + '_override'] = false;
			}
		}

		this.classData[dataKey] = dataVal;
		console.log(this.classData);
	};

	app.DoodleBuilder = DoodleBuilder;
	window.App = app;

})(window.App, window.ED, window.jQuery, window.Mustache);