# Contact email

The shared server-only module sends transactional mail through Brevo's `POST https://api.brevo.com/v3/smtp/email` endpoint using its `api-key` header. No SDK or browser-exposed key is needed. Reference: https://developers.brevo.com/reference/send-transac-email

## Configuration

1. Create a Brevo account and transactional API key.
2. Verify the sender/domain and add the authentication records Brevo provides; review existing SPF before editing rather than publishing multiple SPF records. Configure DKIM and a suitable DMARC policy.
3. Set `BREVO_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and a stable `CONTACT_FORM_SECRET` of at least 32 characters in each app's server environment.
4. Test using controlled inboxes before exposing forms publicly.

The business notification uses the verified sender and visitor reply-to. The acknowledgement uses the verified sender, targets the visitor, and uses the business inbox as reply-to. Subject fields are built from controlled branch/interest values. Names/emails reject control characters. HTML content escapes user input; the message permits normal line breaks and rejects unsafe controls. We do not fetch supplied website URLs.

## Submission flow

Native URL-encoded POST → exact-origin check → 24KB bounded body read → honeypot → signed token check (2 seconds to 1 hour) → field validation → replay/rate checks → notification → acknowledgement → 303 redirect. Brevo receives independent idempotency keys for notification and acknowledgement. Confirm provider idempotency behavior when upgrading or changing providers; in-memory replay state is not durable.

Status messages are server-rendered with field-specific errors and direct email fallback. Query strings contain only status and validated field names. Invalid values are not echoed or persisted: visitors are asked to re-enter details. A too-fast/expired form can be retried after re-entry. This favors privacy and minimal infrastructure over a durable form session.

If notification delivery is not confirmed, the page asks the visitor to email directly. Provider timeouts can be ambiguous; do not promise that a timed-out email was never delivered. If notification succeeds but acknowledgement fails, the page says the enquiry was sent and asks the visitor not to resubmit. Logs contain branch and an opaque reference, without API response bodies or submitted content. There is no durable acknowledgement retry queue today.

## Templates

`templates.ts` produces responsive HTML with inline styles, presentation tables, a semantic table for contact details, a plain-text alternative, web-safe fonts, and no images. Both formats work with images disabled. The visitor message is not copied into acknowledgement mail.

Test Gmail/Outlook/Apple Mail, narrow screens, long names/URLs, images disabled, and plain text. Check spam folders and the reply-to address. Use provider logs to distinguish accepted mail from delivered mail.

## Abuse and scaling

Per-process limits: 3 submissions per email hash/hour and 60 total/hour; maps have bounded size. Signed tokens, strict origins, honeypot, and body limits reduce abuse but do not prove visitor identity. An attacker may generate different emails or reach different instances. Set an edge IP/rate rule before production. Do not trust arbitrary `X-Forwarded-For`; use a hosting-verified signal if adding IP logic. CAPTCHA can be added as a server verification step before sending, if observed abuse warrants it. Use a shared store/queue for durable limits, retries, and replay handling at higher volume.
