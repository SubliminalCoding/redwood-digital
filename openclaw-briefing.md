# OpenClaw Strategy Update — Redwood Digital

Paste this into OpenClaw to align its operations with the new two-track business model. Drafted 2026-04-20.

---

strategy update — two-track redwood digital model

context: i shifted the business approach based on a chris camillo "ai guy" sales model. you need to align your operations to it. the full strategy lives at `~/obsidian/hermes/projects/redwood-digital-strategy.md` — read that first if you want the long version. short version below so you have the working set in one place.

## two tracks now run in parallel

**track a** — $99 starter pack volume play. cold local SMBs, fast turnaround. existing approach. math = 4 sales/day = $100k/yr.

**track b** — camillo "ai guy" play. AI phone agent (ai-caller.html) is the wedge product. discovery call → free pilot (offered IN THE CALL, never in cold copy) → $2-3k/mo retainer where i become the prospect's ongoing "AI person" plugging revenue leak after revenue leak. math = 10-20 retainer clients = $240-720k/yr.

**wedge niches for track b: frederick HVAC and dental.** NOT roofing — call frequency math doesn't work for retainer there. roofing and electrical stay on track a.

## how this changes what you do

**1. when researching prospects:** use the hardened two-pass audit prompt at `~/redwood-digital/templates/audit-prompt-v2.md`. NEVER hallucinate weaknesses. the previous batch in `~/redwood-digital/targets/batch-1-audits.md` got 3 of 4 first audits wrong (pj's roofing, air doctor, politz all had weaknesses claimed that don't exist on the live sites — politz alone had 1200+ words on its homepage, three galleries, and a 160+ reviews section that the audit said were missing). evidence or silence: every claim needs a quoted snippet from the live site or a list of URLs you actually checked. word counts must be real counts, not estimates. no invented stats.

**2. when drafting cold outreach:** use leak framing, not website-rebuild framing. headline pattern is "you're losing X leads to Y." NEVER offer a free pilot in cold copy — that's a discovery-call move only. for tone reference, see the rewritten files at `~/redwood-digital/outreach/01-pjs-roofing.md`, `02-air-doctor-hvac.md`, `04-markool-hvac.md`. file 03 is in `skipped/` for a reason — well-run operation, do not pitch.

**3. when prioritizing leads:** HVAC + dental = track b candidates ($2-3k/mo retainer math works because the prospect can connect captured leads × avg ticket to ROI). plumbing + sprinkler = also track b candidates (similar after-hours leak pattern, similar ticket size). roofing + electrical + already-polished operators = track a or skip entirely.

**4. when operating telegram or any direct channel for dennis/incenta:** the 3-business-day don't-chase rule is in effect. demo was thursday 2026-04-16. earliest follow-up is **tuesday 2026-04-21**. email options ready at `~/incenta-poc/NEXT-EMAIL-OPTIONS.md` — option a = neutral ping if still silent, option b = scope reframe after dennis engages. do not suggest follow-up before tuesday under any circumstances. if i ask "should i follow up with dennis," default answer is "wait."

**5. when suggesting any new build for any prospect:** scope + deposit before any code, even with family. minimum $300 deposit. the david review-handler pitch is the only exception — and only because it's been pre-scoped — but the pitch itself still requires deposit before build. see `~/redwood-digital/proposals/david-text-script.md` for how to hold the line when prospects ask for free spec work. this rule applies hardest when the impulse is "just build it as a favor."

**6. when productizing:** build the AI receptionist template ONCE. then per-prospect deployment is 1-2 hours, not a fresh build. cap free-pilot effort at 8-12 hours per prospect. one pilot at a time, never multiple in parallel — that's the failure mode that turns this into unbounded spec work.

**7. when surfacing or recommending stats in any output:** NO unverifiable claims. "68% of voicemails for service businesses don't get called back" type stats need a source URL or get pulled. "most voicemails don't get a callback" is the right level of soft claim without a source. same standard as testimonials — never invent a "sarah at frederick dental suite" quote.

## key memory files to consult

- `~/.claude/projects/-home-bilbroswagginz/memory/MEMORY.md` — index
- `~/.claude/projects/-home-bilbroswagginz/memory/project_incenta_dennis.md` — dennis state + camillo reframe
- `~/.claude/projects/-home-bilbroswagginz/memory/feedback_dennis_dont_chase.md` — the 3-day rule
- `~/.claude/projects/-home-bilbroswagginz/memory/feedback_no_spec_work_without_deposit.md` — the deposit rule
- `~/.claude/projects/-home-bilbroswagginz/memory/project_david_review_handler.md` — david pitch summary
- `~/obsidian/hermes/projects/redwood-digital-strategy.md` — full two-track strategy
- `~/obsidian/hermes/projects/incenta-llc.md` — full dennis project context
- `~/obsidian/hermes/projects/david-review-handler.md` — full david project

## source material

