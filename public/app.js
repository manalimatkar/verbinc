
$("#updateForm").hide();

$.getJSON("/users", function(users) {

    for (var i = 0; i < users.length; i++) {
        //Create well        
        var wellDiv = $("<div class='btn btn-default col-md-2'>");
    
        // Create panel body
        var wellBody = $("<p>").html("<h4>" + users[i].firstname +  "</h4><span class='glyphicon glyphicon glyphicon-edit'></span>");
        // create panel footer
        var wellFooter = $("<div class='text-right' userId='" + users[i]._id + "'>")
            .html("<span class='glyphicon glyphicon glyphicon-edit'></span> Assign Group");
        wellDiv.append(wellBody);
        // wellDiv.append(wellFooter);

        $("#userList").append(wellDiv);
    }
});