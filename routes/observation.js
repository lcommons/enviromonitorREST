var mysql = require('mysql');

var connectionMap = {
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DB_NAME
};

const client_key = process.env.SECRET_KEY
console.log("client_key : " + client_key);

exports.index = function(req, res) {
    //console.log("header: " + req.get("DEVKEY"))
    //If the key doesn't match, say bye bye
    if (req.get("DEVICE_KEY") != client_key) {
	res.sendStatus(401);
	return;
    }
    
    const sql = 'select * from observations;';
    const connection = mysql.createConnection(connectionMap);
    connection.connect(function(err) {
	if (err) throw err;
	//console.log("Connected!");
	connection.query(sql, function (err, result, fields) {
	    if (err) throw err;
	    //console.log("Result: " + JSON.stringify(result));
	    res.send(JSON.stringify(result));
	    connection.end();
	});
    });
};

exports.add_observation = function(req, res) {
    if (req.get("DEVICE_KEY") != client_key) {
	res.sendStatus(401);
	return;
    } else {
	console.log("here");
	var sql = "INSERT INTO observations (add_date, obs_type, sensor, location, value) VALUES (?,?,?,?,?)";
	const connection = mysql.createConnection(connectionMap);
	connection.connect(function(err) {
	    if (err) {
		//console.log("Connection ERROR!");
		throw err;
	    } else {
		//console.log("POST-- Connected!");
		//console.log(req.body);
		connection.query(sql, [ req.body.add_date , req.body.obs_type, req.body.sensor , req.body.location, req.body.value], function (err, data) {
		    if (err) {
			//console.log(err);
			res.status(500).send(err);
			connection.end();
		    } else {
			//console.log('success');
			res.sendStatus(201);
			// successfully inserted into db
			connection.end();
		    }//end query if(err)
		});
	    }//  end connect if(err) else
	});// end connection.connect
    }
};
