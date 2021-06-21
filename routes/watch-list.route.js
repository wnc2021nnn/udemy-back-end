const express = require('express');
const wlModel = require('../models/watch-list.model');

const { v4 } = require('uuid');

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const userId = req.accessTokenPayload.user_id;

        const items = await wlModel.multiByUserId(userId);

        res.json({
            "status": "success",
            "data": items,
        });

    } catch (ex) {
        res.status(401).send({
            error: ex
        });
    }
});

router.put('/', async function (req, res) {
    try {
        const item = { ...req.body };
        item['user_id'] = req.accessTokenPayload.user_id;

        const isItemExist = await wlModel.isItemExist(item.user_id, item.course_id);
        if (isItemExist) {
            res.status(400).send({
                message: "Item exist"
            })
        } else {
            item['id'] = v4();
            item['created_at'] = Date.now();

            await wlModel.add(item);

            res.json({
                "status": "success",
                "data": item,
            });
        }

    } catch (ex) {
        res.status(401).send({
            error: ex
        });
    }
});

router.delete('/', async function (req, res) {
    try {
        const item = { ...req.body };
        item['user_id'] = req.accessTokenPayload.user_id;
        const ret = await wlModel.delete(item);

        res.json({
            "status": "success",
            "data": ret,
        });
    } catch (ex) {
        res.status(401).send({
            error: ex
        });
    }
});

module.exports = router;