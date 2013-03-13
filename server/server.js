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
var userExists = function(req, res, next, options) {
	// Define options
	options || (options = {});

	var success = options.success;
	options.success = function(model) {
		if(success) success(model);
	}
	var error = options.error;
	options.error = function(err) {
		if(error) error(err);
	}

	db.collection('users').findOne({$or:[{username: req.params.username},{email: req.params.email}]}, function(err, data) {
		// If an error occurs
		if(err) {
			options.error(err);
		}
		// If user not exists
		else if(!data) {
			options.error();
		}
		// If user exists
		else {
			options.success(data);
		}
	});
}

var createUser = function(req, res, next) {
	logRequest(req);

	var user = new Object();
  	user.username = req.params.username;
  	user.password = req.params.password;
  	user.email 	= req.params.email;
  	user.firstname 	= req.params.firstname;
  	user.lastname 	= req.params.lastname;
  	user.roles 	= req.params.roles.split(',');

  	userExists(req, res, next, {
  		success: function(model) {
  			res.send(500, model);
  		},
  		error: function(err) {
  			db.collection('users').insert(user, function(err2, result) {
  				if(err2 || !result) res.send(err2);
  				else res.send(200, result);
  			});
  		}
  	});

  	return next();
};

var deleteUser = function(req, res, next) {
	
	logRequest(req);

	db.collection('users').remove({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err) {
			res.send(402);
			throw err;
		}
		if(result) {
			res.send(200, result);
		}
	});

	return next();
}

var updateUser = function(req, res, next) {

	logRequest(req);

	var user = new Object();
  	user.username = req.params.username;
  	user.password = req.params.password;
  	user.email 	= req.params.email;
  	user.firstname 	= req.params.firstname;
  	user.lastname 	= req.params.lastname;
  	user.roles 	= req.params.roles.split(',');

  	db.collection('users').update({ _id: new ObjectID(req.params.id) }, {$set: user}, function(err, result) {
  		if(err || result == 0) {
  			res.send(402);
  		}
  		res.send(200, result);
  	});

	return next();
}

var getUser = function(req, res, next) {
	
	// Log current request
	logRequest(req);

	db.collection('users').findOne({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err) {
			res.send(err);
  			throw err;
		}
		else if(result) {
			console.log("      - result: User found: " + result.username);
			res.send(200, result);
		} else {
			console.log("      - result: User not found !");
			res.send(404);
		}
	});

	return next();
};

var getUsers = function(req, res, next) {
	
	logRequest(req);

	db.collection('users').find().toArray(function(err, result) {
		if(err) {
			throw err;
		}
		res.send(result);
	})

	return next();
};

var auth = function(req, res, next) {

	logRequest(req);

	db.collection('users').findOne({username: req.params.username, password: req.params.password}, function(err, result) {
		if(err) {
			console.log("Err: " + err);
			res.send(err);
		}
		else {
			if(result != null) {
				console.log("Found: " + result._id);
				db.collection('users').update({ _id: result._id }, {$set: {lastLogin: new Date().getTime()}}, function(err2, result2) {
					if(err2 || !result2 || result2 == 0) {
						res.send(500, err2);
					}
					if(result2 == 1) {
						db.collection('users').findOne({_id: result._id}, function(err, model) {
							if(err) {
								console.log("Err: " + err);
								res.send(err);
							}
							else {
								res.send(200, model);
							}
						});
					}
				});
		

			} else {
				res.send(500, 'Prout');
			}
		}
	});

	return next();
};



//
// ARTICLES Methods
//
var listArticles = function(req, res, next) {
	logRequest(req);

	db.collection('articles').find().toArray(function(err, articles) {
		if(err) {
			res.send(500, err);
		} else {
			res.send(200, articles);
		}
	})

	return next();
}

var getArticle = function(req, res, next) {
	logRequest(req);

	db.collection('articles').findOne({_id: new ObjectID(req.params.id)}, function(err, article) {
		if(err || !article) {
			res.send(500, err);
		} else {
			res.send(200, article);
		}
	})
}

var createArticle = function(req, req, next) {
	logRequest(req);

	var article = new Object();
	article.title = req.params.title,
	article.body = req.params.body,
	article.author = new ObjectId(req.params.author),
	article.lastUpdated = article.dateCreated = new Date();

	db.collection('articles').insert(article, function(err, result) {
		if(err || !result) res.send(err);
		else res.send(200, result);
	});

	return next();
}

var updateArticle = function(req, req, next) {
	logRequest(req);

	var article = new Object();
	article.title = req.params.title,
	article.body = req.params.body,
	article.author = new ObjectId(req.params.author),
	article.lastUpdated = req.params.lastUpdated,
	article.published = req.params.published

	db.collection('articles').update({ _id: new ObjectID(req.params.id) }, {$set: article}, function(err, result) {
  		if(err || result == 0) {
  			res.send(500, err);
  		}
  		res.send(200, result);
  	});

  	return next();
}

var deleteArticle = function(req, req, next) {
	logRequest(req);

	db.collection('articles').remove({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err || !result) {
			res.send(500, err);
		}
		else {
			res.send(200, result);
		}
	});

	return next();
}


//
// UTILS Methods
//
var logRequest = function(req) {
	var method = req.method;
	var url = req.url;
	var remoteAddr = req.connection.remoteAddress;

	console.log("\n-> [" + method + "] '" + url + "':");
	console.log("      - from  : " + remoteAddr);
	console.log("      - params  : " + req.params);
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

var optsReq = function(req, res, next) {
	logRequest(req);
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", false);
    res.header("Access-Control-Max-Age", '86400'); // 24 hours
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.send(200);

    return next();
}

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	return next();
}


//
// Create REST server
//
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(allowCrossDomain);

server.post('/users', createUser);
server.put('/users', createUser);

server.get('/users/:id', getUser);
server.del('/users/:id', deleteUser);
server.put('/users/:id', updateUser);


server.get('/users', getUsers);
server.post('/auth', auth);

server.opts('/users', optsReq);
server.opts('/users/:id', optsReq);

///////////////////////////////////////

server.get('/articles', listArticles);
server.post('/articles', createArticle);
server.get('/articles/:id', getArticle);
server.put('/articles/:id', updateArticle);
server.del('/articles/:id', deleteArticle);

server.opts('/articles', optsReq);
server.opts('/articles/:id', optsReq);

server.listen(10010, function () {
  console.log('%s listening at %s', server.name, server.url);
});