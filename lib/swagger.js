// Generated by CoffeeScript 1.3.1
(function() {
  var SwaggerApi, SwaggerOperation, SwaggerRequest, SwaggerResource,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SwaggerApi = (function() {

    SwaggerApi.name = 'SwaggerApi';

    SwaggerApi.prototype.discoveryUrl = "http://api.wordnik.com/v4/resources.json";

    SwaggerApi.prototype.debug = false;

    SwaggerApi.prototype.api_key = null;

    SwaggerApi.prototype.basePath = null;

    function SwaggerApi(options) {
      if (options == null) {
        options = {};
      }
      if (options.discoveryUrl != null) {
        this.discoveryUrl = options.discoveryUrl;
      }
      if (options.debug != null) {
        this.debug = options.debug;
      }
      if (options.apiKey != null) {
        this.api_key = options.apiKey;
      }
      if (options.api_key != null) {
        this.api_key = options.api_key;
      }
      if (options.verbose != null) {
        this.verbose = options.verbose;
      }
      if (options.success != null) {
        this.success = options.success;
      }
      if (options.success != null) {
        this.build();
      }
    }

    SwaggerApi.prototype.build = function() {
      var _this = this;
      return jQuery.getJSON(this.discoveryUrl, function(response) {
        var res, resource, _i, _len, _ref;
        _this.basePath = response.basePath;
        if (_this.basePath.match(/^HTTP/i) == null) {
          throw "discoveryUrl basePath must be a URL.";
        }
        _this.basePath = _this.basePath.replace(/\/$/, '');
        _this.resources = {};
        _ref = response.apis;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resource = _ref[_i];
          if (resource.path === "/tracking.{format}" || resource.path === "/partner.{format}") {
            continue;
          }
          res = new SwaggerResource(resource.path, resource.description, _this);
          _this.resources[res.name] = res;
        }
        return _this;
      });
    };

    SwaggerApi.prototype.selfReflect = function() {
      var resource, resource_name, _ref;
      if (this.resources == null) {
        return false;
      }
      _ref = this.resources;
      for (resource_name in _ref) {
        resource = _ref[resource_name];
        if (resource.ready == null) {
          return false;
        }
      }
      this.ready = true;
      if (this.success != null) {
        return this.success();
      }
    };

    SwaggerApi.prototype.help = function() {
      var operation, operation_name, parameter, resource, resource_name, _i, _len, _ref, _ref1, _ref2;
      _ref = this.resources;
      for (resource_name in _ref) {
        resource = _ref[resource_name];
        console.log(resource_name);
        _ref1 = resource.operations;
        for (operation_name in _ref1) {
          operation = _ref1[operation_name];
          console.log("  " + operation.nickname);
          _ref2 = operation.parameters;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            parameter = _ref2[_i];
            console.log("    " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description);
          }
        }
      }
      return this;
    };

    return SwaggerApi;

  })();

  SwaggerResource = (function() {

    SwaggerResource.name = 'SwaggerResource';

    function SwaggerResource(path, description, api) {
      var parts,
        _this = this;
      this.path = path;
      this.description = description;
      this.api = api;
      if (this.path == null) {
        throw "SwaggerResources must have a path.";
      }
      this.operations = {};
      this.url = this.api.basePath + this.path.replace('{format}', 'json');
      parts = this.path.split("/");
      this.name = parts[parts.length - 1].replace('.{format}', '');
      jQuery.getJSON(this.url, function(response) {
        var endpoint, o, op, _i, _j, _len, _len1, _ref, _ref1;
        _this.basePath = response.basePath;
        _this.basePath = _this.basePath.replace(/\/$/, '');
        if (response.apis) {
          _ref = response.apis;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            endpoint = _ref[_i];
            if (endpoint.operations) {
              _ref1 = endpoint.operations;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                o = _ref1[_j];
                op = new SwaggerOperation(o.nickname, endpoint.path, o.httpMethod, o.parameters, o.summary, _this);
                _this.operations[op.nickname] = op;
              }
            }
          }
        }
        _this.api[_this.name] = _this;
        _this.ready = true;
        return _this.api.selfReflect();
      });
    }

    SwaggerResource.prototype.help = function() {
      var operation, operation_name, parameter, _i, _len, _ref, _ref1;
      _ref = this.operations;
      for (operation_name in _ref) {
        operation = _ref[operation_name];
        console.log("  " + operation.nickname);
        _ref1 = operation.parameters;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          parameter = _ref1[_i];
          console.log("    " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description);
        }
      }
      return this;
    };

    return SwaggerResource;

  })();

  SwaggerOperation = (function() {

    SwaggerOperation.name = 'SwaggerOperation';

    function SwaggerOperation(nickname, path, httpMethod, parameters, summary, resource) {
      var _this = this;
      this.nickname = nickname;
      this.path = path;
      this.httpMethod = httpMethod;
      this.parameters = parameters != null ? parameters : [];
      this.summary = summary;
      this.resource = resource;
      this["do"] = __bind(this["do"], this);

      if (this.nickname == null) {
        throw "SwaggerOperations must have a nickname.";
      }
      if (this.path == null) {
        throw "SwaggerOperation " + nickname + " is missing path.";
      }
      if (this.httpMethod == null) {
        throw "SwaggerOperation " + nickname + " is missing httpMethod.";
      }
      this.path = this.path.replace('{format}', 'json');
      this.resource[this.nickname] = function(args, callback, error) {
        return _this["do"](args, callback, error);
      };
    }

    SwaggerOperation.prototype["do"] = function(args, callback, error) {
      var body, headers;
      if (args == null) {
        args = {};
      }
      if ((typeof args) === "function") {
        error = callback;
        callback = args;
        args = {};
      }
      if (error == null) {
        error = function(xhr, textStatus, error) {
          return console.log(xhr, textStatus, error);
        };
      }
      if (callback == null) {
        callback = function(data) {
          return console.log(data);
        };
      }
      if (args.headers != null) {
        headers = args.headers;
        delete args.headers;
      }
      if (args.body != null) {
        body = args.body;
        delete args.body;
      }
      return new SwaggerRequest(this.httpMethod, this.urlify(args), headers, body, callback, error, this);
    };

    SwaggerOperation.prototype.urlify = function(args) {
      var param, url, _i, _len, _ref;
      url = this.resource.basePath + this.path;
      url = url.replace('{format}', 'json');
      _ref = this.parameters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        if (param.paramType === 'path') {
          if (args[param.name]) {
            url = url.replace("{" + param.name + "}", args[param.name]);
            delete args[param.name];
          } else {
            throw "" + param.name + " is a required path param.";
          }
        }
      }
      if (this.resource.api.api_key != null) {
        args['api_key'] = this.resource.api.api_key;
      }
      url += "?" + jQuery.param(args);
      return url;
    };

    SwaggerOperation.prototype.help = function() {
      var parameter, _i, _len, _ref;
      _ref = this.parameters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        parameter = _ref[_i];
        console.log("    " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description);
      }
      return this;
    };

    return SwaggerOperation;

  })();

  SwaggerRequest = (function() {

    SwaggerRequest.name = 'SwaggerRequest';

    function SwaggerRequest(type, url, headers, body, successCallback, errorCallback, operation) {
      var obj,
        _this = this;
      this.type = type;
      this.url = url;
      this.headers = headers;
      this.body = body;
      this.successCallback = successCallback;
      this.errorCallback = errorCallback;
      this.operation = operation;
      if (this.type == null) {
        throw "SwaggerRequest type is required (get/post/put/delete).";
      }
      if (this.url == null) {
        throw "SwaggerRequest url is required.";
      }
      if (this.successCallback == null) {
        throw "SwaggerRequest successCallback is required.";
      }
      if (this.errorCallback == null) {
        throw "SwaggerRequest error callback is required.";
      }
      if (this.operation == null) {
        throw "SwaggerRequest operation is required.";
      }
      if (this.operation.resource.api.verbose) {
        console.log(this.asCurl());
      }
      this.headers || (this.headers = {});
      if (this.operation.resource.api.api_key != null) {
        this.headers.api_key = this.operation.resource.api.api_key;
      }
      if (this.headers.mock == null) {
        obj = {
          type: this.type,
          url: this.url,
          data: JSON.stringify(this.body),
          dataType: 'json',
          error: function(xhr, textStatus, error) {
            return _this.errorCallback(xhr, textStatus, error);
          },
          success: function(data) {
            return _this.successCallback(data);
          }
        };
        if (obj.type.toLowerCase() === "post" || obj.type.toLowerCase() === "put") {
          obj.contentType = "application/json";
        }
        jQuery.ajax(obj);
      }
    }

    SwaggerRequest.prototype.asCurl = function() {
      var header_args, k, v;
      header_args = (function() {
        var _ref, _results;
        _ref = this.headers;
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          _results.push("--header \"" + k + ": " + v + "\"");
        }
        return _results;
      }).call(this);
      return "curl " + (header_args.join(" ")) + " " + this.url;
    };

    return SwaggerRequest;

  })();

  window.SwaggerApi = SwaggerApi;

  window.SwaggerResource = SwaggerResource;

  window.SwaggerOperation = SwaggerOperation;

  window.SwaggerRequest = SwaggerRequest;

}).call(this);
