/**
 * withArgs.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
module.exports = (...args1) => func => (...args2) => func(...args1, ...args2);
