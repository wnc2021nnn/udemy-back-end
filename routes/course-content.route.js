const express = require('express');
const courseContentModel = require('../models/course-content.model');

const router = express.Router();

router.get('/', async function (req, res) {
    try{
        const allCourseContent = await courseContentModel.all();
        res.json({
            "status": "success",
            "data": allCourseContent
        });
    } catch(ex){
        console.log('Get allCourseContent error', ex);
        res.status(204, ex).send();
    }   
});

module.exports = router;