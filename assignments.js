var http = require('http'),
    express = require('express'),
    twilio = require('twilio'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/assignments', function(req, res) {
    var response = {instruction: 'accept'};
    res.set('Content-Type','application/json');
    var json = JSON.stringify(response);
    res.send(json);
});

http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});