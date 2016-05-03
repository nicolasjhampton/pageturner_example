var PageTurner = (function($) {
  'use strict';

  /*
   * Constructor function to initialize pageTurner
   *
   */

  function pageTurner(config) {

    if(!config) {config = {};}
    this.studentSearch = config.studentSearch || $('<div class="student-search"></div>');
    this.pageHeader = config.pageHeader || $('.page-header');
    this.currentPage = config.currentPage || $('.page');
    this.students = config.students || $('.student-item');
    this.empty = config.empty || $('<h1 class="empty">No Results Found</h1>');
    this.studentList = config.studentList || $('.student-list');
    this.input = config.input || $('<input placeholder="Search for students...">');
    this.elementsToQuery = config.elementsToQuery || ['h3','span.email'];
    this.itemsOnPage = config.itemsOnPage || 10;
    this.paginationClass = config.paginationElement || 'pagination';
    this.paginationElement = config.paginationElement || 'div';
    this.paginationString = '<' + this.paginationElement + ' class="' + this.paginationClass + '"></' + this.paginationElement + '>';

  }


  /*
   * search method
   * Used by input keyup (in initialization code)
   */

  function search() {

    var that = this;
    var query = that.input.val().toLowerCase().trim(); // Get search value
    console.log(query);


    var matches = this.students.filter(function(index) { // Go through all the students

      var studentItem = this; // Store the student item element

      // go through the list of elements in the student item we want to search
      var results = that.elementsToQuery.map(function(element) {
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

    var pagination = that.createPage(0, that.students, matches); // display page and create menu
    $('.' + that.paginationClass).remove(); // Remove the current menu

    if(matches.length !== 0) {
      if(this.empty) {this.empty.remove();} // remove empty message if it's there
      this.currentPage.append(pagination); // attach menu
    }
  };


  /*
   * displayPage method
   * Used by createPage
   */

  pageTurner.prototype.displayPage = function(page, entries, matches) {

    var itemsOnPage = 10; // number of items to display on a page
    var bottom = page * itemsOnPage; // Bottom of list to display
    var top = page * itemsOnPage + (itemsOnPage - 1); // Top of list to display

    entries.each(function() {
      $(this).hide();
    });

    if(matches.length === 0) {
      this.studentList.hide();
      this.currentPage.append(this.empty); // display empty message
    } else {
      this.studentList.show();
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

  pageTurner.prototype.createPageLink = function(index, navObj) {
    var that = this;
    var pageLink = $('<li><a href="#"></a></li>'); // create a link...
    pageLink.children().text(index + 1).click(function(e) { // Add the link text and on click handler
      // This is what happens when the link is clicked
      e.preventDefault(); // Prevent the link from leaving the page
      $(this).addClass('active'); // Mark it active
      $(this).parent().siblings().children().removeClass('active'); // Remove active class from any other link
      that.createPage(index, navObj.entries, navObj.matches); // Change the page
    });
    // If this page is the current page, mark the link as active
    navObj.page === index ? pageLink.children().addClass('active') : null;
    return pageLink;
  }


  /*
   * createPageNavList method
   * Used by createPage
   */

  pageTurner.prototype.createPageNavList = function(navObj) {
    var navList = $('<ul></ul>'); // Create nav list.
    var navIndex = Math.ceil(navObj.matches.length / 10); // Get the number of pages needed.
    for(var i = 0; i < navIndex; i++) { // for each page...
      var pageLink = this.createPageLink(i, navObj); // create a link...
      navList.append(pageLink); // and attach it to nav list.
    }
    return navList;
  }


  /*
   * createPage method
   * Used by Search, createPageNavList
   * and Initialization code
   */

  pageTurner.prototype.createPage = function(page, entries, matches) {
    var navObj = this.displayPage(page, entries, matches);
    var navList = this.createPageNavList(navObj);
    var pagination = $(this.paginationString);
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
    this.input.keyup(search.bind(that));
    this.studentSearch.append(this.input);
    this.pageHeader.append(this.studentSearch);
    var pagination = this.createPage(0, this.students, this.students);
    this.currentPage.append(pagination);
  }

  return pageTurner;

})($);
