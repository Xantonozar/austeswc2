# Fix: Panel credential emails not delivered (Brevo sender unverified)

## Context
- A credential email was sent via Brevo to **Salman Ahmed Zadid** (Senior Sub Executive, Web Development) at `salman.00724105081197@aust.edu`. Brevo accepted it (returned a `messageId`) but it was never received.
- User confirmed **no emails from this app are ever delivered** → systemic sender problem, not a single bad address.
- Root cause hypothesis: the Brevo sender `zadidsalman@gmail.com` (hardcoded in `lib/brevo.js` at lines 30, 97, 162, 224) is **not a verified sender / the sending domain is not authenticated** in Brevo. Brevo's relay (`mailin.fr`) drops or quarantines such mail. The API key itself is valid (the call returned `messageId`, not a 401).
- Recipient address is confirmed by the user as `salman.00724105081197@aust.edu`.

## Goals
1. Make the Brevo sender verified/authenticated so **all** app emails deliver.
2. Send the credential letter to Salman at `salman.00724105081197@aust.edu` (username `salmanzadid`, password `austeswc123`).
3. Make future sends observable and keep recipient data consistent.

## Steps (for implementation agent)
1. **Diagnose in Brevo dashboard** (https://app.brevo.com):
   - `Settings → Senders & IP → Senders`: confirm `zadidsalman@gmail.com` verification status.
   - `Settings → Sending IP & Domains / Domains`: check whether any sending domain has SPF/DKIM authenticated.
2. **Fix the sender** (pick one):
   - **Recommended:** Authenticate a domain you control in Brevo (e.g. `austeswc.org` or `aust.edu`) and create a verified sender such as `noreply@austeswc.org`.
   - Or: add `zadidsalman@gmail.com` as a sender and click the verification link in that Gmail inbox (only if you have access to it).
3. **Update `lib/brevo.js`:** replace the 4 hardcoded `sender: { name: "AUSTESWC", email: "zadidsalman@gmail.com" }` entries with the verified sender. Introduce a single `SENDER` constant to avoid future drift.
4. **Re-send the credential email** to Salman (`salman.00724105081197@aust.edu`) with the professional letter already drafted (username `salmanzadid`, password `austeswc123`).
5. **Consistency fix:** update the `admins` record for Salman so its `email` = `salman.00724105081197@aust.edu` (currently the placeholder `salmanzadid@austeswc.com`), so future lookups send to the correct address.
6. **(Optional) Add a `sentEmails` log collection:** store `to`, `subject`, `brevoMessageId`, `timestamp`, `status`. Consider a Brevo webhook for bounce/complaint tracking.

## Validation
- Send a test email to a known-good address you control (e.g. `austeswc@aust.edu`) and confirm it lands in the inbox (not spam).
- Confirm Salman's credential email is received at `salman.00724105081197@aust.edu`.
- Verify other app emails (competition registration, selection, payment) now deliver.

## Risks / Notes
- Verifying a Gmail sender requires access to that inbox; if unavailable, use the domain-authentication route.
- If `salman.00724105081197@aust.edu` is not a real mailbox it will still bounce — user confirmed this is the intended address; if it bounces, fall back to a confirmed address.
- Brevo free tier has daily send quota; throttle any batch sends.

## Open questions
- None blocking. Recipient and systemic cause are confirmed.
