const { contextBridge } = require("electron");
const { registerUser, authenticateUser } = require("./auth");
const excelHandler = require("./ExcelHandler");
const dashboardDataHandler = require("./DashboardDataHandler");
const DashboardDataHandler = require("./DashboardDataHandler");

contextBridge.exposeInMainWorld("api", {
  registerUser: (data) => {
    try {
      registerUser(data.username, data.password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  loginUser: (data) => {
    const user = authenticateUser(data.username, data.password);
    if (user) {
      return { success: true, username: user.Username, userid: user.id };
    }
    return { success: false };
  },
  getCurrentAuthenticatedUser: () => auth.getCurrentAuthenticatedUser(),
  logoutAndReturnNullUser: () => auth.logoutAndReturnNullUser(),
  ParseExcelAndSave: (file) => excelHandler.ParseExcelAndSave(file),
  GetTop100Data: (filterObject) => dashboardDataHandler.GetTop100Data(filterObject),
  GetHighestSingleTimeExpense: (filterObject) => dashboardDataHandler.GetHighestSingleTimeExpense(filterObject),
  GetTopPayeeByAmount: (filterObject) => dashboardDataHandler.GetTopPayeeByAmount(filterObject),
  GetTopPayeeByFrequency: (filterObject) => dashboardDataHandler.GetTopPayeeByFrequency(filterObject),
  GetMostExpensiveDay: (filterObject) => DashboardDataHandler.GetMostExpensiveDay(filterObject),
  GetTransactionStatistics: (filterObject) => DashboardDataHandler.GetTransactionStatistics(filterObject),
  GetPast365DailyBalances: (filterObject) => DashboardDataHandler.GetPast365DailyBalances(filterObject),
  GetPast365DailyDebits: (filterObject) => DashboardDataHandler.GetPast365DailyDebits(filterObject),
});
