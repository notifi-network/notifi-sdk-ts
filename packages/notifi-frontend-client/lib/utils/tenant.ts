import { CardConfigItemV1, TenantConfigMetadata } from '../models';

export const parseTenantConfig = (
  dataJson: string,
): TenantConfigMetadata | CardConfigItemV1 => {
  try {
    const parsed = JSON.parse(dataJson);
    if ('version' in parsed) {
      switch (parsed.version) {
        case 'v1':
          return parsed as CardConfigItemV1;
        case 'v2':
          return parsed as TenantConfigMetadata;
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
