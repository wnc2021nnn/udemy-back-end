const { category } = require("../mock-data/mock-data");

module.exports = {
    all() {
        return category;
    },
    async getCategoryByTopicId(topicId) {
        const categoryList = await category.filter((categoryItem) => categoryItem.topic_id === topicId);
        return categoryList;
    },
    async getCategoryById(cateId) {
        const categoryResult = await category.find((categoryItem) => categoryItem.category_id === cateId);
        return categoryResult;
    }
}