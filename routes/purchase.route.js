const express = require('express');
const purchaseModel = require('../models/purchase.model')
const { v4: uuidv4 } = require('uuid');
const eventEmitter = require('../handlers/listeners/event-listener');
const purchaseService = require('../services/purchase.service');

const router = express.Router();

// router.get("/", async (req, res) => {
//     const courseId = req.query.course_id;
//     const reviews = await courseReviewsModel.getReviewsByCourseId(courseId);
//     res.json({
//         "meta": req.query,
//         "data": reviews ?? null,
//     });
// })

const pcSchema = require('../schemas/purchase.json');
router.put("/", require('../middlewares/validate.mdw')(pcSchema), async (req, res) => {
    const purchase = { ...req.body };
    purchase["id"] = uuidv4();
    purchase["created_at"] = Date.now();
    purchase["user_id"] = req.accessTokenPayload.user_id;
    purchase["purchase_type"] = 'COURSE_PURCHASE';

    await purchaseService.createAPurchase(purchase);

    res.json({
        "meta": req.body,
        "data": purchase ?? null,
    });
})

module.exports = router;