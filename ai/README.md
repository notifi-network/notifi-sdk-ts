# Notifi AI Skills

This `ai/` directory contains portable Notifi-focused skills for developers who want to use them with their own local agents.

Each skill is versioned alongside the SDK so the guidance stays close to the real Notifi implementation patterns in this repo. The main thing you will copy out is the skill directory itself: `SKILL.md` plus any supporting files that the skill references.

This repo also includes optional eval definitions, fixture metadata, and a local prepare runner for teams that want to validate a skill before adopting it.

## What This Directory Provides

- reusable Notifi skills packaged as `SKILL.md`-based directories
- supporting reference files for skills that need more than one document
- optional fixture-backed eval assets for pre-adoption validation
- a local `skill-eval:prepare` workflow for preparing repeatable test repos

## Available Skills

| Skill | Use for | Runtime assets to copy | Optional companions |
| --- | --- | --- | --- |
| `notifi-react-integration` | Integrating `@notifi-network/notifi-react` into React or Next.js apps, including `NotifiContextProvider`, `NotifiCardModal`, custom context UI, auth branching, `inputs`, SmartLink, and troubleshooting | `ai/skills/notifi-react-integration/SKILL.md` | `ai/skills/notifi-react-integration/evals/`, `ai/eval-fixtures/notifi-react-integration/`, `ai/tools/skill-eval/prepare.js` |
| `notifi-tenant-operation` | Tenant-side notification workflows such as tenant config discovery, active alert inspection, `variablesJson` reasoning, and publish operations | `ai/skills/notifi-tenant-operation/SKILL.md` and `ai/skills/notifi-tenant-operation/references/` | `ai/skills/notifi-tenant-operation/evals/`, [`packages/notifi-mcp/README.md`](../packages/notifi-mcp/README.md) and `@notifi-network/notifi-mcp` |

If you want the simplest portable bundle, copy the full skill directory under `ai/skills/<skill-name>/`. That preserves any relative file references the skill may rely on.

## Quick Start

1. Pick the skill that matches your Notifi task.
2. Copy the full skill directory from `ai/skills/<skill-name>/` into your local agent's skill or plugin location.
3. If the skill references sibling files, keep the directory structure intact.
4. Reload your local agent if it does not hot-reload skills.
5. Invoke the skill directly or let your agent auto-select it based on the skill description.

Small Claude Code example:

```bash
mkdir -p ~/.claude/skills
cp -R /absolute/path/to/notifi-sdk-ts/ai/skills/notifi-react-integration ~/.claude/skills/
```

If your local agent uses a different skill or plugin path, adapt only the destination. The source material in this repo stays the same.

## Use With Your Local Agent

These skills are written in the common `SKILL.md` style used by Claude Code and other agent ecosystems that support portable prompt-based skills.

Practical guidance:

- treat `SKILL.md` as the entrypoint
- keep referenced supporting files next to it
- keep the directory name aligned with the skill name when your agent uses folder-based discovery
- copy only versioned assets from `ai/skills/` unless you explicitly want the optional eval workflow

Some agent systems support raw skill directories directly. Others wrap the same content inside a plugin or extension format. In both cases, this repo is intended to be the source tree you copy from.

## Portable Assets vs Repo-Only Assets

| Path | Purpose | Take it with you? |
| --- | --- | --- |
| `ai/skills/<skill-name>/SKILL.md` | Main skill instructions | Yes |
| `ai/skills/<skill-name>/references/**` | Supporting reference material used by the skill | Yes, if the skill references it |
| `ai/skills/<skill-name>/evals/**` | Optional eval prompts and rubric | Optional |
| `ai/eval-fixtures/**` | Fixture metadata for repo-local validation | Optional |
| `ai/tools/skill-eval/prepare.js` | Repo-local prepare runner for fixture-based validation | Optional |
| `ai/.workspaces/**` | Generated fixtures and run artifacts | No |

`ai/.workspaces/` is the canonical generated-workspace path in this repo. The top-level `.ai-workspaces/` ignore rules remain only for legacy compatibility and are not part of the main workflow.

