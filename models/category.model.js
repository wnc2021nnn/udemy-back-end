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
    }
}