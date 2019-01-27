var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var PORT = process.env.PORT || 5000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Deployed!");
});


// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
    if (req.query["hub.verify_token"] === "ecom_token") {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});


request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://gtps.org.in/shoppify/user/verify/",
    "body": JSON.stringify({
        "fbid": "132",
        // "datetime": "2019-01-27T06:22:14.427Z"
        "datetime": new Date()
    })
}, (error, response, body) => {
    if (error) {
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