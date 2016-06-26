/**
 * loadCredentials.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
module.exports = () => {
    let credentials;
    try {
        return require("../../credentials.json");
    } catch (e) {
        console.error("Error: No credentials.json file found. See README.md for details.");
        process.exit(1);
    }
};
