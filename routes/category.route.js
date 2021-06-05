const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
    const listCategory = await categoryModel.all();
    res.json(listCategory);
});

router.get('/:categoryId', async function (req, res) {
    const categoryId = req.params.categoryId;
    const listCategory = await categoryModel.getCategoryById(categoryId);
    res.json(listCategory);
});

module.exports = router;