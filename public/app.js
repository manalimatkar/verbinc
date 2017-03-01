// Search By Name Button Click
$(document).on('click', "#searchByName", function() {
    // Clear user grid
    $("#userList").html('');
    // Set search type as username search
    $("#userList").attr("data-searchby", "username");
    // Show searchName form
    $("#searchName").removeClass("hidden");
    // Hide searchGroup form
    $("#searchGroup").addClass("hidden");
    // Hide pagination buttons
    $("#pageButtons").addClass("hidden");
    // Hide warningMessage
    $("#warningMessage").addClass("hidden");
    // Clear userName input fiels
    $("#userName").val("");
});

// Search By Group Button Click
$(document).on('click', "#searchByGroup", function() {
    // Clear user grid
    $("#userList").html('');
    // Set search type as groupname search
    $("#userList").attr("data-searchby", "groupname");
    $("#searchGroup").removeClass("hidden");
    $("#searchName").addClass("hidden");
    $("#pageButtons").addClass("hidden");
    $("#warningMessage").addClass("hidden");
    $("#groupName").val("");
});

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

//Handle search user by name for button click
$(document).on("click", "#searchUser", function() {
    if ($("#userName").val().toLowerCase() !== "") {
        $("#warningMessage").addClass("hidden");
        getUserByName();
    } else {

        $("#warningMessage").removeClass("hidden");
        $("#warningMessage").html("<h3>Please enter Name</h3>");

    }
});

//Handle search user by group
$(document).on("click", "#searchForGroup", function() {

    if ($("#groupName").val().toLowerCase() !== "") {
        $("#warningMessage").addClass("hidden");
        getUserByGroup();
    } else {
        $("#warningMessage").removeClass("hidden");
        $("#warningMessage").html("<h3>Please enter Group</h3>");

    }
});

// Handle click on the user tile get data by user id and bind it to modal
$(document).on('click', '.userTile', function() {
    var userid = $(this).data('userid');
    // Get current user data and populate modal 
    $.ajax({
        method: "GET",
        url: "/users/" + userid
    }).done(function(data) {
        // Send data to modal
        populateModal(data);
    });
});

/* Functions List */

// Get Users By Group and Display in user grid

var getUserByGroup = function() {
    // empty div for search result
    $("#userList").html('');
    $("#userList").attr("data-searchby", "groupname");
    // Grab the user name from  userName input
    var groupName = $("#groupName").val().toLowerCase();
    var pageNum = $("#previous").attr("data-current");

    $("#userList").attr("data-searchvalue", groupName);

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/group/" + groupName + "/" + pageNum
    }).done(function(data) {
        if (parseInt(data.pages) > 1) {
            console.log("Number of total pages" + data.pages);
            $("#pageButtons").removeClass("hidden");
            $("#next").attr("data-last", data.pages);
        }
            displaySearchResults(data.docs);
    });

    //Clear value entered in the input 
    // $("#groupName").val("");
}

// Get Users By Name and Display in user grid

var getUserByName = function() {

    // empty div for search result
    $("#userList").html('');
    $("#userList").attr("data-searchby", "username");
    // Grab the user name from  userName input
    var userName = $("#userName").val().toLowerCase();
    var pageNum = $("#previous").attr("data-current");

    $("#userList").attr("data-searchvalue", userName);

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/name/" + userName + "/" + pageNum
    }).done(function(data) {
        console.log(data);
        if (data.pages > 1) {
            $("#pageButtons").removeClass("hidden");
            $("#next").attr("data-last", data.pages);
        }
            displaySearchResults(data.docs);
    });

    //Clear value entered in the input 
    // $("#userName").val("");
}


// Bind the data sent to tile grid

var displaySearchResults = function(users) {

    if(users.length > 0){
        //For each user create a div and based on the group color code the cell
            for (var i = 0; i < users.length; i++) {
            //Create well                
            var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 userTile'>");
            // Set data attribute on the well
            wellDiv.attr('data-userid', users[i]._id);
            wellDiv.attr('data-firstname', users[i].firstname);
            wellDiv.attr('data-lastname', users[i].lastname);
            wellDiv.attr('data-region', users[i].region);
            wellDiv.attr('data-group', users[i].group);
            switch (users[i].group) {
                case "sales":
                    wellDiv.css('color', "orange");
                    break;
                case "it":
                    wellDiv.css('color', "blue");
                    break;
                case "support":
                    wellDiv.css('color', "yellow");
                    break;
                default:
                    wellDiv.css('color', "grey");
            }

            // Create well
            var wellBody = $("<p>").html("<h4>" + users[i].firstname + " " + users[i].lastname +
                "</h4><span class='glyphicon glyphicon glyphicon-edit' data-toggle='modal' data-target='#updateForm'></span>");

            wellDiv.append(wellBody);
            $("#userList").append(wellDiv);
        }

    } else{

         $("#warningMessage").removeClass("hidden");
         $("#warningMessage").html("<h3>No Results Found</h3>");

    }
    
    
}


