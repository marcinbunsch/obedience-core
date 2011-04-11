
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