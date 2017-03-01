// Dependencies
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

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

// We set the port of the pagepagepp
app.set('port', process.env.PORT || 3000);

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_g0w1rj29:o6h4ve5g3gruecga1ujrqpa702@ds111940.mlab.com:11940/heroku_g0w1rj29");
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
app.get('/loadusers', function(req, res) {

    /*
       //To add data from a json file in the route folder
        var fs = require('fs');
        var user = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        console.log(user);
    */

    request('https://randomuser.me/api/?results=5000&nat=us&inc=name,nat', function(err, response) {
        var data = JSON.parse(response.body);
        // console.log(data.results);
        data.results.forEach(function(data) {
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
    // Tell the browser that we finished loading user data
    res.send("User Data Upload Complete");
});

/* Search user by it's ObjectId */
app.get("/users/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    User.findOne({ "_id": req.params.id })
        // now, execute our query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});
/* Search user by firstname */
app.get("/users/search/name/:firstname/:pageNum", function(req, res) {
    // Using the firstname passed in the url parameter,
    //  prepare a query that finds all matching names in our db...
    User.paginate({ firstname: req.params.firstname }, { page: req.params.pageNum, limit: 40 }, function(err, result) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(result);
            }
        });
});
/*
    Find User By Group
 */
app.get("/users/search/group/:group/:pageNum", function(req, res) {

    User.paginate({ group: req.params.group }, { page: req.params.pageNum, limit: 40 }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.json(result);
        }
    });

});

app.get("/users/getall/:pageNum", function(req,res){
    User.paginate({}, { page: req.params.pageNum, limit: 40 }, function(err, result) {
        // result.docs 
        // result.total 
        // result.limit - 10 
        // result.page - 3 
        // result.pages 
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.json(result);
        }
    });
});

/* Update Group For User */
app.post("/updategroup", function(req, res) {

    var groupName = req.body.group;
    var userid = req.body.id;

    User.findOneAndUpdate({ "_id": userid }, { $set: { 'group': groupName } }, { new: true })
        // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            } else {
                // Or send the document to the browser
                res.send(doc);
            }
        });

});



// trying pagination on server
app.get("/pageexample", function(req,res){
    User.paginate({}, { page: 1, limit: 40 }, function(err, result) {
        // result.docs 
        // result.total 
        // result.limit - 10 
        // result.page - 3 
        // result.pages 
        if(err){
            console.log(err);
        }else{
            console.log(result.docs);
            res.json(result.docs);
        }
    });
});

/* This will load all the users we saved to the mongoDB */
app.get("/users", function(req, res) {
    // Grab every doc in the Articles array
    User.find({}, function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

//App Routes section ends


// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port");
});
