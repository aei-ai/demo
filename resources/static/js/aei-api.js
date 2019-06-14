/**
 * Logs in to the aEi.ai service with given client username and password.
 *
 * @param username Client's username.
 * @param password Client's password.
 */
function login(username, password) {
    // make a API call to the aEi.ai service to get access token
    var loginPromise = $.ajax({
        data: 'username=' + username + '&password=' + password,
        timeout: 20000,
        type: 'POST',
        url: '/oauth/token?grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).done((data) => {
        console.log(data);
        if (typeof data.access_token === "undefined") {
            console.log("Error: no access token received!");
            return null;
        } else {
            // save access token in cookie (NOTE: all chat users use the same access token)
            $.cookie('aei_token', JSON.stringify(data), {expires: data.expires_in});
            $.cookie('aei_username', username, {expires: data.expires_in});
            console.log("Login success");
            return data;
        }
    }).fail((data) => {
        console.log(data);
        console.log("Login failed");
        return null;
    });

    return loginPromise;
}

/**
 * Registers a new client to the aEi.ai service with given client username, email, and password.
 *
 * @param username Client's username.
 * @param email Client's email.
 * @param password Client's password.
 */
function register(username, email, password) {
    // make a API call to the aEi.ai service to register
    var registerPromise = $.ajax({
        timeout: 20000,
        type: 'POST',
        url: '/register',
        headers: {
            'username': username,
            'email': email,
            'password': password,
            'clientType': 'personal' // default client type
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't register new client!");
        } else {
            console.log("Registered new client successfully");
        }
    }).fail((data) => {
        console.log(data);
        console.log("Registering new client failed");
    });

    return registerPromise;
}

/**
 * Creates a new user with given username in aEi.ai service.
 *
 * @param username New user's username.
 * @param accessToken Client's access token.
 */
function createNewUser(username, accessToken) {
    // make an API call to the aEi.ai service to create a new user for user
    $.ajax({
        timeout: 20000,
        type: 'POST',
        url: '/api/v1/users',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't create user!");
        } else {
            // save created user in cookie
            let user = data.user;
            let userId = user.userId;
            $.cookie(username, userId);
            console.log("User " + userId + " created successfully");
        }
    }).fail((data) => {
        console.log(data);
        console.log("User creation failed");
    });
}

/**
 * Creates a new aEi.ai interaction for given list of user IDs.
 *
 * @param userIds List of user IDs in new interaction.
 * @param accessToken Client's access token.
 */
function createNewInteraction(userIds, accessToken) {
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
        url: '/api/v1/interactions',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't create new interaction!");
        } else {
            // save interaction ID in cookie
            let interaction = data.interaction;
            let interactionId = interaction.interactionId;
            $.cookie('interaction', interactionId);
            console.log("Interaction " + interactionId + " created successfully");
        }
    }).fail((data) => {
        console.log(data);
        console.log("Interaction creation failed");
    });
}

/**
 * Adds given user to the given interaction in aEi.ai service.
 *
 * @param interactionId Given interaction ID.
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 */
function addUserToInteraction(interactionId, userId, accessToken) {
    // make an API call to the aEi.ai service to add a user to interaction
    $.ajax({
        timeout: 20000,
        type: 'PUT',
        url: '/api/v1/interactions/' + interactionId + '/users/' + userId,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't add user " + userId + " to interaction " + interactionId);
        } else {
            console.log("User " + userId + " added to interaction " + interactionId + " successfully");
        }
    }).fail((data) => {
        console.log(data);
        console.log("Failed adding user " + userId + " to interaction " + interactionId);
    });
}

/**
 * Sends given user's text to given interaction.
 *
 * @param userId Source user ID.
 * @param interactionId Target interaction ID.
 * @param text User's
 * @param accessToken Client's access token.
 * @returns A promise to call the aEi.ai API.
 */
function newTextInput(userId, interactionId, text, accessToken) {
    // promise to make an API call to the aEi.ai service to send the new user utterance to the interaction
    var newTextInputPromise = $.ajax({
        data: {text: text},
        timeout: 20000,
        type: 'POST',
        url: '/api/v1/inputs/text' + '?user_id=' + userId + '&interaction_id=' + interactionId,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't send text input!");
        } else {
            console.log("Sent text input successfully");
        }
    }).fail((data) => {
        console.log(data);
        console.log("Sending text input failed");
    });

    return newTextInputPromise;
}

/**
 * Gets aEi.ai user with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @returns A promise to get the aEi.ai user.
 */
function getUser(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: '/api/v1/users/' + userId,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user!");
            return null;
        } else {
            console.log("Got user successfully");
            return data;
        }
    }).fail(function (data) {
        console.log(data);
        console.log("Getting user failed");
        return null;
    });

    return getUserPromise;
}

/**
 * Gets number of  aEi.ai used free queries of the currently signed in client.
 *
 * @param accessToken Client's access token.
 * @returns A promise to get the aEi.ai number of used free queries.
 */
