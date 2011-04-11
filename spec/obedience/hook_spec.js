require('./../spec_helper');

describe('Hook', function() {
  var Hook = Obedience.Hook;

  afterEach(function() {
    Obedience.Hook.collection = {}
    Obedience.Behavior.collection = {};
  })
  
  it("should add and execute regular functions", function() {
    var callback1 = jasmine.createSpy('one');
    var callback2 = jasmine.createSpy('two');
    Obedience.Hook.insert('test', callback1)
    Obedience.Hook.collection['test'].length.should_be(1)
    callback1.callCount.should_be(0)
    Obedience.Hook.invoke('test')
    callback1.callCount.should_be(1)
    Obedience.Hook.insert('test', callback2)
    Obedience.Hook.collection['test'].length.should_be(2)
    Obedience.Hook.invoke('test')
    callback1.callCount.should_be(2)
    callback2.callCount.should_be(1)
  })

  it("should add and execute behaviors ", function() {
    var spy = jasmine.createSpy('callback');
    var behavior = new Obedience.Behavior('Testing', spy);
    Obedience.Behavior.behavior('test1')
    Obedience.Hook.insert('test', behavior)
    Obedience.Hook.collection['test'].length.should_be(1)
    spy.callCount.should_be(0)
    Obedience.Hook.invoke('test')
    spy.callCount.should_be(1)
  })
  
});