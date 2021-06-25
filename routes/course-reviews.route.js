const express = require('express');
const courseReviewsModel = require('../models/course-reviews.model')
const { v4: uuidv4 } = require('uuid');
const courseReviewService = require('../services/course-review.service');

const router = express.Router();

router.get("/", async (req, res) => {
    const courseId = req.query.course_id;
    const reviews = await courseReviewsModel.getReviewsByCourseId(courseId);
    res.json({
        "meta": req.query,
        "data": reviews ?? null,
    });
})


const reviewSchema = require('../schemas/course-review.json');

router.put("/", require('../middlewares/validate.mdw')(reviewSchema), require('../middlewares/auth.mdw'), async (req, res) => {
    try {
        const body = req.body;
        const review = { ...body };
        review["user_id"] = req.accessTokenPayload.user_id;
        const result = await courseReviewService.createAReview(review);
        res.json({
            "meta": req.body,
            "data": review ?? null,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            "error": error
        })
    }
})

module.exports = router;