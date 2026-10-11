# BL3LABS client demo

Live URL: https://bl3labs.com/demo/

The default connects to the same public Leonie agent and branch as the existing homepage. No API key is shipped to the browser. The ElevenLabs client loads only after affirmative consent and a Start click.

## Client-specific links

`https://bl3labs.com/demo/?agent=AGENT_ID&name=NAME&company=COMPANY`

Optional `branch=BRANCH_ID` selects a specific agent branch. A custom agent never inherits Leonie's default branch. URL-encode names, spaces and accents.

The linked agent must allow public browser conversations from this domain. Private agents require a protected server endpoint that obtains a conversation token; do not embed an API key in HTML or URL parameters. This page does not configure agent recording, retention, tools, or authentication. Use demo agents and sandbox tools for client tests.

Consent is unchecked on entry and after each session. `demo_consent`, `demo_consent_at` (UTC ISO timestamp), and `demo_consent_version` are passed as session dynamic variables. These are client-submitted metadata, not an independently verified consent audit log. The checkbox does not enable ElevenLabs recording or replace the agent's own consent workflow. Configure recording and retention in the agent account to match the displayed notice and finalize the full privacy notice before broader public use.

IDs, labels and company names in the URL are public. Put no personal data or secrets in links. Agent and branch IDs are validated; labels use textContent. The page uses no analytics, cookies or browser-local persistence of transcripts or audio. It does not request the microphone or load the voice SDK until the user explicitly starts.

## Files

- `index.html`: German UI, existing brand logo, privacy information dialog.
- `style.css`: responsive brand layout, animated CSS orb, reduced-motion support.
- `app.js`: WebRTC voice session lifecycle, consent gate, timer, mute, cancellation and errors.

Publishing these files on the repository's main branch makes them available through the existing GitHub Pages deployment. No build step is needed.
