# Nicotine Regulation App MVP — Product Requirements Document

**Version:** v1.0  
**Date:** April 9, 2026  
**Product stage:** MVP for validation and initial production path  
**Primary build audience:** Cursor + human developers  
**Authoring basis:** Derived from the Nicotine Regulation MVP Blueprint and product direction established for the nicotine regulation venture.

---

## 1. Purpose of this document

This PRD defines the **first buildable MVP** of the Nicotine Regulation app. It is intended to help a developer begin implementation in Cursor with enough clarity to:

- build the correct first version without overbuilding
- preserve a clean, understandable codebase for future contributors
- prioritize validation and behavioral usefulness over feature volume
- translate the current product thesis into a concrete app structure

This MVP should feel like the beginning of a serious long-term product, but it should remain intentionally lean.

---

## 2. Product summary

### Product concept
A premium mobile-first app for ambitious nicotine users that helps them reduce dependence by improving stress regulation, dismantling craving myths, and building discomfort tolerance.

### Core promise
**Reduce nicotine dependence by learning to regulate stress, tolerate discomfort, and perform without leaning on a crutch.**

### Product framing
This is **not** a generic quit app and **not** just a nicotine tracker.

This MVP should position the product as:
- a dependence-reduction system
- a stress-regulation tool
- a performance-compatible behavior change product

It should **not** position itself as:
- preachy recovery software
- a medical treatment product
- an all-or-nothing abstinence app

---

## 3. Strategic objective of the MVP

### Primary objective
Validate that users find enough value in **personalized onboarding insight + personal results + early structured behavior support** to engage with the app and continue into daily use.

### Secondary objectives
- prove that onboarding feels insightful rather than generic
- prove that users understand their nicotine pattern after assessment
- establish the core product language, structure, and architecture for future buildout
- create a credible foundation for later phases including logging, craving tools, rewiring content, and progress review

### What this MVP is trying to prove
1. Users resonate with the framing: stress regulation and discomfort tolerance, not just quitting.
2. Users complete a structured onboarding assessment if the promise is clear enough.
3. Personalized results feel valuable and specific.
4. The product experience feels premium, calm, professional, and credible.

---

## 4. Target user

### Primary early user
Ambitious men ages 22–35 who:
- regularly use Zyn, dip, vape, or nicotine pouches
- care about performance, discipline, health, and self-respect
- feel conflicted about their dependence
- do not necessarily want immediate total abstinence
- do want more control and less automatic use

### User mindset
This user:
- dislikes feeling reliant or weak
- wants systems and frameworks, not generic encouragement
- may rationalize nicotine as helping with focus, calm, or social ease
- is more motivated by self-mastery than fear messaging

---

## 5. MVP scope decision

## Version to build now
This MVP should support the following **core flow**:

1. User lands on a landing page
2. User chooses either:
   - **Take Assessment**
   - **Sign In**
3. New user completes onboarding assessment
4. System calculates profile + scoring outputs
5. User sees a personalized results screen
6. User is prompted to create an account if not already created before saving results
7. Signed-in user can return to see their saved results and basic home/dashboard shell

### Important product decision
For this version, the **most important shipped experience** is:
- landing page
- auth entry
- onboarding assessment
- scoring engine
- personalized results page
- basic saved user state

Everything else should be treated as **phase 2+ unless it is lightweight to scaffold cleanly now**.

---

## 6. In-scope vs out-of-scope

### In scope for MVP v1
- landing page
- sign up / sign in
- onboarding assessment flow
- onboarding response persistence
- scoring engine
- pattern classification
- personalized results page
- minimal authenticated home/dashboard shell
- analytics instrumentation for funnel tracking
- clean admin-configurable content structure for assessment copy and result copy

### Optional if low-effort and architecturally clean
- lightweight “Start your week 1 plan” block on results page
- basic settings screen
- basic profile screen
- placeholder dashboard cards for future modules

### Explicitly out of scope for MVP v1
- full daily logging system
- real-time craving intervention flow
- tactical lock / command mode
- notifications / push
- streaks
- social/community features
- chat/coaching layer
- weekly dashboard analytics
- subscriptions/paywall billing
- advanced personalization driven by ML/AI
- Apple Health / wearables / background sensing

This keeps the first shipped product focused on the core value hypothesis.

---

## 7. Product principles

The build should follow these principles:

1. **Insight before complexity**  
   The user should feel understood before they are asked to do ongoing behavior work.

