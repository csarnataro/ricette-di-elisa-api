const fetch = require('cross-fetch');
const qs = require('qs');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
};

exports.handler = async event => {
  const path = event.path;
  const pathParts = path.split('/');
  const categoryId = pathParts[4] || '';
  const apiParams = qs.stringify(event.queryStringParameters);

  const apiEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Categorie/${categoryId}?${apiParams}&api_key=${AIRTABLE_API_KEY}`;

  console.log(`**** Function called`);

  try {
    const response = await fetch(apiEndpoint);
    const jsonResponse = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(jsonResponse),
      headers,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 422,
      body: String(error),
      headers,
    };
  } finally {
    console.log(`**** Function completed\n`);
  }
};
