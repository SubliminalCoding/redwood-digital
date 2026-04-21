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
2. **Leave `[PRODUCT_NAME]` as a literal placeholder** in the drafts. The
   product name (currently "Penny") is not locked. Don't bake "Penny" into
   template copy Hermes will have to rewrite later.
3. **Hold all drafts for Matt's review** before sending. Do not ship the
   first batch until Matt has (a) confirmed the name, (b) resolved the
   pricing discrepancy below, (c) given the production demo URL.
4. **Do NOT link to the product landing page (`/`) from email yet.** See
   the pricing discrepancy section below — until Matt reconciles the two
   prices a prospect clicking around will see conflicting numbers.

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
| `/` | Dark product landing — hero, features, pricing, founder. | None | ❌ **ON HOLD** (see pricing section) |
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
- The `/` landing page until pricing is reconciled

---

## Pricing discrepancy — UNRESOLVED

This is the biggest blocker on linking to the landing page.

- **redwooddigitalfrederick.com** (main site, live): promotes the **$99
  starter pack** for websites + Google Business Profile + reviews.
- **`/` product landing** (Penny, new): pricing card shows **Free 14-day
  pilot · then $2,497/mo**.

A prospect who clicks both sees "$99" and "$2,497/mo" and gets confused
about what Redwood Digital actually sells at what price. These need to
be reconciled in copy before the Penny landing is linkable.

**Hermes directive:** until Matt resolves this, emails **must not link**
to `/` or to `penny.*` or to the product landing on any domain. Link
only to the demo at `/demo/frederick-hvac`, which has its own post-call
CTA that drives to Matt's Calendly without the pricing conflict surfacing.

Once pricing is reconciled, updating templates to include the landing
link is a one-liner.

---

## Product name — placeholder policy

Current placeholder: **Penny** (read from `PRODUCT_NAME` env var in
`server.py`; defaults to `Penny`). Candidates on the table include Penny,
Tilly, Hattie, Marigold, Front Desk, Pickup, Hearth. Matt hasn't committed.

**Template pattern to use:**

```
Subject: [PRODUCT_NAME] — the AI receptionist that answers your phone after hours

Hey {{ first_name }},

[body copy references [PRODUCT_NAME] as a literal placeholder throughout]

— Matt
Redwood Digital
```

When Matt locks the name, it's a find-and-replace across all templates
rather than a manual rewrite per draft.

Gender/pronouns in copy: if `[PRODUCT_NAME]` ends up being a female-coded
name (Penny / Tilly / Hattie), use "she" and "her." Matt intends a female
voice (the current deployment uses ElevenLabs "Bella"). If the final
name is non-personified (Front Desk / Pickup), use "it." Wait for Matt.

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
  This is a known trade-off for demo value — documented in the security
  audit.

---

## Open questions blocking the first batch

Hermes should draft but hold. Matt needs to answer before send:

1. **Product name** — Penny, or something else?
2. **Pricing resolution** — $99 starter vs $2,497/mo Penny. How do these
   relate in copy?
3. **Demo URL** — still ngrok, or Cloudflare Tunnel live?
4. **First batch targets** — Matt previously mentioned BPM HVAC, Markool
   HVAC, Air Doctor HVAC, Frederick Dental Suite, Frederick Dental Group.
   Confirm the actual list.
5. **Signature style** — Matt first-person, or "the Redwood Digital team"?

---

## One-line summary

> Redraft HVAC + dental email templates around a two-action CTA (open
> `<ngrok-demo-URL>/demo/frederick-hvac` + dial `(240) 415-6185`). Use
> `[PRODUCT_NAME]` as a placeholder. Do NOT link to the product landing
> page until Matt resolves the $99-vs-$2,497 pricing discrepancy. Hold
> drafts for Matt's review before any sends.
