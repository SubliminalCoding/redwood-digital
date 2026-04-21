# Outreach agent — briefing on the AI receptionist demo surface

**Author:** claude-code (the agent building the `ai-receptionist` repo).
**Audience:** the sibling agent (Hermes) drafting cold-outreach emails to
HVAC / service-business prospects.
**Canonical copies of this file:**

- `/home/bilbroswagginz/ai-receptionist/docs/outreach-brief.md` (here, authored)
- `/home/bilbroswagginz/redwood-digital/email-templates/outreach-brief.md` (mirror
  for Hermes to read from its own repo root)

**Last updated:** 2026-04-21.

---

## Directive for this handoff (read first)

1. **Redraft HVAC + dental email templates against the new two-action flow**
   (described below). The single-`tel:`-button pattern no longer fits —
   prospects now need a browser tab open *alongside* the phone call.
2. **Leave `[PRODUCT_NAME]` as a literal placeholder** in the drafts.
   Current value: **Penny** (confirmed by Matt 2026-04-21). Keep the
   placeholder in template source so if Matt swaps it later it's a
   find-and-replace rather than rewriting copy. Render the placeholder
   to "Penny" at send time.
3. **Hold all drafts for Matt's review** before sending.
4. **Linking to the product landing page `/` is now OK.** Pricing
   discrepancy resolved (2026-04-21) — the landing page's pricing card
   no longer shows a dollar figure; it says "Pilot pricing tuned to your
   shop — book a 15-min call to discuss what fits." No conflict with the
   main site's $99 starter pack messaging anymore.

---

## TL;DR of what shipped

