var PageTurner = (function($, window, document) {
  'use strict';

/*
 *  PageTurner Version 1.1.0
 *  Copyright Nicolas James Hampton 2016
 *  Creates pages out of identical html items
 *  with built in search
 *
 */

  var host = {};

  var defaults = {
    "studentSearch": $('<div class="student-search"></div>'),
    "pageHeader": $('.page-header'),
    "currentPage": $('.page'),
    "students": $('.student-item'),
    "empty": $('<h1 class="empty">No Results Found</h1>'),
    "studentList": $('.student-list'),
    "input": $('<input placeholder="Search for students...">'),
    "elementsToQuery": [
      'h3',
      'span.email'
    ],
    "itemsOnPage": 10,
    "paginationClass": 'pagination',
    "paginationElement": 'div'
  };

  /*
   * Constructor function for pageturner object
   *
   */
  function PageTurner(options) {
    if(!options) {options = {};}
    var config = $.extend( {}, defaults, options );

    Object.keys(config).map(function(setting) {
      host[setting] = config[setting];
    });
  }


  /*
   * Run method
   * Used to attach PageTurner object to DOM
   * and Initialization code
   *
   */
  PageTurner.prototype.run =  function() {
    var that = this;

    host.input.keyup(search.bind(that));
    host.studentSearch.append(host.input);
    host.pageHeader.append(host.studentSearch);

    var pagination = createPage(0, host.students, host.students);
    host.currentPage.append(pagination);
  };


  /*
   * search method
   * Used by pageTurner.run initialization method to bind to keyup event
   *
   */

  function search() {

    var query = host.input.val().toLowerCase().trim(); // Get search value

    var matches = host.students.filter(function(index) { // Go through all the students
      var studentItem = this; // Store the student item element

      // go through the list of elements in the student item we want to search
      var results = host.elementsToQuery.map(function(element) {
        // get the text of the element
        var elementText = $(studentItem).find(element).text().toLowerCase().trim();
        // If the query matches the element text
        return RegExp(query).test(elementText);
      });

      // if any results matched, add the element to the matches array
      return results.indexOf(true) !== -1;
    });

    var pagination = createPage(0, host.students, matches); // display page and create menu
    $('.' + host.paginationClass).remove(); // Remove the current menu

    if(matches.length !== 0) {
      if(host.empty) {host.empty.remove();} // remove empty message if it's there
      host.currentPage.append(pagination); // attach menu
    }
  }


  /*
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
  var displayPage = function(pageIndex, entries, matches) {

    //var itemsOnPage = 10; // number of items to display on a page
    var bottom = pageIndex * host.itemsOnPage; // Bottom of list to display
    var top = pageIndex * host.itemsOnPage + (host.itemsOnPage - 1); // Top of list to display

    entries.each(function() {
      $(this).hide();
    });

    if(matches.length === 0) {
      host.studentList.hide();
      host.currentPage.append(host.empty); // display empty message
    } else {
      host.studentList.show();
      matches.each(function(index){
        // if the entry is in the matches and on this page
        if (index >= bottom && index <= top && matches.index(this) !== -1) {
          $(this).fadeIn('slow'); // Then show it
        }
      });
    }

    return {"entries": entries, "page":pageIndex, "matches": matches}; // This is the navObj
  };


  /*
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
  var createPageLink = function(pageIndex, navObj) {
    var pageNumberText = pageIndex + 1;
    var pageLink = $('<li><a href="#"></a></li>'); // create a link...
    // If this page is the current page, mark the link as active
    if (navObj.page == pageIndex) { pageLink.children().addClass('active'); }
    pageLink.children().text(pageNumberText).click(function(e) { // Add the link text and on click handler
      // This is what happens when the link is clicked
      e.preventDefault(); // Prevent the link from leaving the page
      $(this).addClass('active'); // Mark it active
      $(this).parent().siblings().children().removeClass('active'); // Remove active class from any other link
      createPage(pageIndex, navObj.entries, navObj.matches); // Change the page
    });
    return pageLink;
  };


 /*
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
  var createPageNavList = function(navObj) {
    var navList = $('<ul></ul>'); // Create nav list.
    var navIndex = Math.ceil(navObj.matches.length / host.itemsOnPage); // Get the number of pages needed.
    for(var i = 0; i < navIndex; i++) { // for each page...
      var pageLink = createPageLink(i, navObj); // create a link...
      navList.append(pageLink); // and attach it to nav list.
    }
    return navList;
  };


  /*
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
  var createPage = function(pageIndex, entries, matches) {
    var navObj = displayPage(pageIndex, entries, matches);
    var navList = createPageNavList(navObj);
    var pagination = $('<' + host.paginationElement +
                       ' class="' + host.paginationClass + '"></' +
                       host.paginationElement + '>');
    pagination.append(navList);
    return pagination;
  };


  return PageTurner;

})($, window, document);
