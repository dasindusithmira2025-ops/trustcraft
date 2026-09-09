# TrustCraft — Judge Q&A Preparation

**Rule for every answer in this document: say what is true.**

TrustCraft is a prototype. Some of what follows is built and can be shown in
the repository; some is designed and not built; some is a plan. Each answer is
tagged so you never blur the line under pressure:

- **BUILT** — in the repository, demonstrable right now
- **DESIGNED** — the mechanism is specified and visible in the UI, not yet
  wired end to end
- **PLANNED** — a decision we have made about the future, with no code behind it
- **UNKNOWN** — we do not know, and saying so is the correct answer

If a judge catches you overstating something, you lose more than the point.
The single most powerful thing you can say in this room is *"that part isn't
built yet — here's what is."*

---

## The one thing to know before you answer anything

The customer and professional apps you are demoing run on **seeded demo
fixtures** (`src/store.tsx`, `src/worker/data.ts`) so the walkthrough is
deterministic on any machine. Separately, the repository contains a **pure,
unit-tested domain layer** (`server/domain.mjs`, tested by `server/test.mjs`)
holding the real trust-scoring, problem-classification and matching logic.
Those two are not yet wired together.

Say that plainly if asked. It is a normal state for a prototype and it is far
better than being caught claiming a live model.

---

## Trust and verification

### "How do you verify providers?"
**DESIGNED / partly BUILT.** Verification is document-based, not self-declared.
The professional app has a Verification Documents screen with per-document
status: National Identity Card, trade certificate, wireman's licence, police
clearance, public liability insurance — each either Verified, Expiring or
Missing, with an expiry date. A missing document is shown as costing trust
score points, so there is a standing incentive to complete it.

What is built: the document model, the states, the UI, and the effect on the
score. What is not: the human or third-party process that actually checks a
scanned NIC against the register. That is an operations problem, and we would
start it manually, per-professional, in one city.

### "How is the Trust Score calculated? Isn't it just a number you made up?"
**BUILT** (`server/domain.mjs`, `trustScore`). It is a weighted sum of verified
evidence only — never self-declared claims:

| Component | Weight | Source |
|---|---|---|
| Identity verified | 10 | document check |
| Qualification verified | 15 | trade certificate on file |
| Relevant work | 20 | jobs completed *in that specialisation*, capped at 40 |
| Reliability | 25 | 60% completion rate + 40% on-time rate |
| Satisfaction | 20 | mean verified customer rating |
| Disputes | 10 | starts full, −5 per unresolved dispute |

Two deliberate choices worth defending out loud: satisfaction is only 20 of
100, so stars cannot carry the score on their own; and *relevant* work is
counted, not total work — a great plumber does not get plumbing credit for
electrical jobs.

### "How do you stop fake reviews?"
**DESIGNED.** A review can only be created at the end of a tracked case — the
customer reaches the review screen after completion, from a case that has a
request, a selected professional, an inspection, an agreed quotation, a
payment and submitted completion evidence. There is no free-standing "leave a
review" entry point anywhere in the product.

That does not make fraud impossible; it makes it expensive, because a fake
review requires a fake job with a real payment attached. Combined with
satisfaction being only 20% of the score, the return on faking reviews is low.

**Do not claim** we detect review fraud. We don't. We reduce the incentive.

### "What about a provider who is verified but simply bad?"
**BUILT (mechanism).** Reliability and disputes are 35 of the 100 points, and
both move without any customer writing a review. Completion rate, on-time rate
and unresolved disputes are behavioural, recorded by the platform. A verified
provider who does poor work loses score through those channels.

---

## The AI

### "What happens when the AI interprets the problem incorrectly?"
This is the most likely hard question. Three honest layers:

1. **The customer always chooses.** The system never assigns a professional.
   The recommendations screen says it in the product's own words: *"these
   professionals may be a good match. You choose who takes the job."*
