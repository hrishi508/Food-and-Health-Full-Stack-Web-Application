/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * Utility to detect browser size and change based on same queries as
 * in mixins/helpers/_media.scss
 */

function find(arr, fn) {
    if (arr && 'length' in arr) {
        for (var i = 0, ii = arr.length; i < ii; i++) {
            var result = fn(arr[i], i);
            if (result) return result;
        }
    }

    return null;
}

var RULE_SELECTOR_PREFIX = '.is-hidden--';

/**
 * Searches stylesheet for rule with given selector and returns media query used
 *
 * @param {string} selector CSS selector
 * @returns {string} Media query
 * @protected
 */
function getQueryFromStylesheets(selector) {
    var result = null;

    find(document.styleSheets, function (stylesheet) {
        var rules = [];

        try {
            rules = stylesheet.rules || stylesheet.cssRules;
        } catch (error) {
            // If stylesheet file is from different origin (eg. Google Fonts API), then
            // Firefox will throw security error
        }

        return find(rules, function (rule) {
            var index = rule.cssText.indexOf(selector);

            if (index !== -1) {
                var char = rule.cssText[index + selector.length];

                if (char in { ' ': 1, '{': 1, ',': 1, '\n': 1 }) {
                    if (rule.type !== 4) {
                        rule = rule.parentRule; // Older IE10, IE11 have media rule as parent
                    }

                    if (rule.media && rule.media.length && rule.media[0]) {
                        result = rule.media[0]; // Modern browsers

                        for (var i = 1; i < rule.media.length; i++) {
                            if (rule.media[i]) result += ', ' + rule.media[i];
                        }
                    } else if (rule.media && rule.media.mediaText) {
                        result = rule.media.mediaText; // IE10, IE11 have media text
                    }

                    return true;
                }
            }
        });
    });

    return result;
}

// Media query cache
var queries = {};

/**
 * Returns query from size name
 * Searches for .is-hidden--XXX classname
 *
 * @param {string} size Size name
 * @returns {?object} Media query object
 * @protected
 */
function getQuery(size) {
    var query = queries[size];

    if (query === null) {
        return null;
    } else if (!query) {
        query = queries[size] = getQueryFromStylesheets(RULE_SELECTOR_PREFIX + size);

        if (query !== null) {
            query = queries[size] = matchMedia(query);
        } else if (isValidQuery(size)) {
            query = queries[size] = matchMedia(size);
        }
    }

    return query;
}

/**
 * Returns if media query is valid
 *
 * @protected
 */
function isValidQuery(query) {
    var media = matchMedia(query);

    // 'not all' is reported by all browsers, tested on IE10+, Safari, FF, Chrome
    return !media || media.media === 'not all' ? false : true;
}

/**
 * Add media query change listener
 *
 * @param {string} size Size name or media query
 * @param {function} listener Callback function
 */
function on(size, listener) {
    var query = getQuery(size);

    if (query) {
        query.addListener(listener);
    }
}

/**
 * Add listener for event when media query matches
 *
 * @param {string} size Size name or media query
 * @param {function} listener Callback function
 */
function enter(size, listener) {
    on(size, function (mq) {
        if (mq.matches) {
            listener.call(this, mq);
        }
    });

    var query = getQuery(size);
    if (query && query.matches) {
        listener.call(query, query);
    }
}

/**
 * Add listener for event when media query doesn't match anymore
 *
 * @param {string} size Size name or media query
 * @param {function} listener Callback function
 */
function leave(size, listener) {
    on(size, function (mq) {
        if (!mq.matches) {
            listener.call(this, mq);
        }
    });

    var query = getQuery(size);
    if (query && !query.matches) {
        listener.call(query, query);
    }
}

/**
 * Checks if media query with given name matches
 *
 * @param {string} size Size name or media query
 * @returns {boolean} True if media query matches, otherwise false
 */
function matches(size) {
    var query = getQuery(size);
    return query ? query.matches : false;
}

exports.default = { on: on, enter: enter, leave: leave, matches: matches };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _scroller = __webpack_require__(7);

var _scroller2 = _interopRequireDefault(_scroller);

var _hoverSupport = __webpack_require__(2);

var _hoverSupport2 = _interopRequireDefault(_hoverSupport);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Header menu height on mobile
 */

var HEADER_MOBILE_HEIGHT = 60;

/*
 * On touch devices there is no scrollbar, we use this feature to
 * detect if we need to use custom scroller
 *
 * We disable custom scroller on touch devices for performance reasons,
 * on touch devices is a momentum scrolling, so this feature is not very useful
 */
var useCustomScroller = _hoverSupport2.default.hasHoverSupport() && !_hoverSupport2.default.isSamsungGalaxyS8Up();

var scroller = null;
var $content = $('.js-scroller-content');

if (useCustomScroller && $content.length) {
    $('html').addClass('with-scroller');
    window.scroller = window.scroller || new _scroller2.default($('body'), $content);
    scroller = window.scroller;
} else {
    scroller = $(window);

    /*
     * In Scroller we have a special function which returns element offset,
     * which does some trickery to return correct offset, this one is for compatibility
     */
    scroller.getViewOffset = function (element) {
        return $(element).offset();
    };

    /*
     * To be consistent with Scroller we trigger resize event on image load
     */
    $(document).find('img').off('.scroller').on('load.scroller', (0, _lodash2.default)(function () {
        $(this).trigger('resize');
    }, 60));

    /*
     * On mobile there is an accordion, we must open accordion element if there is
     * a matching hash in url
     */
    var hash = (document.location.hash || '').replace('#', '');
    if (hash) {
        /*
         * Needed, because code is executed immediately upon module
        * import before exported "scroller" object is used inside
        * "document.ready".
         */
        $(document).ready(function () {
            scrollToElement(hash);
        });
    }
}

/*
 * Hash link navigation
 */
function expandScrollTarget(hash) {
    var isMobile = _responsive2.default.matches('sm-down');
    var $target = $('#' + hash);

    // Open accordion item on mobile
    if (isMobile && $target.is('.js-accordion-content, .js-accordion-header')) {
        $target.closest('.js-accordion').mobileAccordion('expand', '#' + hash /* selector */, false /* animate */);
    }
}

function scrollToElement(hash, event) {
    var isMobile = _responsive2.default.matches('sm-down');
    var headerHeight = isMobile ? HEADER_MOBILE_HEIGHT : 0;
    var $target = $('#' + hash);
    var $prevTarget = $target.prev();
    var offset = null;

    // Open accordion item on mobile
    expandScrollTarget(hash);

    // Find element offset
    if ($target.length) {
        // For mobile accordion scroll to item's header instead of body.
        if ($prevTarget.hasClass('js-accordion-header') && $prevTarget.is(':visible')) {
            $target = $prevTarget;
        }

        offset = scroller.getViewOffset($target).top;
    }

    if (offset !== null) {
        if (event) {
            event.preventDefault();
        }

        // Scroll to item
        if (useCustomScroller) {
            // Perform scrolling on desktop.
            scroller.scrollTo(offset);
        } else {
            // Perform scrolling on mobile/tablet.
            $('html, body').animate({
                scrollTop: offset - headerHeight
            }, $.durationNormal, 'easeInOutQuad');
        }
    }
}

$(document).off('.scroller').on('click.scroller', 'a[href*="#"]', function (event) {
    var hash = $(this).attr('href').replace(/.*#/, '');
    scrollToElement(hash, event);
});

exports.default = scroller;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _scrollbarSize = __webpack_require__(6);

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REGEX_MOBILE_OS = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
var REGEX_TABLET_OS = /android|ipad|playbook|silk/i;
var REGEX_MOBILE_LEGACY = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

/**
 * Check for hover support
 *
 * @returns {boolean} True if hover is supported, otherwise false
 */

function hasHoverSupport() {
    var hasHoverSupport = void 0;

    if (matchMedia('(any-hover: hover)').matches || matchMedia('(hover: hover)').matches) {
        hasHoverSupport = true;
    } else if (matchMedia('(hover: none)').matches) {
        hasHoverSupport = false;
    } else if (isIE() && (0, _scrollbarSize2.default)()) {
        // On touch devices scrollbar width is usually 0
        hasHoverSupport = true;
    } else if (isMobile()) {
        hasHoverSupport = false;
    } else {
        hasHoverSupport = "undefined" == typeof document.documentElement.ontouchstart;
    }

    return function () {
        return hasHoverSupport;
    };
};

/**
 * Check if current browser is Internet Explorer
 *
 * @returns {boolean} True if current browser is Internet Explorer, otherwise false
 */
function isIE() {
    var ua = navigator.userAgent;
    return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
}

function isOldIE() {
    var ua = navigator.userAgent;
    return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0;
}

/**
 * Check if current device is mobile device
 *
 * @returns {boolean} True if current device is mobile, otherwise false
 */
function isMobile() {
    return isPhone() || isTablet();
}

function isPhone() {
    var agent = navigator.userAgent || navigator.vendor || window.opera;
    return REGEX_MOBILE_OS.test(agent) || REGEX_MOBILE_LEGACY.test(agent.substr(0, 4));
}

function isTablet() {
    var agent = navigator.userAgent || navigator.vendor || window.opera;
    return REGEX_TABLET_OS.test(agent);
}

function isSamsungGalaxyS8Up() {
    return navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.match(/SM-G([\d]+)F/) && parseInt(RegExp.$1) > 930;
}

exports.default = {
    hasHoverSupport: hasHoverSupport(),
    isIE: isIE,
    isOldIE: isOldIE,
    isMobile: isMobile,
    isPhone: isPhone,
    isTablet: isTablet,
    isSamsungGalaxyS8Up: isSamsungGalaxyS8Up
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function now() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Component, which keeps content in view while user scrolls
 * It's possible to constrain content to some element
 */
var InCenter = function () {
    _createClass(InCenter, null, [{
        key: 'Defaults',
        get: function get() {
            return {
                // Element against which to check, by default against viewport
                element: null,

                // Element alignment, 'top', 'bottom' or 'center'
                align: 'center',

                // Position when state is active, by default if center points at element
                // 'before' if center points at element or before
                // 'after' if center points at element or after
                compare: 'element',

                // Offset in px
                offset: 0,

                onactive: null,
                oninactive: null,

                onprogress: null
            };
        }
    }]);

    function InCenter(el, opts) {
        _classCallCheck(this, InCenter);

        var options = this.options = $.extend({}, this.constructor.Defaults, opts);
        this.$element = options.element ? $(options.element) : null;
        this.$fixed = $('.fixed-position-detection-fix');
        this.$container = $(el);

        this.constraints = [];
        this.updateConstraints();

        _scroller2.default.on('resize', this.updateConstraints.bind(this));
        _scroller2.default.onpassive('scroll', this.update.bind(this));
    }

    /**
     * Collect constraint data
     *
     * @returns {object} Constraint information
     * @protected
     */


    _createClass(InCenter, [{
        key: 'getConstraints',
        value: function getConstraints() {
            var options = this.options;
            var $container = this.$container;
            var $element = this.$element;
            var constraints = this.constraints;
            var viewheight = window.innerHeight;
            var align = options.align === 'top' ? 0 : options.align === 'bottom' ? 1 : 0.5;
            var offset = options.offset;

            if ($element) {
                offset += this.getElementOffset() + $element.outerHeight() * align;
            } else {
                offset += viewheight * align;
            }

            return $.map($container, function (container, index) {
                var $container = $(container);

                return {
                    'top': _scroller2.default.getViewOffset($container).top - offset,
                    'height': $container.outerHeight(),
                    'active': constraints[index] ? constraints[index].active : false,
                    'element': $container
                };
            });
        }
    }, {
        key: 'getElementOffset',
        value: function getElementOffset() {
            return this.$element.get(0).getBoundingClientRect().top - this.$fixed.get(0).getBoundingClientRect().top;
        }

        /**
         * Cache constraint information
         */

    }, {
        key: 'updateConstraints',
        value: function updateConstraints() {
            this.constraints = this.getConstraints();
            this.update();
        }

        /**
         * Reposition element
         */

    }, {
        key: 'update',
        value: function update() {
            var scroll = _scroller2.default.scrollTop();
            var constraints = this.constraints;
            var options = this.options;
            var compare = options.compare;

            for (var i = 0, ii = constraints.length; i < ii; i++) {
                var constraint = constraints[i];

                if ((compare === 'before' || scroll >= constraint.top) && (compare === 'after' || scroll < constraint.top + constraint.height)) {
                    if (!constraint.active) {
                        constraint.active = true;

                        if (options.onactive) {
                            options.onactive(constraint.element);
                        }
                    }
                } else {
                    if (constraint.active) {
                        constraint.active = false;

                        if (options.oninactive) {
                            options.oninactive(constraint.element);
                        }
                    }
                }

                if (options.onprogress) {
                    options.onprogress(constraint, scroll);
                }
            }
        }
    }]);

    return InCenter;
}();

exports.default = InCenter;


$.fn.incenter = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    new InCenter(this, options);
    return this;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ease;
/**
 * Ease component animates a value and calls a callback with new value on each
 * animation frame
 *
 * Unlike standard animations this ease doesn't have a duration and can have
 * target value changing frequently without braking
 *
 * Animation values change as if ease-out would be used
 *
 * @param {object} opts Options
 * @param {number} opts.factor How fast value approaches to target value; from 0 (slow) to 1 (fast)
 * @param {number} opts.precision Value precision, to improve performance precision is used to throttle callback calls
 * @param {function} opts.complete Complete callback, called when value matches target value
 * @param {function} callback Callback function, which is called on each frame
 * @returns {function} Setter function, which should be used to set target value
 *
 * @example
 *     var setter = ease({}, function (value) { console.log(value) });
 *     setter(0);   // first time initial value is set, will not trigger animation
 *     setter(100); // console will output values from 0 to 100, slowing down at the end
 */

function ease() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];

    var options = _extends({ factor: 0.5, precision: 0.01, complete: null }, opts);

    var valueFrom = null;
    var valueTo = null;
    var isInitiated = false;
    var isRunning = false;

    var value = null;
    var valueTarget = null;

    var step = function step() {
        var delta = null;
        var smoothComplete = false;

        if (isInitiated) {
            delta = (valueTarget - value) * options.factor;

            value = value + delta;
            smoothComplete = Math.abs(valueTarget - value) < options.precision;

            if (smoothComplete) {
                setValue.value = valueTarget;

                callback(valueTarget);

                if (options.complete) {
                    options.complete();
                }

                setValue.running = isRunning = false;
                return;
            }

            if (delta) {
                setValue.value = value;
                callback(value);
            }
        }

        requestAnimationFrame(step);
    };

    var setValue = function setValue(valueCurrent) {
        if (!isInitiated) {
            isInitiated = true;
            setValue.value = setValue.valueTarget = value = valueCurrent;
        }

        setValue.valueTarget = valueTarget = valueCurrent;

        if (!isRunning) {
            setValue.running = isRunning = true;
            step();
        }
    };

    setValue.reset = function (valueCurrent) {
        isInitiated = true;
        setValue.value = setValue.valueTarget = value = valueTarget = valueCurrent;
    };

    setValue.running = false;
    setValue.value = null;
    setValue.valueTarget = null;

    return setValue;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getScrollbarSize;
/**
 * Measures scrollbar size
 *
 * @returns {number} Scrollbar size in pixels
 */

function getScrollbarSize() {
    var $outer = $('<div>').css({ 'position': 'absolute', 'top': '0px', 'left': '-1000px', 'visibility': 'hidden', 'width': '200px', 'height': '150px', 'overflow': 'hidden' }).appendTo('body');
    var $inner = $('<p>').css({ 'width': '100%', 'height': '200px' }).appendTo($outer);

    var w1 = $inner.get(0).offsetWidth;

    $outer.css('overflow', 'scroll');
    var w2 = $inner.get(0).offsetWidth;

    if (w1 == w2) w2 = $outer.get(0).clientWidth;
    $outer.remove();

    return w1 - w2;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ease = __webpack_require__(5);

var _ease2 = _interopRequireDefault(_ease);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Scroller is a component, which on non-touch devices replaces native content
 * scroll with smooth custom scroll
 *
 * Public methods:
 *   - on(eventName, callback)
 *       Attach event listener
 *
 *   - off(eventName, callback)
 *       Detach event listener
 *
 *   - scrollTo(scroll)
 *       Scroll to position
 *
 *   - scrollToElement(element)
 *       Scroll to element
 *
 *   - scrollTop()
 *       Returns scroll position
 *
 * @class Scroller
 */
var Scroller = function () {
    function Scroller($container, $content) {
        _classCallCheck(this, Scroller);

        this.custom = true;

        this.$container = $container;
        this.$content = $content;

        this.contentHeight = 0;
        this.viewportHeight = 0;

        this.listeners = { 'resize': [], 'scroll': [] };
        this.scroll = (0, _ease2.default)({ factor: 0.1, precision: 0.5 }, this.update.bind(this));

        this.handleResizeDebounced = (0, _lodash2.default)(this.handleResize.bind(this), 60);

        $(window).on('resize', this.handleResizeDebounced);
        $(window).onpassive('scroll', this.handleScroll.bind(this));

        // $container.find('img').on('load', this.handleResizeDebounced);
        $container.on('appear', this.handleResizeDebounced);

        this.handleResize();

        // Scrolling for desktop only.
        if (document.location.hash && document.location.hash !== '#introduction') {
            // If we have a hash, then scroll to it
            this.scrollToElement($(document.location.hash));
        } else {
            // Set current position
            this.scroll($(window).scrollTop());
        }

        $container.on('click', 'a[href*="#"]', this.handleHashLinkClick.bind(this));
    }

    /*
     * Events
     * ------------------------------------------------------------------------
     */

    /**
     * Add event listener
     *
     * @param {string} eventName Event which to listen to
     * @param {function} callback Callback function
     */


    _createClass(Scroller, [{
        key: 'on',
        value: function on(eventName, callback) {
            var listeners = this.listeners;

            listeners[eventName] = listeners[eventName] || [];
            listeners[eventName].push(callback);
        }

        /**
         * Remove event listener
         *
         * @param {string} eventName Event name
         * @param {function} callback Callback function
         */

    }, {
        key: 'off',
        value: function off(eventName, callback) {
            var listeners = this.listeners[eventName] || [];

            for (var i = 0, ii = listeners.length; i < ii; i++) {
                if (listeners[i] === callback) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * Trigger event listeners
         *
         * @param {string} eventName Event name
         * @protected
         */

    }, {
        key: 'trigger',
        value: function trigger(eventName) {
            var callbacks = this.listeners[eventName] || [];
            var data = {
                'contentHeight': this.contentHeight,
                'viewportHeight': this.viewportHeight,
                'scrollTop': this.scroll.value
            };

            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](data);
            }
        }

        /**
         * Add pasive event listener
         *
         * @param {string} eventName Event which to listen to
         * @param {function} callback Callback function
         */

    }, {
        key: 'onpassive',
        value: function onpassive(eventName, callback) {
            this.on(eventName, callback);
        }

        /**
         * Remove pasive event listener
         *
         * @param {string} eventName Event name
         * @param {function} callback Callback function
         */

    }, {
        key: 'offpassive',
        value: function offpassive(eventName, callback) {
            this.off(eventName, callback);
        }

        /*
         * Content offset
         * ------------------------------------------------------------------------
         */

    }, {
        key: 'getViewOffset',
        value: function getViewOffset(element) {
            var rect = $(element).get(0).getBoundingClientRect();
            var offset = this.$content.get(0).getBoundingClientRect();

            return {
                'left': rect.left - offset.left,
                'top': rect.top - offset.top
            };
        }

        /*
         * Scrolling
         * ------------------------------------------------------------------------
         */

        /**
         * On hash link click go to the position
         *
         * @param {object} event Event
         * @protected
         */

    }, {
        key: 'handleHashLinkClick',
        value: function handleHashLinkClick(event) {
            var hash = $(event.target).closest('a').attr('href').replace(/.*#/, '');
            var $target = $('#' + hash);

            if ($target.length) {
                event.preventDefault();
                this.scrollToElement($target);
            }
        }

        /**
         * Scroll to specific position
         *
         * @param {number} scroll Scroll position
         */

    }, {
        key: 'scrollTo',
        value: function scrollTo(scroll) {
            var max = Math.max(this.contentHeight - this.viewportHeight, 0);
            $(window).scrollTop(Math.min(Math.max(scroll, 0), max));
        }

        /**
         * Scroll to specific element
         *
         * @param {object} $element Element which to scroll to
         */

    }, {
        key: 'scrollToElement',
        value: function scrollToElement($element) {
            if ($element.length) {
                var scroll = this.getViewOffset($element).top;
                this.scrollTo(scroll);
            }
        }

        /**
         * Returns current scroll position
         *
         * @returns {number} Current scroll position
         */

    }, {
        key: 'scrollTop',
        value: function scrollTop() {
            return this.scroll.value;
        }

        /**
         * Handle window resize
         * Update cached sizes, resize container, trigger events
         *
         * @protected
         */

    }, {
        key: 'handleResize',
        value: function handleResize() {
            this.contentHeight = this.$content.height();
            this.viewportHeight = $(window).height();

            this.$container.height(this.contentHeight);
            this.trigger('resize');
        }

        /**
         * Handle native scroll
         *
         * @protected
         */

    }, {
        key: 'handleScroll',
        value: function handleScroll() {
            var scroll = $(window).scrollTop();
            this.scroll(scroll);
        }

        /**
         * Update content position
         *
         * @param {number} scroll Scroll position
         * @protected
         */

    }, {
        key: 'update',
        value: function update(scroll) {
            this.$content.css('transform', 'translateY(' + -scroll + 'px)');
            this.trigger('scroll');
        }
    }, {
        key: 'handleImageLoad',
        value: function handleImageLoad() {}
    }]);

    return Scroller;
}();

exports.default = Scroller;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = factory(require, exports, module);
    } else {
        root.CountUp = factory();
    }
})(undefined, function (require, exports, module) {

    /*
    
        countUp.js
        by @inorganik
    
    */

    // target = id of html element or var of previously selected html element where counting occurs
    // startVal = the value you want to begin at
    // endVal = the value you want to arrive at
    // decimals = number of decimal places, default 0
    // duration = duration of animation in seconds, default 2
    // options = optional object of options (see below)

    var CountUp = function CountUp(target, startVal, endVal, decimals, duration, options) {

        // make sure requestAnimationFrame and cancelAnimationFrame are defined
        // polyfill for browsers without native support
        // by Opera engineer Erik Möller
        var lastTime = 0;
        var vendors = ['webkit', 'moz', 'ms', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

        var self = this;

        // default options
        self.options = {
            useEasing: true, // toggle easing
            useGrouping: true, // 1,000,000 vs 1000000
            separator: ',', // character to use as a separator
            decimal: '.', // character to use as a decimal
            easingFn: null, // optional custom easing closure function, default is Robert Penner's easeOutExpo
            formattingFn: null, // optional custom formatting function, default is self.formatNumber below
            prefix: '', // optional text before the result
            suffix: '' // optional text after the result
        };
        // extend default options with passed options object
        if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            for (var key in self.options) {
                if (options.hasOwnProperty(key)) {
                    self.options[key] = options[key];
                }
            }
        }
        if (self.options.separator === '') {
            self.options.useGrouping = false;
        }

        self.version = function () {
            return '1.8.2';
        };

        self.d = typeof target === 'string' ? document.getElementById(target) : target;
        self.startVal = Number(startVal);
        self.endVal = Number(endVal);
        self.countDown = self.startVal > self.endVal;
        self.frameVal = self.startVal;
        self.decimals = Math.max(0, decimals || 0);
        self.dec = Math.pow(10, self.decimals);
        self.duration = Number(duration) * 1000 || 2000;

        self.formatNumber = function (nStr) {
            nStr = nStr.toFixed(self.decimals);
            nStr += '';
            var x, x1, x2, rgx;
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? self.options.decimal + x[1] : '';
            rgx = /(\d+)(\d{3})/;
            if (self.options.useGrouping) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
                }
            }
            return self.options.prefix + x1 + x2 + self.options.suffix;
        };
        // Robert Penner's easeOutExpo
        self.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };

        self.easingFn = self.options.easingFn ? self.options.easingFn : self.easeOutExpo;
        self.formattingFn = self.options.formattingFn ? self.options.formattingFn : self.formatNumber;

        // Print value to target
        self.printValue = function (value) {
            var result = self.formattingFn(value);

            if (self.d.tagName === 'INPUT') {
                this.d.value = result;
            } else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
                this.d.textContent = result;
            } else {
                this.d.innerHTML = result;
            }
        };

        self.count = function (timestamp) {

            if (!self.startTime) {
                self.startTime = timestamp;
            }

            self.timestamp = timestamp;
            var progress = timestamp - self.startTime;
            self.remaining = self.duration - progress;

            // to ease or not to ease
            if (self.options.useEasing) {
                if (self.countDown) {
                    self.frameVal = self.startVal - self.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
                } else {
                    self.frameVal = self.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
                }
            } else {
                if (self.countDown) {
                    self.frameVal = self.startVal - (self.startVal - self.endVal) * (progress / self.duration);
                } else {
                    self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
                }
            }

            // don't go past endVal since progress can exceed duration in the last frame
            if (self.countDown) {
                self.frameVal = self.frameVal < self.endVal ? self.endVal : self.frameVal;
            } else {
                self.frameVal = self.frameVal > self.endVal ? self.endVal : self.frameVal;
            }

            // decimal
            self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

            // format and print value
            self.printValue(self.frameVal);

            // whether to continue
            if (progress < self.duration) {
                self.rAF = requestAnimationFrame(self.count);
            } else {
                if (self.callback) {
                    self.callback();
                }
            }
        };
        // start your animation
        self.start = function (callback) {
            self.callback = callback;
            self.rAF = requestAnimationFrame(self.count);
            return false;
        };
        // toggles pause/resume animation
        self.pauseResume = function () {
            if (!self.paused) {
                self.paused = true;
                cancelAnimationFrame(self.rAF);
            } else {
                self.paused = false;
                delete self.startTime;
                self.duration = self.remaining;
                self.startVal = self.frameVal;
                requestAnimationFrame(self.count);
            }
        };
        // reset to startVal so animation can be run again
        self.reset = function () {
            self.paused = false;
            delete self.startTime;
            self.startVal = startVal;
            cancelAnimationFrame(self.rAF);
            self.printValue(self.startVal);
        };
        // pass a new endVal and start animation
        self.update = function (newEndVal) {
            cancelAnimationFrame(self.rAF);
            self.paused = false;
            delete self.startTime;
            self.startVal = self.frameVal;
            self.endVal = Number(newEndVal);
            self.countDown = self.startVal > self.endVal;
            self.rAF = requestAnimationFrame(self.count);
        };

        // format startVal on initialization
        self.printValue(self.startVal);
    };

    return CountUp;
});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

