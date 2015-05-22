/*!
 * iModal JavaScript Component v0.1.0
 *
 * Author YangFan(18767120422@163.com)
 *
 * Date: 2015-05-20
 */
(function (_doc, _win, undefined) {

    var $m = {};
    var $t = {}
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

    if (!_win.$m) _win.$m = $m;
})(document, window)