2. **Confidence is capped.** `analyse()` in `server/domain.mjs` caps confidence
   at 0.95 and never presents certainty it does not have. Every category
   carries an explicit disclaimer — *"This analysis is AI-guided only. A
   qualified plumber must diagnose and repair the issue."*
3. **The professional overrides it.** The professional's request screen shows
   our read of the problem next to the line *"A suggestion only — your on-site
   judgement decides the job."* We wrote that into the UI on purpose.

Plus: the customer can always ignore the whole thing. The home screen has a
second path — "I will do it myself" — straight into manual browsing.

### "Why do you need AI at all?"
Because the mismatch is linguistic. The customer knows the **symptom**; the
market is organised by **trade**. Something has to translate. Today that
translation is done by the customer, badly, using guesswork — which is exactly
the friction we are removing.

Note that in this build the classifier is a **deterministic keyword engine**,
not a model call. That is a feature, not an apology: it is inspectable, it is
unit-tested, it cannot hallucinate a service that does not exist, and it runs
offline. A language model is an upgrade path, not a requirement.

### "Is it really AI then?"
**Be straight.** In this build it is a rules-based classifier with an
explainable weighted matcher. We use "AI-guided" in the product copy and we
would not defend the word "AI" harder than that. The product value is the
problem-first interaction and the trust evidence — not the technique.

---

## Users and competition

### "Why would a user choose TrustCraft over Google or a Facebook group?"
Google returns links; a Facebook group returns opinions from people you don't
know either. Neither can tell you whether the person who turns up has a
certificate, a completion rate, or a dispute history — and neither remembers
that the job happened. TrustCraft's output is not a name, it's a name plus the
evidence for choosing it, plus a record afterwards.

### "Why not just use Servixy or TaskForce.lk?"
Both are real, both are credible, and both do things we do not — NIC
verification and escrow on both, dispute mediation on TaskForce. Do not attack
them.

The difference is the front door. Servixy asks you to browse a category or post
a job; TaskForce asks you to describe a job **and name a budget**. Both assume
the customer already knows what service they need and what it should cost. The
person with water coming out of their kitchen cupboard knows neither. We start
one step earlier, and we carry photo, video and voice from that first step.

### "What stops one of them copying this?"
Nothing stops them building a problem-first input — it's a few weeks of work.
What is harder to copy is the accumulated evidence: verified service records
tied to completed, paid, evidenced jobs. That is a data asset that takes time
and volume, and it is the thing a professional would not want to abandon by
switching platforms. Feature parity is cheap; a two-year verified work history
is not.

**Do not claim a moat we don't have.** Say "the interaction is copyable, the
record is not."

---

## Providers

### "How do providers actually benefit?"
Three things they cannot get from a personal network: relevant customers
(matched to what they actually do), a portable reputation built on evidence
rather than word of mouth, and the job tooling — quotation builder, escrowed
payment, completion evidence, earnings ledger — that is all in the
professional app today.

### "Why would a provider pay?"
**Most don't have to.** A professional can operate entirely on the **Free**
plan: no monthly charge, a proposed 10% commission on completed jobs only.
**TrustCraft Pro** is an *optional* subscription — a proposed 8% completed-job
commission instead of 10%, plus an ad-free workspace, Demand Radar, an AI quote
copilot, the Pro Supply Club and business tools.

The Pro subscription is designed so that upgrading never makes a low-volume
professional worse off: the proposed charge is `min( LKR 1,490 , 2% of that
month's completed TrustCraft job value )`. The gap between the 10% and 8%
commissions is exactly 2%, so below ~LKR 74,500 of monthly job value the
subscription just offsets the commission saving; above it, Pro creates real cash
savings (slide 17 works the numbers: LKR 510 / 2,510 / 4,510 kept per month at
100k / 200k / 300k).

What Pro buys is *access to tools and a lower rate*, never trust. Verification,
the trust score, reviews and ranking stay completely separate from payment.

Only the **8% completed-job fee** is implemented today (`PLATFORM_FEE`). The 10 /
8 split, the activity-adjusted subscription price, the supply engines and
TrustCraft for Business are all **proposed** — no price is finalised and we
would validate the Pro price with real providers first.

