// Search By Name Button Click
$(document).on('click', "#searchByName", function(){
    console.log("inside searchbyname btn click");
  $("#searchName").removeClass("hidden");
  $("#searchGroup").addClass("hidden"); 
});
// Search By Group Button Click
$(document).on('click', "#searchByGroup", function(){
    console.log("inside searchbygroup btn click");
  $("#searchGroup").removeClass("hidden"); 
  $("#searchName").addClass("hidden"); 
});

//Handle search user by name
$(document).on("click", "#searchUser", function() {

    // empty div for search result
    $("#userList").html('');
    // Grab the user name from  userName input
    var userName = $("#userName").val();
    console.log("Inside search User==========:::  " + userName)

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/name/" + userName
    }).done(function(data) {
        console.log(data);  
        displaySearchResults(data);     
    });

    //Clear value entered in the input 
    $("#userName").val("");

});

//Handle search user by group
$(document).on("click", "#searchForGroup", function() {

    // empty div for search result
    $("#userList").html('');
    // Grab the user name from  userName input
    var groupName = $("#groupName").val();
    console.log("Inside search User==========:::  " + groupName)

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/group/" + groupName
    }).done(function(data) {
        console.log(data);  
        displaySearchResults(data);     
    });

    //Clear value entered in the input 
    $("#userName").val("");

});

// Handle click on the user tile get data by user id and bind it to modal
$(document).on('click', '.userTile', function(){
    var userId = $(this).data('userid');
    console.log("Inside User clicked function: " + userId);

    // Run a GET request to search for user by id
    $.ajax({
        method: "GET",
        url: "/users/" + userId
    }).done(function(data) {
        console.log(data); 
        populateModal(data);  
        $('#updateForm').modal('show');
    });
});

// Bind the data sent to tile grid
var displaySearchResults = function(users){
     for (var i = 0; i < users.length; i++) {
        //Create well                
        var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 userTile'>");    
        wellDiv.attr('data-userid', users[i]._id);
        // Create well
        var wellBody = $("<p>").html("<h4>" + users[i].firstname +  " " +  users[i].lastname +
            "</h4><span class='glyphicon glyphicon glyphicon-edit' data-toggle='modal' data-target='#updateForm'></span>");
       
        wellDiv.append(wellBody);
        $("#userList").append(wellDiv);
    }
}
// Populate user data in modal and handle user update
var populateModal = function(user){
    $("#modalTitle").text(user._id);
    $("#firstname").val(user.firstname);
    $("#lastname").val(user.lastname);
    $("#region").val(user.region);
    $("#group").val(user.group);
}