const herokuDbConnection = {
  host : process.env.pg_host,
  user : process.env.pg_user,
  password : process.env.pg_password,
  database : process.env.database,
  port: process.env.pg_port
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