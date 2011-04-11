/**
 *  @class
 *  Obedience::Debug
 *  @exports Obedience.Debug as Debug
 *
 *  Debug stores methods for 
 */
Obedience.Debug = function(context) {
  return {
    // The status of debug (on/off)
    status: 'off',
    // enable Debug
    on: function() { this.status = 'on'; },
    // disable Debug
    off: function() { this.status = 'off'; },
    // send a Debug message to the console
    info: function(msg) {
      if (this.status == 'on' && context.console && console.info) 
        console.info.apply(console, [msg]);
    }
  };
}(this);
