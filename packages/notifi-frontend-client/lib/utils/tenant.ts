import { CardConfigItemV1, CardConfigItemV2 } from '../models';

export const parseTenantConfig = (
  dataJson: string,
): CardConfigItemV2 | CardConfigItemV1 => {
  try {
    const parsed = JSON.parse(dataJson);
    if ('version' in parsed) {
      switch (parsed.version) {
        case 'v1':
          return parsed as CardConfigItemV1;
        case 'v2':
          return parsed as CardConfigItemV2;
      }
      throw new Error(`Unsupported tenant config version: ${parsed.version}`);
    }
    throw new Error(
      `Unsupported tenant config payload - expect 'version' field: ${dataJson}`,
    );
  } catch (e) {
    throw new Error(`Failed to parse tenant config: ${e}`);
  }
};
