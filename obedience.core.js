/**
 * @namespace
 * @private
 */
var Obedience = {};

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

Obedience.Resource = function(options) {
  var base_url = options.url;
  var parts = options.url.split('/');
  var singular = parts[parts.length - 1].replace(/s$/, '');
  var cache = {};
  var extract_errors = function(response) {
    try {
      var data = jQuery.parseJSON(response.responseText);
      var errors = [];
      jQuery.each(data, function(index, value) {
				jQuery.each(value[singular], function(index, error) {
					errors.push(error.error.description);
				});
      });
      return errors;
    } catch(e) {
      return [];
    };
  };
  this.url = options.url;
  this.extract_errors = extract_errors;
  this.scopes = {};
  this.scope = function(params) {
    var scope_key = jQuery.param(params);
    // Save the scoped resource in a cache so that when we later access it, we the same one
    if (this.scopes[scope_key]) return this.scopes[scope_key];
    cloned_options = {};
    // cloned current options
    jQuery.each(options, function(key, value) {
      cloned_options[key] = value;
    });
    // apply params to url
    jQuery.each(params, function(key, value) {
      cloned_options.url = cloned_options.url.replace(new RegExp(':' + key), value);
    });
    this.scopes[scope_key] = new Resource(cloned_options);
    return this.scopes[scope_key];
  };
	this.cache = function(id, value) {
		if (value) cache[id] = value;
		return cache[id];
	};
	this.cacheCollection = function(array) {
	  var self = this;
	  jQuery.each(array, function(index, item) {
			self.cache(item[singular].id, item);
		});
	};
	this.getCacheCollection = function(){
	  return cache;
	};
	this.all = function(params, success, complete, failure) {
		if (typeof params == 'function') {
			failure = complete;
			complete = success;
			success = params;
			params = null;
		};
		params = params || {};
		params['authenticity_token'] = jQuery('meta[name="csrf-token"]').attr('content');

		var self = this;
    jQuery.ajax({
      type: 'GET',
      url: options.url + '.json',
      data: params,
      success: function(result) { 
				success(result);
				if (jQuery.isArray(result)) {
					jQuery.each(result, function(index, item) {
					  // This is a loop, but will always do one
					  for (key in item)
					    self.cache(item[key].id, item);
					});
				};
			},
      complete: complete,
      error: failure,
      dataType: 'json'
    });
	};
	this.get = function(params, success, complete) {
		if (typeof params == 'function') {
			complete = success;
			success = params;
			params = null;
		}
		params = params || {};
		params['authenticity_token'] = jQuery('meta[name="csrf-token"]').attr('content');

    jQuery.ajax({
      type: 'GET',
      url: options.url + '.json',
      data: params,
      success: success,
      complete: complete,
      dataType: 'json'
    });
	};
	this.find = function(id, success, complete) {
		if (cached = this.cache(id)) return cached;
		var params = {
      'authenticity_token': jQuery('meta[name="csrf-token"]').attr('content')
    };
    jQuery.ajax({
      type: 'GET',
      url: options.url + '/' + id + '.json',
      data: params,
      success: success,
      complete: complete,
      dataType: 'json'
    });
	};
	// TODO: switch order of complete and failure
  this.destroy = function(id, success, complete, failure) {
    var params = {
      '_method': 'delete',
      'authenticity_token': jQuery('meta[name="csrf-token"]').attr('content')
    };
    jQuery.ajax({
      type: 'POST',
      url: options.url + '/' + id + '.json',
      data: params,
      success: success,
      complete: complete,
      error: function(response) {
        if (failure) failure(extract_errors(response), response);
      },
      dataType: 'json'
    });
  };
  this.create = function(params, success, failure, complete) {
    var self = this;
    params = params || {};
    if (typeof(params) == 'string') {
      params = params + '&authenticity_token=' + jQuery('meta[name="csrf-token"]').attr('content');
    } else {
      params['authenticity_token'] = jQuery('meta[name="csrf-token"]').attr('content');
    };
    jQuery.ajax({
      type: 'POST',
      url: options.url + '.json',
      data: params,
      success: function(result) { 
        // Cache the return value under the first found id (we always have one primary key, so there will always be one)
        for (key in result) 
          if (result[key].id) { self.cache(result[key].id, result); break; };
				if (success) success(result);
			},      
      complete: complete,
      error: function(response) {
        if (failure) failure(extract_errors(response), response);
      },
      dataType: 'json'
    });
  };
  this.update = function(id, params, success, failure, complete) {
		var self = this;
    params = params || {};
    if (typeof(params) == 'string') {
      params = params + '&authenticity_token=' + jQuery('meta[name="csrf-token"]').attr('content');
      params = params + '&_method=put';
    } else {
      params['authenticity_token'] = jQuery('meta[name="csrf-token"]').attr('content');
      params['_method'] = 'put';
    }
    jQuery.ajax({
      type: 'POST',
      url: (id ? (options.url + '/' + id + '.json') : options.url + '.json'),
      data: params,
      success: function(result) { 
				self.cache(id, result);
				if (success) success(result);
			},
      complete: complete,
      error: function(response) {
        if (failure) failure(extract_errors(response), response);
      },
      dataType: 'json'
    });
    
  };
  
};
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
  jQuery(Obedience.Router.run);
} else if (typeof(Prototype) != 'undefined') { 
  Event.observe($(window), 'load', Obedience.Router.run);
} else if (typeof(window) != 'undefined') { 
  window.onload = Router.run;
}
