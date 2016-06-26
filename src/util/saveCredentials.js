/**
 * saveCredentials.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
const path = require("path");
const jsonfile = require("jsonfile");

module.exports = credentials => {
    const credentialsPath = path.join(__dirname, "../../credentials.json");
    try {
        jsonfile.writeFileSync(credentialsPath, credentials, { spaces: 2 });
    } catch (err) {
        console.error(`Error writing file ${credentialsPath}`);
        console.error(err);
        process.exit(1);
    }
};

