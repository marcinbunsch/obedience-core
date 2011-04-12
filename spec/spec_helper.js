var fs = require('fs')

// Simple function to ease file loading of source files so they get loaded up in the global scope
global.include = function(filename) {
  var src = fs.readFileSync(filename);
  require('vm').runInThisContext(src, filename);
}

// Load up jsdom
global.window = require("jsdom").jsdom().createWindow();
global.navigator = { userAgent : ''}

// Load FakeAjax before jQuery so it sets up as the xhr provider
include('./spec/helpers/fake_ajax.js')
include('./spec/helpers/jquery.js')

// Make sure jQuery is available in a global scope
global.jQuery = window.jQuery

// Load up source files
include('./src/obedience.js')
include('./src/behavior.js')
include('./src/core.js')
include('./src/router.js')
include('./src/debug.js')
include('./src/router.js')
include('./src/resource.js')
include('./src/hook.js')

// If you want to test the bundled versions, uncomment this line
// include('./obedience.core.js')
// include('./obedience.core.min.js')

// Syntactic sugar to make specs more like Rspec
// The hack in here is to prevent jqXHR fram automatically calling these functions 
// and passing a callback which is interpreted by jasmine as an expectation
Object.prototype.should_equal     = function(compare) { 
  if (!this.getAllResponseHeaders && this != global) expect(this).toEqual(compare); 
}
// func.toString = function() { return 'Object' };
Object.prototype.should_be        = Object.prototype.should_equal
Object.prototype.should_not_equal = function(compare) { 
  if (this.getAllResponseHeaders && this != global) expect(this).not.toEqual(compare); }
