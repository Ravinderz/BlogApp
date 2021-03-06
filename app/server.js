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
var Comment = require('./models/Comment');
var morgan = require('morgan');
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require("nodemailer");
const uuidV1 = require('uuid/v1');
	
var app = express();
var mailResult = false;

//for sending mail 
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: config.usermail,
        pass: config.pass
    }
});

var db = mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var port = Number(process.env.PORT || 5000);

// use morgan to log requests to the console
app.use(morgan('dev'));
	//app.set('port', process.env.PORT || 5000);
	app.set('views', path.join(__dirname, 'views'));
    app.use(bodyParser.json());                        
    app.use(bodyParser.urlencoded({ extended: true }));
	app.use(methodOverride());
	app.use(express.static(path.join(application_root, "app")));
	app.use(express.static('app'));
	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	
// API ROUTES -------------------

// get an instance of the router for api routes	
var routes = express.Router();

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

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
	email : req.body.email,
	'isActive':true
	},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({success:false,message : 'Authentication failed! User not found'});
		}else if(user){
			
			 // check if password matches
			 console.log(user);
			 console.log(user.email);
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
					obj : user,
					token : token
				});
			}
		}
	});
});

routes.post('/register',function(req,res){
	var host = req.body.host;
	var token = uuidV1();
	var newUser = new User({
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		email : req.body.email,
		password : req.body.password,
		phone : req.body.phone,
		validateToken : token
	});

			newUser.save(function(err){
			 if(err) {
				console.log('Error Inserting New Data');
				if (err.name === 'ValidationError') {
					for (field in err.errors) {
					console.log(err.errors[field].message); 
					}
				}
				if(err.name === 'MongoError' && err.code === 11000){
					console.log("mongo error");
					return res.json({success:false,message:"email already exists"});
				}
			}

			//to send verification mail to the registered user
			function sendEmail(firstName,lastName,email,validateToken,host){
				var emailText = '<h3>Hi '+firstName+' '+lastName+'</h3><br><p>Please click the below link to verify your account</p><br><a href='+host+'/api/v1.0/validate?email='+email+'&tk='+validateToken+'>click here </a><br><h4>Regards</h4><h4>MadOverWords</h4>';
				var mailOptions={
							   to : email,
							   subject : 'MadOverWords verification email',
							   html : emailText
							}
			console.log(mailOptions);
			smtpTransport.sendMail(mailOptions, function(error, response){
				if(error){
					console.log("inside if");
					console.log(error);
					res.json({success:false, message : 'failed to send the mail. Please try again'});
				}else{
					console.log("inside else");
					mailResult =  true;
					res.json({success:true, message : 'A mail has been sent to your registered email. Please verify yourself by clicking the link in the mail.'});
				}
				});
			}
			sendEmail(req.body.firstName,req.body.lastName,req.body.email,token,host);
		});
});

// to validate a user from the email link
routes.post('/validateuser',function(req,res){
	User.findOne({
	email : req.body.email
	},{'isActive':false},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({success:false,message : 'Authentication failed! User not found'});
		}else if(user){
			
			 // check if password matches
			 console.log(user.email);
			if(user.validateToken != req.body.validateToken){
			res.json({success:false, message : 'Authentication failed! invalid username and token'});
			}else{
				
				 // if user is found and token is right
				// create a token
				var token = jwt.sign(user,app.get('superSecret'),{
					expiresIn : '1440m' // 24 hours
				});

				// make user active
				User.findOneAndUpdate(
					{'email':req.body.email},
					{isActive : true},
					{upsert:false,new:true},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'user validated successfully',doc:doc,token:token});
					}
				);
			}
		}
	});
});

// to get all the posts till date
routes.get('/post/getAllPosts',function(req,res){
	Post.find({'isActive':true},function(err,posts){
		res.json(posts);
	});
});

//to get 10 recent posts
routes.get('/post/getRecentTenPost',function(req,res){
	Post.find({'isActive':true}).limit(10).sort({_id:-1}).exec(function(err,posts){
		console.log(posts);
		res.json(posts);
	});
});

//to get top 10 posts
routes.get('/post/getTopTenPosts',function(req,res){
	Post.find({'isActive':true}).limit(10).sort({likes:-1}).exec(function(err,posts){
		console.log(posts);
		res.json(posts);
	});
});

//to get top 10 trending posts
routes.get('/post/getTopTenTrendingPosts',function(req,res){
	Post.find({'isActive':true}).limit(10).sort({views:-1}).exec(function(err,posts){
		console.log(posts);
		res.json(posts);
	});
});

// to find a post using id
routes.post('/post/findPostById/:postId',function(req,res){
	
	Post.find({'_id': req.params.postId},function(err,postDoc){
			if(err) throw err;
			if(!postDoc){
				res.json({success:false,message:'Comment with id : '+req.params.commentId+' could not be found'});
			}else{
				res.json({success:true,doc:postDoc});
			}
	});
	
});

//to like a post
routes.post('/post/likePost/:postId',function(req,res){
	console.log(req.body.userId);
	Post.find({'_id':req.params.postId},function(err,postDoc){
			if(err) throw err;
			if(!postDoc){
				res.json({success:false,message:'Post with id : '+req.params.postId+' could not be found'});
			}else{
				Post.findOneAndUpdate(
					{'_id':req.params.postId},
					{$inc:{"likes":1},
					updatedTime : Date.now(),
					$push : {likedBy : ObjectId(req.body.userId)}},
					{upsert:false,new:true},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'post liked successfully',doc:doc});
					}
				);
			}
	});
});

