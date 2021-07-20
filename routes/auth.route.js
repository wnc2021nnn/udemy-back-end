const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const env = require('../config/env')

const userModel = require('../models/user.model');

const router = express.Router();

const signInSchema = require('../schemas/sign-in.json')
router.post('/', require('../middlewares/validate.mdw')(signInSchema), async function (req, res) {
  const user = await userModel.singleByEmail(req.body.email);
  if (user === null) {
    return res.status(404).json({
      status: false,
      data: "User not found"
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(404).json({
      status: false,
      message: "wrong password"
    });
  }

  const payload = {
    user_id: user.user_id,
    role: user.role
  }
  const opts = {
    expiresIn: env.JWT_EXPIRES_IN // seconds
  }
  const accessToken = jwt.sign(payload, env.JWT_SECRET_KEY, opts);

  const refreshToken = randomstring.generate(80);
  await userModel.patchRFToken(user.user_id, refreshToken);
  delete user.password;
  user['refresh_token'] = refreshToken;
  user['access_token'] = accessToken;

  return res.json({
    "status": true,
    "data": user,
  })
})

const rfSchema = require('../schemas/refresh-token.json')
router.post('/refresh', require('../middlewares/validate.mdw')(rfSchema), async function (req, res) {
  const { access_token, refresh_token } = req.body;
  const { user_id, role } = jwt.verify(access_token, env.JWT_SECRET_KEY, {
    ignoreExpiration: true
  });

  const ret = await userModel.isValidRFToken(user_id, refresh_token);
  if (ret === true) {

    const payload = {
      'user_id': user_id,
      'role': role,
    }

    const newAccessToken = jwt.sign(payload, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRES_IN });
    return res.json({
      data: newAccessToken
    });
  }

  return res.status(400).json({
    message: 'Refresh token is revoked!'
  });
})

module.exports = router;