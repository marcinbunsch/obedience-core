require('./../spec_helper');

describe('Behavior', function() {
  var behavior;
  beforeEach(function () {
    behavior = new Obedience.Behavior('Testing', function() { return 1; });
  });
  
  afterEach(function() {
    Obedience.Behavior.collection = {};
  })
  
  describe('constructor', function() {
    it('should do create a new Behavior', function() {
      behavior.name.       should_be('Testing')
      behavior.callback(). should_be(1)
    })
  })
  
  describe('#everywhere()', function() {
    beforeEach(function () { behavior.everywhere();     });
    afterEach(function ()  { Obedience.Router.routes.common = []; });
    
    it("should map to all", function() {
      Obedience.Router.routes.common.length.           should_be(1)
      Obedience.Router.routes.common[0].behavior.name. should_be('Testing')
    })

    it("should not map on strings", function() {
      Obedience.Router.routes.string.length.           should_be(0)
    })

    it("should not map on regex", function() {
      Obedience.Router.routes.regex.length.            should_be(0)
    })

  })
  
  describe('#on()', function() {
    beforeEach(function () { behavior.on('/foo', '/bar') });
    afterEach(function ()  { Obedience.Router.routes.string = []   });
  
    it("should not map to all", function() {
      Obedience.Router.routes.common.length.           should_be(0)
    })

    it("should map multiple on strings", function() {
      Obedience.Router.routes.string.length.           should_be(2)
      Obedience.Router.routes.string[0].behavior.name. should_be('Testing')
    })
    
    it("should not map on regex", function() {
      Obedience.Router.routes.regex.length.            should_be(0)
    })
    
  })

  describe('#exception()', function() {
    beforeEach(function () { behavior.except('/foo', '/bar') });
    afterEach(function ()  { Obedience.Router.exceptions = {}          });
  
    it("should map multiple on exception", function() {
      Obedience.Router.exceptions['Testing'].length.   should_be(2)
      Obedience.Router.exceptions['Testing'][0].pattern.toString().should_be("/\/foo/")
      Obedience.Router.exceptions['Testing'][1].pattern.toString().should_be("/\/bar/")
    })
    
  })
  
  describe('.behavior', function() {
    
    it("should work", function() {
      Obedience.Behavior.behavior('Foo', function() {
        return 12;
      })
      Obedience.Behavior.collection['Foo'].name.should_be('Foo')
      Obedience.Behavior.collection['Foo'].callback().should_be(12)
    })
    
  })

})