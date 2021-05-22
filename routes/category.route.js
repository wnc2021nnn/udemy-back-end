const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
    const listCategory = await categoryModel.all();
    res.json(listCategory);
});

router.get('/:topic_id', async function (req, res) {
    const topic_id = req.params.topic_id;
    const listCategory = await categoryModel.getCategoryByTopicId(topic_id);
    res.json(listCategory);
});

module.exports = router;