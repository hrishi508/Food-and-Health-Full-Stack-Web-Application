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
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
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
/* 4 */,
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
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(19);

__webpack_require__(26);

__webpack_require__(24);

__webpack_require__(20);

__webpack_require__(30);

__webpack_require__(45);

__webpack_require__(37);

var _hoverSupport = __webpack_require__(2);

var _hoverSupport2 = _interopRequireDefault(_hoverSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_hoverSupport2.default.hasHoverSupport()) {
    $('html').removeClass('has-hover').addClass('no-hover');
}

if (_hoverSupport2.default.isOldIE()) {
    $('html').addClass('is-ie');
}

$(function () {
    var $nav = $('.js-navigation-primary');
    var $toggle = $('.js-toggle-navigation-primary').add($nav.find('a'));

    function toggle() {
        if ($nav.is(':visible')) {
            $nav.transition({
                'before': function before() {
                    return $nav.addClass('nav-primary--out');
                },
                'transition': function transition() {
                    return $nav.addClass('nav-primary--out--active');
                },
                'after': function after() {
                    return $nav.removeClass('nav-primary--out nav-primary--out--active').addClass('is-hidden');
                }
            });
        } else {
            $nav.transition({
                'before': function before() {
                    return $nav.addClass('nav-primary--in nav-primary--in--inactive').removeClass('is-hidden');
                },
                'transition': function transition() {
                    return $nav.removeClass('nav-primary--in--inactive');
                },
                'after': function after() {
                    return $nav.removeClass('nav-primary--in nav-primary--in--active');
                }
            });
        }
    }

    $nav.on('click', function (e) {
        // Click on the empty area on the right side of the menu
        if ($(e.target).is($nav)) {
            toggle();
        }
    });

    $toggle.on('click', function () {
        toggle();
    });

    // Footer map
    $('.js-map').contactMap();

    // Mobile accordion
    $('.js-accordion').mobileAccordion();
});

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Passive event listener for jquery
 */

var supportsPassive = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
            supportsPassive = true;
        }
    });
    window.addEventListener("test", null, opts);
} catch (e) {}

$.fn.onpassive = function (eventName, callback) {
    if (supportsPassive) {
        return this.each(function () {
            this.addEventListener(eventName, callback, {
                'passive': true
            });
        });
    } else {
        // Fallback to default
        return this.on(eventName, callback);
    }
};

