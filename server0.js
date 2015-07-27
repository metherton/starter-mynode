var http = require('http'), 
    twilio = require('twilio'),
    express = require('express'), 
    bodyParser = require('body-parser');

  var app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));  
app.get('/', function(req, res) { 
    var twilio = require('twilio'); 
    var twiml = new twilio.TwimlResponse(); 
    if (req.query.Body == 'hello') { 
        twiml.sms('Hi!');     }
    else if(req.query.Body == 'bye') { 
        twiml.sms('Goodbye'); 
    } else { 
        twiml.sms('No Body param match, Twilio sends this in the request to your server.'); 
    } 
    res.writeHead(200, {'Content-Type': 'text/xml'}); 
    res.end(twiml.toString());
     }
);

http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});