const db = require("./database");

const GetTop100Data = ()=>{
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT * FROM TRANSACTIONS WHERE Username = '${username}' ORDER BY ID DESC LIMIT 100;`
        );
        const data = stmt.all();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}


const GetHighestSingleTimeExpense = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT max(Debit) as highestSingleTimeExpense FROM TRANSACTIONS WHERE Username = '${username}';`
        );
        const data = stmt.get();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTopPayeeByAmount = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT 
                SUBSTRING(Particulars, 21, 10) AS Payee,
                SUM(Debit) AS TotalAmount
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%' 
            AND Username = '${username}'
            GROUP BY Payee
            ORDER BY TotalAmount DESC
            LIMIT 1;`
        );
        const data = stmt.get();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTopPayeeByFrequency = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT 
                SUBSTRING(Particulars, 21, 10) AS Payee,
                count(SUBSTRING(Particulars, 21, 10)) AS TotalCount
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%' 
            AND Username = '${username}'
            GROUP BY Payee
            ORDER BY TotalCount DESC
            LIMIT 1;`
        );
        const data = stmt.get();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetMostExpensiveDay = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT 
                DATE(TransactionDate) as TransactionDate, 
                SUM(debit) as expenseOnThatDate
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%'
            AND Username = '${username}'
            GROUP BY TransactionDate
            Order by expenseOnThatDate DESC
            LIMIT 1;`
        );
        const data = stmt.get();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTransactionStatistics = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT COUNT(ID) as totalTransactions, 
                COUNT(ID) / COUNT(DISTINCT(DATE(TRANSACTIONDATE))) AS avgTransactionsPerDay,
                AVG(DEBIT) as avgExpenditurePerDay, 
                SUM(DEBIT) as totalExpenditure 
                from Transactions
            WHERE Username = '${username}';`
        );
        const data = stmt.get();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}




module.exports = {
    GetTop100Data: GetTop100Data,
    GetHighestSingleTimeExpense: GetHighestSingleTimeExpense,
    GetTopPayeeByAmount: GetTopPayeeByAmount,
    GetTopPayeeByFrequency: GetTopPayeeByFrequency,
    GetMostExpensiveDay: GetMostExpensiveDay,
    GetTransactionStatistics: GetTransactionStatistics,
  };