$.fn.offpassive = function (eventName, callback) {
    if (supportsPassive) {
        return this.each(function () {
            this.removeEventListener(eventName, callback, {
                'passive': true
            });
        });
    } else {
        // Fallback to default
        return this.off(eventName, callback);
    }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _responsive = __webpack_require__(0);

var _responsive2 = _interopRequireDefault(_responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Header menu height on mobile
 */

var HEADER_MOBILE_HEIGHT = 60;

/**
 * jQuery plugin to show images and other content using animation
 */

var MobileAccordion = function () {
    _createClass(MobileAccordion, null, [{
        key: 'Defaults',
        get: function get() {
            return {};
        }
    }]);

    function MobileAccordion(container, opts) {
        _classCallCheck(this, MobileAccordion);

        var $container = this.$container = $(container);
        var $headings = this.$headings = $container.find('.js-accordion-header');
        var $contents = this.$contents = $container.find('.js-accordion-content');
        var options = this.options = $.extend({}, this.constructor.Defaults, opts);

        this.handleClick = this.handleClick.bind(this);
        this.index = 0;

        _responsive2.default.enter('sm-down', this.attach.bind(this));
        _responsive2.default.leave('sm-down', this.detach.bind(this));
    }

    _createClass(MobileAccordion, [{
        key: 'attach',
        value: function attach() {
            var $headings = this.$headings;
            var $contents = this.$contents;

            $headings.eq(0).addClass('is-active');
            $contents.eq(0).addClass('is-active');
            $contents.slice(1).addClass('is-hidden');

            $headings.on('click', this.handleClick);

            this.index = 0;
        }
    }, {
        key: 'detach',
        value: function detach() {
            var $headings = this.$headings;
            var $contents = this.$contents;

            $headings.removeClass('is-active');
            $contents.removeClass('is-active is-hidden');

            $headings.off('click', this.handleClick);
        }
    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            var $headings = this.$headings;
            var $contents = this.$contents;

            var index = $headings.index($(e.target).closest($headings));

            if (index === this.index) {
                this.collapse(this.index);
            } else {
                this.scrollTo(index);
                this.expand(index);
            }
        }
    }, {
        key: 'getIndex',
        value: function getIndex(item) {
            if (typeof item === 'number') {
                return item;
            } else if (typeof item === 'string') {
                // assume selector
                var $content = this.$contents.filter(item);

                if ($content.length) {
                    return this.$contents.index($content);
                }
            }

            return -1;
        }

        /**
         * Expand accordion item
         *
         * @param {string|number} item Item selector or index
         * @param {boolean} [animate=true] Use animation
         */

    }, {
        key: 'expand',
        value: function expand(item) {
            var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var index = this.getIndex(item);
            if (index === -1 || this.index === index) return;

            // Close already opened item
            if (this.index !== -1) {
                this.collapse(this.index, animate);
            }

            this.index = index;

            var $headings = this.$headings;
            var $contents = this.$contents;

            var $heading = $headings.eq(index);
            var $content = $contents.eq(index);

            var height = void 0;

            $heading.addClass('is-active');

            // Show content
            if (animate) {
                height = $content.removeClass('is-hidden').height();
                $content.trigger('resize').css('height', 0);

                $content.animate({ 'height': height }, $.durationNormal, 'easeInOutQuad', function () {
                    $content.css('height', '').trigger('resize');

                    $('html, body').stop().animate({
                        scrollTop: $heading.offset().top - 67 /* header height */
                    }, 300);
                });
            } else {
                $content.removeClass('is-hidden').trigger('resize');

                $('html, body').scrollTop($heading.offset().top - 67 /* header height */
                );
            }
        }

        /**
         * Collapse accordion item
         *
         * @param {string|number} item Item selector or index
         * @param {boolean} [animate=true] Use animation
         */

    }, {
        key: 'collapse',
        value: function collapse(item) {
            var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var index = this.getIndex(item);
            if (index === -1) return;
            this.index = -1;

            var $headings = this.$headings;
            var $contents = this.$contents;

            var $heading = $headings.eq(index);
            var $content = $contents.eq(index);

            $heading.removeClass('is-active');

            // Hide content
            if (animate) {
                $content.animate({ 'height': 0 }, $.durationNormal, 'easeInOutQuad', function () {
                    $content.css('height', '').addClass('is-hidden').trigger('resize');
                });
            } else {
                $content.addClass('is-hidden').trigger('resize');
            }
        }

        /**
         * Scroll
         *
         * @param {any} item
         * @returns
         *
         * @memberOf MobileAccordion
         */

    }, {
        key: 'scrollTo',
        value: function scrollTo(item) {
            var index = this.getIndex(item);
            if (index === -1) return;

            var offset = this.$headings.eq(index).offset().top;

            // If item which will close is before current item, then
            // it will collapse and we need to adjust scroll position
            if (this.index !== -1 && this.index < index) {
                offset -= this.$contents.eq(this.index).outerHeight();
            }

            $('body').animate({
                scrollTop: offset - HEADER_MOBILE_HEIGHT
            }, $.durationNormal, 'easeInOutQuad');
        }
    }]);

    return MobileAccordion;
}();

$.fn.mobileAccordion = function (options) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};
    var fn = typeof options === 'string' ? options : null;

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('mobileAccordion');

        if (!instance) {
            instance = new MobileAccordion($element, $.extend({}, $element.data(), opts));
            $element.data('mobileAccordion', instance);
        }

        if (fn && typeof instance[fn] === 'function') {
            instance[fn].apply(instance, args);
        }
    });
};

/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Run CSS transitions on elements
                                                                                                                                                                                                                                                                               */

__webpack_require__(25);

function each(arr, fn) {
    for (var i = 0, ii = arr.length; i < ii; i++) {
        fn(arr[i]);
    }
}

function transition(options, element) {
    var $element = $(element);
    var promise = $.Deferred();

    each(options.before, function (fn) {
        return fn($element);
    });

    if (options.transition.length) {
        requestAnimationFrame(function () {
            each(options.transition, function (fn) {
                return fn($element);
            });

            $element.transitionend().done(function () {
                each(options.after, function (fn) {
                    return fn($element);
                });
                promise.resolve();
            });
        });
    } else {
        promise.resolve();
    }

    return promise.promise();
}

