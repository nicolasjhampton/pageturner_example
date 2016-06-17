webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _util = __webpack_require__(1);
	
	var util = _interopRequireWildcard(_util);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	Element.prototype.grab = util.grab;
	Element.prototype.style = util.style;
	
	var mapObj = util.mapObj;
	var makeElement = util.makeElement;
	var getElements = util.getElements;
	var value = util.value;
	var validator = util.validator;
	var isString = util.isString;
	var isSetter = util.isSetter;
	var isStyle = util.isStyle;
	var selector = util.selector;
	var extend = util.extend;
	
	/**
	 *  PageTurner
	 *  @version 1.1.0
	 *  Copyright Nicolas James Hampton 2016
	 *  Creates pages out of identical html items with built in search
	 *
	 */
	
	var host = {};
	
	var defaults = {
	  "pageHeader": "page-header",
	  "currentPage": '.page',
	  "itemsClass": ".student-item",
	  "list": '.student-list',
	  "searchElement": "input",
	  "searchID": "search",
	  "empty": { 'className': 'empty', 'textContent': 'No Results Found' },
	  "elementsToQuery": ['h3', 'span.email'],
	  "itemsOnPage": 10,
	  "paginationClass": 'pagination',
	  "paginationElement": 'div'
	};
	
	/**
	 * Constructor function for pageturner object
	 *
	 */
	function PageTurner(options) {
	  if (!options) {
	    options = {};
	  }
	  var config = extend({}, defaults, options);
	
	  Object.keys(config).map(function (setting) {
	    host[setting] = config[setting];
	  });
	}
	
	/**
	 * Run method
	 * Used to attach PageTurner object to DOM
	 * and Initialization code
	 *
	 */
	PageTurner.prototype.run = function () {
	  var that = this;
	  this.searchEl = makeElement('input')({ "placeholder": "Search for students...", "id": host.searchID });
	  this.searchEl.addEventListener('keyup', search.bind(that));
	  this.pageHeader = document.getElementsByClassName(host.pageHeader)[0];
	  this.currentPage = document.querySelector(host.currentPage);
	
	  this.empty = makeElement('h1')({ "className": "empty", "innerHTML": "No Results Found" });
	  this.searchContainer = makeElement('div')({});
	  this.items = getElements(host.itemsClass)({});
	  this.searchContainer.appendChild(that.searchEl);
	  this.pageHeader.appendChild(that.searchContainer);
	
	  this.createPage(0, this.items);
	};
	
	/**
	 * search method
	 * Used by pageTurner.run initialization method to bind to keyup event
	 *
	 */
	var search = function search() {
	
	  var query = this.searchEl.grab('value')(value('get')).toLowerCase().trim(); // Get search value
	
	  var matches = this.items.filter(function (item) {
	    // Go through all the students
	    return host.elementsToQuery.reduce(function (first, element) {
	      var elementText = item.querySelector(element).textContent.toLowerCase().trim();
	      return first || RegExp(query).test(elementText);
	    }, false);
	  });
	
	  this.createPage(0, matches);
	};
	
	/**
	 * displayPage method
	 * Used by createPage
	 *
	 * @param pageIndex: Integer - Page number you want to display (starts at 0)
	 *        entries: DOM element array - all possible items
	 *        matches: DOM element array - all currently matching search items
	 *
	 * @returns navObj: Keys: Page
	 *                        entries
	 *                        matches
	 *
	 */
	PageTurner.prototype.displayPage = function (pageIndex, matches) {
	  var that = this;
	  var bottom = pageIndex * host.itemsOnPage; // Bottom of list to display
	  var top = pageIndex * host.itemsOnPage + (host.itemsOnPage - 1); // Top of list to display
	
	  this.items.map(function (item) {
	    util.hide(item);
	  });
	
	  if (matches.length === 0) {
	    if (!document.querySelector('.empty')) {
	      util.hide(document.querySelector(host.list));
	      //var empty = makeElement('h1')(host.empty);
	      document.querySelector(host.currentPage).appendChild(this.empty);
	    } // display empty message
	  } else {
	      if (document.querySelector('.empty')) {
	        /*document.querySelector('.empty')*/this.empty.remove();
	      }
	      util.show(document.querySelector(host.list));
	      matches.map(function (item, index) {
	        if (index >= bottom && index <= top && matches.includes(item)) {
	          util.show(item);
	        }
	      });
	    }
	
	  return { "page": pageIndex, "matches": matches }; // This is the navObj
	};
	
	/**
	 * createPageLink method
	 * Used by createPageNavList
	 *
	 * @param  pageIndex: Integer - number of page starting with 0
	 *         navObj: Keys: Page
	 *                       entries
	 *                       matches
	 *
	 * @returns DOM list item element for a page number link
	 *
	 */
	PageTurner.prototype.createPageLink = function (pageIndex, navObj) {
	  var that = this;
	  var pageNumberText = pageIndex + 1;
	  var pageLink = makeElement('li')({});
	  var active = navObj.page == pageIndex ? 'active number' : 'number';
	  var link = makeElement('a')({ 'href': '#', 'className': active, 'textContent': pageNumberText });
	
	  link.addEventListener('click', function (e) {
	    // Add the link text and on click handler
	    e.preventDefault(); // Prevent the link from leaving the page
	    getElements('.number')({ 'className': 'number' });
	    this.className = 'active number'; // Mark it active
	    that.createPage(pageIndex, navObj.matches); // Change the page
	  });
	
	  pageLink.appendChild(link);
	  return pageLink;
	};
	
	/**
	 * createPageNavList method
	 * Used by createPage
	 *
	 * @param  navObj: Keys: Page
	 *                       entries
	 *                       matches
	 *
	 * @returns DOM unordered list element for a page navigation
	 *
	 */
	PageTurner.prototype.createPageNavList = function (navObj) {
	  var navList = makeElement('ul')({}); //$('<ul></ul>'); // Create nav list.
	  var navIndex = Math.ceil(navObj.matches.length / host.itemsOnPage); // Get the number of pages needed.
	  for (var i = 0; i < navIndex; i++) {
	    // for each page...
	    var pageLink = this.createPageLink(i, navObj); // create a link...
	    navList.appendChild(pageLink); // and attach it to nav list.
	  }
	  return navList;
	};
	
	/**
	 * createPage method
	 * Used by Search, createPageLink Initialization code
	 *
	 * @param pageIndex: Integer - Page number you want to display (starts at 0)
	 *        entries: DOM element array - all possible items
	 *        matches: DOM element array - all currently matching search items
	 *
	 * @returns DOM object with pages and navigation attached
	 *
	 */
	PageTurner.prototype.createPage = function (pageIndex, matches) {
	  if (document.querySelector('.' + host.paginationClass)) {
	    document.querySelector('.' + host.paginationClass).remove();
	  }
	  var navObj = this.displayPage(pageIndex, matches);
	  var navList = this.createPageNavList(navObj);
	  var pagination = makeElement(host.paginationElement)({ 'className': host.paginationClass });
	  pagination.appendChild(navList);
	  this.currentPage.appendChild(pagination);
	};
	
	module.exports.PageTurner = PageTurner;
	window.PageTurner = PageTurner;
	window.util = util;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	// Random integer generator
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var random = function random(min, max) {
	  var low = min < max ? min : max;
	  var high = max > min ? max : min;
	  return Math.floor(Math.random() * (high - low) + low);
	};
	
	// Sets a random color based on the color object
	var getRandomColor = function getRandomColor() {
	  return 'rgba(' + random(0, 256) + ', ' + random(0, 256) + ', ' + random(0, 256) + ', 1.0)';
	};
	
	var hide = function hide(element) {
	  element.style.opacity = '0';
	  element.style.display = "none";
	};
	
	var show = function show(element) {
	  element.style.opacity = '1';
	  element.style.display = "";
	};
	
	var changeBackgroundColor = function changeBackgroundColor(element) {
	  element.style.backgroundColor = getRandomColor();
	};
	
	// https://github.com/funjs/book-source/blob/master/chapter01.js
	function existy(x) {
	  return x != null;
	};
	
	// https://github.com/funjs/book-source/blob/master/chapter01.js
	function truthy(x) {
	  return x !== false && existy(x);
	};
	
	// https://github.com/funjs/book-source/blob/master/chapter01.js
	function doWhen(cond, action, alt) {
	  if (truthy(cond)) return action();else return alt() || undefined;
	}
	
	// https://github.com/funjs/book-source/blob/master/chapter04.js
	var K = function K(arg) {
	  return function () {
	    return arg;
	  };
	};
	
	var mapObj = function mapObj(obj, func) {
	  var out = {};
	  for (var key in obj) {
	    out[key] = func(key, obj[key]);
	  }
	  return out;
	};
	
	var makeElement = function makeElement(tag) {
	  return function (obj) {
	    var element = document.createElement(tag);
	    mapObj(obj, function (key, val) {
	      element.grab(key)(value('set', val));
	    });
	    return element;
	  };
	};
	
	var getElements = function getElements(tag) {
	  return function (obj) {
	    var elements = document.querySelectorAll(tag);
	    console.log(elements);
	    var elementArray = Array.from(elements);
	    elementArray.map(function (element) {
	      mapObj(obj, function (key, val) {
	        element.grab(key)(value('set', val));
	      });
	    });
	    return elementArray;
	  };
	};
	
	var grab = function grab(property) {
	  var that = this;
	  var keyArray = property.split('.');
	  return function (func) {
	    return keyArray.reduce(function (first, second) {
	      return func(first, second);
	    }, that);
	  };
	};
	
	function value(action, name) {
	  return function (obj, key) {
	    var keyTest = validator(isString);
	    var modeTest = validator(isSetter);
	    return keyTest(obj[key]) && modeTest(action) ? obj[key] = name : obj[key];
	  };
	}
	
	var validator = function validator() /* predicate functions */{
	  var bools = [].concat(Array.prototype.slice.call(arguments));
	  return function (value) {
	    return bools.reduce(function (first, test) {
	      return first && test(value);
	    }, true);
	  };
	};
	
	function isStyle(value) {
	  return (/^\./.test(value)
	  );
	}
	
	function isString(value) {
	  return typeof value === 'string';
	}
	
	function isSetter(value) {
	  return value == 'set';
	}
	
	function selector() /*alias, predicate functions, engine*/{
	  var that = this;
	  var alias = arguments[0];
	  var engine = arguments[arguments.length - 1];
	  var tests = [].concat(Array.prototype.slice.call(arguments)).slice(1, -1);
	  var selectorTest = validator.apply(undefined, _toConsumableArray(tests));
	  return function (property) {
	    var func = typeof engine == 'string' ? this[engine] : engine;
	    console.log(selectorTest(property));
	    return selectorTest(property) ? func.call(this, alias + property) : func.call(this, property);
	  };
	}
	
	var style = selector('style', isStyle, 'grab'); // these selector functions can eat themselves
	
	// Element.prototype.grab = grab;
	// Element.prototype.getStyle = style;
	
	// var searchEl1 = makeElement('input')({"placeholder": "Search for students...", "id": "search1"});
	// var searchEl2 = makeElement('input')({"placeholder": "Search for students...", "id": "search2"});
	// var searchEl3 = makeElement('input')({"placeholder": "Search for students...", "id": "search3"});
	// var body = document.getElementsByTagName('body')[0];
	// body.appendChild(searchEl1);
	// body.appendChild(searchEl2);
	// body.appendChild(searchEl3);
	// var newColorValue = searchEl.grab('style.color')(value('set', 'blue'));
	
	var extend = function extend() /* arguments */{
	  var argsIn = [].concat(Array.prototype.slice.call(arguments));
	  var out = argsIn.reduce(function (obj1, obj2) {
	    for (var key in obj2) {
	      obj1[key] = _typeof(obj2[key]) === 'object' && !Array.isArray(obj2[key]) ? extend(obj2[key]) : obj2[key];
	    }
	    return obj1;
	  }, {});
	  return out;
	};
	
	module.exports.mapObj = mapObj;
	module.exports.makeElement = makeElement;
	module.exports.getElements = getElements;
	module.exports.grab = grab;
	module.exports.value = value;
	module.exports.validator = validator;
	module.exports.isString = isString;
	module.exports.isSetter = isSetter;
	module.exports.isStyle = isStyle;
	module.exports.selector = selector;
	module.exports.style = style;
	
	module.exports.random = random;
	module.exports.getRandomColor = getRandomColor;
	module.exports.hide = hide;
	module.exports.show = show;
	module.exports.changeBackgroundColor = changeBackgroundColor;
	module.exports.existy = existy;
	module.exports.truthy = truthy;
	module.exports.doWhen = doWhen;
	module.exports.K = K;
	
	module.exports.extend = extend;

/***/ }
]);
//# sourceMappingURL=app.map.js