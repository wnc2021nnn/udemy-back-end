const express = require('express');
const mailService = require('../services/mail.service');
const otpService = require('../services/otp.service');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const router = express.Router();

router.post('/verify-email', require('../middlewares/auth.v2.mdw')(-1, true), async (req, res) => {
    try {
        const user = req.accessTokenPayload;

        const result = await otpService.verifyOtp(user, req.body);

        res.json({
            "status": true,
            "data": result
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error,
        });
    }

})

module.exports = router;