const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
    try{
        const listCategory = await categoryModel.all();
        console.log('LIST CATES', listCategory);
        res.json(listCategory);
    } catch(ex){
        console.log('Get all categories error', ex);
        res.status(404, ex).send();
    }   
});

router.get('/:categoryId', async function (req, res) {
    const categoryId = req.params.categoryId;
    const listCategory = await categoryModel.getCategoryById(categoryId);
    res.json(listCategory);
});

module.exports = router;