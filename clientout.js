// Require the twilio and express modules
var twilio = require('twilio'),
express = require('express');
// Create an express application
var app = express();
app.get('/', function(req, res) {
    // Replace these two arguments with your own account SID and auth token:
    var capability = new twilio.Capability(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    // Give the capability generator permission to make outbound calls
    capability.allowClientOutgoing('APabe7650f654fc34655fc81ae71caa3ff');
    // Render an HTML page which contains our capability token
    var token = {
        token:capability.generate()
    };
    res.render('index.ejs', token);
    console.log(token.token);
});

app.listen(3000);