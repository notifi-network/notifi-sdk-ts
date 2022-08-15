export const webhookTargetFragment = `
fragment webhookTargetFragment on WebhookTarget {
  id
  url
  status
  format
  headers {
    key
    value
  }
  id
  name
}
`.trim();

export const webhookTargetFragmentDependencies = [];
