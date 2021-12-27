const {
    TelnyxRTC
} = require('@telnyx/webrtc');

// Initialize the client
const client = new TelnyxRTC({
    // Required credentials
    credentials: {
        // Telnyx Connection Username
        username: 'username',
        // Telnyx Connection Password
        password: 'password',
    },
    // Other options
    //
    // This can be a DOM element, DOM selector, or a function that returns an element.
    remoteElement: '#videoOrAudioSelector',
    useMic: true,
    useSpeaker: true,
    useCamera: false,
});

// Create a variable to track the current call
let activeCall;

// Attach event listeners
client
    .on('socket.connect', () => console.log('socket connected'))
    .on('socket.close', () => console.log('socket closed'))
    .on('registered', () => console.log('registered'))
    .on('unregistered', () => console.log('unregistered'))
    // Event fired on call updates, e.g. when there's an incoming call
    .on('callUpdate', (call) => {
        activeCall = call;

        switch (call.state) {
            // Connecting to a call
            case 'connecting':
                return;
                // Receiving an inbound call
            case 'ringing':
                return;
                // An established and active call
            case 'active':
                return;
                // Call is active but on hold
            case 'held':
                return;
                // Call is over and can be removed
            case 'done':
                activeCall = null;
                // New calls that haven't started connecting yet
            case 'new':
            default:
                return;
        }
    });

// Connect and login
client.connect();













// 'use strict';

// const Telnyx = require('telnyx');
// const Express = require('express');
// const bodyParser = require('body-parser');
// const app = Express();

// /**
//  * You'll need to make sure this is externally accessible. ngrok (https://ngrok.com/)
//  * makes this really easy.
//  *
//  * To run this file, just provide your Secret API Key and Webhook Secret, like so:
//  * TELNYX_API_KEY=KEYXXX TELNYX_PUBLIC_KEY=ZZZXXX node express.js
//  */

// const apiKey = "KEY017DCC8ECAFAD92B636087F29968B27D_c9qbgBGvffkaBBcSqBftQ6";
// const publicKey = "Xy3ad+JQeuhq2e9Xkz+ggN8CGSlJmkwVOpDuWdBJ/DY=";

// const telnyx = Telnyx(apiKey);

// app.post('/webhooks', bodyParser.json(), function (req, res) {
//     var event;

//     try {
//         event = telnyx.webhooks.constructEvent(
//             // webhook data needs to be passed raw for verification
//             JSON.stringify(req.body, null, 2),
//             req.header('telnyx-signature-ed25519'),
//             req.header('telnyx-timestamp'),
//             publicKey
//         );
//     } catch (e) {
//         // If `constructEvent` throws an error, respond with the message and return.
//         console.log('Error', e.message);

//         return res.status(400).send('Webhook Error:' + e.message);
//     }

//     /**
//      * Messaging:
//      */
//     if (event.data.event_type === 'message.finalized') {
//         console.log('Message Finalized.Status: ' + event.data.payload.call_control_id);
//     }

//     /**
//      * Inbound Call Control:
//      * first we listen for an initiation event and then answer the call
//      */
//     if (event.data.event_type === 'call.initiated') {
//         console.log('Call Initiated. Answering call with call control id: ' + event.data.payload.call_control_id);

//         const call = new telnyx.Call({
//             call_control_id: event.data.payload.call_control_id
//         });

//         call.answer();
//     }
//     if (event.data.event_type === 'call.answered') {
//         console.log('Call Answered. Gather audio with the call control id: ' + event.data.payload.call_control_id);

//         const call = new telnyx.Call({
//             call_control_id: event.data.payload.call_control_id
//         });

//         call.gather_using_audio({
//             audio_url: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3'
//         });
//     }
//     if (event.data.event_type === 'call.gather.ended') {
//         console.log('Call Gathered with Audio. Hanging up call control id: ' + event.data.payload.call_control_id);

//         const call = new telnyx.Call({
//             call_control_id: event.data.payload.call_control_id
//         });

//         call.hangup();
//     }
//     if (event.data.event_type === 'call.hangup') {
//         console.log('Call Hangup. call control id: ' + event.data.payload.call_control_id);
//     }

//     // Event was 'constructed', so we can respond with a 200 OK
//     res.status(200).send(`Signed Webhook Received: ${event.data.event_type}, ${event.data.id}`);
// });

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });


// // 'use strict';

// // const Telnyx = require('telnyx');

// /**
//  * To run this file, just provide your Secret API Key, like so:
//  * TELNYX_API_KEY=KEYXXX node index.js
//  */

// // const apiKey = "KEY017DCC8ECAFAD92B636087F29968B27D_c9qbgBGvffkaBBcSqBftQ6";
// // const {
// //     v4: uuidv4
// // } = require('uuid');

// // const telnyx = Telnyx(apiKey);

// // // try {
// //     telnyx.calls.create({
// //         connection_id: "1794067054261700257",
// //         to: '+919106876867',
// //         from: '+18773690738'
// //     });
// // // } catch (e) {
// // //     console.error(e);
// // // }