const Database = require("better-sqlite3");
const CreateUserTableQuery = require("./spendwell-db/CREATE_USERS_TABLE");
const CreateTransactionsTableQuery = require("./spendwell-db/CREATE_TRANSACTIONS_TABLE");
const path = require("path");
const os = require("os");
const fs = require("fs");

const appDataPath = path.join(os.homedir(), ".spendwell");
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath);
}
const dbPath = path.join(appDataPath, "spendwell.db");

const db = new Database(dbPath, { verbose: console.log });

db.exec(CreateUserTableQuery);
db.exec(CreateTransactionsTableQuery);

module.exports = db;
