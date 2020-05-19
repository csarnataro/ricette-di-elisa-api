/**
 * Produces a sanitized version of the Airtable URL, with database name and
 * api_key obfuscated.
 * It will be used in logs.
 * @param {URL} url the url to log
 * @returns {string} an obfuscated version of the URL to log
 */
const logSanitizedUrl = (url) => url
  .toString()
  .replace(/\/app.{14}/, '/app****')
  .replace(/=key.{14}/, '=key****');

module.exports = {
  logSanitizedUrl,
};
