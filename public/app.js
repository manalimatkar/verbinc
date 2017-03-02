// Search By Name Button Click
$(document).on('click', "#searchByName", function() {
    // Set Initial State
    setInitState();
    // Set search type as username search
    $("#userList").attr("data-searchby", "username");
    // Show searchName form
    $("#searchName").removeClass("hidden");
    // Hide searchGroup form
    $("#searchGroup").addClass("hidden");
     // Clear userName input fiels
    $("#userName").val("");
    
   
});

// Search By Group Button Click
$(document).on('click', "#searchByGroup", function() {
    // Set Initial State
     setInitState();  
    // Set search type as groupname search
    $("#userList").attr("data-searchby", "groupname");
    // Show searchGroup Form
    $("#searchGroup").removeClass("hidden");
    // Hide search name form
    $("#searchName").addClass("hidden");      
    // Clear input field groupName
    $("#groupName").val("");
});

// Get all users button click
$(document).on("click", "#getAllUsers", function(){
    
    //Set Initial State 
    setInitState();
    // Clear data-serchby
    $("#userList").attr("data-searchby", "");
    // Hide search forms
    $("#searchGroup").addClass("hidden");
    $("#searchName").addClass("hidden");
    

    //Get current page number from data-current attr 
    var pageNum = $("#previous").attr("data-current");
    // Get call 
    $.ajax({
        method: "GET",
        url: "/users/getall/" + pageNum
    }).done(function(data) {
        // If number of pages returned are more than 1
        if (parseInt(data.pages) > 1) {
            
            //Show page navigation buttons
            $("#pageButtons").removeClass("hidden");
            // set last page attr to number of pages
            $("#next").attr("data-last", data.pages);
        }
            // Send results to display function
            displaySearchResults(data.docs);
    });
});

//Handle search user by name
$(document).on("click", "#searchUser", function() {
    // Set the pagination state
    initPagination();
    //Set data-searchby attr
    $("#userList").attr("data-searchby", "username")
    //Check input if not empty 
    if ($("#userName").val().toLowerCase() !== "") {
        // Hide warning
        $("#warningMessage").addClass("hidden");
        // Call function to get user by name
        getUserByName();
    } else {
        //If input is empty
        // Show warning and set message
        $("#warningMessage").removeClass("hidden");
        $("#warningMessage").html("<h3>Please enter Name</h3>");
    }
});

//Handle search user by group
$(document).on("click", "#searchForGroup", function() {
    // Set the pagination state
    initPagination();
    //Set data-searchby attr
    $("#userList").attr("data-searchby", "groupname");
    //Check input if not empty 
    if ($("#groupName").val().toLowerCase() !== "") {
         // Hide warning
        $("#warningMessage").addClass("hidden");
        // Call function to get user by group
        getUserByGroup();
    } else {
        //If input is empty
        // Show warning and set message
        $("#warningMessage").removeClass("hidden");
        $("#warningMessage").html("<h3>Please enter Group</h3>");

    }
});

// Handle click on the user tile
$(document).on('click', '.userTile', function() {
    // Get user id from userid data attr
    var userid = $(this).data('userid');
    // Get current user data and populate modal 
    $.ajax({
        method: "GET",
        url: "/users/" + userid
    }).done(function(data) {
        // Send data to modal function
        populateModal(data);
    });
});

/* Functions List */

// Get Users By Group and Display in user grid
// 
var getUserByGroup = function() {
    // Clear user grid
    $("#userList").html('');
    // Set search type as groupname search
    $("#userList").attr("data-searchby", "groupname");
    // Grab the user name from  userName input
    var groupName = $("#groupName").val().toLowerCase();
    // Get pageNum from previous btn attr (set to 1 on page load)
    var pageNum = $("#previous").attr("data-current");
    //Set the searchvalue attr to the search value
    $("#userList").attr("data-searchvalue", groupName);

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/group/" + groupName + "/" + pageNum
    }).done(function(data) {
        // If number of pages returned are more than 1
        if (parseInt(data.pages) > 1) {
           
            // Show page navigation buttons
            $("#pageButtons").removeClass("hidden");
            // set last page attr to number of pages
            $("#next").attr("data-last", data.pages);
        }
            // Send results to display function
            displaySearchResults(data.docs);
    });

}

