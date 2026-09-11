/**
 * PhenoWorks contact form — Google Apps Script backend.
 *
 * Appends each submission from https://phenoworks.org/contact as a row in a
 * Google Sheet. Nothing is emailed to an individual; the sheet is the inbox.
 *
 * ── ONE-TIME SETUP ─────────────────────────────────────────────────────────
 *
 * Do all of this while signed in as phenoworks.tamu@gmail.com. Whoever creates
 * the sheet OWNS it — creating it under a personal account and sharing later
 * leaves the data tied to that person.
 *
 *  1. Create a new Google Sheet named "PhenoWorks contact form".
 *  2. In that sheet: Extensions → Apps Script. Delete the placeholder code and
 *     paste this whole file in. Save.
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:  contact form
 *       Execute as:   Me (phenoworks.tamu@gmail.com)
 *       Who has access: Anyone            ← required; "Anyone with Google
 *                                            account" blocks anonymous visitors
 *  4. Click Deploy and authorise when prompted. Google will warn that the app
 *     is unverified — that is expected for your own script. Advanced → Go to
 *     project.
 *  5. Copy the Web app URL. It looks like:
 *       https://script.google.com/macros/s/AKfy.../exec
 *  6. Paste it into CONTACT_ENDPOINT in src/pages/contact.tsx.
 *  7. Share the SHEET (not the script) with the other devs as Editors.
 *
 * After ANY edit to this file you must Deploy → Manage deployments → edit →
 * Version: New version → Deploy. Saving alone does not update the live URL.
 *
 * ── NOTES ──────────────────────────────────────────────────────────────────
 *
 * The endpoint URL is public — it ships in the site's JavaScript, and that is
 * unavoidable on a static site. It is not a secret and grants nothing beyond
 * appending a row here. The guards below (honeypot, minimum fill time, length
 * caps) stop ordinary bots. If you ever get flooded, add reCAPTCHA or move to
 * a form service; do not bother obfuscating the URL.
 */

/** Tab within the spreadsheet that receives submissions. */
const SHEET_NAME = 'Messages';

/** Reject submissions completed faster than a human plausibly could (ms). */
const MIN_FILL_MS = 2500;

/** Guard rails so a bad actor cannot write a novel into the sheet. */
const MAX_LENGTHS = {name: 120, email: 200, message: 5000};

/**
 * Handle a POST from the website's contact form.
 *
 * @param {GoogleAppsScript.Events.DoPost} e - The request event.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON result.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ok: false, error: 'Empty request.'});
    }

    const data = JSON.parse(e.postData.contents);

    // Honeypot: a real browser leaves this hidden field empty. Answer OK so a
    // bot has no signal that it was caught.
    if (data.website) {
      return jsonResponse({ok: true});
    }

    // Bots submit instantly; people take a few seconds to type.
    const elapsed = Number(data.elapsedMs);
    if (!isFinite(elapsed) || elapsed < MIN_FILL_MS) {
      return jsonResponse({ok: true});
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();

    if (!name || !email || !message) {
      return jsonResponse({ok: false, error: 'Please fill in every field.'});
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResponse({ok: false, error: 'That email address looks wrong.'});
    }
    if (
      name.length > MAX_LENGTHS.name ||
      email.length > MAX_LENGTHS.email ||
      message.length > MAX_LENGTHS.message
    ) {
      return jsonResponse({ok: false, error: 'That message is too long.'});
    }

    appendRow([new Date(), name, email, message]);
    return jsonResponse({ok: true});
  } catch (error) {
    // Never echo the raw error to the browser; log it for the sheet owner.
    console.error(error);
    return jsonResponse({ok: false, error: 'Could not save your message.'});
  }
}

/**
 * Append a row, creating the sheet and its header on first use.
 *
 * A lock serialises concurrent submissions, which would otherwise be able to
 * resolve to the same last row and overwrite each other.
 *
 * @param {Array<string|Date>} row - Cell values, left to right.
 */
function appendRow(row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Serialise a result as a JSON response.
 *
 * @param {Object} payload - The object to send back.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON output.
 */
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Visiting the web app URL in a browser lands here. Kept friendly so a curious
 * visitor sees a sentence rather than an error page.
 *
 * @returns {GoogleAppsScript.Content.TextOutput} A plain-text note.
 */
function doGet() {
  return ContentService.createTextOutput(
    'PhenoWorks contact form endpoint. Submit the form at https://phenoworks.org/contact',
  );
}
