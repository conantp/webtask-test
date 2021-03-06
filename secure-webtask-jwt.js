'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());

const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');

app.use((req, res, next) => { 
  const issuer = 'https://' + req.webtaskContext.secrets.AUTH0_DOMAIN + '/';
  jwt({
    secret: jwksRsa.expressJwtSecret({ jwksUri: issuer + '.well-known/jwks.json' }),
    audience: req.webtaskContext.secrets.AUDIENCE,
    issuer: issuer,
    algorithms: [ 'RS256' ]
  })(req, res, next);
});

app.get('/test', (req, res) => {
  // test endpoint, no-operation
  res.send(200);
});

app.get('/', (req, res) => {
  // add your logic, you can use scopes from req.user
  res.json({hi: req.user.sub});
});

module.exports = fromExpress(app);
