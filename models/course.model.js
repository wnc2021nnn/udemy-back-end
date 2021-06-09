const { course } = require("../mock-data/mock-data")
const db = require('../utils/db');
const TBL_COURSE = 'course'

module.exports = {
    getAll() {
        return db(TBL_COURSE);
    },

    getCourseByTopic(topicId) {
        return db(TBL_COURSE).where({
            topic_id: topicId
        });
    },

    getDetailCouresById(courseId) {
        return db(TBL_COURSE).where({
            course_id: courseId
        });
    },

    async searchCourse(query) {
        return [];
        // const courseList = await course.filter(courseItem => courseItem.title.includes(query));
        // return courseList;
    }
}