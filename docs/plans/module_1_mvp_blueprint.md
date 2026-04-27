# Module 1 MVP Blueprint — See the Loop Clearly

## What this document is

This is a stripped-down blueprint for the first module in the nicotine app’s guided path.

It is intentionally narrow.
It is meant to avoid scope creep.
It is meant to preserve the core product thesis.
It is meant to be easy to review, pressure-test, and implement.

---

## 1. Product essence

This product does **not** exist to become a giant course library.
It exists to help a user:

- stop misreading nicotine as helpful
- get through real craving and trigger moments
- build the identity of someone who no longer needs nicotine

The lesson path is only valuable if it improves those outcomes.

### Core principle

The lesson system is **not the product**.
The lesson system is a delivery mechanism that makes the product more useful.

### MVP rule

Every lesson, screen, and artifact should answer yes to at least one of these:

1. Does this reduce the perceived value of nicotine?
2. Does this help during a real craving or trigger moment?
3. Does this reinforce the user’s identity as someone who does not need nicotine?
4. Does this improve retention because it is genuinely useful?

If not, it is probably scope creep.

---

## 2. Why Module 1 exists

Module 1 should do one job only:

**Help the user see their nicotine pattern clearly enough that the rest of the app becomes more useful.**

That is it.

It should not try to:

- explain all addiction psychology
- deliver a full transformation
- feel like a course in itself
- collect too much data
- ask for long reflection
- create too many saved objects

The desired user reaction is simple:

**“Oh. I see the pattern now.”**

---

## 3. Module 1 promise

### Working title

**See the Loop Clearly**

### User-facing promise

Understand why the urge keeps coming back.

### Core insight

Nicotine often feels helpful because the effect is immediate.
But the effect is temporary, and often amounts to temporary relief from the last cycle.
Then the pattern tends to recreate the next urge.

This keeps the module aligned with the misconception-correction logic reflected in the Allen Carr material, while staying original in wording and presentation. The key ideas in that source are that nicotine’s benefits are largely illusory, the loop is psychological as much as chemical, fear sustains the habit, and identity shift matters. fileciteturn3file0

---

## 4. MVP success criteria

Module 1 is successful if the user:

- completes it in one sitting
- identifies a few common trigger moments
- sees nicotine as more of a loop and less of a solution
- finishes with one simple saved insight the app can use later
- is more likely to use Support afterward
- is naturally ready for Module 2

---

## 5. Scope guardrails for Module 1

### Include

- one clear mental reframe
- fast interaction
- light personalization
- one simple saved output
- one obvious handoff into the rest of the app

### Exclude for now

- deep journaling
- scores and diagnostics
- long educational explanations
- multiple artifacts
- heavy audio production requirements
- elaborate follow-up sequences
- too many analytics events

---

## 6. Module 1 structure

Module 1 MVP should have only four parts:

### Part 1 — Short lesson

Teach the loop in a few simple screens.

### Part 2 — Three quick inputs

Ask the user:

1. When do you use nicotine most?
2. What does it seem to do for you?
3. What usually happens later?

### Part 3 — One saved output

Generate a simple **Loop Map**.

### Part 4 — One practical handoff

Use the Loop Map inside Today and Support.

That is the entire module.

---

## 7. Recommended screen flow

### Screen 1 — Intro

**Title:** See the Loop Clearly\
**Subtitle:** Understand why the urge keeps coming back.\
**Body:** This is not about blame. It is about seeing the pattern clearly.

**CTA:** Start

---

### Screen 2 — The loop

**Title:** This is a loop, not a flaw\
**Body:** A moment happens. An urge shows up. Nicotine creates a temporary sense of relief by easing the tension left behind by the last cycle. Then later, the urge tends to return.

**Visual:** very simple interactive loop diagram

- trigger
- urge
- use
- temporary relief
- urge returns

**Visual note:** the return path from **use** back to **urge returns** should be visually distinct from the rest of the loop. Use a dashed line and slightly higher-contrast accent to show that the “solution” feeds the next urge. Avoid bright red or alarmist styling.

**CTA:** Next

---

### Screen 3 — Trigger moments

**Title:** When do you reach for it most?\
**Prompt:** Pick up to 3 moments that feel most familiar.

**Options:**

- stressed
- working
- bored
- driving
- after meals
- with coffee
- drinking
- social situations
- late at night
- other

