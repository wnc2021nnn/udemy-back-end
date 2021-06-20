const express = require('express');
const logModel = require('../models/log.model')
const { v4: uuidv4 } = require('uuid');
const eventEmitter = require('../handlers/listeners/event-listener')
const courseModel = require('../models/course.model');

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const courses = await courseModel.getAll();
//         const coursesIds = courses.map((course) => course.course_id);

//         const now = Date.now();

//         await courses.forEach(async course => {
//             const courseId = course.course_id;

//             const day = Math.floor(Math.random() * 50) + 1;
//             const second = Math.floor(Math.random() * 86400) + 1;
//             const ran = (day * 86400 + second) * 1000;
//             const createdAt = now - ran;

//             if (course.created_at === '0') {
//                 console.log("created_at", course);
//                 const res = await courseModel.update(courseId, createdAt);
//             }

//             if (course.updated_at === '0') {
//                 console.log("updated_at", course);
//                 const res = await courseModel.updateUpdatedAt(courseId, createdAt);
//             }
//         });

//         res.json({
//             "data": "ok",
//         });
//     } catch (error) {
//         console.log(error);
//     }

// })

router.put("/", async (req, res) => {
    try {
        const id = uuidv4();
        const timestamp = Date.now();
        const body = req.body;
        const response = await logModel.add(body.type, id, body.target_id, body.data, timestamp, body.user_id);
        const log = { ...body };
        log["log_id"] = id;
        log["created_at"] = timestamp;

        eventEmitter.emit(log.type, log);

        res.json({
            "meta": body,
            "data": log,
        });
    } catch (ex) {
        res.status(500).send({
            "meta": body,
            "data": ex
        });
    }
})

module.exports = router;