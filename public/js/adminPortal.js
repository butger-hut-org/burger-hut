document.addEventListener('DOMContentLoaded', () => {
     // Initially hide all content divs except for the default
     $(".adminPortalContent").hide();
     $("#userMgmt").show(); // Show adminPortal by default
 
     $(".sidebar a").on("click", function(e) {
         e.preventDefault(); // Prevent page reload
 
         // Remove 'active' class from all links and add to clicked one
         $(".sidebar a").removeClass("active");
         $(this).addClass("active");
 
         // Get the content ID from the data attribute
         const contentId = $(this).data("content");
 
         // Hide all content sections
         $(".adminPortalContent").hide();
 
         // Show the selected content section
         $("#" + contentId).show();
     });

    //  let isCollapsed = false;

    //  $(".toggle-btn").on("click", function () {
    //      isCollapsed = !isCollapsed; // Toggle the state
    //      $("#sidebar-wrapper").toggleClass("collapsed", isCollapsed);
    //  });
});