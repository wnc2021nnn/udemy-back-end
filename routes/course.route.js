const express = require('express');
const courseModel = require('../models/course.model');
const couresModel = require('../models/course.model');
const courseService = require('../services/course.service');
const getAccessTokenPayload = require('../utils/get-access-token-payload')
const router = express.Router();

router.get("/", async (req, res) => {
    const topicId = req.query.topic;
    const query = req.query.search;
    const sort = req.query.sort;
    const limit = req.query.limit;
    const page = req.query.page;

    var listCourse = [];
    var pagination = {};

    try {
        if (sort && sort === 'view_from_last_week_des') {
            listCourse = await courseService.coursesViewedDesFromLastWeek();
        } else {
            if (topicId) {
                listCourse = await couresModel.getCourseByTopic(topicId, page, limit);
                const lc = await couresModel.getCourseByTopic(topicId);
                pagination.total_courses = lc.length;
            } else if (query) {
                const result = await courseService.searchCourse(query, page, limit);
                listCourse = result.data;
                pagination = result.pagination;
            } else {
                listCourse = await couresModel.getAll();
            }

            if (sort && sort === 'view_des') {
                listCourse = listCourse.sort((a, b) => b.view_count - a.view_count);
            }

            if (sort && sort === 'created_date_des') {
                listCourse = listCourse.sort((a, b) => b.created_at - a.created_at);
            }

            if (limit && limit > 0) {
                listCourse = listCourse.slice(0, limit);
            }
        }

        res.json({
            "status": "success",
            "meta": req.query,
            "pagination": pagination,
            "data": listCourse
        });
    } catch (error) {
        console.log(error)
        res.status(403).json({error});
    }
})

router.get("/my-courses", require('../middlewares/auth.mdw'), async (req, res) => {
    const user = req.accessTokenPayload;
    const myCourses = await courseService.getMyCourses(user);
    res.json({
        "data": myCourses,
    })
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

router.get("/:id/related-courses", async (req, res) => {
    const courseId = req.params.id;
    const limit = req.query.limit ?? 6;
    const sort = req.query.sort;
    const course = (await couresModel.getDetailCouresById(courseId))[0];
    if (course && sort === 'registed_des') {
        const courses = await courseModel.getTopRegistedCoursesByTopic(course.topic_id, limit);
        res.json({
            "status": "success",
            "meta": {
                "params": req.params,
                "query": req.query,
            },
            "data": courses ?? null
        });
    } else {
        res.status(204).send();
    }
})

router.get("/:id/content", async (req, res) => {
    const courseId = req.params.id;

    var userId;

    const atp = getAccessTokenPayload(req);

    if (atp) {
        userId = atp.user_id;
    }

    const content = await courseService.getChaptersAndLessonsByCourse(courseId, userId);

    res.json({
        "data": content ?? null,
    });
})

const courseSchema = require('../schemas/course.json');
router.put("/", require('../middlewares/auth.mdw'), require('../middlewares/validate.mdw')(courseSchema), async (req, res) => {
    try {
        var course = req.body;
        var result = await courseService.createACourse(req.accessTokenPayload.user_id, req.accessTokenPayload.role, course);
        res.json({
            "data": result
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error,
        });
    }
})

router.patch("/:id"
    , require('../middlewares/auth.v2.mdw')(1)
    , require('../middlewares/validate.mdw')(courseSchema)
    , async (req, res) => {
        try {
            var course = req.body;
            var result = await courseService.updateACourse(
                req.params.id,
                course
            );
            res.json({
                "data": result
            });
        } catch (error) {
            console.log(error)
            res.status(400).json({
                error,
            });
        }
    })

const ucsSchema = require('../schemas/update-course-state.json')
router.patch("/:id/state"
    , require('../middlewares/auth.v2.mdw')(0)
    , require('../middlewares/validate.mdw')(ucsSchema)
    , async (req, res) => {
        try {
            var course = req.body;
            var result = await courseService.updateACourse(
                req.params.id,
                course
            );
            res.json({
                "data": result
            });
        } catch (error) {
            console.log(error)
            res.status(403).json({
                error,
            });
        }
    })

module.exports = router;