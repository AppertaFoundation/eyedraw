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
	grunt.registerTask('list', 'The docs build task', function(){

		var src = this.options().src;
		var dest = this.options().dest;
		var template = this.options().template;

		var doodles = [];

		function getClassname(filepath){
			var className = filepath.split("/").pop().split(".").shift();
			return className;
		}

		function getDescription(className){
			var description = className.replace(/([a-z])([A-Z])/g, '$1 $2');
			return description;
		}

		var specialities = grunt.file.expand(src+'**/');

		specialities.forEach(function(subfolder){
			var specialty;
			var paths = subfolder.split("/");
			if(paths.length === 5){
				specialty = paths[3];

				var srcFiles = grunt.file.expand(src+specialty+'/*.js');
				srcFiles.forEach(function(filename){
					var className = getClassname(filename);
					var desc = getDescription(className);
					doodles.push({'specialty': specialty, 'description': desc, 'iconName': className});
				});
			}
		});

		grunt.config.set('doodles', doodles);
		var doodleList = {'doodles': doodles};

		var tmpl = grunt.file.read(template);

		var templComp = grunt.template.process(tmpl, {data: doodleList})

 		grunt.file.write(dest, templComp);

	});
};