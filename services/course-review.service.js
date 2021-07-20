const { v4 } = require("uuid");
const eventEmitter = require("../handlers/listeners/event-listener");
const courseReviewsModel = require("../models/course-reviews.model");
const purchaseModel = require("../models/purchase.model");

module.exports = {
    async createAReview(review) {
        const purcharses = await purchaseModel.multiByUserIdAndType(review.user_id);
        console.log(purcharses);
        const coursePurchased = purcharses.find((p) => p.item_id === review.course_id);
        if(coursePurchased){
            review["course_review_id"] = v4();
            review["created_at"] = Date.now();
            await courseReviewsModel.add(review);
            eventEmitter.emit('COURSE_REVIEW_ADDED', review);
        } else {
            throw 'Cannot add reviews, You have not purchased this course yet';
        }
    }
}