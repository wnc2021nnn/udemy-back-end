const jwt = require('jsonwebtoken');
const env = require('../config/env')

module.exports = () => (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  req.showDisabledCourses = false;
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
      req.accessTokenPayload = decoded;
      if (decoded.role == 1 || decoded.role == 0) {
        req.showDisabledCourses = true;
      } else {
        req.showDisabledCourses = false;
      }
    } catch (err) {
      console.log(err);
    }
  }
  next();
}