// Get Users By Name and Display in user grid

var getUserByName = function() {

    // empty div for search result
    $("#userList").html('');
    // Set search type as username search
    $("#userList").attr("data-searchby", "username");
    // Grab the user name from  userName input
    var userName = $("#userName").val().toLowerCase();
    // Get pageNum from previous btn attr (set to 1 on page load)
    var pageNum = $("#previous").attr("data-current");
    //Set the searchvalue attr to the search value
    $("#userList").attr("data-searchvalue", userName);

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/name/" + userName + "/" + pageNum
    }).done(function(data) {
        
        //If number of pages returned are more than 1
        if (data.pages > 1) {
             // Show page navigation buttons
            $("#pageButtons").removeClass("hidden");
             // set last page attr to number of pages
            $("#next").attr("data-last", data.pages);
        }
            // Send results to display function
            displaySearchResults(data.docs);
    });

}


// Bind the data sent to tile grid
var displaySearchResults = function(users) {
    //If results length is > 0 populate results grid
    if(users.length > 0){
            //For each user create a div with class userTile
            for (var i = 0; i < users.length; i++) {
            //Create Div                 
            var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 userTile'>");
            // Set data attribute on the div
            wellDiv.attr('data-userid', users[i]._id);
            wellDiv.attr('data-firstname', users[i].firstname);
            wellDiv.attr('data-lastname', users[i].lastname);
            wellDiv.attr('data-region', users[i].region);
            wellDiv.attr('data-group', users[i].group);

            // Check the value of group and add color
            switch (users[i].group) {
                case "sales":
                    wellDiv.css('color', "indianred");
                    break;
                case "it":
                    wellDiv.css('color', "blue");
                    break;
                case "support":
                    wellDiv.css('color', "coral");
                    break;
                default:
                    wellDiv.css('color', "grey");
            }
            // Create content for div
            var wellBody = $("<p>").html("<h4>" + users[i].firstname + " " + users[i].lastname +
                "</h4><span class='glyphicon glyphicon glyphicon-edit' data-toggle='modal' data-target='#updateForm'></span>");
            // Append wellBody to wellDiv
            wellDiv.append(wellBody);
            // Append wellDiv to userList Grid
            $("#userList").append(wellDiv);
        }
     // If No results returned 
    } else{
         // Show warning message
         $("#warningMessage").removeClass("hidden");
         // Set warning message
         $("#warningMessage").html("<h3>No Results Found</h3>");

    }   
    
}


// Bind clicked user data to modal
var populateModal = function(user) {

        // Create full name
        var fullName = user.firstname + " " + user.lastname;
        // Set Modal Title to uppercase full name
        $("#modalTitle").text(fullName.toUpperCase());
        // Bind value of current user group to group field
        if (user.group === "") {
            $("#group").val("No group assigned");
        } else {
            $("#group").val(user.group);
        }
        //Set user._id attr on select dropdown
        $("#groupselect").attr("data-uid", user._id);
        // Show Modal on page
        $('#updateForm').modal('show');
    }

// Function to handle onchange event on select
var updateUserGroup = function() {
    // Get current/old group for user
    var oldgroup = $("#group").val();
    // Get new group value from select dropdown
    var newgroup = $("#groupselect").val();
    // Get user.id from select data attr
    var uid = $("#groupselect").attr("data-uid");
    // get current search state from searchby attr
    var searchby = $("#userList").attr("data-searchby");

     //console.log("INSIDE SELECT HANDLER UPDATE USER GROUP FUNCTION" + uid)
     
     // Post the data to updategroup route 
    $.ajax({
        method: "POST",
        url: "/updategroup",
        data: {
            id: uid,
            group: newgroup
        }
    }).done(function(data) {
        console.log(data);
        // updade tile with new group values  
        $('.userTile').filter('[data-userid = ' + uid + ']').attr('data-group', newgroup);
        //reset the select dropdown to default
        $("#groupselect").val($("#groupselect option:first").val());
        // Clear data from the Modal
        $("#modalTitle").text("");
        $("#group").val("");
        $("#updateUser").attr("data-updateid", "");
        // Hide Modal
        $('#updateForm').modal('hide');
    });
    // set the color of the updated user tile 
    if (searchby == "username" || searchby == "") {
        switch (newgroup) {
            case "sales":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "indianred");
                break;
            case "it":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "blue");
                break;
            case "support":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "coral");
                break;
            default:
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "grey");
        }
    } else {
        // If current search is by group and group is changed remove user
        if (searchby == "groupname" && newgroup !== oldgroup) {
            $('.userTile').filter('[data-userid = ' + uid + ']').fadeOut();
        }
    }
}

