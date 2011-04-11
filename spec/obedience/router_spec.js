require('./../spec_helper');

describe('Router', function() {
  var spy = jasmine.createSpy('callback');
  var behavior = new Obedience.Behavior('Testing', spy);
  
  var testUrl = function(url, executions) {
    spy.reset()
    Obedience.Router.ran = false;
    window = { location: { href: url }}
    Obedience.Router.run()
    spy.callCount.should_be(executions)
  };
  
  afterEach(function() {
    Obedience.Router.routes.common = []
    Obedience.Router.routes.string = []
    Obedience.Router.routes.regex  = []
    Obedience.Router.exceptions    = {}
    Obedience.Router.ran = false;
    spy.reset()
  })
  
  describe('.map', function() {
    
    it("should work with strings", function() {
      Obedience.Router.map('foo', behavior)      
      testUrl('http://foo.com/foo',  1)
      testUrl('http://foo.com/foo/', 1)
      testUrl('http://foo.com/boo',  0)
    })
  
    it("should work with regex", function() {
      Obedience.Router.map(/(f|b)oo/, behavior)      
      testUrl('http://foo.com/foo',  1)
      testUrl('http://foo.com/boo',  1)
    });
  
    it("should work with :id notation and numeric ids", function() {
      Obedience.Router.map('foo/:id', behavior)      
      testUrl('http://foo.com/foo/34',  1)
    })

    it("should work with :id notation and string ids", function() {
      Obedience.Router.map('foo/:id', behavior)      
      testUrl('http://foo.com/foo/moo',  1)
    })

    it("should work with :num notation and numeric ids", function() {
      Obedience.Router.map('foo/:num', behavior)      
      testUrl('http://foo.com/foo/3',  1)
    })

    it("should not work with :num notation and string ids", function() {
      Obedience.Router.map('foo/:num', behavior)      
      testUrl('http://foo.com/foo/smth',  0)
    })
  
    it("should not work with :string notation and numeric ids", function() {
      Obedience.Router.map('foo/:string', behavior)      
      testUrl('http://foo.com/foo/3',  0)
    })

    it("should work with :string notation and string ids", function() {
      Obedience.Router.map('foo/:string', behavior)      
      testUrl('http://foo.com/foo/smth',  1)
    })
  
    it("should work always with * notation and string ids", function() {
      Obedience.Router.map('*', behavior)
      
      testUrl('http://foo.com/foo/smth',  1)
      testUrl('http://foo.com/moo', 1)    
    })

    it("should work always with /* notation and string ids", function() {
      Obedience.Router.map('foo/*', behavior)
      
      testUrl('http://foo.com/foo/smth',  1)
      testUrl('http://foo.com/foo/3', 1)    
    })
  
  })
  
  describe('.exception', function() {
    
    it("should work with strings", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/3', behavior)
      testUrl('http://foo.com/foo/3', 0)
      testUrl('http://foo.com/foo/1', 1)
    })
  
    it("should work with regex", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception(/foo\/\d/, behavior)
      
      testUrl('http://foo.com/foo/3', 0)
      testUrl('http://foo.com/foo/moo', 1)    
    });
  
    it("should work with :id notation and numeric ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/:id', behavior)
      
      testUrl('http://foo.com/foo/3', 0)
      testUrl('http://foo.com/boo/moo', 1)    
    })

    it("should work with :id notation and string ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/:id', behavior)
      
      testUrl('http://foo.com/foo/moo', 0)
      testUrl('http://foo.com/boo/smth', 1)    
    })

    it("should work with :num notation and numeric ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/:num', behavior)
      
      testUrl('http://foo.com/foo/3', 0)
      testUrl('http://foo.com/boo/smth', 1)    
    })

    it("should not work with :num notation and string ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/:num', behavior)
      
      testUrl('http://foo.com/foo/dad',  1)
      testUrl('http://foo.com/boo/smth', 1)    
    })
  
    it("should not work with :string notation and numeric ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/:string', behavior)
      
      testUrl('http://foo.com/foo/dad',  0)
      testUrl('http://foo.com/foo/3', 1)    
    })

    it("should work always with /* notation and string ids", function() {
      Obedience.Router.map('*', behavior)
      Obedience.Router.exception('foo/*', behavior)
      
      testUrl('http://foo.com/foo/dad',  0)
      testUrl('http://foo.com/foo/3', 0)    
      testUrl('http://foo.com/moo/3', 1)
    })
  
  })
  
  
});