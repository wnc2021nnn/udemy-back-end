const express = require('express');
const chapterService = require('../services/chapter.service');
const router = express.Router();
const createChaptersSchema = require('../schemas/create-chapters.json')

router.put('/', require('../middlewares/validate.mdw') (createChaptersSchema) , async (req, res) => {
    try {
        const courseId = req.body.course_id;
        var chapters = req.body.chapters;
        const user = req.accessTokenPayload;
        const result = await chapterService.createChapters(user, courseId, chapters);
        res.json({
            "status": true,
            data: result,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error,
        });
    }

})

const updateChaptersSchema = require('../schemas/update-chapters.json')
router.patch('/', require('../middlewares/validate.mdw') (updateChaptersSchema) , async (req, res) => {
    try {
        const courseId = req.body.course_id;
        var chapters = req.body.chapters;
        const user = req.accessTokenPayload;
        const result = await chapterService.updateChapters(user, courseId, chapters);
        res.json({
            "status": true,
            data: result,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error,
        });
    }

})

module.exports = router;