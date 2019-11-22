var mysql = require('mysql');
//const connection = {
//	host: "localhost",
//	user: 'datauser',
//	password: 'localdatauser',
//	database : 'environment_data'
//};
var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DB_NAME
});



exports.index = function(req, res) {
 //res.render('observation', {title: 'Weather/Air Observations'});
    var sql = 'select * from observations;'
    connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	connection.query(sql, function (err, result, fields) {
	    if (err) throw err;
	    console.log("Result: " + JSON.stringify(result));
	    res.send(JSON.stringify(result));
	    connection.end();
	});
    });
//    res.send("observations");
};

exports.add_observation = function(req, res) {
    var sql = "INSERT INTO observations (add_date, obs_type, sensor, location, value) VALUES (?,?,?,?,?)";
    connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	console.log( req.body.add_date , req.body.obs_type, req.body.sensor , req.body.location, req.body.value);
	
	connection.query(sql, [ req.body.add_date , req.body.obs_type, req.body.sensor , req.body.location, req.body.value], function (err, data) {
	    if (err) {
		console.log(err);
		res.status(500).send(err);
		connection.end();
	    } else {
		console.log('success');
		res.sendStatus(201);
		// successfully inserted into db
		connection.end();
	    } 
	});
    });

};
