const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");
const auth = require("./auth");

createProtectedWindow = () => {
  if (!auth.getCurrentAuthenticatedUser()) {
    createLoginWindow();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.setMenu(null);

  mainWindow.loadFile("renderers/index.html");
};

createLoginWindow = () => {
  const loginWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: false,
    },
  });
  loginWindow.setMenu(null);

  loginWindow.loadFile("renderers/login.html");
};

app.whenReady().then(() => {
  createProtectedWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createProtectedWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
