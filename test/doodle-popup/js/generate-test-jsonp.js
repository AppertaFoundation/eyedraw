var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('util');

// The order in which the sripts are found is important here.
var pattern = '{*.js,ED/*.js,ED/Doodles/**/*.js,ED/Misc/*.js}';

// Glob options.
var globOpt = {
	cwd: path.join('..', '..', '..', 'src'),
	sync: true,
	nosort: true
};

// Output filename
var fileName = 'scripts.jsonp';

glob(pattern, globOpt, function (err, files) {
	if (err) throw err;
	if (!files.length) throw 'No files found!';

	var json = JSON.stringify({ files: files }, null, 2);
	var jsonp = util.format('scriptsLoadCallback(%s);', json);

	fs.writeFileSync(fileName, jsonp);

	console.log('%d Scripts found, created file at location: %s', files.length, path.resolve('./' + fileName));
});