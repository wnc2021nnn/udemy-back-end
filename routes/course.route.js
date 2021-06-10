const express = require('express');
const couresModel = require('../models/course.model');


const router = express.Router();

router.get("/", async (req, res) => {
    const topicId = req.query.topic;
    const query = req.query.search;
    var listCourse = [];
    if (topicId) {
        listCourse = await couresModel.getCourseByTopic(topicId);
    } else if (query) {
        listCourse = await couresModel.searchCourse(query);
    } else {
        listCourse = await couresModel.getAll();
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