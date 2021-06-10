const express = require('express');
const couresModel = require('../models/course.model');


const router = express.Router();

router.get("/", async (req, res) => {
    const topicId = req.query.topic;
    const query = req.query.search;
    const sort = req.query.sort;
    const limit = req.query.limit;

    var listCourse = [];

    if (topicId) {
        listCourse = await couresModel.getCourseByTopic(topicId);
    } else if (query) {
        listCourse = await couresModel.searchCourse(query);
    } else {
        listCourse = await couresModel.getAll();
    }

    if (sort && sort === 'view_des') {
        listCourse = listCourse.sort((a, b) => b.view_count - a.view_count);
    }

    if (sort && sort === 'created_date_des') {
        listCourse = listCourse.sort((a, b) => b.created_at - a.created_at);
    }

    if(limit && limit > 0){
        listCourse = listCourse.slice(0, limit);
    }

    res.json({
        "status": "success",
        "meta": req.query,
        "data": listCourse,
    });
})

router.get("/:id", async (req, res) => {
    const courseId = req.params.id;
    const listCourse = await couresModel.getDetailCouresById(courseId);
    res.json({
        "status": "success",
        "meta": req.params,
        "data": listCourse[0] ?? null
    });
})

module.exports = router;