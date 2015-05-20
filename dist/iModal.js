(function (_doc, _win, undefined) {

    var $m = {};
    var $t = {}
    var _noop = function () {
    };

    /* event listener
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

    /* type of
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

    /* grammar fix
     ---------------------------------------------------------------------- */

    // trim String
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

    if (!_win.$m) _win.$m = $m;
})(document, window)