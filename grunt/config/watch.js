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
		concat: {
			files : [ '<%= jshint.files %>' ],
			//tasks : [ 'jshint', 'qunit' ]
			tasks : [ 'build' ]
		},
		sass: {
			files: 'assets/sass/**/*.scss',
			tasks: ['compass:dist'],
			options: {
				// livereload: true
			}
		}
	}
};