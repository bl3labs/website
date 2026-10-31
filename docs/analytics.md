# Website analytics

GA4 measurement ID: `G-1HLQ4F6M35`.

`analytics.js` loads Google only after explicit statistics opt-in (basic consent mode). Rejection and acceptance have equally prominent buttons. Visitors can reopen settings and withdraw; accessible GA cookies are removed and an already tracked page reloads to stop listeners. Choices expire after 180 days. Same-origin embedded demos delegate tracking to the parent page to avoid duplicate trackers and consent prompts.

Custom events: `contact_email_click`, `contact_phone_click`, `demo_open`, `demo_start` (connected voice session), `inquiry_open`, `generate_lead` (only server response `ok: true`). No form contents, audio or conversation content are attached. Page URLs retain only campaign UTM fields; query-provided demo names/IDs are excluded from URLs and titles. Use generic campaign labels, never personal data in UTM values.

## GA4 account follow-up

- Disable automatic Form interactions in the web stream's Enhanced measurement; use confirmed `generate_lead` events instead of automatically detected submissions.
- Review other enhanced measurement options; do not enable user-provided data collection, Google Signals or ads personalization for this basic setup.
- Set event-data retention to 2 months; review account data-sharing choices and Google's Data Processing Terms. This setting is managed in GA4, not the site code.
- Mark `generate_lead` as a key event when it becomes available. A contact click is an intent signal, not a confirmed lead.
- Verify consent acceptance in Realtime / DebugView and in browser Network. Before consent or after rejection, there must be no requests to googletagmanager.com or google-analytics.com. Confirm withdrawal removes GA cookies and the next document sends no Analytics requests.

## Campaign links

Use `utm_source=facebook` or `instagram`; `utm_medium=paid_social` for ads and `organic_social` for ordinary posts; `utm_campaign=wolfgangsee_advent_2026`; distinguish creatives with `utm_content`.

Example: `https://bl3labs.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=wolfgangsee_advent_2026&utm_content=telefonassistenz_01`.

Compare sessions and custom events by session source/medium and campaign. Analytics sees consenting visitors only; ad-platform clicks and website sessions will differ. No historic data is backfilled.

Validation: JavaScript syntax checks and mocked consent lifecycle tests cover no initial Google load, rejection, opt-in, URL/title sanitization, event allowlist, revocation, saved/expired preferences, embedded delegation and cross-tab withdrawal. Live GA delivery and actual voice/form completion require an end-to-end check after publication.
