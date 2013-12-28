(function(){

var JsWorker = window.JsWorker = {};

function EMPTY_FUNCTION(){

}

/**
 * Get an XMLHttpRequest object
 * @return {Object} XMLHttpRequest object
 */
function getXhrObject(){
    var xhr = null;
    if (window.XMLHttpRequest) 
        try {
            xhr = new XMLHttpRequest();
        } 
        catch (error) {
        }
    else {
        if (window.ActiveXObject) {
			var names = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < names.length; i++) {
				try {
					xhr = new ActiveXObject(names[i]);
					break;
				} 
				catch (error) {
				}
			}
        }
    }
    return xhr;
}

/**
 * Fetch the text content of script url
 * @param {String} jsUrl
 * @return {String} script text
 */
function fetchScriptText(jsUrl) {
	var xhr = getXhrObject(), text;
	if (xhr) {
		xhr.open("GET", jsUrl, false);
		xhr.send(null);
		return xhr.responseText;
	}
}

function isFunction(anything){
    return anything && (typeof anything == "function" || anything instanceof Function);
}

function isString(anything){
    return anything && (typeof anything == "string" || anything instanceof String);
}

function isObject(anything) {
	return anything !== null && typeof anything == "object";
}

function toArray(obj, offset, startWith){
    var arr = startWith || [];
    for (var i = offset || 0; i < obj.length; i++) {
        arr.push(obj[i]);
    }
    return arr;
}

function isArray(anything) {
		Object.prototype.toString.apply(anything) == "[object Array]";
	}
	
	function escapeString(str) {
		return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
		  replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
		  replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
	}
	
	function endsWith(string, pattern) {
		var pos = string.length - pattern.length;
    	return pos >= 0 && string.lastIndexOf(pattern) === pos;
	}

function hitch(scope, method){
    var preArgs = [];
    if (arguments.length > 2) {
        preArgs = toArray(arguments, 2);
    }
    if (!method) {
        method = scope;
        scope = window;
    }
    var methodName = isString(method);
    var func = methodName ? (scope || window)[methodName] : method;
    return function(){
        var args = toArray(arguments);
        return func && func.apply(scope || this, preArgs.concat(args));
    }
}

function toJson(json) {
		if (json === undefined) {
			return "undefined";
		}
		var type = typeof json;
		if (type == "number" || type == "boolean") {
			return json + "";
		}
		if (json === null) {
			return "null";
		}
		if (isString(json)) {
			return escapeString(json);
		}
		var recurse = arguments.callee;
		if (isArray(json)) {
			var result = [];
			for (var i = 0, n = json.length; i < n; i++) {
				var val = recurse(json[i]);
		 	    if(typeof val != "string"){
				  val = "undefined";
			    }
			    result.push("\n" + val);
			}
			return "\n" + "[" + result.join(",") + "]";
		}
		if (type == "function") {
			return null;
		}
		var output = [], key;
		for (key in json) {
			var keyStr, val;
		    if(typeof key == "number"){
			  keyStr = '"' + key + '"';
		    }else if(typeof key == "string"){
			  keyStr = escapeString(key);
		    }else{
			  continue;
		    }
		    val = recurse(json[key]);
			if(typeof val != "string"){
			  continue;
		    }
			output.push("\n" + keyStr + ":" + val);
		}
		return "{" + output.join(",") + "\n" + "}"; 
	}
// Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//  3. Neither the name of Google Inc. nor the names of its contributors may be
//     used to endorse or promote products derived from this software without
//     specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Sets up google.gears.*, which is *the only* supported way to access Gears.
//
// Circumvent this file at your own risk!
//
// In the future, Gears may automatically define google.gears.* without this
// file. Gears may use these objects to transparently fix bugs and compatibility
// issues. Applications that use the code below will continue to work seamlessly
// when that happens.

(function() {
  // We are already defined. Hooray!
  if (window.google && google.gears) {
    return;
  }

  var factory = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    factory = new GearsFactory();
  } else {
    // IE
    try {
      factory = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on IE Mobile on
      // WinCE.
      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
        factory.privateSetGlobalObject(this);
      }
    } catch (e) {
      // Safari
      if ((typeof navigator.mimeTypes != 'undefined')
           && navigator.mimeTypes["application/x-googlegears"]) {
        factory = document.createElement("object");
        factory.style.display = "none";
        factory.width = 0;
        factory.height = 0;
        factory.type = "application/x-googlegears";
        document.documentElement.appendChild(factory);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!factory) {
    return;
  }

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google) {
    google = {};
  }

  if (!google.gears) {
    google.gears = {factory: factory};
  }
})();
(function(){

    function Worker(workerPool){
        this.workerPool = workerPool;
    }
    
    Worker.prototype = {
        postMessage: function(message){
            this.workerPool.sendMessage(message, this.childWorkerId);
        },
        
        terminate: function(){
        	
        },
        
        setChildWorkerId: function(childWorkerId){
            this.childWorkerId = childWorkerId;
        },
        
        getName: function(){
            return "GearsWorker";
        }
    };
    
    function getPostMessageFunctionText(workerId){
        return [";var _senderId = 1;function postMessage(message) {", "  google.gears.workerPool.sendMessage(message, _senderId);", "};"].join("\n");
    }
    
    function getOnMessageFunctionText(){
        return [";google.gears.workerPool.onmessage = function(messageText, senderId, messageObject) {", " _senderId = messageObject.sender;  onmessage && onmessage({'data' : messageObject.body});", "};"].join("\n");
    }
    
    function getOnErrorFunctionText(){
        return [";google.gears.workerPool.onerror = function(error) {", "  error.name = '__WorkerError__';", "  postMessage(error);", "};"].join("\n");
    }
    
    JsWorker.GearsWorker = {
        _createWrappedWorker: function(workerPool, onmessage, onerror){
		    var worker = new Worker(workerPool);
            workerPool.onmessage = function(messageText, senderId, messageObject){
				if (messageObject.body.name == "__WorkerError__") {
                    if (isFunction(onerror)) {
                        onerror.apply(worker, [messageObject.body]);
                    }
                }
                else {
                    if (isFunction(onmessage)) {
                        onmessage.apply(worker, [{
                            "data": messageObject.body
                        }]);
                    }
                }
            }
			return worker;
        },
        
        createWorkerFromUrl: function(jsUrl, onmessage, onerror){
        	if (!jsUrl) {
				throw new Error("No JavaScript URL provided!");
			}
			var jsText = fetchScriptText(jsUrl);
			var workerPool = google.gears.factory.create("beta.workerpool");
			var text = getPostMessageFunctionText() + jsText + getOnMessageFunctionText() + getOnErrorFunctionText();
			var worker = JsWorker.GearsWorker._createWrappedWorker(workerPool, onmessage, onerror);
			var childWorkerId = workerPool.createWorker(text);
            worker.setChildWorkerId(childWorkerId);
            return worker;
        }
    };
})();
(function(){
	var WORKER_NAME = "WebWorker";
	var COMMENT_APPENDIX = "/*---comment added by JsWorker---*/";
	
	function WrappedWorker(nativeWorker, onmessage, onerror) {
		this._nativeWorker = nativeWorker;
		this._nativeWorker.onmessage = function(message) {
			if (isFunction(onmessage)) {
				onmessage && onmessage.apply(this._nativeWorker, [message]);
			}
		},
		
		this._nativeWorker.onerror = onerror;
	}
	
	WrappedWorker.prototype = {
		postMessage : function(message) {
			return this._nativeWorker.postMessage(message);
		},
		
		terminate : function() {
			return this._nativeWorker.terminate();
		},
		
		getName : function() {
			return WORKER_NAME;
		}
	};
	
    JsWorker.WebWorker = {
        createWorkerFromUrl: function(jsUrl, onmessage, onerror){
            var nativeWorker = new window.Worker(jsUrl);
            return new WrappedWorker(nativeWorker, onmessage, onerror);
        }
    }; 
})();
(function(){
	var jsTextTemplateBefore = [
	  "  var __worker__ = this;",
	  "  function postMessage(message) {",
	  "    __worker__._receiveMessage(message);",
	  "  };",
	  "  __worker__._onmessageHandler = function() {",
	  "    var message;",
	  "    while (message = __worker__._messageQueue.shift()) {",
	  "      try {",
	  "        onmessage && onmessage.call(null, {'data' : message});",
	  "      }catch(e){",
	  "         __worker__._lastError = e;",
	  "      }",
	  "    }",
	  "    __worker__._handleError();",
	  "    if (!__worker__._aboutToTerminate) {",
	  "      __worker__._timeoutId = window.setTimeout(arguments.callee, 1000);",
	  "    }",
	  "  };"
	].join("");
	
	function Worker(jsText, onmessage, onerror) {
		this._messageQueue = [];
		this._onmessage = onmessage;
		this._onerror = onerror;
		this._lastError = null;
		
		var text = jsTextTemplateBefore + jsText;
		var runner = new Function(text);
		runner.apply(this);
		
		this._aboutToTerminate = false;
		this._timeoutId = window.setTimeout(this._onmessageHandler, 0);
	}
	
	Worker.prototype = {
		postMessage : function(message) {
			message && this._messageQueue.push(message);
		},
		
		terminate : function() {
			//process all messages before termination
			this._aboutToTerminate = true;
			this._onmessageHandler();
			window.clearTimeout(this._timeoutId);
		},
		
		_receiveMessage : function(message) {
			this._onmessage.apply(this, [{"data" : message}]);
		},
		
		_handleError : function() {
			this._lastError && this._onerror && this._onerror.apply(this, [this._lastError]);
		},
		
		getName : function() {
			return "TimeoutWorker";
		}
	};
	
    JsWorker.TimeoutWorker = {
        createWorkerFromUrl: function(jsUrl, onmessage, onerror){
			var jsText = fetchScriptText(jsUrl);
			return new Worker(jsText, onmessage, onerror);
        }
    };
	
})();
(function(){
    function hasGears(){
        return window.google && google.gears && google.gears.factory;
    }
    
    function hasWebWorker(){
        return typeof window.Worker != "undefined";
    }
    
    var concreteWorker = hasWebWorker() ? JsWorker.WebWorker : (hasGears() ? JsWorker.GearsWorker : JsWorker.TimeoutWorker);
    
    JsWorker.createWorkerFromUrl = function(){
        return concreteWorker.createWorkerFromUrl.apply(this, arguments);
    };
    
})();
})();
