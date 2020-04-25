const jwt = require('express-jwt')
const jwtDecode = require('jsonwebtoken')
const token = require('../config.json').jwt.token

const getTokenFromHeaders = req => {
    const { headers: { authorization } } = req;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const token = authorization.split(' ')[1];
      req.userId = jwtDecode.decode(token).id 
      return authorization.split(' ')[1];
    }
    return null;
}   

const auth = {
    required: jwt({
      secret: token,
      userProperty: 'payload',
      getToken: getTokenFromHeaders
    }),

    optional: jwt({
      credentialsRequired: false,
      secret: token,
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    }),
  };

  module.exports = auth;

