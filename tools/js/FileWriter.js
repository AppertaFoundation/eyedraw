/*

The FileWriter class is used to download a generated Doodle class javascript file

*/
/*

* @class FileWriter

*/
(function(){
	console.log("app")

	var FileWriter = function(){
		console.log("object class")
		this.init();
	};

	FileWriter.prototype = {
		Construtor: FileWriter,

		init: function(){
				function onInitFs(fs) {

				  fs.root.getFile('scratchdoodle.js', {create: true}, function(fileEntry) {

				    // Create a FileWriter object for our FileEntry (log.txt).
				    fileEntry.createWriter(function(fileWriter) {

				      fileWriter.onwriteend = function(e) {
				        console.log('Write completed.');
				      };

				      fileWriter.onerror = function(e) {
				        console.log('Write failed: ' + e.toString());
				      };

				      //Get initial string from template
				      tmplData = {
				      	param: "Mr.temp"
				      }

						  var template = document.getElementById("template").innerHTML;
						  Mustache.parse(template);   // optional, speeds up future uses
						  var rendered = Mustache.render(template, tmplData);

				      // Create a new Blob and write it to log.txt.
				      var blob = new Blob([rendered], {type: 'text/plain'});

				      fileWriter.write(blob);

				    }, errorHandler);

				  }, errorHandler);

				}

				function errorHandler(e){
					console.log("this is errorrzzz", e);
				}

				// Request Quota (only for File System API)  
				navigator.webkitPersistentStorage.requestQuota(1024*1024, function(grantedBytes){
				  window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
				}, function(e){
				  console.log('Error', e);
				})

		},
		update: function(){
			console.log("updating existing");

			function onUpdateFs(fs){
				
				fs.root.getFile('scratchdoodle.js', {create: false}, function(fileEntry) {
			    // Create a FileWriter object for our FileEntry (log.txt).
			    fileEntry.createWriter(function(fileWriter) {

			      fileWriter.seek(fileWriter.length); // Start write position at EOF.

			      // Create a new Blob and write it to log.txt.
			      var blob = new Blob(['Hello World'], {type: 'text/plain'});

			      fileWriter.write(blob);

			    }, errorHandler);

			  }, errorHandler);

			}

			function errorHandler(e){
				console.log("this is errorr in update", e);
			}

			window.webkitRequestFileSystem(PERSISTENT, 1024*1024, onUpdateFs, errorHandler);
		},
		replace: function(){

			function writeNew(fs){

				console.log("replacing");

				// Create a FileWriter object for our FileEntry (log.txt).
				fs.root.getFile('scratchdoodle.js', {create: true}, function(fileEntry) {
					fileEntry.createWriter(function(fileWriter) {

			      fileWriter.seek(fileWriter.length); // Start write position at EOF.

			      // Create a new Blob and write it to log.txt.
			      var blob = new Blob(['this is whole'], {type: 'text/plain'});

			      fileWriter.write(blob);

			    }, errorHandler);

				}, errorHandler);

			}

			
			function onReplaceFs(fs){

				console.log("removing");
				
				fs.root.getFile('scratchdoodle.js', {create: true}, function(fileEntry) {

					fileEntry.remove(function(){
						window.webkitRequestFileSystem(PERSISTENT, 1024*1024, writeNew, errorHandler);
					});
			    
			  }, errorHandler);

			}

			function errorHandler(e){
				console.log("this is errorr in replace", e)
			}

			window.webkitRequestFileSystem(PERSISTENT, 1024*1024, onReplaceFs, errorHandler);

		}

	
	}

	var App = {};
	App.FileWriter = FileWriter;
	window.app = App;

	// window.app.FileWriter = FileWriter;
	
})();

var writeJsFile = new app.FileWriter();

var updateBtn = document.getElementById("updateString");

updateBtn.addEventListener('click', updateAction, false);

function updateAction(e){
	writeJsFile.update();
	e.preventDefault();
}

var replaceBtn = document.getElementById("replaceString");

replaceBtn.addEventListener('click', replaceAction, false);

function replaceAction(e){
	writeJsFile.replace();
	e.preventDefault();
}

