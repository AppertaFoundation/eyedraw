/*! Generated on 31/7/2019 */
ED.scriptTemplates = {
  "doodle-popup": "\n\n{{#doodle}}\n{{^doodle.isNode}}\n\t<ul class=\"ed-toolbar-panel ed-doodle-popup-toolbar\">\n\t\t<li>\n\t\t\t{{#desc}}\n\t\t\t\t<a class=\"ed-button ed-doodle-help{{lockedButtonClass}}\" href=\"#\" data-function=\"toggleHelp\">\n\t\t\t\t\t<span class=\"icon-ed-help\"></span>\n\t\t\t\t</a>\n\t\t\t{{/desc}}\n\t\t</li>\n\t\t{{#doodle.isLocked}}\n\t\t\t<li>\n\t\t\t\t<a class=\"ed-button\" href=\"#\" data-function=\"unlock\">\n\t\t\t\t\t<span class=\"icon-ed-unlock\"></span>\n\t\t\t\t\t<span class=\"label\">Unlock</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t{{/doodle.isLocked}}\n\t\t{{^doodle.isLocked}}\n\t\t\t<li>\n\t\t\t\t<a class=\"ed-button\" href=\"#\" data-function=\"lock\">\n\t\t\t\t\t<span class=\"icon-ed-lock\"></span>\n\t\t\t\t\t<span class=\"label\">Lock</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t{{/doodle.isLocked}}\n\t\t<li>\n\t\t\t<a class=\"ed-button{{lockedButtonClass}}\" href=\"#\" data-function=\"moveToBack\">\n\t\t\t\t<span class=\"icon-ed-move-to-back\"></span>\n\t\t\t\t<span class=\"label\">Move to back</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li>\n\t\t\t<a class=\"ed-button{{lockedButtonClass}}\" href=\"#\" data-function=\"moveToFront\">\n\t\t\t\t<span class=\"icon-ed-move-to-front\"></span>\n\t\t\t\t<span class=\"label\">Move to front</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li>\n\t\t\t{{#doodle.isDeletable}}\n\t\t\t\t<a class=\"ed-button{{lockedButtonClass}}\" href=\"#\" data-function=\"deleteSelectedDoodle\">\n\t\t\t\t\t<span class=\"icon-ed-delete\"></span>\n\t\t\t\t\t<span class=\"label\">Delete</span>\n\t\t\t\t</a>\n\t\t\t{{/doodle.isDeletable}}\n\t\t</li>\n\t</ul>\n\t<div class=\"ed-doodle-info\" style=\"display: none;\">\n\t\t{{^doodle.isLocked}}\n\t\t\t{{#desc}}\n\t\t\t\t<div class=\"ed-doodle-description\">{{{desc}}}</div>\n\t\t\t{{/desc}}\n\t\t{{/doodle.isLocked}}\n\t</div>\n\t<div class=\"ed-doodle-controls\" {{#doodle.isLocked}}style=\"display: none;\"{{/doodle.isLocked}} id=\"{{drawing.canvas.id}}_controls\">\n\t</div>\n\t{{/doodle.isNode}}\n\t{{#doodle.isLocked}}\n\t\t<div class=\"ed-doodle-description\">\n\t\t\t<strong>This doodle is locked and cannot be edited.</strong>\n\t\t</div>\n\t{{/doodle.isLocked}}\n{{/doodle}}"
};