const GetTop100Transactions =  async ()=>{
    const response = await api.GetTop100Data();
    if(response.success){
        var tbody = document.getElementById("tblLatest100Transactions").getElementsByTagName("tbody")[0];
        response.data.forEach(element => {
            const tr = `
            <tr id=${element.ID}>
                <td>${element.ID}</td>
                <td>${element.TransactionDate ? element.TransactionDate.split("T")[0] : "Date not available"}</td>
                <td>${element.Particulars}</td>
                <td>${element.Credit ? element.Credit : 0}</td>
                <td>${element.Debit ? element.Debit : 0}</td>
                <td>${element.Balance}</td>
            </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", tr);
        });
    }
}

const GetPieChart = () => {
    // Get the canvas element
    var ctx = document.getElementById("dvPieChart").getContext("2d");

    // Sample financial data (stock prices)
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "Stock Price ($)",
            data: [120, 135, 110, 140, 150, 160], // Sample values
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            fill: true,
            tension: 0.3  // Smooth curve
        }]
    };

    // Create the chart
    const myChart = new Chart(ctx, {
        type: "pie",  // Types: 'bar', 'line', 'pie', 'doughnut', etc.
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }  // Show dataset labels
            }
        }
    });

}

const GetLineChart = () => {
    // Get the canvas element
    var ctx = document.getElementById("dvLineChart").getContext("2d");

    // Sample financial data (stock prices)
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "Stock Price ($)",
            data: [120, 135, 110, 140, 150, 160], // Sample values
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            fill: true,
            tension: 0.3  // Smooth curve
        }]
    };

    // Create the chart
    const myChart = new Chart(ctx, {
        type: "line",  // Types: 'bar', 'line', 'pie', 'doughnut', etc.
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }  // Show dataset labels
            }
        }
    });

}

const getHighestSingleTimeExpense = async () => {
    const response = await api.GetHighestSingleTimeExpense();
    if(response.success){
        document.getElementById("headerHighestSingleTimeExpense").innerText = `Rs. ${response.data.highestSingleTimeExpense}`;
    }
}

const getTopPayeeByAmount = async () => {
    const response = await api.GetTopPayeeByAmount();
    if(response.success){
        document.getElementById("headerTopPayeeByAmount").innerText =  `${response.data.Payee}, Rs. ${response.data.TotalAmount}`;
    }
}

const getTopPayeeByFrequency = async () => {
    const response = await api.GetTopPayeeByFrequency();
    if(response.success){
        document.getElementById("headerTopPayeeByFrequency").innerText =  `${response.data.Payee}, ${response.data.TotalCount} times`;
    }
}

const getMostExpensiveDay = async () => {
    const response = await api.GetMostExpensiveDay();
    if(response.success){
        document.getElementById("headerMostExpensiveDay").innerText =  `${response.data.TransactionDate}, Rs. ${response.data.expenseOnThatDate}`;
    }
}


const getTransactionStatistics = async () => {
    const response = await api.GetTransactionStatistics();
    if(response.success){
        document.getElementById("tdTotalTransactions").innerText =  `${response.data.totalTransactions}`;
        document.getElementById("tdAvgTransactionsPerDay").innerText =  `${response.data.avgTransactionsPerDay}`;
        document.getElementById("tdTotalExpenditure").innerText =  `Rs. ${response.data.totalExpenditure.toFixed(2)}`;
        document.getElementById("tdAvgExpenditurePerDay").innerText =  `Rs. ${response.data.avgExpenditurePerDay.toFixed(2)}`;
    }
}

GetTop100Transactions();
GetPieChart();
GetLineChart();
getHighestSingleTimeExpense();
getTopPayeeByAmount();
getTopPayeeByFrequency();
getMostExpensiveDay();
getTransactionStatistics();