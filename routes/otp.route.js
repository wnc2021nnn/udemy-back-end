const express = require('express');
const mailService = require('../services/mail.service');
const otpService = require('../services/otp.service');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        res.json({
            "status": true,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error,
        });
    }

})

module.exports = router;