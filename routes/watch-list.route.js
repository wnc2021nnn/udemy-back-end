const express = require('express');
const wlModel = require('../models/watch-list.model');
const courseModel = require('../models/course.model')

const { v4 } = require('uuid');

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const userId = req.accessTokenPayload.user_id;

        const items = await wlModel.multiByUserId(userId);

        var courses = await courseModel.getCouresByIds(items.map((i) => i.course_id));

        courses = courses.map((c) => {
            const watch_list_item_created_at = items.find((i) => i.course_id === c.course_id).created_at;
            return {
                ...c,
                "watch_list_item_created_at": watch_list_item_created_at
            }
        });

        res.json({
            "status": "success",
            "data": courses,
        });

    } catch (ex) {
        console.log(ex)
        res.status(401).send({
            "error": ex
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