let AEI_AI_URL = "https://aei.ai";
let API_VERSION = "v1";
let API_URL = AEI_AI_URL + "/api/" + API_VERSION;
let TIMEOUT = 20000;

/**
 * Registers a new client to the aEi.ai service with given client username, email, and password.
 *
 * @param username Client's username.
 * @param email Client's email.
 * @param password Client's password.
 * @param agreed True if client agreed to the statement of use and privacy policy.
 * @return Promise to register the client with given credentials.
 */
function register(username, email, password, agreed) {
    // make a API call to the aEi.ai service to register
    var registerPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'POST',
        url: AEI_AI_URL + '/register',
        headers: {
            'username': username,
            'email': email,
            'password': password,
            'agreed': agreed
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't register new client!");
        } else {
            console.log("Registered new client successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Registering new client failed");
        return data;
    });

    return registerPromise;
}

/**
 * Logs in to the aEi.ai service with given client username and password.
 *
 * @param username Client's username.
 * @param password Client's password.
 * @return Promise to login the client with given credentials.
 */
function login(username, password) {
    // make a API call to the aEi.ai service to get access token
    var loginPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'POST',
        url: AEI_AI_URL + '/oauth/token?grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).done((data) => {
        console.log(data);
        if (typeof data.access_token === "undefined") {
            console.log("Error: no access token received!");
        } else {
            console.log("Login success");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Login failed");
        return data;
    });

    return loginPromise;
}

/**
 * Creates a new user in aEi.ai service.
 *
 * @param attributes User custom attributes as string key-value pairs.
 * @param accessToken Client's access token.
 * @return Promise to create a new user.
 */
function createNewUser(attributes, accessToken) {
    // make an API call to the aEi.ai service to create a new user for user
    $.ajax({
        data: attributes,
        timeout: TIMEOUT,
        type: 'POST',
        url: API_URL + '/users',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't create user!");
        } else {
            console.log("User " + data.user.userId + " created successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("User creation failed");
        return data;
    });
}

/**
 * Gets aEi.ai interaction with given interaction ID.
 *
 * @param interactionId Given interaction ID.
 * @param accessToken Client's access token.
 * @return A promise to get the aEi.ai interaction.
 */
function getInteraction(interactionId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getInteractionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/interactions/' + interactionId,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get interaction!");
        } else {
            console.log("Got interaction successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting interaction failed");
        return data;
    });

    return getInteractionPromise;
}

/**
 * Creates a new aEi.ai interaction for given list of user IDs.
 *
 * @param userIds List of user IDs in new interaction.
 * @param accessToken Client's access token.
 * @return Promise to create a new interaction.
 */
function createNewInteraction(userIds, accessToken) {
    // prepare the data using the user IDs
    let params = params("user_id", userIds);

    // make an API call to the aEi.ai service to create a new interaction for given user IDs
    $.ajax({
        timeout: TIMEOUT,
        type: 'POST',
        url: API_URL + '/interactions?' + params,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't create new interaction!");
        } else {
            console.log("Interaction " + data.interaction.interactionId + " created successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Interaction creation failed");
        return data;
    });
}

/**
 * Adds given user to the given interaction in aEi.ai service.
 *
 * @param interactionId Given interaction ID.
 * @param userIds List of user IDs to add to the interaction.
 * @param accessToken Client's access token.
 * @return Promise to add given users to the interaction.
 */
function addUsersToInteraction(interactionId, userIds, accessToken) {
    // prepare the data using the user IDs
    let params = params("user_id", userIds);

    // make an API call to the aEi.ai service to add a user to interaction
    $.ajax({
        timeout: TIMEOUT,
        type: 'PUT',
        url: API_URL + '/interactions/' + interactionId + '/users?' + params,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't add user to interaction " + interactionId);
        } else {
            console.log("User added to interaction " + interactionId + " successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Failed adding user " + userId + " to interaction " + interactionId);
        return data;
    });
}

/**
 * Sends given user's text to given interaction.
 *
 * @param userId Source user ID.
 * @param interactionId Target interaction ID.
 * @param text User's utterance.
 * @param accessToken Client's access token.
 * @return A promise to send a text input to the interaction.
 */
function newTextInput(userId, interactionId, text, accessToken) {
    // promise to make an API call to the aEi.ai service to send the new user utterance to the interaction
    var newTextInputPromise = $.ajax({
        data: text,
        timeout: TIMEOUT,
        type: 'POST',
        url: API_URL + '/inputs/text' + '?user_id=' + userId + '&interaction_id=' + interactionId,
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
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Sending text input failed");
        return data;
    });

    return newTextInputPromise;
}

/**
 * Analyzes a list of interactions passed as JSON.
 *
 * @param jsonString Interaction list as JSON string.
 * @param accessToken Client's access token.
 * @return A promise to analyze given interaction list.
 */
