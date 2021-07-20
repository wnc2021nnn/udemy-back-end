const express = require('express');
const lessonService = require('../services/lesson.service');
const router = express.Router();

const llsSchema = require('../schemas/lesson-learning-state.json')

router.post('/:id/update-video-learning-state', require('../middlewares/validate.mdw')(llsSchema), async (req, res) => {
    try {
        const learningState = {
            ...req.body,
            "user_id": req.accessTokenPayload.user_id,
            "lesson_id": req.params.id,
        };

        const result = await lessonService.updateVideoLearningState(learningState);

        res.json({
            "status": true,
            result,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            "status": false,
            error,
        });
    }

})

const clSchema = require('../schemas/create-lessons.json');

router.put('/'
    , require('../middlewares/validate.mdw')(clSchema)
    , async (req, res) => {
        try {
            const user = req.accessTokenPayload;
            const lessons = req.body.lessons;

            const result = await lessonService.createLessons(user, req.body.course_id, lessons);

            res.json({
                'data': result,
            });
        } catch (error) {
            console.log(error);

            res.status(400).json({
                error,
            });
        }

    })

module.exports = router;