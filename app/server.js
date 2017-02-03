var application_root = __dirname,
	express = require("express"),
	http = require("http"),
	path = require("path"),
	methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	errorhandler = require("errorhandler")(),
	mongojs = require('mongojs');
	
	
	
var app = express();

var dburl = "mongodb://blogappadmin:blogappadmin@ds135039.mlab.com:35039/blogappdb";
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
		//str='[';
		str='';
		users.forEach( function(user) {
			//console.log(user);
			//str = str + '{ "name" : "' + user.firstName + user.lastName + '"},' +'\n';
			//
		});
		str = str.trim();
		str = str.substring(0,str.length-1);
		str = str + ']';
		res.end( JSON.stringify(users));
                // Prepared the jSon Array here
	}
  });
});

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
  

  db.user.save({firstName: jsonData.firstName, lastName: jsonData.lastName, email: jsonData.email, role: jsonData.role},
       function(err, saved) { // Query in MongoDB via Mongo JS Module
           if( err || !saved ) res.end( "User not saved"); 
           else res.end( "User saved");
       });
});

http.createServer(app).listen(app.get('port'), function () {
   console.log('myApp server listening on port ' + app.get('port'));
});