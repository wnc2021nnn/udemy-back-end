const { category } = require("../mock-data/mock-data");

module.exports = {
    all() {
        return category;
    },
    async getCategoryById(cateId) {
        const categoryResult = await category.find((categoryItem) => categoryItem.category_id === cateId);
        return categoryResult;
    }
}