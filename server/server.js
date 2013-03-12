///////////////////////////////////////////////////////////////////////////////
//
//	Written by Nicolas FRADIN
//  Date: 2013/03/11
//
///////////////////////////////////////////////////////////////////////////////
var	mongo = require('mongoskin'),
	restify = require('restify'),
	config = require('./mongodb-config.js'),
	ObjectID = mongo.ObjectID;

// Database connection
var connectionString = config.auth.user + ':' + config.auth.pass + '@' + config.auth.url + ':' + config.auth.port + '/';
var db = mongo.db(connectionString, {
  	database: config.auth.database,
  	safe: true
});

//
// USER Methods
//
var createUser = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var user = new Object();
  	user.username = req.params.username;
  	user.password = req.params.password;
  	user.email 	= req.params.email;
  	user.firstname 	= req.params.firstname;
  	user.lastname 	= req.params.lastname;
  	user.roles 	= req.params.roles.split(',');


  	var userExists = false;

  	db.collection('users').findOne({username: user.username}, function(err, data) {
  		if(err) throw err;
  		if(!data) {
  			db.collection('users').insert(user, function(err2, result) {
		  		if(err2) {
		  			res.send(err);
		  			throw err;
		  		}
		  		if(result) {
		  			res.send(result);
		  			console.log(200, result);
		  			console.log("User '" + user.username + "' added !");
		  		}
		  	});
  		} else {
  			console.log("User '" + user.username + "' already exists !");
  			res.send({error: "User already exists !"});
  		}
  	});

  	return next();
};

var deleteUser = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('users').remove({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err) {
			res.send(402);
			throw err;
		}
		if(result) {
			res.send(result);
		}
	});

	return next();
}

var updateUser = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var user = new Object();
	user.id = req.params.id;
  	user.username = req.params.username;
  	user.password = req.params.password;
  	user.email 	= req.params.email;

  	db.collection('users').update({ _id: new ObjectID(user.id) }, {
  		'$set': {
  			username: user.username, 
  			password: user.password, 
  			email: user.email
  		}
  	});

	return next();
}

var getUser = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	// Log current request
	logRequest(req, "{ _id: "+req.params.id+" }");

	db.collection('users').findOne({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err) {
			res.send(err);
  			throw err;
		}
		else if(result) {
			console.log("      => User found: " + result.username);
			res.send(200, result);
		} else {
			console.log("      X> User not found !");
			res.send(404);
		}
	});

	return next();
};

var getUsers = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('users').find().toArray(function(err, result) {
		if(err) {
			throw err;
		}
		res.send(result);
	})

	return next();
};

var auth = function(req, res, next) {
	console.log("Auth user: " + req.params.username + ":" + req.params.password);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('users').findOne({username: req.params.username, password: req.params.password}, function(err, result) {
		if(err) {
			console.log("Err: " + err);
			res.send(err);
  			throw err;
		}
		else {
			console.log("User found: " + result);
			if(result != null) {
				res.send(result);
			} else {
				res.send(404);
			}
		}
	});

	return next();
};


var logRequest = function(req, paramsStr) {
	var method = req.method;
	var url = req.url;
	var remoteAddr = req.connection.remoteAddress;
	var params = req.params;

	console.log("\n-> [" + method + "] '" + url + "':");
	console.log("      - from  : " + remoteAddr);
	console.log("      - params: " + paramsStr);
}

var formatDate = function(date) {
	var day = date.getDate() + '';
	var month = (date.getMonth() + 1) + '';
	var year = date.getFullYear() + '';
	var hours = date.getHours() + '';
	var minute = date.getMinutes() + '';
  	var seconde = date.getSeconds() + '';

  	day = day.length == 1 ? '0' + day : day;
  	month = month.length == 1 ? '0' + month : month;
  	hours = hours.length == 1 ? '0' + hours : hours;
  	minute = minute.length == 1 ? '0' + minute : minute;
  	seconde = seconde.length == 1 ? '0' + seconde : seconde;

	var dateStr = day+"/"+month+"/"+year+" "+hours+":"+minute+":"+seconde;

	return dateStr;
}




//
// Create REST server
//
var server = restify.createServer();
server.use(restify.bodyParser());
//server.use(restify.fullResponse());

function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version'];

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.post('/user', createUser);
server.get('/user/:id', getUser);
server.del('/user/:id', deleteUser);
server.put('/user', updateUser);
server.get('/users', getUsers);
server.post('/auth', auth);

server.listen(10010, function () {
  console.log('%s listening at %s', server.name, server.url);
});