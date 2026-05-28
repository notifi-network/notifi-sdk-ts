# Human Review Rubric - notifi-react-integration

Use this rubric when reviewing agent output from eval runs.

Score each dimension **Pass / Partial / Fail / Inconclusive** and add a short justification note.

- **Inconclusive**: Use when the eval prompt or fixture does not provide enough context to judge this dimension fairly (e.g., fixtureless evals for Provider Placement or Existing App Preservation). Never use Inconclusive as an excuse to skip evaluation — explain why the dimension cannot be scored.

## Dimensions

> Dimensions marked **[CRITICAL]** are mandatory for a passing overall score. A Fail on any critical dimension automatically yields an overall Fail regardless of other scores.

### 1. [CRITICAL] Path Selection

Did the agent pick the correct path for the prompt (full-page dapp example vs NotifiCardModal vs custom context vs SmartLink vs troubleshooting)?

- **Pass**: Correct path chosen, justified by the user's stated need.
- **Partial**: Correct path chosen but explanation is weak or missing.
- **Fail**: Wrong path chosen, or agent defaulted to a complex path when a simpler one was appropriate.
- **Inconclusive**: Prompt does not clearly indicate which path is correct.

### 2. [CRITICAL] Auth Mode

Did the agent correctly identify and wire the auth mode (on-chain vs off-chain)?

- **Pass**: Auth mode matches the app's wallet/auth stack. Signing callback is adapted from existing app code.
- **Partial**: Auth mode is correct but the signing adapter is generic or placeholder without explanation.
- **Fail**: Wrong auth mode, or agent confused on-chain and off-chain requirements.
- **Inconclusive**: Prompt does not specify auth context (only applies to fixtureless evals where auth mode cannot be inferred).

### 3. Provider Placement

Is `NotifiContextProvider` placed at the correct boundary in the app's component tree?

- **Pass**: Provider is placed near the existing wallet/auth boundary, inside the correct layout or route scope, and does not wrap the entire app unnecessarily.
- **Partial**: Provider is functional but placed at a suboptimal level (e.g. too high or too low in the tree).
- **Fail**: Provider is missing, placed outside the wallet context, or duplicated.
- **Inconclusive**: Fixtureless eval — no app component tree available to evaluate placement.

### 4. [CRITICAL] Required Params Handling

Did the agent correctly handle `tenantId`, `cardId`, `env`, and auth-specific params?

- **Pass**: All required params are present. When values are missing, the agent either asks the user before implementation or flags placeholders only when scaffolding is explicitly appropriate for the path.
- **Partial**: Params are present but some are silently hardcoded as fake values without flagging.
- **Fail**: Required params are missing or wrong, or agent invented plausible-looking but fake values.
- **Inconclusive**: N/A — this dimension always has enough context.

### 5. Existing App Or Example Baseline Preservation

Did the agent preserve the user's existing app structure or the prepared example-app baseline, conventions, and dependencies?

- **Pass**: Changes fit naturally into the existing file structure, import style, and framework patterns. No unnecessary new files or wrappers. For the full-page app path, the agent works in the prepared copy instead of mutating the SDK source tree in place.
- **Partial**: Changes work but introduce a new pattern that diverges from the app's conventions.
- **Fail**: Agent created an isolated demo wrapper, restructured the app, introduced conflicting dependencies, or modified the SDK source package in place instead of the prepared copy.
- **Inconclusive**: Fixtureless eval — no existing app to evaluate preservation.

### 6. [CRITICAL] Code Correctness

Is the generated code likely to compile and work?

- **Pass**: Imports are correct, hook usage follows React rules, types are compatible, and the integration would work with the real SDK. If the card is wrapped in a host-app modal shell, open, close, and reopen behavior remains functional.
- **Partial**: Minor issues (e.g. missing import, small type mismatch) but overall approach is sound, or the integration mostly works but has a lifecycle issue such as flaky reopen behavior.
- **Fail**: Fundamental errors (e.g. wrong hook, broken component tree, incorrect API usage), or the card opens once but fails on a normal reopen flow.
- **Inconclusive**: Agent provided explanation only without code (in fixtureless evals where code was not required).

### 7. Minimality

Did the agent produce the smallest correct integration without unnecessary extras?

- **Pass**: Only the code needed for the requested integration is added. No premature features, no unused contexts wired, no speculative error handling.
- **Partial**: Slightly over-engineered but nothing harmful.
- **Fail**: Agent added significant unnecessary code (e.g. full custom UI when card modal was requested, wallet target plugin when not needed).
- **Inconclusive**: Fixtureless eval, or insufficient detail in agent response to judge.

### 8. Entry Placement And Ambiguity Handling

Did the agent choose a natural `NotifiCardModal` entry surface and handle CTA placement ambiguity well?

- **Pass**: The agent identifies a reasonable existing header, top nav, or utility surface for the entry. If placement is ambiguous, it asks the user a focused question with concrete options instead of guessing.
- **Partial**: The chosen entry surface is workable but not very natural, or the agent defaults without asking even though multiple placements seem plausible.
- **Fail**: The agent ignores an obvious existing navigation or utility surface, invents an unrelated entry pattern, or fails to address clear placement ambiguity.
- **Inconclusive**: Eval does not involve NotifiCardModal (e.g., custom context or SmartLink evals).

## Overall Scoring Rules

1. **Fail** if any [CRITICAL] dimension is scored Fail.
2. **Fail** if 3+ dimensions are scored Fail (including non-critical).
3. **Pass** if all [CRITICAL] dimensions are Pass, and at most 2 non-critical dimensions are Partial.
4. **Partial** if 1 critical dimension is Partial (no critical Fail), or 3+ non-critical dimensions are Partial, but fewer than 3 dimensions are Fail.
5. **Inconclusive** as an overall score is reserved for cases where more than 3 dimensions are Inconclusive (typically fixtureless evals). Mark "N/A — fixtureless eval" in the overall notes.

## Scoring Summary

| Dimension                              | Score | Notes |
| -------------------------------------- | ----- | ----- |
| Path Selection [CRITICAL]              |       |       |
| Auth Mode [CRITICAL]                   |       |       |
| Provider Placement                     |       |       |
| Required Params Handling [CRITICAL]    |       |       |
| Existing App Preservation              |       |       |
| Code Correctness [CRITICAL]            |       |       |
| Minimality                             |       |       |
| Entry Placement And Ambiguity Handling |       |       |

**Overall**: Pass / Partial / Fail / Inconclusive

**Reviewer notes**:
