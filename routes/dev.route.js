const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

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

module.exports = router;