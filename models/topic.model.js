const { topic } = require("../mock-data/mock-data")

module.exports = {
    getAll() {
        return topic;
    },
    async getTopicById(topicId) {
        const topicResult = await topic.find((topicItem) => topicItem.topic_id === topicId);
        return topicResult;
    },
    async getTopicByCateId(cateId) {
        const topicResult = await topic.filter((topicItem) => topicItem.category_id === cateId);
        return topicResult;
    }
}