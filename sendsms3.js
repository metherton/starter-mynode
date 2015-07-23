'use strict';

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER;

var twilio = require('twilio');
var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

client.sms.messages.create({
    to:'+31624543741',
    from:TWILIO_NUMBER,
    body:'Picture messaging status:',
    mediaUrl: 'https://dl.dropboxusercontent.com/u/11489766/twilio/elearning/success.jpg'
}, function(error, message) {
    if (error) {
        console.log(error.message);
    } else {
        process.stdout.write(message.sid);
    }
});

