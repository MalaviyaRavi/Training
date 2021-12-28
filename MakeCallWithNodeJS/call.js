const accountSid = "AC0ab09c240edf73497cc17a200af31d6a";
const authToken = "5eba6d3874af1d1f7e79b1ab49f85704";
const client = require('twilio')(accountSid, authToken);

client.calls
    .create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: '+919106876867',
        from: +16077033948
    })
    .then(call => console.log(call.sid)).catch(err => console.log(err));