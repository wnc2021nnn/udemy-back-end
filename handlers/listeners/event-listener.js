// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

const courseModel = require('../../models/course.model');

eventEmitter.addListener('USER_VIEW_COURSE', async (log) => {
    const res = await courseModel.increaseViewCountByOne(log.target_id);
    console.log("USER_VIEW_COURSE", res);
})

module.exports = eventEmitter;