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
    } catch (error) {
        console.log('Get all categories error', error);
        res.status(204, ex).json({ error });
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

const authMdwV2 = require('../middlewares/auth.v2.mdw');
const validateMdw = require('../middlewares/validate.mdw');
const ccSchema = require('../schemas/create-categories.json')
router.put('/', authMdwV2(0), validateMdw(ccSchema), async function (req, res) {
    try {
        var categories = req.body.categories;

        const result = await categoryService.createCategories(categories);

        res.json({
            "data": result,
        });
    } catch (error) {
        console.log('Get all categories error', error);
        res.status(403).json({ error });
    }
});

router.patch('/', authMdwV2(0), async function (req, res) {
    try {
        var categories = req.body.categories;

        const result = await categoryService.updateCategories(categories);

        res.json({
            "data": result,
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ error });
    }
});
module.exports = router;