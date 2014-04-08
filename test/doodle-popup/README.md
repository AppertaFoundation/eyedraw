# Doodle popup

Any files in this location (eyedraw/test/doodle-popup) are not required for
the main EyeDraw widget. These files are used simply for development and testing
of the doodle-popup feature.

## Setup

Before you can view/run the doodle-popup test document, you need to do the following:

1. Update bower components
2. Generate test jsonp

### 1. Update bower components

1. Ensure bower is installed (sudo npm install bower -g)
2. Run `bower install` from the module root

### 2. Generate test jsonp

The generate script sits within the './js' directory. and will generate a
JSON array of the eyedraw src JavaScript.

Run: `node generate-test-jsonp.js`

This is useful for development where we don't want to use the compile/concat'ed files.
