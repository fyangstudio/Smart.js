/**
 * iModal JavaScript Component v0.1.0
 *
 * Author YangFan(18767120422@163.com)
 *
 * Date: 2015-05-20
 */
(function (_doc, _win, undefined) {
    /*!
     * iModal Tools Component
     *
     * #include
     * Primary javascript API syntax fix
     * Base function
     *
     */
    var $t = {};
    var _noop = function () {
    };

    /* Event listener
     ---------------------------------------------------------------------- */
    if (_doc.addEventListener) {
        $t.$addEvent = function (node, event, fn) {
            node.addEventListener(event, fn, false);
        }
        $t.$removeEvent = function (node, event, fn) {
            node.removeEventListener(event, fn, false)
        }
    } else {
        $t.$addEvent = function (node, event, fn) {
            node.attachEvent('on' + event, fn);
        }
        $t.$removeEvent = function (node, event, fn) {
            node.detachEvent('on' + event, fn);
        }
    }

    /* Type of
     ---------------------------------------------------------------------- */
    function _isType(type) {
        return function (obj) {
            return {}.toString.call(obj) == '[object ' + type + ']';
        }
    }

    // The $t.$isXXX() method returns true if an object is an XXX, false if it is not.
    $t.$isArray = Array.isArray || _isType('Array');
    $t.$isObject = _isType('Object');
    $t.$isString = _isType('String');
    $t.$isFunction = _isType('Function');

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
            if (!$t.$isFunction(this)) return;
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
            if (this == null || !$t.$isFunction(callback)) return;

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
                if (typeof obj !== 'object' && !$t.$isFunction(obj) || obj === null) return;

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
            if ($t.$isString(json)) {
                json = json.trim();
                if (json) return ( new Function('return ' + json) )();
            }
            throw new Error('Invalid JSON: ' + json);
        }
        // The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified,
        // or optionally including only the specified properties if a replacer array is specified.
        _json.stringify = function (obj) {
            if (typeof (obj) != "object" || obj === null) {
                if ($t.$isString(obj)) obj = '"' + obj + '"';
                return String(obj);
            } else {
                var json = [], arr = $t.$isArray(obj), stringify = arguments.callee;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var v = obj[key];
                        if ($t.$isString(v)) v = '"' + v + '"';
                        else if (typeof (v) == "object" && v !== null) v = stringify(v);
                        json.push((arr ? "" : '"' + key + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };
        _win.JSON = _json;
    }

    // The console object provides access to the browser's debugging console
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
    $t.$on = function (event, fn) {
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
    }

    // Relieve custom event
    $t.$off = function (event, fn) {
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
    }

    /* Parse
     ---------------------------------------------------------------------- */
    // The $t.$parseHTML() method can change a string of html to a html node.
    $t.$parseHTML = function (txt) {
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

    /* Transform
     ---------------------------------------------------------------------- */
    // The $t.$forIn() statement iterates over the enumerable properties of an object, in arbitrary order.
    $t.$forIn = function (obj, callback, thisArg) {
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
    $t.$s2o = function (string, _split) {
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
    $t.$o2s = function (_object, _split, _encode) {
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
    $t.$clone = function (target, deep) {
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

    // Same
    $t.$same = function (target1, target2, deep) {
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

    // The $t.$hash()method property returns a DOMString not containing a '#' followed by the fragment identifier of the URL.
    // The hash is not percent encoded.
    $t.$hash = function (value) {
        if (value != undefined) window.location.hash = value.replace(/#/g, '');
        return window.location.hash.replace('#', '');
    };

    // The $t.$watchHash() method can check the location.hash at a regular interval,
    // if location.hash changed, the callback function is called.
    $t.$watchHash = function (callback) {
        if (this.$isFunction(callback)) {
            if (('onhashchange' in window) && ((typeof _doc.documentMode === 'undefined') || _doc.documentMode == 8)) {
                this.$addEvent(window, 'hashchange', function () {
                    _hash = this.$hash();
                    callback(_hash);
                }.bind(this))
            } else {
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
    }

    /* request
     ---------------------------------------------------------------------- */
    var _ajaxHandler = function () {
    }
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
                if (_data != null && _method == 'get') _url += ('?' + $t.$o2s(_data));
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
    }

    // The $t.$ajax() method perform an asynchronous HTTP request.
    $t.$ajax = function (config) {
        if (this.$isObject(config)) return new _ajaxHandler()._request(config);
        else throw new Error('Ajax parameter error');
    }

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
    // The $t.$escape() method computes a new string,
    // in which certain characters have been replaced by a hexadecimal escape sequence.
    // Use entity transform or encodeURIComponent instead.
    $t.$escape = function (content, encodeURL) {
        if (encodeURL != undefined) {
            return encodeURIComponent(content);
        } else {
            var _map = {
                r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
                '<': '&lt;', '>': '&gt;', '&': '&amp;', ' ': '&nbsp;',
                '"': '&quot;', "'": '&#39;', '\n': '<br/>', '\r': ''
            };
            return _encode(_map, content);
        }
    };

    // The $t.$unescape() method computes a new string,
    // in which hexadecimal escape sequences are replaced with the character that it represents.
    // The escape sequences might be introduced by a function like escape.
    // Because unescape is deprecated, use entity transform or decodeURIComponent instead.
    $t.$unescape = function (content, decodeURL) {
        if (decodeURL != undefined) {
            return decodeURIComponent(content);
        } else {
            var _map = {
                r: /\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,
                '&lt;': '<', '&gt;': '>', '&amp;': '&', '&nbsp;': ' ',
                '&#39;': "'", '&quot;': '"', '<br/>': '\n'
            };
            return _encode(_map, content);
        }
    };


    _win.$t = $t;

    /*!
     * iModal Templates Component
     *
     * #include
     * Living dom
     *
     */
    var $tpl = function () {

    }
    $tpl.prototype = {}

    _win.$tpl = $tpl;

    /*!
     * iModal Modal Component
     *
     * #include
     * Base Class
     * Define (SAMD)
     *
     */
    // The base Class implementation
    var Class = function () {
    };

    // Create a new Class that inherits from this class
    Class.$extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        var prototype = new this();

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if (name != "$super") {
                // Check if we're overwriting an existing function
                prototype[name] = ($t.$isFunction(prop[name]) && $t.$isFunction(_super[name]) ?
                    (function (name, fn) {
                        return function () {
                            var tmp = this.$super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this.$super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this.$super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) : prop[name]);
            }
        }

        // The dummy class constructor
        function _Class() {
        }

        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "$extend")
                _Class[key] = this[key];
        }

        // Populate our constructed prototype object
        _Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        _Class.prototype.constructor = _Class;

        // And make this class extendable
        _Class.$extend = Class.$extend;

        return _Class;
    };

    var x = Class.$extend({
        $init: function () {
            console.log(1);
        },
        t1: function () {
        }
    })

    var t = x.$extend({
        $init: function () {
            this.$super();
            console.log(2);
        },
        t2: function () {
            this.$super();
        }
    })
    new t().$init();

    var $m = {
        config: function (options) {
            // console.log(options);
        }
    }

    _win.$m = $m;

})(document, window)