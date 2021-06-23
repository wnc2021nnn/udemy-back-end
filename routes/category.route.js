const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');
const categoryService = require('../services/category.service');

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const
            categories = await categoryService.getAllCategories();
        res.json({
            "status": "success",
            "data": categories,
        });
    } catch (ex) {
        console.log('Get all categories error', ex);
        res.status(204, ex).send();
    }
});

router.get('/:categoryId', async function (req, res) {
    const categoryId = req.params.categoryId;
    const listCategory = await categoryModel.getCategoryById(categoryId);
    res.json({
        "status": "success",
        "meta": req.params,
        "data": listCategory[0] ?? null
    });
});

module.exports = router;