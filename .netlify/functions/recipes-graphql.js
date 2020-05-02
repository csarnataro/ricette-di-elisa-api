const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/*', function (req, res) {
  res.write(`Hello World from ${req.url}`);
  res.end()
});

module.exports.handler =
  process.env.NODE_ENV === 'local' ? app : serverless(app);
