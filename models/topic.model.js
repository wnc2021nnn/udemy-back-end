const db = require('../utils/db');
const TBL_TOPIC = 'topic'

module.exports = {
    getAll() {
        return db(TBL_TOPIC);
    },
    getTopicById(topicId) {
        return db(TBL_TOPIC).where({
            topic_id: topicId
        });
    },
    getTopicsByIds(topicIds) {
        return db(TBL_TOPIC).whereIn('topic_id', topicIds);
    },
    getTopicByCateId(cateId) {
        return db(TBL_TOPIC).where({
            category_id: cateId
        });
    },
    getTopicsByCateIds(categorieIds) {
        return db(TBL_TOPIC).whereIn(
            'category_id', categorieIds
        );
    },
    create(topics) {
        return db(TBL_TOPIC)
            .insert(topics);
    },
    updateTopic(topic) {
        return db(TBL_TOPIC)
            .where('topic_id', topic.topic_id)
            .update(topic);
    },
    deleteTopics(topicIds) {
        return db(TBL_TOPIC)
            .whereIn('topic_id', topicIds)
            .del();
    }
}