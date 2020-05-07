const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const serverless = require('serverless-http');
const schema = require('./graphql/schema')

const app = express();

app.use(bodyParser.json());
app.use(
  '/.netlify/functions/graphql/',
  cors(),
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
  })
);

module.exports.handler =
  process.env.NODE_ENV === 'local' ? app : serverless(app);
