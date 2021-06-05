const { course } = require("../mock-data/mock-data")

module.exports = {
    getAll() {
        return course;
    },

    async getCourseByTopic(topicId) {
        const listCourse = await course.filter(courseItem => courseItem.topic_id === topicId);
        return listCourse;
    },

    async getDetailCouresById(courseId) {
        const courseItem = await course.find(courseItem => courseItem.course_id === courseId);
        return courseItem;
    },

    async searchCourse(query) {
        const courseList = await course.filter(courseItem => courseItem.title.includes(query));
        return courseList;
    }


}