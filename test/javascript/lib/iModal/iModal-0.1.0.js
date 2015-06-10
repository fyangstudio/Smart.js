/**
 * iModal JavaScript Component v0.1.0
 *
 * Author YangFan(18767120422@163.com)
 *
 * Date: 2015-05-20
 */
//<![CDATA[
(function (_doc, _win, undefined) {

    // iModal object
    var _version = "0.1.0";
    var $m = {"iModal": _version};
    // Empty function
    var _noop = function () {
    };
    // Define.samd config
    var _config = {sites: {}, paths: {}, charset: 'utf-8'};

    /*!
     * iModal Tools Component
     *
     * #include
     * Primary javascript API syntax fix
     * Base function
     *
     */
    /* Browser information
     ---------------------------------------------------------------------- */
    var _sys = $m.$sys = {};
    var _ua = $m.$ua = navigator.userAgent.toLowerCase();
    // Parse userAgent
    if (_ua.indexOf('chrome') > 0) _sys.chrome = _ua.match(/chrome\/([\d.]+)/)[1];
    else if (window.ActiveXObject) _sys.ie = _ua.match(/msie ([\d.]+)/)[1];
    else if (document.getBoxObjectFor) _sys.firefox = _ua.match(/firefox\/([\d.]+)/)[1];
    else if (window.openDatabase) _sys.safari = _ua.match(/version\/([\d.]+)/)[1];
    else if (window.opera) _sys.opera = _ua.match(/opera.([\d.]+)/)[1];

    /* Event
     ---------------------------------------------------------------------- */

    // Event listener
    if (_doc.addEventListener) {
        $m.$addEvent = function (node, event, fn) {
            node.addEventListener(event, fn, false);
        };
        $m.$removeEvent = function (node, event, fn) {
            node.removeEventListener(event, fn, false)
        };
    } else {
        $m.$addEvent = function (node, event, fn) {
            node.attachEvent('on' + event, fn);
        };
        $m.$removeEvent = function (node, event, fn) {
            node.detachEvent('on' + event, fn);
        };
    }

    // Cancels the event if it is cancelable, without stopping further propagation of the event.
    $m.$stop = function (event) {
        if (event == undefined) return;
        if (event.preventDefault) event.preventDefault();
        else event.returnValue = false;
    };

    // Get event target.
    $m.$getTarget = function (event) {
        return !event ? null : (event.target || event.srcElement);
    };

    /* Stack
     ---------------------------------------------------------------------- */
    $m.$stack = function () {
        this.top = 0;
        this.dataStore = [];
    };
    $m.$stack.prototype = {
        push: function (element) {
            this.dataStore[this.top++] = element;
        },
        peek: function () {
            return this.dataStore[this.top - 1];
        },
        pop: function () {
            return this.dataStore[this.top == 0 ? 0 : --this.top];
        },
        clear: function () {
            this.top = 0;
            this.dataStore = [];
        },
        length: function () {
            return this.top;
        }
    };

    /* Queue
     ---------------------------------------------------------------------- */
    $m.$queue = function () {
        this.dataStore = [];
    }
    $m.$queue.prototype = {
        enqueue: function (element) {
            this.dataStore.push(element);
        },
        dequeue: function () {
            return this.dataStore.shift();
        },
        front: function () {
            return this.dataStore[0]
        },
        back: function () {
            return this.dataStore[this.dataStore.length - 1];
        },
        length: function () {
            return this.dataStore.length;
        },
        empty: function () {
            return this.dataStore.length == 0 ? true : false;
        }
    };

    /* Type of
     ---------------------------------------------------------------------- */
    function _isType(type) {
        return function (obj) {
            return {}.toString.call(obj) == '[object ' + type + ']';
        }
    }

    // The $m.$isXXX() method returns true if an object is an XXX, false if it is not.
    $m.$isArray = Array.isArray || _isType('Array');
    $m.$isObject = _isType('Object');
    $m.$isString = _isType('String');
    $m.$isFunction = _isType('Function');

    /* Syntax fix
     ---------------------------------------------------------------------- */

    // The trim() method removes whitespace from both ends of a string.
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    // The bind() method creates a new function that,
    // when called, has its this keyword set to the provided value,
    // with a given sequence of arguments preceding any provided when the new function is called.
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (!$m.$isFunction(this)) return;
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fBound = function () {
                    return fToBind.apply(this instanceof _noop && oThis ? this : oThis || window,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            _noop.prototype = this.prototype;
            fBound.prototype = new _noop();
            return fBound;
        };
    }

    // The forEach() method executes a provided function once per array element.
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(callback, thisArg) {
            var T, k = 0;
            if (this == null || !$m.$isFunction(callback)) return;

            var O = Object(this);
            var len = O.length >>> 0;
            if (thisArg) T = thisArg;

            while (k < len) {
                var kValue;
                if (Object.prototype.hasOwnProperty.call(O, k)) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }

    // The Object.keys() method returns an array of a given object's own enumerable properties.
    if (!Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && !$m.$isFunction(obj) || obj === null) return;

                var result = [];
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }
                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            }
        })()
    }

    if (!_win.JSON) {
        var _json = {};
        // The JSON object contains methods for parsing JavaScript Object Notation (JSON) and converting values to JSON.
        // It can't be called or constructed, and aside from its two method properties it has no interesting functionality of its own.
        _json.parse = function (json) {
            if (json === null) return json;
            if ($m.$isString(json)) {
                json = json.trim();
                if (json) return ( new Function('return ' + json) )();
            }
            throw new Error('Invalid JSON: ' + json);
        };
        // The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified,
        // or optionally including only the specified properties if a replacer array is specified.
        _json.stringify = function (obj) {
            if (typeof (obj) != "object" || obj === null) {
                if ($m.$isString(obj)) obj = '"' + obj + '"';
                return String(obj);
            } else {
                var json = [], arr = $m.$isArray(obj), stringify = arguments.callee;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var v = obj[key];
                        if ($m.$isString(v)) v = '"' + v + '"';
                        else if (typeof (v) == "object" && v !== null) v = stringify(v);
                        json.push((arr ? "" : '"' + key + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };
        _win.JSON = _json;
    }

    // Low version of the browser compatibility without console object.
    if (!_win.console) {
        _win.console = {
            log: _noop,
            warn: _noop,
            error: _noop
        };
    }

    /* Custom event function
     ---------------------------------------------------------------------- */
    // Handles custom event
    $m.$on = function (event, fn) {
        if (typeof event === "object") {
            var _on = arguments.callee;
            for (var i in event) {
                _on(i, event[i]);
            }
        } else {
            var _handles = this._handles || (this._handles = {}),
                _calls = _handles[event] || (_handles[event] = []);
            _calls.push(fn);
        }
        return this;
    };

    // Relieve custom event
    $m.$off = function (event, fn) {
        if (!this._handles) return;
        if (!event) this._handles = {};
        var _handles = this._handles, _calls;

        if (_calls = _handles[event]) {
            if (!fn) {
                _handles[event] = [];
                return this;
            }
            for (var i = 0, l = _calls.length; i < l; i++) {
                if (fn === _calls[i]) {
                    _calls.splice(i, 1);
                    return this;
                }
            }
        }
        return this;
    };

    /* Parse
     ---------------------------------------------------------------------- */
    // The $m.$parseHTML() method can change a string of html to a html node.
    $m.$parseHTML = function (txt) {
        if (!txt) return;
        var _reg = /<(.*?)(?=\s|>)/i, // first tag name
            _parentNodeMap = {li: 'ul', tr: 'tbody', td: 'tr', th: 'tr', option: 'select'};
        var _tag;
        if (_reg.test(txt)) _tag = _parentNodeMap[(RegExp.$1 || '').toLowerCase()] || '';
        var _cnt = _doc.createElement(_tag || 'div');
        _cnt.innerHTML = txt;
        var _list = _cnt.childNodes;
        return _list.length > 1 ? _cnt : _list[0];
    };

    // The $m.$parseURI() method can change a samd uri string to a absolute path string.
    $m.$parseURI = (function () {
        var _addA = false,                                  // mark _anchor append to document
            _reg1 = /([^:])\/+/g,                           // get request protocol
            _reg2 = /[^\/]*$/,                              // get file name
            _reg3 = /\.js$/i,                               // get javascript file
            _anchor = _doc.createElement('a');              // _anchor which can get browser machined path

        // The _absolute() method can tell if uri is a absolute path.
        function _absolute(uri) {
            return uri.indexOf('://') > 0;
        }

        // The _root() method can return relative path's category.
        function _root(_uri) {
            return _uri.replace(_reg2, '');
        }

        // Main function
        function _parse(uri, type) {
            // append _anchor to document
            if (!_addA) {
                _addA = true;
                _anchor.id = 'iModal_anchor';
                _anchor.style.display = 'none';
                _doc.body.appendChild(_anchor);
            }
            // parse _config path
            var _arr = uri.split('!'),
                _site = '',
                _path = uri,
                _type = (type || _reg3.test(uri)) ? '' : '.js';
            if (_arr.length > 1) {
                if (!_arr[1]) {
                    // parse _config paths path
                    _type = '';
                    _path = $m.$parseURI(_config.paths[_arr.shift()]);
                } else {
                    // parse _config sites path
                    _site = _config.sites[_arr.shift()];
                    _path = _arr.join('!');
                }
            }
            // get path
            uri = (_site + _path + _type).replace(_reg1, '$1/');
            _anchor.href = uri;
            uri = _anchor.href;
            return _absolute(uri) && uri.indexOf('./') < 0 ? uri : _anchor.getAttribute('href', 4); // for ie6/7
        }

        // Return $m.$parseURI() method.
        return function (uri, basePath, type) {
            if (!uri) return '';
            if ($m.$isArray(uri)) {
                var _list = [];
                uri.forEach(function (value) {
                    _list.push($m.$parseURI(value, basePath, type));
                });
                return _list;
            }
            // parse absolute path
            if (_absolute(uri)) return _parse(uri, type);
            // parse relative path
            if (basePath && uri.indexOf('.') == 0) uri = _root(basePath) + uri;
            return _parse(uri, type);
        };
    })();

    /* Transform
     ---------------------------------------------------------------------- */
    // The $m.$forIn() statement iterates over the enumerable properties of an object, in arbitrary order.
    $m.$forIn = function (obj, callback, thisArg) {
        if (!obj || !callback) return null;
        var _keys = Object.keys(obj);
        for (var i = 0, l = _keys.length, _key, _ret; i < l; i++) {
            _key = _keys[i];
            _ret = callback.call(
                thisArg || null,
                obj[_key], _key, obj
            );
            if (!!_ret) return _key;
        }
        return null;
    };

    // String to object
    $m.$s2o = function (string, _split) {
        var _obj = {};
        var _arr = (string || '').split(_split);
        _arr.forEach(function (_name) {
            var _brr = _name.split('=');
            if (!_brr || !_brr.length) return;
            var _key = _brr.shift();
            if (!_key) return;
            _obj[decodeURIComponent(_key)] = decodeURIComponent(_brr.join('='));
        });
        return _obj;
    };

    // Object to string
    $m.$o2s = function (_object, _split, _encode) {
        if (typeof (_object) != "object" || _object === null) return JSON.stringify(_object);

        var _arr = [];
        this.$forIn(_object, function (_value, _key) {
            if (this.$isFunction(_value)) return;
            _value = JSON.stringify(_value);

            if (!!_encode) _value = encodeURIComponent(_value);
            _arr.push(encodeURIComponent(_key) + '=' + _value);
        }.bind(this));
        return _arr.join(_split || ',');
    };

    /* Object operate
     ---------------------------------------------------------------------- */
    // Clone
    $m.$clone = function (target, deep) {
        var cloned, _deep = !!deep, cloneObject = arguments.callee.bind(this);
        if (!!target.nodeType) return target.cloneNode(_deep);
        if (target === null || target === undefined || typeof(target) !== 'object') return target;

        if (this.$isArray(target)) {
            if (!_deep) return target;
            cloned = [];
            for (var i in target) if (target.hasOwnProperty(i)) cloned.push(cloneObject(target[i], _deep));
            return cloned;
        }
        cloned = {};
        for (var i in target) if (target.hasOwnProperty(i)) cloned[i] = _deep ? cloneObject(target[i], true) : target[i];
        return cloned;
    };

    // Comparison of same objects
    $m.$same = function (target1, target2, deep) {
        var _deep = !!deep, check = arguments.callee;
        if (target1 === target2) return true;
        if (target1.constructor !== target2.constructor) return false;

        // If they are not strictly equal, they both need to be Objects
        if (!( target1 instanceof Object ) || !( target2 instanceof Object )) return false;
        for (var p in target1) {
            if (target1.hasOwnProperty(p)) {
                if (!target2.hasOwnProperty(p)) return false;
                if (target1[p] === target2[p]) continue;

                // Numbers, Strings, Functions, Booleans must be strictly equal
                if (typeof( target1[p] ) !== 'object') return false;

                // Objects and Arrays must be tested recursively
                if (_deep && !check(target1[p], target2[p])) {
                    return false;
                }
            }
        }
        for (p in target2) {
            // allows target1["p"] to be set to undefined
            if (target2.hasOwnProperty(p) && !target1.hasOwnProperty(p)) return false;
        }
        return true;
    };

    /* hash
     ---------------------------------------------------------------------- */
    // Window hash
    var _hash = window.location.hash;

    // The $m.$hash()method property returns a DOMString not containing a '#' followed by the fragment identifier of the URL.
    // The hash is not percent encoded.
    $m.$hash = function (value) {
        if (value != undefined) window.location.hash = value.replace(/#/g, '');
        return window.location.hash.replace('#', '');
    };

    // Watch location.hash
    $m.$watchHash = function (callback) {
        if (this.$isFunction(callback)) {
            // Browser support hash change event
            if (('onhashchange' in window) && ((typeof _doc.documentMode === 'undefined') || _doc.documentMode == 8)) {
                this.$addEvent(window, 'hashchange', function () {
                    _hash = this.$hash();
                    callback(_hash);
                }.bind(this))
            } else {
                // Check the location.hash at a regular interval
                var handles = this._hashFns || (this._hashFns = []);
                handles.push(callback);
                setInterval(function () {
                    var _h = window.location.hash.replace('#', '');
                    if (_h != _hash) {
                        _hash = this.$hash();
                        handles.forEach(function (_fn) {
                            _fn.call(this, _h);
                        })
                    }
                }.bind(this), 100);
            }
        }
    };

    /* request
     ---------------------------------------------------------------------- */
    var _ajaxHandler = function () {
    };
    _ajaxHandler.prototype = {
        _request: function (config) {
            if (!!config.url) {
                var
                    _method = (config.method || 'GET').toLowerCase(),           // method
                    _url = config.url,                                          // url
                    _data = config.data || null,                                // send data
                    _dataType = (config.dataType || 'JSON').toLowerCase(),      // request data type
                    _success = config.success || _noop,                         // request success callback
                    _error = config.error || _noop,                             // request fail callback
                    _xhr = this._createXhrObject();                             // XMLHttpRequest
                if (_data != null && _method == 'get') _url += ('?' + $m.$o2s(_data));
                // On xhr ready state change
                _xhr.onreadystatechange = function () {
                    if (_xhr.readyState !== 4) return;
                    var _responseData = _dataType == 'json' ? JSON.parse(_xhr.responseText) : _xhr.responseText;
                    (_xhr.status === 200) ? _success(_responseData) : _error(_xhr.status);
                };
                _xhr.open(_method, _url, true);
                _xhr.send(_data);
            }
        },
        _createXhrObject: function () {
            // Create Xhr Object
            var _methods = [
                function () {
                    return new XMLHttpRequest();
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            ];
            for (var i = 0, l = _methods.length; i < l; i++) {
                try {
                    _methods[i]();
                } catch (e) {
                    continue;
                }
                this._createXhrObject = _methods[i];
                return _methods[i]();
            }
            throw new Error('Could not create an XHR object');
        }
    };

    // The $m.$ajax() method perform an asynchronous HTTP request.
    $m.$ajax = function (config) {
        if (this.$isObject(config)) return new _ajaxHandler()._request(config);
        else throw new Error('Ajax parameter error');
    };

    /* Encode & Decode
     ---------------------------------------------------------------------- */
    var _encode = function (map, content) {
        content = '' + content;
        if (!map || !content) return content || '';
        return content.replace(map.r, function ($1) {
            var _result = map[!map.i ? $1.toLowerCase() : $1];
            return _result != null ? _result : $1;
        });
    };
    // The $m.$escape() method computes a new string,
    // in which certain characters have been replaced by a hexadecimal escape sequence.
    // Use entity transform or encodeURIComponent instead.
    $m.$escape = function (content, encodeURL) {
        var _map = {
            r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
            '<': '&lt;', '>': '&gt;', '&': '&amp;', ' ': '&nbsp;',
            '"': '&quot;', "'": '&#39;', '\n': '<br/>', '\r': ''
        };
        var ret = _encode(_map, content)
        return encodeURL != undefined ? encodeURIComponent(ret) : ret;
    };

    // The $m.$unescape() method computes a new string,
    // in which hexadecimal escape sequences are replaced with the character that it represents.
    // Use entity transform or decodeURIComponent instead.
    $m.$unescape = function (content, decodeURL) {
        var _map = {
            r: /\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,
            '&lt;': '<', '&gt;': '>', '&amp;': '&', '&nbsp;': ' ',
            '&#39;': "'", '&quot;': '"', '<br/>': '\n'
        };
        var ret = _encode(_map, content);
        return decodeURL != undefined ? decodeURIComponent(ret) : ret;
    };

    /* Selector
     ---------------------------------------------------------------------- */
    // Get the whole matched element
    $m.$get = function (query, context) {

        context = context || _doc;
        // Browser querySelector
        if (context.querySelectorAll) return context.querySelectorAll(query);
        // Interpret query
        else return _interpret(query, context);
    };

    function _interpret(query, context) {
        var parts = query.replace(/\s+/, ' ').split(' ');
        var part = parts.pop();
        var selector = _selectorFactory.create(part);
        var ret = selector.find(context);

        return (parts[0] && ret[0]) ? _domFilter(parts, ret) : ret;
    }

    // Dom id selector
    function _IdSelector(id) {
        this.id = id.substring(1);
    }

    _IdSelector.test = function (selector) {
        var regex = /^#([\w\-_]+)/;
        return regex.test(selector);
    };

    _IdSelector.prototype = {
        find: function (context) {
            var ret = [];
            ret.push(context.getElementById(this.id));
            return ret;
        },
        match: function (element) {
            return element.id == this.id;
        }
    };

    // Dom tagName selector
    function _TagSelector(tagName) {
        this.tagName = tagName.toUpperCase();
    }

    _TagSelector.test = function (selector) {
        var regex = /^([\w\*\-_]+)/;
        return regex.test(selector);
    };

    _TagSelector.prototype = {
        find: function (context) {
            return context.getElementsByTagName(this.tagName);
        },
        match: function (element) {
            return this.tagName == element.tagName.toUpperCase() || this.tagName === '*';
        }
    };

    // Dom className selector
    function _ClassSelector(className) {
        var splits = className.split('.');

        this.tagName = splits[0] || undefined;
        this.className = splits[1];
    }

    _ClassSelector.test = function (selector) {
        var regex = /^([\w\-_]*)\.([\w\-_]+)/;
        return regex.test(selector);
    };

    _ClassSelector.prototype = {

        find: function (context) {
            var elements;
            var ret = [];
            var tagName = this.tagName;
            var className = this.className;
            var selector = new _TagSelector((tagName || '*'));

            if (context.getElementsByClassName) {
                elements = context.getElementsByClassName(className);
                if (!tagName) return elements;
                for (var i = 0, n = elements.length; i < n; i++) {
                    if (selector.match(elements[i])) ret.push(elements[i]);
                }
            } else {
                elements = selector.find(context);
                for (var i = 0, n = elements.length; i < n; i++) {
                    if (this.match(elements[i])) ret.push(elements[i]);
                }
            }
            return ret;
        },

        match: function (element) {
            var className = this.className;
            var regex = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return regex.test(element.className);
        }
    };

    // If result has parent node, filter result
    function _domFilter(parts, nodeList) {
        var part = parts.pop();
        var selector = _selectorFactory.create(part);
        var ret = [];
        var parent;

        for (var i = 0, n = nodeList.length; i < n; i++) {
            parent = nodeList[i].parentNode;
            while (parent && parent !== _doc) {
                if (selector.match(parent)) {
                    ret.push(nodeList[i]);
                    break;
                }
                parent = parent.parentNode;
            }
        }
        return (parts[0] && ret[0]) ? _domFilter(parts, ret) : ret;
    }

    // Create dom selector
    var _selectorFactory = {
        create: function (query) {
            if (_IdSelector.test(query)) return new _IdSelector(query);
            else if (_ClassSelector.test(query)) return new _ClassSelector(query);
            else return new _TagSelector(query);
        }
    };

    // Class state
    var _initClass = false;
    // Base class and do nothing
    var Class = function () {
    };

    /* Extend
     ---------------------------------------------------------------------- */
    Class.$extend = function (prop) {
        if (!$m.$isObject(prop)) return;

        var _super = this.prototype;

        // Class state change
        _initClass = true;
        var prototype = new this();
        _initClass = false;

        // Copy the properties over onto the new prototype
        $m.$forIn(prop, function (value, name) {
            if (name != "$super") {
                prototype[name] = (function (name, fn) {
                    if ($m.$isFunction(prop[name])) {
                        return function () {
                            var _superFn = _noop;
                            if (!!_super[name] && $m.$isFunction(_super[name])) _superFn = _super[name];

                            // Add a new $super() method that is the same method on the super-class
                            prototype.$super = _superFn;
                            return fn.apply(prototype, arguments);
                        };
                    }
                    return prop[name];
                })(name, prop[name])
            }
        });

        // The dummy class constructor
        function $mClass() {
            var _fn = this.$init;
            if (!_initClass && $m.$isFunction(_fn)) _fn.apply(this, arguments);
        }

        // Copy the static method over onto the new prototype
        $m.$forIn(this, function (value, key) {
            if (key != "$extend") $mClass[key] = value;
        });

        $mClass.prototype = prototype;
        $mClass.prototype.constructor = $mClass;
        $mClass.$extend = Class.$extend;
        return $mClass;
    };

    // iModal base module
    $m.$module = Class;

    /*!
     * iModal Templates Component
     *
     * #include
     * Living dom
     *
     */
    $m.$tpl = Class.$extend({
        $init: function (options) {

        }
    });

    /*!
     * iModal Module Component
     *
     * #include
     * Define (SAMD)
     *
     */
    /* Define
     ---------------------------------------------------------------------- */
    var
    // state cache   0-loading  1-waiting  2-defined
        _sCache = {},

    // result cache
        _rCache = {},

    // item ex:{n:'filename',d:[/* dependency list */],f:function}
        _iList = [],

    // for define stack
        _dStack = new $m.$stack();

    $m.$define = (function () {
        // The _runningScript() method can find running script. (for IE)
        var _runningScript = function () {
            var _list = document.getElementsByTagName('script');
            for (var i = _list.length - 1, _script; i >= 0; i--) {
                _script = _list[i];
                if (_script.readyState == 'interactive') return _script;
            }
        };
        return function (uri, deps, callback) {
            var _args = [].slice.call(arguments, 0), _script = _runningScript();
            // for ie check running script
            if (!!_script) {
                var _src = _script.src;
                if (!!_src) _args.unshift($m.$parseURI(_src));
                return _define.apply(_win, _args);
            }
            _dStack.push(_args);
            _scriptAllListener();
        }
    })();

    // The define.$config() method config preferences that define uses.
    $m.$define.$config = function (config) {
        if (!$m.$isObject(config)) return;
        $m.$forIn(config, function (value, key) {
            if (key == 'sites' || key == 'paths') {
                if ($m.$isObject(value)) _config[key] = value;
            } else {
                _config[key] = value;
            }
        })
    };

    // Declare define mode - samd.
    $m.$define.samd = 'Selective Asynchronous Module Definition';

    // Define and iModal init function
    function _init() {
        var _list = _doc.getElementsByTagName('script');

        for (var i = _list.length - 1, script, uri; i >= 0; i--) {
            script = _list[i];
            uri = script.src;
            script.iModal = !0;

            if (!/iModal/.test(uri)) _jsLoaded(script);
        }
        // Return iModal
        if (!_win.define) _win.define = $m.$define;
        _win.$M = _win.$m = $m;
    }

    // The _parsePlugin() method can determine whether a file is meet selective options.
    var _parsePlugin = (function () {
        // map of sustaining file type
        var _fMap = {
            $text: function (url) {
                _loadText(url);
            },
            $json: function (url) {
                // todo
            }
        };
        // parse browser version info
        var _parseVersion = function (exp, sys) {
            exp = (exp || '').replace(/\s/g, '').replace(sys, 'PT');
            var _arr = exp.split('PT'),
                _reg = /([<>=]=?)/,
                _left = "'" + _arr[0].replace(_reg, "'$1'") + "[VERSION]'",
                _right = "'[VERSION]" + _arr[1].replace(_reg, "'$1'") + "'";
            return (function () {
                var _res = ['true'], _ver = parseInt($m.$sys[sys]);
                if (!!_left) _res.push(_left.replace('[VERSION]', _ver));
                if (!!_right) _res.push(_right.replace('[VERSION]', _ver));
                return eval(_res.join('&&'));
            })();
        };
        return function (_uri) {
            var _brr = [],                                                  // return array
                _sOption = null,                                            // samd selective option
                _arr = _uri.split('!'),                                     // target array
                _target = _arr[0],                                          // samd selective target
                _reg = /\$[^><=!]+/,                                        // parse version regexp
                _fun = _fMap[_target.toLowerCase()];                        // define module's callback function
            if (_arr.length > 1 && !_config.sites[_target] && !_config.paths[_target]) {
                var _temp = _arr.shift(),
                    _sys = _target.match(_reg)[0];
                if ($m.$sys[_sys] && _parseVersion(_target, _sys)) _fun = '';
                else if (!_fun) _fun = _noop;
                _sOption = _fun ? _temp : null;
            }
            _brr.push(_arr.join('!'));
            _brr.push(_fun || _loadScript);
            _brr.push(_sOption);
            return _brr;
        };
    })();

    // The _scriptListener() method can call _jsLoaded method when the target script loaded.
    var _scriptListener = function (script) {
        script.onload = function (event) {
            _jsLoaded($m.$getTarget(event));
        };
        script.onreadystatechange = function (event) {
            var _element = $m.$getTarget(event) || this;
            if (!_element) return;
            var _state = _element.readyState;
            if (_state === 'loaded' || _state === 'complete') _jsLoaded(_element, !0);
        };
    };

    // The _scriptListener() method can add listener to all script tags.
    var _scriptAllListener = (function () {
        var _clearStack = function () {
            var _args = _dStack.pop();
            while (!!_args) {
                _define.apply(p, _args);
                _args = _dStack.pop();
            }
        };
        return function () {
            var _list = document.getElementsByTagName('script');
            for (var i = _list.length - 1, script; i >= 0; i--) {
                script = _list[i];
                if (!script.iModal) {
                    script.iModal = !0;
                    script.src ? _scriptListener(_list[i]) : _clearStack();
                }
            }
        }
    })();

    // The _loadText() method can load text by url, and put result in callback function.
    var _loadText = function (url, callback) {
        $m.$ajax({
            url: url,
            dataType: 'text',
            success: function (data) {
                // _doCheckLoading();
                callback(data);
            }
        })
    };

    // The _loadScript() method can load script by url.
    var _loadScript = function (url) {
        if (!url) return;
        var _state = _sCache[url];
        if (_state != null) return;
        // load file
        _sCache[url] = 0;
        var _script = _doc.createElement('script');
        _script.iModal = !0;
        _script.type = 'text/javascript';
        _script.charset = _config.charset;
        _scriptListener(_script);
        _script.src = url;
        (_doc.getElementsByTagName('head')[0] || document.body).appendChild(_script);
    };

    // The _jsLoaded() method can recover script when it's loaded.
    function _jsLoaded(script) {
        var _uri = $m.$parseURI(script.src);
        if (!_uri) return;
        var _arr = _dStack.pop();

        if (!!_arr) {
            _arr.unshift(_uri);
            // _doDefine.apply(_win, _arr);
        }
        // change state
        if (!!_uri && _sCache[_uri] != 1) _sCache[_uri] = 2;

        //_doCheckLoading();
        if (!script || !script.parentNode) return;
        script.onload = null;
        script.onerror = null;
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
    };

    // The _circular() method can find the circular reference.
    var _circular = (function () {
        var _result;
        // return reference's index
        var _index = function (array, name) {
            for (var i = array.length - 1; i >= 0; i--)
                if (array[i].n == name) return i;
            return -1;
        };
        // loading cycle test resources
        var _loop = function (item) {
            if (!item) return;
            var i = _index(_result, item.n);
            if (i >= 0) return item;
            _result.push(item);
            var _depends = item.d;
            if (!_depends || !_depends.length) return;
            for (var i = 0, l = _depends.length, _cItem; i < l; i++) {
                _cItem = _loop(_iList[_index(_iList, _depends[i])]);
                // blew ie9 check for depends resource loaded
                if (!!_cItem) {
                    var _cItemDeps = _cItem.d;
                    if (!!_cItemDeps && !!_cItemDeps.length) {
                        for (var j = _cItemDeps.length - 1; j >= 0; j--) {
                            if (_sCache[_cItemDeps[i]] !== 2) return _cItemDeps[i];
                        }
                    }
                    return _cItem;
                }
            }
        };
        // execute iModal callback function
        var _exec = function (list, pMap) {
            if (!pMap) return;
            // find platform patch list
            var _arr = [];
            for (var i = 0, l = list.length, _it; i < l; i++) {
                _it = list[i];
                if (pMap[_it]) {
                    _arr.push(_it);
                }
            }
            // index queue by file name
            var _map = {};
            for (var i = 0, l = _iList.length, _it; i < l; i++) {
                _it = _iList[i];
                _map[_it.n] = _it;
            }
            // execute platform patch
            for (var i = 0, l = _arr.length, _it, _item; i < l; i++) {
                _it = _arr[i];
                _item = _map[_it];
                if (!!_item) _execFn(_item);
                // exec hack js
                _item = _map[pMap[_it]];
                if (!!_item) _execFn(_item);
            }
        };
        return function () {
            _result = [];
            // check from begin to end
            var _item = _loop(_iList[0]);
            // must do platform before execute
            if (!!_item) _exec(_item.d, _item.p);
            return _item;
        };
    })();

    // The _checkLoading() method can check files loading state.
    var _checkLoading = (function () {
        // check each item's state
        function _isListLoaded(_list) {
            if (!!_list && !!_list.length) {
                for (var i = _list.length - 1; i >= 0; i--) {
                    if (_sCache[_list[i]] !== 2) return !1;
                }
            }
            return !0;
        };
        // check whether all files are loaded
        function _isFinishLoaded() {
            for (var x in _sCache)
                if (_sCache[x] === 0) return !1;
            return !0;
        };
        return function () {
            if (!_iList.length) return;
            for (var i = _iList.length - 1, _item; i >= 0;) {
                _item = _iList[i];
                if (_sCache[_item.n] !== 2 && !_isListLoaded(_item.d)) {
                    i--;
                    continue;
                }
                // for loaded
                _iList.splice(i, 1);
                if (_sCache[_item.n] !== 2) {
                    _execFn(_item);
                }
                i = _iList.length - 1;
            }
            // check circular reference
            if (_iList.length > 0 && _isFinishLoaded()) {
                var _item = _circular() || _iList.pop();
                _execFn(_item);
                _checkLoading();
            }
        };
    })();

    // The _execFn() method can execute define method's callback function.
    var _execFn = (function () {
        // merge inject param
        var _mergeDI = function (_dep) {
            var _arr = [];
            // merge dependency list result
            if (!!_dep)
                for (var i = 0, l = _dep.length; i < l; i++) {
                    _arr.push(_rCache[_dep[i]] || {});
                }
            return _arr;
        };
        // merge inject iModal result
        var _mergeResult = function (_uri, _result) {
            var _ret = _rCache[_uri],
                _isO = $m.$isObject(_result);
            if (!!_result) {
                if (!_ret || !_isO) {
                    // for other type of return
                    _ret = _result;
                } else {
                    // for namespace return
                    _ret = _ret || {};
                    for (var x in _result) {
                        _ret[x] = _result[x];
                    }
                }
            }
            _rCache[_uri] = _ret;
        };
        return function (_item) {
            var _args = _mergeDI(_item.d);
            if (!!_item.f) {
                var _result = _item.f.apply(_win, _args) ||
                    _args[_args.length - 4];
                _mergeResult(_item.n, _result);
            }
            _sCache[_item.n] = 2;
            console.log('iModal: ' + _item.n);
        };
    })();

    // The _define() method is $m.$define method's main function.
    var _define = (function () {
        var _seed = +new Date;
        // format arguments
        var _formatARG = function (_str, _arr, _fun) {
            var _args = [null, null, null],
                _fFun = [
                    function (_arg) {
                        return $m.$isString(_arg);
                    },
                    function (_arg) {
                        return $m.$isArray(_arg);
                    },
                    function (_arg) {
                        return $m.$isFunction(_arg);
                    }
                ];
            // format the order of the arguments
            for (var i = 0, l = arguments.length, _it; i < l; i++) {
                _it = arguments[i];
                for (var j = 0, k = _fFun.length; j < k; j++) {
                    if (_fFun[j](_it)) {
                        _args[j] = _it;
                        break;
                    }
                }
            }
            return _args;
        };
        // parse all relative uri
        var _parseAllURI = function (_list, _base) {
            if (!_list || !_list.length) return;
            for (var i = 0, l = _list.length, _it; i < l; i++) {
                _it = _list[i] || '';
                if (_it.indexOf('.') != 0) continue;
                _list[i] = $m.$parseURI(_it, _base);
            }
        };
        return function (_uri, _deps, _callback) {
            // check input
            var _args = _formatARG.apply(_win, arguments);
            _uri = _args[0] || $m.$parseURI('./' + (_seed++) + '.js');
            _deps = _args[1];
            _callback = _args[2];
            // check module defined in file
            _uri = $m.$parseURI(_uri);
            if (_sCache[_uri] === 2) return;
            _parseAllURI(_deps, _uri);
            _sCache[_uri] = 1;
            // push to load queue
            var _iMap = {n: _uri, d: _deps, f: _callback};
            _iList.push(_iMap);
            // load dependence
            var _list = _iMap.d;
            if (!!_list && !!_list.length) {
                for (var k = 0, j = _list.length, _itt, _itm, _arr; k < j; k++) {
                    _itt = _list[k];
                    if (!_itt) return;
                    // 0 - url
                    // 1 - load function
                    // 2 - resource type
                    _arr = _parsePlugin(_itt);
                    _itm = $m.$parseURI(_arr[0], _uri, _arr[2]);
                    _list[k] = _itm;
                    _arr[1](_itm);
                }

            }
            // check state
            _checkLoading();
        };
    })();

    // iModal start
    _init();
})(document, window)
//]]>