var myEndpoint;

$(document).ready(function() {
    $('#log').text("DOM Loaded");
    myEndpoint = new Twilio.Endpoint(token, {debug: true});
    console.log('myEndpoint', myEndpoint);
    myEndpoint.listen().then(function(endpoint) {
        $('#log').text("Address " + endpoint.address + " Listening for Invites");
    });

    myEndpoint.on('invite', function(invite) {
        $('#log').text("Incoming invite from: " + invite.from);
        invite.accept().then(function(conversation) {
            $('#log').text("Connected to " + invite.from);
            showVideoStreams(conversation);
        });
    });
});

// configure outgoing call button
document.getElementById('call').onclick = function() {
    var remoteAddress = $('#remote-address-name').val();
    if (remoteAddress == '') {
        $('#log').text("You must enter a participant's name to start a call");
        return;
    }
    $('#log').text("Starting a conversation with " + remoteAddress);
    myEndpoint.createConversation(remoteAddress).then(function(conversation) {
        showVideoStreams(conversation);
        $('#log').text("Connected to " + remoteAddress);
    }, function(error) {
        console.error('Unable to set up call.');
        $('#log').text(error.message);
        console.dir(error);
    });
};

function showVideoStreams(conversation) {

    $('#local-video').empty(); // remove the image placeholders
    $('#remote-video').empty();

    conversation.localMedia.attach('#local-video'); // show local video

    $('#local-video-label').html(myEndpoint.address); // show local address

    conversation.on('participantConnected', function(participant) {
        console.log(participant.address + ' joined the Conversation');
        participant.media.attach('#remote-video'); // show participant video
        $('#remote-video-label').html(participant.address); // show participant address
    })

    conversation.on('participantDisconnected', function(participant) {
        console.log(participant.address + ' has left the Conversation');
        $('#log').text(participant.address + ' has left the Conversation');
        $('#remote-video').html('<img src="http://placehold.it/360x270s&text=Remote+Video"  width="100%">');
        $('#remote-video-label').empty();
    })
};

// configure hangup button
document.getElementById('hangup').onclick = function() {
    if (myEndpoint.conversations.size == 0) {
        $('#log').text("No active conversations to leave");
        return;
    }

    for (conversation in myEndpoint.conversations) {
        conversation.leave().then(function(Conversation) {
            $('#log').text("You left the conversation");
        }, function(error) {
            console.error(error.message);
            $('#log').text('Unable to leave the conversation.');
        });
    }

}


// configure preview link
document.getElementById('preview').onclick = function() {
    previewMedia = new Twilio.LocalMedia(); // get local MediaStream
    Twilio.getUserMedia().then(
        function(mediaStream) {
            previewMedia.addStream(mediaStream);
            $('#local-video').empty();  // remove the image placeholder
            previewMedia.attach('#local-video'); // show local address
        },
        function(error) {
            console.error("Unable to access local media", error);
            $('#log').text("Unable to access Camera and Microphone");
        });
}