the strategic shift comes from the chris camillo / iced coffee hour podcast — the "AI guy fixes one revenue leak then becomes ongoing AI person on retainer" thesis. you don't need to re-derive it. don't pitch me on the thesis — i already absorbed it. just operate consistent with it.

## what overrides what

this update **doesn't replace** your existing operational instructions. it **overrides** anything that conflicts. specifically:
- old: "build websites for local frederick businesses" → new: "fix revenue leaks for local frederick service businesses, AI receptionist as the wedge product"
- old: "any prospect with a weak website is a candidate" → new: "tier prospects by retainer math; HVAC + dental are anchor niches"
- old: "free audits and free demos build trust" → new: "free audits = ok in cold copy; free pilots = discovery-call only, never homepage"

---

## 2026-04-20 addendum — the wedge product now exists

status: top-priority project. real, working, multi-tenant.

repo: `github.com/SubliminalCoding/ai-receptionist` (private)
local: `~/ai-receptionist/`
full project doc: `~/obsidian/hermes/projects/ai-receptionist.md`
memory: `~/.claude/projects/-home-bilbroswagginz/memory/project_ai_receptionist.md`

what it is: multi-tenant inbound AI phone agent. caller dials the business's twilio number after hours, AI answers, triages, proposes a slot on the business's google calendar, books on confirmation, SMS confirms caller + owner. new client = new YAML file in `~/ai-receptionist/tenants/<slug>.yaml` + share their calendar with the service account + webhook their twilio number at the server. no code change needed.

demo tenant `frederick-hvac` is live on `+1 240 415 6185`. real bookings have landed on the "Frederick HVAC Demo" google calendar via real calls placed during development today.

### how this changes what you do

8. **when matt says "receptionist" or "phone agent" or references the AI that books calls**: that means this project. read the project doc before offering suggestions. don't confuse it with `ai-sales-caller` (outbound cold caller, different repo, different flow).

9. **when matt tries to deploy the receptionist for a new prospect**: the onboarding checklist lives in the project doc. key prereqs: twilio number provisioned, google service account JSON, calendar shared with service account at "Make changes to events" permission (requires the workspace admin-console unlock from 2026-04-20 if the client's on gWorkspace), owner phone, greeting text. Config file lives at `~/ai-receptionist/tenants/<slug>.yaml`. copy `frederick-hvac.yaml` as a starting point.

10. **when matt asks about hosting / infra for the receptionist**: the server runs on port 8002 (port 8000 is vLLM qwen3.6 — don't suggest running the receptionist there). dev uses ngrok; production needs a real host, TBD. in-memory state per call is single-host only — swap to redis for multi-host later.

11. **when matt asks about llm choice for the receptionist**: current default is groq `llama-3.3-70b-versatile` (free tier, cloud). per-tenant LLM override is on the roadmap but not yet built. when it lands, **client tenants stay on cloud LLMs** — only matt's own redwood digital tenant uses local vllm qwen3.6. reason: don't make his spark a SPOF for paying clients, concurrency ceiling, data-residency posture. don't ever propose routing a client tenant through `localhost:8000`.

12. **when matt asks "what's next" for the receptionist**: the answer in priority order is (a) Tier 2 admin UI for matt to manage tenants without editing YAML — 2-4 day work block, FastAPI + jinja2 + HTMX, single-user http basic auth; (b) per-tenant LLM config; (c) deploy redwood digital's own receptionist tenant on local vllm; (d) first real-client deployment from the outreach list. DO NOT suggest Tier 3 SaaS (OAuth client portal, stripe billing, self-service signup) — that's over-engineered for the Camillo model at matt's scale.

13. **hard-won architecture rules locked in the project (do not undo):**
    - booking is propose-confirm, NOT auto on intake complete
    - server owns side effects, LLM only picks dialogue
    - scheduling-in-progress guard: ignore LLM-signaled hangup when candidate_slot pending
    - keyword match for caller yes/no with negation guard ("not sure" ≠ yes)
    - emergency slots round to :00/:30 to avoid speech-rec garble
    - address requires ≥4 tokens or a comma (bare street → follow up for city)
    - SMS failures caught, never kill the call

14. **when suggesting any extension or refactor to the receptionist**: check if it conflicts with the seven rules above. if yes, flag the conflict explicitly before proposing. these rules each cost real debugging time and are non-negotiable without a good reason.

### what relates to your existing operational picture

- the receptionist IS the Track B wedge product referenced in the earlier briefing. everything about leak framing, 8-12hr pilot cap, one-at-a-time, HVAC+dental niche — all still applies. the receptionist is the concrete thing that those pilots deploy.
- `~/redwood-digital/outreach/` emails are for prospects of THIS product. BPM / Markool / Air Doctor / Frederick Dental Suite / Frederick Dental Group = candidate first-clients.
- the matt-own-tenant-on-local-vllm goal is the only case where you should suggest the local vllm path. for clients, always cloud.

---

## confirm

read the files. then tell me what's still ambiguous about your operating instructions, or what tasks you have queued that may need re-prioritization given the shift.
