const jwt = require('jsonwebtoken');
const env = require('../config/env')

module.exports = function (req, res, next) {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      console.log(env);
      const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
      console.log(decoded);
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid access token!'
      });
    }
  } else {
    return res.status(400).json({
      message: 'Access token not found!'
    });
  }
}