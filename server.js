// Dependencies
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our User model
var User = require("./models/User.js");
// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();


// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// we set the port of the app
app.set('port', process.env.PORT || 3000);

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/userinfo");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// All App Routes
// ---------------------------------------------------

/* index route (Home Page) */
app.get("/", function(req, res) {
    res.send(index.html);
});

/* Route to populate database with dummy user data */
app.get('/users', function(req, res){

     /*
       //To add data from a json file in the route folder
        var fs = require('fs');
        var user = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        console.log(user);
    */
   
    request('https://randomuser.me/api/?results=10&nat=us&inc=name,nat', function(err , response){
        var data = JSON.parse(response.body);
            // console.log(data.results);
            data.results.forEach(function(data){
                var newData = {
                    firstname: data.name.first,
                    lastname: data.name.last,
                    region: data.nat,
                    group: ''
                }
                 console.log(newData);
                // Using our User model, create a newUser to insert in db
                var newUser = new User(newData);

                // Now, save that newUser to the db
                newUser.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
            });
        });   
    });
});

//App Routes section ends


// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port");
});