2. **Lean foundation, not fake completeness**  
   Do not add dashboard widgets or features that simulate depth without user value.

3. **Interpretability over cleverness**  
   Scoring logic should be understandable and maintainable.

4. **Fast path to value**  
   The user should reach a meaningful result quickly.

5. **Premium calm UX**  
   Minimalist, direct, credible, supportive.

6. **Maintainable engineering**  
   Another developer should be able to understand the app structure without reverse-engineering product logic from scattered components.

---

## 8. User experience goals

The experience should feel:
- minimalist
- premium
- professional
- encouraging without being cheesy
- psychologically sharp
- clean enough to evolve into a long-term product

### Style direction
Use a visual tone closer to:
- quiet confidence
- calm control
- self-respect
- modern performance software

Avoid:
- “bro” clichés
- aggressive masculine tropes
- over-medical design
- cluttered dashboards
- startup gimmicks

### Copy tone
Copy should be:
- concise
- intelligent
- grounded
- supportive
- direct
- positive and encouraging

Example voice qualities:
- “You’re not broken. You’ve trained a response loop.”
- “This is a pattern you can understand and improve.”
- “The goal is understanding, not perfection.”
- "The goal is better stress regulation, more discomfort tolerance, and more control." 
- "Reduce nicotine dependence without losing your edge."

---

## 9. Core user flow

## 9.1 New user flow
1. User lands on marketing/landing page.
2. User taps **Take Assessment**.
3. User enters onboarding assessment.
4. User completes assessment.
5. App computes results locally or via backend service.
6. User sees personalized results screen.
7. User is prompted to create account to save results if account does not yet exist.
8. After account creation, results and onboarding profile are persisted.
9. User lands in authenticated basic home/dashboard.

## 9.2 Returning user flow
1. User lands on landing page or opens app.
2. User taps **Sign In**.
3. User signs in.
4. User is taken to home/dashboard.
5. User can access:
   - saved results
   - onboarding summary
   - week 1 focus

## 9.3 Edge case flow
If user signs in before taking assessment:
- if no onboarding exists, route them directly to onboarding
- if onboarding exists, route to home/dashboard

---

## 10. Screen requirements

## 10.1 Landing page

### Purpose
Introduce the product, establish resonance, and drive the user to assessment or sign in.

### Required elements
- brand/product name placeholder
- headline
- subheadline
- CTA 1: **Take Assessment**
- CTA 2: **Sign In**
- short explanation of what the app does
- 3–4 benefit bullets or tiles
- optional credibility section / who it is for
- footer with basic links: privacy, terms, support

### Recommended messaging direction
Headline direction examples:
- Reduce nicotine dependence without losing your edge.
- Train stress regulation. Loosen nicotine’s grip.
- Free apps help you count nicotine. This helps you need it less.

Subheadline direction:
A premium app for ambitious nicotine users who want more control, less automatic use, and tools that go beyond tracking.

### UX requirements
- mobile-first design
- very fast load
- no clutter
- hero CTA visible without excessive scrolling

---

## 10.2 Authentication

### Purpose
Allow new users to create accounts and returning users to access saved results.

### Required functionality
- sign up with email + password or magic link
- sign in
- forgot password
- sign out
- basic session persistence

### Product requirement
Auth should feel lightweight and not interrupt momentum more than necessary.

### Suggested flow decision
Allow users to complete the assessment first, then ask them to create an account before saving results. This reduces friction at the start of the funnel.

---

## 10.3 Onboarding assessment

### Purpose
Collect the minimum useful input needed to generate meaningful personalization.

### UX requirements
- clean multi-step flow
- one question group per screen or tightly grouped section
- visible progress indicator
- minimal friction
- clear language
- mobile-first controls
- completion time target: **3–5 minutes**

### Assessment sections and questions

#### Section 1: Utilization Metrics
1. **What form(s) of nicotine are you currently using?**  
   Multi-select: Pouch, Vape, Dip, Cigarette, Other

2. **On an average day, how many nicotine-use events occur?**  
   Single select: 1–2, 3–4, 5–7, 8–10, 11–15, 16+

3. **How long after waking do you reach for your first dose?**  
   Single select: Within 5 minutes, Within 15 minutes, Within 30 minutes, Within 1 hour, 1–2 hours, Beyond 2 hours, Rarely

