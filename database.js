const Database = require("better-sqlite3");
const CreateUserTableQuery = require("./spendwell-db/CREATE_USERS_TABLE");
const CreateTransactionsTableQuery = require("./spendwell-db/CREATE_TRANSACTIONS_TABLE");
const path = require("path");

const dbPath = path.join(__dirname, "spendwell.db");

const db = new Database(dbPath, { verbose: console.log });

db.exec(CreateUserTableQuery);
db.exec(CreateTransactionsTableQuery);

module.exports = db;
