exports.createUser = function(req, res, next, db) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var user = new Object();
  	user.username = req.params.username;
  	user.password = req.params.password;
  	user.email 	= req.params.email;


  	var userExists = false;

  	db.collection('users').findOne({username: user.username}, function(err, data) {
  		if(err) throw err;
  		if(!data) {
  			db.collection('users').insert({
		  		username: user.username,
		  		password: user.password,
		  		email: user.email
		  	}, function(err2, result) {
		  		if(err2) {
		  			res.send(err);
		  			throw err;
		  		}
		  		if(result) {
		  			res.send(result);
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


exports.deleteUser = function(req, res, next, db) {

	console.log("ok = " + req.params.id);

	db.collection('users').remove({_id: new ObjectID(req.params.id)}, function(err2, result) {
		if(err2) throw err;
		if(result) {
			res.send(result);
		}
	});

	return next();
}


exports.updateUser = function(req, res, next, db) {
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


exports.getUser = function(req, res, next, db) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('users').findOne({_id: new ObjectID(req.params.id)}, function(err, result) {
		if(err) {
			res.send(err);
  			throw err;
		}
		if(result) {
			console.log("User found: " + result.username);
			res.send(result);
		}
	});

	return next();
};


exports.getUsers = function(req, res, next, db) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('users').find().toArray(function(err, result) {
		if(err) {
			throw err;
		}
		res.send(result);
	})

	return next();
}