const CreateUserTableQuery = `CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    CreatedDateTime TEXT DEFAULT CURRENT_TIMESTAMP
);`;

module.exports = CreateUserTableQuery;
