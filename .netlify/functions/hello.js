const fetch = require('cross-fetch');
const qs = require('qs');

const API_ENDPOINT = 'https://icanhazdadjoke.com/';

exports.handler = async (event, context) => {
  const path = event.path;
  const apiParams = qs.stringify(event.queryStringParameters);
  console.log(`Received request [${path}] with query ${JSON.stringify(apiParams)}`)
  return fetch(API_ENDPOINT, { headers: { Accept: 'application/json' } })
    .then(response => response.json())
    .then(data => ({
      statusCode: 200,
      body: data.joke,
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