## Companion MCP Tooling

`notifi-tenant-operation` is designed to pair well with the local-first MCP server in this repo.

Use the skill when your agent needs workflow guidance about:

- which Notifi operation to run
- when to prefer MCP over direct API calls
- how to reason about `variablesJson`
- when to stop guessing and ask for topic-specific fields

Use [`@notifi-network/notifi-mcp`](../packages/notifi-mcp/README.md) when your local agent also needs an execution surface for:

- `get_tenant_config`
- `get_active_alerts`
- `publish_fusion_message`

The skill and the MCP server are complementary: the skill provides guidance and decision logic, while the MCP server provides executable tools.

## Optional: Validate a Skill Before Adoption

If you want to validate a skill before copying it into your own setup, this repo includes a local eval workflow.

Current fixture-backed example:

- skill: `notifi-react-integration`
- eval: `1`
- fixture metadata: [`ai/eval-fixtures/notifi-react-integration/explorer/fixture.json`](eval-fixtures/notifi-react-integration/explorer/fixture.json)
- source of truth for the downstream repo and pinned commit: the fixture metadata file above

### Prepare a local eval run

From the repo root:

```bash
npm install
npm run skill-eval:prepare -- --skill notifi-react-integration --eval 1 --install
```

The current fixture uses `pnpm install` as its setup command, so you will also need `pnpm` available locally when using `--install`.

### What the prepare runner creates

The prepare runner reads the eval definition, resolves the fixture metadata, clones or updates the downstream repo, checks out the pinned commit, and creates a run directory with:

- `run.json`
- `prompt.txt`
- `review-template.md`

Generated paths look like:

```text
ai/.workspaces/notifi-react-integration/
  fixtures/
  runs/
```

### Recommended validation flow

1. Run the prepare command.
2. Open the generated `prompt.txt`.
3. Start a fresh agent session against the prepared fixture repo.
4. Let the tester validate the integration in the target app while the work is happening.
5. Use the generated review template and the skill rubric if written review notes are helpful.

This workflow is intentionally tester-driven. The goal is to validate whether the skill produces good results in a realistic codebase, not to force every run artifact into version control.

## Validation Model

This repo versions the reusable inputs to evaluation and leaves final grading to human testing.

- skills, supporting files, eval definitions, fixture metadata, and the prepare runner are versioned
- validation is manual and tester-driven
- `skill-eval:prepare` prepares environments but does not orchestrate agent sessions
- there is no persistent in-repo benchmark registry yet
- saving `final_response`, `transcript`, `diff`, or `timing` artifacts is optional rather than required for completion

## For Maintainers

### Directory layout

```text
ai/
  README.md
  .workspaces/
  skills/
  eval-fixtures/
  tools/
```

- `.workspaces/`: generated fixtures and per-run local artifacts
- `skills/`: versioned skill definitions and skill-local supporting files
- `eval-fixtures/`: fixture metadata used by optional eval workflows
- `tools/`: repo-local scripts that support skill validation

### Versioned vs generated files

Versioned files that belong in git:

- `ai/skills/**`
- `ai/eval-fixtures/**`
- `ai/tools/**`

Generated files that should stay local:

- `ai/.workspaces/**`
- cloned downstream fixture repositories
- run-specific prompt and review artifacts

### Add a new skill

At minimum, create:

```text
ai/skills/<skill-name>/SKILL.md
```

Add supporting files next to `SKILL.md` whenever the skill needs references, examples, templates, or scripts.

If the skill should also support repo-local validation, add:

```text
ai/skills/<skill-name>/evals/evals.json
ai/skills/<skill-name>/evals/rubric.md
```

Then update the consumer-facing sections of this README so users can discover the new skill quickly.

### Add a new fixture

Store fixture metadata under:

```text
ai/eval-fixtures/<skill-name>/<fixture-id>/fixture.json
```

Each fixture should define at least:

- source repository URL
- pinned commit
- setup commands
- app or repo context
- notes about what successful output should look like

Prefer `repo + pinned commit` metadata over vendoring a full downstream application into this repository.
