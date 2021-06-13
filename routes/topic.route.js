const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')

const router = express.Router();

router.get("/", async (req, res) => {
    const categoryId = req.query.category;
    const sort = req.query.sort;

    var listTopic = [];

    if (sort && sort === 'register_des') {
        listTopic = await topicModel.getAll(); //TODO implement this API
    } else if (categoryId) {
        listTopic = await topicModel.getTopicByCateId(categoryId);
    } else {
        listTopic = await topicModel.getAll();
    }

    res.json({
        "meta": req.query,
        "data": listTopic
    });
})

router.get("/:topicId", async (req, res) => {
    const topicId = req.params.topicId;
    const topicItems = await topicModel.getTopicById(topicId);
    res.json({
        "meta": req.params,
        "data": topicItems[0] ?? null,
    });
})

module.exports = router;