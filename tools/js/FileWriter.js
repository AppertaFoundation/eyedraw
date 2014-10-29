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
			console.log("init");

				

				function onInitFs(fs) {
					console.log("writing");
				  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

				    // Create a FileWriter object for our FileEntry (log.txt).
				    fileEntry.createWriter(function(fileWriter) {

				      fileWriter.onwriteend = function(e) {
				        console.log('Write completed.');
				      };

				      fileWriter.onerror = function(e) {
				        console.log('Write failed: ' + e.toString());
				      };

				      // Create a new Blob and write it to log.txt.
				      var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

				      fileWriter.write(blob);

				    }, errorHandler);

				  }, errorHandler);

				}

				function errorHandler(e){
					console.log("this is errorrzzz", e)
				}

				// Request Quota (only for File System API)  
				navigator.webkitPersistentStorage.requestQuota(1024*1024*280, function(grantedBytes){
				  window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
				}, function(e){
				  console.log('Error', e);
				})
				

				//window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
		}

		

	}

	window.app.FileWriter = FileWriter;
	
})();

var writeJsFile = new app.FileWriter();
