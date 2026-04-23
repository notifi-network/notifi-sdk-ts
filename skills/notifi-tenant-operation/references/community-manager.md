# Community Manager Topics

Use this reference when the topic appears to be Community Manager-like.

## What Community Manager Means Here

Community Manager topics often use destination-specific payload sections such as:

- `Platform`
- `Email`
- `Discord`
- `Telegram`
- `Sms`

This is a common pattern, not a universal Notifi payload format.

## Common Community Manager Shape

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  },
  "Email": {
    "subject": "Alert",
    "message__markdown": "**Something happened.**"
  }
}
```

## Common Variants

### Basic

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  }
}
```

### Markdown

```json
{
  "Platform": {
    "subject": "Large transfer detected",
    "message__markdown": "**Alert:** transfer exceeds threshold."
  }
}
```

### Multi-destination

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  },
  "Email": {
    "subject": "Alert",
    "message__markdown": "**Something happened.**"
  },
  "Telegram": {
    "message": "Something happened."
  }
}
```

## Important Clarification

Do not assume all topics use:

- `Platform`
- `Email`
- `Discord`
- `Telegram`
- `Sms`

Community Manager is only one topic family.

## Additional Topic-Specific Fields

Some Community Manager topics may require additional topic-specific fields such as `campaignId`.

Do not treat `campaignId` as a universal Notifi field.

If the target topic appears to be Community Manager-like and the required fields are not explicit in metadata or config, ask the user before publishing.
