/**
 * getEvernoteOAuthToken.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 24 Jun 2016
 */
module.exports = client  => {
    return new Promise((resolve, reject) => {
        client.getRequestToken("CALLBACK_URL", (err, oauthToken, oauthSecret) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ oauthToken, oauthSecret });
        });
    });
};
