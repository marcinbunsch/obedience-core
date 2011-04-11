/**
 *  @class
 *  @exports Obedience.Behavior as Behavior
 */
Obedience.Behavior = function(name, callback) {
  this.name = name;
  this.callback = callback;
  /** 
   * Map behavior always
   */  
  this.everywhere = function() {
    Obedience.Router.map('*', this);
    return this;
  };
  /** 
   * Map behavior to path
   * @param routes 
   */
  this.on = function() {
    var self = this;
    Obedience.Core.each(arguments, function(pattern) {
      Obedience.Router.map(pattern, self);
    });
    return this;
  };
  /** 
   * Map behavior to path
   * @param routes 
   */
  this.except = function() {
    var self = this;
    Obedience.Core.each(arguments, function(pattern) {
      Obedience.Router.exception(pattern, self);
    });
    return this;
  };
  
};

/** 
 *  @static
 *  @private
 */
Obedience.Behavior.collection = {};

/**
 *  @function
 *  @exports Behavior as functions.Behavior
 *  @description Shorthand function for accessing/creating Behaviors
 */
Obedience.Behavior.behavior = function(name, behavior) {
 if (!behavior) return Obedience.Behavior.collection[name];
 var instance = new Obedience.Behavior(name, behavior);
 if (Obedience.Behavior.collection[name]) throw 'The Behavior name \'' + name + '\' is reserved. Please choose a different name';
 Obedience.Behavior.collection[name] = instance;
};