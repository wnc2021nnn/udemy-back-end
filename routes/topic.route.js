const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')

const router = express.Router();

router.get("/",async (req, res) => {
    const listTopic = await topicModel.getAll();
    res.json(listTopic);
})

router.get("/filter", async (req, res) => {
    const cateId = req.query.cateId;
    const topicItem = await topicModel.getTopicByCateId(cateId);
    res.json(topicItem);
})

router.get("/:topicId", async (req, res) => {
    const topicId = req.params.topicId;
    const topicItem = await topicModel.getTopicById(topicId);
    res.json(topicItem);
})

module.exports = router;