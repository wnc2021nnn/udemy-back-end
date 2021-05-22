const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')

const router = express.Router();

router.get("/", (req, res) => {
    const listTopic = topicModel.getAll();
    console.log(listTopic);
    res.json(listTopic);
})

module.exports = router;