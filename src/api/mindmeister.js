/**
 * mindmeister.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
const md5 = require("md5");
const axios = require("axios");
const inquirer = require("inquirer");
const open = require("open");

const withArgs = require("../util/withArgs");

function sign(secret, params) {
    return md5(secret + params.sort().join("").replace(/=/g, ""));
}

function createUri(url, key, secret, config = {}) {
    const params = Object.keys(config).map(paramName => `${paramName}=${config[paramName]}`).concat([
        `api_key=${key}`,
        "response_format=json"
    ]);
    return `${url}?${[ ...params, `api_sig=${sign(secret, params)}` ].join("&")}`;
}

function extendUrl(baseUrl, suffix) {
    return baseUrl + (baseUrl.endsWith("/") ? "" : "/") + suffix;
}

function createRestUri(baseUrl, key, secret, method, config = {}) {
    const url = extendUrl(baseUrl, "services/rest/");
    return createUri(url, key, secret, method, config);
}

function createAuthUri(baseUrl, key, secret, method, config = {}) {
    const url = extendUrl(baseUrl, "services/auth/");
    return createUri(url, key, secret, method, config);
}

function isFailed(stat) {
    return stat === "fail";
}

function isOk(stat) {
    return stat === "ok";
}

function validateResponse({ data: { rsp }}) {
    if (isFailed(rsp.stat)) {
        console.error(`Error accessing MindMeister API: ${rsp.err.msg}`);
        process.exit(rsp.err.code);
    }
    return rsp;
}

function handleError(err) {
    console.error("Error accessing MindMeister API");
    console.error(err);
    process.exit(1);
}

function getFrob(baseUrl, key, secret) {
    return axios.get(createRestUri(baseUrl, key, secret, { method: "mm.auth.getFrob" }))
        .then(validateResponse)
        .then(({ frob }) => frob)
        .catch(handleError);
}

function getToken(baseUrl, key, secret, frob) {
    return axios.get(createRestUri(baseUrl, key, secret, { method: "mm.auth.getToken", frob }))
        .then(validateResponse)
        .then(({ auth: { token } }) => token)
        .catch(handleError);
}

function delay(callback, ms) {
    return new Promise(resolve => setTimeout(() => resolve(callback()), ms));
}

function withUserConfirmation(promptMsg, cancelMsg) {
    return func => (...args) => inquirer.prompt({
        type: "confirm",
        name: "ok",
        message: promptMsg
    })
    .then(({ ok }) => {
        if (!ok) {
            console.warn(cancelMsg);
            process.exit(0);
        }
        return func(...args);
    });
}

function waitForUserConfirmation(baseUrl, key, secret, frob) {
    const authUri = createAuthUri(baseUrl, key, secret, { perms: "delete", frob });
    console.info("Please authenticate access to MindMeister using the browser window that opens up now");
    return delay(() => open(authUri), 1000)
        .then(withUserConfirmation(
            "Authentication in browser done?",
            "Program aborted, no user authentication"
        )(() => frob));
}

function authenticate(baseUrl, key, secret) {
    const withAuthConfig = withArgs(baseUrl, key, secret);
    return getFrob(baseUrl, key, secret)
        .then(withAuthConfig(waitForUserConfirmation))
        .then(withAuthConfig(getToken));
}

function checkToken(baseUrl, key, secret, token) {
    return axios.get(createRestUri(baseUrl, key, secret, { method: "mm.auth.checkToken", auth_token: token }))
        .then(({ data: { rsp: { stat } } }) => isOk(stat))
        .catch(handleError);
}

module.exports = (baseUrl, key, secret) => ({
    authenticate: () => authenticate(baseUrl, key, secret),
    checkToken: token => checkToken(baseUrl, key, secret, token)
});