A **public live demo** that prospects can visit in a browser and watch
the AI receptionist answer a real call on a real phone number, in real
time, with PII redacted. Also a dark-mode product landing page (currently
not linkable from email — see #4 above). Both are on one FastAPI server.

Email CTAs should drive to the **demo**. The landing page is on hold.

---

## The flow the prospect is walked through

**This is a two-action CTA, not a one-action CTA.** Templates built
around a single `tel:` button don't fit anymore.

Old pattern (retire):
> Call (240) 415-6185.  [big tel: button]

New pattern (target):
> 1. Open `<demo URL>` on your laptop.
> 2. While that page is open, dial `(240) 415-6185` from your phone.
> 3. Watch the AI answer, take your info, and book the job — live, on
>    your screen.

Both actions are required. Phone-only prospects can't experience the
visual proof. Laptop-only prospects can't hear the AI. Email copy should
set this expectation (and it will narrow the target audience — that's OK
and probably good for conversion).

---

## The URLs Hermes may link

### Right now (dev — ngrok, URL rotates)

| Path | What | Auth? | Link from email? |
|---|---|---|---|
| `/demo/frederick-hvac` | **Public live viewer** — dark, prospect-facing. Dial `(240) 415-6185`, watch the call unfold with PII redacted. Sticky post-call CTA with Matt's Calendly. | None | ✅ **primary** |
| `/` | Dark product landing — hero, features, pricing, founder. | None | ⚠️ OK as secondary surface now (pricing resolved) |
| `/demo/frederick-hvac?preview=1` | Static mock-data inspection mode | None | ❌ design tool only |
| `/r/<CallSid>` | Per-call receipt page (SMS'd to caller) | URL-gated | ❌ |
| `/admin/*` | Matt's admin | HTTP Basic | ❌ |

### Host specification — no ambiguity

**During dev:** the demo URL is
`https://<current-ngrok-subdomain>.ngrok-free.dev/demo/frederick-hvac`.
The ngrok subdomain **rotates** between restarts. **Ask Matt for the
current URL before each email batch.** Last-known as of 2026-04-21:
`https://reda-rawish-combustibly.ngrok-free.dev`. Assume it changes.

**Production (planned):**
`https://demo.redwooddigitalfrederick.com/demo/frederick-hvac`
— via Cloudflare Tunnel, setup pending. Once live, this is stable and
can be baked into templates permanently.

**Rule of thumb:** if Matt hasn't explicitly said "the Cloudflare Tunnel
is up and stable," use the ngrok URL and re-confirm before every send.

### Never in email

- Any `/admin/*` URL (auth-gated, not for prospects)
- Any `/r/<CallSid>` URL (per-call, time-limited, not meant to be shared
  with cold outreach recipients)

---

## Pricing — resolved (2026-04-21)

The landing page's pricing card no longer surfaces a monthly dollar figure.
It now reads:

> **Free 14-day pilot**
> Pilot pricing tuned to your shop — book a 15-min call to discuss what fits.

No number collision with the main site's $99 starter pack. The real price
comes out of Matt's discovery call, not the landing page. This mirrors how
the Camillo retainer model actually operates.

**Hermes:** you may now link to the product landing page `/` as a
secondary "learn more" surface in email. The primary CTA should still
drive to `/demo/frederick-hvac` — watching beats reading for this product.

---

## Product name — Penny (confirmed 2026-04-21)

Current value: **Penny.** Read from `PRODUCT_NAME` env var in `server.py`.
Matt has committed for now — if he changes it later it's a one-line env
swap + a find-and-replace through templates.

**Template pattern:** use `[PRODUCT_NAME]` as a literal placeholder in
template source. Render to "Penny" at send time. That keeps templates
resilient to a later name change.

**Pronouns:** "she" / "her." Penny is female-personified. The current
deployment uses the ElevenLabs "Bella" voice (warm middle-aged American
female). Keep it consistent.

---

## Key copy Hermes should echo for voice continuity

Lines that appear on the demo + landing — email copy should rhyme with
these so the prospect doesn't feel a tonal shift when clicking through.

**Value prop:**
> An AI receptionist that listens, takes the message, and books the job
> on your calendar — automatically. So you stop losing leads to voicemail.

**Problem framing:**
> HVAC businesses in Maryland lose 3–5 leads a week to voicemail. Every
> after-hours call that goes to voicemail is a customer calling your
> competitor.

**Differentiators:**
- Matt sets it up for you in about an hour (no setup forms)
- Bookings go to YOUR existing Google Calendar
- Real human voice, not robotic
- Built in Frederick — Matt is two miles from your shop

**Founder voice (first-person from Matt):**
> "I built [PRODUCT_NAME] in my garage in Frederick because I kept watching
> local service businesses lose leads to voicemail every night. I'll set it
> up for you personally. I'm two miles from your shop."

**Calendar URL:** `https://calendar.app.google/72xGWLJ4tVZJxpni6`
(already embedded on the demo's post-call CTA — you don't have to
repeat it as the primary ask unless the prospect declines to do the
demo).

---

## What the prospect actually sees when they dial

For setting expectations in email copy:

1. They visit `<demo-url>/demo/frederick-hvac` — dark page, big `(240) 415-6185`
   callout, status pill "Waiting for your call."
2. They dial. Within ~2 seconds the page flips:
   - LIVE chip pulses green
   - Header: "From {first-name} · (***) ***-NNNN · 0:42" (redacted)
   - Three panels: **Conversation** (bubbles fade in as they talk),
     **Booking** (Listening… → Slot proposed → Booked with green flash),
     **What we've got** (problem + first name)
3. Conversation runs ~45–90 seconds. AI triages emergencies, collects
   name/address/callback, proposes a slot, books it, hangs up.
4. Dark post-call CTA card appears: **"Want one tuned to your business?"**
   with final call duration + "Book a 15-min call with Matt" button.
5. Their phone gets 3 SMS: booking confirmation, owner ping (to Matt),
   and a shareable receipt link.

---

## Privacy + redaction notes (for email objection handling)

If a prospect asks "is my data safe on the demo":

- Caller number → last 4 only (`(***) ***-0189`)
- Caller name → first name only (server-side regex from LLM extraction)
- Address / last name / full phone → **dropped server-side** before
  leaving the process. Never reach the SSE wire.
- Transcripts are rendered verbatim during the call. If the prospect
  says their address aloud it appears in the transcript on screen.
  This is a known trade-off for demo value — documented in the security audit.

---

## Open questions blocking the first batch

Status as of 2026-04-21 16:15:

1. ✅ **Product name** — locked to **Penny**.
2. ✅ **Pricing** — resolved. Landing page no longer surfaces a dollar
   figure; says "Pilot pricing tuned to your shop."
3. ⏳ **Demo URL** — still ngrok. Cloudflare Tunnel for
   `demo.redwooddigitalfrederick.com` pending Matt's setup. Until then,
   re-confirm the ngrok URL before each send batch.
4. ⏳ **First batch targets** — confirm the actual send list with Matt.
5. ⏳ **Signature style** — first-person Matt recommended (matches landing
   page voice). Confirm with Matt.

---

## One-line summary

> Redraft HVAC + dental email templates around a two-action CTA (open
> `<ngrok-demo-URL>/demo/frederick-hvac` + dial `(240) 415-6185`). Use
> `[PRODUCT_NAME]` → renders as "Penny." Primary CTA to the demo; OK
> to link the product landing `/` as secondary. Hold drafts for Matt's
> review before sending; re-confirm the ngrok URL per batch.
