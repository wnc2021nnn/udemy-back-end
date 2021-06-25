// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

const courseModel = require('../../models/course.model');
const logModel = require('../../models/log.model');
const courseService = require('../../services/course.service');

eventEmitter.addListener('USER_VIEW_COURSE', async (log) => {
    const res = await courseService.increaseViewCountByOne(log.target_id);
    console.log("USER_VIEW_COURSE", res);
})

eventEmitter.addListener('COURSE_REGISTED', async (log) => {
    await logModel.add(log);
    const res = await courseService.increaseRegistedCountByOne(log.target_id);
    console.log("COURSE_REGISTED", res);
})

module.exports = eventEmitter;