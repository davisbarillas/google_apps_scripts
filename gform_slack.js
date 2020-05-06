var incomingWebhookUrl = '';

function initialize() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i in triggers) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger("postValuesToSlack")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
}

function postValuesToSlack(e) {
  var attachments = createAttachments(e.values);
  var payload = {
    "channel": "G013GS3UAFK",
    "username": "Form Response",
    "icon_emoji": ":mailbox_with_mail:",
    "link_names": 1,
    "attachments": attachments
  };
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };
  var response = UrlFetchApp.fetch(incomingWebhookUrl, options);
}

var makeFieldForMessage = function(question, answer) {
  var field = {
    "title" : question,
    "value" : answer,
    "short" : false
  };
  return field;
}

var getColumnNames = function() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headerRow = sheet.getRange("1:1");
  var headerRowValues = headerRow.getValues()[0];
  return headerRowValues;
}

var makeArrayOfSlackFields = function(values) {
  var fields = [];
  var columnNames = getColumnNames();
  for (var i = 0; i < columnNames.length; i++) {
    var colName = columnNames[i];
    var val = values[i];
    fields.push(makeFieldForMessage(colName, val));
  }
  return fields;
}

var createAttachments = function(values) {
  var fields = makeArrayOfSlackFields(values);
  var attachments = [{
    "fallback" : "The attachment must be viewed as plain text.",
    "pretext" : "A user submitted a response to the form.",
    "mrkdwn_in" : ["pretext"],
    "color" : "#00B1AC",
    "fields" : fields
  }]
  return attachments;
}