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
    database : 'environment_data'
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
};
