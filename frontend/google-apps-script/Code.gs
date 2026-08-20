/**
 * HiveMind 2026 — Google Apps Script Backend with Anti-Duplicate Protection
 * 
 * FEATURES:
 * 1. Checks for duplicate Personal Email, College Email, or Phone Number
 * 2. Prevents duplicate rows in Google Sheets
 * 3. Supports live GET pre-flight duplicate checking
 */

var SPREADSHEET_ID = ""; // Optional if script is created inside Google Sheet

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = null;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {}

    if (!ss && SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }

    if (!ss) {
      throw new Error("No active Google Sheet found!");
    }

    var sheet = ss.getSheetByName("Registrations") || ss.getSheets()[0];

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Submission ID",
        "Full Name",
        "Personal Email",
        "College Email",
        "Registration / Roll No",
        "Trade / Branch",
        "Phone Number",
        "College Name",
        "Degree Program",
        "Batch Year",
        "Selected Event"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#00CFFF").setFontColor("#050607");
    }

    var data = {};
    if (e && e.parameter) {
      data = e.parameter;
    }
    if (e && e.postData && e.postData.contents) {
      try {
        var jsonParsed = JSON.parse(e.postData.contents);
        for (var key in jsonParsed) data[key] = jsonParsed[key];
      } catch (err) {}
    }

    var emailId = (data.emailId || "").toString().trim().toLowerCase();
    var collegeEmailId = (data.collegeEmailId || "").toString().trim().toLowerCase();
    var phoneNumber = (data.phoneNumber || "").toString().replace(/\D/g, "");

    // --- DUPLICATE CHECK LOGIC ---
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Get all existing rows (Columns: A:1, B:2, C:3, D:4[emailId], E:5[collegeEmailId], F:6, G:7, H:8[phoneNumber])
      var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

      for (var i = 0; i < values.length; i++) {
        var rowEmail = (values[i][3] || "").toString().trim().toLowerCase();
        var rowCollegeEmail = (values[i][4] || "").toString().trim().toLowerCase();
        var rowPhone = (values[i][7] || "").toString().replace(/\D/g, "");

        // Match against Personal Email
        if (emailId && (rowEmail === emailId || rowCollegeEmail === emailId)) {
          return ContentService
            .createTextOutput(JSON.stringify({
              result: "duplicate",
              error: "Personal Email (" + data.emailId + ") has already registered!"
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }

        // Match against College Email
        if (collegeEmailId && (rowEmail === collegeEmailId || rowCollegeEmail === collegeEmailId)) {
          return ContentService
            .createTextOutput(JSON.stringify({
              result: "duplicate",
              error: "College Email (" + data.collegeEmailId + ") has already registered!"
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }

        // Match against Phone Number
        if (phoneNumber && phoneNumber.length >= 7 && rowPhone === phoneNumber) {
          return ContentService
            .createTextOutput(JSON.stringify({
              result: "duplicate",
              error: "Phone Number (" + data.phoneNumber + ") has already registered!"
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    // --- END DUPLICATE CHECK LOGIC ---

    var timestamp = new Date();
    var submissionId = data.submissionId || ("HM26-" + Math.floor(100000 + Math.random() * 900000));

    // Append unique row to sheet
    sheet.appendRow([
      timestamp,
      submissionId,
      data.name || "",
      data.emailId || "",
      data.collegeEmailId || "",
      data.regNo || "",
      data.trade || "",
      data.phoneNumber || "",
      data.college || "",
      data.degree || "",
      data.batchYear || "",
      data.selectedEvent || "All Events / General Pass"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        submissionId: submissionId,
        message: "Recorded successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action;
    
    if (action === "checkDuplicate") {
      var ss = null;
      try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch(err) {}
      if (!ss && SPREADSHEET_ID) ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      
      if (ss) {
        var sheet = ss.getSheetByName("Registrations") || ss.getSheets()[0];
        var lastRow = sheet.getLastRow();
        
        var checkEmail = (e.parameter.emailId || "").toString().trim().toLowerCase();
        var checkCollegeEmail = (e.parameter.collegeEmailId || "").toString().trim().toLowerCase();
        var checkPhone = (e.parameter.phoneNumber || "").toString().replace(/\D/g, "");

        if (lastRow > 1) {
          var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
          for (var i = 0; i < values.length; i++) {
            var rowEmail = (values[i][3] || "").toString().trim().toLowerCase();
            var rowCollegeEmail = (values[i][4] || "").toString().trim().toLowerCase();
            var rowPhone = (values[i][7] || "").toString().replace(/\D/g, "");

            if (checkEmail && (rowEmail === checkEmail || rowCollegeEmail === checkEmail)) {
              return ContentService.createTextOutput(JSON.stringify({ isDuplicate: true, field: "Personal Email", message: "Personal Email is already registered." })).setMimeType(ContentService.MimeType.JSON);
            }
            if (checkCollegeEmail && (rowEmail === checkCollegeEmail || rowCollegeEmail === checkCollegeEmail)) {
              return ContentService.createTextOutput(JSON.stringify({ isDuplicate: true, field: "College Email", message: "College Email is already registered." })).setMimeType(ContentService.MimeType.JSON);
            }
            if (checkPhone && checkPhone.length >= 7 && rowPhone === checkPhone) {
              return ContentService.createTextOutput(JSON.stringify({ isDuplicate: true, field: "Phone Number", message: "Phone Number is already registered." })).setMimeType(ContentService.MimeType.JSON);
            }
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ isDuplicate: false })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {}

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "HiveMind 2026 Anti-Duplicate Web App is online."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
