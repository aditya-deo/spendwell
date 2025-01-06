const Database = require("better-sqlite3");
const CreateUserTableQuery = require("./spendwell-db/CREATE_USERS_TABLE");
const path = require("path");

const dbPath = path.join(__dirname, "spendwell.db");

const db = new Database(dbPath, { verbose: console.log });

db.exec(CreateUserTableQuery);

module.exports = db;
