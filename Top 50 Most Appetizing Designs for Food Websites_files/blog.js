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
/******/ 	return __webpack_require__(__webpack_require__.s = 48);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _view = __webpack_require__(32);

var _view2 = _interopRequireDefault(_view);

var _banner = __webpack_require__(31);

var _banner2 = _interopRequireDefault(_banner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkFullWidthSuit(image) {
  var container_size = 800;
  if (image.complete && image.naturalWidth > container_size) {
    $(image).addClass('full-width');
  }
}

$(function () {
  var view = new _view2.default();
  view.movePosts();
  view.setToggleMobileMenu();
  view.setPagination();
  view.setCloseButton();

  var banner = new _banner2.default($('.js-popup-banner'));

  $(window).resize(function () {
    view.setPagination();
  });

  $('.article-content blockquote').each(function () {
    var blockquote = this;

    if ($(blockquote).find('em').length) {
      $(blockquote).addClass('marked');
    }
  });

  $('.article-content img').each(function () {
    var image = this;

    checkFullWidthSuit(image);

    if (!this.complete) {
      $(image).on('load', function () {
        checkFullWidthSuit(image);
      });
    }
  });

  if (window.REACTIONS_URL) {
    (function () {
      var $reaction_containers = $('sup[data-reactions-url]'),
          $urls = [];

      $reaction_containers.each(function () {
        $urls.push(this.getAttribute('data-reactions-url'));
      });

      $.post(window.REACTIONS_URL, JSON.stringify($urls), function ($result) {
        $reaction_containers.each(function ($index, $container) {
          $container = $($container);

          var $url = $container.data('reactions-url');

          $container.text($result[$url] ? $result[$url] : '');
        });
      });
    })();
  }

  if ($(window).width() < 767) {
    var $author = $('.js-author');
    var authorHtml = $author.wrap('<p/>').parent().html();

    $(authorHtml).insertAfter('.article-content h1').removeClass('is-hidden--sm-down');

    $author.unwrap();
  }

  $('table').each(function () {
    var table = this;

    $(table).wrap('<div class="article--text--table--container"></div>');
  });
});

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ($banner) {
    var $win = $(window);
    var visible = false;

    function update() {
        var contentHeight = window.scrollHeight || document.body.scrollHeight;
        var shouldBeVisible = $win.scrollTop() > contentHeight * POSITION;

        if (visible !== shouldBeVisible) {
            visible = shouldBeVisible;
            $banner.toggleClass('popup-banner--hidden', !shouldBeVisible);
        }
    }

    $win.on('scroll resize', update);
    update();
};

var POSITION = 0.2;

;

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    this.movePosts = function () {
        var source = $('.js-post-list-source');
        var target = $('.js-post-list-target');

        target.append(source.children().slice(12));
    };
    this.setCloseButton = function () {
        $('.popup-banner__close').on("click", function () {
            $(this).parents(".popup-banner").hide();
        });
    };
    this.setToggleMobileMenu = function () {
        $('.post-navigation--link--button').on('click', function () {
            $('.post-navigation--link--button').parent().siblings('li').slideToggle();
            return false;
        });
    };
    this.setPagination = function () {

        function resetPagination() {
            $('.pagination--filler').addClass('is-hidden');
            $('.pagination a').parent().removeClass('is-hidden');
        }

        function updatePagination() {
            $('.pagination').each(function () {
                var pagination = $(this);
                var filler = pagination.find('.pagination--filler');
                var links = pagination.find('a').not('.pagination--button--prev, .pagination--button--next');
                var active = links.index('.pagination--button--active');
                var length = links.length;
                var direction;
                var offset;

                if (active < length / 2) {
                    // Hide from end
                    filler.eq(1).removeClass('is-hidden');
                    direction = -1;
                    offset = length - 1;
                } else {
                    // Hide from start
                    filler.eq(0).removeClass('is-hidden');
                    direction = 1;
                    offset = 0;
                }

                // Hide links
                while (this.offsetWidth < this.scrollWidth) {
                    links.eq(offset).parent().addClass('is-hidden');
                    offset += direction;
                }
            });
        }

        updatePagination();
        $(window).on('resize', resetPagination).on('resize', updatePagination);
    };
};

;

/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ })

/******/ });