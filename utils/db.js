const pgConfig = require('../config/pg.config.json');

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : 'ec2-54-224-194-214.compute-1.amazonaws.com',
        user : 'fvtczrdakehlnp',
        password : 'cdbdc6f2e2b7f7adbfcd014551d68c0b69ced21f6f81057d79c503866ea439b4',
        database : 'devgrrdbv0qrf2',
        port: 5432
      },
    pool: { min: 0, max: 50 }
});

//sslmode: prefer

module.exports = knex