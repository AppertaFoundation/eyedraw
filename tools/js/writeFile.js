(function(App,  $ ){

	var app = App || {};

	var writeFile = app.writeFile || {};

	var tempFile = 'tempDoodle.js';

	writeFile = {

		updateClassFile: function(newClassTxt, className){

			var fileData = window.btoa(newClassTxt);
      // console.log(fileData);
      var header = 'data:application/octet-stream;charset=utf-8;base64,';
      header += fileData;

 			var $dl = $('#downloadTrigger');
      $dl.attr('href', header);
      $dl.attr('download', className +'.js');
      $dl[0].click(); //funky click trigger. This fixes an issue where jquery Trigger downloads file twice
		}
	}

	app.writeFile = writeFile;
	window.App = app;

})(window.App, window.jQuery);