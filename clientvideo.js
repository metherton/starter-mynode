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
app.get('/agent/:name', function(request, response) {

    var name = request.params.name;

    // Replace these two arguments with your own account SID and auth token:
    var token = new twilio.AccessToken(

        TWILIO_ACCOUNT_SID
    );
    // Give the capability generator permission to make outbound calls
    capability.allowClientOutgoing('AP9b1001a76c80b78f4fb71baaa8fa0653');
    capability.allowClientIncoming('tommy');

    // Render an HTML page which contains our capability token
    response.render('client_browser', {token:capability.generate()});

    // Render an HTML page which contains our capability token
    response.render('client_video_browser', {token:'eyJjdHkiOiJ0d2lsaW8tc2F0O3Y9MSIsImFsZyI6IkhTMjU2IiwidHlwIjoiSldUIn0.eyJqdGkiOiJTSzE5MjdiYmMxODE4M2FkZjU0ZGQ3YmZjM2UxMGQ3YmYza2pocWhQaGh1YmFNT1NQalciLCJpc3MiOiJTSzE5MjdiYmMxODE4M2FkZjU0ZGQ3YmZjM2UxMGQ3YmYzIiwic3ViIjoiQUM4Y2FhMmFmYjlkNTI3OTkyNjYxOWM0NThkYzcwOTlhOCIsImV4cCI6MTQ0MDE5NDI5MS44NDQ3NDMsImdyYW50cyI6W3siYWN0IjpbIioiXSwicmVzIjoiaHR0cHM6Ly9hcGkudHdpbGlvLmNvbS8yMDEwLTA0LTAxL0FjY291bnRzL0FDOGNhYTJhZmI5ZDUyNzk5MjY2MTljNDU4ZGM3MDk5YTgvVG9rZW5zIn0seyJhY3QiOlsiKiJdLCJyZXMiOiJodHRwczovL2FwaS50d2lsaW8uY29tLzIwMTAtMDQtMDEvQWNjb3VudHMvQUM4Y2FhMmFmYjlkNTI3OTkyNjYxOWM0NThkYzcwOTlhOC9Ub2tlbnMuanNvbiJ9LHsiYWN0IjpbImxpc3RlbiIsImludml0ZSJdLCJyZXMiOiJzaXA6cm9tYWluQEFDOGNhYTJhZmI5ZDUyNzk5MjY2MTljNDU4ZGM3MDk5YTguZW5kcG9pbnQudHdpbGlvLmNvbSJ9XSwibmJmIjoxNDQwMTA4MTcxLjg0NDc0MX0.bniBVrmiKtuai6lypn39d0Bu6h8ARxgEP7HOYPd9qBc'});
});

// Start our express app, by default on port 3000
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});