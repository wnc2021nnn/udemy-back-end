const { v4 } = require("uuid");
const categoryModel = require("../models/category.model")
const topicModel = require("../models/topic.model")

module.exports = {
    async getAllCategories() {
        categories = await categoryModel.all();
        const categorieIds = categories.map((c) => c.category_id);
        const topics = await topicModel.getTopicsByCateIds(categorieIds);

        categories = categories.map((c) => {
            const topicsByCate = topics.filter((t) => t.category_id === c.category_id);
            return {
                ...c,
                "topics": topicsByCate
            }
        });

        return categories;
    },

    async createCategories(categories) {
        categories = categories.map((c) => {
            return {
                ...c,
                'category_id': v4(),
            }
        });

        await categoryModel.create(categories);

        return categories;
    }
}