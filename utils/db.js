const herokuDbConnection = {
  host : process.env.host,
  user : process.env.user,
  password : process.env.password,
  database : process.env.database,
  port: process.env.port
};

const localDbConnection = {
  host : 'localhost',
  user : 'postgres',
  password : '170597',
  database : 'wnc2021localdb',
  port: 5432
}

const knex = require('knex')({
    client: 'pg',
    connection: herokuDbConnection,
    pool: { min: 0, max: 50 }
});

module.exports = knex