$.fn.transition = function (opts) {
    // Arguments are options or sequence names
    var args = [].concat(Array.prototype.slice.call(arguments));

    // Last argument can be a callback function
    var lastarg = args[args.length - 1];
    var callback = typeof lastarg === 'function' ? lastarg : null;

    var options = {
        before: [],
        transition: [],
        after: []
    };

    // Marge all transitions into single options arrays
    for (var i = 0, ii = args.length; i < ii; i++) {
        var obj = args[i];

        if (typeof obj === 'string') {
            // string -> object
            obj = $.transition.sequences[obj];
        }

        if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            if (obj.before) options.before.push(obj.before);
            if (obj.transition) options.transition.push(obj.transition);
            if (obj.after) options.after.push(obj.after);
        }
    }

    // Call callback when transitions for all elements complete
    $.when.apply($, $.map(this, transition.bind(this, options))).done(callback);

    return this;
};

$.transition = {
    sequences: {}
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var transitionEventName = 'WebkitTransition' in document.body.style ? 'webkitTransitionEnd' : 'transitionend';
var animationEndEventName = 'WebkitAnimation' in document.body.style ? 'webkitAnimationEnd' : 'animationend';
var animationStartEventName = 'WebkitAnimation' in document.body.style ? 'webkitAnimationStart' : 'animationstart';

var uniqueId = 0;

function getDuration(duration) {
    if (duration) {
        var value = parseFloat(duration);
        if (value) {
            if (duration.substr(-2) === 'ms') {
                return value;
            } else if (duration.substr(-1) === 's') {
                return value * 1000;
            }
        }
    }

    return 0;
}

$.fn.transitionduration = function (default_duration) {
    return getDuration($(this).css('transition-duration')) || getDuration($(this).css('animation-duration')) || default_duration || 0;
};

/**
 * Returns promise, which is resolved when all elements have finishsed
 * their transitions and animations
 */
$.fn.transitionend = function () {
    return $.when.apply($, $.map(this, function (element) {
        var $element = $(element);
        var uid = ++uniqueId;
        var event = transitionEventName + '.ns' + uid + ' ' + animationEndEventName + '.ns' + uid;
        var deferred = $.Deferred();
        var duration = $element.transitionduration();

        var timer = setTimeout(function () {
            deferred.resolve();
        }, duration + 16 /* 1 frame */);

        $element.on(event, function (e) {
            if ($element.is(e.target)) {
                clearTimeout(timer);
                $element.off(event);
                deferred.resolve();
            }
        });

        return deferred.promise();
    }));
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fix vh unit size on iPhone, iPad and other mobile devices where toolbar covers part of the
 * content with height of Xvh units
 *
 * Only properties which value is using calc and vh unit are updated
 */
var PROPERTIES = ['min-height', 'height', 'max-height'];
var REGEX_VH = /calc\([^\(]*?((\d+)vh)/;
var REGEX_CAMEL = /-([a-z])/g;

function each(arr, fn) {
    for (var i = 0, ii = arr.length; i < ii; i++) {
        fn(arr[i], i);
    }
}

function camelCase(str) {
    return str.replace(REGEX_CAMEL, function (t, chr) {
        return chr.toUpperCase();
    });
}

function traverseCSSRules(rules, cssRules) {
    each(cssRules, function (cssRule) {
        if (cssRule.cssText.indexOf('vh') !== -1) {
            var properties = [];

            if (cssRule.style) {
                each(PROPERTIES, function (property) {
                    if (cssRule.style[property]) {
                        var rule = cssRule.style[property];
                        var match = rule.match(REGEX_VH);

                        if (match) {
                            properties.push({
                                'name': camelCase(property),
                                'rule': rule.replace(match[1], '%value%'),
                                'value': parseFloat(match[2])
                            });
                        }
                    }
                });

                if (properties.length) {
                    rules.push({
                        'rule': cssRule,
                        'properties': properties
                    });
                }
            } else if (cssRule.cssRules) {
                // Eg. CSSMediaRule
                traverseCSSRules(rules, cssRule.cssRules);
            }
        }
    });
}

function getMatchingCSSRules() {
    var rules = [];

    each(document.styleSheets, function (stylesheet) {
        try {
            if (stylesheet.cssRules) {
                traverseCSSRules(rules, stylesheet.cssRules);
            }
        } catch ($e) {
            // Don't attempt to read other domain CSS files (e.g. Google Font CSS).
        }
    });

    return rules;
}

function updateCSSRules(rules, height) {
    each(rules, function (rule) {
        each(rule.properties, function (property) {
            var size = Math.round(height * property.value / 100) + 'px';
            rule.rule.style[property.name] = property.rule.replace('%value%', size);
        });
    });
}

function repeatFor(fn, duration) {
    var timer = null;
    var interval = null;

    var reset = function reset() {
        timer = null;
        clearInterval(interval);
    };

    return function () {
        if (!timer) {
            timer = setTimeout(reset, duration);
            interval = setInterval(fn, 60);
        }
    };
}

$(function () {
    // iOS + Android
    if (/iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream) {
        var handleResize = function handleResize() {
            var newHeight = window.innerHeight;

            if (newHeight !== height) {
                height = newHeight;
                updateCSSRules(rules, newHeight);
            }
        };

        var rules = getMatchingCSSRules();
        var height = window.innerHeight;

        updateCSSRules(rules, height);

        $(window).on('resize', repeatFor(handleResize, 1000));
        $(window).on('scroll', (0, _lodash2.default)(handleResize, 16));

        setTimeout(handleResize, 16);
        handleResize();
    }
});

/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$.durationFast = 200;
$.durationNormal = 400;

$.extend($.easing, {
				easeInOutQuad: function easeInOutQuad(x, t, b, c, d) {
								if ((t /= d / 2) < 1) return c / 2 * t * t + b;
								return -c / 2 * (--t * (t - 2) - 1) + b;
				}
});

/***/ }),
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$(function () {
    var $win = $(window);
    var $header = $('.js-header');
    var atScreenTop = true;

    function scroll() {
        var wasAtScreenTop = atScreenTop;
        atScreenTop = $win.scrollTop() === 0;

        if (atScreenTop !== wasAtScreenTop) {
            $header.toggleClass('header--floating', !atScreenTop);
        }
    }

    $win.onpassive('scroll', scroll);
    scroll();
});

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scroller = __webpack_require__(1);

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINE_MARGIN = 20;

var Map = function () {
    function Map(el, opts) {
        _classCallCheck(this, Map);

        this.options = $.extend({}, opts);
        var $container = this.$container = $(el);
        var $texts = this.$texts = $('.js-map-text');
        var $markers = this.$markers = $('.js-map-marker');

        this.$svg = null;
        this.index = $markers.index($markers.filter('.is-active'));

        $markers.on('click', this.handleMarkerClick.bind(this));

        _scroller2.default.on('resize', this.update.bind(this));
        this.update();
    }

    _createClass(Map, [{
        key: 'setIndex',
        value: function setIndex(index) {
            if (this.index !== index) {
                this.transitionOut(this.index, index);
            }
        }
    }, {
        key: 'transitionOut',
        value: function transitionOut(index, nextIndex) {
            var _this = this;

            this.$svg.transition({
                'transition': function transition($svg) {
                    return $svg.removeClass('map__line--in');
                },
                'after': function after($svg) {
                    return _this.transitionIn(nextIndex, index);
                }
            });

            this.$texts.eq(index).transition({
                'before': function before($text) {
                    return $text.addClass('animation--slide-down-out');
                },
                'transition': function transition($text) {
                    return $text.addClass('animation--slide-down-out--active');
                },
                'after': function after($text) {
                    return $text.removeClass('animation--slide-down-out animation--slide-down-out--active is-active');
                }
            });
        }
    }, {
        key: 'transitionIn',
        value: function transitionIn(index, prevIndex) {
            var _this2 = this;

            var $svg = this.$svg;
            var $markers = this.$markers;

            // Prevent animation during update
            $svg.addClass('disable-transitions');

            this.index = index;
            this.update();

            $markers.eq(prevIndex).removeClass('is-active');
            $markers.eq(index).addClass('is-active');

            setTimeout(function () {
                $svg.transition({
                    'before': function before($svg) {
                        return $svg.removeClass('disable-transitions');
                    },
                    'transition': function transition($svg) {
                        return $svg.addClass('map__line--in');
                    }
                });
            }, 60);

            this.$texts.eq(index).addClass('animation--slide-down-in animation--slide-down-in--inactive is-active is-hidden');

            setTimeout(function () {
                _this2.$texts.eq(index).transition({
                    'before': function before($text) {
                        return $text.removeClass('is-hidden');
                    },
                    'transition': function transition($text) {
                        return $text.removeClass('animation--slide-down-in--inactive');
                    },
                    'after': function after($text) {
                        return $text.removeClass('animation--slide-down-in');
                    }
                });
            }, 160);
        }
    }, {
        key: 'handleMarkerClick',
        value: function handleMarkerClick(e) {
            var $marker = $(e.target).closest('.js-map-marker');
            var index = this.$markers.index($marker);

            this.setIndex(index);
        }

        /*
         * SVG Rendering
         * ------------------------------------------------------------------------
         */

    }, {
        key: 'update',
        value: function update() {
            if (this.index === -1) return;

            var index = this.index;
            var $map = this.$container;
            var $text = this.$texts.eq(index);
            var $marker = this.$markers.eq(index);

            var area = $.extend({}, $map.get(0).getBoundingClientRect());
            var from = $.extend({}, $marker.get(0).getBoundingClientRect());
            var to = $.extend({}, $text.find('h3').get(0).getBoundingClientRect());

            from.top = from.top - area.top + from.width / 2;
            from.left = from.left - area.left + from.height / 2;
            to.left = to.left - area.left;
            to.top = to.top - area.top;

            var toL = { 'left': to.left - LINE_MARGIN, 'top': to.top + to.height / 2 + 3 };
            var toR = { 'left': to.left + to.width + LINE_MARGIN, 'top': to.top + to.height / 2 + 3 };
            var toC = { 'left': to.left + to.width / 2, 'top': to.top - LINE_MARGIN };

            var dx = to.left - from.left;
            var dy = to.top - from.top;

            var points = void 0;

            if (from.left < toL.left - LINE_MARGIN) {
                // Left
                points = this.createPoints(from, toL, 'side');
            } else if (from.left > toR.left + LINE_MARGIN) {
                // Right
                points = this.createPoints(from, toR, 'side');
            } else {
                // Center
                points = this.createPoints(from, toC, 'top');
            }

            if (this.$svg) {
                this.updateSVG(points, this.$svg);
            } else {
                this.createSVG(points);
            }
        }
    }, {
        key: 'createPoints',
        value: function createPoints(a, b, style) {
            var points = [];

            if (style === 'top') {
                var width = Math.abs(b.left - a.left);

                return [{ 'x': a.left, 'y': a.top }, { 'x': b.left, 'y': a.top + width }, { 'x': b.left, 'y': b.top }];
            } else {
                var _width = Math.abs(b.left - a.left);
                var height = Math.abs(b.top - a.top);

                if (height > _width) {
                    return [{ 'x': a.left, 'y': a.top }, { 'x': a.left, 'y': a.top + height - _width }, { 'x': b.left, 'y': b.top }];
                } else {
                    return [{ 'x': a.left, 'y': a.top }, { 'x': a.left + height * (a.left < b.left ? 1 : -1), 'y': b.top }, { 'x': b.left, 'y': b.top }];
                }
            }
        }
    }, {
        key: 'createSVG',
        value: function createSVG(points) {
            var $svg = this.$svg = $('<svg class="map__line map__line--in" xmlns="http://www.w3.org/2000/svg" width="2" height="2"><path d="M 0 0 L 1 1" /></svg>').appendTo(this.$container);
            this.updateSVG(points, $svg);
        }
    }, {
        key: 'updateSVG',
        value: function updateSVG(points, $svg) {
            var path = [];

            var xmin = points[0].x,
                xmax = points[0].x,
                ymin = points[0].y,
                ymax = points[0].y;

            for (var i = 1, ii = points.length; i < ii; i++) {
                xmin = Math.min(xmin, points[i].x);
                xmax = Math.max(xmax, points[i].x);
                ymin = Math.min(ymin, points[i].y);
                ymax = Math.max(ymax, points[i].y);
            }

            for (var _i = 0, _ii = points.length; _i < _ii; _i++) {
                path.push([points[_i].x - xmin, points[_i].y - ymin]);
            }

            var $path = $svg.find('path');

            $path.attr('d', 'M' + path.map(function (p) {
                return p[0] + ' ' + p[1];
            }).join(' '));
            $svg.attr('width', xmax - xmin + 1);
            $svg.attr('height', ymax - ymin + 1);

            $svg.css({
                'left': xmin + 'px',
                'top': ymin + 'px',
                'stroke-dasharray': $path.get(0).getTotalLength() + 'px',
                'stroke-dashoffset': $path.get(0).getTotalLength() + 'px'
            });
        }
    }]);

    return Map;
}();

$.fn.contactMap = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var opts = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

    return this.each(function () {
        var $element = $(this);
        var instance = $element.data('map');

        if (!instance) {
            instance = new Map($element, opts);
            $element.data('map', instance);
        }
    });
};

/***/ }),
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13);


/***/ })
/******/ ]);