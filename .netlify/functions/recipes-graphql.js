const fetch = require('cross-fetch');
const qs = require('qs');
const http = require('http');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

function proxy () {
  console.log(`in Proxy ${process.env.NODE_ENV === 'local'}`)
  if (process.env.NODE_ENV === 'local') {
    const url = require('url');
    // called directly
    http
      .createServer(async function (req, res) {
        try {
          const data = await fetchApi(req.url, url.parse(req.url,true).query)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(data.body);
          res.end();
        } catch (error) {
          res.writeHead(501, { 'Content-Type': 'application/json' });
          res.write(`{"error": "${error}"}`);
          res.end();

        }
      })
      .listen(3000, () => console.log('server started on port 3000'));
  } else {
    // executed on aws lambda
    return async (event, context) => {
      console.log(`in lambda function`)
      return fetchApi(event.path, event.queryStringParameters)
    }
  }
}

async function fetchApi(path, queryStringParameters) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
  };
  
  
  const pathParts = path.split('/');
  const recipeId = pathParts[4] || '';
  const apiParams = qs.stringify(queryStringParameters);
  console.log(`in fetchApi: ${path}`)
  const apiEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Ricette/${recipeId}?${apiParams}&api_key=${AIRTABLE_API_KEY}`;

  console.log(`**** Function called`);

  try {
    console.log(apiEndpoint)
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
    console.log(`****  Function completed\n`);
  }
};


exports.handler = proxy;