#### Section 2: Environment & Trigger Mapping
4. **In which environments is the urge strongest?**  
   Multi-select: Work / Studying, Commuting / Driving, Social / Drinking, Post-meals, Transitions between tasks, Habitual Use / All the above

5. **Which internal state most frequently precedes an automatic reach?**  
   Single select: Stress / Anxiety, Boredom / Under-stimulation, Lack of Focus, Irritability

6. **Does nicotine feel necessary to navigate high-stakes social or professional interactions?**  
   Single select: No, Sometimes, Yes

#### Section 3: Cognitive & Identity Anchors
7. **Do you believe nicotine is a primary driver of your professional performance or focus?**  
   Single select: No, Somewhat, Yes

8. **What is your primary concern regarding reduced usage?**  
   Single select: Loss of focus, Brain fog, Irritability / social friction, Weight gain

9. **How much does being a nicotine user conflict with your self-image as a high performer?**  
   Slider: 1–10

#### Section 4: Historical Resilience
10. **How many times have you attempted to reduce or quit in the last 12 months?**  
    Single select: 0, 1, 2, 3+

11. **In past attempts, what was the primary cause of system crash?**  
    Single select: Extreme stress event, Social pressure, Boredom, Persistent cravings

#### Section 5: Mission Parameters
12. **What is your primary objective for this 14-day sprint?**  
    Single select: Total abstinence, 50% reduction, Pattern identification / awareness

### Functional requirements
- user can move forward/back through steps
- data is preserved during session if user goes back
- validation prevents incomplete required fields
- app stores draft progress locally during active session
- if signed in, progress may optionally autosave to backend

---

## 10.4 Scoring engine

### Purpose
Translate onboarding responses into understandable outputs that feel personalized and credible.

### Required outputs
- **Dependence Score** (0–100)
- **Craving Reactivity** (0–100 internal; display as Low / Medium / High)
- **Regulation Confidence** (0–100 internal; display as Low / Medium / High)
- **Primary Pattern Type**
- **Short explanation of what is likely driving use**
- **First win opportunity**
- **Week 1 focus**

### Product requirement
Scoring must be:
- simple
- explainable
- deterministic
- easy to tune by editing weights

### Recommended implementation approach
Use a rules-based scoring module rather than ML.

#### Suggested structure
- separate scoring config from UI
- define numerical weights in a dedicated config file
- define score buckets and labels in one place
- define pattern mapping in one place

### Example scoring logic direction

#### Dependence Score inputs
Weighted by:
- daily use frequency
- time to first nicotine use after waking
- frequency/intensity of trigger environments
- reliance in high-stakes situations
- repeated failed attempts

#### Craving Reactivity inputs
Weighted by:
- strongest urge environments
- emotional precursor
- belief in nicotine necessity
- social/professional dependence
- past crash reason

#### Regulation Confidence inputs
Weighted inversely by:
- self-image conflict
- repeated failed attempts
- stress-trigger reliance
- fear around reduced usage

Can also be positively influenced by:
- awareness-oriented goal selection
- lower perceived necessity
- longer time to first use

### Display mapping
- Low: 0–33
- Medium: 34–66
- High: 67–100

### Pattern type system
Initial pattern types:
- Stress Regulator
- Focus Protector
- Transition Soother
- Social Armor User
- Under-stimulation User
- Habitual User

### Pattern assignment recommendation
Assign primary pattern based on strongest weighted cluster from user responses.

Example:
- stress/anxiety + work + fast reach under pressure → Stress Regulator
- lack of focus + work/study + performance belief → Focus Protector
- transitions + commuting + habitual use → Transition Soother
- social/drinking + high-stakes interactions → Social Armor User
- boredom + under-stimulation → Under-stimulation User
- diffuse routine-heavy use without one strong driver → Habitual User

### Engineering requirement
Scoring engine should live in a dedicated domain layer, not inside page components.

Suggested module examples:
- `src/features/onboarding/scoring/config.ts`
- `src/features/onboarding/scoring/calculateScores.ts`
- `src/features/onboarding/scoring/patterns.ts`
- `src/features/onboarding/scoring/resultCopy.ts`

---

## 10.5 Personalized results screen

### Purpose
Deliver the immediate value moment.

This screen should make the user feel:
- understood
- accurately profiled
- hopeful
- clear on what to do next

### Required content blocks
1. **Your Pattern**
2. **Your Scores**
3. **What’s Really Driving Your Use**
4. **Your First Big Win Opportunity**
5. **Your Week 1 Focus**
6. **Disclaimer** — this is just an indication, not a medical diagnosis
7. **CTA** — create account

