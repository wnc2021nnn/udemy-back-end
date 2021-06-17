const topicModel = require('../models/topic.model')
const logModel = require('../models/log.model')
const courseModel = require('../models/course.model');

module.exports = {
    async topicRegistedTimesDesFrom(timeInMiliseconds) {
        const regLog = await logModel.coursesRegistedWithInCount(timeInMiliseconds);
        const topicIds = await courseModel.getTopicIdsByCoursesIds(regLog.map((c) => c.course_id));
        courseTopics = topicIds.map((t) => {
            const count = regLog.find((l) => l.course_id === t.course_id).count;
            return {
                ...t,
                count,
            }
        });

        const topics = await topicModel.getTopicsByIds(topicIds.map((t) => t.topic_id))
        return topics.map((t) => {
            const registed_times = courseTopics.find((c) => c.topic_id === t.topic_id).count;

            return {
                ...t,
                registed_times,
            }
        });
    }
}