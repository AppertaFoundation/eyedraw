Eyedraw
=======

You can find the most recent documentation relating to Eyedraw on the [Github pages site](http://openeyes.github.io/eyedraw/)

You can also generate JSDocs and a full list of Doodles and their associated Iconography locally by running 'grunt docs'


This README file should be contained in a folder containing javascript and other files required for running EyeDraw, the OpenEyes medical drawing packages.


The enclosing folder should contain the following files and folders:

- **ED_Drawing.js**		: Required for all EyeDraw functions
- **ED_Adnexal.hs**		: Doodles for Adnexal drawings
- **ED_AntSeg.js**		: Doodles for Anterior Segment drawings
- **ED_Cancerljs**		: Doodles for Breast Cancer drawings
- **ED_General.js**		: Doodles for generic drawings
- **ED_Glaucoma.js**		: Doodles for Glaucoma drawings
- **ED_MedicalRetina.js**	: Doodles for Medical retina drawings
- **ED_Strabismus.js**	: Doodles for Strabismus drawings
- **ED_Vitreoretinal.js**	: Doodles for Vitreoretinal drawings

- **EyeDrawJS (directory)**		: Contains an XCode project file for those who use it

- **img (directory)**		: Contains all graphics and icon files for EyeDraw

- **jsdoc-toolkit (directory)**	: For generating documentation

- **Licence**				: Copy of the GPL3 licence

- **README.md**				: This file

- **OEEyeDraw.css**		: A css file containing styles

- **testDoodle.html**		: An HTML file for use when testing or developing doodles


### Generating Documentation

To update the documentation files, cd to the jsdoc-toolkit directory and run;

	java -jar jsrun.jar app/run.js -a -t=templates/jsdoc -d=/Users/bill/Sites/OpenEyesWebSite/Website/htdocs/reference/eyedraw ../*.js

Updated files can be found by pointing your browser to the destination specified by the -d parameter

License
=======

This software is provided unter terms of the [GNU GPL v3.0 Licence](https://www.gnu.org/licenses/gpl-3.0.en.html). All terms of that license apply.

Note that eyedraw components cannot be used in proprietry applications under any circumstances, including linking, use of APIs or any other type of wrappers, without first applying the GPLv3.0 terms to the proprietry application and freely releasing the (previously) proprierty code as open source and in its entirety

Warranty
========

THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
