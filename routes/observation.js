var mysql = require("mysql");

var connectionMap = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
};

const client_key = process.env.SECRET_KEY;
console.log("client_key : " + client_key);
console.log("host: " + connectionMap.host);
console.log("database: " + connectionMap.database);

exports.indexTEMP = function (req, res) {
  //console.log("header: " + req.get("DEVKEY"))
  //If the key doesn't match, say bye bye
  if (req.get("DEVICE_KEY") != client_key) {
    console.log(' if (req.get("DEVICE_KEY") != client_key)');
    res.sendStatus(401);
    return;
  }

  const sql = "select * from observations;";
  const connection = mysql.createConnection(connectionMap);
  connection.connect(function (err) {
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

exports.index = function (req, res) {
  console.log("laskjdfjhsdfkjh");
  //res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      data: [
        ["2020-01-01", 18],
        ["2020-01-02", 17],
        ["2020-01-03", 22],
        ["2020-01-04", 25],
        ["2020-01-05", 30],
        ["2020-01-06", 25],
        ["2020-01-07", 20],
        ["2020-01-08", 22],
        ["2020-01-10", 23],
        ["2020-01-11", 25],
        ["2020-01-12", 20],
        ["2020-01-13", 19],
        ["2020-01-14", 23],
        ["2020-01-15", 24],
        ["2020-01-16", 22],
        ["2020-01-17", 25],
        ["2020-01-18", 22],
        ["2020-01-19", 26],
      ],
    })
  );
  return;
};
exports.get_observationsREAL = function (req, res) {
  /* SAMPLE QUERY
      --- temperature for the past week
      select * from observations 
      where date(add_date) > DATE_SUB(current_date(), INTERVAL 7 DAY)
      and obs_type=1
      and location=1
      and sensor=2;
    */

  if (req.get("DEVICE_KEY") != client_key) {
    console.log(' if (req.get("DEVICE_KEY") != client_key)');
    res.sendStatus(401);
    return;
  }
  const rangeString = {
    day: "INTERVAL 1 DAY",
    week: "INTERVAL 7 DAY",
    month: "INTERVAL 1 MONTH",
    year: "INTERVAL 1 YEAR",
  };
  let error = "";
  let sql = "select * from observations where ";

  let range = req.query.range;
  if (!range) {
    error += "Range is required. ";
  }
  if (!(key in rangeString)) {
    error +=
      "Range value is not valid. Expected one of day|week|month|year, but got " +
      key +
      ". ";
  } else {
    sql += rangeString[range];
  }

  let sensor = req.query.sensor;
  if (!sensor) {
    error += "Sensor is required. ";
  }
  let location = req.query.location;
  if (!location) {
    error += "Location is required. ";
  }
  sql += "and obs_type=1 and sensor=2";
};

exports.add_observation = function (req, res) {
  if (req.get("DEVICE_KEY") != client_key) {
    console.log(' if (req.get("DEVICE_KEY") != client_key)');
    res.sendStatus(401);
    return;
  } else {
    console.log("here");
    var sql =
      "INSERT INTO observations (add_date, obs_type, sensor, location, value) VALUES (?,?,?,?,?)";
    const connection = mysql.createConnection(connectionMap);
    connection.connect(function (err) {
      if (err) {
        //console.log("Connection ERROR!");
        throw err;
      } else {
        //console.log("POST-- Connected!");
        //console.log(req.body);
        connection.query(
          sql,
          [
            req.body.add_date,
            req.body.obs_type,
            req.body.sensor,
            req.body.location,
            req.body.value,
          ],
          function (err, data) {
            if (err) {
              //console.log(err);
              res.status(500).send(err);
              connection.end();
            } else {
              //console.log('success');
              res.sendStatus(201);
              // successfully inserted into db
              connection.end();
            } //end query if(err)
          }
        );
      } //  end connect if(err) else
    }); // end connection.connect
  }
};

exports.get_sensors = function (req, res) {};

exports.get_locations = function (req, res) {};
