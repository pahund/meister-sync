/**
 * index.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 24 Jun 2016
 */
const credentials = require("./util/loadCredentials")();
const config = require("./config");
const { Evernote } = require("evernote");
const getEvernoteOAuthToken = require("./util/getEvernoteOAuthToken");

const { key: evernoteKey, secret: evernoteSecret } = credentials.evernote;
const { dev } = config;

const client = new Evernote.Client({
    consumerKey: evernoteKey,
    consumerSecret: evernoteSecret,
    sandbox: dev
});
console.info("Connecting to Evernote...");
getEvernoteOAuthToken(client).then(({ oauthToken, oauthSecret }) => {
    console.info("Connected!");
    console.log(`OAuth token:  ${oauthToken}`);
    console.log(`OAuth secret: ${oauthSecret}`);
}).catch(err => {
    console.error("Failed to authenticate with Evernote, HTTP status code:", err.statusCode);
    process.exit(1);
});


