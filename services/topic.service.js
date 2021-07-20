const topicModel = require('../models/topic.model')
const logModel = require('../models/log.model')
const courseModel = require('../models/course.model');
const { v4 } = require('uuid');

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
    },

    async createTopics(topics) {
        topics = topics.map((c) => {
            return {
                ...c,
                'topic_id': v4(),
            }
        });

        await topicModel.create(topics);

        return topics;
    },

    async updateTopics(topics) {
        for(const c of topics){
            await topicModel.updateTopic(c);
        }
        return topics;
    },

    async deleteCategories(categoryIds) {
        var sucess = [];

        for (const cid of categoryIds) {
            const topics = await topicModel.getTopicByCateId(cid);
            if (topics.length <= 0) {
                await categoryModel.deleteCategories([cid]);
                sucess.push(cid);
            }
        }

        if (sucess.length < 1) throw 'Cannot delete category, Try to delete topic first';

        return sucess;
    }
}