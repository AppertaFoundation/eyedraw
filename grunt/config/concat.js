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
		basic_and_extras : {
			files: {
				'assets/js/dist/eyedraw.js': [
					'src/ED.js',
					'src/ED/Drawing.js',
					'src/ED/Doodle.js',
					'src/ED/Report.js',
					'src/ED/Drawing/**/*.js',
					'src/ED/Misc/**/*.js',
					'src/ED/Doodles/**/*.js'
				],
				'assets/js/dist/oe-eyedraw.js': [
					'src/OEEyeDraw.js',
					'src/ED/Checker.js',
					'src/ED/Controller.js',
					'src/ED/TagCloud.js',
					'src/ED/View.js',
					'src/ED/Views/**/*.js'
				]
			}
		}
	}
};