**CTA:** Continue

---

### Screen 4 — Perceived benefit

**Title:** What does it seem to do for you?\
**Prompt:** In those moments, what does nicotine seem to help with?

**Options:**

- calms me down
- helps me focus
- gives me a break
- helps with boredom
- feels like a reward
- helps me feel normal
- gives me energy
- makes social moments easier
- other

**CTA:** Continue

---

### Screen 5 — What happens later

**Title:** What usually happens later?\
**Prompt:** After you use nicotine, what is usually true later on?

**Options:**

- I’m back where I started
- I’m already thinking about the next one
- the shift wears off quickly
- I feel briefly different, then normal again
- I barely notice the effect lasted
- I feel dependent on the routine
- I use more automatically than I want to
- other

**CTA:** Build my loop map

---

### Screen 6 — Loop Map

**Title:** Here is your loop\
**Layout direction:** present this as a simple, scan-friendly “mad-libs” style summary with the user’s selected inputs visually emphasized.

**Dynamic summary:**
When moments like **[trigger selection]** show up, nicotine seems to promise **[perceived benefit]**. Later, it often leads to **[later outcome]**.

**Supporting line:** That is a loop.

**Identity callout:** You’re starting to see the pattern for what it is. That is how someone who is getting free begins.

**Design note:** the identity line should feel like a subtle highlighted callout, not a certificate, badge, or achievement reward.

**CTA:** Save

---

### Screen 7 — Close

**Title:** You have your first insight\
**Body:** You do not need to solve everything today. Just notice the loop the next time it starts.

**Primary CTA:** I’m ready\
**Secondary CTA:** Return to Resources

---

## 8. Tone and UX requirements

### Tone

- calm
- clear
- non-shaming
- lightly insightful
- not preachy

### Important nuance

The Loop Map should feel like a **tool**, not a diagnosis.
It should help the user recognize a repeatable pattern they can interrupt.

The emotional tone should stay calm and clear even when the module introduces a sharper reframe. Avoid sudden “truth bomb” energy, over-dramatic color shifts, or anything that makes the experience feel accusatory.

### Avoid

- sounding clinical
- sounding argumentative
- making the user defend themselves
- language that implies failure or weakness

### Feel

The user should feel observed and understood, not corrected.

---

## 9. The only artifact: Loop Map

### Artifact name

Loop Map

### Purpose

Give the app one lightweight piece of personalized context it can use later.

### MVP fields

- `top_triggers` — up to 3 selections
- `perceived_benefit` — 1 primary selection
- `later_outcome` — 1 primary selection
- `completed_at` — timestamp

### Why this is enough

This is the minimum amount of personalization needed to make the app smarter afterward.
Anything more is likely too much for MVP.

---

## 10. Where the Loop Map should show up

### Today

Show a small “Current path” or “Your pattern” card.

Example:
**Your pattern:** In stress and work moments, nicotine tends to promise calm, but the urge usually returns later.

### Support

Use the Loop Map to frame real-time help.

Example:
**This may be one of your loop moments.**\
Nicotine often promises **[benefit]** here, but you said the urge usually returns later.

### Resources

Mark Module 1 complete and unlock Module 2.
Allow the user to re-open the Loop Map.

---

## 11. Why Module 1 matters to retention

Module 1 should not try to retain the user through content volume.
It should retain the user by making the rest of the app feel more personally relevant.

If Module 1 works, the user should think:

- this app gets my pattern
- the Support tab feels more relevant
- the next lesson feels worth taking

That is enough.

---

## 12. Build priority

If engineering/design time is limited, prioritize in this order:

1. Screen flow for the lesson
2. Loop Map generation
3. Today card using Loop Map
4. Support card using Loop Map
5. Unlock Module 2 in Resources

Everything else can wait.

---

## 13. Questions for review

Use these to review the module before build:

1. Is this lesson small enough for MVP?
2. Does it create a real mental shift without overexplaining?
3. Is the Loop Map the smallest useful artifact?
4. Will Today and Support feel more useful after completion?
5. Is any screen trying to do too much?
6. What can be removed without losing the core insight?

---

## 14. One-sentence summary

**Module 1 should help the user see nicotine as a repeating loop, save one lightweight personalized insight, and make the rest of the app more useful immediately.**

