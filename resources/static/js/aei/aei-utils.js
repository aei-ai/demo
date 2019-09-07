/**
 * Gets client's access token from Cookie.
 * @return {string} Client's access token.
 */
function getAccessToken() {
    // get access token from cookie
    let aeiToken = JSON.parse($.cookie('aei_token'));
    return aeiToken.access_token;
}