const CreateTransactionsTableQuery = `CREATE TABLE IF NOT EXISTS Transactions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TransactionDate DATETIME NOT NULL,
    Particulars NVarchar(500),
    Debit NUMERIC(22,8),
    Credit NUMERIC(22,8),
    Balance NUMERIC(22,8),
    Username TEXT NOT NULL,
    CreatedDateTime TEXT DEFAULT CURRENT_TIMESTAMP
);`;

module.exports = CreateTransactionsTableQuery;
