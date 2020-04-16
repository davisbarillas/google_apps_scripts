var incomingWebhookUrl = 'https://hooks.slack.com/services/YOUR-URL-HERE';
var postChannel = "YOUR-CHANNEL-HERE";
var postIcon = ":mailbox_with_mail:";
var postUser = "Form Response";
var postColor = "#00B1AC";
var messageFallback = "The attachment must be viewed as plain text.";
var messagePretext = "A user submitted a response to the form.";

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
    "channel": postChannel,
    "username": postUser,
    "icon_emoji": postIcon,
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

var getColumnNames = function() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headerRow = sheet.getRange("1:1");
  var headerRowValues = headerRow.getValues()[0];
  return headerRowValues;
}

var createAttachments = function(values) {
  var fields = makeArrayOfSlackFields(values);
  var attachments = [{
    "fallback" : messageFallback,
    "pretext" : messagePretext,
    "mrkdwn_in" : ["pretext"],
    "color" : postColor,
    "fields" : fields
  }]
  return attachments;
}