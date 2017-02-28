// Search By Name Button Click
$(document).on('click', "#searchByName", function() {
    $("#userList").html('');
    $("#userList").attr("data-searchby", "username");
    $("#searchName").removeClass("hidden");
    $("#searchGroup").addClass("hidden");
});

// Search By Group Button Click
$(document).on('click', "#searchByGroup", function() {
    $("#userList").html('');
    $("#userList").attr("data-searchby", "groupname");
    $("#searchGroup").removeClass("hidden");
    $("#searchName").addClass("hidden");
});

//Handle search user by name
$(document).on("click", "#searchUser", function() {

    // empty div for search result
    $("#userList").html('');
    $("#userList").attr("data-searchby", "username");
    // Grab the user name from  userName input
    var userName = $("#userName").val().toLowerCase();

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/name/" + userName
    }).done(function(data) {
        console.log(data);
       //Populate userList with search results
        displaySearchResults(data);
    });

    //Clear value entered in the input 
    $("#userName").val("");

});

//Handle search user by group
$(document).on("click", "#searchForGroup", function() {

    // empty div for search result
    $("#userList").html('');
    $("#userList").attr("data-searchby", "groupname");
    // Grab the user name from  userName input
    var groupName = $("#groupName").val().toLowerCase();

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/group/" + groupName
    }).done(function(data) {
        //Populate userList with search results
        displaySearchResults(data);
    });

    //Clear value entered in the input 
    $("#userName").val("");

});

// Handle click on the user tile get data by user id and bind it to modal
$(document).on('click', '.userTile', function() {

    var userid = $(this).data('userid');
    
    $.ajax({
        method: "GET",
        url: "/users/" + userid
    }).done(function(data) {
        // Send data to modal
        populateModal(data);
    });
});



// Bind the data sent to tile grid
var displaySearchResults = function(users) {

    console.log("INSIDE DISPLAY SEARCH RESULTS FUNCTION");

    for (var i = 0; i < users.length; i++) {
        //Create well                
        var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 userTile'>");
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
}


// Populate user data in modal and handle user update
var populateModal = function(user) {

    console.log("INSIDE POPULATE MODAL FUNCTION " + user._id);
    var fullName = user.firstname + " " + user.lastname;

    $("#modalTitle").text(fullName.toUpperCase());
    if (user.group === "") {
        $("#group").val("No group assigned");
    } else {
        $("#group").val(user.group);
    }
    $("#updateUser").attr("data-updateid", user._id);
    $("#groupselect").attr("data-uid", user._id);
    $('#updateForm').modal('show');
}

var updateUserGroup = function() {
    var oldgroup = $("#group").val();
    console.log(oldgroup);
    var newgroup = $("#groupselect").val();
    var uid = $("#updateUser").attr("data-updateid");
    console.log(newgroup);
    var searchby = $("#userList").attr("data-searchby");
    console.log(searchby);


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



$(document).on('click', "#updateUser", function() {
    var uid = $(this).data('updateid');
    var group = $("#groupselect").val();
    console.log("Inside update click UID" + uid);

    $.ajax({
        method: "POST",
        url: "/updategroup",
        data: {
            id: uid,
            group: group
        }
    }).done(function(data) {
        console.log(data);
    });

});
