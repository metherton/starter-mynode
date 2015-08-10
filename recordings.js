// Load app dependencies
var http = require('http'),
    path = require('path'),
    express = require('express'),
    twilio = require('twilio'),
    bodyParser = require('body-parser');

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER
    WORKSPACE_SID = 'WS2b332a2b43dc7e9e6570b7ac423afcf6';

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Create an Express web application with some basic configuration
var app = express();
app.use(bodyParser.json());

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

app.get('/agent/:worker_sid', function(request, response) {

    var workerCapability = new twilio.TaskRouterCapability(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        WORKSPACE_SID,
        request.params.worker_sid
    );

    workerCapability.allowWorkerFetchAttributes();
    workerCapability.allowWorkerActivityUpdates();

    // Render an HTML page which contains our capability token
    response.render('agent_browser',  {worker_token: workerCapability.generate()});
});

app.post('/assignments', function(req, res) {

    //var response = {instruction: 'accept'};


    var response = {instruction: 'dequeue', post_work_activity_sid: 'WAc8db9ecd2be972674749569394841e54'  ,from: '+31858889347'};


  //  res.set('Content-Type','application/json');

    res.writeHead(200, {'Content-Type': 'application/json'});

    var json = JSON.stringify(response);
    res.end(json);
 //   res.send(json);
});

// Create a TwiML document to provide instructions for an outbound call
app.get('/routingincomingcall', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    resp.gather({
        action: '/enqueuecall',
        numDigits: '1',
        timeout: '5'
    }, function() {
        this.say('Para Español oprime el uno.', {language: 'es'});
        this.say('For English, please hold or press two.', {language: 'en'});
    });
    resp.say('Please make a choice from the menu');
    resp.redirect({method: 'GET'}, '/routingincomingcall');
    response.set('Content-Type','text/xml');
    response.send(resp.toString());
});


app.post('/enqueuecall', function(request, response) {
    // Create a TwiML generator
    var resp = new twilio.TwimlResponse();
    var language;
    var digits = request.body.Digits;
    if (digits == 1) {
        language = "es";
    } else {
        language = "en";
    }
    resp.enqueue({workflowSid: 'WW50d2a142e9a85d125c49d3bd8789a9da'}, function(node) {
        //var taskAttribute = '{"selected_language": "' + language + '"}'; // this works
        var taskAttribute = {selected_language: language}; // doesnt work

        node.taskAttributes(JSON.stringify(taskAttribute));
    });
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

// Start our express app, by default on port 3000
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});