// Bind clicked user data to modal

var populateModal = function(user) {

        console.log("INSIDE POPULATE MODAL FUNCTION " + user._id);
        var fullName = user.firstname + " " + user.lastname;

        $("#modalTitle").text(fullName.toUpperCase());
        if (user.group === "") {
            $("#group").val("No group assigned");
        } else {
            $("#group").val(user.group);
        }
        $("#groupselect").attr("data-uid", user._id);
        $('#updateForm').modal('show');
    }
    // Function to handle onchange event on select
var updateUserGroup = function() {

    var oldgroup = $("#group").val();
    var newgroup = $("#groupselect").val();
    var uid = $("#groupselect").attr("data-uid");
    var searchby = $("#userList").attr("data-searchby");

    console.log("INSIDE SELECT HANDLER UPDATE USER GROUP FUNCTION" + uid)
    $.ajax({
        method: "POST",
        url: "/updategroup",
        data: {
            id: uid,
            group: newgroup
        }
    }).done(function(data) {
        console.log(data);
        // updade tile with new data values  
        $('.userTile').filter('[data-userid = ' + uid + ']').attr('data-group', newgroup);
        $("#groupselect").val($("#groupselect option:first").val());
        $("#modalTitle").text("");
        $("#group").val("");
        $("#updateUser").attr("data-updateid", "");
        $('#updateForm').modal('hide');

    });

    if (searchby == "username") {
        switch (newgroup) {
            case "sales":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "orange");
                break;
            case "it":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "blue");
                break;
            case "support":
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "yellow");
                break;
            default:
                $('.userTile').filter('[data-userid = ' + uid + ']').css('color', "grey");
        }
    } else {
        if (searchby == "groupname" && newgroup !== oldgroup) {
            $('.userTile').filter('[data-userid = ' + uid + ']').fadeOut();
        }
    }
}

var getPreviousPage = function() {

    var subUrl = "";

    if ($("#userList").attr("data-searchby") == "groupname") {
        subUrl = "/users/search/group/" + $("#userList").attr("data-searchvalue");
    } else {
        if ($("#userList").attr("data-searchby") == "username") {
            subUrl = "/users/search/name/" + $("#userList").attr("data-searchvalue");
        }
    }

    var currentPage = $("#previous").attr("data-current");
    console.log(currentPage);
    if (currentPage === "1") {
        alert("you are on first page");
    } else {
        if (parseInt(currentPage) > 1) {
            var prevPage = parseInt(currentPage) - 1;
            $.ajax({
                method: "GET",
                url: subUrl + "/" + prevPage
            }).done(function(data) {
                console.log(data);
                $("#previous").attr("data-current", data.page);
                $("#next").attr("data-current", data.page);
                $("#userList").html("");
                displaySearchResults(data.docs);
            });
        }
    }
}
var getNextPage = function() {

    var subUrl = "";

    if ($("#userList").attr("data-searchby") == "groupname") {
        subUrl = "/users/search/group/" + $("#userList").attr("data-searchvalue");
    } else {
        if ($("#userList").attr("data-searchby") == "username") {
            subUrl = "/users/search/name/" + $("#userList").attr("data-searchvalue");
        }
    }

    var currentPage = $("#next").attr("data-current");
    var lastPage = $("#next").attr("data-last");
    console.log(currentPage);
    // need to get total number of pages
    if (currentPage === lastPage) {
        alert("you are on last page");
    } else {
        if (parseInt(currentPage) >= 1) {
            var nextPage = parseInt(currentPage) + 1;
            $.ajax({
                method: "GET",
                url: subUrl + "/" + nextPage
            }).done(function(data) {
                console.log(data);
                $("#next").attr("data-current", data.page);
                $("#previous").attr("data-current", data.page);
                $("#userList").html("");
                displaySearchResults(data.docs);
            });
        }
    }
}
