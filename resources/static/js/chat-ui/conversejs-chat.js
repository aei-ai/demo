// NOTE: we created the following 3 ConverseJS users for demo. You can create your own users to login to chats
// Demo user 1 --> username(jid): d1aei@conversejs.org  /  password: d1aei
// Demo user 2 --> username(jid): d2aei@conversejs.org  /  password: d2aei
// Demo user 3 --> username(jid): d3aei@conversejs.org  /  password: d3aei
var jid;

// configure ConverseJS chat client and server for demo
converse.plugins.add('aei-plugin', {

    initialize: function () {

        // login to the aEi.ai service and create an aEi.ai user
        this._converse.api.listen.on('roster', function () {
            // get ConverseJS user from ConverseJS login form
            let _converse = this.__super__._converse;
            jid = _converse.api.user.jid().split("@")[0];
            console.log(jid);

            // login to the aEi service and save access token in a cookie
            login(username, password);

            // create a new aEi user if not already created
            let userId = $.cookie(jid);
            if (typeof userId === "undefined" || userId === null || userId === "") {
                createNewUser(jid, getAccessToken());
            }
        });

        // NOTE: make sure recipient user is already logged in ConverseJS chat (in another browser tab)
        // NOTE: use 1st part of username as nickname when starting a chat-room (e.g., d1aei for d1aei@conversejs.org)
        // create a new interaction when a new ConverseJS chat room is created
        this._converse.api.listen.on('roomInviteSent', function (data) {
            // get aEi.ai user ID created for chat-room invitee
            let recipientId = $.cookie(data.recipient.split("@")[0]);
            // get aEi.ai user ID created for chat-room invite sender
            let senderId = $.cookie(data.room.attributes.nick);
            // get aEi.ai interaction ID created for chat-room
            let interactionId = $.cookie('interaction');
            // check if an interaction is already created
            if (typeof interactionId !== "undefined" && interactionId !== null) {
                // add recipient to the available interaction
                addUserToInteraction(interactionId, recipientId, getAccessToken());
            } else {
                // create a new interaction and add sender and recipient to it
                createNewInteraction([senderId, recipientId], getAccessToken());
            }
        });

        // send user's utterance to conversation
        this._converse.api.listen.on('messageSend', function (messageText) {
            // get aEi.ai user ID and interaction ID
            let userId = $.cookie(jid);
            let interactionId = $.cookie('interaction');
            // add user's utterance to the aEi.ai interaction to update involved users' affective state
            newTextInput(userId, interactionId, messageText, getAccessToken())
                .then(function (data) {
                    console.log("User updated successfully");
                    console.log(data);
                    // get updated user
                    let user = data.interaction.users.filter(u => u.userId === userId)[0];
                    console.log(user);
                    // visualize updated user
                    updateData(user2Data(user));
                    // refresh scatter chart
                    scatterChart.refreshChart();
                }).catch(function (data) {
                    console.log(data);
                    console.log("Updating user failed");
                });
        });

        // NOTE: make sure you log out after demo to remove cookies
        // exit the conversation
        this._converse.api.listen.on('logout', function () {
            // remove interaction cookie
            $.cookie('interaction', null);
            $.removeCookie('interaction');

            // remove user cookie
            $.cookie(jid, null);
            $.removeCookie(jid);
        });
    }
});

// initialize the ConverseJS chat client and server
converse.initialize({
    bosh_service_url: 'https://conversejs.org/http-bind/',
    show_controlbox_by_default: true,
    whitelisted_plugins: ['aei-plugin']
});