function newInteractionListInput(jsonString, accessToken) {
    // promise to make an API call to the aEi.ai service to analyze the interaction list
    var newInteractionListInputPromise = $.ajax({
        data: jsonString,
        timeout: TIMEOUT,
        type: 'POST',
        url: API_URL + '/inputs/interaction-list',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't analyze interaction list input!");
        } else {
            console.log("Analyzed interaction list successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Analyzing interaction list failed");
        return data;
    });

    return newInteractionListInputPromise;
}

/**
 * Gets aEi.ai user with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the aEi.ai user.
 */
function getUser(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user!");
        } else {
            console.log("Got user successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user failed");
        return data;
    });

    return getUserPromise;
}

/**
 * Gets user's emotion with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the user's emotion.
 */
function getUserEmotion(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserEmotionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId + "/emotion",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user emotion!");
        } else {
            console.log("Got user emotion successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user emotion failed");
        return data;
    });

    return getUserEmotionPromise;
}

/**
 * Gets user's mood with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the user's mood.
 */
function getUserMood(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserMoodPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId + "/mood",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user mood!");
        } else {
            console.log("Got user mood successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user mood failed");
        return data;
    });

    return getUserMoodPromise;
}

/**
 * Gets user's personality with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the user's personality.
 */
function getUserPersonality(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserPersonalityPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId + "/personality",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user personality!");
        } else {
            console.log("Got user personality successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user personality failed");
        return data;
    });

    return getUserPersonalityPromise;
}

/**
 * Gets user's satisfaction with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the user's satisfaction.
 */
function getUserSatisfaction(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserSatisfactionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId + "/satisfaction",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user satisfaction!");
        } else {
            console.log("Got user satisfaction successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user satisfaction failed");
        return data;
    });

    return getUserSatisfactionPromise;
}

/**
 * Gets user's social-perception with given user ID.
 *
 * @param userId Given user ID.
 * @param accessToken Client's access token.
 * @return A promise to get the user's social-perception.
 */
function getUserSocialPerception(userId, accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUserSocialPerceptionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/users/' + userId + "/social-perception",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get user social-perception!");
        } else {
            console.log("Got user social-perception successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting user social-perception failed");
        return data;
    });

    return getUserSocialPerceptionPromise;
}

/**
 * Gets number of  aEi.ai used free queries of the currently signed in client.
 *
 * @param accessToken Client's access token.
 * @return A promise to get number of used free queries to the aEi.ai API.
 */
function getUsedFreeQueries(accessToken) {
    // promise to get number of free queries to the aEi.ai API
    var getUsedFreeQueriesPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/metrics/queries/used',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get used free queries!");
        } else {
            console.log("Got used free queries successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting used free queries failed");
        return data;
    });

    return getUsedFreeQueriesPromise;
}

/**
 * Gets number of aEi.ai used paid queries (in current month) of the currently signed in client.
 *
 * @param accessToken Client's access token.
 * @return A promise to get number of used paid queries to the aEi.ai API.
 */
function getUsedPaidQueries(accessToken) {
    // promise to get the the make an API call to the aEi.ai
    var getUsedPaidQueriesPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + '/metrics/queries',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get used paid queries!");
        } else {
            console.log("Got used paid queries successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting used paid queries failed");
        return data;
    });

    return getUsedPaidQueriesPromise;
}

// TODO: add this API to documentation
/**
 * Gets the payment method information from Stripe for a given customer.
 *
 * @param accessToken Client's access token.
 * @return A promise to get all payment method information from Stripe for a give customer.
 */
function getPaymentSources(accessToken) {
    // output contains list of payment information, each as a dictionary
    let getPaymentSourcesPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + "/sources",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get payment sources!");
        } else {
            console.log("Got payment sources successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting payment sources failed");
        return data;
    });

    return getPaymentSourcesPromise;
}

// TODO: add this API to documentation
/**
 * Gets the payment method information from Stripe for a given customer and source Id.
 *
 * @param sourceId Target payment source ID.
 * @param accessToken Client's access token.
 * @return A promise to get a specific payment method information from Stripe for a give customer.
 */
function getPaymentSource(sourceId, accessToken) {
    // output contains dictionary of payment information
    let getPaymentSourcePromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + "/sources/" + sourceId,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get payment source: " + sourceId);
        } else {
            console.log("Got payment source successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting payment source failed: " + sourceId);
        return data;
    });

    return getPaymentSourcePromise;
}

// TODO: add this API to documentation
/**
 * Adds a payment source ID (previously generated via Stripe API) to the client account.
 *
 * @param sourceId Payment source ID.
 * @param accessToken Client's access token.
 * @return A promise to add a payment source ID to client account.
 */
function addPaymentSource(sourceId, accessToken) {
    // output contains dictionary of payment information
    let addPaymentSourcePromise = $.ajax({
        timeout: TIMEOUT,
        type: 'POST',
        url: API_URL + "/sources/" + sourceId,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't add payment source: " + sourceId);
        } else {
            console.log("Added payment source successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Adding payment source failed");
        return data;
    });

    return addPaymentSourcePromise;
}