//to like a comment
routes.post('/post/likeComment/:commentId',function(req,res){
	console.log(req.body.userId);
	Post.find({'comments._id':req.params.commentId},{'comments.$':1},function(err,commentDoc){
			if(err) throw err;
			if(!commentDoc){
				res.json({success:false,message:'Comment with id : '+req.params.commentId+' could not be found'});
			}else{
				
				Post.findOneAndUpdate(
					{'comments._id':req.params.commentId},
					{$inc:{"comments.$.likes":1},
					updatedTime : Date.now(),
					"$push" : {"comments.$.likedBy" : ObjectId(req.body.userId)}},
					{upsert:false,new:true},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'comment liked successfully',doc:doc});
					}
				);
			}
	});
});

// to update views for a post
routes.post('/post/updateViews/:postId',function(req,res){
	console.log(req.body.userId);
	Post.find({'_id':req.params.postId},function(err,postDoc){
			if(err) throw err;
			if(!postDoc){
				res.json({success:false,message:'Post with id : '+req.params.postId+' could not be found'});
			}else{
				Post.findOneAndUpdate(
					{'_id':req.params.postId},
					{$inc:{"views":1}},
					{upsert:false,new:true},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'post view updated successfully'});
					}
				);
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

/* All the routes under this comment will need a access token to perform the required action*/

//find all users from DB
routes.get('/users',function(req,res){
	User.find({},function(err,users){
		res.json(users);
	});
});



//to create a post
routes.post('/post/createPost',function(req,res){
	console.log(req.body);
	var createPost = new Post({
		title : req.body.title,
		description : req.body.description,
		author : req.body.author,
		content : req.body.content,
		authorId : req.body.authorId,
		likes : 0,
		createdTime : Date.now(),
		updatedTime : Date.now(),
		tags : req.body.tags,
		isActive : true,
	});
	
	console.log(createPost);

	createPost.save(function(err){
		if(err) {
			console.log('Error Inserting New Data');
			if (err.name == 'ValidationError') {
				for (field in err.errors) {
				console.log(err.errors[field].message); 
				}
			}
		}
			//throw err;}
		res.json({success:true,message:'post successfully created and saved in DB'});
	});
});

//to get posts by particular user
routes.get('/post/getPostsByUser/:userId',function(req,res){
	Post.find({'isActive':true,'authorId':req.params.userId}).exec(function(err,posts){
		console.log(posts);
		res.json(posts);
	});
});

//to edit a post using postId
routes.post('/post/editPost/:postId',function(req,res){
	Post.find({_id : req.params.postId},function(err,editPost){
		if(err) throw err;
		
		if(!editPost){
			res.json({success:false,message : 'Post with id : '+req.params.postId+' could not be found'});
		}else{
			console.log(req.body);
			Post.update(
				{"_id" : req.params.postId},
				{	
					title : req.body.title,
					description : req.body.description,
					content : req.body.content,
					description : req.body.description,
					tags:  req.body.tags,
					updatedTime : Date.now(),

					
				},
				{upsert:false},
				function(err,doc){
					if(err) throw err;
					return res.json({success:true,message:'post updated successfully'});
				}
			);
		}
		
	});
});



// to delete a post using ID
routes.delete('/post/deletePost/:postId',function(req,res){
	
	Post.find({'_id': req.params.postId},{'isActive':true},function(err,postDoc){
			if(err) throw err;
			if(!postDoc){
				res.json({success:false,message:'post with id : '+req.params.postId+' could not be found'});
			}else{
				Post.update(
					{'_id': req.params.postId},
					{'isActive':false,
					updatedTime : Date.now()},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'post has been successfully deleted'});
					}
				);
			}
	});
	
});

//to add comment to a already existing post
routes.post('/post/addComment/:postId',function(req,res){
	Post.find({_id:req.params.postId},function(err,postDoc){
			if(err) throw err;
			if(!postDoc){
				res.json({success:false,message:'Post with id : '+req.params.postId+' could not be found'});
			}else{
				console.log(req.body);
				Post.findOneAndUpdate(
					{"_id":req.params.postId},
					{$push : {comments : req.body},
					updatedTime : Date.now()},
					{upsert:false,new:true},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'comment added successfully',doc:doc});
					}
				);
			}
	});
});




// to delete a comment in a post
routes.delete('/post/deleteComment/:postId/:commentId',function(req,res){
	
	Post.find({'comments._id': req.params.commentId},{'comments.$':1},function(err,commentDoc){
			if(err) throw err;
			if(!commentDoc){
				res.json({success:false,message:'Comment with id : '+req.params.commentId+' could not be found'});
			}else{
				Post.update(
					{'_id': req.params.postId},
					{$pull: 
					{comments: {_id:req.params.commentId}},
					updatedTime : Date.now()},
					function(err,doc){
						if(err) throw err;
						return res.json({success:true,message:'comment has been successfully deleted'});
					}
				);
			}
	});
	
});






app.use('/api/v1.0', routes);

app.get('*',function(req,res){
	res.sendFile('index.html',{root:__dirname});
})

var serverApp = http.createServer(app).listen(port, function () {
   console.log('myApp server listening on port ' + serverApp.address().port);
});