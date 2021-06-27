const jwt = require('jsonwebtoken');
const env = require('../config/env')

module.exports = function (req) {
  const accessToken = req.headers['x-access-token'];
  var accessTokenPayload;
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
      accessTokenPayload = decoded;
    } catch (err) {
    }
  }
  return accessTokenPayload;
}