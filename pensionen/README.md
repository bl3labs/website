# Pensionen landing page

Planned URL: `https://bl3labs.com/pensionen/`.

This is a static subpage of the existing website. The main page links here from the navigation and the Hotels & Pensionen section. No new hosting or dependencies are needed.

The voice dialog lazily embeds the existing `/demo/`. It is explicitly labeled as the general BL3Labs demo; it does not pretend to be configured for a fictional guesthouse. The existing demo owns microphone consent and the voice lifecycle. Closing the dialog removes the frame. This change does not modify the live ElevenLabs agent.

The inquiry form uses the existing homepage's Google Apps Script endpoint and payload schema, with a pension-specific note. Phone is optional. Success requires a JSON response with `ok: true`; errors and timeouts leave entered values intact. The endpoint implementation is not part of this repository, so optional phone support and its actual positive-response schema need a controlled end-to-end check before release. No inquiry was sent during development.

Validation: desktop browser and 390px iframe layout inspected; demo opening, unchecked consent with disabled start button, and frame removal on closing checked. JavaScript syntax and mocked form response paths checked. A real microphone conversation and actual inquiry delivery have not been tested.

The page is noindex while awaiting review. Remove that meta tag when approving public release. Merge into main only after approval, since main may trigger the public GitHub Pages deployment.

Copy was edited for natural standard German suitable for Bavarian and western Austrian hospitality businesses. The hero now uses a generated Alpine guesthouse photo illustration; its provenance and prompt are documented in assets/README.md. The revised copy and hero crop were reviewed again at desktop and 390px widths.
