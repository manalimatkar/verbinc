# User Search Prototype App

You can search user by name or the group user belongs to. There is option to view all user.
App is currently deployed and live at Heroku @ [Users App](https://stormy-beyond-25687.herokuapp.com)

## Getting Started

There are currently 3 flows available:

1. Search user by Firstname
2. Search user by Group
3. View all users

You can assign or update the group user belongs to from any of these flows.
When adding users to display they are color coded based on the group the user belongs to. I am working on adding legend to show the color codes.

## Technologies Used 

* Bootstrap and JQuery for frontend with Media queries to add more fluid responsive behavior for the elements on screen. 
* Node and Express for server routing and Mongodb with Mongoose for the data search and update.
* Data you see is pulled from external [API](https://randomuser.me/) and then stored in mongodb.
* Pagination done on server side with mongoose-paginate.

### Installing

1. Need Node.js and Mongodb setup on your computer.
2. Clone the repo
3. Run "npm install"
4. Update mongoose.connnect() at server.js to point to your local mongodb collection.
5. Uncomment Grab Data link from the navigation in index.html
6. Run "node server" to start server
7. Open browser and load http://localhost:3000 to load the application.

## Authors

**Manali Matkar**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details




