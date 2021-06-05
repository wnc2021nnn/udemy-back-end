const { json } = require('express');
const express = require('express');
const couresModel = require('../models/course.model');


const router = express.Router();

router.get('/:query', async function(req, res){
    const query = req.params.query || "a";
    const courseItem = await couresModel.searchCourse(query);
    if(courseItem == null)
        return res.status(204).end();
    return res.json(courseItem);
});




module.exports = router;