### Example data presentation
- Primary Pattern: Stress Regulator
- Dependence Score: 73
- Craving Reactivity: High
- Regulation Confidence: Low

### Example narrative direction
**What’s really happening**  
You are likely not reaching for nicotine because it truly makes you better. You are reaching for it because it has become a fast route out of stress, friction, and internal activation.

**Your first big win opportunity**  
Your earliest gains will likely come from interrupting automatic use during work-pressure windows rather than trying to overhaul everything at once.

**Your week 1 focus**  
- Notice every automatic reach  
- Identify your top trigger window  
- Aim to interrupt one reactive use per day

### UX requirements
- visually strong and premium
- easy to scan
- not overloaded with charts
- emotionally encouraging
- results should feel “worth taking a screenshot of”

### Functional requirements
- results are computed and displayed immediately after onboarding
- user can save results
- user can revisit results later when signed in

---

## 10.6 Home/dashboard shell

### Purpose
Provide a stable post-auth destination and foundation for future features without pretending phase 2 is already complete.

### MVP v1 requirement
This can be intentionally minimal.

### Required content
- greeting / welcome
- summary of primary pattern
- saved score summary
- week 1 focus card
- CTA to review results
- placeholder section for future tools, clearly labeled or omitted if not useful

### Recommendation
Do not force a fake “daily dashboard” if there is not yet enough ongoing value in v1. A simple “Your profile” home is acceptable.

---

## 11. Functional requirements

## 11.1 Landing and navigation
- user can open landing page without authentication
- user can navigate to assessment from landing page
- user can navigate to sign in from landing page
- returning signed-in users opening root route may be redirected to dashboard

## 11.2 Onboarding
- user can complete all onboarding questions
- system validates required responses
- system stores answers in a structured format
- system computes outputs based on answers

## 11.3 Authentication
- user can create account
- user can sign in
- user can sign out
- if results exist locally before auth, app can attach/save them after account creation

## 11.4 Results
- system displays scores and narrative outputs
- system persists onboarding profile and results for authenticated users
- user can revisit results later

## 11.5 Analytics
Track at minimum:
- landing page viewed
- take assessment clicked
- sign in clicked
- onboarding started
- onboarding section completed
- onboarding completed
- results viewed
- save results clicked
- account created after results
- signed in
- returned to dashboard

---

## 12. Non-functional requirements

### Performance
- pages should load quickly on mobile
- onboarding transitions should feel immediate
- score calculation should feel instant

### Reliability
- no loss of onboarding data during back navigation in-session
- graceful handling of refresh/state loss where practical

### Accessibility
- readable color contrast
- clear tap targets
- keyboard-accessible web version
- forms should use proper labels

### Privacy and compliance
- do not make unsupported medical claims
- include disclaimer that outputs are not medical diagnosis
- store user data securely
- include privacy policy and terms links

### Maintainability
- clean folder structure
- typed models/interfaces
- shared UI primitives
- product logic separated from presentation logic
- avoid deeply coupled page components

---

## 13. Technical recommendations

## 13.1 Suggested stack
- **Frontend:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS
- **Component primitives:** shadcn/ui or similarly clean component system
- **Backend / DB / Auth:** Supabase
- **Analytics:** PostHog
- **Form handling:** React Hook Form + Zod
- **State:** local component state + lightweight store only if needed

### Why this stack
This gives:
- fast MVP velocity
- clean production path
- typed data structures
- manageable developer onboarding later

---

## 13.2 Suggested app architecture

### High-level structure
```text
src/
  app/
    (marketing)/
    (auth)/
    (app)/
  components/
    ui/
    shared/
  features/
    landing/
    auth/
    onboarding/
      components/
      schema/
      scoring/
      content/
      utils/
    results/
    dashboard/
  lib/
    supabase/
    analytics/
    utils/
  types/
```

### Architectural principles
- route groups separated by product area
- onboarding domain isolated from dashboard domain
- scoring logic isolated from render components
- content copy separated from hardcoded JSX where practical

---

## 14. Data model requirements

## 14.1 Core entities

### User
- id
- email
- created_at
- updated_at

