const { json } = require('express');
const express = require('express');
const topicModel = require('../models/topic.model')
const topicService = require('../services/topic.service')

const router = express.Router();

router.get("/", async (req, res) => {
    const categoryId = req.query.category;
    const sort = req.query.sort;

    var listTopic = [];

    if (sort && sort === 'register_des') {
        listTopic = await topicService.topicRegistedTimesDesFrom(Date.now() - 7 * 24 * 60 * 60 * 1000)
        listTopic = listTopic.slice(0, 5);
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

const authMdwV2 = require('../middlewares/auth.v2.mdw');
const validateMdw = require('../middlewares/validate.mdw');
const ctSchema = require('../schemas/create-topics.json')
router.put('/', authMdwV2(0)
    , validateMdw(ctSchema)
    , async function (req, res) {
        try {
            var topics = req.body.topics;

            const result = await topicService.createTopics(topics);

            res.json({
                "data": result,
            });
        } catch (error) {
            console.log('Get all categories error', error);
            res.status(403).json({ error });
        }
    });

const utSchema = require('../schemas/update-topics.json')
router.patch('/', authMdwV2(0), validateMdw(utSchema), async function (req, res) {
    try {
        var topics = req.body.topics;

        const result = await topicService.updateTopics(topics);

        res.json({
            "data": result,
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ error });
    }
});

router.delete('/', authMdwV2(0), async function (req, res) {
    try {
        var topicIds = req.body.topic_ids;

        const result = await topicService.deleteTopics(topicIds);

        res.json({
            "data": result,
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ error });
    }
});


module.exports = router;