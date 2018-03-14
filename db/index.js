const pgp = require('pg-promise')();
//const connection = pgp('postgres://Jimmy:jimmyh3-postgres@localhost:5432/team-i-chess');
const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;