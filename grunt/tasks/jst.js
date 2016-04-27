/**
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2014
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global require: false, module: false */

'use strict';

var path = require('path');
var util = require('util');
var decomment = require('decomment');

module.exports = function(grunt) {
	grunt.registerMultiTask('jst', 'Create a script file from javascript templates', function() {

		var templates = {};
		var decomment = require('decomment');
		function getTemplate(filepath) {
			var ext = '.' + filepath.split('.').pop();
			var basename = path.basename(filepath, ext);
			var contents= grunt.file.read(filepath);
			templates[basename] = decomment.text(contents);
		}

		this.files.forEach(function(file) {
			file.src.filter(function(filepath) {
				return grunt.file.exists(filepath);
			}).map(getTemplate);
		});

		var d = util.format('%d/%d/%d',
			new Date().getDate(),
			new Date().getMonth() + 1,
			new Date().getFullYear()
		);

		var jsString = util.format('/*! Generated on %s */\n', d);
		jsString += this.options().varName + ' = ' + JSON.stringify(templates, null, 2) + ';';

		//replace windows line endings
		jsString = jsString.replace(/\\r\\n/g,'\\n');

		grunt.file.write(this.options().dest, jsString);
		grunt.log.ok('Saved to file %s', this.options().dest);
	});
};
