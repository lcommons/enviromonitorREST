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

var requestDefaults = {
  sensor: 2,
  obs_type: 1,
  location: 1,
  range: "day",
};
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
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    data: [
      { date: "2020-01-01", temp: 18 },
      { date: "2020-01-02", temp: 17 },
      { date: "2020-01-03", temp: 22 },
      { date: "2020-01-04", temp: 25 },
      { date: "2020-01-05", temp: 30 },
      { date: "2020-01-06", temp: 25 },
      { date: "2020-01-07", temp: 20 },
      { date: "2020-01-08", temp: 22 },
      { date: "2020-01-10", temp: 23 },
      { date: "2020-01-11", temp: 25 },
      { date: "2020-01-12", temp: 20 },
      { date: "2020-01-13", temp: 19 },
      { date: "2020-01-14", temp: 23 },
      { date: "2020-01-15", temp: 24 },
      { date: "2020-01-16", temp: 22 },
      { date: "2020-01-17", temp: 25 },
      { date: "2020-01-18", temp: 22 },
      { date: "2020-01-19", temp: 26 },
    ],
  });
  return;
};
exports.get_observations = function (req, res) {
  /* SAMPLE QUERY - temperature for the past week
      select * from observations 
      where date(add_date) > DATE_SUB(current_date(), INTERVAL 7 DAY)
      and obs_type=1
      and location=1
      and sensor=2;
       select * from observations 
       where  date(add_date) > DATE_SUB(current_date(), INTERVAL 7 DAY) 
       AND sensor = 2  
       AND obs_type = 1 
       AND location = 1 
       order by add_date
    */
  res.header("Access-Control-Allow-Origin", "*");
  console.log("params: " + req.params.keys);
  // let error = "";
  // let type = req.params.obs_type;
  // let sensor = req.params.sensor;
  // let location = req.params.location;
  // let start = req.params.start;
  // let end = req.params.end;
  let sql = "";
  try {
    sql += "select add_date, value from observations where ";
    sql += getDatePart(req);
    sql += getSensorIdValue(req);
    sql += getObservationTypeValue(req);
    sql += getLocationValue(req);
    // sql += type ? " AND obs_type = " + type : "obs_type = 1";
    // sql += sensor ? " AND sensor = " + sensor : "AND sensor = 1";
    // sql += location ? " AND location = " + location : " AND location = 1";
    //start ? sql + "AND start >= " + start : "";
    //end ? sql + "AND end <= " + end : "";
    sql += " order by add_date";
    sql += ";";
    console.log("sql: " + sql);

    // sql = `select add_date as 'date',value from observations
    //   where date(add_date) > DATE_SUB(current_date(), INTERVAL 7 DAY)
    //   and obs_type=1
    //   and location=1
    //   and sensor=1
    //   order by add_date`;
  } catch (err) {
    console.log(err);
    throw err;
  }
  const connection = mysql.createConnection(connectionMap);
  connection.connect(function (err) {
    if (err) {
      console.log("Connection ERROR:");
      console.log(err);
      connection.end();
      res.sendStatus(500);
      //throw err;
    } else {
      //console.log("POST-- Connected!");
      //console.log(req.body);
      connection.query(sql, function (err, rows, fields) {
        if (err) res.sendStatus(500);
        console.log("The solution is: ", rows);
        res.json(rows);
      });

      //      connection.end();
    }
  });
  //res.sendStatus(200);
};

const rangeString = {
  hour: "SUBTIME(current_date(), 3600)",
  day: "DATE_SUB(current_date(), INTERVAL 2 DAY)",
  week: "DATE_SUB(current_date(), INTERVAL 7 DAY)",
  month: "DATE_SUB(current_date(), INTERVAL 1 MONTH)",
  quarter: "DATE_SUB(current_date(), INTERVAL 3 MONTH)",
  half: "DATE_SUB(current_date(), INTERVAL 6 MONTH)",
  year: "DATE_SUB(current_date(), INTERVAL 1 YEAR)",
};

const getDatePart = (req) => {
  if (req.params.range && rangeString[req.params.range]) {
    console.log("range: " + rangeString[req.params.range]);
    return " date(add_date) > " + rangeString[req.params.range];
  } else if (req.params.start) {
    if (req.params.end) {
      return (
        " date(add_date) >= date(" +
        req.params.start +
        ") and date(add_date) <= date(" +
        req.params.start +
        ")"
      );
    } else {
      return " date(add_date) >= date(" + req.params.start + ")";
    }
  } else throw "Date range or start date are required";
};

const getObservationTypeValue = (req) => {
  if (req.params.obs_type) {
    return "  AND obs_type = " + req.params.obs_type;
  } else throw "Observation type (obs_type) is required.";
};

const getSensorIdValue = (req) => {
  if (req.params.sensor) {
    return " AND sensor = " + req.params.sensor;
  } else throw "sensor id is required.";
};

const getLocationValue = (req) => {
  if (req.params.location) {
    return " AND location = " + req.params.location;
  } else throw "sensor location is required.";
};
