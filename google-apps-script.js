/**
 * 名單收集 Google Apps Script
 * ───────────────────────────────────────────────
 * 用途：接收網站表單送來的資料，自動寫入 Google Sheet。
 *
 * 設定步驟：
 * 1. 開一個新的 Google 試算表（Google Sheet）。
 * 2. 上方選單：擴充功能 → Apps Script。
 * 3. 把這整段程式碼貼進去，取代原本的內容，存檔。
 * 4. 右上角「部署」→「新增部署作業」→ 類型選「網頁應用程式」。
 *    - 執行身分：我
 *    - 誰可以存取：任何人
 * 5. 部署後會得到一個網址（https://script.google.com/macros/s/.../exec）
 *    把它填到 Vercel 的環境變數 GOOGLE_SCRIPT_URL。
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);

    // 第一次執行時自動建立標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["時間", "姓名", "手機", "LINE ID", "備註", "來源"]);
    }

    sheet.appendRow([
      data.timestamp || new Date(),
      data.name || "",
      data.phone || "",
      data.line || "",
      data.note || "",
      data.source || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
