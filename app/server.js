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
	//app.use(app.router);
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

/*var dburl = "mongodb://blogappadmin:blogappadmin@ds135039.mlab.com:35039/blogappdb";
var collection = ["user"]
var db = mongojs(dburl,collection);

db.on('connected',function(){
	console.log('connection to mongodb established');
});

	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
    app.use(bodyParser.json());                        
    app.use(bodyParser.urlencoded({ extended: true }));
	//app.use(app.router);
	app.use(methodOverride());
	app.use(express.static(path.join(application_root, "public")));
	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));



app.get('/api', function (req, res) {
  res.send('Our Sample API is up...');
});

app.get('/users', function (req, res) {
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Methods", "GET, POST");
        // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as Cross           // Domain Request
	db.user.find(function(err, users) { // Query in MongoDB via Mongo JS Module
	if( err || !users) res.send("No users found");
	  else 
	{
		res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
		res.end( JSON.stringify(users));
                // Prepared the jSon Array here
	}
  });
});

/*app.get('/user/authenticate',function(req,res){
	console.log("insde Authenticate method");
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
	var data = req.	
});*/
/*
app.post('/user/register', function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as  
 // Cross Domain Request
  var data = req.body;
  console.log("data ",data);
  var jsonData = data;
    console.log("jsondata ", jsonData);
  

  db.user.save({firstName: jsonData.firstName, lastName: jsonData.lastName, email: jsonData.email, password : jsonData.password, phone:jsonData.phone},
       function(err, saved) { // Query in MongoDB via Mongo JS Module
           if( err || !saved ) res.end( "User not saved"); 
           else res.end( "User saved");
       });
});
*/

app.use('/api/v1.0', routes);

http.createServer(app).listen(app.get('port'), function () {
   console.log('myApp server listening on port ' + app.get('port'));
});