# TrustCraft — 5-Minute Prototype Demo Script

Runs **immediately** after slide 20. No re-introduction, no "so as you saw".
You already told them you would show them how it works — just show them.

**Limit: 5:00 · Target: 4:30 · Margin: 30 s**

---

## Before you start

- Prototype already running and visible. Do **not** launch it on stage.
- Role switch set to **Customer**. The prototype boots into the professional
  app, so switch it before you walk on.
- The problem box should be **empty**. Clear it during setup so you can type
  live. (`pnpm dev`, then clear the textarea.)
- Screen mirroring confirmed. Phone frame fully visible, not cropped.
- Browser zoom at a level where the judges at the back can read the trust score.

**One scenario, start to finish.** Do not browse. Do not show settings. Do not
show every category. The deck already sold the idea; this proves it.

---

## The run

### 1 · Home — 0:20 *(cumulative 0:20)*

> This is the customer's home screen. One box: tell us your problem.

Point at the four inputs under the box — Photo, Video, Voice, Location.

> Four ways in. No category grid, because at this moment you don't know the
> category.

### 2 · Describe it — 0:35 *(0:55)*

Type live, at normal speed. Let them watch the characters appear:

```
My kitchen sink is leaking underneath when I turn on the tap.
```

> That's how a person actually says it. No trade name, no service code.

Tap **Continue**.

### 3 · The request — 0:35 *(1:30)*

> This is everything the professional will receive: the problem in the
> customer's own words, the location, the photo, the video, and the voice note.

Point at the media row and the waveform.

> One description, captured once, in whatever form was easiest.

Tap **Analyze with AI**.

### 4 · Understanding — 0:30 *(2:00)*

Let the four steps run. Narrate over them — do not stop talking.

> It reads the problem, uses the submitted media, works out the service
> category, and then looks for professionals who actually do *that*.

**[If it advances before you finish, keep going. Don't wait for the screen.]**

### 5 · The shortlist — 0:35 *(2:35)*

> Three professionals. Not forty. Each with a match percentage, a rating,
> distance, years, and the inspection fee up front.

Point at the 94% on the first card.

> And the ordering is visible, so it can be argued with. That matters — an
> opaque ranking is just another thing to distrust.

### 6 · The trust surface — 0:50 *(3:25)*

Tap **View Profile** on Kasun Perera. Scroll slowly.

> Trust Score 94 out of 100 — and this is the point, it isn't a star average.

Scroll through the evidence as you speak:

> Verified. Eight years. 412 works completed. 2.4 km away. Inspection fee 1,500
> rupees, stated before you commit. Availability today.

Keep scrolling to the reviews.

> And reviews attached to jobs the platform tracked end to end.
>
> This is the screen the whole product exists for — the moment someone decides
> whether to let a stranger into their home.

### 7 · Commit — 0:35 *(4:00)*

Tap **Select**.

> Professional selected. The request, the location, the timestamp — and from
> here it's a tracked case, not a phone call that may or may not happen.

**[If you are past 4:15 here, skip step 8 and go straight to the close.]**

### 8 · The other side — 0:25 *(4:25)*

Switch the role toggle to **Professional**, then open the service request.

> And this is what the professional receives. The customer's own words, our
> read of the problem — and, importantly, a line that says it's a suggestion
> only, because their on-site judgement decides the job.

### 9 · Close — 0:10 *(4:35)*

> Describe it. Find them. Trust the choice. Happy to take questions.

**Stop. Hands off the keyboard.**

---

## Timing sheet

| Step | What | Time | Cumulative |
|---|---|---|---|
| 1 | Home + the four inputs | 0:20 | 0:20 |
| 2 | Type the problem live | 0:35 | 0:55 |
| 3 | Problem definition + media | 0:35 | 1:30 |
| 4 | Understanding runs | 0:30 | 2:00 |
| 5 | Ranked shortlist | 0:35 | 2:35 |
| 6 | **Trust surface (the peak)** | 0:50 | 3:25 |
| 7 | Select + confirmation | 0:35 | 4:00 |
| 8 | Professional side *(droppable)* | 0:25 | 4:25 |
| 9 | Close | 0:10 | **4:35** |

Step 6 is the one that wins. If you are running long, take time from steps 1,
3 and 8 — never from 6.

---

## Do not demo

- Settings, account editing, notifications
- Every service category
- The earnings screen or the analytics tab *(save it for Q&A — it's a great
  answer to "why would a provider pay?", but a bad use of demo minutes)*
- Messages and chat, unless a judge asks
- The full nine-stage case lifecycle — mention it exists, don't walk it

## If something breaks

- **Nothing responds:** reload the page. State state resets to the seeded demo
  data, which is exactly where you want to be. Say "one second" once, not
  repeatedly.
- **Analysis screen hangs:** it is a fixed four-step sequence; it will finish.
  Keep narrating.
- **You lose the app entirely:** the deck's slide 10 clips show steps 2–5.
  Switch back and talk over them. Do not spend more than 15 seconds recovering.

## Questions you will get *during* the demo

Answer in one sentence and keep moving. Full answers live in
`TrustCraft_Judge_QA.md`.

- *"Is that AI real?"* — The classification is a deterministic, inspectable
  engine in this build, and we can show the rules. It is deliberately not a
  black box.
- *"Where does the trust score come from?"* — Weighted verified evidence:
  identity, qualification, relevant work, reliability, satisfaction, disputes.
  The weights are in the repo.
- *"Are those real professionals?"* — No. This is seeded demo data, and we are
  not going to pretend otherwise.
