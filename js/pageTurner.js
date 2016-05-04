var PageTurner = (function($) {
  'use strict';

  /*
   * Constructor function to initialize pageTurner
   *
   */

  var studentSearch;
  var pageHeader;
  var currentPage;
  var students;
  var empty;
  var studentList;
  var input;
  var elementsToQuery;
  var itemsOnPage;
  var paginationClass;
  var paginationElement;
  var paginationString;

  function pageTurner(config) {

    if(!config) {config = {};}
    studentSearch = config.studentSearch || $('<div class="student-search"></div>');
    pageHeader = config.pageHeader || $('.page-header');
    currentPage = config.currentPage || $('.page');
    students = config.students || $('.student-item');
    empty = config.empty || $('<h1 class="empty">No Results Found</h1>');
    studentList = config.studentList || $('.student-list');
    input = config.input || $('<input placeholder="Search for students...">');
    elementsToQuery = config.elementsToQuery || ['h3','span.email'];
    itemsOnPage = config.itemsOnPage || 10;
    paginationClass = config.paginationElement || 'pagination';
    paginationElement = config.paginationElement || 'div';
    paginationString = '<' + paginationElement + ' class="' + paginationClass + '"></' + paginationElement + '>';

  }


  /*
   * search method
   * Used by input keyup (in initialization code)
   */

  function search() {

    var query = input.val().toLowerCase().trim(); // Get search value

    var matches = students.filter(function(index) { // Go through all the students
      var studentItem = this; // Store the student item element

      // go through the list of elements in the student item we want to search
      var results = elementsToQuery.map(function(element) {
        // get the text of the element
        var elementText = $(studentItem).find(element).text().toLowerCase().trim();
        // If the query matches the element text
        if (elementText.search(query) !== -1) {
          return true; // return a 'matched' result
        } else {
          return false; // return a 'no match' result
        }
      });

      // if any results matched, add the element to the matches array
      return results.indexOf(true) !== -1;
    });

    var pagination = createPage(0, students, matches); // display page and create menu
    $('.' + paginationClass).remove(); // Remove the current menu

    if(matches.length !== 0) {
      if(empty) {empty.remove();} // remove empty message if it's there
      currentPage.append(pagination); // attach menu
    }
  };


  /*
   * displayPage method
   * Used by createPage
   */

  var displayPage = function(page, entries, matches) {

    var itemsOnPage = 10; // number of items to display on a page
    var bottom = page * itemsOnPage; // Bottom of list to display
    var top = page * itemsOnPage + (itemsOnPage - 1); // Top of list to display

    entries.each(function() {
      $(this).hide();
    });

    if(matches.length === 0) {
      studentList.hide();
      currentPage.append(empty); // display empty message
    } else {
      studentList.show();
      matches.each(function(index){
        // if the entry is in the matches and on this page
        if (index >= bottom && index <= top && matches.index(this) !== -1) {
          $(this).fadeIn('slow'); // Then show it
        }
      });
    }

    return {"entries": entries, "page":page, "matches": matches}; // This is the navObj
  };


  /*
   * createPageLink method
   * Used by createPageNavList
   */

  var createPageLink = function(index, navObj) {
    var that = this;
    var pageLink = $('<li><a href="#"></a></li>'); // create a link...
    pageLink.children().text(index + 1).click(function(e) { // Add the link text and on click handler
      // This is what happens when the link is clicked
      e.preventDefault(); // Prevent the link from leaving the page
      $(this).addClass('active'); // Mark it active
      $(this).parent().siblings().children().removeClass('active'); // Remove active class from any other link
      createPage(index, navObj.entries, navObj.matches); // Change the page
    });
    // If this page is the current page, mark the link as active
    navObj.page === index ? pageLink.children().addClass('active') : null;
    return pageLink;
  }


  /*
   * createPageNavList method
   * Used by createPage
   */

  var createPageNavList = function(navObj) {
    var navList = $('<ul></ul>'); // Create nav list.
    var navIndex = Math.ceil(navObj.matches.length / 10); // Get the number of pages needed.
    for(var i = 0; i < navIndex; i++) { // for each page...
      var pageLink = createPageLink(i, navObj); // create a link...
      navList.append(pageLink); // and attach it to nav list.
    }
    return navList;
  }


  /*
   * createPage method
   * Used by Search, createPageNavList
   * and Initialization code
   */

  var createPage = function(page, entries, matches) {
    var navObj = displayPage(page, entries, matches);
    var navList = createPageNavList(navObj);
    var pagination = $(paginationString);
    pagination.append(navList);
    return pagination;
  }


  /*
   * Run method
   * Used to attach PageTurner object to DOM
   * and Initialization code
   */

  pageTurner.prototype.run =  function() {
    var that = this;
    input.keyup(search.bind(that));
    studentSearch.append(input);
    pageHeader.append(studentSearch);
    var pagination = createPage(0, students, students);
    currentPage.append(pagination);
  }

  return pageTurner;

})($);
