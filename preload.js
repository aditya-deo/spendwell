const { contextBridge } = require("electron");
const { registerUser, authenticateUser } = require("./auth");
const excelHandler = require("./ExcelHandler");

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
});
