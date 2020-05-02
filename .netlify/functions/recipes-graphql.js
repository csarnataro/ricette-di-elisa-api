const serverless = require('serverless-http');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

const app = express();

app.use('/.netlify/functions/recipes-graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

// app.get('/*', function (req, res) {
//   res.write(`Hello World from ${req.url}`);
//   res.end()
// });

module.exports.handler =
  process.env.NODE_ENV === 'local' ? app : serverless(app);
