'use strict';

// Random integer generator
var random = function(min, max) {
  var low = (min < max) ? min : max;
  var high = (max > min) ? max : min;
  return Math.floor(Math.random() * (high - low) + low);
};

// Sets a random color based on the color object
var getRandomColor = function() {
  return `rgba(${random(0, 256)}, ${random(0, 256)}, ${random(0, 256)}, 1.0)`;
};

var hide = function(element) {
  element.style.opacity = '0';
  element.style.display = "none";
};

var show = function(element) {
  element.style.opacity = '1';
  element.style.display = "";
};

var changeBackgroundColor = function(element) {
  element.style.backgroundColor = getRandomColor();
};

// https://github.com/funjs/book-source/blob/master/chapter01.js
function existy(x) { return x != null };

// https://github.com/funjs/book-source/blob/master/chapter01.js
function truthy(x) { return (x !== false) && existy(x) };

// https://github.com/funjs/book-source/blob/master/chapter01.js
function doWhen(cond, action, alt) {
  if(truthy(cond))
    return action();
  else
    return alt() || undefined;
}

// https://github.com/funjs/book-source/blob/master/chapter04.js
var K = function(arg) {
  return function() {
    return arg;
  }
}

var mapObj = function(obj, func) {
  var out = {};
  for(var key in obj) {
    out[key] = func(key, obj[key]);
  }
  return out;
}

var makeElement = function(tag) {
  return function(obj) {
    var element = document.createElement(tag);
      mapObj(obj, function(key, val) {
        element.grab(key)(value('set', val));
      });
    return element;
  }
}

var getElements = function(tag) {
  return function(obj) {
    var elements = document.querySelectorAll(tag);
    console.log(elements);
    var elementArray = Array.from(elements);
    elementArray.map(function(element) {
      mapObj(obj, function(key, val) {
        element.grab(key)(value('set', val));
      });
    });
    return elementArray;
  }
}

var grab = function(property) {
  var that = this;
  var keyArray = property.split('.');
  return function(func) {
    return keyArray.reduce(function(first, second) {
      return func(first, second);
    }, that);
  }
}

function value(action, name) {
  return function(obj, key) {
    var keyTest = validator(isString);
    var modeTest = validator(isSetter);
    return (keyTest(obj[key]) && modeTest(action)) ? obj[key] = name : obj[key];
  }
}

var validator = function(/* predicate functions */) {
  var bools = [...arguments];
  return function(value) {
    return bools.reduce(function(first, test) {
      return (first && test(value));
    }, true);
  }
}

function isStyle(value) {
  return /^\./.test(value);
}

function isString(value) {
  return typeof value === 'string';
}

function isSetter(value) {
  return value == 'set';
}

function selector(/*alias, predicate functions, engine*/) {
  var that = this;
  var alias = arguments[0];
  var engine = arguments[arguments.length - 1];
  var tests = [...arguments].slice(1, -1);
  var selectorTest = validator(...tests);
  return function(property) {
    var func = (typeof engine == 'string') ? this[engine] : engine;
    console.log(selectorTest(property));
    return (selectorTest(property)) ? func.call(this, alias + property) : func.call(this, property);
  }
}

var style = selector('style', isStyle, 'grab'); // these selector functions can eat themselves

var extend = function(/* arguments */) {
  var argsIn = [...arguments];
  var out = argsIn.reduce(function(obj1, obj2) {
    for(var key in obj2) {
      obj1[key] = (typeof obj2[key] === 'object' && !(Array.isArray(obj2[key]))) ? extend(obj2[key]) : obj2[key];
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
