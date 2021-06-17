const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
    try{
        const listCategory = await categoryModel.all();
        res.json({
            "status": "success",
            "data": listCategory
        });
    } catch(ex){
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