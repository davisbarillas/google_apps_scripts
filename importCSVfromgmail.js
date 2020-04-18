function importCSVFromGmail() {
  var query = "";
  var threads = GmailApp.search(query);
  var message = threads[0].getMessages()[0];
  var attachment = message.getAttachments()[0];
  if (attachment.getContentType() === "text/csv") {
    var sheet = SpreadsheetApp.getActiveSheet();
    var csvData = Utilities.parseCsv(attachment.getDataAsString(), ",");
    sheet.clearContents().clearFormats();
    sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
  }
}
