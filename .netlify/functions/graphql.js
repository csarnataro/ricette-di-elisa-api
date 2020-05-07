const serverless = require('serverless-http');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const schema = require('./graphql/schema')

const app = express();

app.use(bodyParser.json());
app.use(
  '/.netlify/functions/graphql/',
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
  })
);

module.exports.handler =
  process.env.NODE_ENV === 'local' ? app : serverless(app);
