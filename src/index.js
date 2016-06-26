/**
 * index.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
const withArgs = require("./util/withArgs");
const loadCredentials = require("./util/loadCredentials");
const saveCredentials = require("./util/saveCredentials");
const mindmeister = require("./api/mindmeister");
const { mindmeister: { baseUrl } } = require("./config");

const credentials = loadCredentials();
const { mindmeister: { key, secret, token } } = credentials;
const api = mindmeister(baseUrl, key, secret);

function storeMindmeisterTokenInCredentials(credentials, token) {
    const nextCredentials = Object.assign(credentials, {
        mindmeister: Object.assign(credentials.mindmeister, {
            token
        })
    });
    saveCredentials(nextCredentials);
}

function handleError(err) {
    console.error(err);
    process.exit(1);
}

function readySignal(arg) {
    console.info("Ready to rock!");
    return arg;
}

if (token) {
    api.checkToken(token)
        .then(ok => {
            if (!ok) {
                console.info("Authentication token expired");
                api.authenticate()
                    .then(withArgs(credentials)(storeMindmeisterTokenInCredentials))
                    .then(readySignal)
                    .catch(handleError);
            } else {
                readySignal();
            }
        });
} else {
    api.authenticate()
        .then(withArgs(credentials)(storeMindmeisterTokenInCredentials))
        .then(readySignal)
        .catch(handleError);
}