__webpack_require__(21);

__webpack_require__(15);

__webpack_require__(4);

__webpack_require__(16);

__webpack_require__(46);

__webpack_require__(47);

__webpack_require__(27);

__webpack_require__(29);

__webpack_require__(42);

__webpack_require__(44);

__webpack_require__(38);

__webpack_require__(39);

__webpack_require__(43);

__webpack_require__(41);

__webpack_require__(40);

__webpack_require__(35);

__webpack_require__(36);

__webpack_require__(33);

__webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MOBILE_HEADER_OFFSET = 61;

$(function () {

    $('.js-parallax').parallax();
    $('img[data-src], .js-appear').appear();
    $('.js-projects').projects();
    $('.js-countup').countup();

    // Fixed element UI theme change when user scrolls
    $('.screen[data-ui], .js-screen[data-ui]').each(function (index) {
        $(this).data('index', index);
    });

    $('.js-apply-ui').each(function (i, element) {
        var $element = $(element);
        var $screens = $('.screen[data-ui], .js-screen[data-ui]');
        var offset = 0;

        // Since hash navigation scrolls content so that it starts below the header
        // not at the screen start, we need to adjust offset so that UI style for header
        // is also applied using same logic
        if ($element.is('.js-header') && _responsive2.default.matches('sm-down')) {
            offset = MOBILE_HEADER_OFFSET;
        }

        $screens.incenter({
            'offset': offset,
            'element': $element,
            'onactive': function onactive($screen) {
                var ui = $screen.data('ui');
                var index = $screen.data('index');

                $element.removeClass('ui-light ui-dark ui-1').addClass('ui-' + ui + ' ui-' + (index + 1));
            },
            'oninactive': function oninactive($screen) {
                var index = $screen.data('index');

                $element.removeClass('ui-' + (index + 1));
            }
        });
    });
});

/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Ajax form
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Form is validated on client-side and then data is sent to server-side, after
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * which either error messages are shown or success message is shown
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

__webpack_require__(22);

__webpack_require__(28);

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxForm = function () {
    _createClass(AjaxForm, null, [{
        key: 'Defaults',
        get: function get() {
            return {
                'formSuccessRedirect': false
            };
        }
    }]);

    function AjaxForm(container) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, AjaxForm);

        var options = this.options = $.extend({}, this.constructor.Defaults, opts);

        var $container = this.$container = $(container);
        var $form = this.$form = $container.find('form').addBack($container).filter('form');
        var $errorMessage = this.$errorMessage = $form.find('.js-form-error-message');

        this.isLoading = false;

        $form.on('reset', this.reset.bind(this));

        this.validator = $form.validate($.extend({
            submitHandler: this.onsuccess.bind(this),
            invalidHandler: this.onerror.bind(this),
            errorPlacement: this.errorPlacement.bind(this),
            highlight: this.errorHighlight.bind(this),
            unhighlight: this.errorUnhighlight.bind(this)
        }, this.getValidationOptions()));
    }

    /**
     * Returns validation options for form validator
     * See http://jqueryvalidation.org/
     *
     * @returns {object} Validation rules
     * @protected
     */


    _createClass(AjaxForm, [{
        key: 'getValidationOptions',
        value: function getValidationOptions() {
            return {
                'rules': {}
            };
        }

        /**
         * Returns form values
         *
         * @returns {object} Form values
         * @protected
         */

    }, {
        key: 'getFormValues',
        value: function getFormValues() {
            var $form = this.$form;
            return $form.serializeObject();
        }

        /**
         * Reset form
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.validator.resetForm();
            this.hideSuccessMessage();
        }

        /**
         * Disable form
         */

    }, {
        key: 'disable',
        value: function disable() {
            var $form = this.$form;

            // Select elements don't have "readonly" attribute
            $form.find('input, select, textarea').prop('readonly', true).addClass('readonly');
            $form.find('button').prop('disabled', true);
        }

        /**
         * Enable form
         */

    }, {
        key: 'enable',
        value: function enable() {
            var $form = this.$form;

            // Select elements don't have "readonly" attribute
            $form.find('input, select, textarea').prop('readonly', false).removeClass('readonly');
            $form.find('button').prop('disabled', false);
        }

        /*
         * Client-side validation
         * -----------------------------------------------
         */

        /**
         * Handle form submit / client-side validation success
         *
         * @param {object} form Form element
         * @protected
         */

    }, {
        key: 'onsuccess',
        value: function onsuccess(form) {
            var $form = this.$form;
            var valid = $form.valid();

            if (valid) {
                valid = this.validate();
            }

            if (valid) {
                // Client-side validation passed
                this.hideGenericErrorMessage();
                this.submit();
            } else {
                this.showGenericErrorMessage();
                this.hideSuccessMessage();
            }
        }

        /**
         * Handle form validation error
         *
         * @param {object} form Form element
         * @protected
         */

    }, {
        key: 'onerror',
        value: function onerror(form) {
            this.showGenericErrorMessage();
        }

        /**
         * Custom validation
         *
         * @returns {boolean} True if custom validation passes, false otherwise
         * @protected
         */

    }, {
        key: 'validate',
        value: function validate() {
            return true;
        }

        /*
         * Loading state
         * -----------------------------------------------
         */

        /**
         * Set loading state
         *
         * @param {boolean} state Loading state
         */

    }, {
        key: 'setLoading',
        value: function setLoading(state) {
            var $submit = this.$form.find('button[type="submit"], input[type="submit"]');
            $submit.toggleClass('spinner', state);

            this.isLoading = state;
        }

        /*
         * Server-side validation
         * -----------------------------------------------
         */

        /**
         * Submit form data to server
         */

    }, {
        key: 'submit',
        value: function submit() {
            if (this.isLoading) return; // prevent double submit

            var $form = this.$form;
            var values = this.getFormValues();
            var url = $form.attr('action');
            var method = $form.attr('method');

            this.setLoading(true);
            this.disable();

            $.ajax({
                'url': url,
                'method': method,
                'data': values
            }).always(this.handleResponseComplete.bind(this)).done(this.handleResponseSuccess.bind(this, values));
        }

        /**
         * Handle response from server
         *
         * @protected
         */

    }, {
        key: 'handleResponseComplete',
        value: function handleResponseComplete() {
            this.setLoading(false);
            this.enable();
        }

        /**
         * Handle successful request to server
         *
         * @param {object} request Request data
         * @param {object} response Server response
         * @protected
         */

    }, {
        key: 'handleResponseSuccess',
        value: function handleResponseSuccess(request, response) {
            if (response.status && response.status !== 'fail') {
                this.handleSuccess(request, response);
            } else {
                this.handleErrorResponse(response.errors || response.error || []);
            }
        }

        /**
         *  Handle request errors
         *
         * @param {array} errors Errors
         * @protected
         */

    }, {
        key: 'handleErrorResponse',
        value: function handleErrorResponse(errors) {
            var $form = this.$form;

            // Show generic error if there are no messages
            if ($.isEmptyObject(errors)) {
                this.showGenericErrorMessage();
            }

            // Show error messages
            this.setErrors(errors);
        }

        /**
         * Handle success
         *
         * @param {object} request Request data
         * @param {object} response Server response
         * @protected
         */

    }, {
        key: 'handleSuccess',
        value: function handleSuccess(request, response) {
            var options = this.options;

            if (options.formSuccessRedirect) {
                // Redirect
                document.location = options.formSuccessRedirect;
            } else {
                // Show success message
                this.showSuccessMessage(request, response);
            }
        }

        /*
         * Errors
         * -----------------------------------------------
         */

        /**
         * Handle form validation error placement
         * Place error message into DOM
         *
         * @param {object} error Error element
         * @param {object} input Input element
         * @protected
         */

    }, {
        key: 'errorPlacement',
        value: function errorPlacement(error, input) {
            // Error message before input replacing label
            var $parent = input.parent();

            if ($parent.is('.form-control-container')) {
                $parent = $parent.parent();
            }

            $parent.prepend(error);
        }

        /**
         * Returns actual error element
         *
         * @param {object} error Error element
         * @returns {object} Actual error element
         * @protected
         */

    }, {
        key: 'getErrorElement',
        value: function getErrorElement(element) {
            var $element = $(element);

            if ($element.is('select') && $element.next('.selectivity-input')) {
                return $element.next();
            } else {
                return $element;
            }
        }

        /**
         * Returns input label element
         *
         * @param {object} error Error element
         * @returns {object} Label element
         * @protected
         */

    }, {
        key: 'getLabelElement',
        value: function getLabelElement(element) {
            return $(element.form).find('label[for="' + element.id + '"]').not('.error');
        }

        /**
         * Show error highlight on element
         *
         * @param {object} element Element
         * @param {string} errorClass Error classname
         * @param {string} validClass Valid classname
         * @protected
         */

    }, {
        key: 'errorHighlight',
        value: function errorHighlight(element, errorClass, validClass) {
            var $element = this.getErrorElement(element);
            var $label = this.getLabelElement(element);
            var $row = $element.closest('.form-group, .form-row');

            $row.removeClass('has-success').addClass('has-error');
            $element.addClass('form-control--' + errorClass).removeClass('form-control--' + validClass);
            $label.removeClass('form-label--' + errorClass).addClass('is-hidden');

            this.$form.trigger('resize');
        }

        /**
         * Hide error highlight on element
         *
         * @param {object} element Element
         * @param {string} errorClass Error classname
         * @param {string} validClass Valid classname
         * @protected
         */

    }, {
        key: 'errorUnhighlight',
        value: function errorUnhighlight(element, errorClass, validClass) {
            var $element = this.getErrorElement(element);
            var $label = this.getLabelElement(element);
            var $row = $element.closest('.form-group, .form-row');

            $row.removeClass('has-error').addClass('has-success');
            $element.removeClass('form-control--' + errorClass).addClass('form-control--' + validClass);
            $label.removeClass('form-label--' + errorClass).removeClass('is-hidden');

            this.$form.trigger('resize');
        }

        /**
         * Show generic error message
         *
         * @protected
         */

    }, {
        key: 'showGenericErrorMessage',
        value: function showGenericErrorMessage() {
            this.$errorMessage.removeClass('is-hidden');
            this.$form.trigger('resize');
        }

        /**
         * Hide generic error message
         *
         * @protected
         */

    }, {
        key: 'hideGenericErrorMessage',
        value: function hideGenericErrorMessage() {
            this.$errorMessage.addClass('is-hidden');
            this.$form.trigger('resize');
        }

        /**
         * Show custom error messages on input
         *
         * @param {array} errors List of errors
         * @protected
         */

    }, {
        key: 'setErrors',
        value: function setErrors(errors) {
            this.validator.showErrors(errors);
        }

        /*
         * Success message
         * -----------------------------------------------
         */

        /**
         * Show success message and hide content
         *
         * @protected
         */

    }, {
        key: 'showSuccessMessage',
        value: function showSuccessMessage() {
            var $form = this.$form;
            var $hide = $form.find('.js-form-content');
            var $show = $form.find('.js-form-success');

            $hide.addClass('is-hidden');
            $show.removeClass('is-hidden');
            $form.trigger('resize');
        }

        /**
         * Hide sucess message and show content
         *
         * @protected
         */

    }, {
        key: 'hideSuccessMessage',
        value: function hideSuccessMessage() {
            var $form = this.$form;
            var $hide = $form.find('.js-form-success');
            var $show = $form.find('.js-form-content');

            $hide.addClass('is-hidden');
            $show.removeClass('is-hidden');
            $form.trigger('resize');
        }
    }]);

    return AjaxForm;
}();

/*
 * Create jQuery plugin
 */

exports.default = AjaxForm;
$.fn.form = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('ajaxform');

        if (!instance) {
            instance = new AjaxForm($element, opts);
            $element.data('ajaxform', instance);
        }
    });
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

var _hoverSupport = __webpack_require__(2);

var _hoverSupport2 = _interopRequireDefault(_hoverSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMAGE_PRELOAD_DISTANCE = 900;
var IMAGE_LAZY_LOADING = _responsive2.default.matches('sm-down') ? false : true;

/**
 * jQuery plugin to show images and other content using animation
 */

var Appear = function () {
    _createClass(Appear, null, [{
        key: 'Defaults',
        get: function get() {
            return {
                // Distance before image appears to start loading it
                'margin': 100,

                'delay': 0,
                'offset': 30,

                // CSS property which to use to animate
                'property': 'none',

                'duration': 750,
                'easing': 'cubic-bezier(.25,  .74, .22, .99)',

                'callback': null
            };
        }
    }]);

    function Appear(container, opts) {
        _classCallCheck(this, Appear);

        var $container = this.$container = $(container);
        var options = this.options = $.extend({}, this.constructor.Defaults, {
            'margin': $container.data('appearMargin'),
            'delay': $container.data('appearDelay'),
            'offset': $container.data('appearOffset'),
            'property': $container.data('appearProperty'),
            'duration': $container.data('appearDuration')
        }, opts);

        this.inViewport = false;
        this.visible = false;
        this.withSVGPlaceholder = false;
        this.withLazyLoading = $container.is('img, picture') ? IMAGE_LAZY_LOADING : true;

        this.loaded = false; // image is loaded
        this.loading = false; // image is being loaded

        if (options.duration) {
            $container.css('opacity', 0);
        }

        // Bind event listeners to this object to make sure we can unsubscribe / remove listeners
        this.updateConstraints = this.updateConstraints.bind(this);
        this.update = this.update.bind(this);

        _scroller2.default.on('resize', this.updateConstraints);
        _scroller2.default.onpassive('scroll', this.update);

        //
        this.initializeSVGPlaceholder();
        this.updateConstraints();
    }

    /**
     * Change image SRC attribute to invisible SVG which will preserve width / height aspect ratio
     * This is needed to prevent content jumping when image appears
     */


    _createClass(Appear, [{
        key: 'initializeSVGPlaceholder',
        value: function initializeSVGPlaceholder() {
            var $container = this.$container;
            var width = $container.attr('width');
            var height = $container.attr('height');
            var url = $container.attr('src');

            if (width && height && (!url || url.indexOf('px.gif') !== -1)) {
                var html = ('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" preserveAspectRatio="xMinYMax meet" viewBox="0 0 ' + width + ' ' + height + '"></svg>').replace(/</g, '%3C').replace(/>/g, '%3E');

                if (_hoverSupport2.default.isOldIE()) {
                    // IE10 / IE11 doesn't set correct height on image
                    $container.css('height', height);
                }

                $container.attr('src', html);
                this.withSVGPlaceholder = true;

                requestAnimationFrame(function () {
                    $container.trigger('appear');
                });
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _scroller2.default.off('resize', this.updateConstraints);
            _scroller2.default.offpassive('scroll', this.update);

            if (this.$temp) this.$temp.remove();
            this.$container.removeData('appear');
            this.$container = this.$temp = this.options = this.updateConstraints = this.update = null;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.updateConstraints();
        }
    }, {
        key: 'updateConstraints',
        value: function updateConstraints() {
            var offset = _scroller2.default.getViewOffset(this.$container).top - window.innerHeight - this.options.margin;
            var visible = this.visible;

            if (!visible) {
                var display = this.$container.css('display');
                visible = display !== 'none';
            }

            if (this.offset !== offset || this.visible !== visible) {
                this.offset = offset;
                this.visible = visible;
                requestAnimationFrame(this.update.bind(this));
            }
        }
    }, {
        key: 'update',
        value: function update() {
            var scroll = _scroller2.default.scrollTop();

            if (!this.inViewport && this.visible) {
                if (!this.withLazyLoading || scroll >= this.offset) {
                    this.inViewport = true;
                    this.load();
                } else if (scroll > this.offset - IMAGE_PRELOAD_DISTANCE) {
                    this.load();
                }
            }
        }
    }, {
        key: 'load',
        value: function load() {
            var _this = this;

            var $container = this.$container;

            if ($container.is('img')) {
                if (!this.loaded && !this.loading) {
                    this.loading = true;

                    var url = this.$container.data('src');
                    var $temp = this.$temp = $('<img src="' + url + '" alt="" style="position: absolute; left: -9000px;" />').appendTo('body');

                    $temp.one('load error', function () {
                        var heightBefore = $container.height();

                        $container.attr('src', $container.data('src')).css('height', '');
                        _this.$temp.remove();
                        _this.$temp = null;

                        _this.loading = false;
                        _this.loaded = true;

                        if (heightBefore !== $container.height()) {
                            // After changing 'src' image height changed, this is most likely
                            // IE10 / IE11 where "height: auto;"" doesn't work and we set height
                            // manually in initializeSVGPlaceholder
                            $container.trigger('appear');
                        }

                        _this.animate();
                    });
                } else {
                    this.animate();
                }
            } else {
                this.animate();
            }
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this2 = this;

            if (!this.inViewport || this.loading) return;

            var $container = this.$container;
            var options = this.options;
            var offset = options.offset;
            var easing = options.easing;
            var delay = options.delay;
            var duration = options.duration / 1000;

            // Appear animation
            var property = options.property;

            if (duration) {
                // Animate
                $container.css({
                    'transition': 'none'
                });

                if (!property) {
                    var transform = $container.css('transform');

                    if (!transform || transform === 'none') {
                        property = 'transform';
                    } else {
                        var position = $container.css('position');
                        property = position === 'absolute' || position === 'fixed' ? 'margin-top' : 'top';
                    }
                } else if (property === 'none') {
                    property = 'x'; // none would disable transition
                }

                if (property === 'transform') {
                    $container.css('transform', 'translateY(' + offset + 'px)');
                } else if (property === 'margin-top' || property === 'top') {
                    $container.css(property, offset + 'px');
                } else if (property === 'margin-bottom' || property === 'bottom') {
                    // Reverse direction
                    $container.css(property, -offset + 'px');
                }

                if (property === 'top' || property == 'bottom') {
                    // Position
                    $container.css('position', 'relative');
                }

                setTimeout(function () {
                    if (property === 'transform') {
                        $container.css(property, 'translateY(0px)');
                    } else {
                        $container.css(property, '0px');
                    }

                    $container.css({
                        'transition': 'opacity ' + duration + 's ' + easing + ', ' + property + ' ' + duration + 's ' + easing,
                        'opacity': 1
                    }).transitionend().done(function () {
                        $container.css(property, '').css({
                            'transition': '',
                            'position': '',
                            'opacity': ''
                        });

                        if (!_this2.withSVGPlaceholder) {
                            $container.trigger('appear');
                        }
                    });
                }, delay || 16);
            } else {
                // Without animation
                $container.css({
                    'opacity': '',
                    'position': ''
                });

                if (!this.withSVGPlaceholder) {
                    $container.trigger('appear');
                }
            }

            if (options.callback) {
                options.callback($container);
            }

            this.destroy();
        }
    }]);

    return Appear;
}();

$.fn.appear = function () {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};
    var fn = options && typeof options === 'string' ? options : null;

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('appear');

        if (!instance) {
            instance = new Appear($element, $.extend({}, $element.data(), opts));
            $element.data('appear', instance);
        }

        if (fn && typeof instance[fn] === 'function') {
            var _instance;

            (_instance = instance)[fn].apply(_instance, args);
        }
    });
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _countup = __webpack_require__(9);

