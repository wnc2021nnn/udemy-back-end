const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')

const router = express.Router();

router.get("/", (req, res) => {
    const listTopic = topicModel.getAll();
    console.log(listTopic);
    res.json(listTopic);
})

router.get("/:topicId", async (req, res) => {
    const topicId = req.params.topicId;
    const topicItem = await topicModel.getTopicById(topicId);
    res.json(topicItem);
})

module.exports = router;