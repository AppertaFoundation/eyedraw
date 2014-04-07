var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Handlebars = require('handlebars');

// The order in which the sripts are found is important here.
var pattern = '{*.js,ED/*.js,ED/Doodles/**/*.js,ED/Misc/*.js}';
var opt = {
	cwd: '../../src',
	sync: true,
	nosort: true
};

// Output filename
var fileName = 'scripts.jsonp';

glob(pattern, opt, function (err, files) {
	if (err) throw err;

	console.log('Found scripts: ', files.join('\n'), '\n');

	var json = JSON.stringify({ files: files }, null, 2);
	var jsonp = 'scriptsLoadCallback(' + json + ');';

	fs.writeFileSync(fileName, jsonp);

	console.log('Created file at location: %s', path.resolve('./' + fileName));
});