export function urlBase64ToUint8Array(base64String: string) {
  // NOTE: only available in browser or browser-like environments
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function uint8ArrayToBase64Url(uint8Array: Uint8Array) {
  // NOTE: only available in browser or browser-like environments
  return self.btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
}

export function parseJsonString<T>(input: {
  jsonString: string;
  validator: (data: unknown) => data is T;
}): T | undefined {
  try {
    const parsed = JSON.parse(input.jsonString);
    if (input.validator(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse JSON:', e);
  }
  return undefined;
}
