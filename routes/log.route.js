const express = require('express');
const logModel = require('../models/log.model')
const { v4: uuidv4 } = require('uuid');
const eventEmitter = require('../handlers/listeners/event-listener')

const router = express.Router();

router.put("/", async (req, res) => {
    try {
        const id = uuidv4();
        const timestamp = Date.now();
        const log = req.body;
        const response = await logModel.add(log.type, id, log.target_id, log.data, timestamp);
        const result = { ...req.body };
        result["log_id"] = id;
        result["created_at"] = timestamp;

        eventEmitter.emit(result.type, result);

        res.json({
            "meta": req.body,
            "data": result,
        });
    } catch (ex) {
        res.status(500).send({
            "meta": req.body,
            "data": ex
        });
    }
})

module.exports = router;