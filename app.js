var express = require("express");
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 5000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});