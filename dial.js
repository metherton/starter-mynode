var sys = require ('sys'),
url = require('url'),
http = require('http'),
qs = require('querystring');
var twilio = require('twilio');
var twiml = new twilio.TwimlResponse();
http.createServer(function (req, res) {
    //Create TwiML response
    var digits = req.Digits;
 //   if( digits == 1 ){
        twiml.say('Connecting you to agent 1');
        twiml.dial('+31527203011',{callerId:'+31858889347'});
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
 //   }
}).listen(1337, '127.0.0.1');

console.log('running at localhost 1337');