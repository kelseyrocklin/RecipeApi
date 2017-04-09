
// load the express package and create our app
var express = require('express');
var app 	= express();
var path 	= require('path');
// body parser allows us to pull post content?
// app.body use the body parser
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var morgan     = require('morgan');
var User       = require('./user');
var Recipe     = require('./recipe');

// connect to the database at mongolab.
mongoose.connect('mongodb://kelsey:r3plenish@ds157459.mlab.com:57459/krocklintest');

// Test for a successful connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('connected successfully');
});

//body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	//not entirely confident on these since they are bring up undefined but from the book
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

// for console logging
app.use(morgan('dev'));

// grab our index homepage
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// get all the movies in the database collection
var apiRouter = express.Router();

apiRouter.use(function(req, res, next){
	// logging
	console.log('Someone is visiting the movie api');
	next();
});
apiRouter.get('/', function( req, res){
	res.json({message: "Hello"});
});

// simple post function for creating new users
// will add more later
apiRouter.route('/users')

    .post(function(req, res){

        var user = new User({
            name: req.body.username
        });
        user.save(function(err){
            if (err) res.json(err);
            else res.json({ message: 'User created!'});
        });
    })

    //returns all the users
    .get(function(req, res){
        User.find(function(err, users){
            if(err) res.send(err);

            res.json(users);
        });
    });


apiRouter.route('/recipes')

    // makes a single recipe
    .post(function(req, res){

        var recipe = new Recipe({
            name: req.body.name,
            //postedBy: user._id,
            ingredients: [{
                in_name: req.body.ingredient,
                measurement: req.body.measurement,
                amount: req.body.amount
            }]
        });

        recipe.save(function(err){
            if (err) res.json(err);
            else res.json({ message: 'Recipe created!'});
        });
    })

    //returns all the recipes
    .get(function(req, res){
        Recipe.find(function(err, recipes){
            if(err) res.send(err);

            res.json(recipes);
        });
    });

apiRouter.route('/recipes/:recipe_id')

    // deletes a recipe by id
    .delete(function (req, res) {
        Recipe.remove({
            _id: req.params.recipe_id
        }, function(err, movie){
            if (err) return res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });

// register our routes
app.use('/', apiRouter);

// start the server
app.listen(1337);
console.log('1337 is the magic port!');
