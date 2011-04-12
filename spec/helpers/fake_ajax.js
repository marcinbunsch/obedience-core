var FakeAjax = function() {  
  this.open = function(type, url, async) {
    this.readyState = 4
    var parts = url.split('?')
    var params = parts.length > 1 ? parts[1] : ''
    var key  = type + ' ' + url.split('?')[0]
    this.query = this.parseParams(params)
    
    this.fake = FakeAjax.fakes[key]
    if (!this.fake) {
      this.status = 404
    } else {
      this.responseText = this.fake.response
      this.status       = this.fake.status
    }
  };
  this.send = function(headers, done) {
    if (headers)
      this.data = this.parseParams(headers)    
    FakeAjax.calls.push(this)
  }
  this.parseParams = function(query) {
    var parsed = {}
    var parts = query.split('&')
    var len = parts.length
    for (var index = 0, len = parts.length; index<len; index++) {
      var splitted = parts[index].split('=')
      parsed[splitted[0]] = splitted[1]
    }
    return parsed
  };
  this.getAllResponseHeaders = function() {
    return this.fake.headers
  };
};
// Storage for fakes
FakeAjax.fakes = {}
FakeAjax.calls = []
FakeAjax.calls.last = function() {
  return FakeAjax.calls[FakeAjax.calls.length - 1]
};
FakeAjax.fake = function(url_and_method, response, status, headers) {
  this.fakes[url_and_method] = { response: response, status: status || 200, headers: headers || {} }
};
FakeAjax.factory = function() { return new FakeAjax(); };

// Replace XMLHttpRequest so jQuery picks it up on initialization
window.XMLHttpRequest = FakeAjax;
