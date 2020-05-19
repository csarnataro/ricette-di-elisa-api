const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const serverless = require('serverless-http');
const schema = require('./graphql/schema');

const app = express();

app.use(bodyParser.json());

/* Adding the GraphQL middleware.
 * the prefix `.netlify/functions` is a requirements of Netlify functions
 */
app.use(
  '/.netlify/functions/graphql/',
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

// when running in locally, `app` is exported as a standard express app
module.exports.handler = process.env.NODE_ENV === 'local' ? app : serverless(app);
