const { category } = require("../mock-data/mock-data");

module.exports = {
    all() {
        return category;
    },
    async getCategoryByTopicId(topicId) {
        const categoryList = await category.filter((categoryItem) => categoryItem.topic_id === topicId);
        return categoryList;
    }
}