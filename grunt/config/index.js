/**
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function(grunt) {
	return {
		pkg: grunt.file.readJSON('package.json'),
		concat: require('./concat')(grunt),
		jshint: require('./jshint')(grunt),
		qunit: require('./qunit')(grunt),
		uglify: require('./uglify')(grunt),
		watch: require('./watch')(grunt),
		compass: require('./compass')(grunt),
		connect: require('./connect')(grunt),
		jst: require('./jst')(grunt),
		mocha: require('./mocha')(grunt),
		jsdoc: require('./jsdoc')(grunt),
		list: require('./list')(grunt)
	};
};

