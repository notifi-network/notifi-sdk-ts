# Human Review Rubric - notifi-react-integration

Use this rubric when reviewing agent output from eval runs.

Score each dimension **Pass / Partial / Fail** and add a short justification note.

## Dimensions

### 1. Path Selection

Did the agent pick the correct integration path (NotifiCardModal vs custom context vs SmartLink) for the prompt?

- **Pass**: Correct path chosen, justified by the user's stated need.
- **Partial**: Correct path chosen but explanation is weak or missing.
- **Fail**: Wrong path chosen, or agent defaulted to a complex path when a simpler one was appropriate.

### 2. Auth Mode

Did the agent correctly identify and wire the auth mode (on-chain vs off-chain)?

- **Pass**: Auth mode matches the app's wallet/auth stack. Signing callback is adapted from existing app code.
- **Partial**: Auth mode is correct but the signing adapter is generic or placeholder without explanation.
- **Fail**: Wrong auth mode, or agent confused on-chain and off-chain requirements.

### 3. Provider Placement

Is `NotifiContextProvider` placed at the correct boundary in the app's component tree?

- **Pass**: Provider is placed near the existing wallet/auth boundary, inside the correct layout or route scope, and does not wrap the entire app unnecessarily.
- **Partial**: Provider is functional but placed at a suboptimal level (e.g. too high or too low in the tree).
- **Fail**: Provider is missing, placed outside the wallet context, or duplicated.

### 4. Required Params Handling

Did the agent correctly handle `tenantId`, `cardId`, `env`, and auth-specific params?

- **Pass**: All required params are present. Missing values are flagged as placeholders with clear instructions for the user to fill them in.
- **Partial**: Params are present but some are silently hardcoded as fake values without flagging.
- **Fail**: Required params are missing or wrong, or agent invented plausible-looking but fake values.

### 5. Existing App Preservation

Did the agent preserve the user's existing app structure, conventions, and dependencies?

- **Pass**: Changes fit naturally into the existing file structure, import style, and framework patterns. No unnecessary new files or wrappers.
- **Partial**: Changes work but introduce a new pattern that diverges from the app's conventions.
- **Fail**: Agent created an isolated demo wrapper, restructured the app, or introduced conflicting dependencies.

### 6. Code Correctness

Is the generated code likely to compile and work?

- **Pass**: Imports are correct, hook usage follows React rules, types are compatible, and the integration would work with the real SDK.
- **Partial**: Minor issues (e.g. missing import, small type mismatch) but overall approach is sound.
- **Fail**: Fundamental errors (e.g. wrong hook, broken component tree, incorrect API usage).

### 7. Minimality

Did the agent produce the smallest correct integration without unnecessary extras?

- **Pass**: Only the code needed for the requested integration is added. No premature features, no unused contexts wired, no speculative error handling.
- **Partial**: Slightly over-engineered but nothing harmful.
- **Fail**: Agent added significant unnecessary code (e.g. full custom UI when card modal was requested, wallet target plugin when not needed).

## Scoring Summary

| Dimension                 | Score | Notes |
| ------------------------- | ----- | ----- |
| Path Selection            |       |       |
| Auth Mode                 |       |       |
| Provider Placement        |       |       |
| Required Params Handling  |       |       |
| Existing App Preservation |       |       |
| Code Correctness          |       |       |
| Minimality                |       |       |

**Overall**: Pass / Partial / Fail

**Reviewer notes**:
