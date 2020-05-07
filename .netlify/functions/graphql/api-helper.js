const path = require('path');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const logSanitizedUrl = url => {
  return url.toString().replace(/\/app.{14}/, '/app****').replace(/=key.{14}/, '=key****')
}
const apiEndpoint = args => {
  const apiUrl = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/`);
  apiUrl.searchParams.set('api_key', AIRTABLE_API_KEY);

  if (typeof args === 'string') {
    // adding tableName as string
    apiUrl.pathname = path.join(apiUrl.pathname, args);
    console.log(`Fetching from ${logSanitizedUrl(apiUrl)}`);
    return apiUrl.toString();
  }
  const { tableName, id, offset, additionalQueryParams } = args;

  // adding table name parameter
  apiUrl.pathname = path.join(apiUrl.pathname, tableName);
  // optional
  if (id) {
    apiUrl.pathname = path.join(apiUrl.pathname, id);
  }
  offset && apiUrl.searchParams.set('offset', offset);

  if (additionalQueryParams) {
    for (const property in additionalQueryParams) {
      apiUrl.searchParams.set(property, additionalQueryParams[property]);
    }
    
  } 

  console.log(`Fetching from ${logSanitizedUrl(apiUrl)}`);
  return apiUrl.toString();
};
module.exports = { apiEndpoint };
