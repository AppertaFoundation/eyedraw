EyeDraw Documentation
=====================

Compiled Documentation from Javascript generated via grunt-jsdoc plugin and Docstrap plugin to add Bootswatch templating.


## Notes on updating documentation


#### Use of Namespaces

- Changed namespace referencing, to add explicit name and move description on to its own line
- Duplicated namespace annotation for ED in each file where the object is referenced. 
- Added Namespace documentation to main Base Classes to separate them from functional classes. You might not agree with this 	 usage of namespace and prefer to keep them as @class 



#### Events

- Added explicit event namespace to Drawing events to ensure the correct documentation link is available



#### Misc 

- Removed several lines of misleading @fileOverview, suspect some were leftovers from copy and paste of GNU license block
- Added README.md file to docs to explain contents of application. You may want to flesh these out. 