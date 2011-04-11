require('./../spec_helper');

describe('Debug', function() {
  
  it("should be off by default", function() {
    Obedience.Debug.status.should_be('off')
  })

  it("should be triggerable", function() {
    Obedience.Debug.status.should_be('off')
    Obedience.Debug.on()
    Obedience.Debug.status.should_be('on')
    Obedience.Debug.off()
    Obedience.Debug.status.should_be('off')
  })
  
  it("should send console.info only if debug is on", function() {
    spyOn(console, 'info')
    Obedience.Debug.info('Foo')
    console.info.callCount.should_be(0)
    Obedience.Debug.on()
    Obedience.Debug.info('Foo')
    console.info.callCount.should_be(1)
    Obedience.Debug.off()
    Obedience.Debug.info('Foo')
    console.info.callCount.should_be(1)
  })
  
});