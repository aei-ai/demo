/**
 * Logs in to the aEi.ai service with given client username and password.
 *
 * @param username Demo client's username.
 * @param password Demo client's password.
 */
function login(username, password) {
    // make a API call to the aEi.ai service to get access token
    $.ajax({
        data: 'username=' + username + '&password=' + password,
        timeout: 20000,
        type: 'POST',
        url: 'https://aei.ai/oauth/token?grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).done(function (data) {
        if (typeof data.access_token === "undefined") {
            console.log("Error: no access token received!");
        } else {
            // save access token in cookie (NOTE: all chat users use the same access token)
            $.cookie('aei_token', JSON.stringify(data), {expires: data.expires_in});
            $.cookie('username', username, {expires: data.expires_in});
            console.log("Login success");
        }
    }).fail(function (data) {
        console.log(data);
        console.log("Login failed");
    });
}

/**
 * Creates a new user with given username in aEi.ai service.
 *
 * @param username New user's username.
 */
function createNewUser(username) {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    let accessToken = aeiToken.access_token;

    // make an API call to the aEi.ai service to create a new user for demo user
    $.ajax({
        timeout: 20000,
        type: 'POST',
        url: 'https://aei.ai/api/v1/users',
        headers: {
            'Authorization': 'Bearer '+ accessToken,
        }
    }).done(function (data) {
        if (data.status.code !== 200) {
            console.log("Error: can't create user!");
        } else {
            // save created user in cookie
            let user = data.user;
            console.log(user);
            let userId = user.userId;
            $.cookie(username, userId);
            console.log("User " + userId + " created successfully");
        }
    }).fail(function (data) {
        console.log(data);
        console.log("User creation failed");
    });
}

/**
 * Creates a new aEi.ai interaction for given list of user IDs.
 *
 * @param userIds List of user IDs in new interaction.
 */
function createNewInteraction(userIds) {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    let accessToken = aeiToken.access_token;

    // prepare the data using the user IDs
    let data = "";
    for (let i = 0; i < userIds.length; i++) {
        if (i > 0) {
            data += "&";
        }
        let userId = userIds[i];
        data += "user_id=" + userId;
    }

    // make an API call to the aEi.ai service to create a new interaction for given user IDs
    $.ajax({
        data: data,
        timeout: 20000,
        type: 'POST',
        url: 'https://aei.ai/api/v1/interactions',
        headers: {
            'Authorization': 'Bearer '+ accessToken,
        }
    }).done(function (data) {
        if (data.status.code !== 200) {
            console.log("Error: can't create new interaction!");
        } else {
            // save interaction ID in cookie
            let interaction = data.interaction;
            console.log(interaction);
            let interactionId = interaction.interactionId;
            $.cookie('interaction', interactionId);
            console.log("Interaction " + interactionId + " created successfully");
        }
    }).fail(function (data) {
        console.log(data);
        console.log("Interaction creation failed");
    });
}

/**
 * Adds given user to the given interaction in aEi.ai service.
 *
 * @param interactionId Given interaction ID.
 * @param userId Given user ID.
 */
function addUserToInteraction(interactionId, userId) {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    let accessToken = aeiToken.access_token;

    // make an API call to the aEi.ai service to add a user to interaction
    $.ajax({
        timeout: 20000,
        type: 'PUT',
        url: 'https://aei.ai/api/v1/interactions/' + interactionId + '/users/' + userId,
        headers: {
            'Authorization': 'Bearer '+ accessToken,
        }
    }).done(function (data) {
        if (data.status.code !== 200) {
            console.log("Error: can't add user " + userId + " to interaction " + interactionId);
        } else {
            console.log("User " + userId + " added to interaction " + interactionId + " successfully");
        }
    }).fail(function (data) {
        console.log("Failed adding user " + userId + " to interaction " + interactionId);
    });
}

/**
 * Sends given user's text to given interaction.
 *
 * @param userId Source user ID.
 * @param interactionId Target interaction ID.
 * @param text User's
 * @returns A promise to call the aEi.ai API.
 */
function newTextInput(userId, interactionId, text) {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    let accessToken = aeiToken.access_token;

    // promise to make an API call to the aEi.ai service to send the new user utterance to the interaction
    var newTextInputPromise = $.ajax({
        data: {text: text},
        timeout: 20000,
        type: 'POST',
        url: 'https://aei.ai/api/v1/inputs/text' + '?user_id=' + userId + '&interaction_id=' + interactionId,
        headers: {
            'Authorization': 'Bearer '+ accessToken,
        }
    }).done(function (data) {
        if (data.status.code !== 200) {
            console.log("Error: can't send text input!");
        } else {
            console.log(data);
            console.log("Sent text input successfully");
        }
    }).fail(function (data) {
        console.log(data);
        console.log("Sending text input failed");
    });

    return newTextInputPromise;
}

/**
 * Gets aEi.ai user with given user ID.
 *
 * @param userId Given user ID.
 * @returns A promise to get the aEi.ai user.
 */
function getUser(userId) {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    let accessToken = aeiToken.access_token;

    // promise to get the the make an API call to the aEi.ai
    var getUserPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: 'https://aei.ai/api/v1/users/' + userId,
        headers: {
            'Authorization': 'Bearer '+ accessToken,
        }
    }).done(function (data) {
        if (data.status.code !== 200) {
            console.log("Error: can't get user!");
            return null;
        } else {
            console.log(data);
            console.log("Got user successfully");
            // visualize the user
            updateData(user2Data(data.user));
            return data;
        }
    }).fail(function (data) {
        console.log(data);
        console.log("Getting user failed");
        return null;
    });

    return getUserPromise;
}