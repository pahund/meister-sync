/**
 * config.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 24 Jun 2016
 */
const dev = process.env.NODE_ENV === undefined || process.env.NODE_ENV === "development";
const prod = process.env.NODE_ENV === "production";

module.exports = {
    dev,
    prod,
    host: dev ? "https://sandbox.evernote.com" : "https://www.evernote.com",
    mindmeister: {
        baseUrl: "http://www.mindmeister.com/"
    }
};
