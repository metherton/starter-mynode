var twilio = require('twilio');
var resp = new twilio.TwimlResponse();

resp.gather({
    timeout:'10',
    finishOnKey:'*'
}, function() {
    this.say('Please enter your pin number and then press star.');
});
console.log(resp.toString());