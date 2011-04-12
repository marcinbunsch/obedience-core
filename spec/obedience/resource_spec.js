require('./../spec_helper');

describe('Resource', function() {
 
  if (window.document.head.innerHTML == '') window.document.head.innerHTML = '<meta name="csrf-token" content="TOKEN">'  
  
  describe('.find', function() {
    
    it("should make an ajax call to fetch an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      FakeAjax.fake('GET /users/1.json', '{"name": "Mike"}')
      var result = null;       
      var complete = 0
      User.find(1, function(data) {
        result = data
      }, function() {
        complete = 1
      })
      FakeAjax.calls.last().query.authenticity_token.should_be('TOKEN')
      result.name.should_be('Mike')      
      complete.should_be(1)
    })
    
  })
  
  describe('.create', function() {
  
    it("should make an ajax call to create an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      FakeAjax.fake('POST /users.json', '{"name": "Mike"}')
      var result = null;       
      var complete = 0
      
      User.create({ name: 'Mike'}, function(data) {
        result = data
      }, function() {
        // errors go here
      },function() {
        complete = 1
      })
      FakeAjax.calls.last().data.authenticity_token.should_be('TOKEN')      
      
      result.name.should_be('Mike')      
      complete.should_be(1)

    })
  
  })
  // 
  describe('.update', function() {
  
    it("should make an ajax call to update an object", function() {

      var User     = new Obedience.Resource({ url: '/users'})
      FakeAjax.fake('POST /users/1.json', '{"name": "Mike"}')
      var result = null;       
      var complete = 0
      
      User.update(1, { name: 'Mike'}, function(data) {
        result = data
      }, function() {
        // errors go here
      },function() {
        complete = 1
      })
      
      FakeAjax.calls.last().data.authenticity_token.should_be('TOKEN')      
      
      result.name.should_be('Mike')      
      complete.should_be(1)

    })
  
  })
  // 
  describe('.destroy', function() {
  
    it("should make an ajax call to destroy an object", function() {

      var User     = new Obedience.Resource({ url: '/users'})
      FakeAjax.fake('POST /users/1.json', '{"name": "Mike"}')
      var result = null;       
      var complete = 0
      
      User.destroy(1, function(data) {
        result = data
      }, function() {
        complete = 1
      },function() {
        // errors go here
      })
      
      FakeAjax.calls.last().data.authenticity_token.should_be('TOKEN')      
      
      result.name.should_be('Mike')      
      complete.should_be(1)

    })
  
  })

  describe('.all', function() {
  
    it("should make an ajax call to fetch a collection of objects", function() {

      var User     = new Obedience.Resource({ url: '/users'})
      FakeAjax.fake('GET /users.json', '[{"name": "Mike"},{"name": "Tom"}]')
      var result = null;       
      var complete = 0
      
      User.all(function(data) {
        result = data
      }, function() {
        complete = 1
      })
      
      FakeAjax.calls.last().query.authenticity_token.should_be('TOKEN')      
      
      result.length.should_be(2)
      complete.should_be(1)
    })
  
  })
  // 
});