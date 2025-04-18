const db = require("./database");

const GetTop100Data = (filterObject)=>{
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT * FROM TRANSACTIONS WHERE Username = '${username}' `
        if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
        if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
        if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
        if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
        if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
        st+=`ORDER BY ID DESC LIMIT 100;` 
        const stmt = db.prepare(st);
        var data = stmt.all();
        if(!data) data = [];
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}


const GetHighestSingleTimeExpense = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT max(Debit) as highestSingleTimeExpense FROM TRANSACTIONS WHERE Username = '${username}' `
        if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
        if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
        if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
        if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
        if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
        const stmt = db.prepare(
            st
        );
        var data = stmt.get();
        if(!data) data = {};
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTopPayeeByAmount = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT 
                SUBSTRING(Particulars, 21, 10) AS Payee,
                SUM(Debit) AS TotalAmount
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%' 
            AND Username = '${username}' `
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
            st += `GROUP BY Payee
            ORDER BY TotalAmount DESC
            LIMIT 1;`
        const stmt = db.prepare(
            st
        );
        var data = stmt.get();
        if(!data) data = {};
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTopPayeeByFrequency = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT 
                SUBSTRING(Particulars, 21, 10) AS Payee,
                count(SUBSTRING(Particulars, 21, 10)) AS TotalCount
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%' 
            AND Username = '${username}' `
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
            st += `GROUP BY Payee
            ORDER BY TotalCount DESC
            LIMIT 1;`
        const stmt = db.prepare(
            st
        );
        var data = stmt.get();
        if(!data) data = {};
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetMostExpensiveDay = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT 
                DATE(TransactionDate) as TransactionDate, 
                SUM(debit) as expenseOnThatDate
            FROM Transactions
            WHERE Debit IS NOT NULL  
            AND Particulars LIKE 'UPI%'
            AND Username = '${username}' `
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
            st+=`GROUP BY TransactionDate
            Order by expenseOnThatDate DESC
            LIMIT 1;`
        const stmt = db.prepare(
            st
        );
        var data = stmt.get();
        if(!data) data = {};
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetTransactionStatistics = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT IFNULL(COUNT(ID), 0) as totalTransactions, 
                IFNULL(COUNT(ID) / cast(max(julianday(transactiondate)) - min(julianday(transactiondate)) + 1 as real), 0) AS avgTransactionsPerDay,
                IFNULL(SUM(DEBIT) / COUNT(DISTINCT(transactiondate)), 0) as avgExpenditurePerDay, 
                IFNULL(SUM(DEBIT), 0) as totalExpenditure 
                from Transactions
            WHERE Username = '${username}'`
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
        const stmt = db.prepare(
            st
        );
        var data = stmt.get();
        if(!data) data = {};
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}

const GetPast365DailyBalances = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT  max(Balance) as balance, date( TransactionDate) as date
            from Transactions WHERE Username = '${username}'`;
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
            st += `group by date 
            order by date limit 365;`
        const stmt = db.prepare(
            st
        );
        var data = stmt.all();

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

const GetPast365DailyDebits = (filterObject) => {
    try{
        const username = sessionStorage.getItem("username");
        var st = `SELECT  sum(Debit) as debit, date( TransactionDate) as date
            from Transactions WHERE Username = '${username}'`;
            if(filterObject.inpDateFrom) st += `AND TransactionDate >= '${new Date(filterObject.inpDateFrom).toISOString()}' `
            if(filterObject.inpDateTo) st +=  `AND TransactionDate <= '${new Date(filterObject.inpDateTo).toISOString()}' `
            if(filterObject.inpTextPayee) st += `AND SUBSTRING(Particulars, 21, 10) LIKE '${filterObject.inpTextPayee}%' `
            if(filterObject.inpNumberOver) st += `AND Debit >= '${filterObject.inpNumberOver}' `
            if(filterObject.inpNumberUnder) st += `AND Debit <= '${filterObject.inpNumberUnder}' `
            st += `group by date 
            order by date limit 365;`
        const stmt = db.prepare(
            st
        );
        var data = stmt.all();

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