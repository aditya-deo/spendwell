const xlsx = require("node-xlsx");
const fs = require("fs");
const db = require("./database");

const ParseExcelAndSave = (file) => {
  try {
    // Parse the Excel file buffer
    const workbook = xlsx.parse(file.buffer);
    const success = ProcessWorkbookData(workbook);
    return { success: success, message: "File processed successfully!" };
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    return { success: false, message: error.message };
  }
};

const ProcessWorkbookData = (workbook) => {
  var workbookdata = workbook[0].data;
  console.log(workbookdata);
  var headerRow = workbookdata.findIndex(
    (row) =>
      row[0] == "Date" &&
      row[1] == "Particulars" &&
      row[2] == "Chq No." &&
      row[3] == "Debit" &&
      row[4] == "Credit" &&
      row[5] == "Balance"
  );
  var insertresult = PrepareTransactionSaveQuery(
    workbookdata,
    headerRow + 2,
    workbookdata.length
  );
  return insertresult;
};

const PrepareTransactionSaveQuery = (data, start, end) => {
  try {
    const stmt = db.prepare(
      "SELECT MAX(TransactionDate) AS MaxDate from Transactions;"
    );
    const maxdate = stmt.get().MaxDate;
    const dateToCompare = maxdate
      ? new Date(maxdate)
      : new Date("1999-01-01T00:00:00.000Z");
    const insertStmt = db.prepare(
      "INSERT INTO TRANSACTIONS (TransactionDate, Particulars, Debit, Credit, Balance, Username, CreatedDateTime) VALUES (?, ?, ?, ?, ?, ?, DateTime())"
    );

    const insertTransaction = db.transaction(() => {
      for (let i = start; i < end; i++) {
        let date = new Date(data[i][0]);
        date.setHours(23, 0, 0, 0); //jugaad
        if (date > dateToCompare) {
          insertStmt.run(
            date.toISOString(),
            data[i][1],
            data[i][3],
            data[i][4],
            data[i][5],
            sessionStorage.getItem("username")
          );
        }
      }
    });

    insertTransaction();
    return true;
  } catch (err) {
    alert("Error saving data!");
    return false;
  }
};

module.exports = {
  ParseExcelAndSave: ParseExcelAndSave,
};
