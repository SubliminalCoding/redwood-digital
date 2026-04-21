# Outreach email templates

HTML email templates used by the Redwood Digital outreach pipeline. Kept as pure
HTML with `{{var}}` placeholders only — no Jinja comments, no control flow, no
filters. Any string-replace renderer can handle them.

Docs live here, not in the templates, because not every renderer is a real Jinja
engine. If docs sit inside `{# #}` blocks and the renderer is doing naive
substitution, the block ships as visible body copy in the final email.

## Files

| File | Track | Hook |
|---|---|---|
| `outreach-hvac.html` | Home services | "When an emergency call comes in at 10pm, who answers?" |
| `outreach-dental.html` | Dental / healthcare | "When a new patient calls during lunch, who answers?" |
| `outreach.html` | Legacy generic | — |

Dental and HVAC are *not* interchangeable. The body copy, feature strip, and
framing are tuned to each vertical's economics (new-patient acquisition vs.
after-hours emergency capture). Never use the HVAC template for a dental
prospect — the dental recipient will literally read "call the next plumber on
Google."

## Variables

### `outreach-hvac.html`

| Variable | Example | Notes |
|---|---|---|
| `first_name` | `John` | First name only. Not "John Miller". |
| `business_name` | `Miller Plumbing & HVAC` | |
| `reputation_hook` | `a solid reputation for emergency service` | Hand-researched per prospect from their Google Business Profile. Never use a generic fallback — the whole point of the line is specificity. |
| `demo_number` | `(240) 415-6185` | **Display only.** Never substitute into an `href`. |
| `calendar_link` | `https://calendar.app.google/72xGWLJ4tVZJxpni6` | Default Google Calendar booking link. |
| `unsubscribe_link` | per-recipient URL | Base64url-encoded, RFC 8058 one-click compatible. Required by CAN-SPAM. |

### `outreach-dental.html`

| Variable | Example | Notes |
|---|---|---|
| `first_name` | `Lisa` or `Dr. Lisa` | Whatever form the prospect actually goes by. First name only. |
| `practice_name` | `Park Family Dental` | Renamed from `business_name` — dental prospects have "practices", not "businesses". |
| `reputation_hook` | `consistently strong reviews for anxious-patient care` | Same rules as HVAC: hand-researched, never generic. Examples: `highly rated for kids' first visits`, `repeat five-star reviews for gentle cleanings`. |
| `demo_number` | `(240) 415-6185` | Display only. |
| `calendar_link` | `https://calendar.app.google/72xGWLJ4tVZJxpni6` | |
| `unsubscribe_link` | per-recipient URL | |

## Subject & preheader

Both templates:

- **Subject:** `A quick test for {{first_name}}`
- **Preheader:** hidden `<div>` in the template. Don't duplicate — the renderer should pass through the HTML as-is.

## Telephone links

Both templates hardcode `tel:+12404156185` (E.164 format) in every `href`.

**Do not substitute `demo_number` into `href` attributes.** The display-formatted
number `(240) 415-6185` fails as a `tel:` URI on many dialers. The display
number is only used in visible text, where it is wrapped in an anchor whose
`href` is already hardcoded to the E.164 form.

## Sender identity

Both templates embed the physical mailing address and unsubscribe link in the
compliance footer. Before sending, verify:

- `unsubscribe_link` is populated with a per-recipient URL
- SPF, DKIM, DMARC pass for the sending domain
- `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
  headers are set on the outgoing message (RFC 8058)

## When adding a new track

Copy the closest existing template. Keep:

- The solid-red gradient header
- The three-paragraph body structure (framing question → product → pitch-free ask)
- The CTA button + italic tagline
- The three-column feature strip (rewrite the three cards for the vertical)
- The signature and compliance footer

Add the new template's variable table to this README. Do not put docs back into
the template file.
