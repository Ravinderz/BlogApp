var application_root = __dirname,
	express = require("express"),
	http = require("http"),
	path = require("path"),
	methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	errorhandler = require("errorhandler")(),
	mongojs = require('mongojs');
	mongoose = require('mongoose');
	
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/User'); // get our mongoose model
var Post = require('./models/Post');
var morgan = require('morgan');
	
var app = express();

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
    app.use(bodyParser.json());                        
    app.use(bodyParser.urlencoded({ extended: true }));
	app.use(methodOverride());
	app.use(express.static(path.join(application_root, "public")));
	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	
// API ROUTES -------------------

// get an instance of the router for api routes	
var routes = express.Router();

//test api 
routes.get('/test', function (req, res) {
  res.send('Our Sample API is up...');
});


// setup method to test users get api
routes.get('/setup',function(req,res){
	
	var ravin = new User({
		firstName : 'ravinder',
		lastName : 'singh',
		email : 'ravinderz@outlook.com',
		password : '1234567890',
		phone : '1234567890'
	});
	
	ravin.save(function(err){
		if(err) throw err;
		console.log('user saved successfully');
		res.json({success:true});
	});
});

//authenticate a user
routes.post('/authenticate',function(req,res){
	User.findOne({
	email : req.body.email
	},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({success:false,message : 'Authentication failed! User not found'});
		}else if(user){
			
			 // check if password matches
			if(user.password != req.body.password){
			res.json({success:false, message : 'Authentication failed! invalid username and password'});
			}else{
				
				 // if user is found and password is right
				// create a token
				var token = jwt.sign(user,app.get('superSecret'),{
					expiresIn : '1440m' // 24 hours
				});
				
				// return the information including token as JSON
				res.json({
					success:true,
					message : 'token generated successfully',
					token : token
				});
			}
		}
	});
});

routes.post('/register',function(req,res){
	
	var newUser = new User({
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		email : req.body.email,
		password : req.body.password,
		phone : req.body.phone
	});
	
	newUser.save(function(err){
		if(err) throw err;
		res.json({success:true, message : 'User registered successfully'});
	});
});


// route middleware to verify a token
routes.use(function(req,res,next){
	
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		jwt.verify(token,app.get('superSecret'),function(err,decoded){
			if(err){
				return res.json({success: false,message : 'failed to authenticate token'});
			}
			else{
				req.decoded = decoded;
				next();
			}
		});
	}else{
		return res.status(403).send({
			success : false,
			message : 'No token provided'
		});
	}
	
	
});


//find all users from DB
routes.get('/users',function(req,res){
	User.find({},function(err,users){
		res.json(users);
	});
});

routes.post('/createPost',function(req,res){
	var createPost = new Post({
		title : req.body.title,
		description : req.body.description,
		author : req.body.author,
		content : req.body.content,
		likes : 0,
		createdTime : req.body.createdTime,
		tags : req.body.tags,
		isActive : true,
	});
	
	createPost.save(function(err){
		if(err) throw err;
		res.json({success:true,message:'post successfully created and saved in DB'});
	});
});

routes.get('/getAllPosts',function(req,res){
	Post.find({},function(err,posts){
		res.json(posts);
	});
});


app.use('/api/v1.0', routes);

http.createServer(app).listen(app.get('port'), function () {
   console.log('myApp server listening on port ' + app.get('port'));
});