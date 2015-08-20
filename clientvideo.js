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


var token = 'test123';

var myEndpoint = new Twilio.Endpoint(token, {debug: true});

myEndpoint.listen().then(function(endpoint) {
        $('#log').text("Address " + endpoint.address + " Listening for Invites");
    }, function(error) {
    $('#log').text("Endpoint could not start listening");
});



// leave conversation


myEndpoint.createConversation(remoteAddress).then(function(conversation) {
    conversation.on('participantJoined', function(participant) {
        participant.media.attach(document.getElementById('remote-video'));
    })
}, function(error) {
    console.error('Unable to set up call.');
});

myConversation.on('participantConnected', function(participant) {
    console.log(participant.address + ' joined the Conversation');
    // Get the participant's Media,
    var remoteMedia = participant.media;
    // attach the media stream to a div in your application
    remoteMedia.attach(document.getElementById('participant-videos'));
});

myConversation.on('leave', function() {
    console.log('left the Conversation');
});

//myEndpoint.on('invite', function(invite) {
//    if (confirm('Accept invite from ' + invite.from + '?')) {
//        invite.accept().then(function(conversation) {});
//    } else {
//        invite.reject();
//    }
//}, function(error) {
//    $('#log').text(error.message);
//});

myEndpoint.on('invite', function(invite) {
    $('#log').text("Incoming invite from: " + invite.from);
    invite.accept().then(function(conversation) {
        $('#log').text("Connected to " + invite.from);
    });
});