//Function to handle previous page navigation
var getPreviousPage = function() {
    //Create suburl var to populate based on the search state
     var subUrl = getSubUrl();
    
    // Get current page number
    var currentPage = $("#previous").attr("data-current");
    // console.log(currentPage);
    // If page number is 1
    if (currentPage === "1") {
        //alert user
        alert("you are on first page");
    } else {
        //If current page number is > 1      
        if (parseInt(currentPage) > 1) {
            //decrement page count by 1
            var prevPage = parseInt(currentPage) - 1;
            // Get data for prevPage
            $.ajax({
                method: "GET",
                url: subUrl + "/" + prevPage
            }).done(function(data) {
                console.log(data);
                //Set current page to new value
                $("#previous").attr("data-current", data.page);
                $("#next").attr("data-current", data.page);
                //Cleat userList display
                $("#userList").html("");
                //Populate userList with new page data
                displaySearchResults(data.docs);
            });
        }
    }
}
//Function to handle next page navigation
var getNextPage = function() {
     //Create suburl var to populate based on the search state
    var subUrl = getSubUrl();

    // Get current page number
    var currentPage = $("#next").attr("data-current");
    //Get last page number from data-last
    var lastPage = $("#next").attr("data-last");
    // console.log(currentPage);
    
    // if current page is last page
    if (currentPage === lastPage) {
        //alert user
        alert("you are on last page");
    } else {
        if (parseInt(currentPage) >= 1) {
            // Increment page number
            var nextPage = parseInt(currentPage) + 1;
            // Get data for nextPage
            $.ajax({
                method: "GET",
                url: subUrl + "/" + nextPage
            }).done(function(data) {
                console.log(data);
                 //Set current page to new value
                $("#next").attr("data-current", data.page);
                $("#previous").attr("data-current", data.page);
                 //Cleat userList display
                $("#userList").html("");
                //Populate userList with new page data
                displaySearchResults(data.docs);
            });
        }
    }
}
var getSubUrl = function(){
    
    var url = "";
     // Check search state for attr searchby and set the subUrl value
    if ($("#userList").attr("data-searchby") == "groupname") {
        //For search by groupname
        url = "/users/search/group/" + $("#userList").attr("data-searchvalue");
    } else if ($("#userList").attr("data-searchby") == "username") {
        //For search by username
        url = "/users/search/name/" + $("#userList").attr("data-searchvalue");
    } else if($("#userList").attr("data-searchby") == ""){
        //For all users
        url = "/users/getall";
    }
    return url;
}
var setInitState = function(){
     // Clear user grid
    $("#userList").html('');
     // Hide warningMessage
    $("#warningMessage").addClass("hidden");
    initPagination();
   
}
var initPagination = function(){
     // Hide pagination buttons
    $("#pageButtons").addClass("hidden");   
    //Set Page attr values
    $("#previous").attr("data-current", "1");
    $("#next").attr("data-current", "1");
    $("#next").attr("data-last", "1");
}

// $(document).keypress(function(e) {
//     var keyCode = e.which || e.keyCode;
//     console.log("key pressed" + keyCode);
//     if (keyCode == '13' && $("#userList").attr("data-searchby") == "username") {
//         if ($("#userName").val().toLowerCase() !== "") {
//             getUserByName();
//         } else {
//             alert("Please enter Name");
//         }
//     } else {
//         if (keyCode == '13' && $("#userList").attr("data-searchby") == "groupname") {
//             if ($("#groupName").val().toLowerCase() !== "") {
//                 getUserByGroup();
//             } else {
//                 alert("Please enter Group");
//             }
//         }
//     }
// });