### "How do you solve the cold-start problem?"
**PLANNED.** Supply first, narrow, and manual:

1. One city, and realistically a few suburbs of Colombo.
2. A small number of trades — plumbing and electrical, where urgency is
   highest and the trust risk is most acute.
3. Recruit **verified** providers by hand, in person, before any consumer
   launch. A thin marketplace with 20 verified plumbers in one district is
   more useful than a wide one with nobody nearby.
4. Seed demand at the moment of need rather than through broad marketing —
   property managers and apartment complexes concentrate exactly the demand
   we want.

The specific number of providers, the suburbs and the timeline: **UNKNOWN.**
We have not done that operational work and will not invent it here.

### "How will you attract the first professionals?"
Hand-recruited, in person, in one district — verified before any consumer
launch. The pitch is "prove what you're already good at, and keep the record":
early providers earn the strongest scores simply by being early and completing
work, which is a real, honest incentive. There is no barrier to joining — the
Free plan has no subscription — so the ask is only "come and complete verified
jobs". TrustCraft Pro is offered later, as an upgrade, and its price is a
**PLANNED** decision made with those first providers rather than set here.

---

## Privacy and safety

### "Is user data private? What happens to uploaded photos?"
**DESIGNED.** The product's stated rule is on the request screen: *"Your
request is only shared with the professional you select."* Media is attached to
a specific case, not to a public profile, and it is visible to the one
professional handling that case.

**BUILT status: this is a local prototype.** There is no production backend, no
cloud storage and no third-party processor today. Media lives in the demo
session. We are not going to describe a retention policy or encryption scheme
that does not exist. Before any real launch, this needs a written retention
policy, per-case access scoping and deletion on case closure — and that is
work we have not done.

### "Is voice processed securely?"
Same answer, same honesty. In this build the voice note is captured and
attached to the request; there is no server-side transcription pipeline. If we
added one, the two commitments we would make are: transcription tied to the
case, and deletion with the case. Neither exists yet.

### "What if a provider turns out to be dangerous?"
Police clearance is one of the five verification documents in the professional
app, and it expires — the screen shows renewal warnings. Beyond that: the
platform holds identity, a job record and a payment trail, which is more
accountability than a phone number from a Facebook group. But we should not
oversell it. A platform reduces risk; it does not eliminate it.

---

## Product and design

### "How did UX principles actually influence the interface?"
Point at the product, not at a list:

- **Hick's Law** — the recommendation screen returns three ranked matches, not
  a directory. The category grid is deliberately *not* the home screen.
- **Fitts's Law / Von Restorff** — one full-width primary action per screen, in
  thumb reach, and blue is reserved for it. Scan any screen: exactly one thing
  is blue.
- **Postel's Law** — text, photo, video, voice and location all accepted at the
  same entry point.
- **Miller's Law** — the case has nine stages, but the status screen only ever
  shows one "what happens next" action. The complexity is chunked, not hidden.
- **Peak–End** — the trust surface is the peak of the product, and the service
  record is the end.

### "What did you remove or simplify during the design process?"
The most important removal: **the category grid as the home screen.** A grid of
service tiles is the default pattern for this whole category of app, and it is
the exact thing that fails the user who does not know their category. It still
exists, one tap away, under "Find a professional" — because sometimes you do
know. It is just not the front door.

Second: the star rating as the primary trust mechanism. Stars are still there,
but they are 20% of the score, not the score.

### "Which single feature matters most?"
The professional profile — the trust surface. Everything before it is getting
the user to a good decision; everything after it is keeping the promise. If we
could only ship one screen, it would be that one.

### "Isn't this just another services marketplace?"
A marketplace optimises for transactions. We are optimising for the moment of
*deciding* — which is where this market actually fails. The measurable
difference is that our output is not a list, it's a ranked set with the reason
for the ranking and the evidence behind each option.

---

## Business and launch

### "How will you generate revenue?"
Four aligned engines around one completed job — not one relationship taxed
harder (slides 16–18):

