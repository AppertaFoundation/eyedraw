## Setup

Before you can view/run the doodle-popup tests, you need to do the following

1. Update bower components
2. Generate test jsonp

### Update bower components

1. Ensure bower is installed (sudo npm install bower -g)
2. Run `bower install` from the module root

### Generate test jsonp

This will generate a JSON array of the eyedraw src JavaScript.

Run: `node generate-test-jsonp.js`

This is useful for development where we won't want to use the compile/concat'ed files.
