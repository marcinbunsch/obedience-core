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

// This is required by the Router
window.location.href = 'http://example.com'

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

require('jessie').sugar()