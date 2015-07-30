// Load app dependencies
var http = require('http'),
    path = require('path'),
    express = require('express'),
    twilio = require('twilio');

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER;

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Create an Express web application with some basic configuration
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// render our home page
app.get('/', function(request, response) {

    // Replace these two arguments with your own account SID and auth token:
    var capability = new twilio.Capability(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN
    );
    // Give the capability generator permission to make outbound calls
    capability.allowClientOutgoing('AP9b1001a76c80b78f4fb71baaa8fa0653');
    capability.allowClientIncoming('tommy');

    // Render an HTML page which contains our capability token
    response.render('client_browser', {token:capability.generate()});
});

app.post('/browseroutcall', function(request, response) {
    var resp = new twilio.TwimlResponse();
    var tocall = request.param('tocall'); // custom parameter from Twilio.Device.connect

    resp.dial(
        tocall,
        { callerId:'+31858889347'} //a phone number you've verified with Twilio to use as a caller ID number
    );
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.get('/capstone', function(request, response) {
    var resp = new twilio.TwimlResponse();
    resp.say('Welcome to Acme Adventures, we\'re connecting you now');
    resp.dial({timeout:5, action:'/hangup'}, function(node){
        node.client('tommy');

    });
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.post('/hangup', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    console.log('request', request);
    if (request.body.DialCallStatus == 'no-answer') {
        resp.say('No agents are available at this time. Goodbye.');

    } else {
        resp.say('Thank you for calling. Goodbye.');
    }
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.post('/statuscallback', function(request, response) {
    client.sendSms({
        to: '+31624543741',
        from: '+32460203266',
        body: 'For all your adventure needs, call Acme Adventures'
    }, function(err, data) {
        response.send('Message sendsms1 is really inbound!');
    });
});


// Start our express app, by default on port 3000
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});