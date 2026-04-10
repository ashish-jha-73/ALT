# ALTG - Adaptive Learning Tutor

ALTG is an adaptive math tutor that combines learner modeling, BKT-style knowledge tracking, and a policy-based question selector.

## What Was Hardened (Progression + Practice)

The progression system has been made harder so learners solve more problems before unlocking concepts.

### Current unlock requirements
A concept now unlocks as soon as mastery reaches threshold:

- Mastery >= 0.65

Stricter practice gates are still configurable (attempts/correct/accuracy/level), but are currently bypassed by `unlockOnMasteryOnly = true`.

Additionally:

- Only one active incomplete concept is unlocked at a time (`singleActiveConcept = true`)
- Session target is 10 questions
- Diagnostic start is now conservative: learners begin with one active unlocked concept (`expressions_foundation`) and get readiness boosts instead of multiple early unlocks

This directly addresses cases where concepts were completing/unlocking too quickly.

---

## RL / Algorithm Audit

## Short verdict
Your implementation is coherent and useful, but it is **not a full RL training loop** yet.

It is best described as a **contextual adaptive policy with heuristic scoring** (bandit-like action selection), plus probabilistic learner-state updates.

That is a valid and practical architecture for an educational product, and a strong foundation.

## Active algorithm pipeline

### 1) Policy selection
- File: `backend/src/services/adaptiveEngineService.js`
- Builds an action space over:
  - difficulty (`easy`, `medium`, `hard`)
  - question type
  - hint mode
  - explanation depth
- Scores each candidate action with handcrafted utility terms based on current learner state and picks best action.

This is deterministic argmax over a scoring function (not learned Q-values).

### 2) Question selection policy
- File: `backend/src/services/questionSelectionService.js`
- Filters candidates by concept, difficulty, skill, type constraints, and history.
- Applies weighted sampling to improve diversity and avoid repeating same type.
- Mission logic prioritizes sequential progression concept.

### 3) Learner state transition
- File: `backend/src/services/learnerModelService.js`
- Updates:
  - concept mastery
  - skill mastery
  - confidence model
  - cognitive load/fatigue
  - behavior profile
  - streaks and evaluation matrix
- Maintains per-concept attempts/correct counters for unlock gating.

### 4) Knowledge update model (BKT)
- File: `backend/src/services/bktService.js`

For prior mastery $P(L_{t-1})$, slip $s$, guess $g$, transition $T$:

If correct:
$$
P(L_t|correct)=\frac{P(L_{t-1})(1-s)}{P(L_{t-1})(1-s)+(1-P(L_{t-1}))g}
$$

If wrong:
$$
P(L_t|wrong)=\frac{P(L_{t-1})s}{P(L_{t-1})s+(1-P(L_{t-1}))(1-g)}
$$

Then learning transition:
$$
P(L_t)=P(L_t|obs) + (1-P(L_t|obs))\cdot T
$$

Current implementation also blends in attempt/hint behavior from
`backend/src/services/masteryService.js` and applies per-attempt smoothing in
`backend/src/services/learnerModelService.js`:

$$
P_{behavior}=\text{clamp}(P_{prev}+\Delta_{attempts,hints})
$$

$$
P_{blend}=(1-w)\cdot P_{BKT}+w\cdot P_{behavior}
$$

$$
\Delta_{base}=\text{clip}(P_{blend}-P_{prev},-d,d)
$$

$$
\Delta_{smooth}=\Delta_{base}\cdot s
$$

$$
\Delta_{ctx}=\text{clip}(\Delta_{smooth}\cdot W_{ctx},-d\cdot s\cdot b,d\cdot s\cdot b)
$$

$$
P_{next}=\text{clamp}(P_{prev}+\Delta_{ctx})
$$

Where:
- $w$ is behavior blend weight
- $d$ is max mastery delta per attempt
- $s$ is smoothing factor
- $W_{ctx}$ is contextual weight from difficulty, time performance, and confidence calibration
- $b$ is small contextual boost cap

Current smoothing-oriented parameters are configured in `backend/src/utils/constants.js` via
`MASTERY_UPDATE_RULES`:

- `transition = 0.10`
- `behaviorBlendWeight = 0.28`
- `maxDeltaPerAttempt = 0.12`
- `smoothingFactor = 0.94`
- contextual weights include difficulty gain/loss, fast/slow time adjustment, and calibrated-confidence bonus

### 5) Reward and scoring
- File: `backend/src/services/scoringService.js`
- Reward combines learning gain, cognitive load, and repeated-error penalty.
- XP is separate gamification reward and can be optimized independently.

### 6) End-to-end orchestration
- File: `backend/src/services/learningService.js`
- Validates answer correctness
- Computes reward/XP
- Persists attempt
- Saves learner model updates

## Is the RL "correct"?

### What is correct
- Closed-loop adaptation exists (state -> action -> outcome -> state update)
- Action space and reward are internally consistent
- Learner model signals are reasonably integrated
- Policy avoids simplistic random/ad-hoc selection

### What is missing for full RL
- No learned policy/value parameters (no Q-table/NN/actor-critic)
- No temporal-difference update (Q-learning/SARSA/etc.)
- No explicit exploration strategy like epsilon-greedy/Thompson over learned uncertainty
- No off-policy evaluation or regret tracking

So the implementation is **algorithmically sound as adaptive policy control**, but **not yet a trained RL agent**.

---

## Why multiple concepts unlocked earlier

The previous behavior came from:

- Fast BKT growth after a few correct answers
- Low mastery threshold (0.7)
- Completion based mostly on mastery threshold
- Unlocking all prerequisite-ready concepts
- Diagnostic pre-unlocking multiple concepts for higher levels

The new rules now require sustained evidence (attempts, correct count, accuracy, level), and unlock concepts in a stricter step-wise flow.

---

## Suggested improvements (next roadmap)

### 1) Upgrade to contextual bandit learning
Replace fixed action scoring weights with learned weights (e.g., LinUCB or Thompson Sampling).

### 2) Learn reward weights from data
Current reward coefficients are handcrafted. Fit them from outcomes to maximize long-term mastery and retention.

### 3) Concept-specific BKT calibration
Estimate slip/guess/transition per concept (or per skill), not global constants.

### 4) Delayed outcome optimization
Add delayed rewards (concept completion, retention checks) so short-term correctness is not over-optimized.

### 5) Add exploration control
Use controlled exploration so policy does not over-commit too early to one strategy.

### 6) Run policy diagnostics
Track:
- unlock time distribution
- concept-wise regret/proxy regret
- retry and skip trends
- confidence calibration drift

### 7) Remove/merge legacy path
`backend/src/services/adaptationService.js` is currently not used in live flow and can be removed or merged to reduce maintenance overhead.

---

## Key config points

- Unlock rules: `backend/src/utils/constants.js`
- Unlock implementation: `backend/src/services/learnerModelService.js`
- Diagnostic entry policy: `backend/src/controllers/diagnosticController.js`
- Session length: `frontend/src/App.jsx`

