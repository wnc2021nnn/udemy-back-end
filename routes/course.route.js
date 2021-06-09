const { json } = require('express');
const express = require('express');
const couresModel = require('../models/course.model');


const router = express.Router();

router.get("/", async (req, res) => {
    const listCourse = await couresModel.getAll();
    res.json(listCourse);
})

router.get("/:id", async (req, res) => {
    const courseId = req.params.id;
    const listCourse = await couresModel.getDetailCouresById(courseId);
    res.json(listCourse);
})

router.get("/filter", async (req, res) => {
    const topicId = req.query.topicId;

    const listCourse = await couresModel.getCourseByTopic(topicId);

    res.json(listCourse);
})

router.get('/search', async function (req, res) {
    const query = req.query.query || "a";
    const courseItem = await couresModel.searchCourse(query);
    if (courseItem == null)
        return res.status(204).end();
    return res.json(courseItem);
});




module.exports = router;