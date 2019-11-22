var mysql = require('mysql');
const connection = {
	host: "localhost",
	user: 'datauser',
	password: 'localdatauser',
	database : 'environment_data'
};


exports.index = function(req, res) {
 //res.render('observation', {title: 'Weather/Air Observations'});
    res.send("observations");
};

exports.add_observation = function(req, res) {
};
