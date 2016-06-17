'use strict';

import * as util from './util.js';

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
    "search": {"placeholder": "Search for students...", "id": "search"},
    "empty": {'className': 'empty', 'textContent': 'No Results Found'},
    "elementsToQuery": [
      'h3',
      'span.email'
    ],
    "itemsOnPage": 10,
    "paginationClass": 'pagination',
    "paginationElement": 'div'
  };

  /**
   * Constructor function for pageturner object
   *
   */
  function PageTurner(options) {
    if(!options) {options = {};}
    var config = extend( {}, defaults, options );

    Object.keys(config).map(function(setting) {
      host[setting] = config[setting];
    });
  }

  /**
   * Run method
   * Used to attach PageTurner object to DOM
   * and Initialization code
   *
   */
  PageTurner.prototype.run =  function() {
    var that = this;
    this.searchEl = makeElement('input')(host.search);
    this.searchEl.addEventListener('keyup', search.bind(that));
    this.pageHeader = document.getElementsByClassName(host.pageHeader)[0];
    this.currentPage = document.querySelector(host.currentPage);

    this.empty = makeElement('h1')(host.empty);
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
  var search = function() {

    var query = this.searchEl.grab('value')(value('get')).toLowerCase().trim(); // Get search value

    var matches = this.items.filter(function(item) { // Go through all the students
      return host.elementsToQuery.reduce(function(first, element) {
        var elementText = item.querySelector(element).textContent.toLowerCase().trim();
        return first || RegExp(query).test(elementText);
      }, false);
    });

    this.createPage(0, matches);
  }

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
  PageTurner.prototype.displayPage = function(pageIndex, matches) {
    var that = this;
    var bottom = pageIndex * host.itemsOnPage; // Bottom of list to display
    var top = pageIndex * host.itemsOnPage + (host.itemsOnPage - 1); // Top of list to display

    this.items.map(function(item) {
      util.hide(item);
    });

    if(matches.length === 0) {
      if(!document.querySelector('.empty')) {
        util.hide(document.querySelector(host.list));
        document.querySelector(host.currentPage).appendChild(this.empty);
      }
    } else {
      if(document.querySelector('.empty')) { this.empty.remove(); }
      util.show(document.querySelector(host.list));
      matches.map(function(item, index){
        if (index >= bottom && index <= top && matches.includes(item)) {
          util.show(item);
        }
      });
    }

    return {"page":pageIndex, "matches": matches}; // This is the navObj
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
  PageTurner.prototype.createPageLink = function(pageIndex, navObj) {
    var that = this;
    var pageNumberText = pageIndex + 1;
    var pageLink = makeElement('li')({});
    var active = (navObj.page == pageIndex) ? 'active number' : 'number';
    var link = makeElement('a')({'href':'#', 'className': active , 'textContent': pageNumberText});

    link.addEventListener('click', function(e) { // Add the link text and on click handler
      e.preventDefault(); // Prevent the link from leaving the page
      getElements('.number')({'className': 'number'});
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
  PageTurner.prototype.createPageNavList = function(navObj) {
    var navList = makeElement('ul')({}); //$('<ul></ul>'); // Create nav list.
    var navIndex = Math.ceil(navObj.matches.length / host.itemsOnPage); // Get the number of pages needed.
    for(var i = 0; i < navIndex; i++) { // for each page...
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
  PageTurner.prototype.createPage = function(pageIndex, matches) {
    if(document.querySelector('.' + host.paginationClass)) {
      document.querySelector('.' + host.paginationClass).remove();
    }
    var navObj = this.displayPage(pageIndex, matches);
    var navList = this.createPageNavList(navObj);
    var pagination = makeElement(host.paginationElement)({'className': host.paginationClass});
    pagination.appendChild(navList);
    this.currentPage.appendChild(pagination);
  };

module.exports.PageTurner = PageTurner;
window.PageTurner = PageTurner;
window.util = util;