### OnboardingProfile
- id
- user_id
- nicotine_forms
- daily_use_range
- first_use_timing
- strong_urge_environments
- emotional_precursor
- high_stakes_reliance
- performance_belief
- reduction_concern
- self_image_conflict_score
- past_attempt_count
- past_attempt_failure_reason
- sprint_goal
- created_at
- updated_at

### AssessmentResult
- id
- user_id
- onboarding_profile_id
- dependence_score
- craving_reactivity_score
- craving_reactivity_label
- regulation_confidence_score
- regulation_confidence_label
- primary_pattern_type
- driver_summary
- first_win_summary
- week_one_focus
- scoring_version
- created_at

### AnalyticsEvent
Can be external via PostHog rather than first-class DB table.

---

## 15. Content system requirements

The app should not hardcode all copy directly into screen components.

### Recommended content separation
Store these in structured config/content files:
- landing page content
- onboarding question copy
- answer options
- result block templates
- pattern descriptions
- week 1 focus templates
- disclaimer copy

### Why
This makes it easier to:
- refine messaging from user research
- test copy changes
- let future developers edit product language without risky UI rewrites

---

## 16. Design requirements

### Visual style
- minimalist layout
- strong typography hierarchy
- restrained spacing
- subtle visual confidence
- dark or neutral palette acceptable
- avoid visual noise

### Suggested design approach
- 1–2 primary typefaces max
- cards with generous spacing
- no heavy illustrations required in v1
- subtle motion only where it improves perceived quality

### Desired emotional outcome
The user should feel:
- “This understands me.”
- “This feels premium.”
- “This is built for someone like me.”
- “This is calm and credible.”

---

## 17. Success metrics for MVP v1

### Funnel metrics
- landing page → assessment click-through rate
- onboarding start rate
- onboarding completion rate
- results view rate
- account creation rate after results

### Product quality metrics
- percentage of users who complete onboarding without drop-off in early screens
- average completion time
- qualitative feedback on whether results feel accurate and useful

### Directional targets
- 60%+ onboarding completion among users who start
- meaningful qualitative feedback that results feel specific, not generic
- early evidence that users would return for more support or daily tools

---

## 18. Risks and guardrails

### Risk: overbuilding too early
**Guardrail:** keep v1 centered on assessment, results, and clean persistence.

### Risk: results feel generic
**Guardrail:** invest disproportionate effort in scoring logic, copy quality, and result presentation.

### Risk: auth adds too much friction
**Guardrail:** let users start with assessment first and create account at save point.

### Risk: codebase becomes messy during rapid iteration
**Guardrail:** domain separation, typed models, and simple architecture from day one.

### Risk: product sounds clinical or preachy
**Guardrail:** enforce brand/copy principles in review.

---

## 19. Future phases after MVP v1

These should be planned for later, not built now unless there is strong evidence.

### Phase 2
- daily logging
- home dashboard with real utility
- week 1 action prompts

### Phase 3
- craving intervention flow
- tactical lock / command mode
- post-craving logging loop

### Phase 4
- myth/reframe content system
- weekly summaries
- notifications

### Phase 5
- premium program layer
- founder support workflows
- community/accountability elements

---

## 20. Build notes for Cursor

### What Cursor should optimize for
- clean implementation over flashy complexity
- reusable components over one-off page-specific code
- typed forms and schemas
- strong folder organization
- easy future extension into logging and craving tools

### What Cursor should avoid
- building every future feature stub now
- overabstracting too early
- burying product rules inside UI components
- adding unnecessary state libraries or backend services
- creating visually busy dashboards just to fill space

### Recommended implementation sequence
1. project setup and architecture
2. landing page
3. auth
4. onboarding schema + multi-step UI
5. scoring engine
6. results screen
7. save flow + persistence
8. minimal dashboard shell
9. analytics events
10. QA and polish

---

## 21. Acceptance criteria

The MVP is ready for internal use when:
- a new user can land on the product and understand the offer
- a new user can start and complete the onboarding assessment on mobile
- the app calculates and shows results without errors
- the results feel coherent, polished, and encouraging
- the user can create an account and save their results
- a returning user can sign in and see their saved profile/results
- the codebase is organized enough that another developer can continue building without confusion

---

## 22. Final product stance

This MVP should feel like **the first strong brick in a real product**, not a hacked-together prototype pretending to be complete.

The goal is not feature quantity.
The goal is to create a focused first experience that proves:
- the user resonates with the framing
- the assessment produces perceived value
- the product can grow on a clean foundation

That means the product should be **simple, credible, and sharp**.

