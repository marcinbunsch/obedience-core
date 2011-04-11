/**
 *  @class
 *  Obedience::Core
 *  @exports Obedience.Core as Core
 *
 *  Core stores convenience methods used by Obedience elements to not conflict any 
 *  methods defined by frameworks
 */
Obedience.Core = {
  // iterate the array and run the callback with the current item as the argument
  each: function(array, callback) {
    for (var index = 0, len = array.length; index<len; index++) 
      callback(array[index]);
  }
};