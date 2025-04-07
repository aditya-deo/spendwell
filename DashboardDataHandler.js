const db = require("./database");

const GetTop100Data = (filterObject)=>{
    try{
        const username = sessionStorage.getItem("username");
        
        const st = `SELECT * FROM TRANSACTIONS WHERE Username = '${username}'
            ORDER BY ID DESC LIMIT 100;` 
        const stmt = db.prepare(st);
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
                COUNT(ID) / cast(max(julianday(transactiondate)) - min(julianday(transactiondate)) + 1 as real) AS avgTransactionsPerDay,
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

const GetPast365DailyBalances = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT  max(Balance) as balance, date( TransactionDate) as date
            from Transactions WHERE Username = '${username}' group by date 
            order by date limit 365;`
        );
        const data = stmt.all();

        const balance = [];
        const date = [];
        data.forEach((d)=>{
            balance.push(d.balance);
            date.push(d.date);
        })
        return {success:true, data:{balance: balance, date: date}};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetPast365DailyDebits = () => {
    try{
        const username = sessionStorage.getItem("username");
        const stmt = db.prepare(
            `SELECT  sum(Debit) as debit, date( TransactionDate) as date
            from Transactions WHERE Username = '${username}' group by date 
            order by date limit 365;`
        );
        const data = stmt.all();

        const debit = [];
        const date = [];
        data.forEach((d)=>{
            debit.push(d.debit);
            date.push(d.date);
        })
        return {success:true, data:{debit: debit, date: date}};
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
    GetPast365DailyBalances: GetPast365DailyBalances,
    GetPast365DailyDebits: GetPast365DailyDebits,
  };