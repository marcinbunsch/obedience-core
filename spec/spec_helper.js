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
var Sugar = {
  should_be: function(compare) { expect(this).toEqual(compare); },
  should_not_be: function(compare) { expect(this).not.toEqual(compare); }
}
String.prototype.should_be        = Sugar.should_be
Number.prototype.should_be        = Sugar.should_be
Array.prototype. should_be        = Sugar.should_be
String.prototype.should_not_be    = Sugar.should_not_be
Number.prototype.should_not_be    = Sugar.should_not_be
Array.prototype. should_not_be    = Sugar.should_not_be
