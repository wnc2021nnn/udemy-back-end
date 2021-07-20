const jwt = require('jsonwebtoken');
const env = require('../config/env')

module.exports = requiredRole => (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
      if (decoded.role != requiredRole) {
        return res.status(403).json({
          message: 'Invalid permission!'
        });
      } else {
        req.accessTokenPayload = decoded;
        next();
      }
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