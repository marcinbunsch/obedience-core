require('./../spec_helper');

describe('Core', function() {
  
  describe('.each', function() {
    it("should iterate an array", function() {
      result = []
      Obedience.Core.each([1,2,3], function(item) {
        result.push(item)
      })
      result.should_be([1,2,3])
    })
  })
  
})
