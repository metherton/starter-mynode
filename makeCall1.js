'use strict';

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER;

//require the Twilio module and create a REST client
var client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

client.calls.create({
    to: '+31624543741',
    from: TWILIO_NUMBER,
    url: 'http://www.martinetherton.com/voice.xml',
    method: "GET",
    fallbackMethod: "GET",
    statusCallbackMethod: "GET",
    record: "false"
}, function(error, call) {
    if (error) {
        console.log(error.message);
    } else {
        process.stdout.write(call.sid);
    }
});
