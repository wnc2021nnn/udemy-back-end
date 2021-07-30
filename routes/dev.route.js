const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

const courseRM = require('../models/course-reviews.model')

router.post('/calculate-reviews', async (req, res) => {
    try {
        const courses = await courseModel.getAll();

        for (const course of courses) {
            const courseId = course.course_id;

            const reviews = await courseRM.getReviewsByCourseId(courseId);

            const newRatingTotal = reviews.length;
           
            if (newRatingTotal > 0) {
                const newRating = (reviews.reduce((a, b) => ({ rating: a.rating + b.rating }))).rating / newRatingTotal;

                console.log(courseId, newRatingTotal, newRating)
                await courseModel.updateCourse(courseId, {
                    'rating_total': newRatingTotal,
                    'rating': newRating,
                });
            }
        }

        res.json({
            "status": true
        });
    } catch (error) {
        console.log(error);
    }

})

router.post('/fix-course-table', async (req, res) => {
    try {
        const courses = await courseModel.getAll();

        const now = Date.now();

        await courses.forEach(async course => {
            const courseId = course.course_id;

            const day = Math.floor(Math.random() * 50) + 1;
            const second = Math.floor(Math.random() * 86400) + 1;
            const ran = (day * 86400 + second) * 1000;
            const createdAt = now - ran;

            if (course.created_at == '0') {
                console.log("created_at", course);
                const res = await courseModel.update(courseId, { created_at: createdAt });
            }

            if (course.updated_at == '0') {
                console.log("updated_at", course);
                const res = await courseModel.updateUpdatedAt(courseId, createdAt);
            }
        });

        res.json({
            "status": true
        });
    } catch (error) {
        console.log(error);
    }

})


router.post('/mark-complete', async (req, res) => {
    try {
        const courses = await courseModel.getAll();


        await courses.forEach(async course => {
            const courseId = course.course_id;

            if (!course.status) {
                const res = await courseModel.update(courseId, {
                    status: 'COMPLETE'
                });
            }
        });

        res.json({
            "status": true
        });
    } catch (error) {
        console.log(error);
    }

})

router.post('/mark-enabled', async (req, res) => {
    try {
        const courses = await courseModel.getAll();


        await courses.forEach(async course => {
            const courseId = course.course_id;

            if (!course.state) {
                const res = await courseModel.update(courseId, {
                    state: 'ENABLED'
                });
            }
        });

        res.json({
            "status": true
        });
    } catch (error) {
        console.log(error);
    }

})

router.post('/tsv', async (req, res) => {
    try {
        const result = await courseModel.updateTsv();
        res.json({
            "status": true,
            "data": result,
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ error });
    }

})

module.exports = router;