function getUsedFreeQueries(accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUsedFreeQueriesPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: '/api/v1/metrics/queries/used',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get used free queries!");
            return null;
        } else {
            console.log("Got used free queries successfully");
            return data;
        }
    }).fail((data) => {
        console.log(data);
        console.log("Getting used free queries failed");
        return null;
    });

    return getUsedFreeQueriesPromise;
}

/**
 * Gets number of aEi.ai used paid queries (in current month) of the currently signed in client.
 *
 * @param accessToken Client's access token.
 * @returns A promise to get the aEi.ai number of used paid queries.
 */
function getUsedPaidQueries(accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUsedPaidQueriesPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: '/api/v1/metrics/queries',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get used paid queries!");
            return null;
        } else {
            console.log("Got used paid queries successfully");
            return data;
        }
    }).fail((data) => {
        console.log(data);
        console.log("Getting used paid queries failed");
        return null;
    });

    return getUsedPaidQueriesPromise;
}

/**
 * Gets the payment method information from Stripe for a given customer.
 *
 * @param accessToken Client's access token.
 * @returns Promise to get payment method information from Stripe for a give customer.
 */
function getPaymentSources(accessToken) {
    // output contains dictionary of payment information
    let getPaymentSourcesPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: "/api/v1/sources",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Getting payment source failed");
            return null;
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting payment source failed");
        return null;
    });

    return getPaymentSourcesPromise;
}

/**
 * Adds a payment source ID (previously generated via Stripe API) to the client account.
 *
 * @param accessToken Client's access token.
 * @returns Promise to add payment source ID to client account.
 */
function addPaymentSource(source, accessToken) {
    // output contains dictionary of payment information
    let addPaymentSourcePromise = $.ajax({
        timeout: 20000,
        data: {'source': source},
        type: 'POST',
        url: "/api/v1/sources",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Adding payment source failed");
            return null;
        }
        console.log("Adding payment source succeeded");
        return data;
    }).fail(function (data) {
        console.log(data);
        console.log("Adding payment source failed");
        return null;
    });

    return addPaymentSourcePromise;
}

/**
 * Get the subscription information for given customer
 *
 * @param accessToken Client's access token.
 * @returns String containing Subscription information
 */
function getSubscription(accessToken) {
    let getSubscriptionPromise = $.ajax({
        timeout: 20000,
        type: 'GET',
        url: "/api/v1/subscriptions",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data) {
            console.log("Successfully got the subscription");
            return data;
        }
    }).fail((data) => {
        console.log(data);
        console.log("Failed to getSubscriptions");
        return null;
    });

    return getSubscriptionPromise;
}

/**
 * Updates subscription to the given type.
 *
 * @param accessToken Client's access token.
 * @param subscriptionType Given new subscription type.
 */
function updateSubscription(subscriptionType, accessToken) {
    let updateSubscriptionPromise = $.ajax({
        data: {'subscription_type': subscriptionType},
        timeout: 20000,
        type: 'PUT',
        url: '/api/v1/subscriptions',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        console.log("Subscription was updated successfully");
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("updating subscription failed please try again later");
        return null;
    });

    return updateSubscriptionPromise;
}

/**
 * Changes aEi.ai account password to the given new password.
 *
 * @param password Given new password.
 * @param accessToken Client's access token.
 * @return A promise to change the password to the given new password.
 */
function changePassword(password, accessToken) {
    let passwordChangePromise = $.ajax({
        timeout: 20000,
        type: 'PUT',
        url: '/api/v1/clients/password',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'password': password
        }
    }).done((data) => {
        console.log(data);
        if (typeof data.status === "undefined") {
            console.log("Error: changing password");
            return null;
        } else {
            console.log("Password changed successfully");
            return data;
        }
    }).fail((data) => {
        console.log(data);
        console.log("Password change action failed");
        return null;
    });

    return passwordChangePromise;
}

/**
 * Resets aEi.ai account password by sending an email to the client.
 *
 * @param email Client's email.
 * @return A promise to reset the password.
 */
function resetPassword(email) {
    // promise to reset password (send a reset password email to the client)
    var resetPasswordPromise = $.ajax({
        timeout: 20000,
        type: 'POST',
        url: '/reset-password',
        data: {email: email}
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't send reset password email!");
        } else {
            console.log("reset password email sent successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Sending reset password email failed");
        return data;
    });

    return resetPasswordPromise;
}

/**
 * Updates aEi.ai account password for the given username and password-reset token.
 *
 * @param username Client's username.
 * @param passwordResetToken Password-reset token provided by server.
 * @param newPassword Client's new password.
 * @return A promise to update client's password.
 */
function updatePassword(username, passwordResetToken, newPassword) {
    // promise to reset password (send a reset password email to the client)
    var updatePasswordPromise = $.ajax({
        timeout: 20000,
        type: 'PUT',
        url: '/update-password',
        headers: {
            'username': username,
            'token': passwordResetToken,
            'password': newPassword
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't update password!");
        } else {
            console.log("Password updated successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Updating password failed");
        return data;
    });

    return updatePasswordPromise;
}
