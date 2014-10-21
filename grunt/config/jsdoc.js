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

module.exports = function(grunt) {
	return {
    dist : {
      src: ['src/**/*.js', 'test/**/*.js'], 
      options: {
        destination: 'jsdocs',
        template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
        configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
      }
    }
	};
};