1. **Completed jobs** — the primary engine. Proposed 10% commission on the Free
   plan, 8% on Pro. **BUILT:** an 8% completed-job fee inside the quotation
   builder, shown to the professional before they send a price.
2. **TrustCraft Pro** — an *optional* recurring subscription, proposed at
   `min( LKR 1,490 , 2% of monthly completed job value )`. Recurring revenue;
   proposed price.
3. **Supply network** — a job creates material demand. Clearly-labelled
   sponsored supplier placement for Free professionals, a Pro Supply Club with
   negotiated pricing, and negotiated commerce/referral revenue for TrustCraft.
   No partner signed, no supplier commission rate invented.
4. **TrustCraft for Business** — enterprise maintenance contracts for hotels,
   property managers, apartment complexes, offices, restaurants and SMEs:
   monthly/annual platform contract plus transaction economics. This engine
   creates **both** recurring B2B revenue **and** recurring demand for
   professionals. No such customers today; no pricing set.

We do **not** claim to already out-earn any operating competitor — there is no
evidence for that. The claim is architectural: more diversified, more aligned
with professional success, and less dependent on a single monetisation engine.
Consumers never pay to search or read trust evidence, and no amount of payment
buys verification, a score, reviews or ranking.

### "Isn't 300 × LKR 1,490 = LKR 447K optimistic — wouldn't some Pros pay the 2%?"
Yes. The slide-17 platform scenario is explicitly **ILLUSTRATIVE** and shows the
Pro subscription line at its LKR 1,490 ceiling; Pros doing less than ~LKR 74,500
a month would pay the 2% instead, so real Pro MRR would be lower. The point of
the slide is the *shape* — that the core marketplace (commissions + Pro MRR) can
stand on its own before the supply and enterprise engines contribute — not that
exact figure.

### "What is your launch strategy?"
Narrow and manual — see the cold-start answer. Two trades, a few suburbs,
hand-verified providers before any consumer marketing.

### "What traction do you have?"
**None, and we will say so.** No users, no revenue, no providers, no
partnerships, no pilots. This is a working prototype and a validated problem,
not a business with numbers.

### "How big is the market?"
We are only claiming what we can source. The Department of Census and
Statistics puts Sri Lanka's craft and related trades workforce at 1,105,729
people, 76.1% of them informal. That is the addressable supply side, and it is
a government figure. We have **not** sized the revenue opportunity and we are
not going to invent a TAM on stage.

---

## Questions that deserve "I don't know"

Have these ready. Answering them with a confident invention is the worst
outcome in the room.

- How many providers do you need in a suburb for the marketplace to work?
- What is your customer acquisition cost?
- What is the average job value in this market?
- What percentage of providers would pay for a premium tier?
- How long does NIC verification take at scale?
- What is your churn?

Template: *"We don't know that, and I'd rather tell you than guess. Here's how
we'd find out: ..."* Then give one concrete step.

---

## Where to point if a judge wants proof

| Claim | File |
|---|---|
| Trust score weights and bands | `server/domain.mjs` — `trustScore`, `trustBand` |
| Problem classification, confidence cap, disclaimers | `server/domain.mjs` — `analyse` |
| Match weighting and stated reasons | `server/domain.mjs` — `matchPros`, `matchFactors` |
| Those functions are unit-tested | `server/test.mjs`, `src/flow.test.ts`, `src/worker/data.test.ts` |
| 8% platform fee | `src/worker/data.ts` — `PLATFORM_FEE`, `quoteTotals` |
| Trust score drivers shown to the professional | `src/worker/data.ts` — `TRUST_FACTORS` |
| Verification documents and states | `src/worker/data.ts` — `DOCUMENTS` |
| Nine-stage customer case lifecycle | `src/flow.ts` — `STAGES`, `nextAction` |
| Escrow wording | `src/worker/data.ts` — `STAGES` ("Held by TrustCraft until done") |
| Every screen in the product | `src/gallery.tsx` — the UI documentation generator |
