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

app.configure('development', function(){
    app.use(express.errorHandler());
});

// render our home page
app.get('/', function(request, response) {
    response.render('index');
});

app.post('/waitmusic', function(request, response) {

    var twiml = new twilio.TwimlResponse();

    var queuePosition = request.body.QueuePosition;
    var waitTime = request.body.AvgQueueTime;

    twiml.say('Hello, you are caller  ' + queuePosition + ' in line. There is an average wait time of ' + waitTime + ' .');
    twiml.play('http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3');

    twiml.redirect('/waitmusic');
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());

});

app.post('/abouttoconnect', function(request, response) {

    var twiml = new twilio.TwimlResponse();

    twiml.say('You will now be connected to an agent.');
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());

});


app.get('/agents', function(request, response) {
    // Create a TwiML generator
    var twiml = new twilio.TwimlResponse();

    twiml.dial(function(node) {
        node.queue({url: '/abouttoconnect'}, 'callers');
    });
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());
});


app.get('/callers', function(request, response) {
    // Create a TwiML generator
    var twiml = new twilio.TwimlResponse();

    twiml.enqueue({waitUrl: 'waitmusic'}, 'callers');
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());
});

app.post('/step2', function(request, response) {
    // Create a TwiML generator
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello from step 2');
    twiml.redirect('/step3')
    twiml.say('I\'m never executed');
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());
});

app.post('/step3', function(request, response) {
    // Create a TwiML generator
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello from step 3');
    // Return an XML response to this request
    response.set('Content-Type','text/xml');
    response.send(twiml.toString());
});

// Create a TwiML document to provide instructions for an outbound call
app.get('/incoming', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    resp.gather({
        action: '/parsenumber',
        numDigits: '1',
        timeout: '3'
    }, function() {
        this.say('Press 1 for store hours');
        this.say('Press 2 for weekly specials');
        this.say('Press 3 to select an extension');
    });
    resp.say('Please make a choice from the menu');
    resp.redirect({method: 'GET'}, '/incoming');
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.get('/conference', function(request, response) {
    var resp = new twilio.TwimlResponse();
    resp.say('The call will begin when the moderator arrives');
    resp.dial(function(node) {
//            node.number('+31527203011', {method: 'GET', url: 'screen-caller.xml'});
        node.conference({startConferenceOnEnter: false, endConferenceOnExit: false}, 'TwilioLive');
    });

    //resp.say('Thank you for trying to call extension. Goodbye.');
    //resp.hangup();
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.get('/conferencemoderator', function(request, response) {
    var resp = new twilio.TwimlResponse();
    //resp.say('The conference will begin when the moderator joins');
    resp.dial({hangupOnStar: true, action: 'callend.xml'}, function(node) {
//            node.number('+31527203011', {method: 'GET', url: 'screen-caller.xml'});
        node.conference({startConferenceOnEnter: true, endConferenceOnExit: false}, 'TwilioLive');
    });

    //resp.say('Thank you for trying to call extension. Goodbye.');
    //resp.hangup();
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});


app.post('/parsenumber', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    var digits = request.body.Digits;
    console.log('parsenumber:', digits);
    if (digits == 1) {
        resp.say('ACME Widgets is open from 9 am to 7 pm, Monday through Friday.');
    } else if (digits == 2) {
        resp.say('This week you can buy a 12 pack of widgets for only $9.');
    } else if (digits == 3) {
        resp.gather({
            action: '/dialnumber',
            numDigits: '1',
            timeout: '3'
        }, function() {
            this.say('Please enter an extension to call.');
        });
    } else {
        resp.say('I\'m sorry, that is not a valid choice. Please make a choice from the menu');
        resp.redirect({method: 'GET'}, '/incoming');
    }
    resp.say('Thank you for calling ACME Widgets. Goodbye.');
    resp.hangup();
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.post('/handlescreeninput', function(request, response) {
    // Create a TwiML generator
    var twiml = new twilio.TwimlResponse();
    var digits = request.body.Digits;
    console.log('handlescreeninput:', digits);
    if( digits == 1 ){
        twiml.say('Connecting you to the caller');
    } else {
        twiml.hangup();
    }
    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(twiml.toString());
});

app.post('/dialnumber', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    var digits = request.body.Digits;
    console.log('dialnumber:', digits);
    if (digits == 1) {
        resp.say('Connecting you to agent 1');
        resp.dial({action: '/dialcallstatus'}, function(node) {
            node.number('+31527203011', {method: 'GET', url: 'screen-caller.xml'});
        });
    }  else {
        resp.say('I\'m sorry, that is not a valid choice. Please make a choice from the menu');
        resp.redirect({method: 'GET'}, '/incoming');
    }
    resp.say('Thank you for trying to call extension. Goodbye.');
    resp.hangup();
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});



app.post('/handlecall', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    resp.say('Thank you for calling ACME Widgets. Goodbye.');
    resp.hangup();
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});

app.post('/statuscallback', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    resp.say('The caller has disconnected');
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});




app.post('/dialcallstatus', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    resp.say('The caller has disconnected');
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});


// Start our express app, by default on port 3000
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});