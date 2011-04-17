/**
 *  @class
 *  Obedience::Router
 *
 *  Router takes care of launching behaviors in correct places.
 *  Routes are defined in config/routes.js file.
 */ 
Obedience.Router = {
  routes: {
    common: [],
    string: [],
    regex:  []
  },
  exceptions: {},
  _path: null,
  ran: false,
  boot: function() {
    Obedience.Router.run()
  },
  /**
   *  @private
   *  Get the current path
   */
  path: function() {
    return Obedience.Router._path;
  },
  /**
   *  @private
   *  Run the Router
   */
  run: function() {
    var location = window.location.href;
    var matches  = location.match(/https*:\/\/[^\/]*(\/)*([^?#$]*)/);
    var path     = matches[2];
    // Remove the trailing slash
    path         = path.replace(/\/$/, '');
    this._path   = path;

    // reference the Router via the global name rather than this so that
    // the run method may be passed as a parameter
    this.invoke(path);
  },
  /**
   *  @private
   *  Find behaviors for specified path and run them
   */
  invoke: function(path) {
    // Make sure Router runs only once
    if (this.ran) return;
    this.ran = true;
    this.loop(this.routes.common, path, true);
    this.loop(this.routes.string, path);
    this.loop(this.routes.regex, path);
  },
  /**
   *  @private
   *  Loop over a collection of behaviors and checkem them against a path
   */
  loop: function(collection, path, skip_check) {
    for (var index = 0; index<collection.length; index++) {
      var route = collection[index];
      var abort = false;
      if (this.exceptions[route.behavior.name]) {
        for (var i = 0; i<this.exceptions[route.behavior.name].length; i++) {
          var exception = this.exceptions[route.behavior.name][i];
          if (path.match(exception.pattern)) abort = true;
        }
      };
      if (!abort) {
        if (skip_check) {
          this.call(route.behavior, path);
          continue;
        };
        if (route.pattern.constructor == String && path == route.pattern) {
          this.call(route.behavior, path);
        } else if (route.pattern.constructor == RegExp && path.match(route.pattern)) {
          this.call(route.behavior, path);
        };
      };
    };
  },
  /**
   *  @private
   *  A wrapper to allow logging of calls (not implemented yet)
   */
  call: function(behavior, path) {
    Obedience.Debug.info("Running behavior: " + behavior.name);
    Obedience.Hook.invoke(behavior.name + '.beforeInit');
    behavior.callback(path);
    Obedience.Hook.invoke(behavior.name + '.afterInit');
  },
  /**
   *  Map a behavior to a pattern
   */
  map: function(pattern, behavior) {
    if (pattern == '/') pattern = '';
    
    if (pattern.constructor == String && pattern == '*') {
      this.routes.common.push({ pattern: pattern, behavior: behavior });
    } else if (pattern.constructor == String && pattern.match(/:id/)) {
      pattern = new RegExp(pattern.replace(/:id/, '[a-zA-Z0-9]+'));
      this.routes.regex.push({ pattern: pattern, behavior: behavior });
    } else if (pattern.constructor == String && pattern.match(/:num/)) {
      pattern = new RegExp(pattern.replace(/:num/, '[0-9]+'));
      this.routes.regex.push({ pattern: pattern, behavior: behavior });
    } else if (pattern.constructor == String && pattern.match(/:string/)) {
       pattern = new RegExp(pattern.replace(/:string/, '[a-zA-Z]+'));
       this.routes.regex.push({ pattern: pattern, behavior: behavior });
    } else if (pattern.constructor == String && pattern.match(/\*/)) {
      pattern = new RegExp(pattern.replace(/\*/, '[a-zA-Z0-9\-]+'));
      this.routes.regex.push({ pattern: pattern, behavior: behavior });
    } else if (pattern.constructor == RegExp) {
      this.routes.regex.push({ pattern: pattern, behavior: behavior });
    } else {
      this.routes.string.push({ pattern: pattern, behavior: behavior });
    }
  },
  /**
   *  Map a behavior as an exception
   */
  exception: function(pattern, behavior) {
    if (pattern == '/') pattern = '';
    
    if (!this.exceptions[behavior.name]) this.exceptions[behavior.name] = [];

    if (pattern.constructor == String && pattern == '') {
      pattern = new RegExp('^' + pattern + '$');    
    } else if (pattern.constructor == String && pattern.match(/:id/)) {
      pattern = new RegExp(pattern.replace(/:id/, '[a-zA-Z0-9]+'));
    } else if (pattern.constructor == String && pattern.match(/:num/)) {
      pattern = new RegExp(pattern.replace(/:num/, '[0-9]+'));
    } else if (pattern.constructor == String && pattern.match(/:string/)) {
      pattern = new RegExp(pattern.replace(/:string/, '[a-zA-Z]+'));
    } else if (pattern.constructor == String && pattern.match(/\*/)) {
      pattern = new RegExp(pattern.replace(/\*/, '[a-zA-Z0-9\-]+'));
    } else if (pattern.constructor == RegExp) {
    } else {
      pattern = new RegExp(pattern);
    }
    this.exceptions[behavior.name].push({ pattern: pattern, behavior: behavior });
    
  }
};

// attach the Router.run() method to onloads in different frameworks
if (typeof(jQuery) != 'undefined') { 
  jQuery(Obedience.Router.boot);
} else if (typeof(Prototype) != 'undefined') { 
  Event.observe($(window), 'load', Obedience.Router.boot);
} else if (typeof(window) != 'undefined') { 
  window.onload = Obedience.Router.boot;
}
