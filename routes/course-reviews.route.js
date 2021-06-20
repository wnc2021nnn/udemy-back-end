const express = require('express');
const courseReviewsModel = require('../models/course-reviews.model')
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.get("/", async (req, res) => {
    const courseId = req.query.course_id;
    const reviews = await courseReviewsModel.getReviewsByCourseId(courseId);
    res.json({
        "meta": req.query,
        "data": reviews ?? null,
    });
})

router.put("/", async (req, res) => {
    const body = req.body;
    const review = {...body};
    review["course_review_id"] = uuidv4();
    review["created_at"] = Date.now();
    review["user_id"] = "user_000009"; //TODO fix this field
    const result = await courseReviewsModel.add(review);
    res.json({
        "meta": req.body,
        "data": review ?? null,
    });
})

module.exports = router;