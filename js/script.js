var pageTurner = (function() {
  'use strict';

  var studentSearch = $('<div class="student-search"></div>');
  var input = $('<input placeholder="Search for students...">');
  var pageHeader = $('.page-header');
  var currentPage = $('.page');
  var students = $('.student-item');
  var empty = $('<h1 class="empty">No Results Found</h1>');
  var studentList = $('.student-list');


  /*
   * search method
   * Used by input keyup (in initialization code)
   */

  function search() {

    var value = input.val().toLowerCase().trim(); // Get search value

    var matches = students.filter(function(index) { // Go through all the students

      var name = $(this).find('h3').text().toLowerCase().trim(); // Get name
      var email = $(this).find('span.email').text().toLowerCase().trim(); // Get email

      if (name.search(value) !== -1 || email.search(value) !== -1) { // If name or email match
        return true; // Add it to the matches array
      } else {
        return false; // otherwise don't add it, but leave students array intact
      }

    });

    var pagination = createPage(0, students, matches); // display page and create menu
    $('.pagination').remove(); // Remove the current menu

    if(matches.length !== 0) {
      if(empty) {empty.remove();} // remove empty message if it's there
      currentPage.append(pagination); // attach menu
    }
  };


  /*
   * displayPage method
   * Used by createPage
   */

  function displayPage(page, entries, matches) {

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

  function createPageLink(index, navObj) {
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

  function createPageNavList(navObj) {
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

  function createPage(page, entries, matches) {
    var navObj = displayPage(page, entries, matches);
    var navList = createPageNavList(navObj);
    var pagination = $('<div class="pagination"></div>');
    pagination.append(navList);
    return pagination;
  }


  /*
   * Public method to initialize pageTurner
   * Used in script tag at bottom of page
   */

  return {
    init: function() {
      input.keyup(search);
      studentSearch.append(input);
      pageHeader.append(studentSearch);
      var pagination = createPage(0, students, students);
      currentPage.append(pagination);
    }
  };


})();
