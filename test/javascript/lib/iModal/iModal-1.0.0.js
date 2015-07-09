/**
 * iModalJs JavaScript Component v1.0.0
 *
 * Copyright 2015-2015 YangFan and other contributors
 * Released under the MIT license
 * https://github.com/fyangstudio/iModalJs/blob/master/LICENSE
 *
 * Author YangFan(18767120422@163.com)
 *
 * Start: 2015-05-20
 */
//<![CDATA[
(function (_doc, _win, undefined) {

    // iModalJs version
    var _version = '1.0.0';
    // iModalJs object
    var $m = {iModalJs: _version};
    // Empty function
    var _NOOP = function () {
    };
    // Error function
    var _ERROR = function (msg) {
        throw new Error(msg);
    };
    // Object.observe
    var _observe = Object.observe || undefined;
    // Define.samd config
    var _config = {sites: {}, paths: {}, charset: 'utf-8', delay: 500};
    /*!
     * iModalJs Data Structure Component
     *
     * #include
     * Stack & Queue
     *
     */
    /* Stack
     ---------------------------------------------------------------------- */
    $m.$stack = function () {
        this.top = 0;
        this.dataStore = [];
    };
    $m.$stack.prototype = {
        // placing item on top
        push: function (element) {
            this.dataStore[this.top++] = element;
        },
        // get the current item
        peek: function () {
            return this.dataStore[this.top - 1];
        },
        // taking the top item off the stack
        pop: function () {
            return this.dataStore[--this.top];
        },
        // clear the stack
        clear: function () {
            this.top = 0;
            this.dataStore = [];
        },
        // get stack length
        length: function () {
            return this.top;
        }
    };

    /* Queue
     ---------------------------------------------------------------------- */
    $m.$queue = function () {
        this.dataStore = [];
    };
    $m.$queue.prototype = {
        // add an item to the queue, generally at the "back" of the queue
        enqueue: function (element) {
            this.dataStore.push(element);
        },
        // remove an item from the queue, generally from the "front" of the queue
        dequeue: function () {
            return this.dataStore.shift();
        },
        // get the "front" of the queue
        front: function () {
            return this.dataStore[0]
        },
        // get the "back" of the queue
        back: function () {
            return this.dataStore[this.dataStore.length - 1];
        },
        // get queue length
        length: function () {
            return this.dataStore.length;
        }
    };

    /*!
     * iModalJs Tools Component
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
    // Get pixel
    _sys.$pixel = _win.devicePixelRatio || 1;
    // Parse userAgent
    if (_ua.indexOf('chrome') > 0) _sys.$chrome = _ua.match(/chrome\/([\d.]+)/)[1];
    else if (_win.ActiveXObject) _sys.$ie = _ua.match(/msie ([\d.]+)/)[1];
    else if (_doc.getBoxObjectFor) _sys.$firefox = _ua.match(/firefox\/([\d.]+)/)[1];
    else if (_win.openDatabase) _sys.$safari = _ua.match(/version\/([\d.]+)/)[1];
    else if (_win.opera) _sys.$opera = _ua.match(/opera.([\d.]+)/)[1];

    /* The document object model
     ---------------------------------------------------------------------- */
    // Width (in pixels) of the browser window viewport
    var _winW = function () {
        return _win.innerWidth || _doc.documentElement.clientWidth || _doc.body.clientWidth;
    };
    // Height (in pixels) of the browser window viewport
    var _winH = function () {
        return _win.innerHeight || _doc.documentElement.clientHeight || _doc.body.clientHeight;
    };
    // Get the width or height of an element in pixels.
    // The inner sign can mark whether it includes padding.
    var _wORh = function (name, elem, inner) {
        var _val = name === "width" ? elem.offsetWidth : elem.offsetHeight;
        if (!inner) return _val;

        var _value = this.$style(elem, name);
        var _return = parseFloat(_value);
        var _pdgMap = {
            'width': ['padding-left', 'padding-right'],
            'height': ['padding-top', 'padding-bottom']
        };
        // IE Fixes
        if (isNaN(_return) || _value.indexOf('%') > 0) {
            _return = _val
            - parseFloat(this.$style(elem, _pdgMap[name][0]))
            - parseFloat(this.$style(elem, _pdgMap[name][1]));
        }
        return _return;
    };

    // Set or get an element attribute.
    $m.$attr = (function () {
        // Special attribute map.
        var _AttrMap = {
            // Check Boolean IDL Attribute
            BooleanAttr: /selected|checked|disabled|readOnly|autofocus|controls|autoplay|loop/i,
            // Some Special Content attribute
            SpecialAttr: {
                // Element's class
                'class': function (elem, value) {
                    if (value) elem.className = value;
                    else return elem.className;
                },
                // Label's for
                'for': function (elem, value) {
                    if (value)  elem.htmlFor = value;
                    else return elem.htmlFor;
                },
                // Element's style
                'style': function (elem, value) {
                    if (value) elem.style.cssText = value;
                    else return elem.style.cssText;
                },
                // Input's value
                'value': function (elem, value) {
                    if (value) elem.value = value;
                    else return elem.value;
                }
            }
        };
        return function (elem, name, value) {
            var _nType = elem.nodeType, _sAttr = _AttrMap.SpecialAttr[name];
            // Don't get/set attributes on attribute text and comment nodes.
            if (!elem || _nType === 2 || _nType === 3 || _nType === 8) return;
            // Set Attribute
            if (value !== undefined) {
                if (_sAttr) _sAttr(elem, value);
                else if (_AttrMap.BooleanAttr.test(name)) {
                    elem[name] = !!value;
                    !!value ? elem.setAttribute(name, name) : elem.removeAttribute(name);
                    // Use defaultChecked for oldIE
                    if (this.$sys.$ie && this.$sys.$ie <= 7) elem.defaultChecked = !!value;
                } else  !!value ? elem.setAttribute(name, value) : elem.removeAttribute(name);
            } else {
                // Get Attribute ( getAttribute(name, 2) for a.href in oldIE )
                return _sAttr ? _sAttr(elem) : (elem[name] || elem.getAttribute(name, 2) || undefined);
            }
        };
    })();

    // Create the specified HTML element
    $m.$create = function (type, namespace) {
        return !namespace ? _doc.createElement(type) : _doc.createElementNS(namespace, type);
    };

    // The $m.$replace() method replaces one child node of the specified element with another.
    $m.$replace = function (elem, replaced) {
        if (replaced.parentNode) replaced.parentNode.replaceChild(elem, replaced);
    };

    // The $m.$remove () method removes a child node from the it's parentNode.
    $m.$remove = function (elem) {
        if (elem.parentNode) elem.parentNode.removeChild(elem);
    };

    // Create an empty DocumentFragment object.
    $m.$fragment = function () {
        return _doc.createDocumentFragment();
    };

    // $m.$text() sets or gets all of the markup and content within a given element.
    $m.$text = (function () {
        // Special add text method map.
        var _TextMap = {};
        if ($m.$sys.$ie && $m.$sys.$ie < 9) {
            _TextMap[1] = 'innerText';
            _TextMap[3] = 'nodeValue';
        } else _TextMap[1] = _TextMap[3] = 'textContent';
        return function (elem, value) {
            if (elem == null) elem = _doc.createTextNode('');
            var textProp = _TextMap[elem.nodeType];
            if (value === undefined) return textProp ? elem[textProp] : '';
            elem[textProp] = value;
            return elem;
        }
    })();

    // The $m.$style() method specifies the style sheet language for the given document fragment.
    $m.$style = function (elem, name) {
        if (elem.currentStyle) return elem.currentStyle[name];
        return getComputedStyle(elem, null)[name];
    };

    // The $m.$width() method can get element's width in pixels.
    $m.$width = function (elem, inner) {
        return _wORh.call(this, 'width', elem, inner);
    };

    // The $m.$height() method can get element's height in pixels.
    $m.$height = function (elem, inner) {
        return _wORh.call(this, 'height', elem, inner);
    };

    // The $m.$winSize() object can show the information of window's viewport.
    $m.$winSize = {w: _winW(), h: _winH()};

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

    /* Type of
     ---------------------------------------------------------------------- */
    function _isType(type) {
        return function (obj) {
            return {}.toString.call(obj) == '[object ' + type + ']';
        }
    }

    // The $m.$isXXX() method returns true if an object is an XXX, false if it is not.
    $m.$isArray = Array.isArray || _isType('Array');
    $m.$isDate = _isType('Date');
    $m.$isRegExp = _isType('RegExp');
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
                    return fToBind.apply(this instanceof _NOOP && oThis ? this : oThis || _win,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            _NOOP.prototype = this.prototype;
            fBound.prototype = new _NOOP();
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
            _ERROR('Invalid JSON: ' + json);
        };
        // The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified,
        // or optionally including only the specified properties if a replacer array is specified.
        _json.stringify = function (obj) {
            if (typeof (obj) != 'object' || obj === null) {
                if ($m.$isString(obj)) obj = '"' + obj + '"';
                return String(obj);
            } else {
                var json = [], arr = $m.$isArray(obj), stringify = arguments.callee;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var v = obj[key];
                        if ($m.$isString(v)) v = '"' + v + '"';
                        else if (typeof (v) == "object" && v !== null) v = stringify(v);
                        json.push((arr ? '' : '"' + key + '":') + String(v));
                    }
                }
                return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
            }
        };
        _win.JSON = _json;
    }

    // Low version of the browser compatibility without console object.
    if (!_win.console) {
        _win.console = {
            log: _NOOP,
            warn: _NOOP,
            error: _NOOP
        };
    }

    /* Custom event function
     ---------------------------------------------------------------------- */
    // The $m.$bindEvent() method can create customEvent and add 3 methods to context, they are $on, $off and $emit.
    $m.$bindEvent = function (context) {
        if (!context) return;
        // Handles custom event
        context.$on = function (event, fn) {
            if (typeof event === 'object') {
                var _on = arguments.callee;
                $m._$forEach(function (key, value) {
                    _on(key, value);
                });
            } else {
                var _handles = context._handles || (context._handles = {}),
                    _calls = _handles[event] || (_handles[event] = []);
                _calls.push(fn);
            }
            return context;
        };
        // Relieve custom event
        context.$off = function (event, fn) {
            if (!context._handles) return;
            if (!event) context._handles = {};
            var _handles = context._handles, _calls;

            if (_calls = _handles[event]) {
                if (!fn) {
                    _handles[event] = [];
                    return context;
                }
                for (var i = 0, l = _calls.length; i < l; i++) {
                    if (fn === _calls[i]) {
                        _calls.splice(i, 1);
                        return context;
                    }
                }
            }
            return context;
        };
        // Trigger custom events
        context.$emit = function (event) {
            var handles = context._handles, calls, args, type;
            if (!event) return;
            if (typeof event === "object") {
                type = event.type;
                args = event.data || [];
            } else {
                args = Array.prototype.slice.call(arguments);
                type = event;
            }
            if (!handles || !(calls = handles[type])) return context;
            for (var i = 0, len = calls.length; i < len; i++) {
                calls[i].apply(context, args)
            }
            return context;
        }
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
        var _cnt = this.$create(_tag || 'div');
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
            _anchor = $m.$create('a');                      // _anchor which can get browser machined path

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
                _anchor.id = 'iModalJs_anchor';
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

    /* Format
     ---------------------------------------------------------------------- */
    // Transforms a "yyyy-MM-dd hh:mm:ss" timestamp into the specified date/time format.
    $m.$formatTime = function (time, format) {
        if (this.$isString(time)) time = new Date(Date.parse(time));
        if (!this.$isDate(time)) time = new Date(time);
        var _format = function (value) {
            return RegExp.$1.length == 1 ? value : ('00' + value).substr(('' + value).length);
        };
        var _map = [
            // Format Year
            [/(y+)/, function () {
                return (time.getFullYear() + '').substr(4 - RegExp.$1.length);
            }],
            // Format Month
            [/(M+)/, function () {
                return _format(time.getMonth() + 1);
            }],
            // Format Date
            [/(d+)/, function () {
                return _format(time.getDate());
            }],
            // Format Hour
            [/(h+)/, function () {
                return _format(time.getHours());
            }],
            // Format Minutes
            [/(m+)/, function () {
                return _format(time.getMinutes());
            }],
            // Format Seconds
            [/(s+)/, function () {
                return _format(time.getSeconds());
            }],
            // Format Milliseconds
            [/(ms)/, function () {
                return _format(time.getMilliseconds());
            }]
        ];
        _map.forEach(function (value) {
            format = format.replace(value[0], value[1]);
        });
        return format;
    };

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
    $m.$s2o = function (string, split) {
        var _obj = {};
        var _arr = (string || '').split(split);
        _arr.forEach(function (name) {
            var _brr = name.split('=');
            if (!_brr || !_brr.length) return;
            var _key = _brr.shift();
            if (!_key) return;
            _obj[decodeURIComponent(_key)] = decodeURIComponent(_brr.join('='));
        });
        return _obj;
    };

    // Object to string
    $m.$o2s = function (object, split, encode) {
        if (typeof (object) != 'object' || object === null) return JSON.stringify(object);

        var _arr = [];
        this.$forIn(object, function (value, key) {
            if (this.$isFunction(value)) return;
            value = JSON.stringify(value);

            if (!!encode) value = encodeURIComponent(value);
            _arr.push(encodeURIComponent(key) + '=' + value);
        }.bind(this));
        return _arr.join(split || ',');
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
            // allows target1[p] to be set to undefined
            if (target2.hasOwnProperty(p) && !target1.hasOwnProperty(p)) return false;
        }
        return true;
    };

    /* throttle
     ---------------------------------------------------------------------- */
    // Since resize events can fire at a high rate, the $m.$throttle() method can throttle the event using.
    $m.$throttle = function (fn, delay) {
        var _timer = null;
        return function () {
            var args = arguments;
            clearTimeout(_timer);
            // set _timer
            _timer = setTimeout(function () {
                fn.apply(this, args);
            }.bind(this), delay);
        };
    };

    /* hash
     ---------------------------------------------------------------------- */
    // Window hash
    var _hash = _win.location.hash;

    // The $m.$hash()method property returns a DOMString not containing a '#' followed by the fragment identifier of the URL.
    // The hash is not percent encoded.
    $m.$hash = function (value) {
        if (value != undefined) _win.location.hash = value.replace(/#/g, '');
        return _win.location.hash.replace('#', '');
    };

    // Watch location.hash
    $m.$watchHash = function (callback) {
        if (!this.$isFunction(callback)) return;
        // Browser support hash change event
        if (('onhashchange' in _win) && ((typeof _doc.documentMode === 'undefined') || _doc.documentMode == 8)) {
            this.$addEvent(_win, 'hashchange', function () {
                _hash = this.$hash();
                callback(_hash);
            }.bind(this))
        } else {
            // Check the location.hash at a regular interval
            var handles = this._hashFns || (this._hashFns = []);
            handles.push(callback);
            setInterval(function () {
                var _h = _win.location.hash.replace('#', '');
                if (_h != _hash) {
                    _hash = this.$hash();
                    handles.forEach(function (_fn) {
                        _fn.call(this, _h);
                    })
                }
            }.bind(this), 100);
        }
    };

    /* scroll
     ---------------------------------------------------------------------- */
    // The $m.$scroll() method can scrolls to a particular set of coordinates in the document,
    // and return the scroll's position.
    $m.$scroll = function (position) {
        var _flag = !!position && this.$isObject(position);
        var _top = _flag ? position.top : undefined;
        var _left = _flag ? position.left : undefined;
        if (typeof pageYOffset != 'undefined') {
            if (_flag) _win.scrollTo(_left || _win.pageXOffset, _top || _win.pageYOffset);
            return {
                top: _win.pageYOffset,
                left: _win.pageXOffset
            }
        } else {
            var _body = _doc.documentElement || _doc.body;
            if (_flag) _win.scrollTo(_left || _body.scrollLeft, _top || _body.scrollTop);
            return {
                top: _body.scrollTop,
                left: _body.scrollLeft
            }
        }
    };

    // Watch scroll event
    $m.$watchScroll = function (callback) {
        if (!this.$isFunction(callback)) return;
        var handles = this._scrollFns || (this._scrollFns = []);
        handles.push(callback);
        var onScroll = function () {
            handles.forEach(function (_fn) {
                _fn.call(this, $m.$scroll());
            })
        }.bind(this);
        $m.$addEvent(_win, 'scroll', onScroll);
    };

    /* request
     ---------------------------------------------------------------------- */
    var _ajaxHandler = function () {
    };
    _ajaxHandler.prototype = {
        _request: function (config) {
            if (!!config.url) {
                var
                    _headers = config.headers || {},                            // set request header
                    _method = (config.method || 'GET').toLowerCase(),           // method
                    _url = config.url,                                          // url
                    _data = config.data || null,                                // send data
                    _dataType = (config.dataType || 'JSON').toLowerCase(),      // request data type
                    _success = config.success || _NOOP,                         // request success callback
                    _error = config.error || _NOOP,                             // request fail callback
                    _xhr = this._createXhrObject();                             // XMLHttpRequest
                // data to string
                var _d2s = function (data) {
                    return $m.$o2s(data, '&').replace(/^"|"$/g, '');
                };
                if (_data != null && _method == 'get') {
                    _url += ('?' + _d2s(_data));
                    _data = null;
                }
                // On xhr ready state change
                _xhr.onreadystatechange = function () {
                    if (_xhr.readyState !== 4) return;
                    var _responseData = _dataType == 'json' ? JSON.parse(_xhr.responseText) : _xhr.responseText;
                    (_xhr.status === 200) ? _success(_responseData) : _error(_xhr);
                };
                _xhr.open(_method, _url, true);
                // Set request header
                try {
                    $m.$forIn(_headers, function (value, header) {
                        if (_method == 'post' && _data != null && /form/i.test(value)) _data = _d2s(_data);
                        _xhr.setRequestHeader(header, value);
                    })
                } catch (err) {
                    // ignore
                }
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
            _ERROR('$ajax: Could not create an XHR object!');
        }
    };

    // The $m.$ajax() method perform an asynchronous HTTP request.
    $m.$ajax = function (config) {
        if (this.$isObject(config)) return new _ajaxHandler()._request(config);
        else _ERROR('$ajax: Parameter error');
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
    // Escapes all reserved characters for regular expressions by preceding them with a backslash.
    // Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
    $m.$escapeRegExp = function (str) {
        return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function (match) {
            return '\\' + match;
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
        var ret = _encode(_map, content);
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
        // Looking for the element
        else return _interpret(query, context);
    };

    // Interpret query
    function _interpret(query, context) {
        var parts = query.replace(/\s+/, ' ').split(' ');
        var part = parts.pop();
        var selector = _selectorFactory.createSelector(part);
        var ret = selector.find(context);

        return (parts[0] && ret[0]) ? _domFilter(parts, ret) : ret;
    }

    // Dom id selector
    function _IdSelector(id) {
        this.id = id.substring(1);
    }

    // Check for Id Selector
    _IdSelector.test = function (selector) {
        var regex = /^#([\w\-_]+)/;
        return regex.test(selector);
    };

    _IdSelector.prototype = {
        // find the element
        find: function (context) {
            var ret = [];
            ret.push(context.getElementById(this.id));
            return ret;
        },
        // match the selector query
        match: function (element) {
            return element.id == this.id;
        }
    };

    // Dom tagName selector
    function _TagSelector(tagName) {
        this.tagName = tagName.toUpperCase();
    }

    // Check for Tag Selector
    _TagSelector.test = function (selector) {
        var regex = /^([\w\*\-_]+)/;
        return regex.test(selector);
    };

    _TagSelector.prototype = {
        // find the element
        find: function (context) {
            return context.getElementsByTagName(this.tagName);
        },
        // match the selector query
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

    // Check for Class Selector
    _ClassSelector.test = function (selector) {
        var regex = /^([\w\-_]*)\.([\w\-_]+)/;
        return regex.test(selector);
    };

    _ClassSelector.prototype = {
        // find the element
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
        // match the selector query
        match: function (element) {
            var className = this.className;
            var regex = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return regex.test(element.className);
        }
    };

    // If result has parent node, filter result
    function _domFilter(parts, nodeList) {
        var part = parts.pop();
        var selector = _selectorFactory.createSelector(part);
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
        createSelector: function (query) {
            if (_IdSelector.test(query)) return new _IdSelector(query);
            else if (_ClassSelector.test(query)) return new _ClassSelector(query);
            else return new _TagSelector(query);
        }
    };

    /* Extend
     ---------------------------------------------------------------------- */
    // Class state
    var _initClass = false;
    // Base class and do nothing
    var Class = function () {
    };
    // Extend
    Class.$extend = function (prop) {
        if (!$m.$isObject(prop)) return;
        var _super = this.prototype;

        // Class state change
        _initClass = true;
        var eventInit = true;
        var prototype = new this();
        _initClass = false;

        // Copy the properties over onto the new prototype
        $m.$forIn(prop, function (value, name) {
            if (name != '$super') {
                prototype[name] = (function (name, fn) {
                    if ($m.$isFunction(prop[name])) {
                        return function () {
                            var _superFn = _NOOP;
                            if (!!_super[name] && $m.$isFunction(_super[name])) _superFn = _super[name];
                            // Add custom event handles
                            if (eventInit) {
                                eventInit = false;
                                $m.$bindEvent(prototype);
                            }
                            // Add a new $super() method that is the same method on the super-class
                            this.$super = _superFn;
                            return fn.apply(this, arguments);
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
            if (key != '$extend') $mClass[key] = value;
        });

        $mClass.prototype = prototype;
        $mClass.prototype.constructor = $mClass;
        $mClass.$extend = Class.$extend;
        return $mClass;
    };

    // iModalJs base module
    $m.$module = Class;

    /*!
     * iModalJs Templates Component
     *
     * #include
     * Living dom
     *
     */
    // Credit: regularjs 0.2.15-alpha (c) leeluolee <http://regularjs.github.io> MIT License
    var TPL_MACRO = {
        'NAME': /(?:[:_A-Za-z][-\.:_0-9A-Za-z]*)/,
        'EXPRESSION': /\{\{([\$\/#@!_A-Za-z][^}]*)\}\}/,
        'SPACE': /[\r\n\f ]/
    };

    var TPL_RULES = {
        //INIT
        ENTER_JST: [/[^\x00<]*?(?=%EXPRESSION%)/, function ($) {
            this.enter('JST');
            if ($) return {type: 'TEXT', value: $}
        }, 'INIT'],
        ENTER_TAG: [/[^\x00<>]*?(?=<)/, function ($) {
            this.enter('TAG');
            if ($) return {type: 'TEXT', value: $}
        }, 'INIT'],
        TEXT: [/[^\x00]+/, function ($) {
            if ($) return {type: 'TEXT', value: $}
        }, 'INIT'],

        // TAG
        TAG_OPEN_START: [/<(%NAME%)\s*/, function ($, one) {
            return {type: 'TAG_OPEN_START', value: one}
        }, 'TAG'],
        TAG_OPEN_END: [/(\/?>)/, function ($) {
            this.leave();
            return {type: 'TAG_OPEN_END', value: $}
        }, 'TAG'],

        TAG_ATTRIBUTE_NAME: [/(%NAME%)/, function ($, one) {
            return {type: 'TAG_ATTRIBUTE_NAME', value: one}
        }, 'TAG'],
        TAG_ATTRIBUTE_INT: [/=/, null, 'TAG'],
        TAG_ATTRIBUTE_VALUE: [/'([^']*)'|"([^"]*)"/, function ($, one, two) {
            var value = one || two || "";
            return {type: 'TAG_ATTRIBUTE_VALUE', value: value}
        }, 'TAG'],

        TAG_SPACE: [/%SPACE%+/, null, 'TAG'],

        TAG_CLOSE: [/<\/(%NAME%)[\r\n\f ]*>/, function ($, one) {
            this.leave();
            return {type: 'TAG_CLOSE', value: one}
        }, 'TAG'],

        // JST
        JST_EXPRESSION: [/%EXPRESSION%/, function ($, one) {
            this.leave('JST');
            return {type: 'JST_EXPRESSION', value: one}
        }, 'JST']
    };

    var TPL_ProcessRules = function (rules) {
        var map = {}, sign, _rules, _matchs, _reg, _retain, _ignoredReg = /\((\?\!|\?\:|\?\=)/g;

        var _replaceFn = function ($, one) {
            return $m.$isString(TPL_MACRO[one]) ? $m.$escapeRegExp(TPL_MACRO[one]) : String(TPL_MACRO[one]).slice(1, -1);
        };

        var _getRetain = function (regStr) {
            var series = 0, ignored = regStr.match(_ignoredReg);
            for (var l = regStr.length; l--;) if ((l === 0 || regStr.charAt(l - 1) !== "\\") && regStr.charAt(l) === "(") series++;
            return ignored ? series - ignored.length : series;
        };

        // add map[sign]
        rules.forEach(function (rule) {
            sign = rule[2] || 'INIT';
            (map[sign] || (map[sign] = {rules: [], links: []})).rules.push(rule);
        });
        // add map[sign]'s MATCH
        $m.$forIn(map, function (split) {
            split.curIndex = 1;
            _rules = split.rules;
            _matchs = [];
            _rules.forEach(function (rule) {
                _reg = rule[0];
                if ($m.$isRegExp(_reg)) _reg = _reg.toString().slice(1, -1);
                _reg = _reg.replace(/%(\w+)%/g, _replaceFn);
                _retain = _getRetain(_reg) + 1;
                split.links.push([split.curIndex, _retain, rule[1]]);
                split.curIndex += _retain;
                _matchs.push(_reg);
            });
            split.MATCH = new RegExp("^(?:(" + _matchs.join(")|(") + "))");
        });
        return map;
    };

    var TPL_Dictionary = TPL_ProcessRules([
        // INIT
        TPL_RULES.ENTER_JST,
        TPL_RULES.ENTER_TAG,
        TPL_RULES.TEXT,
        // TAG
        TPL_RULES.TAG_OPEN_START,
        TPL_RULES.TAG_ATTRIBUTE_NAME,
        TPL_RULES.TAG_ATTRIBUTE_INT,
        TPL_RULES.TAG_ATTRIBUTE_VALUE,
        TPL_RULES.TAG_SPACE,
        TPL_RULES.TAG_OPEN_END,
        TPL_RULES.TAG_CLOSE,
        // JST
        TPL_RULES.JST_EXPRESSION
    ]);

    var TPL_Lexer = function (tpl) {
        if (!tpl) _ERROR('$tpl: Template not found!');
        tpl = tpl.trim();
        var tokens = [], split, test, mlen, token, state;
        this._pos = 0;
        this._map = TPL_Dictionary;
        this._states = ["INIT"];
        while (tpl) {
            state = this.state();
            split = this._map[state];
            test = split.MATCH.exec(tpl);
            if (!test) _ERROR('$tpl: Unrecognized Token!');
            mlen = test[0].length;
            tpl = tpl.slice(mlen);
            token = this.process(test, split, tpl);
            if (token) tokens.push(token);
            this._pos += mlen;
        }
        // end of file
        tokens.push({type: 'EOF'});
        return tokens;
    };

    TPL_Lexer.prototype = {
        enter: function (state) {
            this._states.push(state);
            return this;
        },
        leave: function (state) {
            var states = this._states;
            if (!state || states[states.length - 1] === state) states.pop();
        },
        state: function () {
            var states = this._states;
            return states[states.length - 1];
        },
        process: function (args, split, tpl) {
            var links = split.links, token, marched = false;
            for (var len = links.length, i = 0; i < len; i++) {
                var link = links[i], handler = link[2], index = link[0];
                if (args && args[index]) {
                    marched = true;
                    if (handler) {
                        token = handler.apply(this, args.slice(index, index + link[1]));
                        token.pos = this._pos;
                    }
                    break;
                }
            }
            if (!marched) {
                if (tpl.charAt(0) == '<') this.enter("TAG");
                else this.enter("JST");
            }
            return token;
        }
    };

    var voidTag = /area|br|embed|img|input|meta|source/i;

    var TPL_Parser = function (template) {

        this.pos = 0;
        this.seed = 0;
        this.buffer = [];
        this.operation = new TPL_Lexer(template);
        console.log(this.operation);
        this.length = this.operation.length;

        var _fn = [].join(''), prefix = 'var M_DATA = this.data;', init = '', main = '', statements = this.process() || [];

        _fn += '"use strict";';
        _fn += 'var M_DOM0 = $m.$fragment();';
        _fn += 'try {<%init%>return function(){<%main%>return M_DOM0;};} catch(e) {throw new Error("$tpl: " + e.message);}';

        statements.forEach(function (statement) {
            if (statement) {
                init += statement.fragment;
                init += 'M_DOM0.appendChild(' + statement.sign + ');';
                main += statement.handler || '';
            }
        });

        this.buffer.forEach(function (variable) {
            prefix += 'var ' + variable + ' = M_DATA.' + variable + '||"";'
        });
        //main += 'console.log(t);';
        _fn = _fn.replace(/<%init%>/, init);
        _fn = _fn.replace(/<%main%>/, prefix + main);
        if (this.poll().type === 'TAG_CLOSE') _ERROR('$tpl: Unclosed Tag!');

        //console.log(_fn);
        return new Function('$m, init', _fn);
    };
    TPL_Parser.prototype = {
        next: function (k) {
            k = k || 1;
            this.pos += k;
        },
        poll: function (k) {
            k = k || 1;
            if (k < 0) k = k + 1;
            var pos = this.pos + k - 1, criticalFlag = (pos >= this.length - 1);
            return criticalFlag ? this.operation[this.length - 1] : this.operation[pos];
        },
        verify: function (type, value) {
            var poll = this.poll();
            if (poll.type === type && (typeof value === 'undefined' || poll.value === value)) {
                this.next();
                return poll;
            }
            return false;
        },
        match: function (type, value) {
            var poll;
            if (!(poll = this.verify(type, value))) {
                poll = this.poll();
                _ERROR('expect [' + type + (value == null ? '' : ':' + value) + ']" -> got "[' + poll.type + (value == null ? '' : ':' + poll.value) + ']');
            } else {
                return poll;
            }
        },
        process: function () {
            var statements = [], poll = this.poll();
            while (poll.type !== 'EOF' && poll.type !== 'TAG_CLOSE') {
                statements.push(this.statement());
                poll = this.poll();
            }
            return statements;
        },
        statement: function () {
            var poll = this.poll();
            //console.log(poll);
            switch (poll.type) {
                case 'TEXT':
                    var text = poll.value.trim().replace(/\n/g, '');
                    this.next();
                    if (!!text) {
                        var sign = 'M_DOM' + (++this.seed);
                        return {
                            type: 'text',
                            sign: sign,
                            handler: '',
                            fragment: 'var ' + sign + ' = $m.$text(null, "' + text + '");'
                        };
                    }
                    return null;
                case 'JST_EXPRESSION':
                    this.next();
                    return this.jst(poll);
                case 'TAG_OPEN_START':
                    return this.element();
                default:
                    _ERROR('$tpl: Unexpected token ' + (poll || '').type + '!');
            }
            return 1;
        },
        jst: function (poll) {
            var sign = 'M_DOM' + (++this.seed);
            // interpolate
            this.buffer.push(poll.value.split('.')[0]);
            return {
                type: 'jst',
                sign: sign,
                handler: '$m.$text(' + sign + ', ' + poll.value + ');',
                fragment: 'var ' + sign + ' = $m.$text(null, "");'
            }
        },
        attr: function () {

        },
        element: function () {
            var attr, fragment, name, sign, selfClosed, handler = '', children = [];
            name = this.match('TAG_OPEN_START').value;
            sign = 'M_DOM' + (++this.seed);
            fragment = 'var ' + sign + ' = $m.$create("' + name + '");';
            // set Attribute
            while (attr = this.verify('TAG_ATTRIBUTE_NAME')) {
                fragment += '$m.$attr(' + sign + ', "' + attr.value + '", "' + this.verify('TAG_ATTRIBUTE_VALUE').value + '");';
            }
            selfClosed = (this.match('TAG_OPEN_END').value.indexOf('/') > -1);
            if (!selfClosed && !voidTag.test(name)) {
                children = this.process();
                if (!this.verify('TAG_CLOSE', name)) _ERROR('$tpl: expect </' + name + '> got no matched closeTag!');
            } else {
                _ERROR('$tpl: ' + name + ' is not a self-closing tag!');
            }
            // console.log(children);
            if (!!children.length) {
                children.forEach(function (value) {
                    if (value) {
                        fragment += (value.fragment
                        + 'if(!!' + value.sign + '.nodeType) {' + sign + '.appendChild(' + value.sign + ');}');
                        handler += value.handler || '';
                    }
                }, this)
            }
            return {
                type: 'element',
                sign: sign,
                handler: handler,
                fragment: fragment
            }
        }
    };

    var _watch = function (obj, callback) {
        if (_observe) {
            _observe(obj, function (changes) {
                console.log(obj);
            });
        }
    };
    var _testObj = {s: 1, t: 2};
    _watch(_testObj);
    _testObj.s = 2;

    var _addResponsive = function () {
        var _resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        var _resizeFn = $m.$throttle(function () {
            this.$update();
        }.bind(this), _config.delay);
        $m.$addEvent(window, _resizeEvt, _resizeFn);
    };

    $m.$tpl = $m.$module.$extend({
        $init: function (param) {

            if (param && $m.$isObject(param)) {
                $m.$forIn(param, function (value, key) {
                    this[key] = value;
                }, this);
            }

            if (!!this['watchHash']) {
                var _hashFn = function () {
                    var _hash = $m.$hash(), _path = _hash.match(/(!\/.+\?)/);
                    if (_path) this.data.iModalJs_URI = _path[0].slice(2, -1);
                    _hash = $m.$s2o(!_path ? _hash : _hash.replace(_path[1], ''));
                    $m.$forIn(_hash, function (value, key) {
                        this.data[key] = value;
                    }, this);
                }.bind(this);
                $m.$watchHash(_hashFn);
                _hashFn();
            }

            var _fn = this.init;
            var _handler = new TPL_Parser(this.template);
            this.$update = _handler.apply(this, [$m]);
            console.log(_handler);

            if (!!this['responsive']) _addResponsive.call(this);
            if (_fn && $m.$isFunction(_fn)) _fn.apply(this, arguments);

            this.$on('update', this.$update);
        },

        $inject: function (parentNode) {
            if (!parentNode) _ERROR('$tpl: Inject function need a parentNode!');
            var _target = parentNode.nodeType == 1 ? parentNode : $m.$get(parentNode)[0];
            if (!_target) _ERROR('$tpl: Inject node is not found!');
            _target.appendChild(this.$update());
            return this;
        }
    });

    /*!
     * iModalJs Module Component
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

    // If the module has dependencies, the first argument should be an array of dependency names,
    // and the second argument should be a definition function.
    // The function will be called to define the module once all dependencies have loaded.
    // The function should return an object that defines the module.
    $m.$define = (function () {
        // The _runningScript() method can find running script. (for IE)
        var _runningScript = function () {
            var _list = _doc.getElementsByTagName('script');
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

    // Define and iModalJs init function
    var _init = function () {
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
    };

    // The _parsePlugin() method can determine whether a file is meet selective options.
    var _parsePlugin = (function () {
        // map of sustaining file type
        var _fMap = {
            $tpl: function (url) {
                _loadText(url, 'text');
            },
            $text: function (url) {
                _loadText(url, 'text');
            },
            $json: function (url) {
                _loadText(url, 'json');
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
                return eval(_res.join('&&').replace(/'/g, ''));
            })();
        };
        return function (_uri) {
            var _brr = [],                                                  // return array
                _sOption = null,                                            // samd selective option
                _negation = false,                                          // negation selective flag
                _arr = _uri.split('!'),                                     // target array
                _target = _arr[0],                                          // samd selective target
                _reg = /\$[^><=!]+/,                                        // parse version regexp
                _fun = _fMap[_target.toLowerCase()];                        // define module's callback function
            if (_arr.length > 1 && !_config.sites[_target] && !_config.paths[_target]) {
                var _temp = _arr.shift(),
                    _sys = _target.match(_reg)[0];
                // determine whether is a negation selective.
                if (_target.indexOf('^') == 0) {
                    _negation = true;
                    _target = _target.substring(1);
                }
                // load function to assignment
                if ($m.$sys[_sys] && _parseVersion(_target, _sys)) _fun = _negation ? _NOOP : null;
                else if (!_fun) _fun = _negation ? null : _NOOP;
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
                _define.apply(_win, _args);
                _args = _dStack.pop();
            }
        };
        return function () {
            var _list = _doc.getElementsByTagName('script');
            for (var i = _list.length - 1, script; i >= 0; i--) {
                script = _list[i];
                if (script.src && !script.iModal) {
                    script.iModal = !0;
                    script.src ? _scriptListener(_list[i]) : _clearStack();
                }
            }
        }
    })();

    // The _loadText() method can load text by url, and put result in callback function.
    var _loadText = function (url, type, callback) {
        if (!url || _sCache[url] != null) return;
        _sCache[url] = 0;
        $m.$ajax({
            url: url,
            dataType: type,
            success: function (data) {
                _sCache[url] = 2;
                _rCache[url] = data || '';
                if (!!callback) callback(data);
                _checkLoading();
            }
        })
    };

    // The _loadScript() method can load script by url.
    var _loadScript = function (url) {
        if (!url) return;
        var _state = _sCache[url];
        if (_state != null) return;
        _sCache[url] = 0;
        // load file
        var _script = $m.$create('script');
        _script.iModal = !0;
        _script.type = 'text/javascript';
        _script.charset = _config.charset;
        _scriptListener(_script);
        _script.src = url;
        (_doc.getElementsByTagName('head')[0] || _doc.body).appendChild(_script);
    };

    // The _jsLoaded() method can recover script when it's loaded.
    var _jsLoaded = function (script) {
        var _uri = $m.$parseURI(script.src);
        if (!_uri) return;
        var _arr = _dStack.pop();

        if (!!_arr) {
            _arr.unshift(_uri);
            _define.apply(_win, _arr);
        }
        // change state
        if (!!_uri && _sCache[_uri] != 1) _sCache[_uri] = 2;

        _checkLoading();
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
                // blew IE9 check for depends resource loaded
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
        }

        // check whether all files are loaded
        function _isFinishLoaded() {
            for (var x in _sCache) if (_sCache.hasOwnProperty(x) && _sCache[x] === 0) return !1;
            return !0;
        }

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
                var _itemFn = _circular() || _iList.pop();
                _execFn(_itemFn);
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
                _dep.forEach(function (value) {
                    _arr.push(_rCache[value] || false);
                });
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
                    $m.$forIn(_result, function (value, key) {
                        _ret[key] = value;
                    });
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
            console.log('iModalJs: ' + _item.n);
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
            // load dependence
            var _iMap = {n: _uri, d: _deps, f: _callback};
            _iList.push(_iMap);
            var _list = _iMap.d;
            if (!!_list && !!_list.length) {
                for (var k = 0, j = _list.length, _itt, _itm, _arr; k < j; k++) {
                    _itt = _list[k];
                    if (!_itt) return;
                    // 0-url 1-load function 2-resource type
                    _arr = _parsePlugin(_itt);
                    _itm = $m.$parseURI(_arr[0], _uri, _arr[2]);
                    _list[k] = _itm;
                    _arr[1](_itm);
                }
            }
            _checkLoading();
        };
    })();

    // iModalJs start
    _init();
})
(document, window);
//]]>