var http = require('http'),
    twilio = require('twilio'),
    express = require('express'),
    bodyParser = require('body-parser');

var responseMapper = {
    'Hours': 'We are open every day from 9am until 6pm',
    'Location': 'Our store is located at: 123 Main Street',
    'Specials': 'Show this text to get 10% off'
};

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res) {
        var twilio = require('twilio');
        var twiml = new twilio.TwimlResponse();
        var body = req.query.Body;
        console.log('body:', body);
        console.log('responsMapper', responseMapper);
        if (responseMapper[body] === undefined) {
            twiml.message('Sorry, that question was invalid');
        } else {
            twiml.message(responseMapper[body]);
        }
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    }
);

http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});