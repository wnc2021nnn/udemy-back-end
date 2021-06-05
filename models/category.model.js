const { category } = require("../mock-data/mock-data");
const db = require('../utils/db');
const TBL_CATEGORY = 'category'
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://fvtczrdakehlnp:cdbdc6f2e2b7f7adbfcd014551d68c0b69ced21f6f81057d79c503866ea439b4@ec2-54-224-194-214.compute-1.amazonaws.com:5432/devgrrdbv0qrf2',
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    all() {

        // client.connect();

        // client.query('SELECT * from category', (err, res) => {
        //     if (err) {
        //         console.log('ERRORRR', err);
        //         throw err;
        //     }
        //     for (let row of res.rows) {
        //         console.log(JSON.stringify(row));
        //     }
        //     client.end();
        //     return res.rows;
        // });
        return db(TBL_CATEGORY);
    },
    async getCategoryById(cateId) {
        const categoryResult = await category.find((categoryItem) => categoryItem.category_id === cateId);
        return categoryResult;
    }
}