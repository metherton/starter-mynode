'use strict';

var http = require('http'),
    express = require('express'),
    twilio = require('twilio');

var app = express();

app.get('/', function(req, resp) {
   // var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    twiml.gather({
        timeout:'10',
        finishOnKey:'*'
    }, function() {
        this.say('Please enter your pin number and then press star.');
    });
    console.log(twiml.toString());
});


http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});