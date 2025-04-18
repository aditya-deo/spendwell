const GetTop100Transactions =  async (filterObject)=>{
    const response = await api.GetTop100Data(filterObject);
    if(response.success){
        var tbody = document.getElementById("tblLatest100Transactions").getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";
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

const GetLineChart = (filterObject) => {

    var ctx = document.getElementById("dvLineChart").getContext("2d");
    var response = api.GetPast365DailyBalances(filterObject);
    if(response.success){
        const data = {
            labels: response.data.date,
            datasets: [{
                label: "Balance",
                data: response.data.balance, 
                borderColor: "green",
                backgroundColor: "rgba(125, 255, 136, 0.2)",
                fill: true,
                tension: 0.3  
            }]
        };
        let chartStatus = Chart.getChart("dvLineChart"); // <canvas> id
        if (chartStatus != undefined) {
        chartStatus.destroy();
        }
        const myChart = new Chart(ctx, {
            type: "line",  
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }  
                }
            }
        });
    }
}

const GetLineChart2 = (filterObject) => {

    var ctx = document.getElementById("dvLineChart2").getContext("2d");
    var response = api.GetPast365DailyDebits(filterObject);
    if(response.success){
        const data = {
            labels: response.data.date,
            datasets: [{
                label: "Debit",
                data: response.data.debit, 
                borderColor: "red",
                backgroundColor: "rgba(255, 148, 148, 0.2)",
                fill: true,
                tension: 0.3  
            }]
        };
        let chartStatus = Chart.getChart("dvLineChart2"); // <canvas> id
        if (chartStatus != undefined) {
        chartStatus.destroy();
        }
        const myChart = new Chart(ctx, {
            type: "line",  
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }  
                }
            }
        });
    }
}

const getHighestSingleTimeExpense = async (filterObject) => {
    const response = await api.GetHighestSingleTimeExpense(filterObject);
    if(response.success){
        document.getElementById("headerHighestSingleTimeExpense").innerText = `Rs. ${GetDisplayString(response.data.highestSingleTimeExpense)}`;
    }
}

const getTopPayeeByAmount = async (filterObject) => {
    const response = await api.GetTopPayeeByAmount(filterObject);
    if(response.success){
        document.getElementById("headerTopPayeeByAmount").innerText =  `${GetDisplayString(response.data.Payee)}, Rs. ${GetDisplayString(response.data.TotalAmount)}`;
    }
}

const getTopPayeeByFrequency = async (filterObject) => {
    const response = await api.GetTopPayeeByFrequency(filterObject);
    if(response.success){
        document.getElementById("headerTopPayeeByFrequency").innerText =  `${GetDisplayString(response.data.Payee)}, ${GetDisplayString(response.data.TotalCount)} times`;
    }
}

const getMostExpensiveDay = async (filterObject) => {
    const response = await api.GetMostExpensiveDay(filterObject);
    if(response.success){
        document.getElementById("headerMostExpensiveDay").innerText =  `${GetDisplayString(response.data.TransactionDate)}, Rs. ${GetDisplayString(response.data.expenseOnThatDate)}`;
    }
}


const getTransactionStatistics = async (filterObject) => {
    const response = await api.GetTransactionStatistics(filterObject);
    if(response.success){
        document.getElementById("tdTotalTransactions").innerText =  `${GetDisplayString(response.data.totalTransactions)}`;
        document.getElementById("tdAvgTransactionsPerDay").innerText =  `${GetDisplayString(response.data.avgTransactionsPerDay.toFixed(2))}`;
        document.getElementById("tdTotalExpenditure").innerText =  `Rs. ${GetDisplayString(response.data.totalExpenditure.toFixed(2))}`;
        document.getElementById("tdAvgExpenditurePerDay").innerText =  `Rs. ${GetDisplayString(response.data.avgExpenditurePerDay.toFixed(2))}`;
    }
}


const loadDashboard = (filterObject) => {
    GetTop100Transactions(filterObject);
    // GetPieChart();
    GetLineChart(filterObject);
    getHighestSingleTimeExpense(filterObject);
    getTopPayeeByAmount(filterObject);
    getTopPayeeByFrequency(filterObject);
    getMostExpensiveDay(filterObject);
    getTransactionStatistics(filterObject);
    GetLineChart2(filterObject);
}


const GetDisplayString = (str) => {
    if(str)return str;
    else return "-";
}


document.getElementById("btnFilter").addEventListener("click", (e)=>{
    e.preventDefault();
    var filterObject = {};
    if(document.getElementById("inpDateFrom").value.trim()) filterObject.inpDateFrom = document.getElementById("inpDateFrom").value.trim();
    if(document.getElementById("inpDateTo").value.trim()) filterObject.inpDateTo = document.getElementById("inpDateTo").value.trim() + "T23:59:59";
    if(document.getElementById("inpTextPayee").value.trim()) filterObject.inpTextPayee = document.getElementById("inpTextPayee").value.trim();
    if(document.getElementById("inpNumberOver").value.trim()) filterObject.inpNumberOver = document.getElementById("inpNumberOver").value.trim();
    if(document.getElementById("inpNumberUnder").value.trim()) filterObject.inpNumberUnder = document.getElementById("inpNumberUnder").value.trim();
    loadDashboard(filterObject);
})


loadDashboard({});