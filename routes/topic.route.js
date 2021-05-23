const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')

const router = express.Router();

router.get("/", (req, res) => {
    const listTopic = topicModel.getAll();
    console.log(listTopic);
    res.json(listTopic);
})

router.get("/:cateId", async (req, res) => {
    const cateId = req.params.cateId;
    const topicItem = await topicModel.getTopicByCateId(cateId);
    res.json(topicItem);
})

module.exports = router;