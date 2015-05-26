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
                    var v = obj[key];
                    if ($t.$isString(v)) v = '"' + v + '"';
                    else if (typeof (v) == "object" && v !== null) v = stringify(v);
                    json.push((arr ? "" : '"' + key + '":') + String(v));
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
    var $m = {
        config: function (options) {
            console.log(options);
        }
    }

    _win.$m = $m;

})(document, window)