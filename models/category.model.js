const { category } = require("../mock-data/mock-data");
const db = require('../utils/db');
const TBL_CATEGORY = 'category'

module.exports = {
    all() {
        return db(TBL_CATEGORY);
    },
    getCategoryById(cateId) {
        return db(TBL_CATEGORY)
            .where({
                category_id: cateId
            });
    },
    create(categories) {
        return db(TBL_CATEGORY)
            .insert(categories);
    },
    updateCategory(category) {
        return db(TBL_CATEGORY)
            .where('category_id', category.category_id)
            .update(category);
    },
    deleteCategories(categoryIds) {
        return db(TBL_CATEGORY)
            .whereIn('category_id', categoryIds)
            .del();
    }
}