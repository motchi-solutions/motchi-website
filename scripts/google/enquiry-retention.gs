/* Motchi enquiry retention (Google Apps Script).

   Keeps the privacy policy's promise: enquiries that don't become projects
   are deleted from our inbox and calendar within 12 months of our last
   exchange. Runs daily in the Google Workspace account that receives
   enquiries and owns the booking calendar; reports go to that account.

   This file is the versioned copy. Edit it on GitHub, then paste it over the
   Apps Script project "Motchi Enquiries Retention". Setup, labels, filters
   and the trigger are described in README.md under "Enquiry retention".
   Needs the Google Calendar API advanced service, identifier "Calendar". */

const CONFIG = {
  enquiryLabel: "Enquiries",
  clientLabel: "Clients",
  // Only this site's subjects, so enquiries we send to other sites are left
  // alone. Website threads, labelled or not: notifications ("New enquiry - Motchi
  // ..."), replies to the acknowledgement ("We've received your enquiry -
  // Motchi ..."), and replies sent from the notification's Reply button
  // ("Your Motchi ... enquiry").
  enquirySubject:
    'subject:("new enquiry - Motchi" OR "received your enquiry - Motchi" OR "your Motchi Solutions enquiry" OR "your Motchi Websites enquiry" OR "your Motchi Consulting enquiry")',
  // The appointment schedule's exact title; \u2013 is its en dash.
  bookingTitle: "Free 30-Minute Intro Call \u2013 Motchi Solutions",
  calendarId: "primary",
  retentionMonths: 12,
  // true: email a report only. false: delete, then email what was deleted.
  reportOnly: true,
};

/** Daily trigger. Emails only when something is due. */
// biome-ignore lint/correctness/noUnusedVariables: called by the Apps Script trigger.
function cleanupOldEnquiries() {
  retain({
    months: CONFIG.retentionMonths,
    reportOnly: CONFIG.reportOnly,
    alwaysReport: false,
  });
}

/** Run by hand from the editor to check labels and client protection today:
    lists every unprotected enquiry and past booking, whatever its age.
    Deletes nothing. */
// biome-ignore lint/correctness/noUnusedVariables: run by hand in the Apps Script editor.
function previewAll() {
  retain({ months: 0, reportOnly: true, alwaysReport: true });
}

function retain({ months, reportOnly, alwaysReport }) {
  for (const name of [CONFIG.enquiryLabel, CONFIG.clientLabel]) {
    if (!GmailApp.getUserLabelByName(name))
      throw new Error(`Missing Gmail label: ${name}`);
  }
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const threads = oldEnquiryThreads(cutoff, months);
  const bookings = oldBookings(cutoff, months);
  if (!alwaysReport && threads.length === 0 && bookings.length === 0) return;

  if (!reportOnly) {
    for (const { thread } of threads) thread.moveToTrash();
    for (const { id } of bookings) {
      // sendUpdates "none": guests never get a cancellation email.
      Calendar.Events.remove(CONFIG.calendarId, id, { sendUpdates: "none" });
    }
  }
  sendReport(threads, bookings, months, reportOnly);
}

/* Enquiry threads whose latest message, sent or received, is older than the
   cutoff. Pages through results; one search returns at most 500 threads. */
function oldEnquiryThreads(cutoff, months) {
  const query =
    `{label:${CONFIG.enquiryLabel} ${CONFIG.enquirySubject}} ` +
    `-label:${CONFIG.clientLabel}` +
    (months ? ` older_than:${months}m` : "");
  const found = [];
  for (let start = 0; ; start += 100) {
    const page = GmailApp.search(query, start, 100);
    for (const thread of page) {
      const lastActivity = thread.getLastMessageDate();
      if (lastActivity < cutoff)
        found.push({
          thread,
          lastActivity,
          subject: thread.getFirstMessageSubject(),
        });
    }
    if (page.length < 100) return found;
  }
}

/* Booked intro calls that ended before the cutoff. A booking is kept while
   any guest has a thread labelled as a client, or has emailed with us within
   the retention period. */
function oldBookings(cutoff, months) {
  const found = [];
  let pageToken;
  do {
    const page = Calendar.Events.list(CONFIG.calendarId, {
      q: CONFIG.bookingTitle,
      timeMax: cutoff.toISOString(),
      singleEvents: true,
      maxResults: 250,
      pageToken,
    });
    for (const event of page.items || []) {
      if (!(event.summary || "").startsWith(CONFIG.bookingTitle)) continue;
      const end = new Date(event.end.dateTime || event.end.date);
      if (end >= cutoff) continue;
      const guests = (event.attendees || [])
        .filter((guest) => !guest.self && !guest.resource && guest.email)
        .map((guest) => guest.email.toLowerCase());
      if (guests.some((email) => keepGuest(email, months))) continue;
      found.push({ id: event.id, summary: event.summary, end });
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return found;
}

function keepGuest(email, months) {
  // Calendar guests type their own address; anything unusual cannot reach a
  // Gmail query, and its booking is kept rather than guessed at.
  if (!/^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return true;
  const withThem = `{from:"${email}" to:"${email}" cc:"${email}"}`;
  if (GmailApp.search(`label:${CONFIG.clientLabel} ${withThem}`, 0, 1).length)
    return true;
  return (
    months > 0 &&
    GmailApp.search(`${withThem} newer_than:${months}m`, 0, 1).length > 0
  );
}

function sendReport(threads, bookings, months, reportOnly) {
  const day = (date) =>
    Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const preview = months === 0;
  const age = preview
    ? "any age (preview)"
    : `no activity for ${months} months`;
  const outcome = !reportOnly
    ? "Threads were moved to Gmail Trash and bookings to Calendar Trash (both emptied after 30 days). Guests were not notified."
    : preview
      ? `PREVIEW: nothing was deleted. Everything listed would be deleted once it reaches ${CONFIG.retentionMonths} months without activity. Anything that should be kept needs the "${CONFIG.clientLabel}" label.`
      : "REPORT-ONLY MODE: nothing was deleted. Set reportOnly to false to delete.";
  const lines = [
    `Enquiry threads, ${age}, not labelled "${CONFIG.clientLabel}" (${threads.length}):`,
    ...threads.map((t) => `- ${day(t.lastActivity)} | ${t.subject}`),
    "",
    `Call bookings, ${age}, no client label or recent email (${bookings.length}):`,
    ...bookings.map((b) => `- ${day(b.end)} | ${b.summary}`),
    "",
    outcome,
  ];
  const kind = preview ? "preview" : reportOnly ? "report" : "cleanup";
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: `[Motchi] Retention ${kind}: ${threads.length} thread(s), ${bookings.length} booking(s)`,
    body: lines.join("\n"),
  });
}
