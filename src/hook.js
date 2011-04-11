/**
 *  @class
 *  Obedience::Hook
 *
 *  Hook is an ultra simple custom callback implementation<br />
 *  It allows you to place callbacks in your code with<br />
 *  <pre>Hook.invoke('eventName')</pre>
 *  You can then inject a new callback in different locations using<br />
 *  <pre>Hook.insert('eventName', function() {})</pre>
 */
Obedience.Hook = {
  /** @private */
  collection: {},
  /**
   * @description Insert a new callback function into a Hook identified by hook
   */
  insert: function(hook, callback) {
    var Hook = this;
    if (!hook) return;
    if (!Hook.collection[hook]) Hook.collection[hook] = [];
    if (!callback) return;
    Hook.collection[hook].push(callback);
    Obedience.Debug.info("Added Hook: " + (callback.name || 'an anonymous callback') + ' to ' + hook);
    return callback;
  },
  /**
   * @description Invoke callbacks inserted into a hook
   */
  invoke: function(hook) {
    var Hook = this;
    if (!Hook.collection[hook]) return;
    Obedience.Debug.info("Invoking Hook: " + hook);
    for (var index = 0; index<Hook.collection[hook].length; index++) {
      // Behaviors are now objects, so we need to reference the callback
      if (Hook.collection[hook][index].callback && Hook.collection[hook][index].callback.constructor == Function) {
        Obedience.Debug.info("Running Behavior " + Hook.collection[hook][index].name);
        Hook.collection[hook][index].callback();
      } else if (Hook.collection[hook][index].constructor == Function) {
        Hook.collection[hook][index]();
      }
    }
    return true;
  }
};