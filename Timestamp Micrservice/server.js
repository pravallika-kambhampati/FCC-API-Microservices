// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Handle no date_string q
app.get('/api/timestamp/', (req, res) => {
  let date = new Date();
  
  res.json({"unix": date.getTime(), "utc" : date.toUTCString() });
  
});

// Timestamp functionality...
app.get('/api/timestamp/:date_string?', (req, res) => {
  // Get query from URL
  let input = req.params.date_string;
  let date;
  if (!isNaN(input)) {
    date = new Date(parseInt(input));
  } else {
    date = new Date(input);
  };
  
  // Then check if invalid:
  if (date.toString() === 'Invalid Date') {
    res.json({ "error": date.toString() });
  } else {
  // Finally return if valid:
    res.json({"unix": date.getTime(), "utc" : date.toUTCString() });
  }
 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});