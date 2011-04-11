require('./../spec_helper');

describe('Resource', function() {
  
  var success  = jasmine.createSpy('success');
  var failure  = jasmine.createSpy('failure');
  var complete = jasmine.createSpy('complete');
  
  beforeEach(function() {
    global.jQuery = mock.recorderMock("attr", 'ajax');    
    jQuery.isArray = function(arr) { arr.constructor == Array };
    jQuery.attr.returns(function(call) { 
      var selector = call.previous.arguments[0];
      var attr     = call.arguments[0]
      selector.should_be('meta[name="csrf-token"]')
      if (selector == 'meta[name="csrf-token"]' && attr == 'content')
        return 'sometoken'
    })
  })
  
  afterEach(function() {
    delete global.jQuery
  })
  
  describe('.find', function() {
    
    it("should make an ajax call to fetch an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      
      User.find(1, success, complete)
      
      // User.find should result in a jQuery.ajax call. Here we verify this
      var args = jQuery.ajax.calls.last.arguments[0]
      args.url.should_be('/users/1.json')
      args.success.should_be(success)
      args.complete.should_be(complete)
      args.data.authenticity_token.should_be('sometoken')
      args.dataType.should_be('json')
      
    })
    
  })
  
  describe('.create', function() {
  
    it("should make an ajax call to create an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      // We make sure that the success callback gets called on success
      var result   = {};
      var success  = function(data) { result = data };
      User.create({ name: 'Mike'}, success, failure, complete)
      
      // User.find should result in a jQuery.ajax call. Here we verify this
      var args = jQuery.ajax.calls.last.arguments[0]
      args.data.name.should_be('Mike')
      args.data.authenticity_token.should_be('sometoken')
      args.dataType.should_be('json')

      args.url.should_be('/users.json')

      // Emulate success response
      args.success({ name: 'Mike' })

      result.name.should_be('Mike')

      args.complete.should_be(complete)
    })
  
  })

  describe('.update', function() {
  
    it("should make an ajax call to update an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      // We make sure that the success callback gets called on success
      var result   = {};
      var success  = function(data) { result = data };
      User.update(2, { name: 'Mike'}, success, failure, complete)
      
      // User.find should result in a jQuery.ajax call. Here we verify this
      var args = jQuery.ajax.calls.last.arguments[0]
      args.data.name.should_be('Mike')
      args.data.authenticity_token.should_be('sometoken')
      args.data._method.should_be('put')
      args.dataType.should_be('json')
      
      args.url.should_be('/users/2.json')

      // Emulate success response
      args.success({ name: 'Mike' })

      result.name.should_be('Mike')

      args.complete.should_be(complete)
    })
  
  })

  describe('.destroy', function() {
  
    it("should make an ajax call to destroy an object", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      // We make sure that the success callback gets called on success
      var result   = {};
      var success  = function(data) { result = data };
      User.destroy(2, success, complete, failure)
      
      // User.find should result in a jQuery.ajax call. Here we verify this
      var args = jQuery.ajax.calls.last.arguments[0]
      args.data.authenticity_token.should_be('sometoken')
      args.data._method.should_be('delete')
      args.dataType.should_be('json')
      
      args.url.should_be('/users/2.json')

      // Emulate success response
      args.success({ name: 'Mike' })

      result.name.should_be('Mike')

      args.complete.should_be(complete)
    })
  
  })

  describe('.all', function() {
  
    it("should make an ajax call to fetch a collection of objects", function() {
      var User     = new Obedience.Resource({ url: '/users'})
      // We make sure that the success callback gets called on success
      var result   = {};
      var success  = function(data) { result = data };
      User.all({}, success, complete, failure)
      
      // User.find should result in a jQuery.ajax call. Here we verify this
      var args = jQuery.ajax.calls.last.arguments[0]
      args.data.authenticity_token.should_be('sometoken')
      
      args.dataType.should_be('json')
      
      args.url.should_be('/users.json')

      // Emulate success response
      args.success([{ name: 'Mike' }, { name: 'Tom'}])

      result.length.should_be(2)

      args.complete.should_be(complete)
    })
  
  })
  
});