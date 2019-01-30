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
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
    // Make sure this is a page subscription
    // console.log(req.body.entry[0].messaging[0].message.text);
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function (entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.postback) {
                    processPostback(event);
                } else if (event.message) {
                    processMessage(event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function processPostback(event) {
    var senderId = event.sender.id;
    var payload = event.postback.payload;
    console.log("-------------------->" + event.postback.payload);

    if (payload === "GET_STARTED_PAYLOAD") {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        state = 0;
        request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, function (error, response, body) {
            var greeting = "";
            if (error) {
                console.log("Error getting user's name: " + error);
            } else {
                var bodyObj = JSON.parse(body);
                name = bodyObj.first_name;
                greeting = "Hello " + name + ". ";
            }

            sendMessage(senderId, { text: greeting });
        });
    }

}

function processMessage(event) {
    if (!event.message.is_echo) {
        var message = event.message;
        var senderId = event.sender.id;

        console.log("Received message from senderId: " + senderId);
        console.log("Message is: " + JSON.stringify(message));

        if (message.text) {
            console.log(message.text);
            
            sendMessage(senderId, message.text);
        }
    }
}

function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}


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