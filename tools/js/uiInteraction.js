(function(App,  $, writeFile, doodleBuilder){

	var app = App || {};

	var uiInteraction = app.uiInteraction || {};

	$(function() {

		//cache jquery DOM lookup
		var $expandingCtrl = $(".expanding"),
				$expandingCntr = $(".expanding-container"),
				$rangeSlider = $(".range"),
				$nameInput = $("#className"),
				$validationMsg = $("#validationMsg"),
				$downloadBtn = $("#download-btn"),
				$resetBtn = $("#resetBtn"),
				$selectAllBtn = $("#selectAllBtn"),
				$checkboxes = $(".checkbox-control").find("input[type='checkbox']"),
				$rangeInput = $("#apex, #scalable");

		//Set up accordion containers
		$expandingCtrl.each(function(i,v){
			//bind click event to every control item
			$(this).bind("click", function(e){
				$(e.target).toggleClass("open");
				$(e.target).next().toggle();
			});
		});

		//Attach input view to read value of range slider
		$rangeSlider.each(function(i,v){
			//set initial values
			$(this).next().attr('value', $(this).attr('value'));

			//bind change event to update view input
			$(this).change(function(e){
				console.log($(e.target).next())
				$(e.target).next().attr('value', $(e.target).attr('value'));
			});
		});

		//Add simple validation to name field
		$nameInput.bind("blur", function(e){
			if($nameInput.val() === ""){
				$validationMsg.show();
			}else{
				$validationMsg.hide();
			}
		});

		//Download event to get finished file
		$downloadBtn.bind("click", function(e){
	
			//Validation for name when downloading class
			if($nameInput.val() === ""){
				$validationMsg.show();
				location.hash = "#className";
				
			}else{
				$validationMsg.hide();
			
				//call doodleBuilder make file method to get String back
				var doodleJs = doodleBuilder.writeClassFromTemplate();
				var doodleName = $nameInput.val();
				writeFile.updateClassFile(doodleJs, doodleName);
			}
			e.preventDefault();
		});

		//bind click event to uncheck all interactivity elements 
		$resetBtn.bind("click", function(e){
			$checkboxes.prop("checked", false);
			$checkboxes.trigger("change");
		});

		$selectAllBtn.bind("click", function(e){
			$checkboxes.prop("checked", true);
			$checkboxes.trigger("change");
		});

		//setup disabled view on page load
		$rangeInput.each(function(i, v){
			var $input = $(this)
			var $setupRangeFields = $(this).next();
			
			if(!$input.is(':checked')){
				$setupRangeFields.addClass("disabled");
				$setupRangeFields.find("input").attr("disabled", true);
			}else{
				$setupRangeFields.removeClass("disabled");
				$setupRangeFields.find("input").attr("disabled", false);
			}
		});

		//handle disabled view on change of range input control
		$rangeInput.bind("change", function(e){

			var $target = $(e.target);
			var $rangeInputFields = $target.next();

			if(!$target.is(':checked')){
				$rangeInputFields.addClass("disabled");
				$rangeInputFields.find("input").attr("disabled", true);
			}else{
				$rangeInputFields.removeClass("disabled");
				$rangeInputFields.find("input").attr("disabled", false);
			}
		});

		//hide all containers
		// $expandingCntr.hide();

		$("#setup-controls").hide();
		$("#interactivity-controls").hide();

		$validationMsg.hide();
	});

	app.uiInteraction = uiInteraction;
	window.App = app;

})(window.App, window.jQuery, window.App.writeFile, window.App.DoodleBuilder);