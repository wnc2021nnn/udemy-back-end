const { json } = require('express');
const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res){
    const listCategory = await categoryModel.all();
    res.json(listCategory);
});

module.exports = router;