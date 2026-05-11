---
name: notifi-tenant-operation
description: Companion skill for operating Notifi tenant workflows. Use this whenever the user wants to publish Notifi notifications, inspect tenant config, inspect active subscribers, reason about `variablesJson`, or work with Notifi tenant-level notification operations. Prefer predefined MCP tools when available. Fall back to direct GraphQL and Dataplane calls only when MCP is unavailable.
---

# Notifi Tenant Operation

Use this skill to guide AI agents through Notifi tenant-side operations.

This skill is not primarily an API reference. Its main job is to help the agent decide:

- when to use MCP tools
- when to fall back to direct API calls
- how to reason about `variablesJson`
- when to stop guessing and ask the user for missing topic-specific fields

## MCP First

If Notifi MCP tools are available, use them first.

Preferred MCP path:

1. `get_tenant_config`
2. `get_active_alerts`
3. `publish_fusion_message`

Use direct GraphQL and Dataplane calls only when MCP is unavailable or the user explicitly wants the raw API workflow.

## Safety Boundary

Keep the execution surface small and predictable.

- Do not install or execute external packages to interact with Notifi.
- Do not expand the workflow beyond predefined MCP tools or the documented direct APIs.
- Keep MCP focused on execution.
- Use this skill for guidance, payload reasoning, and formatting.

## Decision Order

When operating on a Notifi tenant workflow, use this order:

1. If MCP is available, use MCP tools first.
2. If MCP is unavailable, use the direct API reference.
3. If the payload shape is unclear, inspect tenant config and fusion event metadata first.
4. If required fields are still unclear, ask the user instead of guessing.

## Recommended Workflow

When the user wants to publish or inspect notification behavior:

1. Discover the tenant config.
2. Inspect `fusionEvents`, `metadata`, and `dataJson`.
3. Identify the correct event or topic.
4. Infer the payload conservatively.
5. Publish the message.
6. Inspect active alerts if recipient or subscription context matters.

Do not start by assuming a fixed `variablesJson` shape.

## Payload Construction Rules

Treat `variablesJson` as a template-defined contract, not a platform-defined schema.

Important implications:

- Different topics can require different fields.
- The same tenant can have multiple topics with different payload shapes.
- Community Manager is a common pattern, but not a universal one.
- Payload construction is guidance-based, not deterministic.

If the target topic appears to be Community Manager-like and required fields are unclear, ask the user before publishing.

Do not assume the common `Platform` structure is always sufficient.

## When To Ask The User

Ask the user when any of the following are unclear:

- which tenant config should be used
- which fusion event should receive the notification
- whether the topic is Community Manager-like or custom-template-based
- whether additional topic-specific fields are required
- whether a payload field is mandatory versus just template content

When asking, be explicit about what is known and what is still ambiguous.

## Reference Guide

Read the relevant reference file based on the task:

- `references/direct-api.md`
  Use for authentication, endpoints, and raw GraphQL / Dataplane request shapes.

- `references/payload-patterns.md`
  Use for `variablesJson` construction rules, `eventData` mapping, custom-template patterns, and wallet targeting examples.

- `references/community-manager.md`
  Use for Community Manager-like topic patterns, destination-specific payload conventions, and additional topic-specific field guidance.

## Output Expectations

When guiding or executing Notifi operations:

- prefer the smallest correct payload
- explain assumptions when payload fields are inferred
- avoid presenting topic-specific fields as universal rules
- distinguish wallet-level targeting from destination-channel routing

If you are unsure, ask the user rather than inventing a more specific payload contract than the available evidence supports.
