
$("#updateUser").hide();

// $.getJSON("/pageexample", function(users) {

//     for (var i = 0; i < users.length; i++) {
//         //Create well        
//         var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 wordWrap'>");    
//         // Create well
//         var wellBody = $("<p>").html("<h4>" + users[i].firstname +  " " +  users[i].lastname +
//             "</h4><span class='glyphicon glyphicon glyphicon-edit' data-toggle='modal' data-target='#updateForm'></span>");
    
//         wellDiv.append(wellBody);


//         $("#userList").append(wellDiv);
//     }
// });


// When you click the Search button
$(document).on("click", "#searchUser", function() {
    // empty div for search result
    $("#userList").html('');
    // Grab the user name from  userName input
    var userName = $("#userName").val();
    console.log("Inside search User==========:::  " + userName)

    // Run a GET request to search for users
    $.ajax({
        method: "GET",
        url: "/users/search/" + userName
    }).done(function(data) {
        console.log(data);  
        displaySearchResults(data);     
    });

    //Clear value entered in the input 
    $("#userName").val("");

});

$(document).on('click', '.wordWrap', function(){
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
})

var displaySearchResults = function(users){

     for (var i = 0; i < users.length; i++) {
        //Create well                
        var wellDiv = $("<div class='btn btn-default col-xs-6 col-sm-4 col-md-3 col-lg-2 wordWrap'>");    
        wellDiv.attr('data-userid', users[i]._id);
        // Create well
        var wellBody = $("<p>").html("<h4>" + users[i].firstname +  " " +  users[i].lastname +
            "</h4><span class='glyphicon glyphicon glyphicon-edit' data-toggle='modal' data-target='#updateForm'></span>");
       
        wellDiv.append(wellBody);
        $("#userList").append(wellDiv);
    }

}

var populateModal = function(user){

    $("#modalTitle").text(user._id);
    $("#firstname").val(user.firstname);
    $("#lastname").val(user.lastname);
    $("#region").val(user.region);


}