// TODO: add this API to documentation
/**
 * Get the subscription information for given customer.
 *
 * @param accessToken Client's access token.
 * @return A promise to get subscription information.
 */
function getSubscription(accessToken) {
    let getSubscriptionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'GET',
        url: API_URL + "/subscriptions",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't get subscriptions!");
        } else {
            console.log("Got subscriptions successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Getting subscriptions failed");
        return data;
    });

    return getSubscriptionPromise;
}

// TODO: add this API to documentation
/**
 * Updates subscription to the given type.
 *
 * @param accessToken Client's access token.
 * @param subscriptionType Given new subscription type.
 * @return A promise to update subscription.
 */
function updateSubscription(subscriptionType, accessToken) {
    let updateSubscriptionPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'PUT',
        url: API_URL + '/subscriptions' + "?subscription_type=" + subscriptionType,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't update subscription!");
        } else {
            console.log("Updated subscription successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Updating subscription failed");
        return data;
    });

    return updateSubscriptionPromise;
}

// TODO: add this API to documentation
/**
 * Deletes a source from Stripe and aEi.ai account given the source ID.
 *
 * @param sourceId Given source ID.
 * @param accessToken Client's access token.
 * @return A promise for deleting the payment source with given ID.
 */
function deleteSource(sourceId, accessToken) {
    let deletePaymentSourcePromise = $.ajax({
        timeout: TIMEOUT,
        type: 'DELETE',
        url: API_URL + "/sources/" + sourceId,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't delete payment source: " + sourceId);
        } else {
            console.log("Deleted payment source successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Deleting payment source failed: " + sourceId);
        return data;
    });

    return deletePaymentSourcePromise;
}

// TODO: add this API to documentation
/**
 * Updates a source in Stripe and aEi.ai account given the source ID and parameters to update.
 *
 * @param sourceId Given source ID to update.
 * @param updateParams Key-value params to update as request body.
 * @param accessToken Client's access token.
 * @return A promise for updating the payment source given the source ID.
 */
function updateSource(sourceId, updateParams, accessToken){
    return $.ajax({
        data: updateParams,
        timeout: TIMEOUT,
        type: 'PUT',
        url: API_URL + "/sources/" + sourceId,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't update payment source: " + sourceId);
        } else {
            console.log("Updated payment source successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Updating payment source failed: " + sourceId);
        return data;
    });
}

// TODO: add this API to documentation
/**
 * Changes aEi.ai account password to the given new password, when user has a valid access token.
 *
 * @param password Given new password.
 * @param accessToken Client's access token.
 * @return A promise to change the password to the given new password.
 */
function changePassword(password, accessToken) {
    let passwordChangePromise = $.ajax({
        timeout: TIMEOUT,
        type: 'PUT',
        url: API_URL + '/clients/password',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'password': password
        }
    }).done((data) => {
        console.log(data);
        if (typeof data.status === "undefined") {
            console.log("Error: can't change password!");
        } else {
            console.log("Changed password successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Changing password failed");
        return null;
    });

    return passwordChangePromise;
}

// TODO: add this API to documentation
/**
 * Resets aEi.ai account password by sending an email to the client.
 *
 * @param email Client's email.
 * @return A promise to reset the password.
 */
function resetPassword(email) {
    // promise to send a reset password email to the client
    var resetPasswordPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'POST',
        url: AEI_AI_URL + '/reset-password' + "?email=" + email,
    }).done((data) => {
        console.log(data);
        if (data.status.code !== 200) {
            console.log("Error: can't send password-reset email: " + email);
        } else {
            console.log("Sent password-reset email successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Sending password-reset email failed: " + email);
        return data;
    });

    return resetPasswordPromise;
}

// TODO: add this API to documentation
/**
 * Updates aEi.ai account password for the given username and password-reset token.
 *
 * @param username Client's username.
 * @param passwordResetToken Password-reset token provided by server.
 * @param newPassword Client's new password.
 * @return A promise to update client's password.
 */
function updatePassword(username, passwordResetToken, newPassword) {
    // promise to reset password
    var updatePasswordPromise = $.ajax({
        timeout: TIMEOUT,
        type: 'PUT',
        url: AEI_AI_URL + '/update-password',
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
            console.log("Updated password successfully");
        }
        return data;
    }).fail((data) => {
        console.log(data);
        console.log("Updating password failed");
        return data;
    });

    return updatePasswordPromise;
}

/**
 * Converts a given list of parameters to string with a single name.
 *
 * @param name Parameter name.
 * @param values Parameter values.
 */
function params(name, values) {
    let params = "";
    for (let i = 0; i < values.length; i++) {
        if (i > 0) {
            params += "&";
        }
        params += name + "=" + values[i];
    }
    return params;
}