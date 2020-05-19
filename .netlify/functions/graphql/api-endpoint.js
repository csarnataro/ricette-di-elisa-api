const { URLBuilder } = require('./url-builder');

/**
 * Builds the url of the API
 * @param {object} args if it's a string, it's just the table name,
 *        otherwise it will contain the following properties
 * @param {string} args.tableName
 * @param {string} args.id
 * @param {string} args.offset
 * @param {string} args.additionalQueryParams
 *
 */
const buildApiEndpointURL = ({
  tableName, id, offset, additionalQueryParams,
}) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  const apiEndpoint = new URLBuilder('https://api.airtable.com/v0/');
  return apiEndpoint
    .append(AIRTABLE_BASE_ID)
    .append(tableName)
    .append(id)
    .addParam('api_key', AIRTABLE_API_KEY)
    .addParam('offset', offset)
    .addParams(additionalQueryParams)
    .toString();
};


module.exports = {
  buildApiEndpointURL,
};
