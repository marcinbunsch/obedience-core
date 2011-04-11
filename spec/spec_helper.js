var fs = require('fs')

global.include = function(filename) {
  var src = fs.readFileSync(filename);
  require('vm').runInThisContext(src + "\njasmine;", filename);
}

global.mock = require('./helpers/recorderMock');
mock.recorderMock.prefix = ''

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
// include('./obedience.min.js')

// Syntactic sugar to make specs more like Rspec
Object.prototype.should_equal     = function(compare) { expect(this).toEqual(compare); }
Object.prototype.should_be        = Object.prototype.should_equal
Object.prototype.should_not_equal = function(compare) { expect(this).not.toEqual(compare); }