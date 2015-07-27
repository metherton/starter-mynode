var http = require('http'),
    express = require('express'),
    twilio = require('twilio'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    console.log(req.cookies.counter);
    var counter = parseInt(req.cookies.counter) || 0;

    if (counter == 0) {
        twiml.sms("Hello, thanks for the new message.");
    } else {
        twiml.sms("Hello, thanks for message number " + counter);
    }
    counter = counter + 1;
    res.cookie('counter',counter);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});


http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});