var _countup2 = _interopRequireDefault(_countup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$.fn.countup = function () {
    return this.each(function () {
        var $element = $(this);

        $element.appear({
            'duration': 0,
            'callback': function callback() {
                var options = $element.data('countup') || {};
                var countup = new _countup2.default($element.get(0), 0, options.end || 0, 0, 2.5, options);
                countup.start();
            }
        });
    });
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$.fn.labelEmpty = function () {
    return this.each(function () {
        $(this).on('change blur', function () {
            $(this).prev('label').toggleClass('form-label--empty', !$(this).val());
        }).on('focus', function () {
            if (!$(this).prop('readonly')) $(this).prev('label').removeClass('form-label--empty');
        });
    });
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Component, which keeps content in view while user scrolls
 * It's possible to constrain content to some element
 */
var InView = function () {
    _createClass(InView, null, [{
        key: 'Defaults',
        get: function get() {
            return {
                // Number of pixels between constraint and content
                margin: 0,

                // Number of pixels between viewport and content
                viewportMargin: 0
            };
        }
    }]);

    function InView(el, opts) {
        _classCallCheck(this, InView);

        this.options = $.extend({}, this.constructor.Defaults, opts);
        this.$container = $(el);
        this.$constraint = this.$container.parent();

        this.updateConstraints();

        _scroller2.default.on('resize', this.updateConstraints.bind(this));
        _scroller2.default.onpassive('scroll', this.update.bind(this));
    }

    /**
     * Collect constraint data
     *
     * @returns {object} Constraint information
     * @protected
     */


    _createClass(InView, [{
        key: 'getConstraints',
        value: function getConstraints() {
            var margin = this.options.margin;
            var $container = this.$container;
            var $constraint = this.$constraint;

            var offset = _scroller2.default.getViewOffset($constraint).top;
            var height = $container.outerHeight();
            var area = $constraint.outerHeight();

            $container.css({
                'position': '',
                'left': '',
                'top': ''
            });

            var rcontainer = $container.get(0).getBoundingClientRect();
            var rconstraint = $constraint.get(0).getBoundingClientRect();

            return {
                'min': offset - margin,
                'max': offset - margin + area - height - margin,
                'left': rcontainer.left,
                'top': rcontainer.top - rconstraint.top
            };
        }

        /**
         * Cache constraint information
         */

    }, {
        key: 'updateConstraints',
        value: function updateConstraints() {
            this.constraints = this.getConstraints();
            requestAnimationFrame(this.update.bind(this));
        }

        /**
         * Reposition element
         */

    }, {
        key: 'update',
        value: function update() {
            var margin = this.options.margin;
            var vMargin = this.options.viewportMargin;
            var constraints = this.constraints;
            var scroll = _scroller2.default.scrollTop() + vMargin;
            var $container = this.$container;

            if (_scroller2.default.custom) {
                var position = Math.min(Math.max(scroll, constraints.min), constraints.max) - constraints.min;

                $container.css({
                    'position': '',
                    'left': '',
                    'top': '',
                    'transform': 'translateY(' + (position + margin) + 'px)'
                });
            } else if (scroll <= constraints.min || scroll >= constraints.max) {
                var _position = Math.min(Math.max(scroll, constraints.min), constraints.max) - constraints.min;

                $container.css({
                    'position': '',
                    'left': '',
                    'top': _position + margin + 'px'
                });
            } else {
                $container.css({
                    'position': 'fixed',
                    'left': constraints.left,
                    'top': constraints.top + vMargin,
                    'transform': ''
                });
            }
        }
    }]);

    return InView;
}();

exports.default = InView;


$.fn.inview = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('inview');

        if (!instance) {
            instance = new InView($element, opts);
            $element.data('inview', instance);
        }
    });
};

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REGEX_CONSTRAINT_NAME = /\-(\d+)\-?(\d+|none)/;
var REGEX_PROPERTY_VALUE = /[\-\d\.]+/g;

/**
 * Element parallax effect
 */

var Parallax = function () {
    _createClass(Parallax, null, [{
        key: 'Defaults',
        get: function get() {
            return {};
        }
    }]);

    function Parallax(container, opts) {
        _classCallCheck(this, Parallax);

        var options = this.options = $.extend({}, this.constructor.Defaults, opts);
        var $container = this.$container = $(container);

        var responsiveConfig = $container.data('parallaxResponsive');

        this.disabled = false;
        this.position = null;
        this.config = this.processConfiguration($container.get(0).dataset);

        if (this.config) {
            this.updateConstraints();

            _scroller2.default.on('resize', this.updateConstraints.bind(this));
            _scroller2.default.onpassive('scroll', this.update.bind(this));

            if (responsiveConfig) {
                for (var breakpoint in responsiveConfig) {
                    var enabled = responsiveConfig[breakpoint];
                    _responsive2.default.enter(breakpoint, enabled ? this.enable.bind(this) : this.disable.bind(this));
                }
            }
        }
    }

    _createClass(Parallax, [{
        key: 'processResponsive',
        value: function processResponsive(config) {
            return config;
        }
    }, {
        key: 'processProperty',
        value: function processProperty(name, value) {
            var values = [];
            var string = String(value).replace(REGEX_PROPERTY_VALUE, function (v) {
                values.push(parseFloat(v));
                return '%d';
            });

            return {
                'property': name,
                'string': string.split('%d'),
                'values': values
            };
        }
    }, {
        key: 'processProperties',
        value: function processProperties(properties) {
            var props = [];

            for (var name in properties) {
                props.push(this.processProperty(name, properties[name]));
            }

            return props;
        }
    }, {
        key: 'processConfiguration',
        value: function processConfiguration(dataset) {
            var c = [];
            var properties = [];

            for (var key in dataset) {
                var name = key.match(REGEX_CONSTRAINT_NAME);
                var value = void 0;

                if (name) {
                    try {
                        value = JSON.parse(dataset[key]);
                    } catch (err) {
                        value = {};
                    }

                    c.push({
                        'viewport': parseFloat(name[1]) / 100,
                        'element': name[2] === 'None' ? null : parseFloat(name[2]) / 100,
                        'properties': this.processProperties(value)
                    });

                    if (!properties.length) {
                        for (var prop in value) {
                            properties.push(prop);
                        }
                    }
                }
            }

            if (c.length === 2) {
                // Set 'will-change' CSS property
                this.$container.css('will-change', properties.join(', '));

                return {
                    'from': c[0],
                    'to': c[1]
                };
            }

            return null;
        }
    }, {
        key: 'updateConstraints',
        value: function updateConstraints() {
            var config = this.config;
            var $container = this.$container.css(this.reset());
            var viewportHeight = window.innerHeight;
            var elementHeight = $container.outerHeight();
            var elementOffset = Math.floor(_scroller2.default.getViewOffset($container).top);

            var from = void 0;
            var to = void 0;

            if (config.from.element === null) {
                from = config.from.viewport * viewportHeight;
            } else {
                from = elementHeight * config.from.element + elementOffset - config.from.viewport * viewportHeight;
            }

            if (config.to.element === null) {
                to = config.to.viewport * viewportHeight;
            } else {
                to = elementHeight * config.to.element + elementOffset - config.to.viewport * viewportHeight;
            }

            if (from > to) {
                // Swap from / to
                var tmp = config.from;
                config.from = config.to;
                config.to = tmp;

                this.constraints = {
                    'from': to,
                    'to': from
                };
            } else {
                this.constraints = {
                    'from': from,
                    'to': to
                };
            }

            this.position = null;
            requestAnimationFrame(this.update.bind(this));
        }
    }, {
        key: 'reset',
        value: function reset() {
            var from = this.config.from.properties;
            var properties = {};

            for (var i = 0, ii = from.length; i < ii; i++) {
                properties[from[i].property] = '';
            }

            return properties;
        }
    }, {
        key: 'interpolate',
        value: function interpolate(position) {
            var config = this.config;
            var properties = {};
            var from = config.from.properties;
            var to = config.to.properties;

            for (var i = 0, ii = from.length; i < ii; i++) {
                var valuesFrom = from[i].values;
                var valuesTo = to[i].values;
                var out = [from[i].string[0]];

                for (var k = 0, kk = valuesFrom.length; k < kk; k++) {
                    out.push((valuesTo[k] - valuesFrom[k]) * position + valuesFrom[k]);
                    out.push(from[i].string[k + 1]);
                }

                properties[from[i].property] = out.join('');
            }

            return properties;
        }
    }, {
        key: 'update',
        value: function update() {
            if (!this.disabled) {
                var scroll = _scroller2.default.scrollTop();
                var constraints = this.constraints;
                var position = Math.min(Math.max((scroll - constraints.from) / (constraints.to - constraints.from), 0), 1);

                if (this.position !== position) {
                    this.position = position;

                    this.$container.css(this.interpolate(position));
                }
            }
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.disabled = true;
            this.$container.css(this.reset());
        }
    }, {
        key: 'enable',
        value: function enable() {
            this.disabled = false;
            this.update();
        }
    }]);

    return Parallax;
}();

$.fn.parallax = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('parallax');

        if (!instance) {
            instance = new Parallax($element, opts);
            $element.data('parallax', instance);
        }
    });
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function reduce(arr, fn, value) {
    var result = value;

    for (var i = 0, ii = arr.length; i < ii; i++) {
        result = fn(result, arr[i]);
    }

    return result;
}

