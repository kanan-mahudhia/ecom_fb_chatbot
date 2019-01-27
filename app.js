var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var PORT = process.env.PORT || 5000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://gtps.org.in/shoppify/user/verify/",
    "body": JSON.stringify({
        "fbid": "123"
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});

//request.post({
//    "headers": { "content-type": "application/x-www-form-urlencoded" },
//    "url": "http://gtps.org.in/shoppify/user/verify/",
//    "body": "fbid=132"
//}, (error, response, body) => {
//    if(error) {
//        return console.dir(error);
//    }
//    console.dir(JSON.parse(body));
//});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});