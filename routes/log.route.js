const express = require('express');
const logModel = require('../models/log.model')
const { v4: uuidv4 } = require('uuid');
const eventEmitter = require('../handlers/listeners/event-listener')
const courseModel = require('../models/course.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const router = express.Router();

const logSchema = require('../schemas/log.json');

router.put("/", require('../middlewares/validate.mdw')(logSchema), async (req, res) => {
    try {
        const log = {
            ...req.body,
            "log_id": uuidv4(),
            "created_at": Date.now(),
        };

        const accessToken = req.headers['x-access-token'];

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
                log['user_id'] = decoded.user_id;
            } catch (err) {
                console.log(err);
            }
        }

        const response = await logModel.add(log);

        eventEmitter.emit(log.type, log);

        res.json({
            "data": log,
        });
    } catch (ex) {
        res.status(500).send({
            "meta": req.body,
            "data": ex
        });
    }
})

module.exports = router;