$.fn.serializeObject = function () {
    var $inputs = this.is('form,input,select,textarea') ? this : this.find('form,input,select,textarea');
    var values = $inputs.serializeArray();

    return reduce(values, function (object, item) {
        var value = item.value || item.value === 0 ? item.value : '';

        if (object[item.name] !== undefined) {
            if (!object[item.name].push) {
                object[item.name] = [object[item.name]];
            }

            object[item.name].push(value);
        } else {
            object[item.name] = value;
        }

        return object;
    }, {});
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

var _hoverSupport = __webpack_require__(2);

var _hoverSupport2 = _interopRequireDefault(_hoverSupport);

var _incenter = __webpack_require__(4);

var _incenter2 = _interopRequireDefault(_incenter);

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tabs widget
 */
var Tabs = function () {
    _createClass(Tabs, null, [{
        key: 'Defaults',
        get: function get() {
            return {
                'autoplayDuration': 5000 // 5 seconds
            };
        }
    }]);

    function Tabs(el, opts) {
        _classCallCheck(this, Tabs);

        var options = this.options = $.extend({}, this.constructor.Defaults, {}, opts);

        var $container = this.$container = $(el);
        var $navigation = this.$navigation = $container.find('.js-tabs-nav');
        var $tabs = this.$tabs = $container.find('.js-tabs-tab');

        this.index = 0;
        this.count = $tabs.length;
        this.handleDragMove = this.handleDragMove.bind(this);
        this.dragend = this.dragend.bind(this);
        this.swipeSupport = _responsive2.default.matches('sm-down') || !_hoverSupport2.default.hasHoverSupport();

        // On "Next" button click open next tab
        $navigation.on('click', this.handleNavClick.bind(this));

        // Autoplay
        this.timer = null;

        var updateAutoplay = this.updateAutoplay.bind(this);
        this.incenterBottom = new _incenter2.default($container, { align: 'bottom', compare: 'after', onactive: updateAutoplay, oninactive: updateAutoplay });
        this.incenterTop = new _incenter2.default($container, { align: 'top', compare: 'before', onactive: updateAutoplay, oninactive: updateAutoplay });

        this.updateAutoplay();

        // Auto height
        this.height = null;
        this.syncHeight();
        _scroller2.default.on('resize', this.syncHeight.bind(this));

        // Swipe, only on mobile
        if (this.swipeSupport) {
            $container.on('touchstart', this.handleDragStart.bind(this));
        }
    }

    _createClass(Tabs, [{
        key: 'handleNavClick',
        value: function handleNavClick(e) {
            var $link = $(e.target).closest('.js-tabs-nav');
            var index = this.$navigation.index($link);

            this.stop();
            this.open(index);
        }

        /**
         * Toggle autoplay if tabs widget is in view
         * This is needed to prevent content from changing size / spending resources
         */

    }, {
        key: 'updateAutoplay',
        value: function updateAutoplay() {
            var incenterBottom = this.incenterBottom;
            var incenterTop = this.incenterTop;

            if (incenterTop && incenterBottom) {
                if (incenterTop.constraints[0].active && incenterBottom.constraints[0].active) {
                    this.play();
                } else {
                    this.stop();
                }
            }
        }

        /**
         * Start autoplay
         */

    }, {
        key: 'play',
        value: function play() {
            if (!this.timer) {
                this.timer = setInterval(this.next.bind(this), this.options.autoplayDuration);
            }
        }

        /**
         * Stop autoplay
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.timer = clearInterval(this.timer);
        }

        /**
         * Open next item
         */

    }, {
        key: 'next',
        value: function next() {
            this.open((this.index + 1) % this.count);
        }
    }, {
        key: 'open',
        value: function open(index) {
            if (index === this.index) return;

            // Navigation
            this.$navigation.removeClass('is-active').eq(index).addClass('is-active');

            this.transitionIn(index, this.index);
            this.transitionOut(this.index, index);

            this.index = index;
        }
    }, {
        key: 'transitionOut',
        value: function transitionOut(index, newIndex) {
            var $tab = this.$tabs.eq(index);
            var animation = !this.swipeSupport ? 'animation--slide-up-out' : newIndex > index ? 'animation--slide-left-out' : 'animation--slide-right-out';

            $tab.transition({
                'before': function before() {
                    return $tab.addClass(animation);
                },
                'transition': function transition() {
                    return $tab.addClass(animation + '--active');
                },
                'after': function after() {
                    return $tab.removeClass(animation + ' ' + animation + '--active').addClass('is-hidden').css('left', '');
                }
            });
        }
    }, {
        key: 'transitionIn',
        value: function transitionIn(index, prevIndex) {
            var $container = this.$container;
            var $tab = this.$tabs.eq(index);
            var $list = $tab.parent();
            var animation = !this.swipeSupport ? 'animation--slide-down-in' : index > prevIndex ? 'animation--slide-right-in' : 'animation--slide-left-in';

            $tab.transition({
                'before': function before() {
                    $tab.addClass('animation--slow ' + animation + ' ' + animation + '--inactive').removeClass('is-hidden');
                },
                'transition': function transition() {
                    $tab.removeClass(animation + '--inactive');
                },
                'after': function after() {
                    $tab.removeClass('animation--slow ' + animation + ' ' + animation + '--inactive');
                }
            });
        }
    }, {
        key: 'syncHeight',
        value: function syncHeight() {
            var $tabs = this.$tabs;
            var $list = $tabs.parent();

            var height = Math.max.apply(Math, $.map($tabs, function (tab) {
                return $(tab).height();
            }));

            if (height !== this.height) {
                this.height = height;
                $list.css('height', height).trigger('resize');
            }
        }

        /*
         * Swipe / drag
         */

    }, {
        key: 'handleDragStart',
        value: function handleDragStart(e) {
            this.dragStartX = this.getInputX(e);
            this.dragActive = true;
            this.dragSwiped = false;

            $(document).on('touchend', this.dragend).on('touchmove', this.handleDragMove);
        }
    }, {
        key: 'handleDragMove',
        value: function handleDragMove(e) {
            var delta = this.getInputX(e) - this.dragStartX;
            var $tab = this.$tabs.eq(this.index);

            $tab.css('left', delta / 3);

            if (delta > 60 && this.index > 0) {
                this.dragSwiped = true;
                this.open(this.index - 1);
                this.dragend();
                this.stop();
            } else if (delta < -60 && this.index < this.count - 1) {
                this.dragSwiped = true;
                this.open(this.index + 1);
                this.dragend();
                this.stop();
            }
        }
    }, {
        key: 'dragend',
        value: function dragend() {
            this.dragActive = false;

            if (!this.dragSwiped) {
                var $tab = this.$tabs.eq(this.index);

                $tab.animate({
                    'left': 0
                }, $.durationFast, 'easeInOutQuad', function () {
                    $tab.css('transform', '');
                });
            }

            $(document).off('touchend', this.dragend).off('touchmove', this.handleDragMove);
        }
    }, {
        key: 'getInputX',
        value: function getInputX(e) {
            if (e.originalEvent.touches && e.originalEvent.touches.length) {
                return e.originalEvent.touches[0].clientX;
            } else {
                return e.clientX || 0;
            }
        }
    }]);

    return Tabs;
}();

exports.default = Tabs;


$.fn.tabs = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('tabs');

        if (!instance) {
            instance = new Tabs($element, opts);
            $element.data('tabs', instance);
        }
    });
};

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * jquery-circle-progress - jQuery Plugin to draw animated circular progress bars:
 * {@link http://kottenator.github.io/jquery-circle-progress/}
 *
 * @author Rostyslav Bryzgunov <kottenator@gmail.com>
 * @version 1.2.1
 * @licence MIT
 * @preserve
 */
// UMD factory - https://github.com/umdjs/umd/blob/d31bb6ee7098715e019f52bdfe27b3e4bfd2b97e/templates/jqueryPlugin.js
// Uses AMD, CommonJS or browser globals to create a jQuery plugin.
(function (factory) {
  if (true) {
    // AMD - register as an anonymous module
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    // Node/CommonJS
    var $ = require('jquery');
    factory($);
    module.exports = $;
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  /**
   * Inner implementation of the circle progress bar.
   * The class is not exposed _yet_ but you can create an instance through jQuery method call.
   *
   * @param {object} config - You can customize any class member (property or method).
   * @class
   * @alias CircleProgress
   */
  function CircleProgress(config) {
    this.init(config);
  }

  CircleProgress.prototype = {
    //--------------------------------------- public options ---------------------------------------
    /**
     * This is the only required option. It should be from `0.0` to `1.0`.
     * @type {number}
     * @default 0.0
     */
    value: 0.0,

    /**
     * Size of the canvas in pixels.
     * It's a square so we need only one dimension.
     * @type {number}
     * @default 100.0
     */
    size: 100.0,

    /**
     * Initial angle for `0.0` value in radians.
     * @type {number}
     * @default -Math.PI
     */
    startAngle: -Math.PI,

    /**
     * Width of the arc in pixels.
     * If it's `'auto'` - the value is calculated as `[this.size]{@link CircleProgress#size} / 14`.
     * @type {number|string}
     * @default 'auto'
     */
    thickness: 'auto',

    /**
     * Fill of the arc. You may set it to:
     *
     *   - solid color:
     *     - `'#3aeabb'`
     *     - `{ color: '#3aeabb' }`
     *     - `{ color: 'rgba(255, 255, 255, .3)' }`
     *   - linear gradient _(left to right)_:
     *     - `{ gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }`
     *     - `{ gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }`
     *     - `{ gradient: [["red", .2], ["green", .3], ["blue", .8]] }`
     *   - image:
     *     - `{ image: 'http://i.imgur.com/pT0i89v.png' }`
     *     - `{ image: imageObject }`
     *     - `{ color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' }` -
     *       color displayed until the image is loaded
     *
     * @default {gradient: ['#3aeabb', '#fdd250']}
     */
    fill: {
      gradient: ['#3aeabb', '#fdd250']
    },

    /**
     * Color of the "empty" arc. Only a color fill supported by now.
     * @type {string}
     * @default 'rgba(0, 0, 0, .1)'
     */
    emptyFill: 'rgba(0, 0, 0, .1)',

    /**
     * jQuery Animation config.
     * You can pass `false` to disable the animation.
     * @see http://api.jquery.com/animate/
     * @type {object|boolean}
     * @default {duration: 1200, easing: 'circleProgressEasing'}
     */
    animation: {
      duration: 1200,
      easing: 'circleProgressEasing'
    },

    /**
     * Default animation starts at `0.0` and ends at specified `value`. Let's call this _direct animation_.
     * If you want to make _reversed animation_ - set `animationStartValue: 1.0`.
     * Also you may specify any other value from `0.0` to `1.0`.
     * @type {number}
     * @default 0.0
     */
    animationStartValue: 0.0,

    /**
     * Reverse animation and arc draw.
     * By default, the arc is filled from `0.0` to `value`, _clockwise_.
     * With `reverse: true` the arc is filled from `1.0` to `value`, _counter-clockwise_.
     * @type {boolean}
     * @default false
     */
    reverse: false,

    /**
     * Arc line cap: `'butt'`, `'round'` or `'square'` -
     * [read more]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap}.
     * @type {string}
     * @default 'butt'
     */
    lineCap: 'butt',

    /**
     * Canvas insertion mode: append or prepend it into the parent element?
     * @type {string}
     * @default 'prepend'
     */
    insertMode: 'prepend',

    //------------------------------ protected properties and methods ------------------------------
    /**
     * Link to {@link CircleProgress} constructor.
     * @protected
     */
    constructor: CircleProgress,

    /**
     * Container element. Should be passed into constructor config.
     * @protected
     * @type {jQuery}
     */
    el: null,

    /**
     * Canvas element. Automatically generated and prepended to [this.el]{@link CircleProgress#el}.
     * @protected
     * @type {HTMLCanvasElement}
     */
    canvas: null,

    /**
     * 2D-context of [this.canvas]{@link CircleProgress#canvas}.
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    ctx: null,

    /**
     * Radius of the outer circle. Automatically calculated as `[this.size]{@link CircleProgress#size} / 2`.
     * @protected
     * @type {number}
     */
    radius: 0.0,

    /**
     * Fill of the main arc. Automatically calculated, depending on [this.fill]{@link CircleProgress#fill} option.
     * @protected
     * @type {string|CanvasGradient|CanvasPattern}
     */
    arcFill: null,

    /**
     * Last rendered frame value.
     * @protected
     * @type {number}
     */
    lastFrameValue: 0.0,

    /**
     * Init/re-init the widget.
     *
     * Throws a jQuery event:
     *
     * - `circle-inited(jqEvent)`
     *
     * @param {object} config - You can customize any class member (property or method).
     */
    init: function init(config) {
      $.extend(this, config);
      this.radius = this.size / 2;
      this.initWidget();
      this.initFill();
      this.draw();
      this.el.trigger('circle-inited');
    },

    /**
     * Initialize `<canvas>`.
     * @protected
     */
    initWidget: function initWidget() {
      if (!this.canvas) this.canvas = $('<canvas>')[this.insertMode == 'prepend' ? 'prependTo' : 'appendTo'](this.el)[0];

      var canvas = this.canvas;
      canvas.width = this.size;
      canvas.height = this.size;
      this.ctx = canvas.getContext('2d');

      if (window.devicePixelRatio > 1) {
        var scaleBy = window.devicePixelRatio;
        canvas.style.width = canvas.style.height = this.size + 'px';
        canvas.width = canvas.height = this.size * scaleBy;
        this.ctx.scale(scaleBy, scaleBy);
      }
    },

    /**
     * This method sets [this.arcFill]{@link CircleProgress#arcFill}.
     * It could do this async (on image load).
     * @protected
     */
    initFill: function initFill() {
      var self = this,
          fill = this.fill,
          ctx = this.ctx,
          size = this.size;

      if (!fill) throw Error("The fill is not specified!");

      if (typeof fill == 'string') fill = { color: fill };

      if (fill.color) this.arcFill = fill.color;

      if (fill.gradient) {
        var gr = fill.gradient;

        if (gr.length == 1) {
          this.arcFill = gr[0];
        } else if (gr.length > 1) {
          var ga = fill.gradientAngle || 0,
              // gradient direction angle; 0 by default
          gd = fill.gradientDirection || [size / 2 * (1 - Math.cos(ga)), // x0
          size / 2 * (1 + Math.sin(ga)), // y0
          size / 2 * (1 + Math.cos(ga)), // x1
          size / 2 * (1 - Math.sin(ga)) // y1
          ];

          var lg = ctx.createLinearGradient.apply(ctx, gd);

          for (var i = 0; i < gr.length; i++) {
            var color = gr[i],
                pos = i / (gr.length - 1);

            if ($.isArray(color)) {
              pos = color[1];
              color = color[0];
            }

            lg.addColorStop(pos, color);
          }

          this.arcFill = lg;
        }
      }

      if (fill.image) {
        var img;

        if (fill.image instanceof Image) {
          img = fill.image;
        } else {
          img = new Image();
          img.src = fill.image;
        }

        if (img.complete) setImageFill();else img.onload = setImageFill;
      }

      function setImageFill() {
        var bg = $('<canvas>')[0];
        bg.width = self.size;
        bg.height = self.size;
        bg.getContext('2d').drawImage(img, 0, 0, size, size);
        self.arcFill = self.ctx.createPattern(bg, 'no-repeat');
        self.drawFrame(self.lastFrameValue);
      }
    },

    /**
     * Draw the circle.
     * @protected
     */
    draw: function draw() {
      if (this.animation) this.drawAnimated(this.value);else this.drawFrame(this.value);
    },

    /**
     * Draw a single animation frame.
     * @protected
     * @param {number} v - Frame value.
     */
    drawFrame: function drawFrame(v) {
      this.lastFrameValue = v;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.drawEmptyArc(v);
      this.drawArc(v);
    },

    /**
     * Draw the arc (part of the circle).
     * @protected
     * @param {number} v - Frame value.
     */
    drawArc: function drawArc(v) {
      if (v === 0) return;

      var ctx = this.ctx,
          r = this.radius,
          t = this.getThickness(),
          a = this.startAngle;

      ctx.save();
      ctx.beginPath();

      if (!this.reverse) {
        ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
      } else {
        ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
      }

      ctx.lineWidth = t;
      ctx.lineCap = this.lineCap;
      ctx.strokeStyle = this.arcFill;
      ctx.stroke();
      ctx.restore();
    },

    /**
     * Draw the _empty (background)_ arc (part of the circle).
     * @protected
     * @param {number} v - Frame value.
     */
    drawEmptyArc: function drawEmptyArc(v) {
      var ctx = this.ctx,
          r = this.radius,
          t = this.getThickness(),
          a = this.startAngle;

      if (v < 1) {
        ctx.save();
        ctx.beginPath();

        if (v <= 0) {
          ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
        } else {
          if (!this.reverse) {
            ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
          } else {
            ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
          }
        }

        ctx.lineWidth = t;
        ctx.strokeStyle = this.emptyFill;
        ctx.stroke();
        ctx.restore();
      }
    },

    /**
     * Animate the progress bar.
     *
     * Throws 3 jQuery events:
     *
     * - `circle-animation-start(jqEvent)`
     * - `circle-animation-progress(jqEvent, animationProgress, stepValue)` - multiple event
     *   animationProgress: from `0.0` to `1.0`; stepValue: from `0.0` to `value`
     * - `circle-animation-end(jqEvent)`
     *
     * @protected
     * @param {number} v - Final value.
     */
    drawAnimated: function drawAnimated(v) {
      var self = this,
          el = this.el,
          canvas = $(this.canvas);

      // stop previous animation before new "start" event is triggered
      canvas.stop(true, false);
      el.trigger('circle-animation-start');

      canvas.css({ animationProgress: 0 }).animate({ animationProgress: 1 }, $.extend({}, this.animation, {
        step: function step(animationProgress) {
          var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
          self.drawFrame(stepValue);
          el.trigger('circle-animation-progress', [animationProgress, stepValue]);
        }
      })).promise().always(function () {
        // trigger on both successful & failure animation end
        el.trigger('circle-animation-end');
      });
    },

    /**
     * Get the circle thickness.
     * @see CircleProgress#thickness
     * @protected
     * @returns {number}
     */
    getThickness: function getThickness() {
      return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
    },

    /**
     * Get current value.
     * @protected
     * @return {number}
     */
    getValue: function getValue() {
      return this.value;
    },

    /**
     * Set current value (with smooth animation transition).
     * @protected
     * @param {number} newValue
     */
    setValue: function setValue(newValue) {
      if (this.animation) this.animationStartValue = this.lastFrameValue;
      this.value = newValue;
      this.draw();
    }
  };

  //----------------------------------- Initiating jQuery plugin -----------------------------------
  $.circleProgress = {
    // Default options (you may override them)
    defaults: CircleProgress.prototype
  };

  // ease-in-out-cubic
  $.easing.circleProgressEasing = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  };

  /**
   * Creates an instance of {@link CircleProgress}.
   * Produces [init event]{@link CircleProgress#init} and [animation events]{@link CircleProgress#drawAnimated}.
   *
   * @param {object} [configOrCommand] - Config object or command name.
   *
   * Config example (you can specify any {@link CircleProgress} property):
   *
   * ```js
   * { value: 0.75, size: 50, animation: false }
   * ```
   *
   * Commands:
   *
   * ```js
   * el.circleProgress('widget'); // get the <canvas>
   * el.circleProgress('value'); // get the value
   * el.circleProgress('value', newValue); // update the value
   * el.circleProgress('redraw'); // redraw the circle
   * el.circleProgress(); // the same as 'redraw'
   * ```
   *
   * @param {string} [commandArgument] - Some commands (like `'value'`) may require an argument.
   * @see CircleProgress
   * @alias "$(...).circleProgress"
   */
  $.fn.circleProgress = function (configOrCommand, commandArgument) {
    var dataName = 'circle-progress',
        firstInstance = this.data(dataName);

    if (configOrCommand == 'widget') {
      if (!firstInstance) throw Error('Calling "widget" method on not initialized instance is forbidden');
      return firstInstance.canvas;
    }

    if (configOrCommand == 'value') {
      if (!firstInstance) throw Error('Calling "value" method on not initialized instance is forbidden');
      if (typeof commandArgument == 'undefined') {
        return firstInstance.getValue();
      } else {
        var newValue = arguments[1];
        return this.each(function () {
          $(this).data(dataName).setValue(newValue);
        });
      }
    }

    return this.each(function () {
      var el = $(this),
          instance = el.data(dataName),
          config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

      if (instance) {
        instance.init(config);
      } else {
        var initialConfig = $.extend({}, el.data());
        if (typeof initialConfig.fill == 'string') initialConfig.fill = JSON.parse(initialConfig.fill);
        if (typeof initialConfig.animation == 'string') initialConfig.animation = JSON.parse(initialConfig.animation);
        config = $.extend(initialConfig, config);
        config.el = el;
        instance = new CircleProgress(config);
        el.data(dataName, instance);
      }
    });
  };
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery Validation Plugin v1.15.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2016 Jörn Zaefferer
 * Released under the MIT license
 */
(function (factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
		module.exports = factory(require("jquery"));
	} else {
		factory(jQuery);
	}
})(function ($) {

	$.extend($.fn, {

		// http://jqueryvalidation.org/validate/
		validate: function validate(options) {

			// If nothing is selected, return nothing; can't chain anyway
			if (!this.length) {
				if (options && options.debug && window.console) {
					console.warn("Nothing selected, can't validate, returning nothing.");
				}
				return;
			}

			// Check if a validator for this form was already created
			var validator = $.data(this[0], "validator");
			if (validator) {
				return validator;
			}

			// Add novalidate tag if HTML5.
			this.attr("novalidate", "novalidate");

			validator = new $.validator(options, this[0]);
			$.data(this[0], "validator", validator);

			if (validator.settings.onsubmit) {

				this.on("click.validate", ":submit", function (event) {
					if (validator.settings.submitHandler) {
						validator.submitButton = event.target;
					}

					// Allow suppressing validation by adding a cancel class to the submit button
					if ($(this).hasClass("cancel")) {
						validator.cancelSubmit = true;
					}

					// Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
					if ($(this).attr("formnovalidate") !== undefined) {
						validator.cancelSubmit = true;
					}
				});

				// Validate the form on submit
				this.on("submit.validate", function (event) {
					if (validator.settings.debug) {

						// Prevent form submit to be able to see console output
						event.preventDefault();
					}
					function handle() {
						var hidden, result;
						if (validator.settings.submitHandler) {
							if (validator.submitButton) {

								// Insert a hidden input as a replacement for the missing submit button
								hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm);
							}
							result = validator.settings.submitHandler.call(validator, validator.currentForm, event);
							if (validator.submitButton) {

								// And clean up afterwards; thanks to no-block-scope, hidden can be referenced
								hidden.remove();
							}
							if (result !== undefined) {
								return result;
							}
							return false;
						}
						return true;
					}

					// Prevent submit for invalid forms or custom submit handlers
					if (validator.cancelSubmit) {
						validator.cancelSubmit = false;
						return handle();
					}
					if (validator.form()) {
						if (validator.pendingRequest) {
							validator.formSubmitted = true;
							return false;
						}
						return handle();
					} else {
						validator.focusInvalid();
						return false;
					}
				});
			}

			return validator;
		},

		// http://jqueryvalidation.org/valid/
		valid: function valid() {
			var valid, validator, errorList;

			if ($(this[0]).is("form")) {
				valid = this.validate().form();
			} else {
				errorList = [];
				valid = true;
				validator = $(this[0].form).validate();
				this.each(function () {
					valid = validator.element(this) && valid;
					if (!valid) {
						errorList = errorList.concat(validator.errorList);
					}
				});
				validator.errorList = errorList;
			}
			return valid;
		},

		// http://jqueryvalidation.org/rules/
		rules: function rules(command, argument) {

			// If nothing is selected, return nothing; can't chain anyway
			if (!this.length) {
				return;
			}

			var element = this[0],
			    settings,
			    staticRules,
			    existingRules,
			    data,
			    param,
			    filtered;

			if (command) {
				settings = $.data(element.form, "validator").settings;
				staticRules = settings.rules;
				existingRules = $.validator.staticRules(element);
				switch (command) {
					case "add":
						$.extend(existingRules, $.validator.normalizeRule(argument));

						// Remove messages from rules, but allow them to be set separately
						delete existingRules.messages;
						staticRules[element.name] = existingRules;
						if (argument.messages) {
							settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
						}
						break;
					case "remove":
						if (!argument) {
							delete staticRules[element.name];
							return existingRules;
						}
						filtered = {};
						$.each(argument.split(/\s/), function (index, method) {
							filtered[method] = existingRules[method];
							delete existingRules[method];
							if (method === "required") {
								$(element).removeAttr("aria-required");
							}
						});
						return filtered;
				}
			}

			data = $.validator.normalizeRules($.extend({}, $.validator.classRules(element), $.validator.attributeRules(element), $.validator.dataRules(element), $.validator.staticRules(element)), element);

			// Make sure required is at front
			if (data.required) {
				param = data.required;
				delete data.required;
				data = $.extend({ required: param }, data);
				$(element).attr("aria-required", "true");
			}

			// Make sure remote is at back
			if (data.remote) {
				param = data.remote;
				delete data.remote;
				data = $.extend(data, { remote: param });
			}

			return data;
		}
	});

	// Custom selectors
	$.extend($.expr[":"], {

		// http://jqueryvalidation.org/blank-selector/
		blank: function blank(a) {
			return !$.trim("" + $(a).val());
		},

		// http://jqueryvalidation.org/filled-selector/
		filled: function filled(a) {
			var val = $(a).val();
			return val !== null && !!$.trim("" + val);
		},

		// http://jqueryvalidation.org/unchecked-selector/
		unchecked: function unchecked(a) {
			return !$(a).prop("checked");
		}
	});

	// Constructor for validator
	$.validator = function (options, form) {
		this.settings = $.extend(true, {}, $.validator.defaults, options);
		this.currentForm = form;
		this.init();
	};

	// http://jqueryvalidation.org/jQuery.validator.format/
	$.validator.format = function (source, params) {
		if (arguments.length === 1) {
			return function () {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply(this, args);
			};
		}
		if (params === undefined) {
			return source;
		}
		if (arguments.length > 2 && params.constructor !== Array) {
			params = $.makeArray(arguments).slice(1);
		}
		if (params.constructor !== Array) {
			params = [params];
		}
		$.each(params, function (i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
				return n;
			});
		});
		return source;
	};

	$.extend($.validator, {

		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			pendingClass: "pending",
			validClass: "valid",
			errorElement: "label",
			focusCleanup: false,
			focusInvalid: true,
			errorContainer: $([]),
			errorLabelContainer: $([]),
			onsubmit: true,
			ignore: ":hidden",
			ignoreTitle: false,
			onfocusin: function onfocusin(element) {
				this.lastActive = element;

				// Hide error label and remove error class on focus if enabled
				if (this.settings.focusCleanup) {
					if (this.settings.unhighlight) {
						this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
					}
					this.hideThese(this.errorsFor(element));
				}
			},
			onfocusout: function onfocusout(element) {
				if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
					this.element(element);
				}
			},
			onkeyup: function onkeyup(element, event) {

				// Avoid revalidate the field when pressing one of the following keys
				// Shift       => 16
				// Ctrl        => 17
				// Alt         => 18
				// Caps lock   => 20
				// End         => 35
				// Home        => 36
				// Left arrow  => 37
				// Up arrow    => 38
				// Right arrow => 39
				// Down arrow  => 40
				// Insert      => 45
				// Num lock    => 144
				// AltGr key   => 225
				var excludedKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];

				if (event.which === 9 && this.elementValue(element) === "" || $.inArray(event.keyCode, excludedKeys) !== -1) {
					return;
				} else if (element.name in this.submitted || element.name in this.invalid) {
					this.element(element);
				}
			},
			onclick: function onclick(element) {

				// Click on selects, radiobuttons and checkboxes
				if (element.name in this.submitted) {
					this.element(element);

					// Or option elements, check parent select in that case
				} else if (element.parentNode.name in this.submitted) {
					this.element(element.parentNode);
				}
			},
			highlight: function highlight(element, errorClass, validClass) {
				if (element.type === "radio") {
					this.findByName(element.name).addClass(errorClass).removeClass(validClass);
				} else {
					$(element).addClass(errorClass).removeClass(validClass);
				}
			},
			unhighlight: function unhighlight(element, errorClass, validClass) {
				if (element.type === "radio") {
					this.findByName(element.name).removeClass(errorClass).addClass(validClass);
				} else {
					$(element).removeClass(errorClass).addClass(validClass);
				}
			}
		},

		// http://jqueryvalidation.org/jQuery.validator.setDefaults/
		setDefaults: function setDefaults(settings) {
			$.extend($.validator.defaults, settings);
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date ( ISO ).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format("Please enter no more than {0} characters."),
			minlength: $.validator.format("Please enter at least {0} characters."),
			rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
			range: $.validator.format("Please enter a value between {0} and {1}."),
			max: $.validator.format("Please enter a value less than or equal to {0}."),
			min: $.validator.format("Please enter a value greater than or equal to {0}."),
			step: $.validator.format("Please enter a multiple of {0}.")
		},

		autoCreateRanges: false,

		prototype: {

			init: function init() {
				this.labelContainer = $(this.settings.errorLabelContainer);
				this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
				this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = this.groups = {},
				    rules;
				$.each(this.settings.groups, function (key, value) {
					if (typeof value === "string") {
						value = value.split(/\s/);
					}
					$.each(value, function (index, name) {
						groups[name] = key;
					});
				});
				rules = this.settings.rules;
				$.each(rules, function (key, value) {
					rules[key] = $.validator.normalizeRule(value);
				});

				function delegate(event) {
					var validator = $.data(this.form, "validator"),
					    eventType = "on" + event.type.replace(/^validate/, ""),
					    settings = validator.settings;
					if (settings[eventType] && !$(this).is(settings.ignore)) {
						settings[eventType].call(validator, this, event);
					}
				}

				$(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " + "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " + "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " + "[type='radio'], [type='checkbox'], [contenteditable]", delegate)

				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);

				if (this.settings.invalidHandler) {
					$(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
				}

				// Add aria-required to any Static/Data/Class required fields before first validation
				// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
				$(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true");
			},

			// http://jqueryvalidation.org/Validator.form/
			form: function form() {
				this.checkForm();
				$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMap);
				if (!this.valid()) {
					$(this.currentForm).triggerHandler("invalid-form", [this]);
				}
				this.showErrors();
				return this.valid();
			},

			checkForm: function checkForm() {
				this.prepareForm();
				for (var i = 0, elements = this.currentElements = this.elements(); elements[i]; i++) {
					this.check(elements[i]);
				}
				return this.valid();
			},

			// http://jqueryvalidation.org/Validator.element/
			element: function element(_element) {
				var cleanElement = this.clean(_element),
				    checkElement = this.validationTargetFor(cleanElement),
				    v = this,
				    result = true,
				    rs,
				    group;

				if (checkElement === undefined) {
					delete this.invalid[cleanElement.name];
				} else {
					this.prepareElement(checkElement);
					this.currentElements = $(checkElement);

					// If this element is grouped, then validate all group elements already
					// containing a value
					group = this.groups[checkElement.name];
					if (group) {
						$.each(this.groups, function (name, testgroup) {
							if (testgroup === group && name !== checkElement.name) {
								cleanElement = v.validationTargetFor(v.clean(v.findByName(name)));
								if (cleanElement && cleanElement.name in v.invalid) {
									v.currentElements.push(cleanElement);
									result = result && v.check(cleanElement);
								}
							}
						});
					}

					rs = this.check(checkElement) !== false;
					result = result && rs;
					if (rs) {
						this.invalid[checkElement.name] = false;
					} else {
						this.invalid[checkElement.name] = true;
					}

					if (!this.numberOfInvalids()) {

						// Hide error containers on last error
						this.toHide = this.toHide.add(this.containers);
					}
					this.showErrors();

					// Add aria-invalid status for screen readers
					$(_element).attr("aria-invalid", !rs);
				}

				return result;
			},

			// http://jqueryvalidation.org/Validator.showErrors/
			showErrors: function showErrors(errors) {
				if (errors) {
					var validator = this;

					// Add items to error list and map
					$.extend(this.errorMap, errors);
					this.errorList = $.map(this.errorMap, function (message, name) {
						return {
							message: message,
							element: validator.findByName(name)[0]
						};
					});

					// Remove items from success list
					this.successList = $.grep(this.successList, function (element) {
						return !(element.name in errors);
					});
				}
				if (this.settings.showErrors) {
					this.settings.showErrors.call(this, this.errorMap, this.errorList);
				} else {
					this.defaultShowErrors();
				}
			},

			// http://jqueryvalidation.org/Validator.resetForm/
			resetForm: function resetForm() {
				if ($.fn.resetForm) {
					$(this.currentForm).resetForm();
				}
				this.invalid = {};
				this.submitted = {};
				this.prepareForm();
				this.hideErrors();
				var elements = this.elements().removeData("previousValue").removeAttr("aria-invalid");

				this.resetElements(elements);
			},

			resetElements: function resetElements(elements) {
				var i;

				if (this.settings.unhighlight) {
					for (i = 0; elements[i]; i++) {
						this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, "");
						this.findByName(elements[i].name).removeClass(this.settings.validClass);
					}
				} else {
					elements.removeClass(this.settings.errorClass).removeClass(this.settings.validClass);
				}
			},

			numberOfInvalids: function numberOfInvalids() {
				return this.objectLength(this.invalid);
			},

			objectLength: function objectLength(obj) {
				/* jshint unused: false */
				var count = 0,
				    i;
				for (i in obj) {
					if (obj[i]) {
						count++;
					}
				}
				return count;
			},

			hideErrors: function hideErrors() {
				this.hideThese(this.toHide);
			},

			hideThese: function hideThese(errors) {
				errors.not(this.containers).text("");
				this.addWrapper(errors).hide();
			},

			valid: function valid() {
				return this.size() === 0;
			},

			size: function size() {
				return this.errorList.length;
			},

			focusInvalid: function focusInvalid() {
				if (this.settings.focusInvalid) {
					try {
						$(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus()

						// Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
						.trigger("focusin");
					} catch (e) {

						// Ignore IE throwing errors when focusing hidden elements
					}
				}
			},

			findLastActive: function findLastActive() {
				var lastActive = this.lastActive;
				return lastActive && $.grep(this.errorList, function (n) {
					return n.element.name === lastActive.name;
				}).length === 1 && lastActive;
			},

			elements: function elements() {
				var validator = this,
				    rulesCache = {};

				// Select all valid inputs inside the form (no submit or reset buttons)
				return $(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
					var name = this.name || $(this).attr("name"); // For contenteditable
					if (!name && validator.settings.debug && window.console) {
						console.error("%o has no name assigned", this);
					}

					// Set form expando on contenteditable
					if (this.hasAttribute("contenteditable")) {
						this.form = $(this).closest("form")[0];
					}

					// Select only the first element for each name, and only those with rules specified
					if (name in rulesCache || !validator.objectLength($(this).rules())) {
						return false;
					}

					rulesCache[name] = true;
					return true;
				});
			},

			clean: function clean(selector) {
				return $(selector)[0];
			},

			errors: function errors() {
				var errorClass = this.settings.errorClass.split(" ").join(".");
				return $(this.settings.errorElement + "." + errorClass, this.errorContext);
			},

			resetInternals: function resetInternals() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $([]);
				this.toHide = $([]);
			},

			reset: function reset() {
				this.resetInternals();
				this.currentElements = $([]);
			},

			prepareForm: function prepareForm() {
				this.reset();
				this.toHide = this.errors().add(this.containers);
			},

			prepareElement: function prepareElement(element) {
				this.reset();
				this.toHide = this.errorsFor(element);
			},

			elementValue: function elementValue(element) {
				var $element = $(element),
				    type = element.type,
				    val,
				    idx;

				if (type === "radio" || type === "checkbox") {
					return this.findByName(element.name).filter(":checked").val();
				} else if (type === "number" && typeof element.validity !== "undefined") {
					return element.validity.badInput ? "NaN" : $element.val();
				}

				if (element.hasAttribute("contenteditable")) {
					val = $element.text();
				} else {
					val = $element.val();
				}

				if (type === "file") {

					// Modern browser (chrome & safari)
					if (val.substr(0, 12) === "C:\\fakepath\\") {
						return val.substr(12);
					}

					// Legacy browsers
					// Unix-based path
					idx = val.lastIndexOf("/");
					if (idx >= 0) {
						return val.substr(idx + 1);
					}

					// Windows-based path
					idx = val.lastIndexOf("\\");
					if (idx >= 0) {
						return val.substr(idx + 1);
					}

					// Just the file name
					return val;
				}

				if (typeof val === "string") {
					return val.replace(/\r/g, "");
				}
				return val;
			},

			check: function check(element) {
				element = this.validationTargetFor(this.clean(element));

				var rules = $(element).rules(),
				    rulesCount = $.map(rules, function (n, i) {
					return i;
				}).length,
				    dependencyMismatch = false,
				    val = this.elementValue(element),
				    result,
				    method,
				    rule;

				// If a normalizer is defined for this element, then
				// call it to retreive the changed value instead
				// of using the real one.
				// Note that `this` in the normalizer is `element`.
				if (typeof rules.normalizer === "function") {
					val = rules.normalizer.call(element, val);

					if (typeof val !== "string") {
						throw new TypeError("The normalizer should return a string value.");
					}

					// Delete the normalizer from rules to avoid treating
					// it as a pre-defined method.
					delete rules.normalizer;
				}

				for (method in rules) {
					rule = { method: method, parameters: rules[method] };
					try {
						result = $.validator.methods[method].call(this, val, element, rule.parameters);

						// If a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if (result === "dependency-mismatch" && rulesCount === 1) {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if (result === "pending") {
							this.toHide = this.toHide.not(this.errorsFor(element));
							return;
						}

						if (!result) {
							this.formatAndAdd(element, rule);
							return false;
						}
					} catch (e) {
						if (this.settings.debug && window.console) {
							console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
						}
						if (e instanceof TypeError) {
							e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
						}

						throw e;
					}
				}
				if (dependencyMismatch) {
					return;
				}
				if (this.objectLength(rules)) {
					this.successList.push(element);
				}
				return true;
			},

			// Return the custom message for the given element and validation method
			// specified in the element's HTML5 data attribute
			// return the generic message if present and no method specific message is present
			customDataMessage: function customDataMessage(element, method) {
				return $(element).data("msg" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase()) || $(element).data("msg");
			},

			// Return the custom message for the given element name and validation method
			customMessage: function customMessage(name, method) {
				var m = this.settings.messages[name];
				return m && (m.constructor === String ? m : m[method]);
			},

			// Return the first defined argument, allowing empty strings
			findDefined: function findDefined() {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined) {
						return arguments[i];
					}
				}
				return undefined;
			},

			defaultMessage: function defaultMessage(element, rule) {
				var message = this.findDefined(this.customMessage(element.name, rule.method), this.customDataMessage(element, rule.method),

				// 'title' is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined, $.validator.messages[rule.method], "<strong>Warning: No message defined for " + element.name + "</strong>"),
				    theregex = /\$?\{(\d+)\}/g;
				if (typeof message === "function") {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
				}

				return message;
			},

			formatAndAdd: function formatAndAdd(element, rule) {
				var message = this.defaultMessage(element, rule);

				this.errorList.push({
					message: message,
					element: element,
					method: rule.method
				});

				this.errorMap[element.name] = message;
				this.submitted[element.name] = message;
			},

			addWrapper: function addWrapper(toToggle) {
				if (this.settings.wrapper) {
					toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
				}
				return toToggle;
			},

			defaultShowErrors: function defaultShowErrors() {
				var i, elements, error;
				for (i = 0; this.errorList[i]; i++) {
					error = this.errorList[i];
					if (this.settings.highlight) {
						this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
					}
					this.showLabel(error.element, error.message);
				}
				if (this.errorList.length) {
					this.toShow = this.toShow.add(this.containers);
				}
				if (this.settings.success) {
					for (i = 0; this.successList[i]; i++) {
						this.showLabel(this.successList[i]);
					}
				}
				if (this.settings.unhighlight) {
					for (i = 0, elements = this.validElements(); elements[i]; i++) {
						this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
					}
				}
				this.toHide = this.toHide.not(this.toShow);
				this.hideErrors();
				this.addWrapper(this.toShow).show();
			},

			validElements: function validElements() {
				return this.currentElements.not(this.invalidElements());
			},

			invalidElements: function invalidElements() {
				return $(this.errorList).map(function () {
					return this.element;
				});
			},

			showLabel: function showLabel(element, message) {
				var place,
				    group,
				    errorID,
				    v,
				    error = this.errorsFor(element),
				    elementID = this.idOrName(element),
				    describedBy = $(element).attr("aria-describedby");

				if (error.length) {

					// Refresh error/success class
					error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);

					// Replace message on existing label
					error.html(message);
				} else {

					// Create error element
					error = $("<" + this.settings.errorElement + ">").attr("id", elementID + "-error").addClass(this.settings.errorClass).html(message || "");

					// Maintain reference to the element to be placed into the DOM
					place = error;
					if (this.settings.wrapper) {

						// Make sure the element is visible, even in IE
						// actually showing the wrapped element is handled elsewhere
						place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
					}
					if (this.labelContainer.length) {
						this.labelContainer.append(place);
					} else if (this.settings.errorPlacement) {
						this.settings.errorPlacement(place, $(element));
					} else {
						place.insertAfter(element);
					}

					// Link error back to the element
					if (error.is("label")) {

						// If the error is a label, then associate using 'for'
						error.attr("for", elementID);

						// If the element is not a child of an associated label, then it's necessary
						// to explicitly apply aria-describedby
					} else if (error.parents("label[for='" + this.escapeCssMeta(elementID) + "']").length === 0) {
						errorID = error.attr("id");

						// Respect existing non-error aria-describedby
						if (!describedBy) {
							describedBy = errorID;
						} else if (!describedBy.match(new RegExp("\\b" + this.escapeCssMeta(errorID) + "\\b"))) {

							// Add to end of list if not already present
							describedBy += " " + errorID;
						}
						$(element).attr("aria-describedby", describedBy);

						// If this element is grouped, then assign to all elements in the same group
						group = this.groups[element.name];
						if (group) {
							v = this;
							$.each(v.groups, function (name, testgroup) {
								if (testgroup === group) {
									$("[name='" + v.escapeCssMeta(name) + "']", v.currentForm).attr("aria-describedby", error.attr("id"));
								}
							});
						}
					}
				}
				if (!message && this.settings.success) {
					error.text("");
					if (typeof this.settings.success === "string") {
						error.addClass(this.settings.success);
					} else {
						this.settings.success(error, element);
					}
				}
				this.toShow = this.toShow.add(error);
			},

			errorsFor: function errorsFor(element) {
				var name = this.escapeCssMeta(this.idOrName(element)),
				    describer = $(element).attr("aria-describedby"),
				    selector = "label[for='" + name + "'], label[for='" + name + "'] *";

				// 'aria-describedby' should directly reference the error element
				if (describer) {
					selector = selector + ", #" + this.escapeCssMeta(describer).replace(/\s+/g, ", #");
				}

				return this.errors().filter(selector);
			},

			// See https://api.jquery.com/category/selectors/, for CSS
			// meta-characters that should be escaped in order to be used with JQuery
			// as a literal part of a name/id or any selector.
			escapeCssMeta: function escapeCssMeta(string) {
				return string.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
			},

			idOrName: function idOrName(element) {
				return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
			},

			validationTargetFor: function validationTargetFor(element) {

				// If radio/checkbox, validate first element in group instead
				if (this.checkable(element)) {
					element = this.findByName(element.name);
				}

				// Always apply ignore filter
				return $(element).not(this.settings.ignore)[0];
			},

			checkable: function checkable(element) {
				return (/radio|checkbox/i.test(element.type)
				);
			},

			findByName: function findByName(name) {
				return $(this.currentForm).find("[name='" + this.escapeCssMeta(name) + "']");
			},

			getLength: function getLength(value, element) {
				switch (element.nodeName.toLowerCase()) {
					case "select":
						return $("option:selected", element).length;
					case "input":
						if (this.checkable(element)) {
							return this.findByName(element.name).filter(":checked").length;
						}
				}
				return value.length;
			},

			depend: function depend(param, element) {
				return this.dependTypes[typeof param === "undefined" ? "undefined" : _typeof(param)] ? this.dependTypes[typeof param === "undefined" ? "undefined" : _typeof(param)](param, element) : true;
			},

			dependTypes: {
				"boolean": function boolean(param) {
					return param;
				},
				"string": function string(param, element) {
					return !!$(param, element.form).length;
				},
				"function": function _function(param, element) {
					return param(element);
				}
			},

			optional: function optional(element) {
				var val = this.elementValue(element);
				return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
			},

			startRequest: function startRequest(element) {
				if (!this.pending[element.name]) {
					this.pendingRequest++;
					$(element).addClass(this.settings.pendingClass);
					this.pending[element.name] = true;
				}
			},

			stopRequest: function stopRequest(element, valid) {
				this.pendingRequest--;

				// Sometimes synchronization fails, make sure pendingRequest is never < 0
				if (this.pendingRequest < 0) {
					this.pendingRequest = 0;
				}
				delete this.pending[element.name];
				$(element).removeClass(this.settings.pendingClass);
				if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
					$(this.currentForm).submit();
					this.formSubmitted = false;
				} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
					$(this.currentForm).triggerHandler("invalid-form", [this]);
					this.formSubmitted = false;
				}
			},

			previousValue: function previousValue(element, method) {
				return $.data(element, "previousValue") || $.data(element, "previousValue", {
					old: null,
					valid: true,
					message: this.defaultMessage(element, { method: method })
				});
			},

			// Cleans up all forms and elements, removes validator-specific events
			destroy: function destroy() {
				this.resetForm();

				$(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur");
			}

		},

		classRuleSettings: {
			required: { required: true },
			email: { email: true },
			url: { url: true },
			date: { date: true },
			dateISO: { dateISO: true },
			number: { number: true },
			digits: { digits: true },
			creditcard: { creditcard: true }
		},

		addClassRules: function addClassRules(className, rules) {
			if (className.constructor === String) {
				this.classRuleSettings[className] = rules;
			} else {
				$.extend(this.classRuleSettings, className);
			}
		},

		classRules: function classRules(element) {
			var rules = {},
			    classes = $(element).attr("class");

			if (classes) {
				$.each(classes.split(" "), function () {
					if (this in $.validator.classRuleSettings) {
						$.extend(rules, $.validator.classRuleSettings[this]);
					}
				});
			}
			return rules;
		},

		normalizeAttributeRule: function normalizeAttributeRule(rules, type, method, value) {

			// Convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if (/min|max|step/.test(method) && (type === null || /number|range|text/.test(type))) {
				value = Number(value);

				// Support Opera Mini, which returns NaN for undefined minlength
				if (isNaN(value)) {
					value = undefined;
				}
			}

			if (value || value === 0) {
				rules[method] = value;
			} else if (type === method && type !== "range") {

				// Exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[method] = true;
			}
		},

		attributeRules: function attributeRules(element) {
			var rules = {},
			    $element = $(element),
			    type = element.getAttribute("type"),
			    method,
			    value;

			for (method in $.validator.methods) {

				// Support for <input required> in both html5 and older browsers
				if (method === "required") {
					value = element.getAttribute(method);

					// Some browsers return an empty string for the required attribute
					// and non-HTML5 browsers might have required="" markup
					if (value === "") {
						value = true;
					}

					// Force non-HTML5 browsers to return bool
					value = !!value;
				} else {
					value = $element.attr(method);
				}

				this.normalizeAttributeRule(rules, type, method, value);
			}

			// 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
			if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
				delete rules.maxlength;
			}

			return rules;
		},

		dataRules: function dataRules(element) {
			var rules = {},
			    $element = $(element),
			    type = element.getAttribute("type"),
			    method,
			    value;

			for (method in $.validator.methods) {
				value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase());
				this.normalizeAttributeRule(rules, type, method, value);
			}
			return rules;
		},

		staticRules: function staticRules(element) {
			var rules = {},
			    validator = $.data(element.form, "validator");

			if (validator.settings.rules) {
				rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
			}
			return rules;
		},

		normalizeRules: function normalizeRules(rules, element) {

			// Handle dependency check
			$.each(rules, function (prop, val) {

				// Ignore rule when param is explicitly false, eg. required:false
				if (val === false) {
					delete rules[prop];
					return;
				}
				if (val.param || val.depends) {
					var keepRule = true;
					switch (_typeof(val.depends)) {
						case "string":
							keepRule = !!$(val.depends, element.form).length;
							break;
						case "function":
							keepRule = val.depends.call(element, element);
							break;
					}
					if (keepRule) {
						rules[prop] = val.param !== undefined ? val.param : true;
					} else {
						$.data(element.form, "validator").resetElements($(element));
						delete rules[prop];
					}
				}
			});

			// Evaluate parameters
			$.each(rules, function (rule, parameter) {
				rules[rule] = $.isFunction(parameter) && rule !== "normalizer" ? parameter(element) : parameter;
			});

			// Clean number parameters
			$.each(["minlength", "maxlength"], function () {
				if (rules[this]) {
					rules[this] = Number(rules[this]);
				}
			});
			$.each(["rangelength", "range"], function () {
				var parts;
				if (rules[this]) {
					if ($.isArray(rules[this])) {
						rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
					} else if (typeof rules[this] === "string") {
						parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/);
						rules[this] = [Number(parts[0]), Number(parts[1])];
					}
				}
			});

			if ($.validator.autoCreateRanges) {

				// Auto-create ranges
				if (rules.min != null && rules.max != null) {
					rules.range = [rules.min, rules.max];
					delete rules.min;
					delete rules.max;
				}
				if (rules.minlength != null && rules.maxlength != null) {
					rules.rangelength = [rules.minlength, rules.maxlength];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function normalizeRule(data) {
			if (typeof data === "string") {
				var transformed = {};
				$.each(data.split(/\s/), function () {
					transformed[this] = true;
				});
				data = transformed;
			}
			return data;
		},

		// http://jqueryvalidation.org/jQuery.validator.addMethod/
		addMethod: function addMethod(name, method, message) {
			$.validator.methods[name] = method;
			$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
			if (method.length < 3) {
				$.validator.addClassRules(name, $.validator.normalizeRule(name));
			}
		},

		// http://jqueryvalidation.org/jQuery.validator.methods/
		methods: {

			// http://jqueryvalidation.org/required-method/
			required: function required(value, element, param) {

				// Check if dependency is met
				if (!this.depend(param, element)) {
					return "dependency-mismatch";
				}
				if (element.nodeName.toLowerCase() === "select") {

					// Could be an array for select-multiple or a string, both are fine this way
					var val = $(element).val();
					return val && val.length > 0;
				}
				if (this.checkable(element)) {
					return this.getLength(value, element) > 0;
				}
				return value.length > 0;
			},

			// http://jqueryvalidation.org/email-method/
			email: function email(value, element) {

				// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
				// Retrieved 2014-01-14
				// If you have a problem with this implementation, report a bug against the above spec
				// Or use custom methods to implement your own email validation
				return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
			},

			// http://jqueryvalidation.org/url-method/
			url: function url(value, element) {

				// Copyright (c) 2010-2013 Diego Perini, MIT licensed
				// https://gist.github.com/dperini/729294
				// see also https://mathiasbynens.be/demo/url-regex
				// modified to allow protocol-relative URLs
				return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
			},

			// http://jqueryvalidation.org/date-method/
			date: function date(value, element) {
				return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
			},

			// http://jqueryvalidation.org/dateISO-method/
			dateISO: function dateISO(value, element) {
				return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
			},

			// http://jqueryvalidation.org/number-method/
			number: function number(value, element) {
				return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},

			// http://jqueryvalidation.org/digits-method/
			digits: function digits(value, element) {
				return this.optional(element) || /^\d+$/.test(value);
			},

			// http://jqueryvalidation.org/minlength-method/
			minlength: function minlength(value, element, param) {
				var length = $.isArray(value) ? value.length : this.getLength(value, element);
				return this.optional(element) || length >= param;
			},

			// http://jqueryvalidation.org/maxlength-method/
			maxlength: function maxlength(value, element, param) {
				var length = $.isArray(value) ? value.length : this.getLength(value, element);
				return this.optional(element) || length <= param;
			},

			// http://jqueryvalidation.org/rangelength-method/
			rangelength: function rangelength(value, element, param) {
				var length = $.isArray(value) ? value.length : this.getLength(value, element);
				return this.optional(element) || length >= param[0] && length <= param[1];
			},

			// http://jqueryvalidation.org/min-method/
			min: function min(value, element, param) {
				return this.optional(element) || value >= param;
			},

			// http://jqueryvalidation.org/max-method/
			max: function max(value, element, param) {
				return this.optional(element) || value <= param;
			},

			// http://jqueryvalidation.org/range-method/
			range: function range(value, element, param) {
				return this.optional(element) || value >= param[0] && value <= param[1];
			},

			// http://jqueryvalidation.org/step-method/
			step: function step(value, element, param) {
				var type = $(element).attr("type"),
				    errorMessage = "Step attribute on input type " + type + " is not supported.",
				    supportedTypes = ["text", "number", "range"],
				    re = new RegExp("\\b" + type + "\\b"),
				    notSupported = type && !re.test(supportedTypes.join());

				// Works only for text, number and range input types
				// TODO find a way to support input types date, datetime, datetime-local, month, time and week
				if (notSupported) {
					throw new Error(errorMessage);
				}
				return this.optional(element) || value % param === 0;
			},

			// http://jqueryvalidation.org/equalTo-method/
			equalTo: function equalTo(value, element, param) {

				// Bind to the blur event of the target in order to revalidate whenever the target field is updated
				var target = $(param);
				if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
					target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
						$(element).valid();
					});
				}
				return value === target.val();
			},

			// http://jqueryvalidation.org/remote-method/
			remote: function remote(value, element, param, method) {
				if (this.optional(element)) {
					return "dependency-mismatch";
				}

				method = typeof method === "string" && method || "remote";

				var previous = this.previousValue(element, method),
				    validator,
				    data,
				    optionDataString;

				if (!this.settings.messages[element.name]) {
					this.settings.messages[element.name] = {};
				}
				previous.originalMessage = previous.originalMessage || this.settings.messages[element.name][method];
				this.settings.messages[element.name][method] = previous.message;

				param = typeof param === "string" && { url: param } || param;
				optionDataString = $.param($.extend({ data: value }, param.data));
				if (previous.old === optionDataString) {
					return previous.valid;
				}

				previous.old = optionDataString;
				validator = this;
				this.startRequest(element);
				data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					context: validator.currentForm,
					success: function success(response) {
						var valid = response === true || response === "true",
						    errors,
						    message,
						    submitted;

						validator.settings.messages[element.name][method] = previous.originalMessage;
						if (valid) {
							submitted = validator.formSubmitted;
							validator.resetInternals();
							validator.toHide = validator.errorsFor(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							validator.invalid[element.name] = false;
							validator.showErrors();
						} else {
							errors = {};
							message = response || validator.defaultMessage(element, { method: method, parameters: value });
							errors[element.name] = previous.message = message;
							validator.invalid[element.name] = true;
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			}
		}

	});

	// Ajax mode: abort
	// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
	// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

	var pendingRequests = {},
	    ajax;

	// Use a prefilter if available (1.5+)
	if ($.ajaxPrefilter) {
		$.ajaxPrefilter(function (settings, _, xhr) {
			var port = settings.port;
			if (settings.mode === "abort") {
				if (pendingRequests[port]) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {

		// Proxy ajax
		ajax = $.ajax;
		$.ajax = function (settings) {
			var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
			    port = ("port" in settings ? settings : $.ajaxSettings).port;
			if (mode === "abort") {
				if (pendingRequests[port]) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = ajax.apply(this, arguments);
				return pendingRequests[port];
			}
			return ajax.apply(this, arguments);
		};
	}
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Owl Carousel v2.2.1
 * Copyright 2013-2017 David Deutsch
 * Licensed under  ()
 */
/**
 * Owl carousel
 * @version 2.1.6
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function ($, window, document, undefined) {

	/**
  * Creates a carousel.
  * @class The Owl Carousel.
  * @public
  * @param {HTMLElement|jQuery} element - The element to create the carousel for.
  * @param {Object} [options] - The options
  */
	function Owl(element, options) {

		/**
   * Current settings for the carousel.
   * @public
   */
		this.settings = null;

		/**
   * Current options set by the caller including defaults.
   * @public
   */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
   * Plugin element.
   * @public
   */
		this.$element = $(element);

		/**
   * Proxied event handlers.
   * @protected
   */
		this._handlers = {};

		/**
   * References to the running plugins of this carousel.
   * @protected
   */
		this._plugins = {};

		/**
   * Currently suppressed events to prevent them from beeing retriggered.
   * @protected
   */
		this._supress = {};

		/**
   * Absolute current position.
   * @protected
   */
		this._current = null;

		/**
   * Animation speed in milliseconds.
   * @protected
   */
		this._speed = null;

		/**
   * Coordinates of all items in pixel.
   * @todo The name of this member is missleading.
   * @protected
   */
		this._coordinates = [];

		/**
   * Current breakpoint.
   * @todo Real media queries would be nice.
   * @protected
   */
		this._breakpoint = null;

		/**
   * Current width of the plugin element.
   */
		this._width = null;

		/**
   * All real items.
   * @protected
   */
		this._items = [];

		/**
   * All cloned items.
   * @protected
   */
		this._clones = [];

		/**
   * Merge values of all items.
   * @todo Maybe this could be part of a plugin.
   * @protected
   */
		this._mergers = [];

		/**
   * Widths of all items.
   */
		this._widths = [];

		/**
   * Invalidated parts within the update process.
   * @protected
   */
		this._invalidated = {};

		/**
   * Ordered list of workers for the update process.
   * @protected
   */
		this._pipe = [];

		/**
   * Current state information for the drag operation.
   * @todo #261
   * @protected
   */
		this._drag = {
			time: null,
			target: null,
			pointer: null,
			stage: {
				start: null,
				current: null
			},
			direction: null
		};

		/**
   * Current state information and their tags.
   * @type {Object}
   * @protected
   */
		this._states = {
			current: {},
			tags: {
				'initializing': ['busy'],
				'animating': ['busy'],
				'dragging': ['interacting']
			}
		};

		$.each(['onResize', 'onThrottledResize'], $.proxy(function (i, handler) {
			this._handlers[handler] = $.proxy(this[handler], this);
		}, this));

		$.each(Owl.Plugins, $.proxy(function (key, plugin) {
			this._plugins[key.charAt(0).toLowerCase() + key.slice(1)] = new plugin(this);
		}, this));

		$.each(Owl.Workers, $.proxy(function (priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
  * Default options for the carousel.
  * @public
  */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,
		rewind: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,

		fallbackEasing: 'swing',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		refreshClass: 'owl-refresh',
		loadedClass: 'owl-loaded',
		loadingClass: 'owl-loading',
		rtlClass: 'owl-rtl',
		responsiveClass: 'owl-responsive',
		dragClass: 'owl-drag',
		itemClass: 'owl-item',
		stageClass: 'owl-stage',
		stageOuterClass: 'owl-stage-outer',
		grabClass: 'owl-grab'
	};

	/**
  * Enumeration for width.
  * @public
  * @readonly
  * @enum {String}
  */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
  * Enumeration for types.
  * @public
  * @readonly
  * @enum {String}
  */
	Owl.Type = {
		Event: 'event',
		State: 'state'
	};

	/**
  * Contains all registered plugins.
  * @public
  */
	Owl.Plugins = {};

	/**
  * List of workers involved in the update process.
  */
	Owl.Workers = [{
		filter: ['width', 'settings'],
		run: function run() {
			this._width = this.$element.width();
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: ['items', 'settings'],
		run: function run() {
			this.$stage.children('.cloned').remove();
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run(cache) {
			var margin = this.settings.margin || '',
			    grid = !this.settings.autoWidth,
			    rtl = this.settings.rtl,
			    css = {
				'width': 'auto',
				'margin-left': rtl ? margin : '',
				'margin-right': rtl ? '' : margin
			};

			!grid && this.$stage.children().css(css);

			cache.css = css;
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run(cache) {
			var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
			    merge = null,
			    iterator = this._items.length,
			    grid = !this.settings.autoWidth,
			    widths = [];

			cache.items = {
				merge: false,
				width: width
			};

			while (iterator--) {
				merge = this._mergers[iterator];
				merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;

				cache.items.merge = merge > 1 || cache.items.merge;

				widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
			}

			this._widths = widths;
		}
	}, {
		filter: ['items', 'settings'],
		run: function run() {
			var clones = [],
			    items = this._items,
			    settings = this.settings,

			// TODO: Should be computed from number of min width items in stage
			view = Math.max(settings.items * 2, 4),
			    size = Math.ceil(items.length / 2) * 2,
			    repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
			    append = '',
			    prepend = '';

			repeat /= 2;

			while (repeat--) {
				// Switch to only using appended clones
				clones.push(this.normalize(clones.length / 2, true));
				append = append + items[clones[clones.length - 1]][0].outerHTML;
				clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
				prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
			}

			this._clones = clones;

			$(append).addClass('cloned').appendTo(this.$stage);
			$(prepend).addClass('cloned').prependTo(this.$stage);
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run() {
			var rtl = this.settings.rtl ? 1 : -1,
			    size = this._clones.length + this._items.length,
			    iterator = -1,
			    previous = 0,
			    current = 0,
			    coordinates = [];

			while (++iterator < size) {
				previous = coordinates[iterator - 1] || 0;
				current = this._widths[this.relative(iterator)] + this.settings.margin;
				coordinates.push(previous + current * rtl);
			}

			this._coordinates = coordinates;
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run() {
			var padding = this.settings.stagePadding,
			    coordinates = this._coordinates,
			    css = {
				'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
				'padding-left': padding || '',
				'padding-right': padding || ''
			};

			this.$stage.css(css);
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run(cache) {
			var iterator = this._coordinates.length,
			    grid = !this.settings.autoWidth,
			    items = this.$stage.children();

			if (grid && cache.items.merge) {
				while (iterator--) {
					cache.css.width = this._widths[this.relative(iterator)];
					items.eq(iterator).css(cache.css);
				}
			} else if (grid) {
				cache.css.width = cache.items.width;
				items.css(cache.css);
			}
		}
	}, {
		filter: ['items'],
		run: function run() {
			this._coordinates.length < 1 && this.$stage.removeAttr('style');
		}
	}, {
		filter: ['width', 'items', 'settings'],
		run: function run(cache) {
			cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
			cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
			this.reset(cache.current);
		}
	}, {
		filter: ['position'],
		run: function run() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: ['width', 'position', 'items', 'settings'],
		run: function run() {
			var rtl = this.settings.rtl ? 1 : -1,
			    padding = this.settings.stagePadding * 2,
			    begin = this.coordinates(this.current()) + padding,
			    end = begin + this.width() * rtl,
			    inner,
			    outer,
			    matches = [],
			    i,
			    n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if (this.op(inner, '<=', begin) && this.op(inner, '>', end) || this.op(outer, '<', begin) && this.op(outer, '>', end)) {
					matches.push(i);
				}
			}

			this.$stage.children('.active').removeClass('active');
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');

			if (this.settings.center) {
				this.$stage.children('.center').removeClass('center');
				this.$stage.children().eq(this.current()).addClass('center');
			}
		}
	}];

	/**
  * Initializes the carousel.
  * @protected
  */
	Owl.prototype.initialize = function () {
		this.enter('initializing');
		this.trigger('initialize');

		this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

		if (this.settings.autoWidth && !this.is('pre-loading')) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
			}
		}

		this.$element.addClass(this.options.loadingClass);

		// create stage
		this.$stage = $('<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>');

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// check visibility
		if (this.$element.is(':visible')) {
			// update view
			this.refresh();
		} else {
			// invalidate width
			this.invalidate('width');
		}

		this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);

		// register event handlers
		this.registerEventHandlers();

		this.leave('initializing');
		this.trigger('initialized');
	};

	/**
  * Setups the current settings.
  * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
  * @todo Support for media queries by using `matchMedia` would be nice.
  * @public
  */
	Owl.prototype.setup = function () {
		var viewport = this.viewport(),
		    overwrites = this.options.responsive,
		    match = -1,
		    settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function (breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			if (typeof settings.stagePadding === 'function') {
				settings.stagePadding = settings.stagePadding();
			}
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class', this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match));
			}
		}

		this.trigger('change', { property: { name: 'settings', value: settings } });
		this._breakpoint = match;
		this.settings = settings;
		this.invalidate('settings');
		this.trigger('changed', { property: { name: 'settings', value: this.settings } });
	};

	/**
  * Updates option logic if necessery.
  * @protected
  */
	Owl.prototype.optionsLogic = function () {
		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
  * Prepares an item before add.
  * @todo Rename event parameter `content` to `item`.
  * @protected
  * @returns {jQuery|HTMLElement} - The item container.
  */
	Owl.prototype.prepare = function (item) {
		var event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>').addClass(this.options.itemClass).append(item);
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
  * Updates the view.
  * @public
  */
	Owl.prototype.update = function () {
		var i = 0,
		    n = this._pipe.length,
		    filter = $.proxy(function (p) {
			return this[p];
		}, this._invalidated),
		    cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};

		!this.is('valid') && this.enter('valid');
	};

	/**
  * Gets the width of the view.
  * @public
  * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
  * @returns {Number} - The width of the view in pixel.
  */
	Owl.prototype.width = function (dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
  * Refreshes the carousel primarily for adaptive purposes.
  * @public
  */
	Owl.prototype.refresh = function () {
		this.enter('refreshing');
		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		this.$element.addClass(this.options.refreshClass);

		this.update();

		this.$element.removeClass(this.options.refreshClass);

		this.leave('refreshing');
		this.trigger('refreshed');
	};

	/**
  * Checks window `resize` event.
  * @protected
  */
	Owl.prototype.onThrottledResize = function () {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
	};

	/**
  * Checks window `resize` event.
  * @protected
  */
	Owl.prototype.onResize = function () {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (!this.$element.is(':visible')) {
			return false;
		}

		this.enter('resizing');

		if (this.trigger('resize').isDefaultPrevented()) {
			this.leave('resizing');
			return false;
		}

		this.invalidate('width');

		this.refresh();

		this.leave('resizing');
		this.trigger('resized');
	};

	/**
  * Registers event handlers.
  * @todo Check `msPointerEnabled`
  * @todo #261
  * @protected
  */
	Owl.prototype.registerEventHandlers = function () {
		if ($.support.transition) {
			this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
		}

		if (this.settings.responsive !== false) {
			this.on(window, 'resize', this._handlers.onThrottledResize);
		}

		if (this.settings.mouseDrag) {
			this.$element.addClass(this.options.dragClass);
			this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('dragstart.owl.core selectstart.owl.core', function () {
				return false;
			});
		}

		if (this.settings.touchDrag) {
			this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
		}
	};

	/**
  * Handles `touchstart` and `mousedown` events.
  * @todo Horizontal swipe threshold as option
  * @todo #261
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onDragStart = function (event) {
		var stage = null;

		if (event.which === 3) {
			return;
		}

		if ($.support.transform) {
			stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
			stage = {
				x: stage[stage.length === 16 ? 12 : 4],
				y: stage[stage.length === 16 ? 13 : 5]
			};
		} else {
			stage = this.$stage.position();
			stage = {
				x: this.settings.rtl ? stage.left + this.$stage.width() - this.width() + this.settings.margin : stage.left,
				y: stage.top
			};
		}

		if (this.is('animating')) {
			$.support.transform ? this.animate(stage.x) : this.$stage.stop();
			this.invalidate('position');
		}

		this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');

		this.speed(0);

		this._drag.time = new Date().getTime();
		this._drag.target = $(event.target);
		this._drag.stage.start = stage;
		this._drag.stage.current = stage;
		this._drag.pointer = this.pointer(event);

		$(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));

		$(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function (event) {
			var delta = this.difference(this._drag.pointer, this.pointer(event));

			$(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));

			if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
				return;
			}

			event.preventDefault();

			this.enter('dragging');
			this.trigger('drag');
		}, this));
	};

	/**
  * Handles the `touchmove` and `mousemove` events.
  * @todo #261
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onDragMove = function (event) {
		var minimum = null,
		    maximum = null,
		    pull = null,
		    delta = this.difference(this._drag.pointer, this.pointer(event)),
		    stage = this.difference(this._drag.stage.start, delta);

		if (!this.is('dragging')) {
			return;
		}

		event.preventDefault();

		if (this.settings.loop) {
			minimum = this.coordinates(this.minimum());
			maximum = this.coordinates(this.maximum() + 1) - minimum;
			stage.x = ((stage.x - minimum) % maximum + maximum) % maximum + minimum;
		} else {
			minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
			stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
		}

		this._drag.stage.current = stage;

		this.animate(stage.x);
	};

	/**
  * Handles the `touchend` and `mouseup` events.
  * @todo #261
  * @todo Threshold for click event
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onDragEnd = function (event) {
		var delta = this.difference(this._drag.pointer, this.pointer(event)),
		    stage = this._drag.stage.current,
		    direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';

		$(document).off('.owl.core');

		this.$element.removeClass(this.options.grabClass);

		if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
			this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
			this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
			this.invalidate('position');
			this.update();

			this._drag.direction = direction;

			if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
				this._drag.target.one('click.owl.core', function () {
					return false;
				});
			}
		}

		if (!this.is('dragging')) {
			return;
		}

		this.leave('dragging');
		this.trigger('dragged');
	};

	/**
  * Gets absolute position of the closest item for a coordinate.
  * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
  * @protected
  * @param {Number} coordinate - The coordinate in pixel.
  * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
  * @return {Number} - The absolute position of the closest item.
  */
	Owl.prototype.closest = function (coordinate, direction) {
		var position = -1,
		    pull = 30,
		    width = this.width(),
		    coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function (index, value) {
				// on a left pull, check on current index
				if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
					position = index;
					// on a right pull, check on previous index
					// to do so, subtract width from value and set position = index + 1
				} else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
					position = index + 1;
				} else if (this.op(coordinate, '<', value) && this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
					position = direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
  * Animates the stage.
  * @todo #270
  * @public
  * @param {Number} coordinate - The coordinate in pixels.
  */
	Owl.prototype.animate = function (coordinate) {
		var animate = this.speed() > 0;

		this.is('animating') && this.onTransitionEnd();

		if (animate) {
			this.enter('animating');
			this.trigger('translate');
		}

		if ($.support.transform3d && $.support.transition) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px,0px,0px)',
				transition: this.speed() / 1000 + 's'
			});
		} else if (animate) {
			this.$stage.animate({
				left: coordinate + 'px'
			}, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
		} else {
			this.$stage.css({
				left: coordinate + 'px'
			});
		}
	};

	/**
  * Checks whether the carousel is in a specific state or not.
  * @param {String} state - The state to check.
  * @returns {Boolean} - The flag which indicates if the carousel is busy.
  */
	Owl.prototype.is = function (state) {
		return this._states.current[state] && this._states.current[state] > 0;
	};

	/**
  * Sets the absolute position of the current item.
  * @public
  * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
  * @returns {Number} - The absolute position of the current item.
  */
	Owl.prototype.current = function (position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
  * Invalidates the given part of the update routine.
  * @param {String} [part] - The part to invalidate.
  * @returns {Array.<String>} - The invalidated parts.
  */
	Owl.prototype.invalidate = function (part) {
		if ($.type(part) === 'string') {
			this._invalidated[part] = true;
			this.is('valid') && this.leave('valid');
		}
		return $.map(this._invalidated, function (v, i) {
			return i;
		});
	};

	/**
  * Resets the absolute position of the current item.
  * @public
  * @param {Number} position - The absolute position of the new item.
  */
	Owl.prototype.reset = function (position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress(['translate', 'translated']);

		this.animate(this.coordinates(position));

		this.release(['translate', 'translated']);
	};

	/**
  * Normalizes an absolute or a relative position of an item.
  * @public
  * @param {Number} position - The absolute or relative position to normalize.
  * @param {Boolean} [relative=false] - Whether the given position is relative or not.
  * @returns {Number} - The normalized position.
  */
	Owl.prototype.normalize = function (position, relative) {
		var n = this._items.length,
		    m = relative ? 0 : this._clones.length;

		if (!this.isNumeric(position) || n < 1) {
			position = undefined;
		} else if (position < 0 || position >= n + m) {
			position = ((position - m / 2) % n + n) % n + m / 2;
		}

		return position;
	};

	/**
  * Converts an absolute position of an item into a relative one.
  * @public
  * @param {Number} position - The absolute position to convert.
  * @returns {Number} - The converted position.
  */
	Owl.prototype.relative = function (position) {
		position -= this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
  * Gets the maximum position for the current item.
  * @public
  * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
  * @returns {Number}
  */
	Owl.prototype.maximum = function (relative) {
		var settings = this.settings,
		    maximum = this._coordinates.length,
		    iterator,
		    reciprocalItemsWidth,
		    elementWidth;

		if (settings.loop) {
			maximum = this._clones.length / 2 + this._items.length - 1;
		} else if (settings.autoWidth || settings.merge) {
			iterator = this._items.length;
			reciprocalItemsWidth = this._items[--iterator].width();
			elementWidth = this.$element.width();
			while (iterator--) {
				reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
				if (reciprocalItemsWidth > elementWidth) {
					break;
				}
			}
			maximum = iterator + 1;
		} else if (settings.center) {
			maximum = this._items.length - 1;
		} else {
			maximum = this._items.length - settings.items;
		}

		if (relative) {
			maximum -= this._clones.length / 2;
		}

		return Math.max(maximum, 0);
	};

	/**
  * Gets the minimum position for the current item.
  * @public
  * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
  * @returns {Number}
  */
	Owl.prototype.minimum = function (relative) {
		return relative ? 0 : this._clones.length / 2;
	};

	/**
  * Gets an item at the specified relative position.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
  */
	Owl.prototype.items = function (position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
  * Gets an item at the specified relative position.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
  */
	Owl.prototype.mergers = function (position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
  * Gets the absolute positions of clones for an item.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
  */
	Owl.prototype.clones = function (position) {
		var odd = this._clones.length / 2,
		    even = odd + this._items.length,
		    map = function map(index) {
			return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2;
		};

		if (position === undefined) {
			return $.map(this._clones, function (v, i) {
				return map(i);
			});
		}

		return $.map(this._clones, function (v, i) {
			return v === position ? map(i) : null;
		});
	};

	/**
  * Sets the current animation speed.
  * @public
  * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
  * @returns {Number} - The current animation speed in milliseconds.
  */
	Owl.prototype.speed = function (speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
  * Gets the coordinate of an item.
  * @todo The name of this method is missleanding.
  * @public
  * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
  * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
  */
	Owl.prototype.coordinates = function (position) {
		var multiplier = 1,
		    newPosition = position - 1,
		    coordinate;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function (coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			if (this.settings.rtl) {
				multiplier = -1;
				newPosition = position + 1;
			}

			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
		} else {
			coordinate = this._coordinates[newPosition] || 0;
		}

		coordinate = Math.ceil(coordinate);

		return coordinate;
	};

	/**
  * Calculates the speed for a translation.
  * @protected
  * @param {Number} from - The absolute position of the start item.
  * @param {Number} to - The absolute position of the target item.
  * @param {Number} [factor=undefined] - The time factor in milliseconds.
  * @returns {Number} - The time in milliseconds for the translation.
  */
	Owl.prototype.duration = function (from, to, factor) {
		if (factor === 0) {
			return 0;
		}

		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs(factor || this.settings.smartSpeed);
	};

	/**
  * Slides to the specified item.
  * @public
  * @param {Number} position - The position of the item.
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.to = function (position, speed) {
		var current = this.current(),
		    revert = null,
		    distance = position - this.relative(current),
		    direction = (distance > 0) - (distance < 0),
		    items = this._items.length,
		    minimum = this.minimum(),
		    maximum = this.maximum();

		if (this.settings.loop) {
			if (!this.settings.rewind && Math.abs(distance) > items / 2) {
				distance += direction * -1 * items;
			}

			position = current + distance;
			revert = ((position - minimum) % items + items) % items + minimum;

			if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
				current = revert - distance;
				position = revert;
				this.reset(current);
			}
		} else if (this.settings.rewind) {
			maximum += 1;
			position = (position % maximum + maximum) % maximum;
		} else {
			position = Math.max(minimum, Math.min(maximum, position));
		}

		this.speed(this.duration(current, position, speed));
		this.current(position);

		if (this.$element.is(':visible')) {
			this.update();
		}
	};

	/**
  * Slides to the next item.
  * @public
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.next = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
  * Slides to the previous item.
  * @public
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.prev = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
  * Handles the end of an animation.
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onTransitionEnd = function (event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.leave('animating');
		this.trigger('translated');
	};

	/**
  * Gets viewport width.
  * @protected
  * @return {Number} - The width in pixel.
  */
	Owl.prototype.viewport = function () {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			console.warn('Can not detect viewport width.');
		}
		return width;
	};

	/**
  * Replaces the current content.
  * @public
  * @param {HTMLElement|jQuery|String} content - The new content.
  */
	Owl.prototype.replace = function (content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = content instanceof jQuery ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function () {
			return this.nodeType === 1;
		}).each($.proxy(function (index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
  * Adds an item.
  * @todo Use `item` instead of `content` for the event arguments.
  * @public
  * @param {HTMLElement|jQuery|String} content - The item content to add.
  * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
  */
	Owl.prototype.add = function (content, position) {
		var current = this.relative(this._current);

		position = position === undefined ? this._items.length : this.normalize(position, true);
		content = content instanceof jQuery ? content : $(content);

		this.trigger('add', { content: content, position: position });

		content = this.prepare(content);

		if (this._items.length === 0 || position === this._items.length) {
			this._items.length === 0 && this.$stage.append(content);
			this._items.length !== 0 && this._items[position - 1].after(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this._items[current] && this.reset(this._items[current].index());

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
  * Removes an item by its position.
  * @todo Use `item` instead of `content` for the event arguments.
  * @public
  * @param {Number} position - The relative position of the item to remove.
  */
	Owl.prototype.remove = function (position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
  * Preloads images with auto width.
  * @todo Replace by a more generic approach
  * @protected
  */
	Owl.prototype.preloadAutoWidthImages = function (images) {
		images.each($.proxy(function (i, element) {
			this.enter('pre-loading');
			element = $(element);
			$(new Image()).one('load', $.proxy(function (e) {
				element.attr('src', e.target.src);
				element.css('opacity', 1);
				this.leave('pre-loading');
				!this.is('pre-loading') && !this.is('initializing') && this.refresh();
			}, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
		}, this));
	};

	/**
  * Destroys the carousel.
  * @public
  */
	Owl.prototype.destroy = function () {

		this.$element.off('.owl.core');
		this.$stage.off('.owl.core');
		$(document).off('.owl.core');

		if (this.settings.responsive !== false) {
			window.clearTimeout(this.resizeTimer);
			this.off(window, 'resize', this._handlers.onThrottledResize);
		}

		for (var i in this._plugins) {
			this._plugins[i].destroy();
		}

		this.$stage.children('.cloned').remove();

		this.$stage.unwrap();
		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();

		this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), '')).removeData('owl.carousel');
	};

	/**
  * Operators to calculate right-to-left and left-to-right.
  * @protected
  * @param {Number} [a] - The left side operand.
  * @param {String} [o] - The operator.
  * @param {Number} [b] - The right side operand.
  */
	Owl.prototype.op = function (a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
  * Attaches to an internal event.
  * @protected
  * @param {HTMLElement} element - The event source.
  * @param {String} event - The event name.
  * @param {Function} listener - The event handler to attach.
  * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
  */
	Owl.prototype.on = function (element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
  * Detaches from an internal event.
  * @protected
  * @param {HTMLElement} element - The event source.
  * @param {String} event - The event name.
  * @param {Function} listener - The attached event handler to detach.
  * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
  */
	Owl.prototype.off = function (element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
  * Triggers a public event.
  * @todo Remove `status`, `relatedTarget` should be used instead.
  * @protected
  * @param {String} name - The event name.
  * @param {*} [data=null] - The event data.
  * @param {String} [namespace=carousel] - The event namespace.
  * @param {String} [state] - The state which is associated with the event.
  * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
  * @returns {Event} - The event arguments.
  */
	Owl.prototype.trigger = function (name, data, namespace, state, enter) {
		var status = {
			item: { count: this._items.length, index: this.current() }
		},
		    handler = $.camelCase($.grep(['on', name, namespace], function (v) {
			return v;
		}).join('-').toLowerCase()),
		    event = $.Event([name, 'owl', namespace || 'carousel'].join('.').toLowerCase(), $.extend({ relatedTarget: this }, status, data));

		if (!this._supress[name]) {
			$.each(this._plugins, function (name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.register({ type: Owl.Type.Event, name: name });
			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].call(this, event);
			}
		}

		return event;
	};

	/**
  * Enters a state.
  * @param name - The state name.
  */
	Owl.prototype.enter = function (name) {
		$.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
			if (this._states.current[name] === undefined) {
				this._states.current[name] = 0;
			}

			this._states.current[name]++;
		}, this));
	};

	/**
  * Leaves a state.
  * @param name - The state name.
  */
	Owl.prototype.leave = function (name) {
		$.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
			this._states.current[name]--;
		}, this));
	};

	/**
  * Registers an event or state.
  * @public
  * @param {Object} object - The event or state to register.
  */
	Owl.prototype.register = function (object) {
		if (object.type === Owl.Type.Event) {
			if (!$.event.special[object.name]) {
				$.event.special[object.name] = {};
			}

			if (!$.event.special[object.name].owl) {
				var _default = $.event.special[object.name]._default;
				$.event.special[object.name]._default = function (e) {
					if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
						return _default.apply(this, arguments);
					}
					return e.namespace && e.namespace.indexOf('owl') > -1;
				};
				$.event.special[object.name].owl = true;
			}
		} else if (object.type === Owl.Type.State) {
			if (!this._states.tags[object.name]) {
				this._states.tags[object.name] = object.tags;
			} else {
				this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
			}

			this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function (tag, i) {
				return $.inArray(tag, this._states.tags[object.name]) === i;
			}, this));
		}
	};

	/**
  * Suppresses events.
  * @protected
  * @param {Array.<String>} events - The events to suppress.
  */
	Owl.prototype.suppress = function (events) {
		$.each(events, $.proxy(function (index, event) {
			this._supress[event] = true;
		}, this));
	};

	/**
  * Releases suppressed events.
  * @protected
  * @param {Array.<String>} events - The events to release.
  */
	Owl.prototype.release = function (events) {
		$.each(events, $.proxy(function (index, event) {
			delete this._supress[event];
		}, this));
	};

	/**
  * Gets unified pointer coordinates from event.
  * @todo #261
  * @protected
  * @param {Event} - The `mousedown` or `touchstart` event.
  * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
  */
	Owl.prototype.pointer = function (event) {
		var result = { x: null, y: null };

		event = event.originalEvent || event || window.event;

		event = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event;

		if (event.pageX) {
			result.x = event.pageX;
			result.y = event.pageY;
		} else {
			result.x = event.clientX;
			result.y = event.clientY;
		}

		return result;
	};

	/**
  * Determines if the input is a Number or something that can be coerced to a Number
  * @protected
  * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
  * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
  */
	Owl.prototype.isNumeric = function (number) {
		return !isNaN(parseFloat(number));
	};

	/**
  * Gets the difference of two vectors.
  * @todo #261
  * @protected
  * @param {Object} - The first vector.
  * @param {Object} - The second vector.
  * @returns {Object} - The difference.
  */
	Owl.prototype.difference = function (first, second) {
		return {
			x: first.x - second.x,
			y: first.y - second.y
		};
	};

	/**
  * The jQuery Plugin for the Owl Carousel
  * @todo Navigation plugin `next` and `prev`
  * @public
  */
	$.fn.owlCarousel = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function () {
			var $this = $(this),
			    data = $this.data('owl.carousel');

			if (!data) {
				data = new Owl(this, (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
				$this.data('owl.carousel', data);

				$.each(['next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'], function (i, event) {
					data.register({ type: Owl.Type.Event, name: event });
					data.$element.on(event + '.owl.carousel.core', $.proxy(function (e) {
						if (e.namespace && e.relatedTarget !== this) {
							this.suppress([event]);
							data[event].apply(this, [].slice.call(arguments, 1));
							this.release([event]);
						}
					}, data));
				});
			}

			if (typeof option == 'string' && option.charAt(0) !== '_') {
				data[option].apply(data, args);
			}
		});
	};

	/**
  * The constructor for the jQuery Plugin
  * @public
  */
	$.fn.owlCarousel.Constructor = Owl;
})(window.Zepto || window.jQuery, window, document);

/**
 * AutoRefresh Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the auto refresh plugin.
  * @class The Auto Refresh Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var AutoRefresh = function AutoRefresh(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Refresh interval.
   * @protected
   * @type {number}
   */
		this._interval = null;

		/**
   * Whether the element is currently visible or not.
   * @protected
   * @type {Boolean}
   */
		this._visible = null;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoRefresh) {
					this.watch();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  */
	AutoRefresh.Defaults = {
		autoRefresh: true,
		autoRefreshInterval: 500
	};

	/**
  * Watches the element.
  */
	AutoRefresh.prototype.watch = function () {
		if (this._interval) {
			return;
		}

		this._visible = this._core.$element.is(':visible');
		this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
	};

	/**
  * Refreshes the element.
  */
	AutoRefresh.prototype.refresh = function () {
		if (this._core.$element.is(':visible') === this._visible) {
			return;
		}

		this._visible = !this._visible;

		this._core.$element.toggleClass('owl-hidden', !this._visible);

		this._visible && this._core.invalidate('width') && this._core.refresh();
	};

	/**
  * Destroys the plugin.
  */
	AutoRefresh.prototype.destroy = function () {
		var handler, property;

		window.clearInterval(this._interval);

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;
})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the lazy plugin.
  * @class The Lazy Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var Lazy = function Lazy(carousel) {

		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Already loaded items.
   * @protected
   * @type {Array.<jQuery>}
   */
		this._loaded = [];

		/**
   * Event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function (e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if (e.property && e.property.name == 'position' || e.type == 'initialized') {
					var settings = this._core.settings,
					    n = settings.center && Math.ceil(settings.items / 2) || settings.items,
					    i = settings.center && n * -1 || 0,
					    position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
					    clones = this._core.clones().length,
					    load = $.proxy(function (i, v) {
						this.load(v);
					}, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position)), load);
						position++;
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  */
	Lazy.Defaults = {
		lazyLoad: false
	};

	/**
  * Loads all resources of an item at the specified position.
  * @param {Number} position - The absolute position of the item.
  * @protected
  */
	Lazy.prototype.load = function (position) {
		var $item = this._core.$stage.children().eq(position),
		    $elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function (index, element) {
			var $element = $(element),
			    image,
			    url = window.devicePixelRatio > 1 && $element.attr('data-src-retina') || $element.attr('data-src');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function () {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function () {
					$element.css({
						'background-image': 'url("' + url + '")',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Lazy.prototype.destroy = function () {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the auto height plugin.
  * @class The Auto Height Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var AutoHeight = function AutoHeight(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight && e.property.name == 'position') {
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoHeight && e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
  * Updates the view.
  */
	AutoHeight.prototype.update = function () {
		var start = this._core._current,
		    end = start + this._core.settings.items,
		    visible = this._core.$stage.children().toArray().slice(start, end),
		    heights = [],
		    maxheight = 0;

		$.each(visible, function (index, item) {
			heights.push($(item).height());
		});

		maxheight = Math.max.apply(null, heights);

		this._core.$stage.parent().height(maxheight).addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function () {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the video plugin.
  * @class The Video Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var Video = function Video(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Cache all video URLs.
   * @protected
   * @type {Object}
   */
		this._videos = {};

		/**
   * Current playing item.
   * @protected
   * @type {jQuery}
   */
		this._playing = null;

		/**
   * All event handlers.
   * @todo The cloned content removale is too late
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					this._core.register({ type: 'state', name: 'playing', tags: ['interacting'] });
				}
			}, this),
			'resize.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.is('resizing')) {
					this._core.$stage.find('.cloned .owl-video-frame').remove();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'position' && this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function (e) {
				if (!e.namespace) {
					return;
				}

				var $element = $(e.content).find('.owl-video');

				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) {
			this.play(e);
		}, this));
	};

	/**
  * Default options.
  * @public
  */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
  * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
  * @protected
  * @param {jQuery} target - The target containing the video data.
  * @param {jQuery} item - The item containing the video.
  */
	Video.prototype.fetch = function (target, item) {
		var type = function () {
			if (target.attr('data-vimeo-id')) {
				return 'vimeo';
			} else if (target.attr('data-vzaar-id')) {
				return 'vzaar';
			} else {
				return 'youtube';
			}
		}(),
		    id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
		    width = target.attr('data-width') || this._core.settings.videoWidth,
		    height = target.attr('data-height') || this._core.settings.videoHeight,
		    url = target.attr('href');

		if (url) {

			/*
   		Parses the id's out of the following urls (and probably more):
   		https://www.youtube.com/watch?v=:id
   		https://youtu.be/:id
   		https://vimeo.com/:id
   		https://vimeo.com/channels/:channel/:id
   		https://vimeo.com/groups/:group/videos/:id
   		https://app.vzaar.com/videos/:id
   			Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
   */

			id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else if (id[3].indexOf('vzaar') > -1) {
				type = 'vzaar';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
  * Creates video thumbnail.
  * @protected
  * @param {jQuery} target - The target containing the video data.
  * @param {Object} info - The video info object.
  * @see `fetch`
  */
	Video.prototype.thumbnail = function (target, video) {
		var tnLink,
		    icon,
		    path,
		    dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
		    customTn = target.find('img'),
		    srcType = 'src',
		    lazyClass = '',
		    settings = this._core.settings,
		    create = function create(path) {
			icon = '<div class="owl-video-play-icon"></div>';

			if (settings.lazyLoad) {
				tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
			} else {
				tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
			}
			target.after(tnLink);
			target.after(icon);
		};

		// wrap video content into owl-video-wrapper div
		target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: '//vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function success(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		} else if (video.type === 'vzaar') {
			$.ajax({
				type: 'GET',
				url: '//vzaar.com/api/videos/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function success(data) {
					path = data.framegrab_url;
					create(path);
				}
			});
		}
	};

	/**
  * Stops the current video.
  * @public
  */
	Video.prototype.stop = function () {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
		this._core.leave('playing');
		this._core.trigger('stopped', null, 'video');
	};

	/**
  * Starts the current video.
  * @public
  * @param {Event} event - The event arguments.
  */
	Video.prototype.play = function (event) {
		var target = $(event.target),
		    item = target.closest('.' + this._core.settings.itemClass),
		    video = this._videos[item.attr('data-video')],
		    width = video.width || '100%',
		    height = video.height || this._core.$stage.height(),
		    html;

		if (this._playing) {
			return;
		}

		this._core.enter('playing');
		this._core.trigger('play', null, 'video');

		item = this._core.items(this._core.relative(item.index()));

		this._core.reset(item.index());

		if (video.type === 'youtube') {
			html = '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
		} else if (video.type === 'vimeo') {
			html = '<iframe src="//player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + width + '" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		} else if (video.type === 'vzaar') {
			html = '<iframe frameborder="0"' + 'height="' + height + '"' + 'width="' + width + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen ' + 'src="//view.vzaar.com/' + video.id + '/player?autoplay=true"></iframe>';
		}

		$('<div class="owl-video-frame">' + html + '</div>').insertAfter(item.find('.owl-video'));

		this._playing = item.addClass('owl-video-playing');
	};

	/**
  * Checks whether an video is currently in full screen mode or not.
  * @todo Bad style because looks like a readonly method but changes members.
  * @protected
  * @returns {Boolean}
  */
	Video.prototype.isInFullScreen = function () {
		var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

		return element && $(element).parent().hasClass('owl-video-frame');
	};

	/**
  * Destroys the plugin.
  */
	Video.prototype.destroy = function () {
		var handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;
})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the animate plugin.
  * @class The Navigation Plugin
  * @param {Owl} scope - The Owl Carousel
  */
	var Animate = function Animate(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			'change.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					this.swapping = e.type == 'translated';
				}
			}, this),
			'translate.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
  * Default options.
  * @public
  */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
  * Toggles the animation classes whenever an translations starts.
  * @protected
  * @returns {Boolean|undefined}
  */
	Animate.prototype.swap = function () {

		if (this.core.settings.items !== 1) {
			return;
		}

		if (!$.support.animation || !$.support.transition) {
			return;
		}

		this.core.speed(0);

		var left,
		    clear = $.proxy(this.clear, this),
		    previous = this.core.$stage.children().eq(this.previous),
		    next = this.core.$stage.children().eq(this.next),
		    incoming = this.core.settings.animateIn,
		    outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.one($.support.animation.end, clear).css({ 'left': left + 'px' }).addClass('animated owl-animated-out').addClass(outgoing);
		}

		if (incoming) {
			next.one($.support.animation.end, clear).addClass('animated owl-animated-in').addClass(incoming);
		}
	};

	Animate.prototype.clear = function (e) {
		$(e.target).css({ 'left': '' }).removeClass('animated owl-animated-out owl-animated-in').removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
		this.core.onTransitionEnd();
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Animate.prototype.destroy = function () {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	/**
  * Creates the autoplay plugin.
  * @class The Autoplay Plugin
  * @param {Owl} scope - The Owl Carousel
  */
	var Autoplay = function Autoplay(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * The autoplay timeout.
   * @type {Timeout}
   */
		this._timeout = null;

		/**
   * Indicates whenever the autoplay is paused.
   * @type {Boolean}
   */
		this._paused = false;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'settings') {
					if (this._core.settings.autoplay) {
						this.play();
					} else {
						this.stop();
					}
				} else if (e.namespace && e.property.name === 'position') {
					//console.log('play?', e);
					if (this._core.settings.autoplay) {
						this._setAutoPlayInterval();
					}
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.autoplay) {
					this.play();
				}
			}, this),
			'play.owl.autoplay': $.proxy(function (e, t, s) {
				if (e.namespace) {
					this.play(t, s);
				}
			}, this),
			'stop.owl.autoplay': $.proxy(function (e) {
				if (e.namespace) {
					this.stop();
				}
			}, this),
			'mouseover.owl.autoplay': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.play();
				}
			}, this),
			'touchstart.owl.core': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'touchend.owl.core': $.proxy(function () {
				if (this._core.settings.autoplayHoverPause) {
					this.play();
				}
			}, this)
		};

		// register event handlers
		this._core.$element.on(this._handlers);

		// set default options
		this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
	};

	/**
  * Default options.
  * @public
  */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
  * Starts the autoplay.
  * @public
  * @param {Number} [timeout] - The interval before the next animation starts.
  * @param {Number} [speed] - The animation speed for the animations.
  */
	Autoplay.prototype.play = function (timeout, speed) {
		this._paused = false;

		if (this._core.is('rotating')) {
			return;
		}

		this._core.enter('rotating');

		this._setAutoPlayInterval();
	};

	/**
  * Gets a new timeout
  * @private
  * @param {Number} [timeout] - The interval before the next animation starts.
  * @param {Number} [speed] - The animation speed for the animations.
  * @return {Timeout}
  */
	Autoplay.prototype._getNextTimeout = function (timeout, speed) {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
		}
		return window.setTimeout($.proxy(function () {
			if (this._paused || this._core.is('busy') || this._core.is('interacting') || document.hidden) {
				return;
			}
			this._core.next(speed || this._core.settings.autoplaySpeed);
		}, this), timeout || this._core.settings.autoplayTimeout);
	};

	/**
  * Sets autoplay in motion.
  * @private
  */
	Autoplay.prototype._setAutoPlayInterval = function () {
		this._timeout = this._getNextTimeout();
	};

	/**
  * Stops the autoplay.
  * @public
  */
	Autoplay.prototype.stop = function () {
		if (!this._core.is('rotating')) {
			return;
		}

		window.clearTimeout(this._timeout);
		this._core.leave('rotating');
	};

	/**
  * Stops the autoplay.
  * @public
  */
	Autoplay.prototype.pause = function () {
		if (!this._core.is('rotating')) {
			return;
		}

		this._paused = true;
	};

	/**
  * Destroys the plugin.
  */
	Autoplay.prototype.destroy = function () {
		var handler, property;

		this.stop();

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {
	'use strict';

	/**
  * Creates the navigation plugin.
  * @class The Navigation Plugin
  * @param {Owl} carousel - The Owl Carousel.
  */

	var Navigation = function Navigation(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Indicates whether the plugin is initialized or not.
   * @protected
   * @type {Boolean}
   */
		this._initialized = false;

		/**
   * The current paging indexes.
   * @protected
   * @type {Array}
   */
		this._pages = [];

		/**
   * All DOM elements of the user interface.
   * @protected
   * @type {Object}
   */
		this._controls = {};

		/**
   * Markup for an indicator.
   * @protected
   * @type {Array.<String>}
   */
		this._templates = [];

		/**
   * The carousel element.
   * @type {jQuery}
   */
		this.$element = this._core.$element;

		/**
   * Overridden methods of the carousel.
   * @protected
   * @type {Object}
   */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.push('<div class="' + this._core.settings.dotClass + '">' + $(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
				}
			}, this),
			'added.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, this._templates.pop());
				}
			}, this),
			'remove.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && !this._initialized) {
					this._core.trigger('initialize', null, 'navigation');
					this.initialize();
					this.update();
					this.draw();
					this._initialized = true;
					this._core.trigger('initialized', null, 'navigation');
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._initialized) {
					this._core.trigger('refresh', null, 'navigation');
					this.update();
					this.draw();
					this._core.trigger('refreshed', null, 'navigation');
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  * @todo Rename `slideBy` to `navBy`
  */
	Navigation.Defaults = {
		nav: false,
		navText: ['prev', 'next'],
		navSpeed: false,
		navElement: 'div',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: ['owl-prev', 'owl-next'],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotsData: false,
		dotsSpeed: false,
		dotsContainer: false
	};

	/**
  * Initializes the layout of the plugin and extends the carousel.
  * @protected
  */
	Navigation.prototype.initialize = function () {
		var override,
		    settings = this._core.settings;

		// create DOM structure for relative navigation
		this._controls.$relative = (settings.navContainer ? $(settings.navContainer) : $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$previous = $('<' + settings.navElement + '>').addClass(settings.navClass[0]).html(settings.navText[0]).prependTo(this._controls.$relative).on('click', $.proxy(function (e) {
			this.prev(settings.navSpeed);
		}, this));
		this._controls.$next = $('<' + settings.navElement + '>').addClass(settings.navClass[1]).html(settings.navText[1]).appendTo(this._controls.$relative).on('click', $.proxy(function (e) {
			this.next(settings.navSpeed);
		}, this));

		// create DOM structure for absolute navigation
		if (!settings.dotsData) {
			this._templates = [$('<div>').addClass(settings.dotClass).append($('<span>')).prop('outerHTML')];
		}

		this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer) : $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$absolute.on('click', 'div', $.proxy(function (e) {
			var index = $(e.target).parent().is(this._controls.$absolute) ? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, settings.dotsSpeed);
		}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	};

	/**
  * Destroys the plugin.
  * @protected
  */
	Navigation.prototype.destroy = function () {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	/**
  * Updates the internal state.
  * @protected
  */
	Navigation.prototype.update = function () {
		var i,
		    j,
		    k,
		    lower = this._core.clones().length / 2,
		    upper = lower + this._core.items().length,
		    maximum = this._core.maximum(true),
		    settings = this._core.settings,
		    size = settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items;

		if (settings.slideBy !== 'page') {
			settings.slideBy = Math.min(settings.slideBy, settings.items);
		}

		if (settings.dots || settings.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: Math.min(maximum, i - lower),
						end: i - lower + size - 1
					});
					if (Math.min(maximum, i - lower) === maximum) {
						break;
					}
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	};

	/**
  * Draws the user interface.
  * @todo The option `dotsData` wont work.
  * @protected
  */
	Navigation.prototype.draw = function () {
		var difference,
		    settings = this._core.settings,
		    disabled = this._core.items().length <= settings.items,
		    index = this._core.relative(this._core.current()),
		    loop = settings.loop || settings.rewind;

		this._controls.$relative.toggleClass('disabled', !settings.nav || disabled);

		if (settings.nav) {
			this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true));
			this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true));
		}

		this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled);

		if (settings.dots) {
			difference = this._pages.length - this._controls.$absolute.children().length;

			if (settings.dotsData && difference !== 0) {
				this._controls.$absolute.html(this._templates.join(''));
			} else if (difference > 0) {
				this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
			} else if (difference < 0) {
				this._controls.$absolute.children().slice(difference).remove();
			}

			this._controls.$absolute.find('.active').removeClass('active');
			this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}
	};

	/**
  * Extends event data.
  * @protected
  * @param {Event} event - The event object which gets thrown.
  */
	Navigation.prototype.onTrigger = function (event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items)
		};
	};

	/**
  * Gets the current page position of the carousel.
  * @protected
  * @returns {Number}
  */
	Navigation.prototype.current = function () {
		var current = this._core.relative(this._core.current());
		return $.grep(this._pages, $.proxy(function (page, index) {
			return page.start <= current && page.end >= current;
		}, this)).pop();
	};

	/**
  * Gets the current succesor/predecessor position.
  * @protected
  * @returns {Number}
  */
	Navigation.prototype.getPosition = function (successor) {
		var position,
		    length,
		    settings = this._core.settings;

		if (settings.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[(position % length + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += settings.slideBy : position -= settings.slideBy;
		}

		return position;
	};

	/**
  * Slides to the next item or page.
  * @public
  * @param {Number} [speed=false] - The time in milliseconds for the transition.
  */
	Navigation.prototype.next = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	};

	/**
  * Slides to the previous item or page.
  * @public
  * @param {Number} [speed=false] - The time in milliseconds for the transition.
  */
	Navigation.prototype.prev = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	};

	/**
  * Slides to the specified item or page.
  * @public
  * @param {Number} position - The position of the item or page.
  * @param {Number} [speed] - The time in milliseconds for the transition.
  * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
  */
	Navigation.prototype.to = function (position, speed, standard) {
		var length;

		if (!standard && this._pages.length) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[(position % length + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {
	'use strict';

	/**
  * Creates the hash plugin.
  * @class The Hash Plugin
  * @param {Owl} carousel - The Owl Carousel
  */

	var Hash = function Hash(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Hash index for the items.
   * @protected
   * @type {Object}
   */
		this._hashes = {};

		/**
   * The carousel element.
   * @type {jQuery}
   */
		this.$element = this._core.$element;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function (e) {
				if (e.namespace && this._core.settings.startPosition === 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function (e) {
				if (e.namespace) {
					var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');

					if (!hash) {
						return;
					}

					this._hashes[hash] = e.content;
				}
			}, this),
			'changed.owl.carousel': $.proxy(function (e) {
				if (e.namespace && e.property.name === 'position') {
					var current = this._core.items(this._core.relative(this._core.current())),
					    hash = $.map(this._hashes, function (item, hash) {
						return item === current ? hash : null;
					}).join();

					if (!hash || window.location.hash.slice(1) === hash) {
						return;
					}

					window.location.hash = hash;
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function (e) {
			var hash = window.location.hash.substring(1),
			    items = this._core.$stage.children(),
			    position = this._hashes[hash] && items.index(this._hashes[hash]);

			if (position === undefined || position === this._core.current()) {
				return;
			}

			this._core.to(this._core.relative(position), false, true);
		}, this));
	};

	/**
  * Default options.
  * @public
  */
	Hash.Defaults = {
		URLhashListener: false
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Hash.prototype.destroy = function () {
		var handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
})(window.Zepto || window.jQuery, window, document);

/**
 * Support Plugin
 *
 * @version 2.1.0
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

	var style = $('<support>').get(0).style,
	    prefixes = 'Webkit Moz O ms'.split(' '),
	    events = {
		transition: {
			end: {
				WebkitTransition: 'webkitTransitionEnd',
				MozTransition: 'transitionend',
				OTransition: 'oTransitionEnd',
				transition: 'transitionend'
			}
		},
		animation: {
			end: {
				WebkitAnimation: 'webkitAnimationEnd',
				MozAnimation: 'animationend',
				OAnimation: 'oAnimationEnd',
				animation: 'animationend'
			}
		}
	},
	    tests = {
		csstransforms: function csstransforms() {
			return !!test('transform');
		},
		csstransforms3d: function csstransforms3d() {
			return !!test('perspective');
		},
		csstransitions: function csstransitions() {
			return !!test('transition');
		},
		cssanimations: function cssanimations() {
			return !!test('animation');
		}
	};

	function test(property, prefixed) {
		var result = false,
		    upper = property.charAt(0).toUpperCase() + property.slice(1);

		$.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function (i, property) {
			if (style[property] !== undefined) {
				result = prefixed ? property : true;
				return false;
			}
		});

		return result;
	}

	function prefixed(property) {
		return test(property, true);
	}

	if (tests.csstransitions()) {
		/* jshint -W053 */
		$.support.transition = new String(prefixed('transition'));
		$.support.transition.end = events.transition.end[$.support.transition];
	}

	if (tests.cssanimations()) {
		/* jshint -W053 */
		$.support.animation = new String(prefixed('animation'));
		$.support.animation.end = events.animation.end[$.support.animation];
	}

	if (tests.csstransforms()) {
		/* jshint -W053 */
		$.support.transform = new String(prefixed('transform'));
		$.support.transform3d = tests.csstransforms3d();
	}
})(window.Zepto || window.jQuery, window, document);

/***/ }),
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {

    var $carousel = $('.owl-carousel');

    function getCarouselOptions() {
        var settings = {
            center: true,
            items: 1,
            loop: true,
            margin: 10,
            nav: true,
            navText: false
        };

        if (_responsive2.default.matches('md')) {
            settings.items = 1.2;
        } else if (_responsive2.default.matches('lg-up')) {
            settings.items = 2;
        }

        return settings;
    }

    function getCarouselInstance() {
        return $carousel.data('owl.carousel');
    }

    function navigate(e) {
        var instance = getCarouselInstance();
        var $item = $(e.target).closest('.owl-item');

        if ($item.is('.center')) {
            return;
        } else if ($item.nextAll('.center').length) {
            instance.prev();
        } else {
            instance.next();
        }
    }

    function createCarousel() {
        $carousel.owlCarousel(getCarouselOptions());
        $carousel.on('click', '.owl-item', navigate);
    }

    function destroyCarousel() {
        var instance = getCarouselInstance();
        if (instance) instance.destroy();
    }

    function updateCarousel() {
        // Options / settings changed, destroy and recreate
        // carousel
        destroyCarousel();
        createCarousel();
    }

    _responsive2.default.enter('sm-down', updateCarousel);
    _responsive2.default.enter('md', updateCarousel);
    _responsive2.default.enter('lg-up', updateCarousel);
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {

    $('.percent-circle').circleProgress({
        value: 0,
        startAngle: -1.55,
        fill: "#d62431",
        emptyFill: "#2f2f2f",
        size: 146,
        thickness: 12
    });

    // This file is loaded on all pages, make sure we don't do anything
    // if we don't have required elements
    var $container = $('.percent-circle');
    if (!$container.length) return;

    // If user has scrolled to element then animated element out
    function update(e) {
        var offsetTop = $container.offset().top - $container.offset().top * 1 / 3;

        if (e.scrollTop > offsetTop || _scroller2.default.scrollTop() > offsetTop) {
            _scroller2.default.off('scroll', update);

            $container.each(function (i, el) {
                $(this).circleProgress({
                    value: $(el).data('percent')
                });
            });
        }
    }

    _scroller2.default.on('scroll', update);
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {

    // This file is loaded on all pages, make sure we don't do anything
    // if we don't have required elements
    var $container = $('.fake-container');
    if (!$container.length) return;

    // If user has scrolled > 100px then animated element out
    function update(e) {
        if (e.scrollTop > 100 || _scroller2.default.scrollTop() > 100) {
            _scroller2.default.off('scroll', update);

            $container.transition({
                'transition': function transition($el) {
                    return $el.addClass('fake-container--done');
                },
                'after': function after($el) {
                    return $el.addClass('is-hidden');
                }
            });
        }
    }

    _scroller2.default.on('scroll', update);
});

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _hoverSupport = __webpack_require__(2);

var _hoverSupport2 = _interopRequireDefault(_hoverSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
    var $container = $('.nav-aside-case');

    if (_hoverSupport2.default.hasHoverSupport()) {
        $container.on('mouseover', function () {
            $container.addClass('nav-aside-case--hover');
        });

        $container.on('mouseleave', function () {
            $container.removeClass('nav-aside-case--hover');
        });
    }
});

/***/ }),
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(18);

var _countup = __webpack_require__(9);

var _countup2 = _interopRequireDefault(_countup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
	// Keep navigation visible to user as long as it's relevant
	$('.js-about-navigation').inview({ 'viewportMargin': 190 });

	// Audio play button
	$('.js-play-button').on('click', function () {
		$('.js-play-audio').get(0).play();
	});

	$('.js-countup-user').each(function (i, element) {
		var $element = $(element);

		$element.appear({
			'callback': function callback() {

				var frequency = 4;
				var startCounter = 580000000;
				var startTime = 1496232287797;
				var afterMilliseconds = 2500;
				var userCount = startCounter + Math.floor((Date.now() - startTime) / 1000) * frequency;
				var countup = new _countup2.default(element, 0, userCount, 0, 2.5);
				countup.start();

				window.setInterval(function () {
					if (afterMilliseconds <= 0) {
						$('.js-countup-user').html(numberWithCommas(userCount++));
					}
					afterMilliseconds -= 1000 / frequency;
				}, 1000 / frequency);
			}
		});
	});

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Focusable tiles
	var $tiles = $('.js-values-tile');

	$(document).on('click', function (e) {
		if ($(e.target).parents().filter($tiles).length === 0) {
			$tiles.removeClass('is-active');
		}
	});

	$tiles.on('click', function (e) {
		$tiles.removeClass('is-active');
		$(this).addClass('is-active');
	});
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(14);

__webpack_require__(17);

$.validator.methods.email = function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(value);
};

$(function () {
    var $form = $('.js-contact-form');

    $form.form({});

    $form.find('input, select, textarea').labelEmpty();
});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Image gallery
 */

$(function () {
    var $gallery = $('.js-intro-gallery');
    var $images = [$gallery.find('img[data-group="1"]'), $gallery.find('img[data-group="2"]')];
    var count = $images[0].length;
    var index = 0;
    var timer = void 0;

    $images[0].add($images[1]).addClass('animation--extra-slow');

    function next() {
        var $prevImage = $images[0].eq(index).add($images[1].eq(index));
        index = (index + 1) % count;

        var $image = $images[0].eq(index).add($images[1].eq(index));

        $image.transition({
            'before': function before($image) {
                return $image.removeClass('is-hidden').appear('refresh').addClass('animation--fade-in animation--fade-in--inactive');
            },
            'transition': function transition($image) {
                return $image.removeClass('animation--fade-in--inactive');
            },
            'after': function after($image) {
                $prevImage.addClass('is-hidden');
                $image.removeClass('animation--fade-in');
            }
        });
    }

    timer = setInterval(next, 4000);
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Intro video play / pause when video is in view / out of view
 */

$(function () {

  var $intro = $('.js-landing-intro');
  var $video = $intro.find('video');
  var error = false;

  $intro.incenter({
    'align': 'top',
    'onactive': function onactive() {
      if ($video.length > 0) {
        $video.get(0).play();
      }
    },
    'oninactive': function oninactive() {
      if ($video.length > 0) {
        $video.get(0).pause();
      }
    }
  });
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

$(function () {

    // Navigation link highlighting when user scrolls
    $('.js-about-navigation a[href]').each(function (i, element) {
        var $element = $(element);
        var href = $element.attr('href').match(/(#.*)$/);

        $(href[0]).incenter({
            'align': 'top',
            'offset': 250,
            'compare': i === 0 ? 'before' : 'element',
            'onactive': function onactive() {
                return $element.addClass('is-active');
            },
            'oninactive': function oninactive() {
                return $element.removeClass('is-active');
            }
        });
    });
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * jQuery plugin to show project items
 */
var Projects = function () {
    _createClass(Projects, null, [{
        key: 'Defaults',
        get: function get() {
            return {};
        }
    }]);

    function Projects(container, opts) {
        _classCallCheck(this, Projects);

        var $container = this.$container = $(container);
        var $items = this.$items = $container.find('.js-project');
        var $content = this.$content = $items.children();
        var options = this.options = $.extend({}, this.constructor.Defaults, {}, opts);

        $content.appear({
            'margin': _responsive2.default.matches('sm-down') ? -50 : -200,

            // Opacity animation
            'duration': _responsive2.default.matches('sm-down') ? 325 : 1250,
            'delay': 0,

            'callback': this.show.bind(this)
        });
    }

    _createClass(Projects, [{
        key: 'show',
        value: function show($content) {
            var $project = $content.parent();
            var $overlay = $('<div class="appear-overlay"></div>').appendTo($project);

            setTimeout(function () {
                // Start overlay animation
                $overlay.addClass('is-active');

                setTimeout(function () {
                    // Start content fade-in animation
                    $project.addClass('is-visible');
                }, 750);

                setTimeout(function () {
                    $overlay.remove();
                    $project.addClass('project-ready');
                }, 1500);
            }, 16);
        }
    }]);

    return Projects;
}();

$.fn.projects = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('projects');

        if (!instance) {
            instance = new Projects($element, $.extend({}, $element.data(), opts));
            $element.data('projects', instance);
        }
    });
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(23);

$(function () {
    $('.js-testimonials').tabs();
});

/***/ }),
/* 45 */,
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

$(function () {

    var binded = {};
    var ignoreHashes = { 'top': true, 'introduction': true, 'footer': true };

    // Navigation link highlighting when user scrolls
    $('.js-navigation-links a[href]').each(function (i, element) {
        var $element = $(element);
        var href = $element.attr('href').match(/#(.*)$/);

        if (href) {
            $(href[0]).incenter({
                'onactive': function onactive() {
                    return $element.addClass('is-active');
                },
                'oninactive': function oninactive() {
                    return $element.removeClass('is-active');
                }
            });

            if (!(href[0] in binded)) {
                binded[href[0]] = true;

                $(href[0]).incenter({
                    'onactive': function onactive() {
                        // Update browser url if document is ready, eg. page is not still loading
                        // and this is not triggered by hash scroll
                        if (document.readyState === 'complete') {
                            var hash = href[1] in ignoreHashes ? '' : '#' + href[1];
                            history.replaceState({}, null, document.location.pathname + hash);
                        }
                    }
                });
            }
        }
    });
});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Autoplay video
 */

var VideoAutoPlay = function () {
    function VideoAutoPlay($element) {
        _classCallCheck(this, VideoAutoPlay);

        var $container = this.$container = $element;
        var $video = this.$video = $container.find('video').add($container.filter('video'));
        var $iframe = this.$iframe = $container.find('iframe').add($container.filter('iframe'));

        this.initialized = false;
        this.player = null;

        $container.incenter({
            'onactive': this.play.bind(this),
            'oninactive': this.pause.bind(this)
        });

        // In iOS < 10, Android playback can't start without user action
        $('body').one('touchstart touchend', this.preload.bind(this));
    }

    _createClass(VideoAutoPlay, [{
        key: 'preload',
        value: function preload() {
            var _this = this;

            // In iOS preloading does not happen if we don't start video playback
            if (!this.initialized) {
                var $video = this.$video;

                if ($video.length) {
                    var video = $video.get(0);

                    try {
                        video.play();
                        $video.one('seek', function () {
                            _this.initialized = true;
                        });
                        setTimeout(function () {
                            return video.pause();
                        }, 16);
                    } catch (err) {
                        // Error, probably "API can only be initiated by a user gesture."
                    }
                } else {
                    this.initialized = true;
                }
            }
        }
    }, {
        key: 'play',
        value: function play() {
            var $video = this.$video;
            var $iframe = this.$iframe;

            if ($video.length) {
                $video.get(0).play();
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            var $video = this.$video;
            var $iframe = this.$iframe;

            if ($video.length) {
                $video.get(0).pause();
            }
        }
    }]);

    return VideoAutoPlay;
}();

$(function () {
    $('.js-video-autoplay').each(function () {
        new VideoAutoPlay($(this));
    });
});

/***/ }),
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ })
/******/ ]);